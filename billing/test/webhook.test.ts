// #KS-TRACE: B1-ADVERSARIAL-HANDLER | requirement (Keystone Stage 3): break the
// handler, not just exercise it. Covers idempotency, ordering, malformed
// input, unresolvable accounts, and the full Stripe status table.

import test from "node:test";
import assert from "node:assert/strict";
import {
  createBillingModule,
  InMemoryEntitlementStore,
  mapStripeSubscriptionStatus,
} from "../src/index.js";
import * as F from "./fixtures.js";

function makeModule() {
  const store = new InMemoryEntitlementStore();
  const mod = createBillingModule({
    store,
    webhookSecret: F.SECRET,
    checkout: {
      apiKey: "sk_test_dummy",
      priceMap: { TIER_A: "price_test_a", TIER_B: "price_test_b" },
      successUrl: "https://fixprove.dev/s",
      cancelUrl: "https://fixprove.dev/c",
    },
  });
  return { store, mod };
}

test("replayed delivery is applied exactly once (idempotency by event id)", async () => {
  const { store, mod } = makeModule();
  const payload = F.envelope("customer.subscription.created", F.subscription("active"), {
    id: "evt_replay_me",
  });
  const header = F.sign(payload);

  const first = await mod.handleWebhook({ payload, signatureHeader: header }, F.T0);
  assert.equal(first.action, "subscription_active");

  // Same bytes, same signature, still inside the 300s window: the signature
  // check CANNOT stop this. Only the event-id ledger can.
  const second = await mod.handleWebhook({ payload, signatureHeader: header }, F.T0 + 5);
  assert.deepEqual([second.ok, second.status, second.action], [true, 200, "duplicate_ignored"]);
  assert.equal((await store.get(F.ACCOUNT))?.lastEventCreated, F.T0);
});

test("a replay CANNOT resurrect a cancelled subscription", async () => {
  const { mod } = makeModule();
  const activate = F.envelope("customer.subscription.created", F.subscription("active"), {
    id: "evt_activate",
    created: F.T0,
  });
  await mod.handleWebhook({ payload: activate, signatureHeader: F.sign(activate, F.T0) }, F.T0);

  const cancel = F.envelope("customer.subscription.deleted", F.subscription("canceled"), {
    id: "evt_cancel",
    created: F.T0 + 10,
  });
  await mod.handleWebhook({ payload: cancel, signatureHeader: F.sign(cancel, F.T0 + 10) }, F.T0 + 10);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false);

  // An attacker (or Stripe's own retry) re-delivers the old activation.
  // Blocked twice over: duplicate event id AND the out-of-order guard.
  const r = await mod.handleWebhook(
    { payload: activate, signatureHeader: F.sign(activate, F.T0) },
    F.T0 + 12,
  );
  assert.equal(r.action, "duplicate_ignored");
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "must stay revoked");
});

test("stale out-of-order event is ignored (fresh id, older created)", async () => {
  const { mod } = makeModule();
  const cancel = F.envelope("customer.subscription.deleted", F.subscription("canceled"), {
    id: "evt_a",
    created: F.T0 + 100,
  });
  await mod.handleWebhook({ payload: cancel, signatureHeader: F.sign(cancel, F.T0 + 100) }, F.T0 + 100);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false);

  // An UPDATE that happened BEFORE the cancel, delivered after it. Distinct
  // event id, so idempotency does not catch it -- only the ordering guard does.
  const stale = F.envelope("customer.subscription.updated", F.subscription("active"), {
    id: "evt_b",
    created: F.T0 + 50,
  });
  const r = await mod.handleWebhook(
    { payload: stale, signatureHeader: F.sign(stale, F.T0 + 50) },
    F.T0 + 101,
  );
  assert.equal(r.action, "stale_event_ignored");
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "a late-arriving old event must not re-entitle");
});

test("malformed JSON is a 400, after signature verification", async () => {
  const { mod } = makeModule();
  const payload = "{not json at all";
  const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
  assert.deepEqual([r.ok, r.status, r.error], [false, 400, "malformed_json"]);
});

test("a signed but structurally-empty envelope is a 400, not a crash", async () => {
  const { mod } = makeModule();
  for (const payload of ["{}", '{"id":"evt_x"}', '{"id":"evt_x","type":"a"}', "[]", "null"]) {
    const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
    assert.equal(r.ok, false, `should reject: ${payload}`);
    assert.equal(r.status, 400);
  }
});

test("unresolvable account is reported, not guessed, and not retried forever", async () => {
  const { store, mod } = makeModule();
  // #KS-TRACE: B1-DEFECT-3-FIX | this test now explicitly requests the
  // legacy_flat shape (no metadata anywhere, a bare subscription id the
  // store has never indexed) to keep testing the genuine "cannot resolve at
  // all" case. A CURRENT-shape invoice carries its subscription's metadata
  // directly (see the "resolves via parent.subscription_details" test
  // below) and is no longer unresolvable, on purpose -- that was the bug.
  const payload = F.envelope(
    "invoice.payment_succeeded",
    F.invoice("subscription_cycle", { shape: "legacy_flat" }),
  );
  const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
  assert.deepEqual([r.ok, r.status, r.action], [true, 200, "account_unresolved"]);
  assert.equal(await store.get(F.ACCOUNT), undefined, "must not fabricate a record");
});

test("resolves an invoice via the newer parent.subscription_details shape (Defect 3 regression)", async () => {
  // #KS-TRACE: B1-DEFECT-3-FIX | built from the LITERAL real payload Yehor's
  // live test-mode purchase produced (2026-08-04) -- not a guess at the
  // shape. Deliberately no prior store entry for F.ACCOUNT, to prove
  // resolution works standalone from the invoice's own carried metadata,
  // not merely as a fallback after a subscription.created event.
  const { store, mod } = makeModule();
  assert.equal(await store.get(F.ACCOUNT), undefined, "starts with no record, on purpose");

  const payload = F.envelope("invoice.payment_succeeded", F.invoice("subscription_create"));
  const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
  assert.deepEqual([r.ok, r.status, r.action], [true, 200, "invoice_paid"]);

  const e = await store.get(F.ACCOUNT);
  assert.equal(e?.status, "active", "must resolve and activate from the invoice's own metadata");
  assert.equal(e?.stripeSubscriptionId, F.SUB_ID, "must also capture the subscription id for later events");
});

test("the legacy_flat invoice shape still resolves via subscription-id reverse lookup (defense in depth)", async () => {
  // Proves the OLDER shape (a flat top-level `subscription` field, no
  // metadata anywhere on the invoice) still works via the reverse-lookup
  // fallback, for any future Stripe API version or edge case that omits the
  // newer parent.subscription_details structure.
  const { store, mod } = makeModule();
  await store.put({
    accountId: F.ACCOUNT,
    tier: "TIER_A",
    status: "active",
    stripeCustomerId: F.CUS_ID,
    stripeSubscriptionId: F.SUB_ID,
    currentPeriodEnd: F.T0,
    lastEventCreated: F.T0,
    pastDueSince: null,
    updatedAt: F.T0,
  });
  const payload = F.envelope(
    "invoice.payment_succeeded",
    F.invoice("subscription_cycle", { shape: "legacy_flat", periodEnd: F.T0 + 5_184_000 }),
  );
  const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0 + 1);
  assert.equal(r.action, "renewal_paid");
  assert.equal((await store.get(F.ACCOUNT))?.currentPeriodEnd, F.T0 + 5_184_000);
});

test("an unhandled event type is acknowledged with 200, never a retry-inducing error", async () => {
  const { mod } = makeModule();
  const payload = F.envelope("customer.updated", { id: "cus_x", object: "customer" });
  const r = await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
  assert.deepEqual([r.ok, r.status, r.action], [true, 200, "ignored_event_type"]);
});

test("a forged tier in metadata cannot select an untiered entitlement", async () => {
  const { store, mod } = makeModule();
  const payload = F.envelope(
    "customer.subscription.created",
    F.subscription("active", { tier: "TIER_UNLIMITED_FREE" }),
  );
  await mod.handleWebhook({ payload, signatureHeader: F.sign(payload) }, F.T0);
  // Unknown tier strings are dropped, not stored. (Only reachable if the
  // signing secret leaked -- but fail-closed anyway.)
  assert.equal((await store.get(F.ACCOUNT))?.tier, null);
});

test("the full Stripe subscription status table maps as documented", () => {
  assert.equal(mapStripeSubscriptionStatus("active"), "active");
  assert.equal(mapStripeSubscriptionStatus("trialing"), "active");
  assert.equal(mapStripeSubscriptionStatus("past_due"), "past_due");
  assert.equal(mapStripeSubscriptionStatus("unpaid"), "past_due");
  assert.equal(mapStripeSubscriptionStatus("canceled"), "canceled");
  assert.equal(mapStripeSubscriptionStatus("incomplete_expired"), "canceled");
  assert.equal(mapStripeSubscriptionStatus("incomplete"), "none");
  assert.equal(mapStripeSubscriptionStatus("paused"), "none");
  // Fail-closed on anything Stripe adds later.
  assert.equal(mapStripeSubscriptionStatus("some_future_status"), "none");
  assert.equal(mapStripeSubscriptionStatus(""), "none");
});

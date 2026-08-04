// #KS-TRACE: B1-SIX-SCENARIOS | requirement: SESSION-PLAN-TO-R1.md B1 done-check
// -- "CI passes all six scenarios; a test purchase flips a test org to paid via
// webhook, a cancellation flips it back -- both verified in logs."
// The six named scenarios are: success, decline, auth/3DS, cancellation,
// renewal, failed renewal. Each is driven end-to-end through the REAL signature
// verification and the REAL handler; nothing is stubbed except the store.
// | Each test below names its scenario number.

import test from "node:test";
import assert from "node:assert/strict";
import { createBillingModule, InMemoryEntitlementStore, isPaidCheckEnabled } from "../src/index.js";
import * as F from "./fixtures.js";

function makeModule() {
  const store = new InMemoryEntitlementStore();
  const mod = createBillingModule({
    store,
    webhookSecret: F.SECRET,
    checkout: {
      apiKey: "sk_test_dummy_key_for_tests",
      priceMap: { TIER_A: "price_test_a", TIER_B: "price_test_b" },
      successUrl: "https://fixprove.dev/billing/success",
      cancelUrl: "https://fixprove.dev/billing/cancel",
    },
  });
  return { store, mod };
}

async function deliver(
  mod: ReturnType<typeof makeModule>["mod"],
  type: string,
  object: Record<string, unknown>,
  opts: { created?: number; now?: number } = {},
) {
  const payload = F.envelope(type, object, { created: opts.created });
  const created = opts.created ?? F.T0;
  return await mod.handleWebhook(
    { payload, signatureHeader: F.sign(payload, created) },
    opts.now ?? created,
  );
}

test("scenario 1 -- SUCCESS: a paid checkout + active subscription turns the paid check ON", async () => {
  const { store, mod } = makeModule();
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "must start disabled");

  const r1 = await deliver(mod, "checkout.session.completed", F.checkoutSession());
  assert.deepEqual([r1.ok, r1.status, r1.action], [true, 200, "checkout_completed_active"]);

  const r2 = await deliver(mod, "customer.subscription.created", F.subscription("active"), {
    created: F.T0 + 1,
  });
  assert.deepEqual([r2.ok, r2.action], [true, "subscription_active"]);

  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), true, "paid check must now be ON");
  const e = await store.get(F.ACCOUNT);
  assert.equal(e?.tier, "TIER_A");
  assert.equal(e?.stripeSubscriptionId, F.SUB_ID);
  assert.equal(e?.stripeCustomerId, F.CUS_ID);
  assert.equal(e?.currentPeriodEnd, F.T0 + 2_592_000);
});

test("scenario 2 -- DECLINE: a first-charge failure never turns the paid check on", async () => {
  const { mod } = makeModule();
  // A declined card leaves the subscription `incomplete`; Stripe then fires
  // invoice.payment_failed for the initial invoice.
  const r1 = await deliver(mod, "customer.subscription.created", F.subscription("incomplete"));
  assert.deepEqual([r1.ok, r1.action], [true, "subscription_none"]);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false);

  const r2 = await deliver(mod, "invoice.payment_failed", F.invoice("subscription_create"), {
    created: F.T0 + 1,
  });
  assert.deepEqual([r2.ok, r2.action], [true, "payment_failed_past_due"]);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "a decline must never entitle");
});

test("scenario 3 -- AUTH/3DS: checkout completes unpaid, entitlement waits for authorisation", async () => {
  const { store, mod } = makeModule();
  const r1 = await deliver(mod, "checkout.session.completed", F.checkoutSession({ paymentStatus: "unpaid" }));
  assert.deepEqual([r1.ok, r1.action], [true, "checkout_completed_awaiting_payment"]);
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT),
    false,
    "session completed != payment authorised -- this is the free-subscription bug",
  );
  // The account/subscription link IS recorded even while unentitled, so the
  // later authorisation event can be attributed.
  assert.equal((await store.get(F.ACCOUNT))?.stripeSubscriptionId, F.SUB_ID);

  // Bank authorises -> subscription flips to active.
  const r2 = await deliver(mod, "customer.subscription.updated", F.subscription("active"), {
    created: F.T0 + 60,
  });
  assert.equal(r2.action, "subscription_active");
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), true);
});

test("scenario 4 -- CANCELLATION: deleting the subscription turns the paid check back OFF", async () => {
  const { mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("active"));
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), true);

  const r = await deliver(mod, "customer.subscription.deleted", F.subscription("canceled"), {
    created: F.T0 + 100,
  });
  assert.deepEqual([r.ok, r.action], [true, "subscription_canceled"]);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "cancellation must revoke");
});

test("scenario 5 -- RENEWAL: a successful cycle invoice keeps it on and extends the period", async () => {
  const { store, mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("active"));
  const before = (await store.get(F.ACCOUNT))!.currentPeriodEnd!;

  // Renewal invoices carry no fixprove metadata -- resolution must go through
  // the reverse subscription-id lookup.
  const r = await deliver(mod, "invoice.payment_succeeded", F.invoice("subscription_cycle"), {
    created: F.T0 + 2_592_001,
  });
  assert.deepEqual([r.ok, r.action], [true, "renewal_paid"]);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), true);
  const after = (await store.get(F.ACCOUNT))!.currentPeriodEnd!;
  assert.ok(after > before, `period must extend: ${after} > ${before}`);
});

test("scenario 6 -- FAILED RENEWAL: a failed cycle invoice keeps the check ON during grace, then OFF", async () => {
  const { mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("active"));
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT, F.T0), true);

  const failedAt = F.T0 + 2_592_001;
  const r = await deliver(mod, "invoice.payment_failed", F.invoice("subscription_cycle"), {
    created: failedAt,
  });
  assert.deepEqual([r.ok, r.action], [true, "payment_failed_past_due"]);

  // #KS-TRACE: B1-GRACE-PERIOD | requirement (Yehor, 2026-08-04): a lapsed
  // PAYING customer keeps service for DEFAULT_GRACE_SECONDS (3 days) from the
  // moment of first failure -- this is the behaviour that replaced the
  // original immediate-revocation design.
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt),
    true,
    "the instant a renewal fails, a previously-paying customer is still in grace",
  );

  // And recovery works: the customer updates their card, Stripe retries.
  const r2 = await deliver(mod, "invoice.payment_succeeded", F.invoice("subscription_cycle"), {
    created: F.T0 + 2_592_500,
  });
  assert.equal(r2.action, "renewal_paid");
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT, F.T0 + 2_592_500), true, "recovery must re-entitle");
});

// #KS-TRACE: B1-GRACE-PERIOD | requirement (Yehor, 2026-08-04, overturning
// the session's original fail-immediately design): "add a 3-day grace period
// ... add a test for both sides of the boundary (day 2 = enabled, day 4 =
// disabled)". This block is that test, plus the two adjacent invariants that
// make the grace window safe rather than a blanket 3-day free-ride: it must
// not apply to a first-time decline (scenario 2 already covers that), and
// repeated retries of the SAME lapse must not restart the clock.
test("GRACE PERIOD -- day 2 still enabled, day 4 disabled, clock does not restart on retries", async () => {
  const { store, mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("active"));

  const failedAt = F.T0 + 2_592_001;
  await deliver(mod, "invoice.payment_failed", F.invoice("subscription_cycle"), { created: failedAt });
  assert.equal((await store.get(F.ACCOUNT))?.pastDueSince, failedAt);

  const DAY = 24 * 60 * 60;
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt + 2 * DAY),
    true,
    "day 2 of 3: still inside the grace window",
  );
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt + 4 * DAY),
    false,
    "day 4 of 3: grace has expired, fail-closed",
  );
  // Exactly at the boundary: the window is a strict "<", so the boundary
  // instant itself is already expired -- no off-by-one ambiguity left to a
  // future reader.
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt + 3 * DAY), false, "exact 3-day boundary is expired");
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt + 3 * DAY - 1), true, "one second before the boundary is still enabled");

  // Stripe retries and fails again (a second invoice.payment_failed for the
  // SAME lapse, common with Smart Retries). The clock must NOT restart --
  // otherwise three retries spread over two weeks would mean the customer
  // never actually loses access.
  const secondFailure = failedAt + 1 * DAY;
  await deliver(mod, "invoice.payment_failed", F.invoice("subscription_cycle"), { created: secondFailure });
  assert.equal(
    (await store.get(F.ACCOUNT))?.pastDueSince,
    failedAt,
    "a repeat failure of the SAME lapse must not push the grace clock forward",
  );
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt + 4 * DAY),
    false,
    "still expired at day 4, counted from the ORIGINAL failure, not the retry",
  );
});

test("GRACE PERIOD does not apply to a first-time decline (never previously active)", async () => {
  const { store, mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("incomplete"));
  const failedAt = F.T0 + 1;
  await deliver(mod, "invoice.payment_failed", F.invoice("subscription_create"), { created: failedAt });

  assert.equal((await store.get(F.ACCOUNT))?.pastDueSince, null, "no grace clock for a customer who never paid");
  assert.equal(
    await mod.isPaidCheckEnabled(F.ACCOUNT, failedAt),
    false,
    "zero grace for a first-time decline, even one second after the failure",
  );
});

test("GRACE PERIOD is cleared by cancellation -- a cancelled-then-past_due account gets no leftover grace", async () => {
  const { store, mod } = makeModule();
  await deliver(mod, "customer.subscription.created", F.subscription("active"));
  await deliver(mod, "customer.subscription.deleted", F.subscription("canceled"), { created: F.T0 + 10 });
  assert.equal((await store.get(F.ACCOUNT))?.pastDueSince, null);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT, F.T0 + 10), false);
});

test("the entitlement gate is fail-closed for an unknown account", async () => {
  const { mod } = makeModule();
  assert.equal(await mod.isPaidCheckEnabled("never-heard-of-this-org"), false);
  assert.equal(isPaidCheckEnabled(undefined), false);
});

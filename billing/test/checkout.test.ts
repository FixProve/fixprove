// #KS-TRACE: B1-CHECKOUT-TESTS | requirement: prove (a) the test-mode key
// boundary is enforced in code, (b) the account binding survives onto later
// subscription events, (c) no pricing amount is ever constructed here.

import test from "node:test";
import assert from "node:assert/strict";
import {
  assertTestModeKey,
  buildCheckoutSessionParams,
  createCheckoutSession,
  createBillingModule,
  InMemoryEntitlementStore,
  LiveKeyRefusedError,
} from "../src/index.js";

const CFG = {
  priceMap: { TIER_A: "price_test_a", TIER_B: "price_test_b" } as const,
  successUrl: "https://fixprove.dev/billing/success",
  cancelUrl: "https://fixprove.dev/billing/cancel",
};

test("refuses a LIVE key -- the hard boundary is a runtime invariant, not just a rule", () => {
  assert.throws(() => assertTestModeKey("sk_live_abc123"), LiveKeyRefusedError);
  assert.throws(() => assertTestModeKey("rk_live_abc123"), LiveKeyRefusedError);
});

test("refuses an empty, whitespace, or garbled key (fail-closed)", () => {
  for (const k of ["", "   ", "sk_", "SK_TEST_upper", "pk_test_publishable", "not-a-key"]) {
    assert.throws(() => assertTestModeKey(k), LiveKeyRefusedError, `should refuse: ${JSON.stringify(k)}`);
  }
});

test("accepts test-mode secret and restricted keys", () => {
  assert.doesNotThrow(() => assertTestModeKey("sk_test_abc"));
  assert.doesNotThrow(() => assertTestModeKey("rk_test_abc"));
});

test("createBillingModule refuses a live key at CONSTRUCTION, not at first payment", () => {
  assert.throws(
    () =>
      createBillingModule({
        store: new InMemoryEntitlementStore(),
        webhookSecret: "whsec_x",
        checkout: { apiKey: "sk_live_oops", ...CFG },
      }),
    LiveKeyRefusedError,
  );
});

test("binds the account id on all three carriers", () => {
  const p = buildCheckoutSessionParams(CFG, { accountId: "gh-acme", tier: "TIER_A" });
  assert.equal(p.get("client_reference_id"), "gh-acme");
  assert.equal(p.get("metadata[fixprove_account_id]"), "gh-acme");
  // The one that matters months later, on renewal/cancel events:
  assert.equal(p.get("subscription_data[metadata][fixprove_account_id]"), "gh-acme");
  assert.equal(p.get("subscription_data[metadata][fixprove_tier]"), "TIER_A");
});

test("builds a subscription-mode session against the configured opaque price id", () => {
  const p = buildCheckoutSessionParams(CFG, { accountId: "gh-acme", tier: "TIER_B" });
  assert.equal(p.get("mode"), "subscription");
  assert.equal(p.get("line_items[0][price]"), "price_test_b");
  assert.equal(p.get("line_items[0][quantity]"), "1");
  assert.equal(p.get("success_url"), CFG.successUrl);
});

test("no price AMOUNT, currency, or interval is ever constructed client-side", () => {
  const p = buildCheckoutSessionParams(CFG, { accountId: "gh-acme", tier: "TIER_A" });
  const serialised = p.toString();
  for (const forbidden of ["unit_amount", "currency", "recurring", "amount"]) {
    assert.ok(!serialised.includes(forbidden), `must not send ${forbidden}: ${serialised}`);
  }
});

test("rejects an unknown tier and a missing account id", () => {
  // @ts-expect-error -- deliberately passing an invalid tier at runtime
  assert.throws(() => buildCheckoutSessionParams(CFG, { accountId: "a", tier: "TIER_Z" }), /unknown_tier/);
  assert.throws(() => buildCheckoutSessionParams(CFG, { accountId: "", tier: "TIER_A" }), /missing_account_id/);
});

test("rejects a tier with no configured price id", () => {
  const bad = { ...CFG, priceMap: { TIER_A: "price_test_a", TIER_B: "" } as const };
  assert.throws(
    () => buildCheckoutSessionParams(bad, { accountId: "a", tier: "TIER_B" }),
    /no_price_id_configured_for_tier/,
  );
});

test("createCheckoutSession posts form-encoded to /v1/checkout/sessions and returns the url", async () => {
  let seen: { url?: string; init?: RequestInit } = {};
  const fakeFetch = (async (url: string, init: RequestInit) => {
    seen = { url, init };
    return new Response(JSON.stringify({ id: "cs_test_1", url: "https://checkout.stripe.com/x" }), {
      status: 200,
    });
  }) as unknown as typeof fetch;

  const out = await createCheckoutSession(
    { apiKey: "sk_test_k", fetchImpl: fakeFetch, apiBase: "https://api.stripe.test", ...CFG },
    { accountId: "gh-acme", tier: "TIER_A", idempotencyKey: "idem-1" },
  );
  assert.deepEqual(out, { id: "cs_test_1", url: "https://checkout.stripe.com/x" });
  assert.equal(seen.url, "https://api.stripe.test/v1/checkout/sessions");
  const headers = seen.init!.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer sk_test_k");
  assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(headers["Idempotency-Key"], "idem-1");
});

test("surfaces a Stripe API error instead of returning a half-built session", async () => {
  const fakeFetch = (async () =>
    new Response(JSON.stringify({ error: { message: "No such price" } }), { status: 400 })) as unknown as typeof fetch;
  await assert.rejects(
    createCheckoutSession({ apiKey: "sk_test_k", fetchImpl: fakeFetch, ...CFG }, { accountId: "a", tier: "TIER_A" }),
    /stripe_checkout_failed: 400/,
  );
});

test("rejects a 200 response that is missing id or url", async () => {
  const fakeFetch = (async () => new Response(JSON.stringify({ id: "cs_1" }), { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    createCheckoutSession({ apiKey: "sk_test_k", fetchImpl: fakeFetch, ...CFG }, { accountId: "a", tier: "TIER_A" }),
    /missing_id_or_url/,
  );
});

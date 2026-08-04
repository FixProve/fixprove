// #KS-TRACE: B1-ADVERSARIAL-SIGNATURE | requirement (Keystone Stage 3, and
// STRIPE-SETUP-CHECKLIST.md sec.3's named adversarial criterion): "a spoofed
// webhook must NOT grant entitlement". These tests actively attack the
// verifier rather than confirming the happy path.

import test from "node:test";
import assert from "node:assert/strict";
import { verifyStripeSignature, computeSignature } from "../src/signature.js";
import { createBillingModule, InMemoryEntitlementStore } from "../src/index.js";
import * as F from "./fixtures.js";

const PAYLOAD = '{"id":"evt_1","type":"customer.subscription.updated","created":1800000000}';

function v(overrides: Partial<Parameters<typeof verifyStripeSignature>[0]>) {
  return verifyStripeSignature({
    payload: PAYLOAD,
    header: F.sign(PAYLOAD),
    secret: F.SECRET,
    nowSeconds: F.T0,
    ...overrides,
  });
}

test("accepts a correctly signed payload", () => {
  assert.deepEqual(v({}), { ok: true });
});

test("rejects a missing signature header", () => {
  assert.deepEqual(v({ header: null }), { ok: false, reason: "missing_signature_header" });
  assert.deepEqual(v({ header: "" }), { ok: false, reason: "missing_signature_header" });
});

test("rejects a header with no timestamp", () => {
  const sig = computeSignature(PAYLOAD, F.SECRET, F.T0);
  assert.deepEqual(v({ header: `v1=${sig}` }), { ok: false, reason: "malformed_signature_header" });
});

test("rejects a non-integer timestamp rather than coercing it", () => {
  // parseInt("1800000000abc") === 1800000000 would silently pass. It must not.
  const sig = computeSignature(PAYLOAD, F.SECRET, F.T0);
  assert.deepEqual(
    v({ header: `t=${F.T0}abc,v1=${sig}` }),
    { ok: false, reason: "malformed_signature_header" },
  );
});

test("rejects a header with a timestamp but no v1 signature", () => {
  assert.deepEqual(v({ header: `t=${F.T0},v0=deadbeef` }), { ok: false, reason: "no_v1_signature" });
});

test("rejects a signature computed with the wrong secret -- THE spoof case", () => {
  const forged = `t=${F.T0},v1=${computeSignature(PAYLOAD, "whsec_attacker_guess", F.T0)}`;
  assert.deepEqual(v({ header: forged }), { ok: false, reason: "signature_mismatch" });
});

test("rejects a valid signature reused over a TAMPERED payload", () => {
  const header = F.sign(PAYLOAD);
  const tampered = PAYLOAD.replace("evt_1", "evt_2");
  assert.deepEqual(
    verifyStripeSignature({ payload: tampered, header, secret: F.SECRET, nowSeconds: F.T0 }),
    { ok: false, reason: "signature_mismatch" },
  );
});

test("rejects a replay outside the tolerance window, in BOTH directions", () => {
  assert.deepEqual(v({ nowSeconds: F.T0 + 301 }), { ok: false, reason: "timestamp_outside_tolerance" });
  assert.deepEqual(v({ nowSeconds: F.T0 - 301 }), { ok: false, reason: "timestamp_outside_tolerance" });
  assert.deepEqual(v({ nowSeconds: F.T0 + 299 }), { ok: true });
});

test("rejects garbage in the v1 slot without throwing", () => {
  assert.deepEqual(v({ header: `t=${F.T0},v1=not-hex-at-all` }), { ok: false, reason: "signature_mismatch" });
  assert.deepEqual(v({ header: `t=${F.T0},v1=` }), { ok: false, reason: "no_v1_signature" });
});

test("accepts either signature during a secret rotation (multiple v1 values)", () => {
  const old = computeSignature(PAYLOAD, "whsec_old_secret", F.T0);
  const cur = computeSignature(PAYLOAD, F.SECRET, F.T0);
  assert.deepEqual(v({ header: `t=${F.T0},v1=${old},v1=${cur}` }), { ok: true });
});

test("refuses to verify when no signing secret is configured", () => {
  assert.deepEqual(v({ secret: "" }), { ok: false, reason: "no_signing_secret_configured" });
});

test("END-TO-END: a spoofed webhook does NOT grant entitlement", async () => {
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
  const payload = F.envelope("customer.subscription.created", F.subscription("active"));
  const forged = `t=${F.T0},v1=${computeSignature(payload, "whsec_attacker", F.T0)}`;

  const r = await mod.handleWebhook({ payload, signatureHeader: forged }, F.T0);
  assert.deepEqual([r.ok, r.status, r.error], [false, 400, "signature_mismatch"]);
  assert.equal(await mod.isPaidCheckEnabled(F.ACCOUNT), false, "SPOOF MUST NOT ENTITLE");
  assert.equal(await store.get(F.ACCOUNT), undefined, "no record may be written at all");
});

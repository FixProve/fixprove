// #KS-TRACE: B1-FIXTURES | requirement: the six B1 scenarios must be testable
// offline, with no Stripe account and no network. These builders produce
// Stripe-shaped Event envelopes and sign them with the real HMAC scheme, so
// the tests exercise the genuine verification path rather than bypassing it.
// assumption: the object shapes below follow Stripe's documented API objects.
// They are hand-built, NOT captured from a live account -- so a divergence
// between these fixtures and Stripe's real payloads is the single biggest
// residual risk in this package, and is exactly what Yehor's one live
// test-card run (BILLING-ACTIVATION.md) is there to catch.

import { computeSignature } from "../src/signature.js";

export const SECRET = "whsec_test_do_not_use_anywhere_real";
export const ACCOUNT = "gh-org-fixprove-testorg";
export const SUB_ID = "sub_test_00000000000001";
export const CUS_ID = "cus_test_00000000000001";
export const T0 = 1_800_000_000; // fixed clock; keeps every test deterministic

let seq = 0;
export function nextEventId(): string {
  seq += 1;
  return `evt_test_${String(seq).padStart(12, "0")}`;
}

export function envelope(
  type: string,
  object: Record<string, unknown>,
  opts: { id?: string; created?: number } = {},
): string {
  return JSON.stringify({
    id: opts.id ?? nextEventId(),
    object: "event",
    type,
    created: opts.created ?? T0,
    livemode: false,
    data: { object },
  });
}

export function sign(payload: string, timestamp: number = T0, secret: string = SECRET): string {
  return `t=${timestamp},v1=${computeSignature(payload, secret, timestamp)}`;
}

export function checkoutSession(
  opts: { paymentStatus?: string; accountId?: string; tier?: string } = {},
): Record<string, unknown> {
  return {
    id: "cs_test_00000000000001",
    object: "checkout.session",
    mode: "subscription",
    payment_status: opts.paymentStatus ?? "paid",
    client_reference_id: opts.accountId ?? ACCOUNT,
    customer: CUS_ID,
    subscription: SUB_ID,
    metadata: {
      fixprove_account_id: opts.accountId ?? ACCOUNT,
      fixprove_tier: opts.tier ?? "TIER_A",
    },
  };
}

export function subscription(
  status: string,
  opts: { accountId?: string; periodEnd?: number; tier?: string } = {},
): Record<string, unknown> {
  return {
    id: SUB_ID,
    object: "subscription",
    status,
    customer: CUS_ID,
    current_period_end: opts.periodEnd ?? T0 + 2_592_000,
    metadata: {
      fixprove_account_id: opts.accountId ?? ACCOUNT,
      fixprove_tier: opts.tier ?? "TIER_A",
    },
  };
}

/**
 * #KS-TRACE: B1-DEFECT-3-FIX | this fixture was corrected 2026-08-04 against a
 * REAL invoice payload captured from Yehor's live test-mode purchase -- the
 * previous version's shape (a flat top-level `subscription` field, empty
 * `metadata`) was wrong, taken from Stripe's own older documentation
 * examples rather than verified fact, and the offline suite passed against
 * it anyway because nothing challenged the assumption until a real event
 * arrived. The invoice API version in effect here nests the subscription
 * link AND its metadata under `parent.subscription_details` instead.
 * `shape: "legacy_flat"` reproduces the OLD (still-supported-as-fallback)
 * shape, so the resolution code's defense-in-depth path stays tested too.
 */
export function invoice(
  billingReason: string,
  opts: { periodEnd?: number; shape?: "current" | "legacy_flat" } = {},
): Record<string, unknown> {
  const shape = opts.shape ?? "current";
  const base = {
    id: "in_test_00000000000001",
    customer: CUS_ID,
    billing_reason: billingReason,
    period_end: opts.periodEnd ?? T0 + 5_184_000,
  };
  if (shape === "legacy_flat") {
    return { ...base, object: "invoice", subscription: SUB_ID, metadata: {} };
  }
  return {
    ...base,
    object: "invoice",
    metadata: {},
    parent: {
      type: "subscription_details",
      subscription_details: {
        subscription: SUB_ID,
        metadata: { fixprove_account_id: ACCOUNT, fixprove_tier: "TIER_A" },
      },
    },
  };
}

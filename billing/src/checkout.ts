// #KS-TRACE: B1-CHECKOUT | requirement: SESSION-PLAN-TO-R1.md B1 -- create the
// subscription checkout surface for the DIRECT-STRIPE-FIRST route (decision
// D-1, 2026-08-01). assumption: Stripe Checkout (hosted) rather than Elements,
// per STRIPE-SETUP-CHECKLIST.md sec.5 -- hosted Checkout keeps this codebase
// out of PCI scope (SAQ A) because no raw card data ever touches it.
// | test: test/checkout.test.ts

import type { Tier } from "./types.js";
import { isTier } from "./types.js";

/**
 * Opaque Stripe price IDs, supplied from configuration at runtime.
 * #KS-TRACE: B1-NO-PRICING-IN-REPO | requirement: standing hard boundary --
 * "no public pricing" and "no pricing values in any file". Only `price_...`
 * IDs live here; the AMOUNT exists solely in the Stripe dashboard. This is why
 * the type is a map of opaque strings and not a table of numbers.
 */
export type PriceMap = Readonly<Record<Tier, string>>;

export interface CheckoutConfig {
  /** Stripe secret or restricted key. MUST be a test-mode key -- enforced. */
  apiKey: string;
  priceMap: PriceMap;
  successUrl: string;
  cancelUrl: string;
  /** Injected for testability; defaults to global fetch. */
  fetchImpl?: typeof fetch;
  /** Override for tests. */
  apiBase?: string;
}

export interface CreateCheckoutArgs {
  /** The GitHub org/account the entitlement will attach to. */
  accountId: string;
  tier: Tier;
  customerEmail?: string;
  /** Optional Stripe idempotency key; strongly recommended by Stripe for POSTs. */
  idempotencyKey?: string;
}

export class LiveKeyRefusedError extends Error {
  constructor() {
    super(
      "Refusing to operate: a non-test Stripe key was supplied. This build is " +
        "TEST MODE ONLY until the legal-review gate (PITFALL row 4) closes.",
    );
    this.name = "LiveKeyRefusedError";
  }
}

/**
 * #KS-TRACE: B1-TEST-MODE-ENFORCEMENT | requirement: the standing hard
 * boundary "no live Stripe keys" is a governance rule; this turns it into a
 * runtime invariant so it cannot be broken by an env-var mistake. Stripe's
 * documented key prefixes are `sk_test_` / `rk_test_` (test) and `sk_live_` /
 * `rk_live_` (live). Anything not explicitly test-prefixed is refused --
 * fail-closed, so an empty or garbled key is refused too.
 * assumption: this guard must be DELETED (not bypassed) as an explicit,
 * reviewed step of the A3 production flip -- see BILLING-ACTIVATION.md sec.6.
 * | test: test/checkout.test.ts "refuses a live key" / "refuses an empty key"
 */
export function assertTestModeKey(apiKey: string): void {
  if (!apiKey.startsWith("sk_test_") && !apiKey.startsWith("rk_test_")) {
    throw new LiveKeyRefusedError();
  }
}

/**
 * Build the form-encoded body for POST /v1/checkout/sessions.
 * Split out from the network call so the exact wire parameters are assertable
 * in a test without any HTTP at all.
 */
export function buildCheckoutSessionParams(
  config: Pick<CheckoutConfig, "priceMap" | "successUrl" | "cancelUrl">,
  args: CreateCheckoutArgs,
): URLSearchParams {
  if (!isTier(args.tier)) throw new Error(`unknown_tier: ${String(args.tier)}`);
  const priceId = config.priceMap[args.tier];
  if (!priceId) throw new Error(`no_price_id_configured_for_tier: ${args.tier}`);
  if (!args.accountId) throw new Error("missing_account_id");

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("line_items[0][price]", priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", config.successUrl);
  body.set("cancel_url", config.cancelUrl);

  // #KS-TRACE: B1-ACCOUNT-BINDING | requirement: the webhook must be able to
  // resolve which FixProve account a payment belongs to. Three independent
  // carriers are set deliberately: client_reference_id (present on
  // checkout.session.completed), session metadata, and subscription_data
  // metadata (which propagates onto the Subscription object and therefore onto
  // every later customer.subscription.* event). Without the third, renewal and
  // cancellation events months later would carry no account link at all.
  // | test: test/checkout.test.ts "binds the account id on all three carriers"
  body.set("client_reference_id", args.accountId);
  body.set("metadata[fixprove_account_id]", args.accountId);
  body.set("metadata[fixprove_tier]", args.tier);
  body.set("subscription_data[metadata][fixprove_account_id]", args.accountId);
  body.set("subscription_data[metadata][fixprove_tier]", args.tier);

  if (args.customerEmail) body.set("customer_email", args.customerEmail);
  return body;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export async function createCheckoutSession(
  config: CheckoutConfig,
  args: CreateCheckoutArgs,
): Promise<CheckoutSession> {
  assertTestModeKey(config.apiKey);
  const body = buildCheckoutSessionParams(config, args);
  const doFetch = config.fetchImpl ?? fetch;
  const base = config.apiBase ?? "https://api.stripe.com";

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": "2024-06-20",
  };
  if (args.idempotencyKey) headers["Idempotency-Key"] = args.idempotencyKey;

  const res = await doFetch(`${base}/v1/checkout/sessions`, {
    method: "POST",
    headers,
    body: body.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`stripe_checkout_failed: ${res.status} ${text.slice(0, 300)}`);
  }
  const parsed = JSON.parse(text) as { id?: string; url?: string };
  if (!parsed.id || !parsed.url) {
    throw new Error("stripe_checkout_response_missing_id_or_url");
  }
  return { id: parsed.id, url: parsed.url };
}

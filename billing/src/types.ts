// FixProve Billing -- Session 4.12-J (B1): Stripe TEST-MODE billing module.
// ==========================================================================
// #KS-TRACE: B1-TYPES | requirement: SESSION-PLAN-TO-R1.md B1 -- "subscription
// lifecycle + webhook handler with signature verification + the entitlement
// logic that turns the paid PR-check on/off".
// assumption: entitlement is keyed by a FixProve-side account identifier
// (the GitHub org/account the App is installed on), NOT by the Stripe customer
// id -- because the consumer of this data is the GitHub App's check-run path,
// which knows the installation account and knows nothing about Stripe.
// | test: test/scenarios.test.ts (all six lifecycle scenarios)
//
// HARD BOUNDARY, enforced in code (see checkout.ts assertTestModeKey): this
// module refuses to operate with a live Stripe key. No price AMOUNTS appear
// anywhere in this package -- only opaque Stripe price IDs supplied at runtime
// from configuration. Tiers are referred to by the neutral labels TIER_A /
// TIER_B so that no pricing figure can leak into a tracked file.

/** Neutral tier labels. Deliberately carry no amount, currency, or name. */
export type Tier = "TIER_A" | "TIER_B";

export const TIERS: readonly Tier[] = ["TIER_A", "TIER_B"] as const;

export function isTier(value: unknown): value is Tier {
  return value === "TIER_A" || value === "TIER_B";
}

/**
 * FixProve-side entitlement status. Deliberately NOT a mirror of Stripe's
 * subscription status enum -- Stripe has eight statuses whose distinctions do
 * not all matter to us; what matters is the single question "is the paid PR
 * check on?". `mapStripeSubscriptionStatus` performs the narrowing, and that
 * mapping is the one place a Stripe-side status change can alter behaviour.
 */
export type EntitlementStatus = "none" | "active" | "past_due" | "canceled";

export interface Entitlement {
  /** GitHub org/account identifier the App is installed on. */
  accountId: string;
  tier: Tier | null;
  status: EntitlementStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  /** Unix seconds; null until a subscription exists. */
  currentPeriodEnd: number | null;
  /**
   * #KS-TRACE: B1-OUT-OF-ORDER | assumption: Stripe explicitly does NOT
   * guarantee webhook delivery order, so a `customer.subscription.deleted`
   * can arrive before the `customer.subscription.updated` that precedes it in
   * real time. Storing the `created` timestamp of the last APPLIED event and
   * refusing to apply anything older is the standard defence.
   * | test: test/webhook.test.ts "stale out-of-order event is ignored"
   */
  lastEventCreated: number;
  /**
   * #KS-TRACE: B1-GRACE-PERIOD | requirement (Yehor, 2026-08-04, overturning
   * the original fail-immediately design recorded below): a lapsed PAYING
   * customer whose card is temporarily declined should not lose service the
   * instant Stripe's first retry fails -- most `past_due` states self-resolve
   * within days as Stripe's Smart Retries succeed. Unix seconds marking the
   * FIRST payment_failed event since the subscription was last genuinely
   * `active`; null whenever the account is not in a graced past_due window.
   * Deliberately NOT reset by subsequent retries of the SAME lapse (see
   * `applyStatusTransition`) -- the grace clock counts from the original
   * failure, not from the most recent one, or a customer with three retries
   * over a week would never actually run out of grace.
   * | test: test/scenarios.test.ts "GRACE PERIOD" block
   */
  pastDueSince: number | null;
  updatedAt: number;
}

export interface EntitlementStore {
  get(accountId: string): Promise<Entitlement | undefined>;
  put(entitlement: Entitlement): Promise<void>;
  /** Reverse lookup for events that carry only a subscription id. */
  getBySubscriptionId(subscriptionId: string): Promise<Entitlement | undefined>;
  /** Idempotency: Stripe retries, and at-least-once delivery is the contract. */
  hasProcessedEvent(eventId: string): Promise<boolean>;
  markEventProcessed(eventId: string): Promise<void>;
}

/**
 * Result shape deliberately mirrors app/src/webhookHandler.ts's
 * {ok, status, error} convention so the Worker adapter maps both the GitHub
 * and the Stripe path to HTTP responses with identical code.
 */
export interface HandlerResult {
  ok: boolean;
  status: number;
  /** Machine-readable outcome label; always present on ok results. */
  action?: string;
  error?: string;
}

export function emptyEntitlement(accountId: string, now: number): Entitlement {
  return {
    accountId,
    tier: null,
    status: "none",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    lastEventCreated: 0,
    pastDueSince: null,
    updatedAt: now,
  };
}

/**
 * #KS-TRACE: B1-GRACE-PERIOD-CONST | 3 days, chosen to comfortably cover
 * Stripe's default Smart Retries schedule for a card decline (typically
 * resolves within 1-3 attempts over a few days) without extending so far that
 * a genuinely abandoned subscription keeps serving paid work for a week.
 * A product/business-risk choice, not a technical one -- Yehor's call to
 * change, one constant.
 */
export const DEFAULT_GRACE_SECONDS = 3 * 24 * 60 * 60;

/**
 * #KS-TRACE: B1-ENTITLEMENT-GATE | requirement: "entitlement logic that turns
 * the paid PR-check on/off". This is the ONLY function the GitHub App path
 * should call. Fail-closed in every case this function does NOT explicitly
 * recognise as entitled: an absent record, an unknown status, a past_due
 * subscription past its grace window, or a past_due subscription with no
 * recorded `pastDueSince` (which `applyStatusTransition` guarantees only
 * happens for a customer who was never actually paying -- see its own trace).
 * assumption (SUPERSEDES the original 2026-08-04 fail-immediately design):
 * `past_due` grants a `graceSeconds` window of continued service, counted
 * from the FIRST failure of the current lapse, IF AND ONLY IF the subscriber
 * was genuinely `active` immediately before this lapse began. A first-time
 * decline (never previously active) gets zero grace -- see scenario 2 and
 * `applyStatusTransition`'s `graceEligible` check.
 * | test: test/scenarios.test.ts scenarios 2, 3, 4, 6 + the "GRACE PERIOD" block
 */
export function isPaidCheckEnabled(
  entitlement: Entitlement | undefined,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  graceSeconds: number = DEFAULT_GRACE_SECONDS,
): boolean {
  if (!entitlement) return false;
  if (entitlement.status === "active") return true;
  if (entitlement.status === "past_due" && entitlement.pastDueSince !== null) {
    return nowSeconds - entitlement.pastDueSince < graceSeconds;
  }
  return false;
}

/**
 * #KS-TRACE: B1-STATUS-TRANSITION | requirement: centralise every place the
 * webhook handler changes `status`/`pastDueSince` so the grace-eligibility
 * rule is expressed exactly once, not re-derived at each of the five call
 * sites in webhookHandler.ts (checkout, subscription created/updated,
 * subscription deleted, invoice succeeded, invoice failed).
 * assumption: grace is eligible ONLY when the entitlement was genuinely
 * `active` right before this lapse, OR is already mid-lapse (a second/third
 * retry of the SAME failure keeps the ORIGINAL `pastDueSince`, it does not
 * restart the clock -- Stripe can fire `invoice.payment_failed` more than
 * once per lapse as it retries). Any other prior state (`none`, `canceled`,
 * or a NEW subscription's very first payment failing) is NOT grace-eligible
 * -- this is scenario 2's requirement, restated as an invariant instead of a
 * single test's expectation.
 * | test: test/scenarios.test.ts scenario 2 (not eligible), the "GRACE
 * PERIOD" block (eligible, clock does not restart on repeat failures)
 */
export function applyStatusTransition(
  current: Pick<Entitlement, "status" | "pastDueSince">,
  newStatus: EntitlementStatus,
  eventCreated: number,
): Pick<Entitlement, "status" | "pastDueSince"> {
  if (newStatus !== "past_due") {
    return { status: newStatus, pastDueSince: null };
  }
  const graceEligible =
    current.status === "active" || (current.status === "past_due" && current.pastDueSince !== null);
  return {
    status: "past_due",
    pastDueSince: graceEligible ? (current.pastDueSince ?? eventCreated) : null,
  };
}

/**
 * #KS-TRACE: B1-STATUS-MAP | assumption: Stripe's documented subscription
 * statuses are incomplete, incomplete_expired, trialing, active, past_due,
 * canceled, unpaid, paused. `trialing` maps to active (a trial IS entitled);
 * `incomplete` (3DS/auth pending) maps to none, NOT active -- this is the
 * scenario-3 requirement. Any status Stripe adds in future falls through to
 * "none" (fail-closed) rather than throwing.
 * | test: test/scenarios.test.ts scenario 3; test/webhook.test.ts status table
 */
export function mapStripeSubscriptionStatus(status: string): EntitlementStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "incomplete":
    case "paused":
      return "none";
    default:
      return "none";
  }
}

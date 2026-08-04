// #KS-TRACE: B1-WEBHOOK | requirement: SESSION-PLAN-TO-R1.md B1 -- "webhook
// handler with signature verification + the entitlement logic that turns the
// paid PR-check on/off", plus STRIPE-SETUP-CHECKLIST.md sec.3's adversarial
// criterion "a spoofed webhook must NOT grant entitlement".
// | test: test/scenarios.test.ts (six lifecycle scenarios), test/webhook.test.ts

import {
  applyStatusTransition,
  emptyEntitlement,
  isTier,
  mapStripeSubscriptionStatus,
  type Entitlement,
  type EntitlementStore,
  type HandlerResult,
  type Tier,
} from "./types.js";
import { verifyStripeSignature } from "./signature.js";

export interface WebhookDeps {
  store: EntitlementStore;
  webhookSecret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}

export interface WebhookRequest {
  /** RAW body bytes as a string -- must not be re-serialised before this point. */
  payload: string;
  signatureHeader: string | null | undefined;
}

/** Minimal structural view of the Stripe Event envelope we rely on. */
interface StripeEvent {
  id?: unknown;
  type?: unknown;
  created?: unknown;
  data?: { object?: Record<string, unknown> };
}

function ok(status: number, action: string): HandlerResult {
  return { ok: true, status, action };
}
function fail(status: number, error: string): HandlerResult {
  return { ok: false, status, error };
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}
function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * Stripe expands-or-collapses nested objects depending on the API version and
 * the expand parameter: `subscription` may be the id string OR a full object.
 * Accept both rather than assuming the shape we happened to see in a fixture.
 */
function idOf(v: unknown): string | null {
  if (typeof v === "string") return v || null;
  if (v && typeof v === "object" && typeof (v as { id?: unknown }).id === "string") {
    return (v as { id: string }).id || null;
  }
  return null;
}

/**
 * #KS-TRACE: B1-DEFECT-3-FIX | defect found empirically against a REAL Stripe
 * account (2026-08-04, Yehor's live test-mode purchase), not by review or by
 * our own hand-built fixtures. The invoice API version in effect here
 * (>= 2025-03-31, required for Managed Payments) moved the subscription link
 * from a flat `invoice.subscription` field to
 * `invoice.parent.subscription_details.subscription` -- and moved the
 * subscription's metadata to `invoice.parent.subscription_details.metadata`
 * as well, leaving `invoice.metadata` itself an empty `{}`. Our fixtures
 * (test/fixtures.ts) were written from Stripe's own documentation examples,
 * which describe the older flat shape -- so the offline suite never caught
 * this; only a real invoice event did. This is exactly why B1's done-check
 * requires a real purchase, not just the offline suite passing.
 * | test: test/webhook.test.ts "resolves an invoice via the newer
 * parent.subscription_details shape" (built from the literal real payload
 * captured this session, not a guess at the shape).
 */
function parentSubscriptionDetails(obj: Record<string, unknown>): {
  subscription: string | null;
  metadata: Record<string, unknown>;
} {
  const parent = obj.parent;
  if (!parent || typeof parent !== "object") return { subscription: null, metadata: {} };
  const details = (parent as Record<string, unknown>).subscription_details;
  if (!details || typeof details !== "object") return { subscription: null, metadata: {} };
  const d = details as Record<string, unknown>;
  return {
    subscription: idOf(d.subscription),
    metadata: d.metadata && typeof d.metadata === "object" ? (d.metadata as Record<string, unknown>) : {},
  };
}

/**
 * assumption: `obj.metadata` is checked first (the common case for checkout
 * sessions and subscriptions); the newer invoice `parent.subscription_details`
 * location is a fallback used only when the direct metadata is absent/empty,
 * which is exactly the invoice case per B1-DEFECT-3-FIX above.
 */
function metadataOf(obj: Record<string, unknown>): Record<string, unknown> {
  const m = obj.metadata;
  const direct = m && typeof m === "object" ? (m as Record<string, unknown>) : {};
  if (Object.keys(direct).length > 0) return direct;
  return parentSubscriptionDetails(obj).metadata;
}

function tierFrom(obj: Record<string, unknown>): Tier | null {
  const raw = metadataOf(obj).fixprove_tier;
  return isTier(raw) ? raw : null;
}

/**
 * #KS-TRACE: B1-DEFECT-3-FIX | shared by BOTH resolution (which account does
 * this belong to) and data extraction (what subscription id do we store on
 * the entitlement record). Fixing only the former and leaving the invoice.*
 * switch cases reading the old flat `obj.subscription` directly was the exact
 * gap the regression test caught: resolution succeeded but
 * `stripeSubscriptionId` came back null. One function, used everywhere a
 * subscription id might be read from an object, closes that gap for good --
 * a future third call site can't reintroduce the same half-fixed bug.
 */
function subscriptionIdOf(obj: Record<string, unknown>): string | null {
  return idOf(obj.subscription) ?? parentSubscriptionDetails(obj).subscription;
}

/**
 * #KS-TRACE: B1-ACCOUNT-RESOLUTION | requirement: every mutating event must be
 * attributable to exactly one FixProve account. Resolution order is
 * deliberate, strongest link first: explicit metadata on the object (now
 * including the newer invoice `parent.subscription_details.metadata` shape,
 * per B1-DEFECT-3-FIX -- so a real invoice resolves via THIS branch, not the
 * reverse-lookup branch below), then checkout's client_reference_id, then a
 * reverse lookup by subscription id (kept as defense-in-depth for any object
 * that genuinely carries neither). If ALL fail we do NOT guess and we do NOT
 * 500 -- see the account_unresolved branch in handleStripeWebhook.
 * | test: test/webhook.test.ts "unresolvable account is reported, not guessed"
 */
async function resolveEntitlement(
  store: EntitlementStore,
  obj: Record<string, unknown>,
  now: number,
): Promise<Entitlement | undefined> {
  const fromMeta = str(metadataOf(obj).fixprove_account_id);
  if (fromMeta) return (await store.get(fromMeta)) ?? emptyEntitlement(fromMeta, now);

  const fromRef = str(obj.client_reference_id);
  if (fromRef) return (await store.get(fromRef)) ?? emptyEntitlement(fromRef, now);

  const subId = subscriptionIdOf(obj) ?? (obj.object === "subscription" ? str(obj.id) : null);
  if (subId) return await store.getBySubscriptionId(subId);

  return undefined;
}

export async function handleStripeWebhook(
  deps: WebhookDeps,
  req: WebhookRequest,
): Promise<HandlerResult> {
  const now = deps.nowSeconds ?? Math.floor(Date.now() / 1000);

  // --- Step 1: signature. NOTHING is parsed or trusted before this passes. ---
  const verified = verifyStripeSignature({
    payload: req.payload,
    header: req.signatureHeader,
    secret: deps.webhookSecret,
    toleranceSeconds: deps.toleranceSeconds,
    nowSeconds: now,
  });
  if (!verified.ok) return fail(400, verified.reason);

  // --- Step 2: parse. ---
  let event: StripeEvent;
  try {
    const parsed: unknown = JSON.parse(req.payload);
    // #KS-TRACE: B1-DEFECT-2-FIX | defect found by test/webhook.test.ts "a
    // signed but structurally-empty envelope is a 400, not a crash": the body
    // `null` is VALID JSON, so JSON.parse succeeds and returns null -- and the
    // very next property access threw a TypeError. In the Worker that surfaces
    // as an unhandled 500, which makes Stripe retry the delivery for days and
    // eventually disable the endpoint. A rejected body must be a clean 400.
    // Arrays are excluded for the same reason: an Event is an object.
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail(400, "malformed_event_envelope");
    }
    event = parsed as StripeEvent;
  } catch {
    return fail(400, "malformed_json");
  }
  const eventId = str(event.id);
  const eventType = str(event.type);
  const eventCreated = num(event.created);
  if (!eventId || !eventType || eventCreated === null) {
    return fail(400, "malformed_event_envelope");
  }

  // --- Step 3: idempotency. Stripe delivery is at-least-once by contract. ---
  // #KS-TRACE: B1-IDEMPOTENCY | requirement: a delivery replayed inside the
  // 300s signature tolerance passes signature verification by design -- so the
  // event-id ledger, not the signature, is what stops a double-apply.
  // | test: test/webhook.test.ts "replayed delivery is applied exactly once"
  if (await deps.store.hasProcessedEvent(eventId)) {
    return ok(200, "duplicate_ignored");
  }

  const obj = (event.data?.object ?? {}) as Record<string, unknown>;

  // Event types we deliberately do not act on still get a 200 -- a 4xx/5xx
  // makes Stripe retry forever and eventually disable the endpoint.
  const HANDLED = new Set([
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
  ]);
  if (!HANDLED.has(eventType)) {
    await deps.store.markEventProcessed(eventId);
    return ok(200, "ignored_event_type");
  }

  const entitlement = await resolveEntitlement(deps.store, obj, now);
  if (!entitlement) {
    // Recorded, not retried, not guessed: retrying cannot supply a link that
    // does not exist, and inventing one could grant a stranger entitlement.
    await deps.store.markEventProcessed(eventId);
    return ok(200, "account_unresolved");
  }

  // --- Step 4: out-of-order guard, applied AFTER resolution so that a stale
  // event is still marked processed (it will never become applicable). ---
  if (eventCreated < entitlement.lastEventCreated) {
    await deps.store.markEventProcessed(eventId);
    return ok(200, "stale_event_ignored");
  }

  const next: Entitlement = { ...entitlement, lastEventCreated: eventCreated, updatedAt: now };
  let action: string;

  switch (eventType) {
    case "checkout.session.completed": {
      next.stripeCustomerId = idOf(obj.customer) ?? next.stripeCustomerId;
      next.stripeSubscriptionId = idOf(obj.subscription) ?? next.stripeSubscriptionId;
      next.tier = tierFrom(obj) ?? next.tier;
      // #KS-TRACE: B1-CHECKOUT-UNPAID | requirement: scenario 3 (3DS / auth
      // required). Stripe fires checkout.session.completed even when
      // payment_status is `unpaid` -- the customer finished the form but the
      // bank has not authorised. Treating "completed" as "paid" is THE classic
      // way to hand out a free subscription; the link is recorded but the
      // entitlement is not granted until an authoritative subscription/invoice
      // event says so. | test: test/scenarios.test.ts scenario 3
      if (str(obj.payment_status) === "paid") {
        Object.assign(next, applyStatusTransition(entitlement, "active", eventCreated));
        action = "checkout_completed_active";
      } else {
        Object.assign(next, applyStatusTransition(entitlement, "none", eventCreated));
        action = "checkout_completed_awaiting_payment";
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      next.stripeSubscriptionId = str(obj.id) ?? next.stripeSubscriptionId;
      next.stripeCustomerId = idOf(obj.customer) ?? next.stripeCustomerId;
      next.tier = tierFrom(obj) ?? next.tier;
      next.currentPeriodEnd = num(obj.current_period_end) ?? next.currentPeriodEnd;
      Object.assign(
        next,
        applyStatusTransition(entitlement, mapStripeSubscriptionStatus(str(obj.status) ?? ""), eventCreated),
      );
      action = `subscription_${next.status}`;
      break;
    }
    case "customer.subscription.deleted": {
      next.stripeSubscriptionId = str(obj.id) ?? next.stripeSubscriptionId;
      Object.assign(next, applyStatusTransition(entitlement, "canceled", eventCreated));
      action = "subscription_canceled";
      break;
    }
    case "invoice.payment_succeeded": {
      // #KS-TRACE: B1-DEFECT-3-FIX | was `idOf(obj.subscription)` only -- the
      // flat field this newer invoice shape doesn't carry. subscriptionIdOf()
      // also checks parent.subscription_details, closing the exact gap the
      // regression test caught (resolution succeeded, but the id came back
      // null and never got stored).
      next.stripeSubscriptionId = subscriptionIdOf(obj) ?? next.stripeSubscriptionId;
      next.currentPeriodEnd = num(obj.period_end) ?? next.currentPeriodEnd;
      Object.assign(next, applyStatusTransition(entitlement, "active", eventCreated));
      action = str(obj.billing_reason) === "subscription_cycle" ? "renewal_paid" : "invoice_paid";
      break;
    }
    case "invoice.payment_failed": {
      next.stripeSubscriptionId = subscriptionIdOf(obj) ?? next.stripeSubscriptionId;
      // #KS-TRACE: B1-GRACE-PERIOD | requirement (Yehor, 2026-08-04): grace
      // is applied here via `applyStatusTransition`, which decides -- based on
      // `entitlement.status` (the value BEFORE this event) -- whether this is
      // a lapsed paying customer (grace starts/continues) or a first-time
      // decline (zero grace, see scenario 2). See types.ts for the full
      // rationale; this call site only supplies the "what happened" (a
      // failure), not the "who gets grace" policy.
      Object.assign(next, applyStatusTransition(entitlement, "past_due", eventCreated));
      action = "payment_failed_past_due";
      break;
    }
    default:
      // Unreachable: HANDLED gates this switch. Present so the compiler proves
      // `action` is always assigned.
      await deps.store.markEventProcessed(eventId);
      return ok(200, "ignored_event_type");
  }

  await deps.store.put(next);
  await deps.store.markEventProcessed(eventId);
  return ok(200, action);
}

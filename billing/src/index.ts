// #KS-TRACE: B1-INDEX | requirement: a single composition root, mirroring
// app/src/index.ts's createFixProveApp pattern, so the Worker adapter has one
// thing to construct and the entitlement gate has one thing to call.
// | test: test/scenarios.test.ts constructs the module through this factory.

export * from "./types.js";
export * from "./signature.js";
export * from "./checkout.js";
export * from "./webhookHandler.js";
export { InMemoryEntitlementStore } from "./memoryStore.js";

import { assertTestModeKey, createCheckoutSession, type CheckoutConfig, type CreateCheckoutArgs, type CheckoutSession } from "./checkout.js";
import { handleStripeWebhook, type WebhookRequest } from "./webhookHandler.js";
import { isPaidCheckEnabled, type EntitlementStore, type HandlerResult } from "./types.js";

export interface BillingConfig {
  store: EntitlementStore;
  /** Stripe webhook endpoint signing secret (`whsec_...`). */
  webhookSecret: string;
  checkout: CheckoutConfig;
  toleranceSeconds?: number;
}

export interface BillingModule {
  handleWebhook(req: WebhookRequest, nowSeconds?: number): Promise<HandlerResult>;
  createCheckout(args: CreateCheckoutArgs): Promise<CheckoutSession>;
  /**
   * #KS-TRACE: B1-GRACE-PERIOD | `nowSeconds` is optional in production (real
   * wall-clock time) but the GitHub App check-run path should always be
   * calling this with the request's own clock -- passing it explicitly is
   * what makes the 3-day grace window deterministic and testable rather than
   * silently dependent on whatever time the process happens to run at.
   */
  isPaidCheckEnabled(accountId: string, nowSeconds?: number): Promise<boolean>;
}

export function createBillingModule(config: BillingConfig): BillingModule {
  // Fail fast at construction, not at first payment: a live key must never get
  // as far as a request. See B1-TEST-MODE-ENFORCEMENT in checkout.ts.
  assertTestModeKey(config.checkout.apiKey);

  return {
    handleWebhook: (req, nowSeconds) =>
      handleStripeWebhook(
        {
          store: config.store,
          webhookSecret: config.webhookSecret,
          toleranceSeconds: config.toleranceSeconds,
          nowSeconds,
        },
        req,
      ),
    createCheckout: (args) => createCheckoutSession(config.checkout, args),
    isPaidCheckEnabled: async (accountId, nowSeconds) =>
      isPaidCheckEnabled(await config.store.get(accountId), nowSeconds),
  };
}

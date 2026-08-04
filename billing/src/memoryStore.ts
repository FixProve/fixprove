// #KS-TRACE: B1-MEMORY-STORE | requirement: a reference EntitlementStore that
// makes the module runnable and testable with zero infrastructure.
// assumption: production will back this with Cloudflare KV, mirroring
// worker/src/kvPendingStore.ts (which wraps app/src/pendingStore.ts's
// interface the same way). That KV adapter is deliberately NOT built in this
// session -- it needs a real KV namespace and belongs with the Worker route
// wiring, which is gated behind Yehor creating the Stripe account. Recorded as
// a known limitation in the Keystone report, not as done work.
// | test: exercised by every test in this package.

import { emptyEntitlement, type Entitlement, type EntitlementStore } from "./types.js";

export class InMemoryEntitlementStore implements EntitlementStore {
  private byAccount = new Map<string, Entitlement>();
  private processed = new Set<string>();

  async get(accountId: string): Promise<Entitlement | undefined> {
    const found = this.byAccount.get(accountId);
    return found ? { ...found } : undefined;
  }

  async put(entitlement: Entitlement): Promise<void> {
    this.byAccount.set(entitlement.accountId, { ...entitlement });
  }

  async getBySubscriptionId(subscriptionId: string): Promise<Entitlement | undefined> {
    for (const e of this.byAccount.values()) {
      if (e.stripeSubscriptionId === subscriptionId) return { ...e };
    }
    return undefined;
  }

  async hasProcessedEvent(eventId: string): Promise<boolean> {
    return this.processed.has(eventId);
  }

  async markEventProcessed(eventId: string): Promise<void> {
    this.processed.add(eventId);
  }

  /** Test/bootstrap helper: seed an account with no subscription yet. */
  async seed(accountId: string, now: number): Promise<void> {
    await this.put(emptyEntitlement(accountId, now));
  }
}

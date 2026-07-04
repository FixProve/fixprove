// #KS-TRACE: SESSION-0.2-SCAFFOLD -> S2.1-WIRING | Session 0.2 proved the
// package builds against @octokit/app/@octokit/webhooks types. Session 2.1
// fills in the actual webhook routing, Checks API calls, and OIDC callback
// verification (see webhookHandler.ts, checkRun.ts, oidcVerify.ts,
// callbackHandler.ts, pendingStore.ts, findings.ts).
import { App } from "@octokit/app";
import { createRemoteJWKSet, type JWTVerifyGetKey } from "jose";
import { GITHUB_OIDC_ISSUER } from "./oidcVerify.js";
import { InMemoryPendingCheckRunStore, type PendingCheckRunStore } from "./pendingStore.js";
import { registerPullRequestHandler, handleWebhookDelivery, type WebhookDeliveryResult } from "./webhookHandler.js";
import { handleCallback, type CallbackRequestBody, type CallbackResult } from "./callbackHandler.js";

export interface FixProveAppConfig {
  appId: string | number;
  privateKey: string;
  webhookSecret: string;
  /** The `aud` claim callers' GitHub Actions OIDC tokens must request. */
  callbackAudience: string;
  /**
   * KS-TRACE: S2.2-STORE-INJECT | requirement: Session 2.2 replaces the
   * in-memory pending-check-run store with a Cloudflare KV-backed one (see
   * ../../worker/src/kvPendingStore.ts) without touching any webhook/
   * callback logic. Making the store an optional constructor param (rather
   * than hardcoding InMemoryPendingCheckRunStore) is what makes that
   * possible -- consistent with the same DI pattern already used for
   * ChecksClient in checkRun.ts | test: test_custom_store_is_used_when_provided,
   * test_defaults_to_in_memory_store_when_omitted (index.test.ts)
   */
  store?: PendingCheckRunStore;
  /**
   * KS-TRACE: S2.2-JWKS-INJECT | requirement: symmetric with S2.2-STORE-
   * INJECT above -- Session 2.1 already noted (index.ts's own doc comment)
   * that tests must go around this convenience wrapper to inject a local
   * test JWKS. Session 2.2's worker-level integration tests need a genuine
   * (not just unit-level) way to drive a valid OIDC callback through the
   * REAL createFixProveApp/handleCallback wiring without any live network
   * call to GitHub's JWKS endpoint. Made optional so production is
   * unaffected (still defaults to `createRemoteJWKSet` against GitHub's
   * real endpoint) | test: worker/test/worker.test.ts's callback-path
   * KV-failure test relies on this.
   */
  jwks?: JWTVerifyGetKey;
}

export interface FixProveApp {
  app: App;
  store: PendingCheckRunStore;
  handleWebhookDelivery(delivery: {
    id: string;
    name: string;
    payload: string;
    signature: string | undefined;
  }): Promise<WebhookDeliveryResult>;
  handleCallback(body: CallbackRequestBody): Promise<CallbackResult>;
}

/**
 * Constructs the FixProve GitHub App and wires the pull_request webhook
 * handler + OIDC callback handler against a shared pending-check-run store.
 *
 * KS-TRACE: S2.1-WIRING | requirement: production JWKS resolution hits
 * GitHub's real endpoint (`createRemoteJWKSet`); tests inject their own via
 * the lower-level functions in oidcVerify.ts/callbackHandler.ts directly
 * rather than through this convenience wrapper | test: index.test.ts
 */
export function createFixProveApp(config: FixProveAppConfig): FixProveApp {
  const app = new App({
    appId: config.appId,
    privateKey: config.privateKey,
    webhooks: {
      secret: config.webhookSecret,
    },
  });

  const store = config.store ?? new InMemoryPendingCheckRunStore();
  registerPullRequestHandler(app, store);

  const jwks = config.jwks ?? createRemoteJWKSet(new URL(`${GITHUB_OIDC_ISSUER}/.well-known/jwks`));

  return {
    app,
    store,
    handleWebhookDelivery: (delivery) => handleWebhookDelivery(app, delivery),
    handleCallback: (body) => handleCallback(app, store, jwks, config.callbackAudience, body),
  };
}

// FixProve Worker -- Session 2.2: Hono-based Cloudflare Worker
// ==================================================================
//
// KS-TRACE: S2.2-WORKER | requirement: expose Session 2.1's already
// logic-verified handleWebhookDelivery/handleCallback over HTTP via a real
// Cloudflare Worker, backed by KV instead of the in-memory store, with NO
// changes to the underlying handler logic itself -- this file is purely a
// runtime adapter (parse the Cloudflare Request -> call the existing
// function -> map its {ok, status, error} result to an HTTP Response).
// | test: worker.test.ts

import { Hono } from "hono";
import type { JWTVerifyGetKey } from "jose";
import { createFixProveApp, type FixProveApp } from "@fixprove/github-app/dist/src/index.js";
import { KVPendingCheckRunStore, KVStoreError } from "./kvPendingStore.js";

export interface Env {
  PENDING_CHECKS_KV: KVNamespace;
  GITHUB_APP_ID: string;
  GITHUB_APP_PRIVATE_KEY: string;
  GITHUB_WEBHOOK_SECRET: string;
  CALLBACK_AUDIENCE: string;
  /**
   * KS-TRACE: S2.2-WORKER-TEST-JWKS | test-only escape hatch, mirroring
   * __resetCacheForTests below: production `wrangler.toml` never sets this
   * (it is not declared under [vars] there), so `getFixProveApp` always
   * uses the real `createRemoteJWKSet` in production. Tests set it to a
   * locally-generated JWKS so a genuinely-verifiable OIDC callback can be
   * driven through the REAL Hono route + real handleCallback wiring,
   * without any live network call to GitHub's JWKS endpoint -- otherwise
   * the callback-path KV-failure adversarial test could only ever exercise
   * the "invalid token" 401 path, never actually reach the KV lookup.
   */
  __testJwks?: JWTVerifyGetKey;
}

// KS-TRACE: S2.2-WORKER-APP-CACHE | assumption: a Worker isolate may be
// reused across multiple requests (Cloudflare's standard execution model),
// so constructing a fresh FixProveApp (which internally builds a
// createRemoteJWKSet client) on every single request would be wasteful,
// not incorrect. Cached per-isolate keyed by env identity is unnecessary
// complexity for this session's scope -- a plain module-level cache
// keyed by nothing (single env shape per deployment) is sufficient and
// simpler | test: not directly tested (a performance/efficiency concern,
// not a correctness one); each test constructs its own Hono app instance
// with its own env, so cross-test cache leakage cannot occur.
let cachedApp: FixProveApp | undefined;

function getFixProveApp(env: Env): FixProveApp {
  if (!cachedApp) {
    cachedApp = createFixProveApp({
      appId: env.GITHUB_APP_ID,
      privateKey: env.GITHUB_APP_PRIVATE_KEY,
      webhookSecret: env.GITHUB_WEBHOOK_SECRET,
      callbackAudience: env.CALLBACK_AUDIENCE,
      store: new KVPendingCheckRunStore(env.PENDING_CHECKS_KV),
      jwks: env.__testJwks,
    });
  }
  return cachedApp;
}

// KS-TRACE: S2.2-WORKER-RESET-FOR-TEST | test-only escape hatch: each unit
// test constructs its own fake KV/env and must NOT reuse another test's
// cached FixProveApp (which would silently point at a different test's KV
// fake). Production code never calls this.
export function __resetCacheForTests(): void {
  cachedApp = undefined;
}

export const app = new Hono<{ Bindings: Env }>();

/**
 * KS-TRACE: S2.2-WORKER-ERROR-BOUNDARY | requirement (adversarial
 * acceptance criterion): "KV read/write failures must be caught and
 * handled gracefully (500 response, not a silent hang)". Hono's
 * `app.onError` is a global catch-all: ANY exception thrown anywhere
 * within a route handler (including a KVStoreError bubbling up from
 * kvPendingStore.ts through handleWebhookDelivery/handleCallback) is
 * caught here and turned into a classified JSON 500 response, rather than
 * propagating as an unhandled Worker exception (which Cloudflare would
 * otherwise surface as a raw, uninformative error page -- and in the
 * pathological case of a caller retrying against a half-dead Worker
 * isolate, could look like a hang from the caller's perspective even
 * though no code path here actually blocks forever) | test:
 * test_kv_get_failure_during_callback_returns_500,
 * test_kv_put_failure_during_webhook_returns_500,
 * test_unexpected_error_still_returns_500_not_hang
 */
// KS-TRACE: S2.2-WORKER-ERROR-UNWRAP-DEFECT | fix (found while re-running
// this suite after webhookHandler.ts's S2.2-WEBHOOK-ERROR-CLASSIFY-DEFECT
// fix): a KVStoreError thrown inside the pull_request listener does not
// arrive HERE as a bare KVStoreError -- @octokit/webhooks' dispatch wraps
// every listener exception in an AggregateError (see
// webhookHandler.ts's own S2.2-WEBHOOK-ERROR-CLASSIFY-DEFECT trace for the
// full mechanism), so `err instanceof KVStoreError` was always false for
// the webhook path, even though the underlying cause genuinely was a
// KVStoreError. `findKvStoreError` unwraps one level of AggregateError to
// find it, so the response body correctly reports the classified KV
// failure message rather than a generic "internal error" -- the STATUS
// CODE was already correct (500) even before this fix; this fix only
// corrects the response body's error message, which matters for
// debuggability/observability, not for the pass/fail of the adversarial
// contract itself | test: test_kv_put_failure_during_webhook_returns_500
// (worker.test.ts, asserts the specific "KV put failed" message)
function findKvStoreError(err: unknown): KVStoreError | undefined {
  if (err instanceof KVStoreError) return err;
  const wrapped = (err as { errors?: unknown } | null)?.errors;
  if (Array.isArray(wrapped)) {
    for (const inner of wrapped) {
      if (inner instanceof KVStoreError) return inner;
    }
  }
  return undefined;
}

// KS-TRACE: S4.3-WORKER-ERROR-LOGGING-DEFECT | fix (found live, Session 4.3
// B5 walkthrough): this boundary classified and formatted errors for the
// CALLER (GitHub) correctly, but never logged the caught exception anywhere
// -- so a real, reproducible 500 on the pull_request webhook path (PR #3,
// autonomous-core) was completely undiagnosable via `wrangler tail`: two
// separate redeliveries of the identical payload produced identical
// {"ok":false,"error":"internal error"} responses with NO corresponding
// log output beyond the one-line request summary, because nothing in this
// handler ever called console.error. Fixed by logging the raw caught error
// before classifying/responding, so `wrangler tail` (or the Cloudflare
// dashboard's Logs tab) can actually surface the underlying exception and
// stack trace on the next occurrence | test: manual verification via
// `wrangler tail` + a redelivered webhook, see KS-REPORT-4.3 Addendum 2.
app.onError((err, c) => {
  console.error("fixprove worker error:", err);
  const kvError = findKvStoreError(err);
  return c.json(
    {
      ok: false,
      error: kvError ? kvError.message : "internal error",
    },
    500
  );
});

app.post("/webhooks", async (c) => {
  const fixprove = getFixProveApp(c.env);
  const id = c.req.header("x-github-delivery") ?? "";
  const name = c.req.header("x-github-event") ?? "";
  const signature = c.req.header("x-hub-signature-256") ?? undefined;
  const payload = await c.req.text();

  const result = await fixprove.handleWebhookDelivery({ id, name, payload, signature });
  return c.json({ ok: result.ok, error: result.error }, result.status as any);
});

app.post("/callback", async (c) => {
  const fixprove = getFixProveApp(c.env);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "malformed JSON body" }, 400);
  }
  const oidcToken = body && typeof body === "object" ? (body as Record<string, unknown>).oidcToken : undefined;
  const findings = body && typeof body === "object" ? (body as Record<string, unknown>).findings : undefined;

  const result = await fixprove.handleCallback({ oidcToken, findings });
  // KS-TRACE: S4.3-WORKER-CALLBACK-LOGGING | requirement (diagnostic, not a
  // behavior change): handleCallback's rejections (401/400/404) are
  // classified, expected results -- they return normally, they never throw
  // -- so app.onError's new logging never sees them. Session 4.3's B5
  // round-trip test failed at this exact endpoint (curl exit 22) with no
  // corresponding onError log line, meaning it's one of these four
  // classified rejections, not a crash. Logging the result here (only on
  // failure) is the same "restore observability before diagnosing" move
  // as the onError fix, applied to the other endpoint that can silently
  // fail | test: manual verification via wrangler tail + a live PR run,
  // see KS-REPORT-4.3 Addendum 2.
  if (!result.ok) {
    console.error("fixprove callback rejected:", result.status, result.error);
  }
  return c.json({ ok: result.ok, error: result.error }, result.status as any);
});

export default app;

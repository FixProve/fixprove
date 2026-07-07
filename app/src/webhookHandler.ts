// FixProve GitHub App — Session 2.1: pull_request webhook -> pending Check Run
// ================================================================================
//
// KS-TRACE: S2.1-WEBHOOK | requirement: on pull_request opened/synchronize/
// reopened, create a Check Run immediately (visible right away, even before
// the customer's Action has finished running) and remember it in the
// pending-check-run store so the later OIDC callback can find and complete
// it | test: webhookHandler.test.ts

import type { App } from "@octokit/app";
import { createPendingCheckRun, octokitToChecksClient, type OctokitChecksLike } from "./checkRun.js";
import type { PendingCheckRunStore } from "./pendingStore.js";

const RELEVANT_ACTIONS = new Set(["opened", "synchronize", "reopened"]);

export interface PullRequestEventPayload {
  action: string;
  /**
   * KS-TRACE: S4.3-WEBHOOK-PR-NUMBER | requirement: the PR number is now
   * the correlation key the later OIDC callback uses to find this pending
   * entry (see pendingStore.ts's S4.3-PENDING-STORE-CORRELATION-DEFECT
   * trace) -- it is stable and available on every pull_request webhook
   * payload, unlike the head sha the callback's OIDC token cannot reliably
   * reproduce.
   */
  number: number;
  repository: { owner: { login: string }; name: string };
  pull_request: { head: { sha: string } };
  installation?: { id: number };
}

/**
 * KS-TRACE: S2.1-WEBHOOK-LOGIC | requirement: the actual decision logic
 * (which actions are relevant, how to derive owner/repo/sha, what gets
 * stored) is a PURE function over its inputs, independent of @octokit/app's
 * webhook-to-installation-octokit wiring -- this is what makes it directly
 * unit-testable with a fake ChecksClient rather than needing a live App
 * with a real signing key | test: test_ignores_irrelevant_pull_request_action,
 * test_opened_creates_pending_check_run, test_synchronize_creates_pending_check_run,
 * test_missing_installation_id_is_skipped_not_thrown
 */
export async function handlePullRequestEvent(
  octokit: OctokitChecksLike,
  store: PendingCheckRunStore,
  payload: PullRequestEventPayload
): Promise<void> {
  if (!RELEVANT_ACTIONS.has(payload.action)) {
    return;
  }
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const headSha = payload.pull_request.head.sha;
  const prNumber = payload.number;
  const installationId = payload.installation?.id;
  if (installationId === undefined) {
    // KS-TRACE: S2.1-WEBHOOK-NO-INSTALLATION | assumption: a pull_request
    // event without installation context cannot happen for an App-scoped
    // webhook subscription, but this is defensively skipped rather than
    // throwing, since a webhook handler crash must never surface as a
    // 5xx that causes GitHub to retry-storm the endpoint
    return;
  }

  const checkRunId = await createPendingCheckRun(octokitToChecksClient(octokit), { owner, repo, headSha });

  await store.put({
    owner,
    repo,
    kind: "pr",
    correlationId: String(prNumber),
    headSha,
    checkRunId,
    installationId,
    createdAt: Date.now(),
  });
}

/**
 * KS-TRACE: S2.1-WEBHOOK-REGISTER | thin wiring layer: registers the pure
 * handlePullRequestEvent logic above against the real @octokit/app webhook
 * emitter. Not directly unit-tested itself (it has no logic of its own to
 * test beyond "does it call through"), consistent with keeping all
 * decision logic in the pure function.
 */
export function registerPullRequestHandler(app: App, store: PendingCheckRunStore): void {
  app.webhooks.on("pull_request", async ({ octokit, payload }) => {
    await handlePullRequestEvent(octokit as unknown as OctokitChecksLike, store, payload as unknown as PullRequestEventPayload);
  });
}

export interface WebhookDeliveryResult {
  ok: boolean;
  status: number;
  error?: string;
}

/**
 * KS-TRACE: S2.1-WEBHOOK-VERIFY | requirement: an invalid HMAC signature or
 * malformed JSON body is REJECTED (never silently accepted, never crashes
 * the process) -- this is the literal "webhook signatures validated;
 * malformed payloads rejected" acceptance criterion | test:
 * test_valid_signature_accepted, test_invalid_signature_rejected,
 * test_malformed_json_body_rejected, test_missing_signature_rejected
 */
// KS-TRACE: S2.2-WEBHOOK-ERROR-CLASSIFY-DEFECT | fix (found by Session 2.2's
// adversarial KV-failure test, "KV failure during the webhook path ...
// returns 500, not a hang or silent success" -- it failed with 400 !== 500):
// Session 2.1's original catch-all assumed @octokit/webhooks only ever
// throws for signature-mismatch or malformed-JSON, both legitimately
// client errors (400). That assumption did not anticipate that
// `verifyAndReceive` ALSO wraps ANY exception thrown by a REGISTERED
// LISTENER (e.g. registerPullRequestHandler's handlePullRequestEvent,
// which can now throw a KVStoreError from the KV-backed store added in
// Session 2.2) in the exact same AggregateError shape. The blanket
// `catch { return 400 }` was silently misclassifying a genuine internal
// failure (KV outage) as if it were a malformed/forged request -- masking
// exactly the kind of error that should surface as a 500, not a 400.
// Verified directly against @octokit/webhooks' own source
// (dist-src/verify-and-receive.js, dist-src/middleware/receive.js): both
// the bad-signature and malformed-JSON cases explicitly set `.status = 400`
// on the underlying error(s) before wrapping; a listener's thrown error
// carries no such `.status`. `isWebhookValidationError` below uses exactly
// that distinguishing signal. | test:
// test_listener_error_is_not_swallowed_as_400 (webhookHandler.test.ts),
// plus worker/test/worker.test.ts's KV-failure-returns-500 test, which is
// what originally caught this.
function isWebhookValidationError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const wrapped = (err as { errors?: unknown }).errors;
  if (!Array.isArray(wrapped) || wrapped.length === 0) return false;
  return wrapped.every((e) => e && typeof e === "object" && (e as { status?: unknown }).status === 400);
}

export async function handleWebhookDelivery(
  app: App,
  delivery: { id: string; name: string; payload: string; signature: string | undefined }
): Promise<WebhookDeliveryResult> {
  if (!delivery.signature) {
    return { ok: false, status: 401, error: "missing signature" };
  }
  try {
    await app.webhooks.verifyAndReceive({
      id: delivery.id,
      name: delivery.name as any,
      payload: delivery.payload,
      signature: delivery.signature,
    });
    return { ok: true, status: 200 };
  } catch (err) {
    // KS-TRACE: S2.1-WEBHOOK-ERROR-CLASSIFY | requirement: a genuine
    // signature-mismatch or malformed-JSON payload is a client error (400).
    // Anything else -- specifically, an exception thrown by a registered
    // event listener for reasons unrelated to payload/signature validity
    // (e.g. a downstream store failure) -- is NOT swallowed here; it is
    // rethrown so the caller's own error boundary (the Cloudflare Worker's
    // app.onError in Session 2.2) can classify and surface it as a 500,
    // rather than this function silently mislabeling an internal failure
    // as if the caller had sent bad input.
    if (isWebhookValidationError(err)) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, status: 400, error: message };
    }
    throw err;
  }
}

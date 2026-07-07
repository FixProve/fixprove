// FixProve GitHub App — Session 2.1: findings callback endpoint
// =================================================================
//
// KS-TRACE: S2.1-CALLBACK | requirement: the customer's GitHub Action POSTs
// {oidcToken, findings[]} here after running `fixprove check` on ITS OWN
// runner. This handler verifies the OIDC token, resolves which pending
// Check Run it refers to using the TOKEN'S OWN verified sha/repository
// claims (never the caller-supplied body fields, which are untrusted input)
// and completes that Check Run | test: callbackHandler.test.ts

import type { App } from "@octokit/app";
import type { JWTVerifyGetKey } from "jose";
import { completeCheckRun, octokitToChecksClient } from "./checkRun.js";
import { OidcVerificationError, verifyGithubActionsOidcToken } from "./oidcVerify.js";
import type { PendingCheckRunStore } from "./pendingStore.js";
import type { Finding } from "./findings.js";

export interface CallbackRequestBody {
  oidcToken: unknown;
  findings: unknown;
}

export interface CallbackResult {
  ok: boolean;
  status: number;
  error?: string;
}

const VALID_REASONS = new Set([
  "dependency-not-installed",
  "dependency-version-mismatch",
  "unresolved-symbol",
]);

// KS-TRACE: S4.3-CALLBACK-PR-REF-PARSE | fix (found live, Session 4.3 B5
// round-trip test): GitHub's Actions OIDC token `sha` claim is the
// ephemeral merge commit for pull_request-triggered runs, never the real
// PR head sha the pending Check Run was created against and keyed by (see
// pendingStore.ts's S4.3-PENDING-STORE-CORRELATION-DEFECT trace for the
// full root cause). The token's `ref` claim, however, IS stable and
// verifiable for this event family: `refs/pull/<number>/merge`. Extracting
// the PR number from it gives a correlation key that actually matches what
// the webhook handler stored, while still coming from the cryptographically
// VERIFIED token (never from client-supplied body fields) -- preserving the
// exact trust boundary S2.1-CALLBACK-REPO-TRUST established. Returns
// undefined (not a throw) for any ref shape that isn't a pull_request merge
// ref -- e.g. a `push` event's `refs/heads/main` -- since correlating those
// is an explicitly out-of-scope future extension (Yehor sign-off, Session
// 4.3: tagged `kind` key added to pendingStore.ts so `push` can be added
// later without another storage migration, but not implemented now) | test:
// test_pr_ref_extracts_number, test_non_pr_ref_returns_undefined
function extractPullRequestNumberFromRef(ref: string): string | undefined {
  const match = /^refs\/pull\/(\d+)\/merge$/.exec(ref);
  return match?.[1];
}

/**
 * KS-TRACE: S2.1-CALLBACK-VALIDATE | requirement: a findings array that
 * isn't actually shaped like Finding[] is rejected outright -- this is the
 * callback-side half of "malformed payloads rejected" (the webhook-side
 * half is handleWebhookDelivery's HMAC check) | test:
 * test_rejects_non_array_findings, test_rejects_finding_missing_fields,
 * test_rejects_finding_with_invalid_reason
 */
export function validateFindings(value: unknown): Finding[] | null {
  if (!Array.isArray(value)) return null;
  const result: Finding[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as any).file !== "string" ||
      typeof (item as any).line !== "number" ||
      typeof (item as any).kind !== "string" ||
      typeof (item as any).expression !== "string" ||
      !VALID_REASONS.has((item as any).reason)
    ) {
      return null;
    }
    result.push(item as Finding);
  }
  return result;
}

/**
 * KS-TRACE: S2.1-CALLBACK-HANDLE | requirement: OIDC verification failure,
 * malformed findings, and "no matching pending check run" are each a
 * DISTINCT rejection (never silently ignored, never crashes) -- and the
 * repository/PR used to look up the pending check run come from the
 * VERIFIED token, not from client-supplied body fields, so a caller cannot
 * point a valid token at a different repo's pending check by lying in the
 * request body | test: test_valid_callback_completes_check_run,
 * test_invalid_oidc_token_rejected, test_malformed_findings_rejected,
 * test_no_pending_check_run_rejected,
 * test_body_repository_field_ignored_in_favor_of_token_claim
 *
 * KS-TRACE: S4.3-CALLBACK-HANDLE-CORRELATION-UPDATE | the lookup key
 * changed from the token's `sha` claim to a PR number parsed from its
 * `ref` claim -- see extractPullRequestNumberFromRef's KS-TRACE and
 * pendingStore.ts's S4.3-PENDING-STORE-CORRELATION-DEFECT trace for why.
 * The trust property is unchanged: `ref`, like `sha`, is a verified token
 * claim, never client-supplied input | test:
 * test_pr_correlation_survives_sha_mismatch, test_non_pr_ref_rejected
 */
export async function handleCallback(
  app: App,
  store: PendingCheckRunStore,
  jwks: JWTVerifyGetKey,
  expectedAudience: string,
  body: CallbackRequestBody
): Promise<CallbackResult> {
  if (typeof body.oidcToken !== "string" || body.oidcToken.length === 0) {
    return { ok: false, status: 401, error: "missing oidcToken" };
  }

  const findings = validateFindings(body.findings);
  if (findings === null) {
    return { ok: false, status: 400, error: "malformed findings payload" };
  }

  // KS-TRACE: S2.1-CALLBACK-REPO-TRUST | requirement: the repository/sha
  // used to look up the pending check run come from the CRYPTOGRAPHICALLY
  // VERIFIED token claims, never from client-supplied body fields. We
  // don't pass `expectedRepository` here (see oidcVerify.ts's
  // S2.1-OIDC-OPTIONAL-REPO) because we don't know which repository to
  // expect until after the signature is verified -- the pending-store
  // lookup below is what actually authorizes which check run a token may
  // complete. A validly-signed token for repo A can only ever match a
  // pending entry that was itself created for repo A's own sha, so it
  // cannot be used to complete a different repository's check run.
  // | test: test_body_repository_field_ignored_in_favor_of_token_claim
  let claims;
  try {
    claims = await verifyGithubActionsOidcToken(body.oidcToken, { expectedAudience, jwks });
  } catch (err) {
    const message = err instanceof OidcVerificationError ? err.message : "OIDC verification failed";
    return { ok: false, status: 401, error: message };
  }

  const [owner, repo] = claims.repository.split("/");
  if (!owner || !repo) {
    return { ok: false, status: 401, error: "OIDC token repository claim is malformed" };
  }

  const prNumber = extractPullRequestNumberFromRef(claims.ref);
  if (prNumber === undefined) {
    // KS-TRACE: S4.3-CALLBACK-NON-PR-REF | a push-event (or any other
    // non-pull_request) ref cannot be correlated today -- fail closed with
    // the same 404 shape as "no pending check run" rather than guessing at
    // a fallback lookup, since no fallback is implemented (see
    // extractPullRequestNumberFromRef's KS-TRACE above).
    return { ok: false, status: 404, error: "no pending check run for this repository/ref" };
  }

  const pending = await store.get(owner, repo, "pr", prNumber);
  if (!pending) {
    return { ok: false, status: 404, error: "no pending check run for this repository/pull request" };
  }

  const octokit = await app.getInstallationOctokit(pending.installationId);
      // KS-TRACE: S2.1-CHECKRUN-DEFECT-001 | fix applied here too: use the
      // octokitToChecksClient adapter rather than an unsafe direct cast
      await completeCheckRun(
        octokitToChecksClient(octokit),
        { owner, repo, checkRunId: pending.checkRunId },
        findings
      );
  await store.delete(owner, repo, "pr", prNumber);

  return { ok: true, status: 200 };
}

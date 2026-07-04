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
 * sha/repository used to look up the pending check run come from the
 * VERIFIED token, not from client-supplied body fields, so a caller cannot
 * point a valid token at a different repo's pending check by lying in the
 * request body | test: test_valid_callback_completes_check_run,
 * test_invalid_oidc_token_rejected, test_malformed_findings_rejected,
 * test_no_pending_check_run_rejected,
 * test_body_repository_field_ignored_in_favor_of_token_claim
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

  const pending = await store.get(owner, repo, claims.sha);
  if (!pending) {
    return { ok: false, status: 404, error: "no pending check run for this repository/sha" };
  }

  const octokit = await app.getInstallationOctokit(pending.installationId);
      // KS-TRACE: S2.1-CHECKRUN-DEFECT-001 | fix applied here too: use the
      // octokitToChecksClient adapter rather than an unsafe direct cast
      await completeCheckRun(
        octokitToChecksClient(octokit),
        { owner, repo, checkRunId: pending.checkRunId },
        findings
      );
  await store.delete(owner, repo, claims.sha);

  return { ok: true, status: 200 };
}

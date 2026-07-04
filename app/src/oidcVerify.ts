// FixProve GitHub App — Session 2.1: GitHub Actions OIDC callback verification
// ================================================================================
//
// KS-TRACE: S2.1-OIDC | requirement: the customer's GitHub Actions run posts
// findings back to our callback endpoint WITHOUT any shared secret we'd have
// to provision/rotate per-installation. Instead it presents a GitHub Actions
// OIDC ID token (requested via `permissions: id-token: write` in their
// workflow), which we verify against GitHub's own public JWKS. This is the
// same trust pattern npm/PyPI "trusted publishing" and cloud OIDC federation
// use -- no long-lived secret ever crosses the wire.
//
// Locked decision (Session 2.1, AI-logged, pending Yehor override): this is
// the ONLY viable way to satisfy "source code never leaves the runner" while
// still letting our App (not the customer's default GITHUB_TOKEN) own and
// complete the Check Run -- see the Keystone Report §"Architectural
// Decisions" for the full reasoning (a repo-scoped GITHUB_TOKEN cannot
// update a Check Run created by a different App/installation).
//
// | test: oidcVerify.test.ts

import { jwtVerify, type JWTVerifyGetKey } from "jose";

export const GITHUB_OIDC_ISSUER = "https://token.actions.githubusercontent.com";

export interface OidcVerifyOptions {
  /** The `aud` claim the customer's workflow must have requested. */
  expectedAudience: string;
  /**
   * "owner/repo" this callback is claimed to be reporting for, if already
   * known. KS-TRACE: S2.1-OIDC-OPTIONAL-REPO | the callback handler does
   * NOT know which repository to expect until after signature verification
   * (the pending-check-run store lookup is what actually authorizes which
   * check run a token may complete -- see callbackHandler.ts's
   * S2.1-CALLBACK-REPO-TRUST). Passing this omits the redundant equality
   * check and returns whatever repository claim the verified signature
   * actually contains; passing it enforces an exact match in addition
   * (used by direct unit tests of this module in isolation).
   */
  expectedRepository?: string;
  /**
   * KS-TRACE: S2.1-OIDC-JWKS-INJECTION | assumption: the real JWKS lookup
   * (`createRemoteJWKSet(new URL(GITHUB_OIDC_ISSUER + "/.well-known/jwks"))`)
   * is the production default, but every test in this session injects a
   * local JWKS instead, so signature/claim verification is tested
   * deterministically without live network calls to GitHub -- consistent
   * with this session's locked "logic-verified, not live-verified" scope.
   */
  jwks: JWTVerifyGetKey;
}

export interface VerifiedOidcClaims {
  repository: string;
  runId: string;
  sha: string;
  ref: string;
}

export class OidcVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OidcVerificationError";
  }
}

/**
 * KS-TRACE: S2.1-OIDC-VERIFY | requirement: a token is accepted ONLY if its
 * signature is valid AND issuer/audience/repository all match expectations.
 * Any single mismatch is a rejection with a specific reason -- never a
 * silent pass-through | test: test_valid_token_accepted,
 * test_wrong_issuer_rejected, test_wrong_audience_rejected,
 * test_wrong_repository_rejected, test_tampered_signature_rejected,
 * test_expired_token_rejected
 */
export async function verifyGithubActionsOidcToken(
  token: string,
  options: OidcVerifyOptions
): Promise<VerifiedOidcClaims> {
  let payload;
  try {
    const result = await jwtVerify(token, options.jwks, {
      issuer: GITHUB_OIDC_ISSUER,
      audience: options.expectedAudience,
    });
    payload = result.payload;
  } catch (err) {
    throw new OidcVerificationError(
      `OIDC token failed verification: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const repository = payload["repository"];
  if (typeof repository !== "string") {
    throw new OidcVerificationError("OIDC token is missing a repository claim");
  }
  if (options.expectedRepository !== undefined && repository !== options.expectedRepository) {
    throw new OidcVerificationError(
      `OIDC token repository claim ("${repository}") does not match expected repository ("${options.expectedRepository}")`
    );
  }

  const runId = payload["run_id"];
  const sha = payload["sha"];
  const ref = payload["ref"];
  if (typeof runId !== "string" || typeof sha !== "string" || typeof ref !== "string") {
    throw new OidcVerificationError("OIDC token is missing required run_id/sha/ref claims");
  }

  return { repository, runId, sha, ref };
}

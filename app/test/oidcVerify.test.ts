// FixProve GitHub App -- Session 2.1: OIDC callback-token verification tests
//
// KS-TRACE: S2.1-OIDC-TEST | "logic-verified, not live-verified" per agreed
// session scope: all tokens here are signed with a locally-generated test
// keypair (see testJwks.ts) against a locally-generated JWKS -- never
// GitHub's real token issuer or JWKS endpoint. Required next step before
// Milestone 2's exit gate: a live E2E test with a real GitHub Actions OIDC
// token from a real workflow run.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createLocalTestJwks } from "./testJwks.js";
import { OidcVerificationError, verifyGithubActionsOidcToken, GITHUB_OIDC_ISSUER } from "../src/oidcVerify.js";

const AUD = "https://fixprove.dev/callback";
const BASE_CLAIMS = { repository: "acme/widgets", run_id: "42", sha: "deadbeef", ref: "refs/heads/main" };

test("valid token with correct issuer/audience/claims verifies successfully", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(BASE_CLAIMS, { audience: AUD });
  const claims = await verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks });
  assert.equal(claims.repository, "acme/widgets");
  assert.equal(claims.runId, "42");
  assert.equal(claims.sha, "deadbeef");
  assert.equal(claims.ref, "refs/heads/main");
});

test("token with wrong audience is rejected", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(BASE_CLAIMS, { audience: "https://evil.example/callback" });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("token with wrong issuer is rejected", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(BASE_CLAIMS, { audience: AUD, issuer: "https://not-github.example" });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("expired token is rejected", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(BASE_CLAIMS, { audience: AUD, expiresInSeconds: -10 });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("token signed by a DIFFERENT keypair (forged / not GitHub's key) is rejected", async () => {
  const legit = await createLocalTestJwks();
  const attacker = await createLocalTestJwks();
  // sign with the attacker's private key, but verify against the legit JWKS
  const token = await attacker.sign(BASE_CLAIMS, { audience: AUD });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks: legit.jwks }),
    OidcVerificationError
  );
});

test("token missing the repository claim is rejected", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const { repository, ...rest } = BASE_CLAIMS;
  const token = await sign(rest, { audience: AUD });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("token missing run_id/sha/ref claims is rejected", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign({ repository: "acme/widgets" }, { audience: AUD });
  await assert.rejects(
    () => verifyGithubActionsOidcToken(token, { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("expectedRepository, when provided, is enforced against the verified claim", async () => {
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(BASE_CLAIMS, { audience: AUD });
  await assert.rejects(
    () =>
      verifyGithubActionsOidcToken(token, {
        expectedAudience: AUD,
        expectedRepository: "someone-else/other-repo",
        jwks,
      }),
    OidcVerificationError
  );
  // and the matching-repository case still succeeds
  const claims = await verifyGithubActionsOidcToken(token, {
    expectedAudience: AUD,
    expectedRepository: "acme/widgets",
    jwks,
  });
  assert.equal(claims.repository, "acme/widgets");
});

test("garbage / non-JWT string is rejected without throwing an unhandled error type", async () => {
  const { jwks } = await createLocalTestJwks();
  await assert.rejects(
    () => verifyGithubActionsOidcToken("not-a-jwt-at-all", { expectedAudience: AUD, jwks }),
    OidcVerificationError
  );
});

test("sanity: the production issuer constant matches GitHub's real OIDC issuer URL", () => {
  assert.equal(GITHUB_OIDC_ISSUER, "https://token.actions.githubusercontent.com");
});

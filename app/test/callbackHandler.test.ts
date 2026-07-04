// FixProve GitHub App -- Session 2.1: OIDC callback -> Checks-complete tests
//
// KS-TRACE: S2.1-CALLBACK-TEST | end-to-end (within this module's own
// boundary) logic test: signs a local test OIDC token, drives it through
// handleCallback against a fake App/store, and asserts the check run is
// completed with the right conclusion. Uses `app.getInstallationOctokit`
// from a REAL @octokit/app App instance (no network call happens unless
// getInstallationOctokit is actually invoked with real credentials -- it
// is, but the resulting Octokit's `.request()` is never called by this
// code path in these tests because getInstallationOctokit itself would
// need live GitHub App credentials to succeed) -- so instead this suite
// stubs `app.getInstallationOctokit` directly. This is exactly the
// "logic-verified, not live-verified" boundary named for this session: a
// real GitHub App + a real installation token exchange is explicit
// out-of-scope, deferred to live E2E verification (see Keystone Report).

import { test } from "node:test";
import assert from "node:assert/strict";
import { App } from "@octokit/app";
import { handleCallback, validateFindings } from "../src/callbackHandler.js";
import { InMemoryPendingCheckRunStore } from "../src/pendingStore.js";
import { createLocalTestJwks } from "./testJwks.js";

const AUD = "https://fixprove.dev/callback";

function buildTestApp() {
  return new App({ appId: 123456, privateKey: "test-placeholder-not-a-real-key", webhooks: { secret: "s" } });
}

function stubInstallationOctokit(app: App, requestCalls: Array<{ route: string; params: unknown }>) {
  (app as any).getInstallationOctokit = async (_installationId: number) => ({
    async request(route: string, params?: Record<string, unknown>) {
      requestCalls.push({ route, params });
      if (route.startsWith("POST")) return { data: { id: 1 } };
      return { data: {} };
    },
  });
}

test("validateFindings: valid array of Finding-shaped objects passes", () => {
  const result = validateFindings([
    { file: "a.py", line: 1, kind: "call", expression: "x.y", reason: "unresolved-symbol" },
  ]);
  assert.ok(result);
  assert.equal(result?.length, 1);
});

test("validateFindings: non-array is rejected", () => {
  assert.equal(validateFindings({ not: "an array" }), null);
});

test("validateFindings: item missing a required field is rejected", () => {
  assert.equal(validateFindings([{ file: "a.py", line: 1, kind: "call" }]), null);
});

test("validateFindings: item with an invalid reason enum value is rejected", () => {
  assert.equal(
    validateFindings([{ file: "a.py", line: 1, kind: "call", expression: "x", reason: "made-up-reason" }]),
    null
  );
});

test("empty findings array is VALID (clean pass), not rejected as malformed", () => {
  assert.deepEqual(validateFindings([]), []);
});

test("valid callback with seeded findings completes the check run as a failure naming the symbol", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", sha: "deadbeef", checkRunId: 42, installationId: 7, createdAt: 0 });

  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(
    { repository: "acme/widgets", run_id: "1", sha: "deadbeef", ref: "refs/heads/main" },
    { audience: AUD }
  );

  const result = await handleCallback(app, store, jwks, AUD, {
    oidcToken: token,
    findings: [{ file: "src/a.py", line: 10, kind: "call", expression: "requests.gett", reason: "unresolved-symbol" }],
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
  const updateCall = requestCalls.find((c) => c.route.startsWith("PATCH"));
  assert.ok(updateCall);
  const output = (updateCall!.params as any).output;
  assert.match(output.summary, /requests\.gett/);
  assert.match(output.summary, /src\/a\.py:10/);
  assert.equal((updateCall!.params as any).conclusion, "failure");
  // pending entry consumed after completion
  assert.equal(await store.get("acme", "widgets", "deadbeef"), undefined);
});

test("valid callback with EMPTY findings completes the check run as a clean success (not an error)", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "empty-diff-repo", sha: "nodiff000", checkRunId: 1, installationId: 7, createdAt: 0 });

  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(
    { repository: "acme/empty-diff-repo", run_id: "1", sha: "nodiff000", ref: "refs/heads/main" },
    { audience: AUD }
  );

  const result = await handleCallback(app, store, jwks, AUD, { oidcToken: token, findings: [] });
  assert.equal(result.ok, true);
  const updateCall = requestCalls.find((c) => c.route.startsWith("PATCH"));
  assert.equal((updateCall!.params as any).conclusion, "success");
});

test("invalid/forged OIDC token is rejected with 401, check run never touched", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", sha: "deadbeef", checkRunId: 42, installationId: 7, createdAt: 0 });

  const result = await handleCallback(app, store, (await createLocalTestJwks()).jwks, AUD, {
    oidcToken: "not-a-real-token",
    findings: [],
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
  assert.equal(requestCalls.length, 0);
  // pending entry untouched
  assert.ok(await store.get("acme", "widgets", "deadbeef"));
});

test("malformed findings payload is rejected with 400 before OIDC is even checked", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore();
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign({ repository: "acme/widgets", run_id: "1", sha: "x", ref: "refs/heads/main" }, { audience: AUD });

  const result = await handleCallback(app, store, jwks, AUD, { oidcToken: token, findings: { not: "an array" } });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("no pending check run for the token's repository/sha is rejected with 404, not silently accepted", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore(); // nothing stored
  const { jwks, sign } = await createLocalTestJwks();
  const token = await sign(
    { repository: "acme/widgets", run_id: "1", sha: "never-seen-sha", ref: "refs/heads/main" },
    { audience: AUD }
  );

  const result = await handleCallback(app, store, jwks, AUD, { oidcToken: token, findings: [] });
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
  assert.equal(requestCalls.length, 0);
});

// KS-TRACE: S2.1-CALLBACK-REPO-TRUST-TEST | adversarial: a caller cannot
// point a validly-signed token at a DIFFERENT repository's pending check by
// lying in the request body -- the body has no "repository" field the
// handler even reads; only the verified token claim matters.
test("body has no way to override which repo's check run is targeted -- lookup uses only the verified token claim", async () => {
  const app = buildTestApp();
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  stubInstallationOctokit(app, requestCalls);
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "victim", repo: "secret-repo", sha: "victimsha", checkRunId: 1, installationId: 7, createdAt: 0 });

  const { jwks, sign } = await createLocalTestJwks();
  // token is legitimately signed, but for a DIFFERENT repo than the victim's
  const token = await sign(
    { repository: "attacker/other-repo", run_id: "1", sha: "victimsha", ref: "refs/heads/main" },
    { audience: AUD }
  );

  const result = await handleCallback(app, store, jwks, AUD, { oidcToken: token, findings: [] });
  // attacker/other-repo + victimsha was never stored -> 404, victim's check run untouched
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
  assert.equal(requestCalls.length, 0);
  assert.ok(await store.get("victim", "secret-repo", "victimsha"));
});

test("missing oidcToken field entirely is rejected with 401", async () => {
  const app = buildTestApp();
  const store = new InMemoryPendingCheckRunStore();
  const { jwks } = await createLocalTestJwks();
  const result = await handleCallback(app, store, jwks, AUD, { oidcToken: undefined, findings: [] });
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
});

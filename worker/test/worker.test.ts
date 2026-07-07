// FixProve Worker -- Session 2.2: Hono route + KV-failure adversarial tests
//
// KS-TRACE: S2.2-WORKER-TEST | drives the Hono app directly via
// `app.request()` (works in plain Node -- Hono does not require an actual
// Cloudflare runtime for this), with a fake env supplying a fake
// KVNamespace and throwaway GitHub App credentials. This is "logic-
// verified, not live-verified" for the same reason Session 2.1's App
// tests were: no real Cloudflare Worker deployment, no real GitHub App
// credentials, no real network calls.

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { App as OctokitApp } from "@octokit/app";
import { app as honoApp, __resetCacheForTests, type Env } from "../src/index.js";
import { createFakeKv, createFailingFakeKv } from "./fakeKv.js";
import { createLocalTestJwks } from "./testJwks.js";

function testEnv(kv: any): Env {
  return {
    PENDING_CHECKS_KV: kv,
    GITHUB_APP_ID: "123456",
    GITHUB_APP_PRIVATE_KEY: "test-placeholder-not-a-real-key",
    GITHUB_WEBHOOK_SECRET: "test-secret",
    CALLBACK_AUDIENCE: "https://fixprove.dev/callback",
  };
}

beforeEach(() => {
  __resetCacheForTests();
});

test("POST /webhooks with a valid signature returns 200", async () => {
  const kv = createFakeKv();
  const env = testEnv(kv.asKvNamespace());
  // sign with the SAME secret the Worker will construct its App with
  const signer = new OctokitApp({ appId: 123456, privateKey: "x", webhooks: { secret: "test-secret" } });
  const payload = JSON.stringify({ zen: "test" });
  const signature = await signer.webhooks.sign(payload);

  const res = await honoApp.request(
    "/webhooks",
    {
      method: "POST",
      headers: {
        "x-github-delivery": "1",
        "x-github-event": "ping",
        "x-hub-signature-256": signature,
        "content-type": "application/json",
      },
      body: payload,
    },
    env
  );
  assert.equal(res.status, 200);
  const body = await res.json() as any;
  assert.equal(body.ok, true);
});

test("POST /webhooks with an invalid signature returns 400 (routed through Hono, not silently accepted)", async () => {
  const kv = createFakeKv();
  const env = testEnv(kv.asKvNamespace());
  const payload = JSON.stringify({ zen: "test" });

  const res = await honoApp.request(
    "/webhooks",
    {
      method: "POST",
      headers: {
        "x-github-delivery": "1",
        "x-github-event": "ping",
        "x-hub-signature-256": "sha256=deadbeef",
      },
      body: payload,
    },
    env
  );
  assert.equal(res.status, 400);
});

test("POST /webhooks with no signature header returns 401", async () => {
  const kv = createFakeKv();
  const env = testEnv(kv.asKvNamespace());
  const res = await honoApp.request(
    "/webhooks",
    { method: "POST", headers: { "x-github-event": "ping" }, body: JSON.stringify({}) },
    env
  );
  assert.equal(res.status, 401);
});

test("POST /callback with malformed JSON body returns 400, not a hang or 500", async () => {
  const kv = createFakeKv();
  const env = testEnv(kv.asKvNamespace());
  const res = await honoApp.request(
    "/callback",
    { method: "POST", headers: { "content-type": "application/json" }, body: "{not json" },
    env
  );
  assert.equal(res.status, 400);
});

test("POST /callback with missing oidcToken returns 401", async () => {
  const kv = createFakeKv();
  const env = testEnv(kv.asKvNamespace());
  const res = await honoApp.request(
    "/callback",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ findings: [] }),
    },
    env
  );
  assert.equal(res.status, 401);
});

// -- adversarial: KV failure surfaces as a clean 500, never a hang --

// KS-TRACE: S2.2-WEBHOOK-KV-TEST-SCOPE | honest limitation discovered
// WHILE writing this test (not asserted from theory): driving a
// pull_request event through the REAL @octokit/app dispatch
// (registerPullRequestHandler / app.webhooks.on) requires @octokit/app to
// build a genuinely-authenticated installation Octokit BEFORE our
// pull_request listener's KV write is ever reached -- that authentication
// step signs a real JWT from the configured private key and (even with a
// syntactically valid key) would need to reach GitHub's real token
// endpoint over the network. Confirmed directly: with this test's
// placeholder (non-PEM) private key, authentication fails with a
// crypto/key-parsing error BEFORE the KV put is ever attempted -- so a
// simulated "KV put failure" specifically cannot be isolated through this
// code path without live GitHub App credentials, mirroring Session 2.1's
// own "logic-verified, not live-verified" boundary. What CAN be verified
// here, and is the actual point of the acceptance criterion ("KV read/
// write failures must be caught and handled gracefully"), is that ANY
// internal failure inside the pull_request listener -- whatever its cause
// -- is correctly classified as a 500 by webhookHandler.ts's
// S2.2-WEBHOOK-ERROR-CLASSIFY-DEFECT fix, never misreported as a 400. The
// KV store's OWN failure -> 500 propagation is verified precisely and in
// isolation by the callback-path test below (which does not require
// Octokit authentication before reaching the store) and by
// kvPendingStore.test.ts's direct unit tests of KVStoreError.
test("an internal failure inside the pull_request listener (e.g. auth/KV) is classified as 500, never misreported as 400", async () => {
  const failingKv = createFailingFakeKv(new Set(["put"]));
  const env = testEnv(failingKv);
  const signer = new OctokitApp({ appId: 123456, privateKey: "x", webhooks: { secret: "test-secret" } });
  const payload = JSON.stringify({
    action: "opened",
    number: 3,
    repository: { owner: { login: "acme" }, name: "widgets" },
    pull_request: { head: { sha: "abc123" } },
    installation: { id: 99 },
  });
  const signature = await signer.webhooks.sign(payload);

  const res = await honoApp.request(
    "/webhooks",
    {
      method: "POST",
      headers: {
        "x-github-delivery": "1",
        "x-github-event": "pull_request",
        "x-hub-signature-256": signature,
        "content-type": "application/json",
      },
      body: payload,
    },
    env
  );
  assert.equal(res.status, 500);
  const body = await res.json() as any;
  assert.equal(body.ok, false);
});

// KS-TRACE: S2.2-CALLBACK-KV-TEST | unlike the webhook path above, the
// callback path calls `store.get()` BEFORE any Octokit authentication (see
// callbackHandler.ts: the pending-store lookup happens before
// `app.getInstallationOctokit` is ever called), so a KV get failure here
// genuinely IS reached and isolated, given a validly-signed OIDC token.
// This test injects a local test JWKS via the Worker's __testJwks escape
// hatch (see index.ts's S2.2-WORKER-TEST-JWKS) specifically so OIDC
// verification succeeds and execution reaches the KV lookup -- without
// this, only the "invalid token -> 401" path would ever be exercised.
test("KV failure during the callback path (looking up a pending check run) returns 500 with the classified KV error message", async () => {
  const failingKv = createFailingFakeKv(new Set(["get"]));
  const { jwks, sign } = await createLocalTestJwks();
  const env = { ...testEnv(failingKv), __testJwks: jwks };
  // KS-TRACE: S4.3-WORKER-TEST-CORRELATION-UPDATE | ref must be a
  // pull_request merge ref now, or execution would reject at the
  // ref-parsing guard (404) before ever reaching the KV get() this test
  // exists to exercise -- see callbackHandler.ts's
  // extractPullRequestNumberFromRef KS-TRACE.
  const token = await sign(
    { repository: "acme/widgets", run_id: "1", sha: "deadbeef", ref: "refs/pull/5/merge" },
    { audience: "https://fixprove.dev/callback" }
  );

  const res = await honoApp.request(
    "/callback",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ oidcToken: token, findings: [] }),
    },
    env
  );
  assert.equal(res.status, 500);
  const body = await res.json() as any;
  assert.equal(body.ok, false);
  assert.match(body.error, /KV get failed/);
});

test("sanity: with a WORKING KV and a valid token but no matching pending entry, callback returns 404 -- not 500 -- confirming the 500 above is genuinely KV-specific", async () => {
  const kv = createFakeKv();
  const { jwks, sign } = await createLocalTestJwks();
  const env = { ...testEnv(kv.asKvNamespace()), __testJwks: jwks };
  const token = await sign(
    { repository: "acme/widgets", run_id: "1", sha: "never-seen-sha", ref: "refs/pull/6/merge" },
    { audience: "https://fixprove.dev/callback" }
  );

  const res = await honoApp.request(
    "/callback",
    { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ oidcToken: token, findings: [] }) },
    env
  );
  assert.equal(res.status, 404);
});

// FixProve GitHub App -- Session 2.1: pull_request webhook logic tests
//
// KS-TRACE: S2.1-WEBHOOK-TEST | handlePullRequestEvent is tested directly
// as a pure function against a fake request()-only Octokit + in-memory
// store -- no real @octokit/app webhook dispatch needed for this logic.
// HMAC signature verification (handleWebhookDelivery) IS tested against a
// real @octokit/app App + real @octokit/webhooks signing, since that part
// needs no network access at all (pure crypto), so there is no reason to
// fake it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { App } from "@octokit/app";
import { Webhooks } from "@octokit/webhooks";
import { handlePullRequestEvent, handleWebhookDelivery, type PullRequestEventPayload } from "../src/webhookHandler.js";
import { InMemoryPendingCheckRunStore } from "../src/pendingStore.js";

// KS-TRACE: S2.1-WEBHOOK-TEST-KEY | assumption (confirmed by direct probe
// against the real @octokit/app constructor before relying on it): the App
// constructor does NOT eagerly validate/parse the RSA private key -- it is
// only used lazily when an actual authenticated API call is made. Since
// these tests never authenticate (they only exercise HMAC webhook-signature
// verification, which uses the separate `webhookSecret` string), a
// non-cryptographic placeholder string is sufficient and does not
// constitute testing against a fake-but-plausible key.
const TEST_PRIVATE_KEY = "test-placeholder-not-a-real-key";

function fakeOctokit() {
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  const octokit = {
    async request(route: string, params?: Record<string, unknown>) {
      requestCalls.push({ route, params });
      return { data: { id: 555 } };
    },
  };
  return { octokit, requestCalls };
}

test("opened action creates a pending check run and stores it", async () => {
  const { octokit } = fakeOctokit();
  const store = new InMemoryPendingCheckRunStore();
  const payload: PullRequestEventPayload = {
    action: "opened",
    number: 3,
    repository: { owner: { login: "acme" }, name: "widgets" },
    pull_request: { head: { sha: "abc123" } },
    installation: { id: 99 },
  };
  await handlePullRequestEvent(octokit, store, payload);
  // KS-TRACE: S4.3-WEBHOOK-PR-NUMBER-TEST | lookup is now by (owner, repo,
  // "pr", PR NUMBER) -- not by sha, per pendingStore.ts's
  // S4.3-PENDING-STORE-CORRELATION-DEFECT fix.
  const pending = await store.get("acme", "widgets", "pr", "3");
  assert.ok(pending);
  assert.equal(pending?.checkRunId, 555);
  assert.equal(pending?.installationId, 99);
  assert.equal(pending?.headSha, "abc123");
});

test("synchronize action creates a pending check run", async () => {
  const { octokit } = fakeOctokit();
  const store = new InMemoryPendingCheckRunStore();
  const payload: PullRequestEventPayload = {
    action: "synchronize",
    number: 4,
    repository: { owner: { login: "acme" }, name: "widgets" },
    pull_request: { head: { sha: "def456" } },
    installation: { id: 99 },
  };
  await handlePullRequestEvent(octokit, store, payload);
  assert.ok(await store.get("acme", "widgets", "pr", "4"));
});

test("irrelevant action (e.g. 'labeled') is ignored: no check run created, no error", async () => {
  const { octokit, requestCalls } = fakeOctokit();
  const store = new InMemoryPendingCheckRunStore();
  const payload: PullRequestEventPayload = {
    action: "labeled",
    number: 5,
    repository: { owner: { login: "acme" }, name: "widgets" },
    pull_request: { head: { sha: "abc123" } },
    installation: { id: 99 },
  };
  await handlePullRequestEvent(octokit, store, payload);
  assert.equal(requestCalls.length, 0);
  assert.equal(await store.get("acme", "widgets", "pr", "5"), undefined);
});

test("missing installation id is skipped, not thrown", async () => {
  const { octokit, requestCalls } = fakeOctokit();
  const store = new InMemoryPendingCheckRunStore();
  const payload: PullRequestEventPayload = {
    action: "opened",
    number: 6,
    repository: { owner: { login: "acme" }, name: "widgets" },
    pull_request: { head: { sha: "abc123" } },
  };
  await assert.doesNotReject(() => handlePullRequestEvent(octokit, store, payload));
  assert.equal(requestCalls.length, 0);
});

// -- HMAC signature verification (real @octokit/webhooks crypto, no network) --

function buildTestApp() {
  return new App({ appId: 123456, privateKey: TEST_PRIVATE_KEY, webhooks: { secret: "test-secret" } });
}

test("valid signature is accepted", async () => {
  const app = buildTestApp();
  app.webhooks.on("ping", async () => {});
  const payload = JSON.stringify({ zen: "test" });
  const signature = await app.webhooks.sign(payload);
  const result = await handleWebhookDelivery(app, { id: "1", name: "ping", payload, signature });
  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
});

test("invalid signature is rejected", async () => {
  const app = buildTestApp();
  app.webhooks.on("ping", async () => {});
  const payload = JSON.stringify({ zen: "test" });
  const result = await handleWebhookDelivery(app, { id: "1", name: "ping", payload, signature: "sha256=deadbeef" });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("missing signature is rejected with 401, not a crash", async () => {
  const app = buildTestApp();
  const payload = JSON.stringify({ zen: "test" });
  const result = await handleWebhookDelivery(app, { id: "1", name: "ping", payload, signature: undefined });
  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
});

test("malformed JSON body is rejected, not thrown as an unhandled exception", async () => {
  const app = buildTestApp();
  app.webhooks.on("ping", async () => {});
  const payload = "{not: valid json";
  const signature = await app.webhooks.sign(payload);
  const result = await handleWebhookDelivery(app, { id: "1", name: "ping", payload, signature });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

// KS-TRACE: S2.2-WEBHOOK-ERROR-CLASSIFY-DEFECT-REGRESSION | this is the
// exact defect the worker/'s adversarial KV-failure test caught: a
// registered listener throwing for reasons OTHER than payload/signature
// validity must NOT be swallowed into a misleading 400. This test uses a
// generic listener error (no KV/store dependency needed here -- the
// point is the classification logic in webhookHandler.ts itself, which is
// KV-agnostic) to lock in the fix at the unit level, independent of the
// Worker-level integration test that originally surfaced it.
test("a registered listener throwing an unrelated internal error is NOT swallowed as a 400 -- it propagates for the caller to classify", async () => {
  const app = buildTestApp();
  app.webhooks.on("pull_request", async () => {
    throw new Error("simulated internal failure (e.g. a downstream store outage)");
  });
  const payload = JSON.stringify({ action: "opened" });
  const signature = await app.webhooks.sign(payload);
  await assert.rejects(
    () => handleWebhookDelivery(app, { id: "1", name: "pull_request", payload, signature }),
    /simulated internal failure/
  );
});

// KS-TRACE: S2.1-ADVERSARIAL-NO-CHANGES | acceptance criterion: "a PR with
// no code changes must produce a clean PASS, not an error." This webhook
// layer's own contract is simply "create a pending check run + store it";
// the actual PASS/FAIL determination happens later in completeCheckRun via
// findings.length === 0 -> success (see checkRun.test.ts's
// "completeCheckRun with empty findings" case). This test confirms the
// webhook-creation step itself behaves identically regardless of what the
// eventual findings will be -- it never inspects diff content, so a
// no-changes PR takes the exact same non-error path as any other PR.
test("webhook layer treats a PR with (as far as it's concerned) no special-cased diff content uniformly -- never errors regardless of downstream findings", async () => {
  const { octokit, requestCalls } = fakeOctokit();
  const store = new InMemoryPendingCheckRunStore();
  const payload: PullRequestEventPayload = {
    action: "opened",
    number: 7,
    repository: { owner: { login: "acme" }, name: "empty-diff-repo" },
    pull_request: { head: { sha: "nodiff000" } },
    installation: { id: 99 },
  };
  await assert.doesNotReject(() => handlePullRequestEvent(octokit, store, payload));
  assert.equal(requestCalls.length, 1);
  assert.ok(await store.get("acme", "empty-diff-repo", "pr", "7"));
});

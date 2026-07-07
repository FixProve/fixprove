// FixProve GitHub App -- Session 2.2: injectable store DI test
//
// KS-TRACE: S2.2-STORE-INJECT-TEST | confirms createFixProveApp uses a
// caller-supplied PendingCheckRunStore when given one (this is what lets
// worker/ swap in a KV-backed store without any change to app logic), and
// still defaults to InMemoryPendingCheckRunStore when omitted (keeps
// Session 2.1's existing behavior/tests unchanged).

import { test } from "node:test";
import assert from "node:assert/strict";
import { createFixProveApp } from "../src/index.js";
import { InMemoryPendingCheckRunStore, type PendingCheckRunStore } from "../src/pendingStore.js";

const BASE_CONFIG = {
  appId: 123456,
  privateKey: "test-placeholder-not-a-real-key",
  webhookSecret: "test-secret",
  callbackAudience: "https://fixprove.dev/callback",
};

test("defaults to an InMemoryPendingCheckRunStore when no store is provided", () => {
  const fixprove = createFixProveApp(BASE_CONFIG);
  assert.ok(fixprove.store instanceof InMemoryPendingCheckRunStore);
});

test("uses the caller-supplied store when provided, not the in-memory default", async () => {
  const calls: string[] = [];
  const customStore: PendingCheckRunStore = {
    async put() {
      calls.push("put");
    },
    async get() {
      calls.push("get");
      return undefined;
    },
    async delete() {
      calls.push("delete");
    },
  };
  const fixprove = createFixProveApp({ ...BASE_CONFIG, store: customStore });
  assert.equal(fixprove.store, customStore);
  await fixprove.store.get("acme", "widgets", "pr", "3");
  assert.deepEqual(calls, ["get"]);
});

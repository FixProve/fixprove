import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryPendingCheckRunStore } from "../src/pendingStore.js";

test("put then get returns the entry", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", sha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  const got = await store.get("acme", "widgets", "abc");
  assert.equal(got?.checkRunId, 1);
});

test("get on missing entry returns undefined", async () => {
  const store = new InMemoryPendingCheckRunStore();
  const got = await store.get("acme", "widgets", "nope");
  assert.equal(got, undefined);
});

test("delete removes the entry", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", sha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  await store.delete("acme", "widgets", "abc");
  assert.equal(await store.get("acme", "widgets", "abc"), undefined);
});

test("owner/repo lookups are case-insensitive", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "Acme", repo: "Widgets", sha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  const got = await store.get("acme", "widgets", "abc");
  assert.equal(got?.checkRunId, 1);
});

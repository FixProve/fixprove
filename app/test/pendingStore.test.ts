import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryPendingCheckRunStore } from "../src/pendingStore.js";

test("put then get returns the entry", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", kind: "pr", correlationId: "3", headSha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  const got = await store.get("acme", "widgets", "pr", "3");
  assert.equal(got?.checkRunId, 1);
});

test("get on missing entry returns undefined", async () => {
  const store = new InMemoryPendingCheckRunStore();
  const got = await store.get("acme", "widgets", "pr", "999");
  assert.equal(got, undefined);
});

test("delete removes the entry", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", kind: "pr", correlationId: "3", headSha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  await store.delete("acme", "widgets", "pr", "3");
  assert.equal(await store.get("acme", "widgets", "pr", "3"), undefined);
});

test("owner/repo lookups are case-insensitive", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "Acme", repo: "Widgets", kind: "pr", correlationId: "3", headSha: "abc", checkRunId: 1, installationId: 7, createdAt: 0 });
  const got = await store.get("acme", "widgets", "pr", "3");
  assert.equal(got?.checkRunId, 1);
});

// KS-TRACE: S4.3-PENDING-STORE-CORRELATION-DEFECT (adversarial) | the whole
// point of tagging the key with `kind` is that a future "push" correlation
// entry must never collide with a "pr" entry that happens to share the
// same correlationId string (e.g. a PR number "123" vs. a sha that happens
// to start with digits interpreted loosely). This locks that in now, even
// though "push" isn't implemented yet, so the key shape can't silently
// regress into a collision-prone one later.
test("a 'pr' entry and a 'push' entry with the same correlationId value do not collide", async () => {
  const store = new InMemoryPendingCheckRunStore();
  await store.put({ owner: "acme", repo: "widgets", kind: "pr", correlationId: "abc123", headSha: "prsha", checkRunId: 1, installationId: 7, createdAt: 0 });
  await store.put({ owner: "acme", repo: "widgets", kind: "push", correlationId: "abc123", headSha: "abc123", checkRunId: 2, installationId: 7, createdAt: 0 });
  assert.equal((await store.get("acme", "widgets", "pr", "abc123"))?.checkRunId, 1);
  assert.equal((await store.get("acme", "widgets", "push", "abc123"))?.checkRunId, 2);
});

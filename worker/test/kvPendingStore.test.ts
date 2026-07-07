import { test } from "node:test";
import assert from "node:assert/strict";
import { KVPendingCheckRunStore, KVStoreError } from "../src/kvPendingStore.js";
import { createFakeKv, createFailingFakeKv } from "./fakeKv.js";

// KS-TRACE: S4.3-KV-STORE-CORRELATION-UPDATE-TEST | mirrors
// kvPendingStore.ts's S4.3-KV-STORE-CORRELATION-UPDATE fix: entries are now
// keyed by (owner, repo, kind, correlationId), not (owner, repo, sha).
const ENTRY = { owner: "acme", repo: "widgets", kind: "pr" as const, correlationId: "10", headSha: "abc123", checkRunId: 1, installationId: 7, createdAt: 0 };

test("put then get returns the entry (accurate KV round-trip)", async () => {
  const kv = createFakeKv();
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  await store.put(ENTRY);
  const got = await store.get("acme", "widgets", "pr", "10");
  assert.deepEqual(got, ENTRY);
});

test("get on a missing key returns undefined, not an error", async () => {
  const kv = createFakeKv();
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  assert.equal(await store.get("acme", "widgets", "pr", "999"), undefined);
});

test("delete removes the entry", async () => {
  const kv = createFakeKv();
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  await store.put(ENTRY);
  await store.delete("acme", "widgets", "pr", "10");
  assert.equal(await store.get("acme", "widgets", "pr", "10"), undefined);
});

test("owner/repo lookups are case-insensitive (same semantics as InMemoryPendingCheckRunStore)", async () => {
  const kv = createFakeKv();
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  await store.put({ ...ENTRY, owner: "Acme", repo: "Widgets" });
  assert.deepEqual(await store.get("acme", "widgets", "pr", "10"), { ...ENTRY, owner: "Acme", repo: "Widgets" });
});

// -- adversarial: KV failures are classified, never a silent hang --

test("KV put failure throws a classified KVStoreError, not a bare/uncaught error", async () => {
  const store = new KVPendingCheckRunStore(createFailingFakeKv(new Set(["put"])));
  await assert.rejects(() => store.put(ENTRY), (err: unknown) => {
    assert.ok(err instanceof KVStoreError);
    assert.equal(err.operation, "put");
    return true;
  });
});

test("KV get failure throws a classified KVStoreError", async () => {
  const store = new KVPendingCheckRunStore(createFailingFakeKv(new Set(["get"])));
  await assert.rejects(() => store.get("acme", "widgets", "pr", "10"), (err: unknown) => {
    assert.ok(err instanceof KVStoreError);
    assert.equal(err.operation, "get");
    return true;
  });
});

test("KV delete failure throws a classified KVStoreError", async () => {
  const store = new KVPendingCheckRunStore(createFailingFakeKv(new Set(["delete"])));
  await assert.rejects(() => store.delete("acme", "widgets", "pr", "10"), (err: unknown) => {
    assert.ok(err instanceof KVStoreError);
    assert.equal(err.operation, "delete");
    return true;
  });
});

test("a corrupted (non-JSON) stored value surfaces as a classified KVStoreError on get, not an uncaught SyntaxError", async () => {
  const kv = createFakeKv();
  kv.data.set("acme/widgets#pr:corrupt-id", "{not valid json");
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  await assert.rejects(() => store.get("acme", "widgets", "pr", "corrupt-id"), (err: unknown) => {
    assert.ok(err instanceof KVStoreError);
    assert.equal(err.operation, "get");
    return true;
  });
});

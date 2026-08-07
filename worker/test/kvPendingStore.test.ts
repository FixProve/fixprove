import { test } from "node:test";
import assert from "node:assert/strict";
import { KVPendingCheckRunStore, KVStoreError, PENDING_CHECK_RUN_TTL_SECONDS } from "../src/kvPendingStore.js";
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

// KS-TRACE: LEGAL-4.12K-TTL-SAFETY-NET-TEST | requirement: PITFALL row 4 /
// GDPR Art 5(1)(e) -- every put must carry the safety-net TTL so a pending
// correlation record cannot persist indefinitely if the customer's CI never
// calls back. Explicit delete-on-completion (callbackHandler.ts) is the
// normal path and is unaffected by this -- this test only guards the
// abnormal one.
test("put sets an expirationTtl safety-net matching PENDING_CHECK_RUN_TTL_SECONDS", async () => {
  const kv = createFakeKv();
  const store = new KVPendingCheckRunStore(kv.asKvNamespace());
  await store.put(ENTRY);
  const k = "acme/widgets#pr:10";
  assert.deepEqual(kv.putOptions.get(k), { expirationTtl: PENDING_CHECK_RUN_TTL_SECONDS });
  assert.equal(PENDING_CHECK_RUN_TTL_SECONDS, 86400, "safety-net TTL is 24h, matching the Privacy Policy v2 disclosure");
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

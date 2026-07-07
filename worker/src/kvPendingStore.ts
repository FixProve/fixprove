// FixProve Worker -- Session 2.2: Cloudflare KV-backed pending-check-run store
// ==================================================================================
//
// KS-TRACE: S2.2-KV-STORE | requirement: replace Session 2.1's in-memory
// PendingCheckRunStore with a durable, multi-instance-safe one so a pending
// check run survives a Worker restart/cold-start and is visible across
// concurrently-running Worker instances (the exact limitation named in
// Session 2.1's Keystone Report §4 item 2). Implements the SAME
// PendingCheckRunStore interface from @fixprove/github-app, so
// webhookHandler.ts/callbackHandler.ts require ZERO changes -- this is
// only possible because Session 2.2 made the store an injectable
// constructor param (see app/src/index.ts's S2.2-STORE-INJECT trace)
// | test: kvPendingStore.test.ts

import type {
  PendingCheckRun,
  PendingCheckRunKind,
  PendingCheckRunStore,
} from "@fixprove/github-app/dist/src/pendingStore.js";

// KS-TRACE: S2.2-KV-STORE-ERROR | requirement (adversarial acceptance
// criterion): "KV read/write failures must be caught and handled
// gracefully (500 response, not a silent hang)". A silent hang is
// impossible here regardless (KVNamespace operations are Promises that
// either resolve or reject -- there is no code path that can wait forever)
// but a REJECTED promise, if left uncaught anywhere in the call chain,
// would surface as an unhandled-rejection crash rather than a classified
// error the Worker's top-level handler can turn into a clean 500. This
// class exists so callers (the Worker's route handlers) can
// `instanceof`-check and log/classify KV failures distinctly from other
// error types, rather than treating every failure alike.
export class KVStoreError extends Error {
  constructor(
    public readonly operation: "put" | "get" | "delete",
    cause: unknown
  ) {
    super(
      `KV ${operation} failed: ${cause instanceof Error ? cause.message : String(cause)}`
    );
    this.name = "KVStoreError";
    this.cause = cause;
  }
}

// KS-TRACE: S4.3-KV-STORE-CORRELATION-UPDATE | mirrors pendingStore.ts's
// S4.3-PENDING-STORE-CORRELATION-DEFECT fix verbatim -- same key shape,
// same reasoning, copied rather than re-derived so the two
// PendingCheckRunStore implementations cannot silently drift (consistent
// with this file's original design intent, see S2.2-KV-STORE-IMPL below).
function key(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}#${kind}:${correlationId}`;
}

/**
 * KS-TRACE: S2.2-KV-STORE-IMPL | requirement: identical (owner, repo, sha)
 * lookup semantics to InMemoryPendingCheckRunStore (same case-insensitive
 * key function, copied verbatim rather than re-derived, so behavior can't
 * silently drift between the two implementations) -- accurate KV
 * read/write is verified with a real (in-memory-simulated) KVNamespace-
 * shaped fake in tests, and failure injection is verified with a
 * deliberately-throwing fake | test: test_put_then_get_returns_entry,
 * test_get_missing_returns_undefined, test_delete_removes_entry,
 * test_owner_repo_case_insensitive, test_kv_put_failure_throws_kv_store_error,
 * test_kv_get_failure_throws_kv_store_error,
 * test_kv_delete_failure_throws_kv_store_error
 */
export class KVPendingCheckRunStore implements PendingCheckRunStore {
  constructor(private readonly kv: KVNamespace) {}

  async put(entry: PendingCheckRun): Promise<void> {
    const k = key(entry.owner, entry.repo, entry.kind, entry.correlationId);
    try {
      await this.kv.put(k, JSON.stringify(entry));
    } catch (err) {
      throw new KVStoreError("put", err);
    }
  }

  async get(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<PendingCheckRun | undefined> {
    const k = key(owner, repo, kind, correlationId);
    let raw: string | null;
    try {
      raw = await this.kv.get(k);
    } catch (err) {
      throw new KVStoreError("get", err);
    }
    if (raw === null) {
      return undefined;
    }
    // KS-TRACE: S2.2-KV-STORE-CORRUPT-VALUE | assumption: a value stored
    // under a key we ourselves wrote is always valid JSON matching
    // PendingCheckRun's shape. If KV ever returns a corrupted/foreign value
    // (should not happen under normal operation, but KV is external state
    // outside this process's control), JSON.parse throwing is treated the
    // same as a genuine KV failure -- surfaced as a KVStoreError("get", ...)
    // rather than an uncaught SyntaxError, so it still resolves to a clean
    // 500 rather than crashing the Worker | test:
    // test_kv_get_with_corrupted_json_value_throws_kv_store_error
    try {
      return JSON.parse(raw) as PendingCheckRun;
    } catch (err) {
      throw new KVStoreError("get", err);
    }
  }

  async delete(owner: string, repo: string, kind: PendingCheckRunKind, correlationId: string): Promise<void> {
    const k = key(owner, repo, kind, correlationId);
    try {
      await this.kv.delete(k);
    } catch (err) {
      throw new KVStoreError("delete", err);
    }
  }
}

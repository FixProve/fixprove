// FixProve Worker -- Session 2.2: shared fake KVNamespace test double
//
// KS-TRACE: S2.2-FAKE-KV | this cast (`as unknown as KVNamespace`) is
// DIFFERENT from the octokit.rest.checks assumption-cast defect from
// Session 2.1 (see app's KS-TRACE S2.1-CHECKRUN-DEFECT-001): here WE
// define the exact minimal shape KVPendingCheckRunStore actually calls
// (get/put/delete), and this is a TEST-ONLY double, not a production
// adapter guessing at an external library's real shape. The real
// KVNamespace interface has additional methods (getWithMetadata, list,
// overloaded get() signatures) that our code never calls, so a full
// implementation would be needless surface area.

export interface FakeKvBackingStore {
  data: Map<string, string>;
  /**
   * KS-TRACE: LEGAL-4.12K-TTL-SAFETY-NET-TEST | records the `options` object
   * (if any) passed to the most recent `put` call for each key, so a test
   * can assert an `expirationTtl` was actually supplied -- not just that
   * `put` was called at all.
   */
  putOptions: Map<string, { expirationTtl?: number } | undefined>;
}

export function createFakeKv(): FakeKvBackingStore & { asKvNamespace: () => any } {
  const data = new Map<string, string>();
  const putOptions = new Map<string, { expirationTtl?: number } | undefined>();
  return {
    data,
    putOptions,
    asKvNamespace() {
      return {
        async get(key: string) {
          return data.has(key) ? data.get(key)! : null;
        },
        async put(key: string, value: string, options?: { expirationTtl?: number }) {
          data.set(key, value);
          putOptions.set(key, options);
        },
        async delete(key: string) {
          data.delete(key);
        },
      };
    },
  };
}

export function createFailingFakeKv(failOn: Set<"get" | "put" | "delete">): any {
  return {
    async get(_key: string) {
      if (failOn.has("get")) throw new Error("simulated KV get failure");
      return null;
    },
    async put(_key: string, _value: string) {
      if (failOn.has("put")) throw new Error("simulated KV put failure");
    },
    async delete(_key: string) {
      if (failOn.has("delete")) throw new Error("simulated KV delete failure");
    },
  };
}

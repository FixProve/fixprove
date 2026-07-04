// FixProve GitHub App -- Session 2.1: Checks API create/complete tests
//
// KS-TRACE: S2.1-CHECKRUN-TEST | uses a FAKE ChecksClient (not a real
// Octokit), consistent with "logic-verified, not live-verified" scope for
// this session -- see Keystone Report Known Limitations.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPendingCheckRun,
  completeCheckRun,
  octokitToChecksClient,
  type ChecksClient,
} from "../src/checkRun.js";
import { MAX_ANNOTATIONS_PER_REQUEST, type Finding } from "../src/findings.js";

function fakeClient() {
  const createCalls: unknown[] = [];
  const updateCalls: unknown[] = [];
  let nextId = 1;
  const client: ChecksClient = {
    async create(params) {
      createCalls.push(params);
      return { id: nextId++ };
    },
    async update(params) {
      updateCalls.push(params);
    },
  };
  return { client, createCalls, updateCalls };
}

test("createPendingCheckRun creates an in_progress check and returns its id", async () => {
  const { client, createCalls } = fakeClient();
  const id = await createPendingCheckRun(client, { owner: "acme", repo: "widgets", headSha: "abc123" });
  assert.equal(id, 1);
  assert.equal(createCalls.length, 1);
  assert.deepEqual((createCalls[0] as any).status, "in_progress");
  assert.deepEqual((createCalls[0] as any).head_sha, "abc123");
});

test("completeCheckRun with empty findings produces a single clean success update, not an error", async () => {
  const { client, updateCalls } = fakeClient();
  await completeCheckRun(client, { owner: "acme", repo: "widgets", checkRunId: 1 }, []);
  assert.equal(updateCalls.length, 1);
  const call = updateCalls[0] as any;
  assert.equal(call.status, "completed");
  assert.equal(call.conclusion, "success");
  assert.equal(call.output.annotations.length, 0);
});

test("completeCheckRun with findings produces a failing update naming symbol+file+line", async () => {
  const { client, updateCalls } = fakeClient();
  const findings: Finding[] = [
    { file: "src/a.py", line: 10, kind: "call", expression: "foo.bar", reason: "unresolved-symbol" },
  ];
  await completeCheckRun(client, { owner: "acme", repo: "widgets", checkRunId: 1 }, findings);
  assert.equal(updateCalls.length, 1);
  const call = updateCalls[0] as any;
  assert.equal(call.conclusion, "failure");
  assert.equal(call.output.annotations.length, 1);
  assert.equal(call.output.annotations[0].path, "src/a.py");
  assert.equal(call.output.annotations[0].start_line, 10);
  assert.match(call.output.annotations[0].message, /foo\.bar/);
});

test("completeCheckRun batches annotations over the 50-per-request GitHub API limit", async () => {
  const { client, updateCalls } = fakeClient();
  const findings: Finding[] = Array.from({ length: 123 }, (_, i) => ({
    file: `src/f${i}.py`,
    line: i + 1,
    kind: "call",
    expression: `sym${i}`,
    reason: "unresolved-symbol" as const,
  }));
  await completeCheckRun(client, { owner: "acme", repo: "widgets", checkRunId: 1 }, findings);
  // 123 annotations / 50 per batch = 3 batches (50, 50, 23)
  assert.equal(updateCalls.length, 3);
  const sizes = updateCalls.map((c) => (c as any).output.annotations.length);
  assert.deepEqual(sizes, [50, 50, 23]);
  // only the LAST batch carries status=completed + a conclusion
  assert.equal((updateCalls[0] as any).status, "in_progress");
  assert.equal((updateCalls[0] as any).conclusion, undefined);
  assert.equal((updateCalls[1] as any).status, "in_progress");
  assert.equal((updateCalls[2] as any).status, "completed");
  assert.equal((updateCalls[2] as any).conclusion, "failure");
  // sanity: no annotation total exceeds the documented constant
  assert.ok(sizes.every((n) => n <= MAX_ANNOTATIONS_PER_REQUEST));
});

// KS-TRACE: S2.1-CHECKRUN-DEFECT-001-REGRESSION | this test exists
// specifically because the FIRST version of this adapter assumed
// `octokit.rest.checks.create/update` and would have silently been broken
// against a real Octokit instance (which only exposes `.request()`). This
// locks in the corrected shape so a regression back to `.rest.checks`
// would fail immediately.
test("octokitToChecksClient adapts a request()-only Octokit-shaped object, not .rest.checks", async () => {
  const requestCalls: Array<{ route: string; params: unknown }> = [];
  const fakeOctokit = {
    async request(route: string, params?: Record<string, unknown>) {
      requestCalls.push({ route, params });
      if (route.startsWith("POST")) {
        return { data: { id: 999 } };
      }
      return { data: {} };
    },
  };
  // deliberately confirm the fake does NOT have a `.rest` property, matching
  // the real @octokit/core default shape this adapter must work against
  assert.equal((fakeOctokit as any).rest, undefined);

  const client = octokitToChecksClient(fakeOctokit);
  const id = await client.create({
    owner: "acme", repo: "widgets", name: "FixProve", head_sha: "abc123", status: "in_progress",
  });
  assert.equal(id.id, 999);
  await client.update({ owner: "acme", repo: "widgets", check_run_id: 999, status: "completed", conclusion: "success" });

  assert.equal(requestCalls.length, 2);
  assert.match(requestCalls[0].route, /POST .*check-runs/);
  assert.match(requestCalls[1].route, /PATCH .*check-runs\/\{check_run_id\}/);
});

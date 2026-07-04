// FixProve GitHub App -- Session 2.1: findings/Checks-summary tests

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCheckSummary, findingToAnnotation, type Finding } from "../src/findings.js";

const F: Finding = {
  file: "src/foo.py",
  line: 42,
  kind: "call",
  expression: "requests.gett",
  reason: "unresolved-symbol",
};

test("empty findings -> success conclusion, no annotations", () => {
  const summary = buildCheckSummary([]);
  assert.equal(summary.conclusion, "success");
  assert.equal(summary.annotations.length, 0);
});

test("non-empty findings -> failure conclusion naming symbol+file+line", () => {
  const summary = buildCheckSummary([F]);
  assert.equal(summary.conclusion, "failure");
  assert.match(summary.summary, /requests\.gett/);
  assert.match(summary.summary, /src\/foo\.py:42/);
});

test("findingToAnnotation names the symbol, file, and line in message", () => {
  const ann = findingToAnnotation(F);
  assert.equal(ann.path, "src/foo.py");
  assert.equal(ann.start_line, 42);
  assert.equal(ann.end_line, 42);
  assert.equal(ann.annotation_level, "failure");
  assert.match(ann.message, /requests\.gett/);
  assert.match(ann.message, /src\/foo\.py:42/);
});

test("unknown reason string still produces a readable (not crashing) annotation", () => {
  const weird = { ...F, reason: "some-future-reason" } as unknown as Finding;
  const ann = findingToAnnotation(weird);
  assert.match(ann.message, /some-future-reason/);
});

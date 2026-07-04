// FixProve CLI (npm) -- Session 3.1: real subprocess-wrapper test suite
// ============================================================================
//
// KS-TRACE: S3.1-CLI-TEST | replaces Session 0.2's placeholder smoke test
// now that runCheck actually invokes a Python subprocess. Uses the
// `pythonBin` test-only override to point at small, hermetic stub scripts
// (no real Python/fixprove install required in this package's own test
// environment) that simulate each scenario the wrapper must handle
// correctly: a clean pass, a found-hallucination pass, a missing-engine
// (ModuleNotFoundError) failure, and total interpreter absence (ENOENT).
// Filename kept as check.stub.test.ts (not renamed) since this repo's
// standing mount-write rule treats file renames as unsafe/unsupported in
// this environment -- only the CONTENTS changed.

import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  runCheck,
  PYTHON_NOT_FOUND_EXIT_CODE,
  PYTHON_MODULE_MISSING_EXIT_CODE,
} from "../src/commands/check.js";

// KS-TRACE: S3.1-CLI-TEST-STUB | writes a tiny executable shell script
// masquerading as a "python3"-shaped interpreter, so `spawnSync(bin, ["-m",
// "cli", ...args])` exercises runCheck's REAL arg-passing and result-
// handling logic end-to-end, without needing a real Python installation.
function writeStubInterpreter(script: string): string {
  const dir = mkdtempSync(join(tmpdir(), "fixprove-cli-test-"));
  const path = join(dir, "fake-python");
  writeFileSync(path, `#!/bin/sh\n${script}\n`);
  chmodSync(path, 0o755);
  return path;
}

test("a clean-pass Python process: stdout is forwarded, exit code 0", () => {
  const stub = writeStubInterpreter('echo \'{"findings": []}\'; exit 0');
  const captured: string[] = [];
  const origWrite = process.stdout.write.bind(process.stdout);
  (process.stdout.write as any) = (chunk: any) => {
    captured.push(String(chunk));
    return true;
  };
  let code: number;
  try {
    code = runCheck("some/path", { pythonBin: stub, json: true });
  } finally {
    process.stdout.write = origWrite;
  }
  assert.equal(code, 0);
  assert.match(captured.join(""), /"findings": \[\]/);
});

test("a hallucination-found Python process: exit code 1 is propagated unchanged", () => {
  const stub = writeStubInterpreter('echo \'{"findings": [{"expression": "foo.bar"}]}\'; exit 1');
  const code = runCheck("some/path", { pythonBin: stub, json: true });
  assert.equal(code, 1);
});

test("all forwarded flags (--requirements/--cache-dir/--timeout/--package-json/--json) reach the Python invocation", () => {
  // the stub echoes its OWN received argv (excluding the -m/cli module
  // invocation prefix, which spawnSync adds) so we can assert on exactly
  // what runCheck constructed
  const stub = writeStubInterpreter('echo "ARGS:$@"; exit 0');
  const captured: string[] = [];
  const origWrite = process.stdout.write.bind(process.stdout);
  (process.stdout.write as any) = (chunk: any) => {
    captured.push(String(chunk));
    return true;
  };
  try {
    runCheck("myproject", {
      pythonBin: stub,
      requirements: "req.txt",
      cacheDir: ".cache",
      timeout: "5",
      packageJson: "pkg.json",
      json: true,
    });
  } finally {
    process.stdout.write = origWrite;
  }
  const out = captured.join("");
  assert.match(out, /-m cli myproject/);
  assert.match(out, /--requirements req\.txt/);
  assert.match(out, /--cache-dir \.cache/);
  assert.match(out, /--timeout 5/);
  assert.match(out, /--package-json pkg\.json/);
  assert.match(out, /--json/);
});

// KS-TRACE: S3.1-CLI-TEST-REAL-MESSAGE-SHAPE | this test was ORIGINALLY
// written simulating a full Python traceback ending in
// "ModuleNotFoundError: No module named 'cli'" -- confirmed via real
// end-to-end testing (not just this stub) that `python3 -m cli` on a
// missing module never actually produces that shape; it produces the much
// shorter runpy message asserted below. The stub now matches verified
// real Python behavior, not an assumption. See check.ts's own
// S3.1-CLI-MODULE-MISSING-DETECT-DEFECT trace for the full story.
test("the real runpy 'No module named cli' message (from python3 -m cli, not an in-code import) produces an actionable pip-install message and exit code 2", () => {
  const stub = writeStubInterpreter(
    "echo \"fake-python: No module named cli\" 1>&2; exit 1"
  );
  const captured: string[] = [];
  const origWrite = process.stderr.write.bind(process.stderr);
  (process.stderr.write as any) = (chunk: any) => {
    captured.push(String(chunk));
    return true;
  };
  let code: number;
  try {
    code = runCheck("some/path", { pythonBin: stub });
  } finally {
    process.stderr.write = origWrite;
  }
  assert.equal(code, PYTHON_MODULE_MISSING_EXIT_CODE);
  assert.match(captured.join(""), /pip install fixprove/);
});

test("no usable Python interpreter at all: actionable message, exit code 127, never a hang", () => {
  const captured: string[] = [];
  const origWrite = process.stderr.write.bind(process.stderr);
  (process.stderr.write as any) = (chunk: any) => {
    captured.push(String(chunk));
    return true;
  };
  let code: number;
  try {
    code = runCheck("some/path", { pythonBin: "/definitely/not/a/real/interpreter-xyz" });
  } finally {
    process.stderr.write = origWrite;
  }
  assert.equal(code, PYTHON_NOT_FOUND_EXIT_CODE);
  assert.match(captured.join(""), /pip install fixprove/);
});

test("a process killed by a signal (null exit status) never silently reports success", () => {
  // a stub that kills itself with SIGKILL, leaving spawnSync's `status` null
  const stub = writeStubInterpreter("kill -9 $$");
  const code = runCheck("some/path", { pythonBin: stub });
  assert.notEqual(code, 0);
  assert.equal(code, PYTHON_MODULE_MISSING_EXIT_CODE);
});

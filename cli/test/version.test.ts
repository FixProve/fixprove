// FixProve CLI (npm) -- regression test for the --version defect flagged in
// FIXPROVE-PRIORITY-TRACKER-2026-09-11.md (P0): `--version` was hardcoded in
// src/index.ts and had drifted from package.json's own version.
//
// KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-VERSION-DEFECT | requirement:
// "Add a regression test asserting reported == package version." Runs the
// REAL compiled CLI as a subprocess (not a mock) so this catches the actual
// end-user-visible failure mode -- a stale string baked into dist/src/
// index.js -- not just the source-level intent.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// This test file compiles to dist/test/version.test.js, so package.json
// (the package root) is two levels up -- same resolution logic index.ts
// itself uses at runtime, verified independently here rather than imported,
// so a bug in one can't hide a bug in the other.
const packageJsonPath = join(__dirname, "..", "..", "package.json");
const cliEntryPath = join(__dirname, "..", "src", "index.js");

test("fixprove --version reports the same version as package.json", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version: string };
  const stdout = execFileSync(process.execPath, [cliEntryPath, "--version"], { encoding: "utf8" });
  assert.equal(stdout.trim(), packageJson.version);
});

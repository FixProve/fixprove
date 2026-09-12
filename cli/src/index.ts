#!/usr/bin/env node
// #KS-TRACE: SESSION-0.2-SCAFFOLD -> S3.1-CLI-WIRING | Session 0.2 proved the
// package builds and exposes a `check` subcommand shape. Session 3.1 wires
// that subcommand to actually invoke the published Python engine (see
// commands/check.ts) and forwards the engine's own flag surface
// (--requirements/--cache-dir/--timeout/--package-json/--json), so this
// wrapper's CLI contract matches engine/python/cli.py's argparse contract
// exactly rather than inventing a second, divergent one.
//
// KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-VERSION-DEFECT | fix: `--version`
// was hardcoded to "0.1.0" here while cli/package.json had drifted to
// "0.1.12" -- confirmed by direct inspection this session (Yehor's own
// planning doc flagged this as P0 before the Sept 16/17 events). Reading
// package.json at runtime makes the two numbers structurally unable to
// diverge again, instead of relying on someone remembering to bump both.
// Resolved relative to THIS module's own compiled location (dist/src/
// index.js), not process.cwd(), so `fixprove --version` reports correctly
// no matter what directory it's invoked from. Uses readFileSync + JSON.parse
// rather than a JSON import assertion (`with`/`assert { type: "json" }`)
// deliberately -- that syntax's required keyword changed between Node
// versions (assert -> with, Node 20.10+), so this avoids pinning a Node
// version assumption for something this small | test: version.test.ts
// asserts the reported version always equals package.json's own version,
// so this can never silently drift again.
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runCheck } from "./commands/check.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "..", "..", "package.json"), "utf8")
) as { version: string };

const program = new Command();

program
  .name("fixprove")
  .description(
    "FixProve — proves your AI-generated code before it merges. " +
      "Deterministically verifies that every import, symbol, method, and API " +
      "call resolves against your real installed dependencies. Zero LLM tokens."
  )
  .version(packageJson.version);

program
  .command("check")
  .description("Scan a file or directory for unresolved symbols (invokes the Python engine)")
  .argument("[path]", "path to scan", ".")
  .option("--requirements <file>", "path to requirements.txt (default: <path>/requirements.txt)")
  .option("--cache-dir <dir>", "knowledge-base cache directory (default: <path>/.fixprove_cache)")
  .option("--timeout <seconds>", "per-package introspection timeout in seconds")
  .option("--package-json <file>", "path to package.json for TS/JS deps (default: <path>/package.json)")
  .option("--json", "emit machine-readable JSON")
  .action((path: string, options: { requirements?: string; cacheDir?: string; timeout?: string; packageJson?: string; json?: boolean }) => {
    process.exitCode = runCheck(path, options);
  });

program.parse(process.argv);

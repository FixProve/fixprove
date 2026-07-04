#!/usr/bin/env node
// #KS-TRACE: SESSION-0.2-SCAFFOLD -> S3.1-CLI-WIRING | Session 0.2 proved the
// package builds and exposes a `check` subcommand shape. Session 3.1 wires
// that subcommand to actually invoke the published Python engine (see
// commands/check.ts) and forwards the engine's own flag surface
// (--requirements/--cache-dir/--timeout/--package-json/--json), so this
// wrapper's CLI contract matches engine/python/cli.py's argparse contract
// exactly rather than inventing a second, divergent one.
import { Command } from "commander";
import { runCheck } from "./commands/check.js";

const program = new Command();

program
  .name("fixprove")
  .description(
    "FixProve — proves your AI-generated code before it merges. " +
      "Deterministically verifies that every import, symbol, method, and API " +
      "call resolves against your real installed dependencies. Zero LLM tokens."
  )
  .version("0.1.0");

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

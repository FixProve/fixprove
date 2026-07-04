// FixProve CLI (npm, open-core wrapper) -- Session 3.1: invoke the Python core
// ====================================================================================
//
// KS-TRACE: S3.1-CLI-WRAPPER | requirement: "TS CLI wrapper is packaged for
// npm and correctly invokes the Python core." The actual deterministic
// resolver engine (Sessions 1.1-1.4) is Python, published to PyPI as
// `fixprove` (see engine/python/pyproject.toml). This module does NOT
// reimplement any resolver logic -- it locates a Python interpreter,
// invokes the installed engine via `python3 -m cli <args>` (module
// invocation, not the `fixprove` console script -- see
// engine/python/pyproject.toml's S3.1-CONSOLE-SCRIPT trace for why: the
// npm package's own bin is ALSO literally named `fixprove`, so relying on
// a PATH lookup for a command named `fixprove` from inside this wrapper
// would be ambiguous if both `npm i -g fixprove` and `pip install
// fixprove` are installed on the same machine), and forwards stdout/
// stderr/exit code transparently | test: check.test.ts

import { spawnSync, type SpawnSyncReturns } from "node:child_process";

export interface RunCheckOptions {
  requirements?: string;
  cacheDir?: string;
  timeout?: string;
  packageJson?: string;
  json?: boolean;
  /**
   * KS-TRACE: S3.1-CLI-WRAPPER-DI | test-only override: production never
   * sets this (falls through to trying "python3" then "python" on PATH).
   * Tests point this at a small stub Python/shell script so the wrapper's
   * OWN logic (arg-building, ENOENT fallback, ModuleNotFoundError
   * detection, exit-code propagation) can be verified deterministically
   * without depending on a real Python interpreter + a real `pip install
   * fixprove` being present in the test environment -- the same
   * dependency-injection pattern already used for ChecksClient (Session
   * 2.1) and PendingCheckRunStore (Session 2.2).
   */
  pythonBin?: string;
}

// KS-TRACE: S3.1-CLI-EXIT-CODES | requirement: never silently report
// success when the Python engine could not actually run. 127 mirrors the
// POSIX shell convention for "command not found"; 2 mirrors cli.py's own
// documented "usage/setup error" exit code (see engine/python/cli.py's own
// docstring contract) so a missing-engine failure and a genuine CLI usage
// error look the same to a calling CI pipeline (both mean "did not run",
// as opposed to exit 1, which means "ran and found a real hallucination").
export const PYTHON_NOT_FOUND_EXIT_CODE = 127;
export const PYTHON_MODULE_MISSING_EXIT_CODE = 2;

function buildArgs(path: string, options: RunCheckOptions): string[] {
  const args = [path];
  if (options.requirements) args.push("--requirements", options.requirements);
  if (options.cacheDir) args.push("--cache-dir", options.cacheDir);
  if (options.timeout) args.push("--timeout", options.timeout);
  if (options.packageJson) args.push("--package-json", options.packageJson);
  if (options.json) args.push("--json");
  return args;
}

/**
 * KS-TRACE: S3.1-CLI-MODULE-MISSING-DETECT-DEFECT | fix (found during this
 * session's own end-to-end adversarial testing, running the real wrapper
 * against a real Python with no `cli` module installed -- NOT caught by
 * the original stub-based unit test, which simulated the wrong message
 * shape): `python3 -m cli` on a missing module does NOT raise a Python-
 * level `ModuleNotFoundError` traceback -- that only happens for an
 * in-code `import cli` failing after the interpreter has already started.
 * `-m`'s own module lookup (runpy) fails BEFORE that, printing the much
 * shorter `<interpreter path>: No module named cli` directly to stderr
 * (no "ModuleNotFoundError:" prefix, no quotes around `cli`), confirmed
 * directly: `python3 -m cli` (missing) -> `/usr/bin/python3: No module
 * named cli`, exit 1; versus `python3 -c "import cli"` (missing) -> a full
 * traceback ending `ModuleNotFoundError: No module named 'cli'`. Since
 * this wrapper always invokes via `-m`, only the FIRST shape can ever
 * occur in production -- the original regex matched a message that could
 * never actually appear, making the "actionable message" branch dead code
 * that silently never fired (verified: it printed the raw runpy line
 * unhandled instead, exactly as reported by real end-to-end testing).
 * | test: test_module_not_found_produces_actionable_message_and_exit_2
 * (now asserts against the REAL runpy message shape)
 */
const MODULE_NOT_FOUND_RE = /No module named ['"]?cli['"]?/;

function handleResult(result: SpawnSyncReturns<string>): number {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    if (MODULE_NOT_FOUND_RE.test(result.stderr)) {
      process.stderr.write(
        "[fixprove] the Python engine does not appear to be installed for this Python interpreter.\n" +
          "Install it with:\n" +
          "  pip install fixprove\n"
      );
      return PYTHON_MODULE_MISSING_EXIT_CODE;
    }
    process.stderr.write(result.stderr);
  }
  if (typeof result.status === "number") {
    return result.status;
  }
  // KS-TRACE: S3.1-CLI-SIGNAL-KILLED | assumption: a null status (process
  // killed by a signal, e.g. SIGSEGV/SIGKILL) is a setup/environment
  // failure, not a clean pass -- NEVER default to exit 0 here | test:
  // test_killed_by_signal_never_reports_success
  return PYTHON_MODULE_MISSING_EXIT_CODE;
}

/**
 * KS-TRACE: S3.1-CLI-RUNCHECK | requirement: try `python3` first, then bare
 * `python` (some environments, notably some Windows installs, only expose
 * `python`), before giving up with an actionable install message -- never
 * a silent hang or an opaque Node ENOENT stack trace | test:
 * test_tries_python3_then_python_fallback,
 * test_no_python_interpreter_found_produces_actionable_message_and_exit_127
 */
export function runCheck(path: string, options: RunCheckOptions = {}): number {
  const candidates = options.pythonBin ? [options.pythonBin] : ["python3", "python"];
  const args = buildArgs(path, options);

  for (const bin of candidates) {
    const result = spawnSync(bin, ["-m", "cli", ...args], { encoding: "utf8" });
    const errno = (result.error as NodeJS.ErrnoException | undefined)?.code;
    if (errno === "ENOENT") {
      // this interpreter name isn't on PATH at all -- try the next candidate
      continue;
    }
    return handleResult(result);
  }

  process.stderr.write(
    "[fixprove] could not find a Python interpreter (tried: python3, python).\n" +
      "FixProve's engine is written in Python. Install Python 3.9+, then run:\n" +
      "  pip install fixprove\n"
  );
  return PYTHON_NOT_FOUND_EXIT_CODE;
}

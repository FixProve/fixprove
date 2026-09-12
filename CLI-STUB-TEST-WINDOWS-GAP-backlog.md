# CLI Stub-Test Windows Portability Gap — Backlog

**Status: NOT STARTED.** Filed 2026-09-11, decided explicitly by Yehor: file,
don't fix tonight — this doesn't block Sept 16/17.

## Finding

`cli/test/check.stub.test.ts`'s `writeStubInterpreter()` fakes a Python
interpreter via a shebang (`#!/bin/sh`) file + `chmodSync(0o755)`. This works
on POSIX (the OS reads the shebang) and does nothing on Windows (no shebang
interpretation, `chmod` is a no-op on NTFS, an extensionless file has no
registered interpreter) — `spawnSync` reports ENOENT for the stub file
itself, so `runCheck` falls into its own "no interpreter found" fallback
path (exit 127) instead of ever reaching the behavior each affected test
actually means to check.

**Confirmed by running the real suite on Windows tonight** (2026-09-11):
5 of 7 tests in this file fail. 4 of those 5 use `writeStubInterpreter()`
and fail for the reason above — the fake interpreter can't execute at all,
so the wrapper falls through to its generic "no interpreter" message
regardless of what the intended scenario was.

**Correction to an earlier characterization, worth recording precisely:**
the file's 5th nominal failure candidate, `"no usable Python interpreter at
all: actionable message, exit code 127, never a hang"`, actually **passes**
— but not because it happens to share the same broken mechanism. That test
never calls `writeStubInterpreter()` at all; it passes a literal, hardcoded,
guaranteed-nonexistent path (`"/definitely/not/a/real/interpreter-xyz"`)
directly as `pythonBin`, deliberately testing "the named interpreter does
not exist anywhere." That scenario is platform-independent and genuinely
holds on Windows for the right reason — it is not a coincidental pass, and
it is not evidence that the shebang-based tests are somehow fine too.

The 6th test outside this group, `fixprove --version reports the same
version as package.json`, is unrelated (pure Node, no subprocess) and also
genuinely passes.

## Confirmed NOT a product defect

Real users have a real `python.exe` on PATH — a completely different code
path with no shebang involved at all. This is a test-harness-only gap,
first surfaced tonight only because this was the first time this suite ran
against a real subprocess spawn on real Windows hardware (CI most likely
runs on Linux; this project's own sandbox has never had registry access to
run it at all).

## Why this isn't P0

It tests a mock, not the product. Nobody at the Sept 16/17 events will hit
this. Spending time on a cross-platform rewrite of the test harness
competes directly with the hours needed for the actual gating item (the
manual self-test on 3 real repos) — reclassified, not ignored.

## Real fix, scoped for later

`writeStubInterpreter` needs to branch on `process.platform` — a `.cmd`
batch file on Windows instead of a POSIX shell script for the stub itself.
One of the five scenarios, `"a process killed by a signal (null exit
status)"` (currently implemented as `kill -9 $$`), has no clean Windows
equivalent — Windows has no POSIX signals — and needs real rethinking, not
just a syntax port.

**Do not attempt this fix in-sandbox, even later.** It needs verification on
both a real Windows machine and a real POSIX machine, which no single
environment available to this project's executor session provides at once.

## What this doesn't change

The two P0 fixes this stub-test file has nothing to do with are both
independently, separately confirmed on real Windows hardware tonight:
`fixprove --version` reports `0.1.13`, exact match against `package.json`;
`pytest tests/test_cli_check_token.py -v` — 6/6 passed, against a real
`pip install -e .` that compiled real `tree-sitter`/`tree-sitter-typescript`
native wheels. This file's own gap does not call either of those results
into question.

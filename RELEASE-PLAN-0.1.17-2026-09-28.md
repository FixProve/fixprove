# Release plan — v0.1.17 (PLAN ONLY — no edits until Yehor's go, not before 2026-09-29)

Written 2026-09-28, Session 4.31 open, Claude (Node 1). Replaces the
time-boxed 2026-09-15 plan, whose stop-loss passed unshipped (recorded in
tracker / state.md / PROGRESS.md addenda, 2026-09-28). No deadline.

Baseline verified 2026-09-28: HEAD `b3beedc` = origin/main; PyPI + npm = 0.1.16;
publishing is OIDC-only on both registries (critical-actions.md, 2026-09-28).

## Scope (one commit, explicit paths only — NEVER `git add -A`: 291 CRLF-only mods in tree)

| # | File | Change | Evidence / test |
|---|------|--------|-----------------|
| 1 | `cli/package.json`, `engine/python/pyproject.toml` | version `0.1.16` → `0.1.17` | `test_cli_version`; `fixprove --version` post-publish |
| 2 | `engine/python/pyproject.toml` | `requires-python = ">=3.9"` → `">=3.10"` + KS-TRACE citing Session 4.30 raw-PyPI wheel matrix (no cp39 wheels for tree-sitter / tree-sitter-python) | pip metadata check |
| 3 | `cli/src/commands/check.ts:133` | "Install Python 3.9+" → "Install Python 3.10+" | no test pins this string (4.30) |
| 4 | `README.md`, `engine/python/README.md`, `cli/README.md` | prerequisite line: "Requires Python 3.10+ (the engine is Python; the npm package is a wrapper around it)" | read-back |
| 5 | `engine/python/README.md` | module-augmentation limitation sentence reworded — changelog says "clarified", not "corrected" | read-back |
| 6 | `engine/python/README.md` | **D8** known-limitation paragraph (D2 style): `from pkg.sub.sub import Name` flagged unresolved when `Name` isn't re-exported at `pkg` top level (cryptography, opentelemetry, typer.testing, fastapi.testclient). Root cause `resolver.py:177-180` Pass A. Doc only — real fix is its own future session | read-back |
| 7 | `engine/python/cli.py` | **D9** (decided 2026-09-28) — see below | 3 new tests |
| 8 | release notes (tag / GitHub release) | BOM (`d55c20a`), React namespace / `CSSProperties` (`aaafaeb`), Python 3.10 floor, D9 exit-code truthfulness, D8 disclosure | read-back |

## D9 — design (Yehor-approved rule)

Rule: **exit 2 only when zero files were actually checked after ecosystem
skips.** Preserves D1 (S4.29-SELFTEST-ORPHANED-PY): a mixed project still
gets its TS/JS checked and exits 0/1 as today.

Implementation sketch (cli.py, ~8 lines): set `skipped = True` in each of the
two warning branches (py no requirements.txt; ts no package.json). After the
report is printed (text or `--json`), before `return 1 if findings else 0`:

    if skipped and report["files_checked"] == 0:
        print("error: every detected ecosystem was skipped -- nothing was "
              "checked. See warning(s) above.", file=sys.stderr)
        return 2

Report is still printed, so `--json` consumers keep a parseable body.

Tests (engine/python/tests/test_cli.py), each with a KS-TRACE:
- `test_cli_orphaned_py_no_requirements_still_checks_ts` (EXISTING) — must still
  pass: mixed project, orphaned .py → TS checked → exit 0/1.
- `test_cli_pure_python_no_requirements_exits_2` (NEW) — only .py, no
  requirements.txt → warning on stderr, exit **2**, files_checked 0.
- `test_cli_pure_ts_no_package_json_exits_2` (NEW) — symmetric TS side.
- `test_cli_empty_dir_exit_code_unchanged` (NEW, adversarial) — no source files
  at all, nothing skipped → current behaviour (exit 0) pinned, so D9 cannot
  silently widen. **OPEN for Yehor:** should an empty target also be 2? Default
  here: unchanged (0), because the approved rule says "after skips".
- Property-style check: for every combination of {py present/absent,
  requirements present/absent, ts present/absent, package.json present/absent}
  assert exit==2 ⇔ (a skip occurred ∧ files_checked==0).

Docs: exit-code table (0/1/2/127) gains one sentence under 2: "…or every
detected ecosystem was skipped for a missing manifest (nothing was checked)."

## Sequence (after Yehor's go)
1. Maintenance-protocol first pass (9 items, quoted evidence). CI green on HEAD.
   Registries still 0.1.16.
2. Edits above → full suite in /tmp clone (never install on the mount).
3. One commit, explicit paths, KS-TRACE message → push → CI green on that sha.
4. **Tag only on Yehor's explicit one-word go** (CA-3): `git tag v0.1.17 && git push origin v0.1.17`.
   Watch publish-npm + publish-pypi raw logs; confirm npm `_npmUser.trustedPublisher`.
5. Fresh-install proofs, exit codes pasted: `--version` 0.1.17 via pip AND npm;
   BOM'd package.json parses; `import { CSSProperties } from "react"` clean;
   planted samples still caught (`fetch_status.py:11 requests.get_json`,
   `script.ts:9 axios.getJson`); NEW: pure-Python no-requirements → exit 2.
6. INSTALL-CARD.md (no pipx anywhere) — commit only.

No `wrangler deploy` is part of this release.

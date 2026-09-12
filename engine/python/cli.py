"""
FixProve — Milestone 1, Sessions 1.3-1.4: `fixprove check` CLI
==================================================================

Usage: python3 cli.py [check] <path> [--requirements FILE] [--cache-dir DIR] [--json]

Exit codes: 0 = clean, 1 = unresolved symbol(s) found, 2 = usage/setup error.

CONTRACT (locked with Yehor, 2026-07-04, extended 2026-07-04 Session 1.4)
----------------------------------------------------------------------------
  Input   : a file OR a directory (recursively scanned, excluding common
            noise dirs). Session 1.3 scanned .py only; Session 1.4 adds
            .ts/.tsx/.js/.jsx discovery in the SAME pass, each routed to
            its own resolver, findings MERGED and sorted through the
            same finding.py-shared schema (see ts_resolver.py's
            docstring for why this concretely satisfies "shares the
            deterministic core + output schema with the Python path").
  Perf    : the <5s target applies to the CHECK step against an
            ALREADY-CACHED knowledge base (warm cache). A cold KB build
            (first run) is a separate, explicitly-reported, unbudgeted
            step -- see the Keystone Report's Known Limitations.
  Graceful ecosystem absence: a project with only .py files (no
            package.json) is checked Python-only; a project with only
            .ts files (no requirements.txt) is checked TS-only. Only a
            manifest for an ecosystem that HAS matching source files is
            required -- an unrelated missing manifest is not an error.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from knowledge_base import build_knowledge_base
from resolver import check_paths
from ts_knowledge_base import build_knowledge_base as ts_build_knowledge_base
from ts_resolver import check_paths as ts_check_paths
from finding import sort_findings

# KS-TRACE: S1.3-DISCOVERY | assumption: these directories are never
# meaningful sources of first-party project code to check, and commonly
# contain huge trees (venvs, node_modules) that would blow the perf
# target for no benefit | test: test_discover_py_files_excludes_noise_dirs
DEFAULT_EXCLUDE_DIRS = {
    ".git", ".venv", "venv", "__pycache__", "node_modules",
    ".fixprove_cache", ".mypy_cache", ".pytest_cache", "site-packages",
}


def discover_py_files(target: Path) -> list:
    if target.is_file():
        return [target] if target.suffix == ".py" else []
    files = []
    for p in sorted(target.rglob("*.py")):
        if any(part in DEFAULT_EXCLUDE_DIRS for part in p.parts):
            continue
        files.append(p)
    return files


_TS_EXTENSIONS = (".ts", ".tsx", ".js", ".jsx")


def discover_ts_files(target: Path) -> list:
    # KS-TRACE: S1.4-CLI-DISCOVERY | requirement: same noise-dir exclusion
    # policy as the Python discovery, applied to TS/JS extensions
    # | test: test_discover_ts_files_excludes_noise_dirs
    if target.is_file():
        return [target] if target.suffix in _TS_EXTENSIONS else []
    files = []
    for ext in _TS_EXTENSIONS:
        for p in sorted(target.rglob(f"*{ext}")):
            if any(part in DEFAULT_EXCLUDE_DIRS for part in p.parts):
                continue
            if p.suffixes and p.suffixes[-2:] == [".d", ".ts"]:
                continue  # never check a .d.ts declaration file as project source
            files.append(p)
    return sorted(files)


def _resolve_requirements_path(target: Path, explicit) -> Path:
    if explicit:
        return Path(explicit)
    target_dir = target if target.is_dir() else target.parent
    return target_dir / "requirements.txt"


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="fixprove check",
        description="Scan a file or directory for unresolved symbols.",
        epilog=(
            "Also accepts an optional leading 'check' token for parity "
            "with the npm CLI's canonical form -- `fixprove check <path>` "
            "and `fixprove <path>` behave identically, including the "
            "default-to-current-directory behavior when path is omitted. "
            "See KS-TRACE PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX and "
            "...-PARITY-GAP in main() below."
        ),
    )
    # KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX-PARITY-GAP | found
    # by a second, independent verification pass over the check-token fix
    # above (guide-chat double-check, then confirmed here by actually
    # running `main(["check"])`, not just tracing the code by hand): with
    # `path` as a required positional, `fixprove check` alone (no path) was
    # STILL an asymmetry the check-token fix didn't close -- it raised an
    # uncaught argparse SystemExit(2), while the npm side's
    # `.argument("[path]", "path to scan", ".")` (cli/src/index.ts) makes
    # the SAME bare `fixprove check` succeed, defaulting to ".". Exactly
    # the class of gap this whole exercise exists to close, just smaller
    # and better-hidden than the original bug -- so `path` now defaults to
    # "." on the pip side too, matching npm exactly. Trade-off, inherited
    # from npm not introduced here: a literal directory named "check" in
    # the cwd, referenced bare with no path, is now ambiguous on BOTH
    # installs (disambiguate with an explicit "./check") -- this was
    # already npm's accepted trade-off, not a new one | test:
    # test_check_token_alone_defaults_to_current_directory
    parser.add_argument("path", nargs="?", default=".",
                         help="Python file or directory to check (default: current directory)")
    parser.add_argument("--requirements", default=None,
                         help="Path to requirements.txt (default: <path>/requirements.txt)")
    parser.add_argument("--cache-dir", default=None,
                         help="Knowledge-base cache directory (default: <path>/.fixprove_cache)")
    parser.add_argument("--timeout", type=float, default=10.0,
                         help="Per-package introspection timeout in seconds (default: 10.0)")
    parser.add_argument("--package-json", default=None,
                         help="Path to package.json for TS/JS deps (default: <path>/package.json)")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    return parser


def _resolve_package_json_path(target: Path, explicit) -> Path:
    if explicit:
        return Path(explicit)
    target_dir = target if target.is_dir() else target.parent
    return target_dir / "package.json"


def main(argv=None) -> int:
    argv = argv if argv is not None else sys.argv[1:]

    # KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX | decision: Yehor,
    # 2026-09-11, option (b) -- the pip CLI now also accepts an optional
    # leading "check" token, so `fixprove check <path>` (the npm wrapper's
    # only form, and the exact form shown in fixprove.dev's own public
    # install block after BOTH the pip and npm install lines -- verified
    # live against the site this session, not assumed) works here too.
    # This supersedes pyproject.toml's S3.1-CONSOLE-SCRIPT split: that
    # KS-TRACE's PATH-ambiguity rationale protected against a behaviour
    # difference that doesn't actually exist (both wrappers ultimately
    # invoke this same module with the same argv), so accepting the token
    # here costs nothing and fixes a public documentation promise that was
    # false for anyone who only ran `pip install fixprove`. Backward-
    # compat is a hard requirement: the bare `fixprove <path>` form keeps
    # working completely unchanged -- this only STRIPS the token when
    # present as argv[0], never requires it | test: test_cli_check_token.py
    if argv and argv[0] == "check":
        argv = argv[1:]

    args = build_arg_parser().parse_args(argv)

    target = Path(args.path)
    if not target.exists():
        print(f"error: path not found: {target}", file=sys.stderr)
        return 2

    target_dir = target if target.is_dir() else target.parent
    cache_dir = Path(args.cache_dir) if args.cache_dir else (target_dir / ".fixprove_cache")

    py_files = discover_py_files(target)
    ts_files = discover_ts_files(target)

    build_elapsed = 0.0
    check_elapsed = 0.0
    findings = []

    # KS-TRACE: S1.4-CLI-TIMING-DEFECT | fix (found during final delivery
    # performance verification): the original dual-ecosystem refactor
    # called check_paths()/ts_check_paths() INSIDE each ecosystem's
    # "build" timing block, so "check_seconds" in the report ended up
    # timing only the final sort_findings() call -- the actual resolution
    # work (which is what the <5s target is about) was silently folded
    # into "kb_build_seconds" instead, making the two reported numbers
    # misleading (not wrong findings, but a wrong/uninformative timing
    # breakdown). Fixed by timing KB-build and check/resolve as two
    # clearly separate spans per ecosystem, matching Session 1.3's
    # original build-vs-check separation | test:
    # test_cli_reports_separate_build_and_check_timing (existing, Session
    # 1.3), plus manual verification against a real KB build in this
    # session's Keystone Report.
    #
    # KS-TRACE: S1.4-CLI-DUAL-ECOSYSTEM | requirement: only require a
    # manifest for an ecosystem that actually has matching source files
    # present, so a TS-only or Python-only project is never blocked by an
    # irrelevant missing manifest | test: test_cli_python_only_project,
    # test_cli_ts_only_project, test_cli_mixed_project
    if py_files:
        req_path = _resolve_requirements_path(target, args.requirements)
        if not req_path.exists():
            print(f"error: requirements file not found: {req_path}", file=sys.stderr)
            return 2
        build_start = time.monotonic()
        py_kb = build_knowledge_base(req_path, cache_dir=cache_dir, timeout_seconds=args.timeout)
        build_elapsed += time.monotonic() - build_start
        check_start = time.monotonic()
        findings.extend(check_paths(py_files, py_kb))
        check_elapsed += time.monotonic() - check_start

    if ts_files:
        pkg_json_path = _resolve_package_json_path(target, args.package_json)
        if not pkg_json_path.exists():
            print(f"error: package.json not found: {pkg_json_path}", file=sys.stderr)
            return 2
        build_start = time.monotonic()
        pkg_json = json.loads(pkg_json_path.read_text(encoding="utf-8"))
        package_names = sorted(set(pkg_json.get("dependencies", {})) | set(pkg_json.get("devDependencies", {})))
        node_modules = pkg_json_path.parent / "node_modules"
        ts_kb = ts_build_knowledge_base(node_modules, package_names)
        build_elapsed += time.monotonic() - build_start
        check_start = time.monotonic()
        findings.extend(ts_check_paths(ts_files, ts_kb))
        check_elapsed += time.monotonic() - check_start

    sort_start = time.monotonic()
    findings = sort_findings(findings)
    check_elapsed += time.monotonic() - sort_start

    report = {
        "files_checked": len(py_files) + len(ts_files),
        "findings": findings,
        "kb_build_seconds": round(build_elapsed, 3),
        "check_seconds": round(check_elapsed, 3),
    }

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"Checked {report['files_checked']} file(s) in {check_elapsed:.3f}s (KB build: {build_elapsed:.3f}s)")
        for f in findings:
            print(f'{f["file"]}:{f["line"]}: {f["reason"]}: {f["expression"]}')
        if findings:
            print(f"\n{len(findings)} unresolved symbol(s) found.")
        else:
            print("No unresolved symbols found.")

    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())

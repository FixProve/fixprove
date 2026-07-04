"""
FixProve — Milestone 1, Session 1.4: Shared Finding Schema
=============================================================

Extracted from Session 1.3's resolver.py so the Python and TypeScript/JS
resolvers construct finding dicts through the SAME helpers, concretely
satisfying the Session 1.4 acceptance criterion "shares the deterministic
core + output schema with the Python path" -- not just a matching shape by
coincidence, but the same code path.

CONTRACT (locked with Yehor, 2026-07-04, Session 1.4)
-------------------------------------------------------
  Every finding dict has exactly these keys, regardless of language:
      {"file", "line", "kind", "expression", "reason"}
  reason in {"dependency-not-installed", "dependency-version-mismatch",
             "unresolved-symbol"}

  This module has NO language-specific logic. It is pure data-shape
  construction, so it can never itself introduce a false positive/negative
  -- language resolvers decide WHAT to report; this module only decides
  HOW the report is shaped.
"""

from __future__ import annotations

_FLAGGABLE_DEPENDENCY_STATUSES = {"not-installed", "version-mismatch"}


def dependency_status_finding(filename: str, line: int, kind: str, expression: str, status: str) -> dict:
    # KS-TRACE: S1.4-FINDING-SHARED | requirement: identical finding shape
    # across Python and TS/JS resolvers | test: test_finding_shape_dependency_status
    return {
        "file": filename, "line": line, "kind": kind, "expression": expression,
        "reason": f"dependency-{status}",
    }


def unresolved_symbol_finding(filename: str, line: int, kind: str, expression: str) -> dict:
    # KS-TRACE: S1.4-FINDING-SHARED | requirement: identical finding shape
    # across Python and TS/JS resolvers | test: test_finding_shape_unresolved_symbol
    return {
        "file": filename, "line": line, "kind": kind, "expression": expression,
        "reason": "unresolved-symbol",
    }


def sort_findings(findings: list) -> list:
    # KS-TRACE: S1.4-FINDING-SHARED | requirement: deterministic ordering,
    # shared by both resolvers so cross-language runs (a project with both
    # .py and .ts files) can be merged and sorted identically
    # | test: test_sort_findings_deterministic
    return sorted(findings, key=lambda f: (f["file"], f["line"], f["expression"]))

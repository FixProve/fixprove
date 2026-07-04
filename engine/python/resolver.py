"""
FixProve — Milestone 1, Session 1.3: Hallucination Resolver
===============================================================

Joins Session 1.1's syntactic symbol extraction against Session 1.2's
dependency knowledge base to flag references that cannot be confidently
resolved against the real, installed API of a project's dependencies.

CONTRACT (locked with Yehor, 2026-07-04)
-----------------------------------------
  Input      : a set of .py file paths (or a single file/directory --
               resolved by the CLI layer, see cli.py) + a knowledge base
               dict as produced by knowledge_base.build_knowledge_base().
  Output     : a sorted list of finding dicts:
                   {"file", "line", "kind", "expression", "reason"}
               reason in {"dependency-not-installed", "dependency-version-mismatch",
                          "unresolved-symbol"}
  Invariant  : deterministic -- same (files, KB) -> identical findings list,
               every run (pure data transformation, no randomness; output
               explicitly sorted by (file, line) for stability).
  Adversarial: a re-exported symbol (e.g. pandas.read_excel, which is
               actually defined in a submodule but re-exported at the
               pandas top level) must NOT be flagged -- this falls out of
               Session 1.2's introspection-based KB "for free" (dir() on
               the real imported module object naturally includes
               re-exports), as long as this resolver correctly maps the
               code's import ALIAS back to the KB's DISTRIBUTION key.

LOCKED DECISION (Yehor, Session 1.3 Stage 1): if a referenced symbol
belongs to a package whose KB introspection degraded, timed out, or
crashed, it is treated strictly as "cannot verify" and is NEVER flagged.
Only "not-installed" / "version-mismatch" (confidently known dependency
problems) and "ok" status with a symbol confirmed absent from the
introspected public API count as flaggable. No probabilistic/"suspect"
states are introduced.

SCOPE ASSUMPTIONS (AI-logged, pending Yehor override)
--------------------------------------------------------
  - Only references whose root identifier is a traceable import alias are
    checked. Local variables, function parameters, and any other name not
    bound by an `import`/`from ... import` statement in the same file are
    silently skipped (out of scope) -- we do not perform type inference.
  - Standard-library modules (sys.stdlib_module_names) are never checked
    or flagged -- they ship with the interpreter and are never a
    dependency-resolution concern.
  - A module referenced in code but NOT present in the knowledge base at
    all (i.e. not declared in the requirements.txt the KB was built from,
    and not stdlib) is out of scope this session -- flagging every
    undeclared-but-real import (numpy used without being pinned, say)
    would require a live, unscoped install-check this session does not
    perform, and risks false positives no differently than a full
    reverse-dependency audit would. Only dependencies the KB actually has
    an opinion about are checked.
  - Resolution depth is ONE HOP past the import alias/from-import binding:
    `pd.read_excel` is checked (hop 1: "read_excel" in pandas' symbols);
    `pd.io.common.get_handle` is only checked at hop 1 ("io" exists on
    pandas) -- anything deeper is unverified and NOT flagged, since
    Session 1.2's KB does not recursively introspect submodules. This
    protects the zero-false-positive requirement at the cost of missing
    deeper hallucinations (a known limitation, not a hidden one).
  - A `from x import *` or `__import__(...)` import (flagged
    "unresolvable-by-design" by Session 1.1) never contributes a binding
    to the alias map -- any code relying on such a binding is left
    entirely unchecked rather than guessed at.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Optional

from finding import dependency_status_finding, unresolved_symbol_finding, sort_findings
from knowledge_base import _build_reverse_map, _resolve_import_name
from symbol_extractor import extract_symbols

# KS-TRACE: S1.4-SHARED-CORE | requirement: reuse finding.py's shared
# construction helpers rather than local duplicates, so Session 1.3's
# Python resolver and Session 1.4's TS/JS resolver provably share the same
# finding-shape code path, not just a coincidentally-matching schema
# | test: test_finding_helpers_imported_from_shared_module
_FLAGGABLE_DEPENDENCY_STATUSES = {"not-installed", "version-mismatch"}


def build_import_name_bridge(kb: dict) -> dict:
    """Map import-name-as-written-in-code -> KB distribution-name key.

    KS-TRACE: S1.3-BRIDGE | assumption: reuses Session 1.2's own
    _build_reverse_map/_resolve_import_name (tested, shipped logic) rather
    than re-deriving import-name resolution independently, so a
    distribution like "PyYAML" (requirements.txt) correctly bridges to
    code that does `import yaml` | test: test_bridge_handles_distribution_import_name_mismatch
    """
    reverse_map = _build_reverse_map()
    bridge: dict = {}
    for dist_name, entry in kb.get("modules", {}).items():
        if entry.get("status") == "unsupported-requirement-line":
            continue
        import_name = _resolve_import_name(dist_name, reverse_map)
        bridge.setdefault(import_name, dist_name)
    return bridge


def _build_alias_map(imports: list) -> dict:
    """Map a locally-bound name -> its import binding info.

    KS-TRACE: S1.3-ALIAS-MAP | requirement: correctly distinguish
    `import x as y` (y -> module x) from `import a.b.c` with no alias
    (only "a" is locally bound, per real Python semantics) from
    `from x import y as z` (z -> leaf symbol y of module x)
    | test: test_alias_map_plain_import, test_alias_map_aliased_import,
            test_alias_map_dotted_import_no_alias, test_alias_map_from_import,
            test_alias_map_skips_wildcard_and_dynamic_imports
    """
    alias_map: dict = {}
    for entry in imports:
        if entry.get("flag") == "unresolvable-by-design":
            continue  # star/dynamic imports: cannot safely bind a name
        if entry["kind"] == "import":
            if entry["alias"]:
                local_name = entry["alias"]
                module = entry["module"]
            else:
                local_name = entry["module"].split(".")[0]
                module = local_name
            alias_map[local_name] = {"kind": "import", "module": module, "line": entry["line"]}
        elif entry["kind"] == "from_import":
            local_name = entry["alias"] or entry["name"]
            alias_map[local_name] = {
                "kind": "from_import", "module": entry["module"],
                "leaf": entry["name"], "line": entry["line"],
            }
    return alias_map


def check_source(source: str, kb: dict, filename: str = "<string>", bridge: Optional[dict] = None) -> list:
    """Resolve one file's extracted symbols against the KB. Returns findings.

    KS-TRACE: S1.3-CHECK-CORE | requirement: catches typo'd attribute calls
    and uninstalled dependencies; zero false positives on valid/re-exported
    symbols; deterministic | test: test_catches_typo_attribute_call,
    test_catches_not_installed_dependency, test_does_not_flag_reexported_symbol,
    test_does_not_flag_local_variable, test_determinism_repeat_check
    """
    if bridge is None:
        bridge = build_import_name_bridge(kb)

    extracted = extract_symbols(source)
    alias_map = _build_alias_map(extracted["imports"])
    findings = []

    # ---- Pass A: import-statement-level checks -----------------------
    # KS-TRACE: S1.3-PASS-A | requirement: a plain `import x` where x is
    # not installed / wrong version is flagged ONCE at the import line;
    # a `from x import y` where y doesn't exist in x's real API is
    # flagged at the import line too (catches hallucinated from-imports
    # even if the imported name is never called/dotted anywhere, which
    # Session 1.1's call_targets/attribute_chains would otherwise miss)
    # | test: test_catches_not_installed_dependency, test_catches_bad_from_import
    for entry in extracted["imports"]:
        if entry.get("flag") == "unresolvable-by-design":
            continue
        top_level_module = entry["module"].split(".")[0]
        if top_level_module in sys.stdlib_module_names:
            continue
        dist_name = bridge.get(top_level_module)
        if dist_name is None:
            continue  # not a declared dependency at all -- out of scope
        kb_entry = kb["modules"][dist_name]
        status = kb_entry.get("status")
        expr = entry["module"] if entry["kind"] == "import" else f'{entry["module"]}.{entry["name"]}'
        if status in _FLAGGABLE_DEPENDENCY_STATUSES:
            findings.append(dependency_status_finding(filename, entry["line"], "import", expr, status))
            continue
        if status != "ok":
            continue  # degraded/timeout/crashed/import-error -- cannot verify, never flag
        if entry["kind"] == "from_import":
            leaf = entry["name"]
            if leaf not in kb_entry.get("symbols", []):
                findings.append(unresolved_symbol_finding(filename, entry["line"], "from_import", expr))

    # ---- Pass B: call_targets / attribute_chains hop-1 checks ---------
    # KS-TRACE: S1.3-PASS-B | requirement: obj.attr / obj.method(...) where
    # "obj" is a plain-import alias and "attr"/"method" doesn't exist on
    # the real installed module -- catches the pd.read_exel typo case.
    # Only `kind="import"` bindings are checked here; from_import bindings
    # were already fully validated in Pass A (checking them again here
    # would double-report the same underlying issue).
    # | test: test_catches_typo_attribute_call, test_does_not_flag_reexported_symbol,
    #         test_resolution_stops_after_one_hop
    for category in ("call_targets", "attribute_chains"):
        for entry in extracted[category]:
            parts = entry["expression"].split(".")
            root, rest = parts[0], parts[1:]
            if not rest:
                continue  # bare alias reference, nothing to check
            binding = alias_map.get(root)
            if binding is None or binding["kind"] != "import":
                continue  # local var/param, or already handled in Pass A
            module_top = binding["module"].split(".")[0]
            if module_top in sys.stdlib_module_names:
                continue
            dist_name = bridge.get(module_top)
            if dist_name is None:
                continue
            kb_entry = kb["modules"][dist_name]
            if kb_entry.get("status") != "ok":
                continue  # not-installed/version-mismatch already reported in Pass A;
                          # degraded/timeout/crashed -- cannot verify, never flag
            hop1 = rest[0]
            if hop1 not in kb_entry.get("symbols", []):
                findings.append(unresolved_symbol_finding(filename, entry["line"], category, entry["expression"]))

    return sort_findings(findings)


def check_file(py_path, kb: dict, bridge: Optional[dict] = None) -> list:
    source = Path(py_path).read_text(encoding="utf-8")
    return check_source(source, kb, filename=str(py_path), bridge=bridge)


def check_paths(paths: list, kb: dict) -> list:
    """Check multiple files against one KB. Builds the bridge map once.

    KS-TRACE: S1.3-MULTI-FILE | requirement: deterministic ordering across
    files regardless of input order | test: test_check_paths_sorted_deterministic
    """
    bridge = build_import_name_bridge(kb)
    findings = []
    for path in paths:
        findings.extend(check_file(path, kb, bridge=bridge))
    return sort_findings(findings)

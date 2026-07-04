"""
FixProve — Milestone 1, Session 1.4: TypeScript/JS Hallucination Resolver
=============================================================================

Joins Session 1.4's TS/JS symbol extraction (ts_symbol_extractor.py)
against Session 1.4's TS/JS knowledge base (ts_knowledge_base.py) to flag
references that cannot be confidently resolved against the real,
installed .d.ts API of a project's npm dependencies.

Mirrors Session 1.3's resolver.py contract/shape exactly where the two
languages' semantics allow, and shares its actual finding-construction
code via finding.py (see that module's docstring) -- not just a
similarly-shaped output by convention.

CONTRACT (locked with Yehor, 2026-07-04, Session 1.4)
-------------------------------------------------------
  Input      : a set of .ts/.tsx file paths + a KB dict as produced by
               ts_knowledge_base.build_knowledge_base().
  Output     : a sorted list of finding dicts (IDENTICAL shape to the
               Python resolver, via finding.py):
                   {"file", "line", "kind", "expression", "reason"}
               reason in {"dependency-not-installed", "unresolved-symbol"}
               ("dependency-version-mismatch" is not produced this
               session -- see Known Limitations: no lockfile/version-pin
               cross-check was built for the npm side yet, matching the
               Python resolver's own Stage-1 scope for that reason code).
  Invariant  : deterministic -- same (files, KB) -> identical findings,
               every run (pure data transformation; output sorted).
  Adversarial: type-only imports (`import type { Foo } from "./x"`) are
               still checked for EXISTENCE (a type-only import of a
               non-existent export is still a hallucination) but never
               contribute a runtime-callable binding to Pass B. Re-exports
               (`export {x} from`, `export * from`) of a non-existent
               upstream symbol are caught exactly like a `from`-import of
               a non-existent symbol in the Python path.

LOCKED DECISION (reused from Session 1.3, applied to a new TS-specific
degradation trigger discovered this session -- module augmentation): if a
referenced package's KB status is "no-types" or "degraded" (module
augmentation, or a parse/resolve failure), it is treated strictly as
"cannot verify" and NEVER flagged. Only "not-installed" (confidently
known) and "ok" status with a symbol confirmed absent count as flaggable.

SCOPE ASSUMPTIONS (AI-logged, pending Yehor override)
--------------------------------------------------------
  - Only references whose root identifier is a traceable import binding
    (default/named/namespace) are checked. Local variables/parameters are
    silently skipped, same as the Python resolver.
  - Relative-path imports (`./x`, `../y`) are OUT OF SCOPE this session --
    they resolve to project-local files, not npm dependencies, and
    checking them would require full local-module resolution (a
    different problem from "does this npm package really export this?").
  - A deep subpath import (`import x from "lodash/fp"`) is only checked
    for package-installed-at-all; its own symbol existence is NOT checked
    (this KB only parses a package's declared ENTRY .d.ts, not arbitrary
    subpath declaration files) -- flagged as a known limitation, not
    silently over-scoped.
  - A default-import binding (`import axios from "axios"`) is NEVER
    flagged at the import statement itself, even if the package has no
    resolvable default export -- `default_export_symbols is None` is
    ambiguous between "genuinely no default export" and "default export
    type exists but this KB could not flatten it" (e.g. a function type,
    not an interface). Resolving that ambiguity confidently would require
    deeper type-system reasoning this KB does not attempt; per the
    zero-false-positive mandate, ambiguity resolves to silence.
  - Resolution depth is ONE HOP past the binding, identical in spirit to
    the Python resolver: `axios.get` is checked; `axios.defaults.headers`
    is only checked at hop 1 ("defaults" exists on the flattened type) --
    deeper chains are unverified and not flagged.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from finding import dependency_status_finding, unresolved_symbol_finding, sort_findings
from ts_symbol_extractor import extract_symbols

_FLAGGABLE_DEPENDENCY_STATUSES = {"not-installed"}
_NEVER_FLAG_STATUSES = {"no-types", "degraded"}


def _top_level_package(module: str) -> str:
    # KS-TRACE: S1.4-TS-PKG-NAME | requirement: `lodash/fp` -> `lodash`;
    # `@types/lodash/common` -> `@types/lodash`; `axios` -> `axios`
    # | test: test_top_level_package_scoped, test_top_level_package_plain,
    #         test_top_level_package_deep_subpath
    if module.startswith("@"):
        parts = module.split("/")
        return "/".join(parts[:2]) if len(parts) >= 2 else module
    return module.split("/")[0]


def _is_relative(module: str) -> bool:
    return module.startswith(".")


def _build_alias_map(imports: list) -> dict:
    """Map a locally-bound name -> its import binding info (Pass B use).

    KS-TRACE: S1.4-TS-ALIAS-MAP | requirement: default/namespace imports
    bind a name usable for hop-1 attribute/call checks; named imports,
    re-exports, type-only imports, and dynamic imports do NOT (already
    fully validated in Pass A, or not a runtime-callable binding at all)
    | test: test_alias_map_default_import, test_alias_map_namespace_import,
            test_alias_map_skips_named_type_only_dynamic
    """
    alias_map: dict = {}
    for entry in imports:
        if entry.get("flag") == "unresolvable-by-design":
            continue
        if entry.get("type_only"):
            continue
        module = entry["module"]
        if not module or _is_relative(module):
            continue
        if entry["kind"] == "default_import" and entry["local_name"]:
            alias_map[entry["local_name"]] = {"kind": "default_import", "module": module, "line": entry["line"]}
        elif entry["kind"] == "namespace_import" and entry["local_name"]:
            alias_map[entry["local_name"]] = {"kind": "namespace_import", "module": module, "line": entry["line"]}
    return alias_map


def check_source(source: str, kb: dict, filename: str = "<string>", tsx: bool = False) -> list:
    """Resolve one TS/JS file's extracted symbols against the KB.

    KS-TRACE: S1.4-TS-CHECK-CORE | requirement: catches a hallucinated
    method on a real npm package and a non-existent import; zero false
    positives on valid/re-exported/type-only symbols; deterministic
    | test: test_catches_hallucinated_method_axios,
            test_catches_nonexistent_named_import,
            test_catches_not_installed_package,
            test_does_not_flag_reexported_symbol,
            test_does_not_flag_degraded_package
    """
    extracted = extract_symbols(source, tsx=tsx)
    packages = kb.get("packages", {})
    findings = []

    # ---- Pass A: import/re-export-statement-level checks ---------------
    # KS-TRACE: S1.4-TS-PASS-A | requirement: a bare `import x from "pkg"`
    # where pkg is not installed is flagged once at the import line; a
    # named import/re-export of a symbol that doesn't exist in the real
    # package's exports is flagged at that line, even if never called
    # | test: test_catches_not_installed_package, test_catches_bad_named_import,
    #         test_catches_bad_named_reexport, test_catches_bad_star_target_narrow_scope
    for entry in extracted["imports"]:
        if entry.get("flag") == "unresolvable-by-design":
            continue
        module = entry["module"]
        if not module or _is_relative(module):
            continue
        pkg_name = _top_level_package(module)
        pkg_entry = packages.get(pkg_name)
        if pkg_entry is None:
            continue  # not a declared/introspected dependency -- out of scope

        status = pkg_entry.get("status")
        kind = entry["kind"]
        expr = f'{module}.{entry["imported_name"]}' if entry.get("imported_name") else module

        if status in _FLAGGABLE_DEPENDENCY_STATUSES:
            findings.append(dependency_status_finding(filename, entry["line"], kind, expr, status))
            continue
        if status in _NEVER_FLAG_STATUSES:
            continue  # cannot verify -- never flag (locked decision)
        if status != "ok":
            continue

        if pkg_name != module:
            continue  # deep subpath -- installed-at-all already confirmed; symbol existence out of scope

        if kind in ("named_import", "named_reexport"):
            imported_name = entry.get("imported_name")
            if imported_name and imported_name not in pkg_entry.get("symbols", []):
                findings.append(unresolved_symbol_finding(filename, entry["line"], kind, expr))

    # ---- Pass B: call_targets / attribute_chains hop-1 checks -----------
    # KS-TRACE: S1.4-TS-PASS-B | requirement: `axios.getData(...)` (typo'd
    # method on a real npm package's default export) is caught; a re-
    # exported/valid real method (`axios.get`) is never flagged
    # | test: test_catches_hallucinated_method_axios,
    #         test_does_not_flag_valid_axios_chain_method,
    #         test_resolution_stops_after_one_hop
    alias_map = _build_alias_map(extracted["imports"])
    for category in ("call_targets", "attribute_chains"):
        for entry in extracted[category]:
            parts = entry["expression"].split(".")
            root, rest = parts[0], parts[1:]
            if not rest:
                continue
            binding = alias_map.get(root)
            if binding is None:
                continue
            module = binding["module"]
            pkg_name = _top_level_package(module)
            pkg_entry = packages.get(pkg_name)
            if pkg_entry is None or pkg_entry.get("status") != "ok" or pkg_name != module:
                continue  # not-installed already reported in Pass A; degraded/no-types/subpath -- never flag

            hop1 = rest[0]
            if binding["kind"] == "default_import":
                symbol_set = pkg_entry.get("default_export_symbols")
                if symbol_set is None:
                    continue  # could not resolve default export's type -- cannot verify, never flag
                if hop1 not in symbol_set:
                    findings.append(unresolved_symbol_finding(filename, entry["line"], category, entry["expression"]))
            elif binding["kind"] == "namespace_import":
                symbol_set = pkg_entry.get("symbols", [])
                if hop1 not in symbol_set:
                    findings.append(unresolved_symbol_finding(filename, entry["line"], category, entry["expression"]))

    return sort_findings(findings)


def check_file(ts_path, kb: dict) -> list:
    p = Path(ts_path)
    source = p.read_text(encoding="utf-8")
    return check_source(source, kb, filename=str(ts_path), tsx=(p.suffix == ".tsx"))


def check_paths(paths: list, kb: dict) -> list:
    """Check multiple TS/JS files against one KB.

    KS-TRACE: S1.4-TS-MULTI-FILE | requirement: deterministic ordering
    across files regardless of input order | test:
    test_check_paths_sorted_deterministic
    """
    findings = []
    for path in paths:
        findings.extend(check_file(path, kb))
    return sort_findings(findings)

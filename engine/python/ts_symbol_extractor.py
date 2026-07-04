"""
FixProve — Milestone 1, Session 1.4: Deterministic TypeScript/JS Symbol Extractor
====================================================================================

Extracts every referenced symbol from a single .ts/.tsx source file via
tree-sitter-typescript: imports (including type-only, namespace, and
this-file's-own re-exports), call targets, and attribute-access chains,
each tagged with a 1-indexed source line.

Mirrors Session 1.1's symbol_extractor.py contract and shape as closely as
JS/TS's different import/export grammar allows -- same three-category
output idea, same 1-indexed line convention, same overlap rule for calls
vs. attribute chains, same iterative (non-recursive) traversal.

CONTRACT (locked with Yehor, 2026-07-04, Session 1.4)
-------------------------------------------------------
  Input       : path to one .ts or .tsx file (.js/.jsx accepted via the
                same TypeScript grammar, since it is a syntactic superset;
                type-only constructs simply won't appear in plain JS).
  Output      : JSON-serializable dict with exactly three keys:
                    imports, call_targets, attribute_chains
  Line numbers: 1-indexed (tree-sitter rows are 0-indexed; +1 here),
                matching Session 1.1's convention exactly.
  Determinism : identical input -> byte-identical JSON, every run.
  Overlap rule: identical to Session 1.1 -- a call's callee expression is
                emitted to call_targets ONLY, never also to
                attribute_chains, even when the callee is a dotted
                (member_expression) chain.

imports[] entry shape (KS-TRACE: S1.4-IMPORTS-SCHEMA)
--------------------------------------------------------
  {
    "kind": "default_import" | "named_import" | "namespace_import"
            | "named_reexport" | "star_reexport" | "dynamic_import",
    "module": str,                  # the source module string
    "imported_name": Optional[str], # original exported name (named_import/
                                     # named_reexport only); None otherwise
    "local_name": Optional[str],    # name bound in THIS file's scope
                                     # (None for star_reexport/dynamic_import
                                     # with no literal target)
    "line": int,
    "type_only": bool,              # `import type ...` / `export type {...}`
    "flag": Optional[str],          # None | "unresolvable-by-design"
  }

ADVERSARIAL CASES (locked, Session 1.4)
------------------------------------------
  * `import type { Foo } from "./x"`  -> type_only=True; still validated
    for EXISTENCE against the module's real exports (a type-only import of
    a name that doesn't exist is still a hallucination), but never
    contributes to call_targets/attribute_chains resolution (type-only
    bindings are erased at runtime and cannot be called).
  * `export { x, y as z } from "./other"` / `export * from "./barrel"`
    -> captured as named_reexport / star_reexport imports entries, so a
    re-export of a name that doesn't actually exist upstream is still
    caught by the resolver, exactly like a `from ... import` of a
    non-existent symbol in the Python path.
  * `import(...)` (dynamic import expression) -> appears in call_targets
    as an ordinary call AND as an imports entry with
    kind="dynamic_import", flag="unresolvable-by-design" (module name
    captured best-effort only if the first argument is a literal string) --
    directly mirrors Session 1.1's `__import__(...)` handling.

ASSUMPTIONS (AI-logged, pending Yehor override)
--------------------------------------------------
  - Purely syntactic extraction; no cross-file/semantic resolution here
    (that is ts_knowledge_base.py / ts_resolver.py's job).
  - Bracket/subscript property access (`obj["prop"]`) is NOT treated as an
    attribute chain -- only dotted `member_expression` access is captured.
    A computed property name is not staticaly resolvable in general (it
    could be any runtime string), so treating it as a symbol reference
    would risk both false positives and false negatives. Out of scope,
    stated here rather than silently dropped.
  - CommonJS `require(...)` is NOT treated as an import statement (it is
    an ordinary call_targets entry, same as Python's
    importlib.import_module(...) being left as a plain call). Only ES
    module `import` / `export ... from` syntax is treated specially.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Optional

import tree_sitter_typescript as ts_ts
from tree_sitter import Language, Node, Parser

_TS_LANGUAGE = Language(ts_ts.language_typescript())
_TSX_LANGUAGE = Language(ts_ts.language_tsx())


# ---------------------------------------------------------------------------
# Low-level helpers (mirrors symbol_extractor.py's _text/_line exactly)
# ---------------------------------------------------------------------------

def _text(node: Optional[Node], source: bytes) -> str:
    if node is None:
        return ""
    return source[node.start_byte:node.end_byte].decode("utf-8", errors="replace")


def _line(node: Node) -> int:
    # KS-TRACE: S1.4-LINEIDX | assumption: same 1-indexing convention as
    # Session 1.1, for downstream cross-language schema consistency
    # | test: test_line_numbers_1_indexed
    return node.start_point[0] + 1


def _string_literal_value(node: Optional[Node], source: bytes) -> Optional[str]:
    # KS-TRACE: S1.4-STRING-LIT | assumption: a module specifier or dynamic
    # import argument is only resolvable if it is a literal string (no
    # template-literal interpolation, no concatenation, no variable)
    # | test: test_module_specifier_literal, test_dynamic_import_nonliteral_arg
    if node is None or node.type != "string":
        return None
    parts = [c for c in node.children if c.type == "string_fragment"]
    if not parts:
        return None
    return "".join(_text(p, source) for p in parts)


# ---------------------------------------------------------------------------
# Import / export-as-import extraction
# ---------------------------------------------------------------------------

def _import_entry(*, kind, module, imported_name, local_name, line, type_only, flag) -> dict:
    return {
        "kind": kind, "module": module, "imported_name": imported_name,
        "local_name": local_name, "line": line, "type_only": type_only, "flag": flag,
    }


def _extract_import_statement(node: Node, source: bytes) -> list:
    # KS-TRACE: S1.4-IMPORTS | requirement: default / named (incl. aliased)
    # / namespace / type-only imports all captured with the correct
    # local-scope binding name | test: test_default_import,
    # test_named_import, test_aliased_named_import, test_namespace_import,
    # test_type_only_import_flagged
    children = node.children
    is_type_only = any(c.type == "type" for c in children)
    clause = next((c for c in children if c.type == "import_clause"), None)
    module_str = next((c for c in children if c.type == "string"), None)
    module_text = _string_literal_value(module_str, source) or _text(module_str, source)
    line = _line(node)
    entries = []
    if clause is None:
        return entries  # side-effect-only `import "./x";` -- nothing bound, nothing to check

    for child in clause.children:
        if child.type == "identifier":
            # bare default import: `import axios from "axios"`
            entries.append(_import_entry(
                kind="default_import", module=module_text, imported_name=None,
                local_name=_text(child, source), line=line, type_only=is_type_only, flag=None,
            ))
        elif child.type == "namespace_import":
            ident = next((c for c in child.children if c.type == "identifier"), None)
            entries.append(_import_entry(
                kind="namespace_import", module=module_text, imported_name=None,
                local_name=_text(ident, source) if ident is not None else None,
                line=line, type_only=is_type_only, flag=None,
            ))
        elif child.type == "named_imports":
            for spec in child.children:
                if spec.type != "import_specifier":
                    continue
                idents = [c for c in spec.children if c.type == "identifier"]
                spec_type_only = any(c.type == "type" for c in spec.children)
                if len(idents) == 2:
                    imported, local = idents[0], idents[1]
                else:
                    imported = local = idents[0]
                entries.append(_import_entry(
                    kind="named_import", module=module_text,
                    imported_name=_text(imported, source), local_name=_text(local, source),
                    line=line, type_only=(is_type_only or spec_type_only), flag=None,
                ))
    return entries


def _extract_export_statement(node: Node, source: bytes) -> list:
    # KS-TRACE: S1.4-REEXPORTS | requirement: `export {x, y as z} from "m"`
    # and `export * from "m"` captured as import-like entries so a
    # re-export of a non-existent upstream symbol is still catchable
    # | test: test_named_reexport, test_aliased_named_reexport,
    #         test_star_reexport, test_export_without_from_not_reexport
    children = node.children
    has_from = any(c.type == "from" for c in children)
    if not has_from:
        return []  # direct export (interface/function/const/class/default) -- not an import

    is_type_only = any(c.type == "type" for c in children)
    module_str = next((c for c in children if c.type == "string"), None)
    module_text = _string_literal_value(module_str, source) or _text(module_str, source)
    line = _line(node)
    entries = []

    export_clause = next((c for c in children if c.type == "export_clause"), None)
    has_star = any(c.type == "*" for c in children)

    if export_clause is not None:
        for spec in export_clause.children:
            if spec.type != "export_specifier":
                continue
            idents = [c for c in spec.children if c.type == "identifier"]
            spec_type_only = any(c.type == "type" for c in spec.children)
            # export_specifier "x" -> original=local="x"; "y as z" -> original y, local z
            original = idents[0]
            local = idents[-1]
            entries.append(_import_entry(
                kind="named_reexport", module=module_text,
                imported_name=_text(original, source), local_name=_text(local, source),
                line=line, type_only=(is_type_only or spec_type_only), flag=None,
            ))
    elif has_star:
        entries.append(_import_entry(
            kind="star_reexport", module=module_text, imported_name=None,
            local_name=None, line=line, type_only=is_type_only, flag=None,
        ))
    return entries


# ---------------------------------------------------------------------------
# Core traversal: calls + attribute chains (mirrors symbol_extractor.py's
# _Extractor class structure and DEFECT-001/DEFECT-002 fixes proactively)
# ---------------------------------------------------------------------------

class _Extractor:
    def __init__(self, source: bytes):
        self.source = source
        self.imports: list = []
        self.call_targets: list = []
        self.attribute_chains: list = []

    def run(self, root: Node) -> None:
        # KS-TRACE: S1.4-TRAVERSAL | assumption: explicit-stack iterative
        # walk, applying Session 1.1's DEFECT-002 fix (recursion-limit
        # crash on deep chains) PROACTIVELY rather than waiting to
        # rediscover it | test: test_determinism_repeat_parse,
        # test_deep_member_chain_no_recursion_error
        stack = [(root, False)]
        while stack:
            node, suppress_attr = stack.pop()
            if node.type == "import_statement":
                self.imports.extend(_extract_import_statement(node, self.source))
                continue
            if node.type == "export_statement":
                self.imports.extend(_extract_export_statement(node, self.source))
                # An export_statement with `from` has no call/attribute
                # content of its own; one without `from` may wrap a
                # direct export of an expression/declaration that DOES
                # need normal traversal (e.g. `export default someCall()`)
                # -- so fall through to children only in that case.
                if any(c.type == "from" for c in node.children):
                    continue
                for child in reversed(node.children):
                    stack.append((child, False))
                continue
            if node.type == "call_expression":
                self._push_call(node, stack)
                continue
            if node.type == "member_expression":
                self._push_member(node, suppress_attr, stack)
                continue
            for child in reversed(node.children):
                stack.append((child, False))

    def _push_call(self, node: Node, stack: list) -> None:
        # KS-TRACE: S1.4-CALLS | requirement: every call_expression's callee
        # recorded verbatim; dynamic `import(...)` captured both as a call
        # AND as an unresolvable-by-design imports entry
        # | test: test_simple_call, test_dotted_call, test_dynamic_import_expression
        func = node.child_by_field_name("function")
        args = node.child_by_field_name("arguments")
        if func is not None:
            self.call_targets.append({
                "expression": _text(func, self.source),
                "line": _line(node),
                "flag": None,
            })
            if func.type == "import":
                first_string = None
                if args is not None:
                    first_string = next((c for c in args.children if c.type == "string"), None)
                self.imports.append(_import_entry(
                    kind="dynamic_import",
                    module=_string_literal_value(first_string, self.source),
                    imported_name=None, local_name=None, line=_line(node),
                    type_only=False, flag="unresolvable-by-design",
                ))
        # KS-TRACE: S1.4-DEFECT-PARITY | fix (applied proactively, mirroring
        # Session 1.1's DEFECT-001): use node.id (stable) rather than
        # Python's id() to exclude already-handled children from the
        # generic fallback traversal, since tree-sitter Node wrappers are
        # not interned | test: test_no_duplicate_visit_via_defensive_loop
        handled_ids = {n.id for n in (func, args) if n is not None}
        others = [c for c in node.children if c.id not in handled_ids and c.type not in ("(", ")")]
        for c in reversed(others):
            stack.append((c, False))
        if args is not None:
            stack.append((args, False))
        if func is not None:
            stack.append((func, True))

    def _push_member(self, node: Node, suppress_attr: bool, stack: list) -> None:
        # KS-TRACE: S1.4-ATTRS | requirement: record the MAXIMAL dotted
        # member_expression chain once, never sub-chains, and never when
        # it is itself a call's callee (overlap rule) | test:
        # test_nested_member_chain_no_duplicates,
        # test_member_excluded_when_call_target
        if not suppress_attr:
            self.attribute_chains.append({
                "expression": _text(node, self.source),
                "line": _line(node),
                "flag": None,
            })
        obj = node.child_by_field_name("object")
        if obj is not None:
            stack.append((obj, True))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def extract_symbols(source: str, tsx: bool = False) -> dict:
    """Extract imports / call_targets / attribute_chains from TS/JS source text."""
    # KS-TRACE: S1.4-DETERMINISM | requirement: same file -> identical
    # output, every run | test: test_determinism_repeat_parse
    language = _TSX_LANGUAGE if tsx else _TS_LANGUAGE
    parser = Parser(language)
    source_bytes = source.encode("utf-8")
    tree = parser.parse(source_bytes)

    extractor = _Extractor(source_bytes)
    extractor.run(tree.root_node)

    def _sort_key(entry: dict) -> tuple:
        return (entry["line"],)

    return {
        "imports": sorted(extractor.imports, key=_sort_key),
        "call_targets": sorted(extractor.call_targets, key=_sort_key),
        "attribute_chains": sorted(extractor.attribute_chains, key=_sort_key),
    }


def extract_symbols_from_file(path) -> dict:
    """Extract symbols from a .ts/.tsx/.js/.jsx file on disk.

    KS-TRACE: S1.4-FILE-INPUT | requirement: input is a single source file
    | test: test_extract_from_file_path, test_rejects_unsupported_extension
    """
    p = Path(path)
    if p.suffix not in (".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"):
        raise ValueError("expected a .ts/.tsx/.js/.jsx file, got: " + (p.suffix or "(no extension)"))
    source = p.read_text(encoding="utf-8")
    return extract_symbols(source, tsx=(p.suffix == ".tsx"))


def main(argv=None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    if len(argv) != 1:
        print("usage: ts_symbol_extractor.py <file.ts>", file=sys.stderr)
        return 2
    result = extract_symbols_from_file(argv[0])
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""
FixProve — Milestone 1, Session 1.1: Deterministic Python Symbol Extractor
===========================================================================

Extracts every referenced symbol from a single Python source file via
tree-sitter: imports, call targets, and attribute-access chains, each
tagged with a 1-indexed source line.

CONTRACT (locked with Yehor, 2026-07-04)
-----------------------------------------
  Input            : path to one .py file (diff parsing is explicitly
                      OUT OF SCOPE for this session; deferred to a future
                      CLI/ingress-layer session).
  Output            : JSON-serializable dict with exactly three keys:
                          imports, call_targets, attribute_chains (each a
                          list of entry dicts).
  Line numbers      : 1-indexed (tree-sitter's native rows are 0-indexed;
                      normalized here for GitHub Checks API / SARIF
                      compatibility downstream).
  Determinism       : identical input file -> byte-identical JSON on every
                      run. Guaranteed by (a) tree-sitter's deterministic
                      parse, (b) a single fixed-order traversal, and (c) an
                      explicit final sort of every category by line number
                      (stable sort, so same-line ties keep discovery order).
  Overlap rule      : a call's callee expression is emitted to
                      call_targets ONLY. It is never also emitted to
                      attribute_chains, even if the callee is a dotted
                      attribute chain (e.g. obj.method() -> call_targets
                      only). Attribute access that is NOT itself a call
                      callee (including attribute expressions used as call
                      arguments) is emitted to attribute_chains.
  Adversarial cases :
      * from x import *   -> imports entry, name="*",
                              flag="unresolvable-by-design"
      * aliased imports    -> imports entry with alias populated,
                              NOT flagged (fully resolvable syntactically)
      * __import__(...)   -> appears in call_targets as an ordinary call,
                              AND as an imports entry with
                              kind="dynamic_import",
                              flag="unresolvable-by-design" (module name
                              captured best-effort only if the first
                              argument is a literal string).

ASSUMPTION (AI-logged, pending Yehor override)
-----------------------------------------------
  Purely syntactic extraction. No alias-to-real-module resolution, no
  cross-file/semantic resolution. importlib.import_module(...) and other
  non-__import__ dynamic-import mechanisms are NOT special-cased -- they
  appear only as ordinary call_targets entries. This is stated as a known
  limitation in the Keystone Report, not silently expanded scope.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Optional

import tree_sitter_python as tspython
from tree_sitter import Language, Node, Parser

_PY_LANGUAGE = Language(tspython.language())


# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------

def _text(node: Optional[Node], source: bytes) -> str:
    # KS-TRACE: S1.1-TEXT | assumption: source-text slicing is the cheapest
    # deterministic way to recover an expression's literal spelling without
    # re-serializing the AST | test: test_text_slicing_matches_source
    if node is None:
        return ""
    return source[node.start_byte:node.end_byte].decode("utf-8", errors="replace")


def _line(node: Node) -> int:
    # KS-TRACE: S1.1-LINEIDX | assumption: tree-sitter rows are 0-indexed;
    # +1 normalizes to 1-indexed lines per the locked contract (GitHub
    # Checks API / SARIF compatibility) | test: test_line_numbers_1_indexed
    return node.start_point[0] + 1


def _first_string_literal_value(argument_list: Optional[Node], source: bytes) -> Optional[str]:
    # KS-TRACE: S1.1-DYNAMIC-IMPORT | assumption: only a *literal* first
    # argument to __import__ can be resolved without execution; anything
    # else (a variable, an f-string, a concatenation) is left as None and
    # still carries the unresolvable-by-design flag upstream
    # | test: test_dynamic_import_literal_arg, test_dynamic_import_nonliteral_arg
    if argument_list is None:
        return None
    for child in argument_list.children:
        if child.type == "string":
            parts = [c for c in child.children if c.type == "string_content"]
            if parts:
                return "".join(_text(p, source) for p in parts)
            return None  # e.g. an f-string with only interpolation, no literal content
        if child.type in ("(", ")", ","):
            continue
        # First real argument is not a plain string literal (e.g. a name,
        # an f-string, a call) -> genuinely unresolvable without execution.
        return None
    return None


# ---------------------------------------------------------------------------
# Import extraction
# ---------------------------------------------------------------------------

def _import_entry(
    *, kind: str, module: Optional[str], name: Optional[str], alias: Optional[str],
    line: int, flag: Optional[str],
) -> dict:
    # KS-TRACE: S1.1-IMPORTS-SCHEMA | assumption: a single fixed key set/
    # order across every imports[] entry (regardless of import flavor) keeps
    # the JSON schema uniform and trivially diffable for the determinism
    # invariant | test: test_imports_schema_consistent
    return {
        "kind": kind,
        "module": module,
        "name": name,
        "alias": alias,
        "line": line,
        "flag": flag,
    }


def _extract_import_statement(node: Node, source: bytes) -> list:
    # KS-TRACE: S1.1-IMPORTS | requirement: plain `import x` / `import x as y`
    # / `import x, y as z` | test: test_plain_import, test_aliased_import,
    # test_multi_import
    entries = []
    for child in node.children:
        if child.type == "dotted_name":
            entries.append(_import_entry(
                kind="import", module=_text(child, source), name=None,
                alias=None, line=_line(child), flag=None,
            ))
        elif child.type == "aliased_import":
            dotted = child.children[0]
            alias_id = child.children[-1]
            entries.append(_import_entry(
                kind="import", module=_text(dotted, source), name=None,
                alias=_text(alias_id, source), line=_line(child), flag=None,
            ))
    return entries


def _extract_import_from_statement(node: Node, source: bytes) -> list:
    # KS-TRACE: S1.1-WILDCARD | requirement: `from x import *` must be
    # captured and flagged unresolvable-by-design, never silently dropped
    # | test: test_wildcard_import_flagged
    children = node.children
    try:
        import_kw_idx = next(i for i, c in enumerate(children) if c.type == "import")
    except StopIteration:
        return []  # malformed/partial parse; nothing safe to extract

    module_children = [c for c in children[1:import_kw_idx] if c.type in ("dotted_name", "relative_import")]
    module_node = module_children[0] if module_children else None
    module_text = _text(module_node, source) if module_node else ""

    name_children = children[import_kw_idx + 1:]
    entries = []
    for child in name_children:
        if child.type == "wildcard_import":
            entries.append(_import_entry(
                kind="from_import", module=module_text, name="*", alias=None,
                line=_line(child), flag="unresolvable-by-design",
            ))
        elif child.type == "dotted_name":
            entries.append(_import_entry(
                kind="from_import", module=module_text, name=_text(child, source),
                alias=None, line=_line(child), flag=None,
            ))
        elif child.type == "aliased_import":
            name_dotted = child.children[0]
            alias_id = child.children[-1]
            entries.append(_import_entry(
                kind="from_import", module=module_text, name=_text(name_dotted, source),
                alias=_text(alias_id, source), line=_line(child), flag=None,
            ))
    return entries


# ---------------------------------------------------------------------------
# Core traversal: calls + attribute chains
# ---------------------------------------------------------------------------

class _Extractor:
    def __init__(self, source: bytes):
        self.source = source
        self.imports: list = []
        self.call_targets: list = []
        self.attribute_chains: list = []

    def run(self, root: Node) -> None:
        # KS-TRACE: S1.1-TRAVERSAL | assumption: an EXPLICIT-STACK
        # (iterative) pre-order walk is deterministic by construction (same
        # tree structure every parse of the same bytes), and unlike Python
        # recursion it is bounded only by heap memory, not call-stack depth
        # | test: test_determinism_repeat_parse, test_deep_attribute_chain_no_recursion_error
        #
        # KS-TRACE: S1.1-DEFECT-002 | fix: the original implementation used
        # native Python recursion (one stack frame per AST level). A
        # generated/obfuscated file with a long attribute chain (e.g.
        # a.b.b.b... several hundred levels deep) blew Python's default
        # recursion limit and crashed with RecursionError instead of
        # degrading gracefully -- a determinism-invariant violation (a
        # crash is not a deterministic JSON output). Rewritten as an
        # explicit-stack traversal to remove the call-stack bound entirely.
        stack = [(root, False)]
        while stack:
            node, suppress_attr = stack.pop()
            if node.type == "import_statement":
                self.imports.extend(_extract_import_statement(node, self.source))
                continue
            if node.type == "import_from_statement":
                self.imports.extend(_extract_import_from_statement(node, self.source))
                continue
            if node.type == "call":
                self._push_call(node, stack)
                continue
            if node.type == "attribute":
                self._push_attribute(node, suppress_attr, stack)
                continue
            # Push in reverse so children are popped/visited left-to-right,
            # matching a standard recursive pre-order traversal exactly.
            for child in reversed(node.children):
                stack.append((child, False))

    def _push_call(self, node: Node, stack: list) -> None:
        # KS-TRACE: S1.1-CALLS | requirement: every Call node's callee
        # expression recorded verbatim, regardless of shape (name, dotted
        # chain, parenthesized lambda, subscript, chained call)
        # | test: test_simple_call, test_dotted_call, test_complex_callable
        func = node.child_by_field_name("function")
        args = node.child_by_field_name("arguments")
        if func is not None:
            self.call_targets.append({
                "expression": _text(func, self.source),
                "line": _line(node),
                "flag": None,
            })
            # KS-TRACE: S1.1-DYNAMIC-IMPORT | requirement: __import__(...)
            # must be captured as a call AND flagged unresolvable-by-design
            # as an import | test: test_dynamic_import_flagged_and_captured
            if func.type == "identifier" and _text(func, self.source) == "__import__":
                self.imports.append(_import_entry(
                    kind="dynamic_import",
                    module=_first_string_literal_value(args, self.source),
                    name=None, alias=None, line=_line(node),
                    flag="unresolvable-by-design",
                ))
        # KS-TRACE: S1.1-DEFECT-001 | fix: tree-sitter Node wrapper objects
        # are not interned/cached, so Python's id() returns a different
        # value each time the same underlying node is re-fetched (e.g. via
        # node.children vs child_by_field_name). Comparing id(func)/id(args)
        # against id(child) therefore always mismatched, causing a
        # "defensive" branch to silently re-visit the callee with
        # suppress_attr=False and double-record it into attribute_chains
        # (overlap-rule violation). Fixed by comparing the stable `.id`
        # property instead, which reflects the underlying C node pointer.
        # | test: test_no_duplicate_visit_via_defensive_loop,
        #         test_dotted_call_excluded_from_attribute_chains,
        #         test_nested_call_in_attribute_object_no_duplicate
        handled_ids = {n.id for n in (func, args) if n is not None}
        others = [c for c in node.children if c.id not in handled_ids and c.type not in ("(", ")")]
        # Push in reverse desired-visit order (stack is LIFO): "others"
        # first (visited last), then args, then func on top (visited
        # first) -- overlap rule: the callee subtree is walked with
        # suppression on, so a dotted callee never also lands in
        # attribute_chains.
        for c in reversed(others):
            stack.append((c, False))
        if args is not None:
            stack.append((args, False))
        if func is not None:
            stack.append((func, True))

    def _push_attribute(self, node: Node, suppress_attr: bool, stack: list) -> None:
        # KS-TRACE: S1.1-ATTRS | requirement: record the MAXIMAL dotted
        # chain once (never its sub-chains) unless it is itself a call's
        # callee (overlap rule, handled by suppress_attr from _push_call)
        # | test: test_nested_attribute_chain_no_duplicates,
        #         test_attribute_excluded_when_call_target,
        #         test_attribute_chain_rooted_in_call_result
        if not suppress_attr:
            self.attribute_chains.append({
                "expression": _text(node, self.source),
                "line": _line(node),
                "flag": None,
            })
        obj = node.child_by_field_name("object")
        if obj is not None:
            # Always suppress further down the chain's own spine: whether or
            # not *this* node was recorded, its sub-chain is redundant.
            stack.append((obj, True))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def extract_symbols(source: str) -> dict:
    """Extract imports / call_targets / attribute_chains from Python source text."""
    # KS-TRACE: S1.1-DETERMINISM | requirement: same file -> identical
    # output, every run | test: test_determinism_repeat_parse,
    # test_determinism_full_pipeline
    parser = Parser(_PY_LANGUAGE)
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
    """Extract symbols from a .py file on disk.

    KS-TRACE: S1.1-FILE-INPUT | requirement: input is a single .py file
    (diff input explicitly out of scope this session) | test:
    test_extract_from_file_path, test_rejects_non_py_extension
    """
    p = Path(path)
    if p.suffix != ".py":
        raise ValueError("expected a .py file, got: " + (p.suffix or "(no extension)"))
    source = p.read_text(encoding="utf-8")
    return extract_symbols(source)


def main(argv=None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    if len(argv) != 1:
        print("usage: symbol_extractor.py <file.py>", file=sys.stderr)
        return 2
    result = extract_symbols_from_file(argv[0])
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

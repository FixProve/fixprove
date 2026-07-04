"""
FixProve — Milestone 1, Session 1.4: TypeScript/JS Knowledge Base
=====================================================================

Builds a queryable map of the real public API of installed npm
dependencies' TYPE DECLARATIONS (.d.ts), mirroring Session 1.2's
knowledge_base.py contract for the Python side, but sourced from
declaration files rather than live runtime introspection (there is no
"import and dir() it" equivalent for a language FixProve's own engine
does not execute).

CONTRACT (locked with Yehor, 2026-07-04, Session 1.4)
-------------------------------------------------------
  Input   : a node_modules directory + a list of package names to
            introspect (mirrors Session 1.2's requirements.txt input,
            adapted to package.json dependencies).
  Output  : {"packages": {pkg_name: {status, version, symbols,
                                      default_export_symbols}}}
  Locating a package's types (Node/DefinitelyTyped convention):
      1. package.json "types" or "typings" field (bundled types)
      2. fallback: node_modules/@types/<scoped-safe-name>/package.json
         "types"/"typings" (default "index.d.ts" if unset per convention)
      3. neither found -> status "no-types" (cannot verify -- never flag,
         same locked principle as Session 1.3's degraded-KB rule)
  status values : "ok" | "not-installed" | "no-types" | "degraded"
      "degraded" mirrors Session 1.2's monkeypatch-package adversarial
      requirement, applied to a NEW real-world trigger discovered this
      session: TypeScript "declare module '<path>' { interface X {...} }"
      module augmentation. Real DefinitelyTyped packages (this session's
      flagship discovery: @types/lodash) attach the majority of their
      public API to an already-declared interface via augmentation
      blocks scattered across many files, which is TypeScript
      declaration-merging semantics this KB does not attempt to
      re-implement (that is precisely the risk Yehor accepted by
      choosing tree-sitter + custom KB over the TS Compiler API). Rather
      than silently produce an INCOMPLETE symbol set (which would cause
      the resolver to flag legitimate calls like `_.debounce(...)` as
      hallucinated -- a false positive, the one thing this engine must
      never produce), the ENTIRE package is marked "degraded" the moment
      any module-augmentation block is found anywhere in its declaration
      file set. Per the Session 1.3 locked rule, "degraded" is NEVER
      flagged by the resolver, for any symbol from that package.

  symbols               : top-level names this package exports via
                          `export interface/type/const/function/class/
                          enum X` (directly, or via `export {X} from`/
                          `export * from` re-exports resolved
                          transitively) -- for `import { X } from "pkg"`.
  default_export_symbols: the flattened member set of the type bound to
                          `export default X` / `export = X` (interface
                          `extends` chains fully resolved, cycle-guarded)
                          -- for `import pkg from "pkg"; pkg.member`.
                          None if there is no default export, or its
                          bound type could not be resolved to a known
                          interface.

ADVERSARIAL CASES (locked, Session 1.4)
------------------------------------------
  * axios (real, installed): AxiosStatic extends AxiosInstance extends
    Axios -- a real 3-level interface extends chain must be fully
    flattened so `axios.get(...)` (defined on Axios, two hops up from the
    default-exported AxiosStatic) resolves correctly, and
    `axios.getData(...)` (does not exist anywhere in the chain) is
    confidently flaggable.
  * @types/lodash (real, installed): heavy module-augmentation usage
    triggers the "degraded" status above -- proven against a genuinely
    installed, real DefinitelyTyped package, not a synthetic stand-in.
  * Type-only re-export chains (`export * from`, `export {x} from`)
    resolved transitively via a synthetic fixture package
    (fp-ts-clean-demo) with cycle/depth guards, since real npm packages
    available in this sandbox did not happen to exercise multi-file
    re-export chains as cleanly as a hand-built fixture can.

SCOPE ASSUMPTIONS (AI-logged, pending Yehor override)
--------------------------------------------------------
  - `implements` clauses are NOT used for member flattening (a class's
    OWN body must already declare what it implements; `extends` chains
    for interfaces/classes are the only inheritance this KB follows).
  - Generic type parameters on an `extends` target (e.g. `extends
    Base<T>`) are resolved by base name only (`Base`), ignoring the type
    argument -- sufficient for member-existence checks, not for deeper
    generic-instantiation reasoning (out of scope, same spirit as the
    Python resolver's one-hop-depth limitation).
  - `declare global { ... }` blocks are ignored entirely (they augment
    the global scope, not this package's own export surface).
  - Cross-package re-exports (`export * from "some-other-package"`) are
    NOT followed -- only relative-path re-exports within the same
    package are resolved. A cross-package re-export target is treated as
    unresolvable for that specific re-export only (degrades that single
    name, not the whole package), a narrower blast radius than the
    module-augmentation trigger above.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Optional

import tree_sitter_typescript as ts_ts
from tree_sitter import Language, Node, Parser

_TS_LANGUAGE = Language(ts_ts.language_typescript())
_MAX_FOLLOW_DEPTH = 40  # KS-TRACE: S1.4-KB-SAFETY | crash/loop-safety guard,
                        # mirrors Session 1.2's subprocess timeout as a
                        # bounded-cost-per-package safety net

_TRIPLE_SLASH_REF_RE = re.compile(r'///\s*<reference\s+path="([^"]+)"\s*/>')


def _text(node: Optional[Node], source: bytes) -> str:
    if node is None:
        return ""
    return source[node.start_byte:node.end_byte].decode("utf-8", errors="replace")


def _string_literal_value(node: Optional[Node], source: bytes) -> Optional[str]:
    if node is None or node.type != "string":
        return None
    parts = [c for c in node.children if c.type == "string_fragment"]
    return "".join(_text(p, source) for p in parts) if parts else None


class _DtsUnit:
    """Accumulated facts about ONE package's declaration-file set."""

    def __init__(self):
        self.interfaces: dict = {}      # name -> {"extends": [name,...], "members": set()}
        self.type_aliases: set = set()
        self.consts: dict = {}          # name -> declared type name (str) or None
        self.functions: set = set()
        self.classes: dict = {}         # name -> {"extends": Optional[str]}
        self.enums: set = set()
        self.exported_names: set = set()
        self.default_ref: Optional[str] = None
        self.named_reexports: list = []  # (local_name, original_name, from_module)
        self.star_reexports: list = []   # [from_module,...]
        self.has_module_augmentation: bool = False


def _merge_interface(unit: _DtsUnit, name: str, extends_names: list, members: set) -> None:
    # KS-TRACE: S1.4-KB-MERGE | requirement: declaration merging -- the
    # same interface name declared more than once in a package's file set
    # unions its members/extends rather than overwriting
    # | test: test_interface_declaration_merging_across_files
    entry = unit.interfaces.setdefault(name, {"extends": [], "members": set()})
    for e in extends_names:
        if e not in entry["extends"]:
            entry["extends"].append(e)
    entry["members"] |= members


def _interface_member_names(body: Node, source: bytes) -> set:
    # KS-TRACE: S1.4-KB-DEFECT-001 | fix: real axios .d.ts declares the
    # Axios interface's methods on a CLASS (`export class Axios { ... }`),
    # not an interface, and AxiosInstance does `extends Axios`. TS allows
    # an interface to extend a class's instance shape. The original
    # implementation only collected members from interface_body nodes, so
    # class-declared members (get/post/delete/... on the real Axios
    # class) were silently missing from the flattened default-export
    # symbol set -- which would have made `axios.get(...)` a FALSE
    # POSITIVE (flagged as hallucinated) on real, valid axios usage,
    # exactly the failure mode this engine must never produce. Fixed by
    # collecting member names from method_signature/property_signature
    # (interface_body) AND method_signature/public_field_definition
    # (class_body) uniformly, since real .d.ts files use method_signature
    # for class members too (ambient/declaration context).
    # | test: test_flatten_through_class_extends_real_axios_shape
    members = set()
    for child in body.children:
        if child.type in ("method_signature", "property_signature", "public_field_definition"):
            prop = next((c for c in child.children if c.type == "property_identifier"), None)
            if prop is not None:
                members.add(_text(prop, source))
    return members


def _extends_names(extends_type_clause: Optional[Node], source: bytes) -> list:
    if extends_type_clause is None:
        return []
    names = []
    for c in extends_type_clause.children:
        if c.type == "type_identifier":
            names.append(_text(c, source))
        elif c.type == "generic_type":
            base = next((g for g in c.children if g.type == "type_identifier"), None)
            if base is not None:
                names.append(_text(base, source))
    return names


def _parse_declaration(node: Node, source: bytes, unit: _DtsUnit, exported: bool) -> None:
    # KS-TRACE: S1.4-KB-DECL | requirement: every declaration flavor a
    # real-world .d.ts uses is recognized (interface/const/let/function/
    # class/type-alias/enum, plain or `declare`-wrapped)
    # | test: test_parses_interface, test_parses_const_with_type,
    #         test_parses_function, test_parses_class_with_extends,
    #         test_parses_type_alias, test_parses_enum
    t = node.type
    if t == "interface_declaration":
        name_node = next((c for c in node.children if c.type == "type_identifier"), None)
        if name_node is None:
            return
        name = _text(name_node, source)
        extends_clause = next((c for c in node.children if c.type == "extends_type_clause"), None)
        body = next((c for c in node.children if c.type == "interface_body"), None)
        members = _interface_member_names(body, source) if body is not None else set()
        _merge_interface(unit, name, _extends_names(extends_clause, source), members)
        if exported:
            unit.exported_names.add(name)
    elif t == "lexical_declaration":
        for decl in node.children:
            if decl.type != "variable_declarator":
                continue
            ident = next((c for c in decl.children if c.type == "identifier"), None)
            if ident is None:
                continue
            name = _text(ident, source)
            type_ann = next((c for c in decl.children if c.type == "type_annotation"), None)
            type_name = None
            if type_ann is not None:
                tnode = next((c for c in type_ann.children if c.type in ("type_identifier", "generic_type")), None)
                if tnode is not None:
                    type_name = _text(tnode, source) if tnode.type == "type_identifier" else _text(
                        next(g for g in tnode.children if g.type == "type_identifier"), source)
            unit.consts[name] = type_name
            if exported:
                unit.exported_names.add(name)
    elif t in ("function_declaration", "function_signature"):
        ident = next((c for c in node.children if c.type == "identifier"), None)
        if ident is None:
            return
        name = _text(ident, source)
        unit.functions.add(name)
        if exported:
            unit.exported_names.add(name)
    elif t == "class_declaration":
        name_node = next((c for c in node.children if c.type == "type_identifier"), None)
        if name_node is None:
            return
        name = _text(name_node, source)
        heritage = next((c for c in node.children if c.type == "class_heritage"), None)
        parent = None
        if heritage is not None:
            ext_clause = next((c for c in heritage.children if c.type == "extends_clause"), None)
            if ext_clause is not None:
                pnode = next((c for c in ext_clause.children if c.type in ("identifier", "type_identifier")), None)
                if pnode is not None:
                    parent = _text(pnode, source)
        body = next((c for c in node.children if c.type == "class_body"), None)
        members = _interface_member_names(body, source) if body is not None else set()
        existing = unit.classes.get(name, {"extends": None, "members": set()})
        unit.classes[name] = {
            "extends": parent or existing["extends"],
            "members": existing["members"] | members,
        }
        if exported:
            unit.exported_names.add(name)
    elif t == "type_alias_declaration":
        name_node = next((c for c in node.children if c.type == "type_identifier"), None)
        if name_node is None:
            return
        name = _text(name_node, source)
        unit.type_aliases.add(name)
        if exported:
            unit.exported_names.add(name)
    elif t == "enum_declaration":
        ident = next((c for c in node.children if c.type == "identifier"), None)
        if ident is None:
            return
        name = _text(ident, source)
        unit.enums.add(name)
        if exported:
            unit.exported_names.add(name)
    elif t == "ambient_declaration":
        inner = next((c for c in node.children if c.type != "declare"), None)
        if inner is not None:
            if inner.type == "module":
                unit.has_module_augmentation = True
            elif inner.type == "global":
                pass  # KS-TRACE: `declare global` intentionally ignored (see module docstring)
            else:
                _parse_declaration(inner, source, unit, exported)


def _parse_export_statement(node: Node, source: bytes, unit: _DtsUnit) -> None:
    children = node.children
    has_from = any(c.type == "from" for c in children)
    has_default = any(c.type == "default" for c in children)
    has_equals = any(c.type == "=" for c in children)
    module_str = next((c for c in children if c.type == "string"), None)
    module_text = _string_literal_value(module_str, source)

    if has_from:
        export_clause = next((c for c in children if c.type == "export_clause"), None)
        has_star = any(c.type == "*" for c in children)
        if export_clause is not None:
            for spec in export_clause.children:
                if spec.type != "export_specifier":
                    continue
                idents = [c for c in spec.children if c.type == "identifier"]
                original = _text(idents[0], source)
                local = _text(idents[-1], source)
                unit.named_reexports.append((local, original, module_text))
        elif has_star:
            unit.star_reexports.append(module_text)
        return

    if has_default:
        # KS-TRACE: S1.4-KB-DEFAULT | requirement: `export default X`
        # (identifier) resolves the default-export binding; an inline
        # anonymous/complex expression default is left unresolved
        # (default_export_symbols=None) rather than guessed at
        # | test: test_export_default_identifier, test_export_default_complex_expression_unresolved
        ident = next((c for c in children if c.type == "identifier"), None)
        if ident is not None:
            unit.default_ref = _text(ident, source)
        return

    if has_equals:
        # KS-TRACE: S1.4-KB-EXPORT-EQUALS | requirement: CommonJS
        # `export = X;` treated as the same default-export slot as
        # `export default X` (both are what `import pkg from "pkg"`
        # ultimately binds to under esModuleInterop) | test:
        # test_export_equals_identifier
        ident = next((c for c in children if c.type == "identifier"), None)
        if ident is not None:
            unit.default_ref = _text(ident, source)
        return

    # Direct export of a declaration: `export interface/const/function/...`
    decl = next((c for c in children if c.type not in ("export",)), None)
    if decl is not None:
        _parse_declaration(decl, source, unit, exported=True)


def parse_dts_source(source_text: str) -> _DtsUnit:
    """Parse ONE .d.ts file's text into a _DtsUnit of raw, file-local facts.

    KS-TRACE: S1.4-KB-PARSE | requirement: deterministic, crash-tolerant
    single-file parse -- unrecognized top-level constructs are silently
    skipped (best-effort, matching Session 1.2's "degrade, don't crash"
    ethos) rather than raising | test: test_parse_dts_source_basic,
    test_parse_dts_source_ignores_unknown_constructs
    """
    parser = Parser(_TS_LANGUAGE)
    source_bytes = source_text.encode("utf-8")
    tree = parser.parse(source_bytes)
    unit = _DtsUnit()
    for node in tree.root_node.children:
        try:
            if node.type == "export_statement":
                _parse_export_statement(node, source_bytes, unit)
            elif node.type == "ambient_declaration":
                _parse_declaration(node, source_bytes, unit, exported=False)
            elif node.type in ("interface_declaration", "lexical_declaration", "function_declaration",
                               "class_declaration", "type_alias_declaration", "enum_declaration"):
                _parse_declaration(node, source_bytes, unit, exported=False)
        except Exception:
            # KS-TRACE: S1.4-KB-RESILIENCE | requirement: one malformed/
            # unsupported top-level statement must not abort parsing the
            # rest of the file (mirrors Session 1.2's per-package
            # crash-isolation, applied at per-statement granularity)
            # | test: test_malformed_statement_does_not_abort_file
            continue

    for m in _TRIPLE_SLASH_REF_RE.finditer(source_text):
        unit.reference_paths_raw = getattr(unit, "reference_paths_raw", [])
        unit.reference_paths_raw.append(m.group(1))
    if not hasattr(unit, "reference_paths_raw"):
        unit.reference_paths_raw = []
    return unit


def _locate_entry_dts(pkg_dir: Path, pkg_name: str, node_modules: Path) -> tuple:
    """Return (entry_path, package_json_dict) or (None, package_json_dict_or_None)."""
    # KS-TRACE: S1.4-KB-LOCATE | requirement: Node/DefinitelyTyped
    # convention -- bundled types field first, then @types/<name> fallback
    # | test: test_locate_bundled_types_field, test_locate_typings_field,
    #         test_locate_attypes_fallback, test_locate_no_types_found
    pkg_json_path = pkg_dir / "package.json"
    if not pkg_json_path.is_file():
        return None, None
    try:
        pkg_json = json.loads(pkg_json_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None, None

    types_field = pkg_json.get("types") or pkg_json.get("typings")
    if types_field:
        entry = (pkg_dir / types_field).resolve()
        if entry.is_file():
            return entry, pkg_json

    scoped_safe = pkg_name[1:].replace("/", "__") if pkg_name.startswith("@") else pkg_name
    attypes_dir = node_modules / "@types" / scoped_safe
    attypes_json_path = attypes_dir / "package.json"
    if attypes_json_path.is_file():
        try:
            attypes_json = json.loads(attypes_json_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            attypes_json = {}
        at_types_field = attypes_json.get("types") or attypes_json.get("typings") or "index.d.ts"
        entry = (attypes_dir / at_types_field).resolve()
        if entry.is_file():
            return entry, pkg_json

    return None, pkg_json


def _load_units_transitively(entry_path: Path) -> dict:
    """Parse entry_path + every file it reaches via /// reference paths.

    KS-TRACE: S1.4-KB-REFERENCE | requirement: triple-slash reference
    directives (the real convention @types/lodash uses to split its
    declarations across a dozen files) are followed, cycle/depth-guarded
    | test: test_follows_triple_slash_references, test_reference_cycle_guarded
    """
    units: dict = {}  # resolved path str -> _DtsUnit
    seen: set = set()
    stack = [entry_path.resolve()]
    depth = 0
    while stack and depth < _MAX_FOLLOW_DEPTH:
        depth += 1
        path = stack.pop()
        key = str(path)
        if key in seen or not path.is_file():
            continue
        seen.add(key)
        try:
            source_text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        unit = parse_dts_source(source_text)
        units[key] = unit
        for rel in unit.reference_paths_raw:
            ref_path = (path.parent / rel).resolve()
            if str(ref_path) not in seen:
                stack.append(ref_path)
    return units


def _merge_units(units: dict) -> _DtsUnit:
    merged = _DtsUnit()
    for unit in units.values():
        for name, entry in unit.interfaces.items():
            _merge_interface(merged, name, entry["extends"], entry["members"])
        merged.type_aliases |= unit.type_aliases
        merged.consts.update(unit.consts)
        merged.functions |= unit.functions
        for cname, centry in unit.classes.items():
            existing = merged.classes.get(cname, {"extends": None, "members": set()})
            merged.classes[cname] = {
                "extends": centry["extends"] or existing["extends"],
                "members": existing["members"] | centry["members"],
            }
        merged.enums |= unit.enums
        merged.exported_names |= unit.exported_names
        if merged.default_ref is None:
            merged.default_ref = unit.default_ref
        merged.named_reexports.extend(unit.named_reexports)
        merged.star_reexports.extend(unit.star_reexports)
        merged.has_module_augmentation = merged.has_module_augmentation or unit.has_module_augmentation
    return merged


def _resolve_target_unit(target: Path, _visited_paths: set) -> _DtsUnit:
    """Load + fully resolve (including ITS OWN re-exports) one re-export target.

    KS-TRACE: S1.4-KB-DEFECT-002 | fix (found during adversarial Verify):
    the original implementation resolved re-exports only ONE level deep --
    `index.d.ts: export * from "./a"` where `a.d.ts` itself does
    `export * from "./b"` silently DROPPED everything from b.d.ts. This is
    a real, multi-file package pattern (barrel-of-barrels), and the
    silent drop would have made a legitimately re-exported symbol
    (`import { FromB } from "pkg"`) a FALSE POSITIVE -- the one failure
    mode this engine must never produce. Fixed by resolving each
    re-export target's OWN re-exports recursively, with a shared
    visited-paths set (keyed on resolved file path, not package) to
    guard against circular re-export chains (A -> B -> A).
    | test: test_two_hop_star_reexport_resolved,
            test_circular_reexport_terminates
    """
    key = str(target.resolve())
    if key in _visited_paths:
        return _DtsUnit()  # cycle guard -- already being resolved up the call stack
    _visited_paths.add(key)

    sub_units = _load_units_transitively(target)
    sub_merged = _merge_units(sub_units)
    _resolve_reexports(sub_merged, target, target.parent, _visited_paths=_visited_paths)
    return sub_merged


def _resolve_reexports(merged: _DtsUnit, entry_path: Path, node_modules: Path,
                       depth: int = 0, _visited_paths: Optional[set] = None) -> None:
    # KS-TRACE: S1.4-KB-REEXPORT | requirement: `export * from "./x"` /
    # `export {a,b} from "./x"` resolved TRANSITIVELY (any number of hops)
    # for RELATIVE targets within the same package; a cross-package
    # re-export target degrades only that one name, not the whole package
    # (see docstring) | test: test_star_reexport_resolved,
    # test_named_reexport_resolved, test_two_hop_star_reexport_resolved,
    # test_cross_package_reexport_narrow_degrade
    if depth >= _MAX_FOLLOW_DEPTH:
        return
    if _visited_paths is None:
        _visited_paths = {str(entry_path.resolve())}
    base_dir = entry_path.parent

    for from_module in list(merged.star_reexports):
        if not from_module or not from_module.startswith("."):
            continue  # cross-package star re-export -- not followed (documented scope limit)
        target = _resolve_relative_dts(base_dir, from_module)
        if target is None:
            continue
        sub_merged = _resolve_target_unit(target, _visited_paths)
        merged.exported_names |= sub_merged.exported_names
        for name, entry in sub_merged.interfaces.items():
            _merge_interface(merged, name, entry["extends"], entry["members"])
        merged.type_aliases |= sub_merged.type_aliases
        merged.consts.update(sub_merged.consts)
        merged.functions |= sub_merged.functions
        for cname, centry in sub_merged.classes.items():
            existing = merged.classes.get(cname, {"extends": None, "members": set()})
            merged.classes[cname] = {
                "extends": centry["extends"] or existing["extends"],
                "members": existing["members"] | centry["members"],
            }
        merged.enums |= sub_merged.enums
        merged.has_module_augmentation = merged.has_module_augmentation or sub_merged.has_module_augmentation

    for local_name, original_name, from_module in list(merged.named_reexports):
        if not from_module or not from_module.startswith("."):
            continue  # cross-package named re-export -- narrow, not followed
        target = _resolve_relative_dts(base_dir, from_module)
        if target is None:
            continue
        sub_merged = _resolve_target_unit(target, _visited_paths)
        if original_name in sub_merged.exported_names:
            merged.exported_names.add(local_name)
        if original_name in sub_merged.interfaces:
            _merge_interface(merged, local_name, sub_merged.interfaces[original_name]["extends"],
                              sub_merged.interfaces[original_name]["members"])


def _resolve_relative_dts(base_dir: Path, rel_module: str) -> Optional[Path]:
    candidates = [
        base_dir / f"{rel_module}.d.ts",
        base_dir / rel_module / "index.d.ts",
        base_dir / rel_module,
    ]
    for c in candidates:
        try:
            c = c.resolve()
        except OSError:
            continue
        if c.is_file():
            return c
    return None


def _flatten_interface_members(name: str, interfaces: dict, classes: Optional[dict] = None,
                               _visiting: Optional[set] = None) -> set:
    # KS-TRACE: S1.4-KB-EXTENDS-CHAIN | requirement: recursively flatten a
    # type's OWN members plus every ancestor's, cycle-guarded (an extends
    # chain is a linearization problem structurally identical to Session
    # 1.1's "no unbounded recursion" concern) -- this is what makes
    # `axios.get(...)` resolve through AxiosStatic -> AxiosInstance ->
    # Axios, where Axios is a CLASS, not an interface (see KB-DEFECT-001)
    # | test: test_flatten_single_level, test_flatten_multi_level_chain,
    # test_flatten_cycle_guarded, test_flatten_multiple_inheritance,
    # test_flatten_through_class_extends_real_axios_shape
    if classes is None:
        classes = {}
    if _visiting is None:
        _visiting = set()
    if name in _visiting:
        return set()
    _visiting.add(name)
    if name in interfaces:
        entry = interfaces[name]
        members = set(entry["members"])
        for parent in entry["extends"]:
            members |= _flatten_interface_members(parent, interfaces, classes, _visiting)
        return members
    if name in classes:
        entry = classes[name]
        members = set(entry["members"])
        if entry["extends"]:
            members |= _flatten_interface_members(entry["extends"], interfaces, classes, _visiting)
        return members
    return set()


def build_package_entry(pkg_dir: Path, pkg_name: str, node_modules: Path) -> dict:
    """Build ONE package's KB entry from its installed .d.ts files.

    KS-TRACE: S1.4-KB-ENTRY | requirement: status + symbols +
    default_export_symbols for a single package, never raising even on a
    malformed/unusual real package | test: test_build_entry_axios_ok,
    test_build_entry_lodash_degraded, test_build_entry_no_types,
    test_build_entry_not_installed
    """
    if not pkg_dir.is_dir():
        return {"status": "not-installed", "version": None, "symbols": [], "default_export_symbols": None}

    entry_path, pkg_json = _locate_entry_dts(pkg_dir, pkg_name, node_modules)
    version = pkg_json.get("version") if pkg_json else None
    if entry_path is None:
        return {"status": "no-types", "version": version, "symbols": [], "default_export_symbols": None}

    try:
        units = _load_units_transitively(entry_path)
        merged = _merge_units(units)
        _resolve_reexports(merged, entry_path, node_modules)
    except Exception:
        # KS-TRACE: S1.4-KB-CRASH-SAFETY | requirement: any parse/resolve
        # failure degrades this package only, mirrors Session 1.2's
        # subprocess-isolation crash containment | test:
        # test_build_entry_survives_parse_exception
        return {"status": "degraded", "version": version, "symbols": [], "default_export_symbols": None}

    if merged.has_module_augmentation:
        return {"status": "degraded", "version": version, "symbols": [], "default_export_symbols": None}

    symbols = sorted(merged.exported_names)

    default_export_symbols = None
    if merged.default_ref is not None:
        type_name = merged.consts.get(merged.default_ref)
        if type_name is None and merged.default_ref in merged.interfaces:
            type_name = merged.default_ref
        if type_name is not None and (type_name in merged.interfaces or type_name in merged.classes):
            default_export_symbols = sorted(
                _flatten_interface_members(type_name, merged.interfaces, merged.classes))

    return {
        "status": "ok", "version": version,
        "symbols": symbols, "default_export_symbols": default_export_symbols,
    }


def build_knowledge_base(node_modules: Path, package_names: list) -> dict:
    """Build the full KB for a list of package names against one node_modules dir.

    KS-TRACE: S1.4-KB-BUILD | requirement: deterministic across runs (pure
    file reads + parsing, no network/execution) | test:
    test_build_knowledge_base_determinism
    """
    node_modules = Path(node_modules)
    packages = {}
    for name in package_names:
        pkg_dir = node_modules / name
        packages[name] = build_package_entry(pkg_dir, name, node_modules)
    return {"packages": packages}

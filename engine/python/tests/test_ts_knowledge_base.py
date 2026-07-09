"""Unit tests for ts_knowledge_base.py (Session 1.4)."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from ts_knowledge_base import (  # noqa: E402
    build_knowledge_base, build_package_entry, parse_dts_source,
    _flatten_interface_members, _locate_entry_dts,
)

FIXTURES = Path(__file__).resolve().parent.parent / "ts_corpus" / "node_modules"


# ---------------------------------------------------------------------------
# Real, installed npm packages (axios, lodash, @types/lodash)
# ---------------------------------------------------------------------------

def test_build_entry_axios_ok_real_package():
    entry = build_package_entry(FIXTURES / "axios", "axios", FIXTURES)
    assert entry["status"] == "ok"
    assert entry["version"] is not None
    assert "AxiosStatic" in entry["symbols"]


def test_axios_default_export_flattens_full_extends_chain():
    # KS-TRACE test: AxiosStatic extends AxiosInstance extends Axios(class)
    # -- get/post/delete/etc. live only on the Axios CLASS, two hops up.
    entry = build_package_entry(FIXTURES / "axios", "axios", FIXTURES)
    for method in ("get", "post", "put", "delete", "patch", "request", "getUri"):
        assert method in entry["default_export_symbols"], f"{method} missing from flattened chain"


def test_axios_hallucinated_method_absent_from_flattened_set():
    entry = build_package_entry(FIXTURES / "axios", "axios", FIXTURES)
    assert "getData" not in entry["default_export_symbols"]
    assert "fetchSync" not in entry["default_export_symbols"]


def test_axios_hallucinated_named_export_absent():
    entry = build_package_entry(FIXTURES / "axios", "axios", FIXTURES)
    assert "NotReallyExported" not in entry["symbols"]


def test_lodash_degrades_due_to_module_augmentation():
    # KS-TRACE test: real, installed lodash has no bundled types (falls
    # back to @types/lodash, which uses declare-module augmentation
    # extensively) -- must degrade, never silently produce an incomplete
    # symbol set that would false-positive on legitimate _.debounce() etc.
    entry = build_package_entry(FIXTURES / "lodash", "lodash", FIXTURES)
    assert entry["status"] == "degraded"
    assert entry["symbols"] == []
    assert entry["default_export_symbols"] is None


def test_attypes_lodash_direct_also_degrades():
    entry = build_package_entry(FIXTURES / "@types" / "lodash", "@types/lodash", FIXTURES)
    assert entry["status"] == "degraded"


def test_lodash_types_resolved_via_attypes_fallback():
    entry_path, pkg_json = _locate_entry_dts(FIXTURES / "lodash", "lodash", FIXTURES)
    assert entry_path is not None
    assert "@types" in str(entry_path)


# ---------------------------------------------------------------------------
# Synthetic fixture package: re-exports, extends chain, default export
# ---------------------------------------------------------------------------

def test_clean_demo_ok_status():
    entry = build_package_entry(FIXTURES / "fp-ts-clean-demo", "fp-ts-clean-demo", FIXTURES)
    assert entry["status"] == "ok"


def test_clean_demo_star_reexport_resolved():
    entry = build_package_entry(FIXTURES / "fp-ts-clean-demo", "fp-ts-clean-demo", FIXTURES)
    assert "Base" in entry["symbols"]
    assert "Derived" in entry["symbols"]


def test_clean_demo_named_reexport_resolved():
    entry = build_package_entry(FIXTURES / "fp-ts-clean-demo", "fp-ts-clean-demo", FIXTURES)
    assert "Widget" in entry["symbols"]


def test_clean_demo_type_alias_and_function_exported():
    entry = build_package_entry(FIXTURES / "fp-ts-clean-demo", "fp-ts-clean-demo", FIXTURES)
    assert "ID" in entry["symbols"]
    assert "helperFn" in entry["symbols"]


def test_clean_demo_default_export_flattens_extends():
    entry = build_package_entry(FIXTURES / "fp-ts-clean-demo", "fp-ts-clean-demo", FIXTURES)
    assert set(entry["default_export_symbols"]) == {"baseMethod", "derivedMethod"}


# ---------------------------------------------------------------------------
# Status resolution: no-types / not-installed
# ---------------------------------------------------------------------------

def test_no_types_status():
    entry = build_package_entry(FIXTURES / "fp-ts-notypes-demo", "fp-ts-notypes-demo", FIXTURES)
    assert entry["status"] == "no-types"
    assert entry["symbols"] == []


def test_not_installed_status():
    entry = build_package_entry(FIXTURES / "definitely-does-not-exist", "definitely-does-not-exist", FIXTURES)
    assert entry["status"] == "not-installed"


# ---------------------------------------------------------------------------
# Unit-level: interface parsing, extends flattening, cycle guard
# ---------------------------------------------------------------------------

def test_parse_dts_source_basic():
    unit = parse_dts_source('export interface Foo { bar(): void; }')
    assert "Foo" in unit.interfaces
    assert unit.interfaces["Foo"]["members"] == {"bar"}
    assert "Foo" in unit.exported_names


def test_parse_dts_source_ignores_unknown_constructs():
    # a decorator-like or unusual top-level statement must not crash parsing
    unit = parse_dts_source('export interface Foo {}\n/* weird */ export {};')
    assert "Foo" in unit.interfaces


def test_multi_extends_interface():
    unit = parse_dts_source('export interface A { a(): void; }\nexport interface B { b(): void; }\n'
                             'export interface C extends A, B { c(): void; }')
    flat = _flatten_interface_members("C", unit.interfaces)
    assert flat == {"a", "b", "c"}


def test_flatten_cycle_guarded():
    unit = parse_dts_source('export interface A extends B { a(): void; }\n'
                             'export interface B extends A { b(): void; }')
    # must terminate and return the reachable members, not infinite-loop
    flat = _flatten_interface_members("A", unit.interfaces)
    assert flat == {"a", "b"}


def test_export_equals_identifier_captured():
    unit = parse_dts_source('declare const x: Foo;\nexport = x;')
    assert unit.default_ref == "x"


def test_export_default_identifier_captured():
    unit = parse_dts_source('declare const x: Foo;\nexport default x;')
    assert unit.default_ref == "x"


def test_module_augmentation_detected():
    unit = parse_dts_source('declare module "./other" { interface X { y(): void; } }')
    assert unit.has_module_augmentation is True


def test_declare_global_not_treated_as_augmentation():
    unit = parse_dts_source('declare global { interface Window {} }')
    assert unit.has_module_augmentation is False


# ---------------------------------------------------------------------------
# S4.4-KB-DEFECT-A: bare `export { A, B, C };` list (no `from`) re-exporting
# names declared elsewhere in the same file without an inline `export`
# keyword -- the real shape resend/@privy-io/react-auth's bundled .d.ts use.
# ---------------------------------------------------------------------------

def test_bare_export_list_populates_exported_names():
    unit = parse_dts_source(
        'declare class Resend { key: string; }\n'
        'declare class Attachment { name: string; }\n'
        'export { Attachment, Resend };'
    )
    assert "Resend" in unit.exported_names
    assert "Attachment" in unit.exported_names


def test_bare_export_list_with_alias_uses_external_name():
    # `export { Local as External }` -- consumers do
    # `import { External } from "pkg"`, so the EXTERNAL name is what must
    # land in exported_names, not the internal declaration name.
    unit = parse_dts_source(
        'declare class InternalResend { key: string; }\n'
        'export { InternalResend as Resend };'
    )
    assert "Resend" in unit.exported_names
    assert "InternalResend" not in unit.exported_names


def test_bare_type_export_list_populates_exported_names():
    unit = parse_dts_source(
        'interface CreateEmailOptions { to: string; }\n'
        'export type { CreateEmailOptions };'
    )
    assert "CreateEmailOptions" in unit.exported_names


def test_bare_export_list_does_not_crash_on_empty_list():
    # regression guard: `export {};` (no specifiers at all) must not crash
    # and must not add any spurious symbol.
    unit = parse_dts_source('export interface Foo {}\nexport {};')
    assert "Foo" in unit.exported_names
    assert unit.exported_names == {"Foo"}


def test_resend_style_bundle_end_to_end_via_build_package_entry(tmp_path):
    # KS-TRACE: reproduces the exact real-world shape that caused false
    # positives on yehor.ai PR #1 -- declare-without-export followed by a
    # single trailing bare export list, run through the full
    # build_package_entry pipeline (not just parse_dts_source), so a
    # regression here is caught the same way the live defect was.
    pkg_dir = tmp_path / "resend-like"
    pkg_dir.mkdir()
    (pkg_dir / "package.json").write_text(
        json.dumps({"name": "resend-like", "version": "1.0.0", "types": "./index.d.ts"}),
        encoding="utf-8",
    )
    (pkg_dir / "index.d.ts").write_text(
        'declare class Emails {\n'
        '    send(payload: unknown): Promise<unknown>;\n'
        '}\n'
        'declare class Resend {\n'
        '    readonly emails: Emails;\n'
        '    constructor(key?: string);\n'
        '}\n'
        'export { Emails, Resend };\n',
        encoding="utf-8",
    )
    entry = build_package_entry(pkg_dir, "resend-like", tmp_path)
    assert entry["status"] == "ok"
    assert "Resend" in entry["symbols"]
    assert "Emails" in entry["symbols"]


def test_class_extends_flattened_into_interface_chain():
    # mirrors the real axios shape: interface extends a CLASS
    unit = parse_dts_source(
        'export class Base { baseMethod(): void; }\n'
        'export interface Derived extends Base { derivedMethod(): void; }'
    )
    flat = _flatten_interface_members("Derived", unit.interfaces, unit.classes)
    assert flat == {"baseMethod", "derivedMethod"}


def test_build_knowledge_base_determinism():
    kb1 = build_knowledge_base(FIXTURES, ["axios", "fp-ts-clean-demo"])
    kb2 = build_knowledge_base(FIXTURES, ["axios", "fp-ts-clean-demo"])
    assert kb1 == kb2
    json.dumps(kb1)  # must be JSON-serializable


def test_build_entry_survives_malformed_file(tmp_path):
    pkg_dir = tmp_path / "broken-pkg"
    pkg_dir.mkdir()
    (pkg_dir / "package.json").write_text('{"name": "broken-pkg", "version": "1.0.0", "types": "index.d.ts"}')
    (pkg_dir / "index.d.ts").write_text('export interface {{{ this is not valid typescript at all ]]] ')
    entry = build_package_entry(pkg_dir, "broken-pkg", tmp_path)
    # must not raise -- either "ok" with best-effort partial symbols, or "degraded", never a crash
    assert entry["status"] in ("ok", "degraded")


# ---------------------------------------------------------------------------
# Adversarial: multi-hop / circular re-export chains (DEFECT-002, this session)
# ---------------------------------------------------------------------------

def test_two_hop_star_reexport_resolved(tmp_path):
    (tmp_path / "package.json").write_text(json.dumps({"name": "two-hop", "version": "1.0.0", "types": "index.d.ts"}))
    (tmp_path / "index.d.ts").write_text('export * from "./a";\n')
    (tmp_path / "a.d.ts").write_text('export * from "./b";\nexport interface FromA { aMethod(): void; }\n')
    (tmp_path / "b.d.ts").write_text('export interface FromB { bMethod(): void; }\n')
    entry = build_package_entry(tmp_path, "two-hop", tmp_path.parent)
    assert entry["status"] == "ok"
    assert set(entry["symbols"]) == {"FromA", "FromB"}


def test_three_hop_named_reexport_resolved(tmp_path):
    (tmp_path / "package.json").write_text(json.dumps({"name": "three-hop", "version": "1.0.0", "types": "index.d.ts"}))
    (tmp_path / "index.d.ts").write_text('export { Deep } from "./a";\n')
    (tmp_path / "a.d.ts").write_text('export { Deep } from "./b";\n')
    (tmp_path / "b.d.ts").write_text('export { Deep } from "./c";\n')
    (tmp_path / "c.d.ts").write_text('export interface Deep { deepMethod(): void; }\n')
    entry = build_package_entry(tmp_path, "three-hop", tmp_path.parent)
    assert entry["status"] == "ok"
    assert "Deep" in entry["symbols"]


def test_circular_reexport_terminates(tmp_path):
    (tmp_path / "package.json").write_text(json.dumps({"name": "circular", "version": "1.0.0", "types": "index.d.ts"}))
    (tmp_path / "index.d.ts").write_text('export * from "./a";\nexport interface Root { rootM(): void; }\n')
    (tmp_path / "a.d.ts").write_text('export * from "./index";\nexport interface FromA { aMethod(): void; }\n')
    entry = build_package_entry(tmp_path, "circular", tmp_path.parent)  # must not hang/recurse forever
    assert entry["status"] == "ok"
    assert set(entry["symbols"]) == {"Root", "FromA"}


# ---------------------------------------------------------------------------
# Property-based test (Keystone Stage 3 requirement) on the extends-chain
# flattening logic -- the flagship NEW critical logic this session.
# ---------------------------------------------------------------------------

from hypothesis import given, settings, strategies as st  # noqa: E402

_NAMES = st.sampled_from(["A", "B", "C", "D", "E", "F"])


@st.composite
def _interface_graphs(draw):
    """Generate a random interface graph: each name gets 0-6 own members
    and 0-2 (possibly cyclic, possibly self-referential, possibly
    dangling) extends edges to other names in the same small universe."""
    names = ["A", "B", "C", "D", "E", "F"]
    interfaces = {}
    for name in names:
        own_members = draw(st.sets(st.sampled_from(["m1", "m2", "m3", "m4"]), max_size=4))
        extends = draw(st.lists(_NAMES, max_size=2, unique=True))
        interfaces[name] = {"extends": extends, "members": set(own_members)}
    return interfaces


@given(interfaces=_interface_graphs(), start=_NAMES)
@settings(max_examples=200)
def test_flatten_always_terminates_and_is_bounded(interfaces, start):
    # KS-TRACE: S1.4-PROPERTY-TEST | requirement: for ANY interface graph
    # (including cycles, self-references, and dangling extends targets),
    # _flatten_interface_members must terminate and never return a member
    # not actually declared somewhere in the reachable graph
    # | test: this IS the property test (Keystone Stage 3 requirement)
    result = _flatten_interface_members(start, interfaces)  # must not hang or raise

    all_declared_members = set()
    for entry in interfaces.values():
        all_declared_members |= entry["members"]
    assert result <= all_declared_members  # never invents a member that doesn't exist anywhere

    assert result >= interfaces[start]["members"]  # always includes the type's OWN members


def test_malformed_package_json_degrades_to_no_types(tmp_path):
    (tmp_path / "package.json").write_text('{ this is not valid json ][')
    entry = build_package_entry(tmp_path, "broken-json-pkg", tmp_path.parent)
    assert entry["status"] == "no-types"


# ---------------------------------------------------------------------------
# S4.5-KB-DEFECT-B: class_member_symbols -- flattened member set per
# EXPORTED class, so ts_resolver.py can check a hallucinated instance
# method on `const x = new NamedImportClass(...)` (KS-REPORT-4.4 Section 3,
# fixed this session per Yehor's direct-assignment-only sign-off).
# ---------------------------------------------------------------------------

def test_class_member_symbols_built_for_exported_class():
    unit = parse_dts_source(
        'declare class Foo { bar(): void; baz(): void; }\n'
        'export { Foo };'
    )
    flat = _flatten_interface_members("Foo", unit.interfaces, unit.classes)
    assert flat == {"bar", "baz"}


def test_class_member_symbols_excludes_unexported_class(tmp_path):
    # a class declared but never exported is not a valid named-import
    # target in the first place -- class_member_symbols must not include it
    (tmp_path / "package.json").write_text(json.dumps({"name": "unexp", "version": "1.0.0", "types": "index.d.ts"}))
    (tmp_path / "index.d.ts").write_text(
        'declare class Internal { secretMethod(): void; }\n'
        'declare class Public { publicMethod(): void; }\n'
        'export { Public };\n'
    )
    entry = build_package_entry(tmp_path, "unexp", tmp_path.parent)
    assert "Public" in entry["class_member_symbols"]
    assert "Internal" not in entry["class_member_symbols"]


def test_class_member_symbols_resolves_real_resend_shape(tmp_path):
    # KS-TRACE: reproduces the real Defect B seeded case's package shape
    # (bare export list, Session 4.4's Defect A fix required to even reach
    # this point) end-to-end through build_package_entry, not just
    # parse_dts_source, so a regression is caught the same way the live
    # defect would surface.
    pkg_dir = tmp_path / "resend-instance-demo"
    pkg_dir.mkdir()
    (pkg_dir / "package.json").write_text(
        json.dumps({"name": "resend-instance-demo", "version": "1.0.0", "types": "./index.d.ts"}))
    (pkg_dir / "index.d.ts").write_text(
        'declare class Emails {\n'
        '    send(payload: unknown): Promise<unknown>;\n'
        '}\n'
        'declare class Resend {\n'
        '    readonly emails: Emails;\n'
        '    send(payload: unknown): Promise<unknown>;\n'
        '    constructor(key?: string);\n'
        '}\n'
        'export { Emails, Resend };\n',
        encoding="utf-8",
    )
    entry = build_package_entry(pkg_dir, "resend-instance-demo", tmp_path)
    assert entry["status"] == "ok"
    # KS-TRACE: "constructor" is legitimately present -- a `constructor(...)`
    # signature parses as a real class member (property_identifier
    # "constructor"), and every JS/TS instance genuinely has a `.constructor`
    # property. Not a defect; the fixture's own declared shape includes it.
    assert set(entry["class_member_symbols"]["Resend"]) == {"emails", "send", "constructor"}
    assert "notAMethod" not in entry["class_member_symbols"]["Resend"]


def test_class_member_symbols_present_on_every_status_branch(tmp_path):
    # regression guard: not-installed/no-types/degraded must all carry the
    # class_member_symbols key (empty dict) so resolver code can rely on
    # .get(...) uniformly without a KeyError surprise on any status.
    not_installed = build_package_entry(tmp_path / "does-not-exist", "does-not-exist", tmp_path)
    assert not_installed["class_member_symbols"] == {}

    (tmp_path / "package.json").write_text('{"name": "no-types-pkg", "version": "1.0.0"}')
    no_types = build_package_entry(tmp_path, "no-types-pkg", tmp_path.parent)
    assert no_types["class_member_symbols"] == {}


# ---------------------------------------------------------------------------
# S4.5-KB-DEFECT-C: `export = X` flattens X's members into exported_names
# ONLY when X is a CONFIRMED `declare namespace X {...}` -- fixes the real
# @types/react false-positive (every hook/type import) found live in
# Session 4.4, without broadening non-namespace `export =` targets.
# ---------------------------------------------------------------------------

def test_parses_namespace_members():
    unit = parse_dts_source(
        'declare namespace ReactNS {\n'
        '  function useState<S>(initial: S): [S, (s: S) => void];\n'
        '  function useEffect(cb: () => void): void;\n'
        '  class Component<P, S> {}\n'
        '  type ReactNode = any;\n'
        '  interface FormEvent<T> {}\n'
        '}\n'
    )
    assert unit.namespaces["ReactNS"] == {"useState", "useEffect", "Component", "ReactNode", "FormEvent"}


def test_namespace_not_confused_with_module_augmentation():
    # `internal_module` (namespace) and `module` (declare module "...") are
    # distinct tree-sitter node types -- a namespace must never flip
    # has_module_augmentation (which would wrongly degrade the whole
    # package).
    unit = parse_dts_source('declare namespace NS { function f(): void; }')
    assert unit.has_module_augmentation is False
    assert "NS" not in unit.exported_names  # the namespace name itself is not a named-import target


def test_export_equals_namespace_flattens_to_exported_names():
    unit_source = (
        'declare namespace ReactNS {\n'
        '  function useState(): void;\n'
        '  function useEffect(): void;\n'
        '}\n'
        'export = ReactNS;\n'
    )
    unit = parse_dts_source(unit_source)
    assert unit.default_ref == "ReactNS"
    assert unit.namespaces["ReactNS"] == {"useState", "useEffect"}


def test_export_equals_namespace_real_react_shape(tmp_path):
    # KS-TRACE: reproduces @types/react's real shape end-to-end (confirmed
    # against the installed .d.ts in KS-REPORT-4.4 Section 3: `export =
    # React;` / `export as namespace React;`, with every hook/type declared
    # un-prefixed inside `declare namespace React {...}`).
    pkg_dir = tmp_path / "react-namespace-demo"
    pkg_dir.mkdir()
    (pkg_dir / "package.json").write_text(
        json.dumps({"name": "react-namespace-demo", "version": "1.0.0", "types": "./index.d.ts"}))
    (pkg_dir / "index.d.ts").write_text(
        'declare namespace ReactNS {\n'
        '  function useState<S>(initial: S): [S, (s: S) => void];\n'
        '  function useEffect(cb: () => void): void;\n'
        '  class Component<P, S> {}\n'
        '  type ReactNode = any;\n'
        '  interface FormEvent<T> {}\n'
        '}\n'
        'export = ReactNS;\n'
        'export as namespace ReactNS;\n',
        encoding="utf-8",
    )
    entry = build_package_entry(pkg_dir, "react-namespace-demo", tmp_path)
    assert entry["status"] == "ok"
    for name in ("useState", "useEffect", "Component", "ReactNode", "FormEvent"):
        assert name in entry["symbols"], f"{name} missing -- Defect C regression"
    assert "totallyFakeHook" not in entry["symbols"]  # still catches a real hallucination


def test_export_equals_class_not_namespace_unaffected(tmp_path):
    # regression guard: `export = SomeClass` (NOT a namespace) must NOT
    # leak the class's own members into exported_names as named-import
    # targets -- only the namespace-confirmed shape gets this treatment.
    pkg_dir = tmp_path / "class-export-equals-demo"
    pkg_dir.mkdir()
    (pkg_dir / "package.json").write_text(
        json.dumps({"name": "class-export-equals-demo", "version": "1.0.0", "types": "./index.d.ts"}))
    (pkg_dir / "index.d.ts").write_text(
        'declare class Foo {\n'
        '    bar(): void;\n'
        '}\n'
        'export = Foo;\n',
        encoding="utf-8",
    )
    entry = build_package_entry(pkg_dir, "class-export-equals-demo", tmp_path)
    assert entry["status"] == "ok"
    assert "bar" not in entry["symbols"]  # NOT leaked as a named-import target
    assert entry["default_export_symbols"] == ["bar"]  # unaffected: still valid via default-import access

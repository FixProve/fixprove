"""Unit tests for ts_resolver.py (Session 1.4)."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from ts_knowledge_base import build_knowledge_base, build_package_entry  # noqa: E402
from ts_resolver import check_source, check_paths, _top_level_package, _build_alias_map  # noqa: E402

FIXTURES = Path(__file__).resolve().parent.parent / "ts_corpus" / "node_modules"


@pytest.fixture(scope="module")
def kb():
    return build_knowledge_base(FIXTURES, [
        "axios", "lodash", "@types/lodash", "fp-ts-clean-demo", "fp-ts-notypes-demo",
    ])


def test_top_level_package_scoped():
    assert _top_level_package("@types/lodash/common") == "@types/lodash"


def test_top_level_package_plain():
    assert _top_level_package("axios") == "axios"


def test_top_level_package_deep_subpath():
    assert _top_level_package("lodash/debounce") == "lodash"


# ---------------------------------------------------------------------------
# Named acceptance-criteria cases (real, installed axios)
# ---------------------------------------------------------------------------

def test_catches_hallucinated_method_axios(kb):
    src = 'import axios from "axios";\naxios.getData("/x");'
    findings = check_source(src, kb, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["reason"] == "unresolved-symbol"
    assert findings[0]["expression"] == "axios.getData"


def test_catches_nonexistent_named_import(kb):
    src = 'import { NotReallyExported } from "axios";'
    findings = check_source(src, kb, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["reason"] == "unresolved-symbol"
    assert findings[0]["kind"] == "named_import"


def test_catches_not_installed_package():
    kb_local = build_knowledge_base(FIXTURES, ["totally-fake-pkg-xyz"])
    src = 'import x from "totally-fake-pkg-xyz";'
    findings = check_source(src, kb_local, filename="f.ts")
    assert findings[0]["reason"] == "dependency-not-installed"


def test_catches_bad_named_reexport(kb):
    src = 'export { NotReal } from "axios";'
    findings = check_source(src, kb, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["kind"] == "named_reexport"


# ---------------------------------------------------------------------------
# Zero-false-positive adversarial cases
# ---------------------------------------------------------------------------

def test_does_not_flag_valid_axios_chain_method(kb):
    # get/post/delete/etc. live on the `Axios` CLASS, two extends-hops up
    # from the default-exported AxiosStatic -- must resolve correctly.
    src = ('import axios from "axios";\n'
           'axios.get("/x"); axios.post("/y", {}); axios.delete("/z"); axios.patch("/w", {});')
    assert check_source(src, kb, filename="f.ts") == []


def test_does_not_flag_valid_named_import(kb):
    src = 'import { AxiosError } from "axios";'
    assert check_source(src, kb, filename="f.ts") == []


def test_type_only_import_still_checked_for_existence(kb):
    # KS-TRACE test: type-only imports are erased at runtime but a
    # type-only import of a name that doesn't exist is still a real
    # hallucination and must be caught.
    src = 'import type { TotallyFakeType } from "axios";'
    findings = check_source(src, kb, filename="f.ts")
    assert len(findings) == 1


def test_type_only_import_of_real_type_not_flagged(kb):
    src = 'import type { AxiosRequestConfig } from "axios";'
    assert check_source(src, kb, filename="f.ts") == []


def test_type_only_binding_excluded_from_pass_b(kb):
    # a type-only default import can never legitimately be called; must
    # not silently contribute a Pass B binding either way (safe no-op)
    src = 'import type Axios from "axios";\nAxios.get("/x");'
    # "Axios" here is just a bare identifier from a type-only import --
    # excluded from the alias map, so no attribute chain is checked
    # against it (no false positive risk either direction).
    assert check_source(src, kb, filename="f.ts") == []


def test_does_not_flag_reexported_symbol_star(kb):
    # a namespace import's re-exported/inherited members resolve through
    # the flattened symbol set exactly like a named import would
    src = 'import * as ns from "fp-ts-clean-demo";\nconst id: ns.ID = "x";'
    assert check_source(src, kb, filename="f.ts") == []


def test_does_not_flag_degraded_package_lodash(kb):
    # KS-TRACE test: lodash/​@types/lodash degrades due to module
    # augmentation -- ANY usage, valid or not, must never be flagged.
    src = 'import * as _ from "lodash";\n_.debounce(() => {}, 100);\n_.totallyMadeUpMethod();'
    assert check_source(src, kb, filename="f.ts") == []


def test_does_not_flag_notypes_package():
    kb_local = build_knowledge_base(FIXTURES, ["fp-ts-notypes-demo"])
    src = 'import x from "fp-ts-notypes-demo";\nx.anything();'
    assert check_source(src, kb_local, filename="f.ts") == []


def test_does_not_flag_relative_import(kb):
    src = 'import { Foo } from "./local-module";\nFoo.bar();'
    assert check_source(src, kb, filename="f.ts") == []


def test_does_not_flag_local_variable(kb):
    src = 'const axios = { get: () => {} };\naxios.somethingMadeUp();'
    assert check_source(src, kb, filename="f.ts") == []


def test_deep_subpath_import_not_symbol_checked(kb):
    # only "is the package installed" is checkable for subpaths this
    # session -- symbol-level checking of subpath declaration files is a
    # stated, known limitation, not silently over-scoped.
    src = 'import debounce from "lodash/debounce";\ndebounce(() => {}, 10);'
    assert check_source(src, kb, filename="f.ts") == []


def test_ambiguous_default_export_never_flagged(kb):
    # fp-ts-notypes-demo has status no-types; a default import of it must
    # never be flagged even though nothing could be verified.
    kb_local = build_knowledge_base(FIXTURES, ["fp-ts-notypes-demo"])
    src = 'import whatever from "fp-ts-notypes-demo";'
    assert check_source(src, kb_local, filename="f.ts") == []


def test_resolution_stops_after_one_hop(kb):
    src = 'import axios from "axios";\nconst x = axios.defaults.headers.common.Foo;'
    # hop 1 ("defaults") is checked and exists; deeper hops are unverified
    assert check_source(src, kb, filename="f.ts") == []


def test_determinism_repeat_check(kb):
    src = 'import axios from "axios";\naxios.getData("/x");'
    assert check_source(src, kb, filename="f.ts") == check_source(src, kb, filename="f.ts")


def test_check_paths_sorted_deterministic(kb, tmp_path):
    f1 = tmp_path / "a.ts"
    f1.write_text('import axios from "axios";\naxios.getData("/x");')
    f2 = tmp_path / "b.ts"
    f2.write_text('import { NotReal } from "axios";')
    findings = check_paths([f2, f1], kb)
    assert [f["file"] for f in findings] == sorted(f["file"] for f in findings)


def test_finding_shape_matches_python_resolver_schema(kb):
    src = 'import axios from "axios";\naxios.getData("/x");'
    findings = check_source(src, kb, filename="f.ts")
    assert set(findings[0].keys()) == {"file", "line", "kind", "expression", "reason"}


def test_namespace_import_hallucinated_call_caught():
    from ts_knowledge_base import build_knowledge_base
    kb_local = build_knowledge_base(FIXTURES, ["fp-ts-clean-demo"])
    src = 'import * as ns from "fp-ts-clean-demo";\nns.NotReal();'
    findings = check_source(src, kb_local, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["expression"] == "ns.NotReal"


def test_namespace_import_valid_call_not_flagged():
    from ts_knowledge_base import build_knowledge_base
    kb_local = build_knowledge_base(FIXTURES, ["fp-ts-clean-demo"])
    src = 'import * as ns from "fp-ts-clean-demo";\nns.helperFn("x");'
    assert check_source(src, kb_local, filename="f.ts") == []


# ---------------------------------------------------------------------------
# S4.5-TS-DEFECT-B: `const x = new NamedImportClass(...)` instance tracking,
# direct assignment only, one-hop depth (KS-REPORT-4.4 Section 3 / this
# session's design sign-off -- see ts_resolver.py's module docstring).
# ---------------------------------------------------------------------------

@pytest.fixture
def resend_instance_kb(tmp_path):
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
    return {"packages": {"resend-instance-demo": entry}}


def test_catches_hallucinated_instance_method_resend(resend_instance_kb):
    # KS-TRACE: this is the REVISED seeded pattern for Defect B (hop-1
    # hallucination directly on the instance) -- see docstring for why the
    # ORIGINAL two-hop seeded case is deliberately NOT caught.
    src = ('import { Resend } from "resend-instance-demo";\n'
           'const resend = new Resend("key");\n'
           'resend.notAMethod();')
    findings = check_source(src, resend_instance_kb, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["expression"] == "resend.notAMethod"
    assert findings[0]["reason"] == "unresolved-symbol"


def test_does_not_flag_valid_instance_method(resend_instance_kb):
    src = ('import { Resend } from "resend-instance-demo";\n'
           'const resend = new Resend("key");\n'
           'resend.send({});')
    assert check_source(src, resend_instance_kb, filename="f.ts") == []


def test_instance_tracking_respects_one_hop(resend_instance_kb):
    # KS-TRACE: this IS the ORIGINAL Defect B seeded case
    # (`resend.emails.sendBulkWithRetry(...)`) -- "emails" (hop 1) is a
    # real property so it resolves; "sendBulkWithRetry" (hop 2) is never
    # checked, by the same one-hop-depth rule every other binding kind
    # follows. Confirms the resolver does NOT silently over-reach beyond
    # the depth Yehor explicitly signed off on.
    src = ('import { Resend } from "resend-instance-demo";\n'
           'const resend = new Resend("key");\n'
           'resend.emails.sendBulkWithRetry();')
    assert check_source(src, resend_instance_kb, filename="f.ts") == []


def test_reassignment_not_tracked_for_instance(resend_instance_kb):
    # direct-assignment-only scope: a plain reassignment after declaration
    # is not tracked -- silence, a deliberate scope boundary, not a defect.
    src = ('import { Resend } from "resend-instance-demo";\n'
           'let resend;\n'
           'resend = new Resend("key");\n'
           'resend.notAMethod();')
    assert check_source(src, resend_instance_kb, filename="f.ts") == []


def test_alias_map_skips_non_named_import_constructor():
    # `new LocalOnly()` where LocalOnly isn't imported at all (a purely
    # local class) -- must not crash and must not produce a binding.
    imports = []
    new_bindings = [{"local_name": "x", "class_name": "LocalOnly", "line": 2}]
    assert _build_alias_map(imports, new_bindings) == {}


def test_alias_map_skips_default_import_constructor():
    # `new DefaultThing()` where DefaultThing is a DEFAULT import, not a
    # named one -- different binding shape, deliberately out of scope for
    # S4.5-TS-DEFECT-B (a default import already gets its own
    # default_import alias_map entry; it never collides with this path).
    imports = [{"kind": "default_import", "module": "thing", "imported_name": None,
                "local_name": "DefaultThing", "line": 1, "type_only": False, "flag": None}]
    new_bindings = [{"local_name": "x", "class_name": "DefaultThing", "line": 2}]
    alias_map = _build_alias_map(imports, new_bindings)
    assert "x" not in alias_map
    assert alias_map["DefaultThing"]["kind"] == "default_import"


def test_local_class_instance_not_flagged_end_to_end():
    # full end-to-end regression: a purely local class, never imported from
    # anywhere, must never be checked against any package's KB.
    src = 'class LocalOnly { real(): void {} }\nconst x = new LocalOnly();\nx.whatever();'
    assert check_source(src, {"packages": {}}, filename="f.ts") == []


# ---------------------------------------------------------------------------
# S4.5-TS-DEFECT-C: `export = Namespace` (real @types/react shape) no longer
# false-positives every hook/type named import (KS-REPORT-4.4 Section 3).
# ---------------------------------------------------------------------------

@pytest.fixture
def react_namespace_kb(tmp_path):
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
    return {"packages": {"react-namespace-demo": entry}}


def test_does_not_flag_real_react_hooks(react_namespace_kb):
    # KS-TRACE: this IS the live-verified regression -- the exact defect
    # confirmed on yehor.ai#1's second seeded-PR run (KS-REPORT-4.4 Section
    # 3), reproduced here against a synthetic fixture matching react's real
    # shape so it is caught locally, not only re-discoverable live.
    src = ('import { useState, useEffect, Component, ReactNode, FormEvent } '
           'from "react-namespace-demo";')
    assert check_source(src, react_namespace_kb, filename="f.ts") == []


def test_catches_hallucinated_named_import_against_namespace_export(react_namespace_kb):
    # regression guard: Defect C's fix must not silently disable named-
    # import hallucination detection entirely for this package.
    src = 'import { totallyFakeHook } from "react-namespace-demo";'
    findings = check_source(src, react_namespace_kb, filename="f.ts")
    assert len(findings) == 1
    assert findings[0]["kind"] == "named_import"

"""Unit tests for ts_resolver.py (Session 1.4)."""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from ts_knowledge_base import build_knowledge_base  # noqa: E402
from ts_resolver import check_source, check_paths, _top_level_package  # noqa: E402

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

"""Unit tests for ts_symbol_extractor.py (Session 1.4)."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from ts_symbol_extractor import extract_symbols, extract_symbols_from_file  # noqa: E402


def imports_by_line(result, line):
    return [e for e in result["imports"] if e["line"] == line]


def test_default_import():
    r = extract_symbols('import axios from "axios";')
    assert r["imports"] == [{
        "kind": "default_import", "module": "axios", "imported_name": None,
        "local_name": "axios", "line": 1, "type_only": False, "flag": None,
    }]


def test_named_import():
    r = extract_symbols('import { debounce } from "lodash";')
    e = r["imports"][0]
    assert e["kind"] == "named_import"
    assert e["imported_name"] == "debounce"
    assert e["local_name"] == "debounce"


def test_aliased_named_import():
    r = extract_symbols('import { b as c } from "./mod";')
    e = r["imports"][0]
    assert e["imported_name"] == "b"
    assert e["local_name"] == "c"


def test_namespace_import():
    r = extract_symbols('import * as _ from "lodash";')
    e = r["imports"][0]
    assert e["kind"] == "namespace_import"
    assert e["local_name"] == "_"


def test_type_only_import_flagged():
    r = extract_symbols('import type { Foo } from "./types";')
    e = r["imports"][0]
    assert e["type_only"] is True
    assert e["imported_name"] == "Foo"


def test_type_only_named_specifier():
    r = extract_symbols('import { type Foo, bar } from "./mix";')
    by_name = {e["imported_name"]: e for e in r["imports"]}
    assert by_name["Foo"]["type_only"] is True
    assert by_name["bar"]["type_only"] is False


def test_named_reexport():
    r = extract_symbols('export { x } from "./other";')
    e = r["imports"][0]
    assert e["kind"] == "named_reexport"
    assert e["imported_name"] == "x"
    assert e["local_name"] == "x"


def test_aliased_named_reexport():
    r = extract_symbols('export { y as z } from "./other";')
    e = r["imports"][0]
    assert e["imported_name"] == "y"
    assert e["local_name"] == "z"


def test_star_reexport():
    r = extract_symbols('export * from "./barrel";')
    e = r["imports"][0]
    assert e["kind"] == "star_reexport"
    assert e["module"] == "./barrel"


def test_export_without_from_not_reexport():
    r = extract_symbols('export const VERSION = "1.0";')
    assert r["imports"] == []


def test_export_default_no_reexport_entry():
    r = extract_symbols('export default 42;')
    assert r["imports"] == []


def test_dynamic_import_expression():
    r = extract_symbols('import("./dyn");')
    assert r["imports"][0]["kind"] == "dynamic_import"
    assert r["imports"][0]["flag"] == "unresolvable-by-design"
    assert r["imports"][0]["module"] == "./dyn"
    assert any(c["expression"] == "import" for c in r["call_targets"])


def test_dynamic_import_nonliteral_arg():
    r = extract_symbols('const p = "./" + name; import(p);')
    e = [i for i in r["imports"] if i["kind"] == "dynamic_import"][0]
    assert e["module"] is None


def test_simple_call():
    r = extract_symbols('foo();')
    assert r["call_targets"][0]["expression"] == "foo"


def test_dotted_call_excluded_from_attribute_chains():
    r = extract_symbols('axios.get("/x");')
    assert r["call_targets"][0]["expression"] == "axios.get"
    assert r["attribute_chains"] == []


def test_nested_call_both_captured():
    # KS-TRACE test: both the outer call's callee (whose text span
    # naturally includes the nested call syntax, same convention as
    # Python's callee-text-verbatim rule) and the inner call are captured.
    r = extract_symbols('axios.create({}).get("/y");')
    exprs = {c["expression"] for c in r["call_targets"]}
    assert "axios.create({}).get" in exprs
    assert "axios.create" in exprs
    assert r["attribute_chains"] == []  # both callees suppressed from attribute_chains


def test_member_chain_captured_when_not_call_target():
    r = extract_symbols('const x = axios.defaults.headers.common;')
    assert r["attribute_chains"][0]["expression"] == "axios.defaults.headers.common"
    # sub-chains must NOT also appear
    sub_exprs = {c["expression"] for c in r["attribute_chains"]}
    assert "axios.defaults.headers" not in sub_exprs
    assert "axios.defaults" not in sub_exprs


def test_member_in_call_argument_captured():
    r = extract_symbols('foo(bar.baz);')
    assert r["attribute_chains"][0]["expression"] == "bar.baz"


def test_subscript_access_not_captured_as_attribute():
    # A computed/subscript callee IS still captured in call_targets verbatim
    # (same "record regardless of shape" rule as Python), but bracket
    # access is never treated as a resolvable attribute_chain, since the
    # property name is not statically guaranteed (out of scope, stated).
    r = extract_symbols('axios["get"]("/z");')
    assert r["attribute_chains"] == []
    assert r["call_targets"][0]["expression"] == 'axios["get"]'


def test_determinism_repeat_parse():
    src = 'import axios from "axios";\naxios.get("/x").then(x => x.data.foo);'
    assert extract_symbols(src) == extract_symbols(src)


def test_deep_member_chain_no_recursion_error():
    chain = "a" + (".b" * 2000)
    src = f"const x = {chain};"
    result = extract_symbols(src)  # must not raise RecursionError
    assert result["attribute_chains"][0]["expression"] == chain


def test_extract_from_file_path(tmp_path):
    p = tmp_path / "sample.ts"
    p.write_text('import axios from "axios";\naxios.get("/x");')
    result = extract_symbols_from_file(p)
    assert result["imports"][0]["local_name"] == "axios"


def test_rejects_unsupported_extension(tmp_path):
    p = tmp_path / "sample.txt"
    p.write_text("hello")
    with pytest.raises(ValueError):
        extract_symbols_from_file(p)


def test_tsx_file_parses(tmp_path):
    p = tmp_path / "sample.tsx"
    p.write_text('import axios from "axios";\nconst el = <div>{axios.get("/x")}</div>;')
    result = extract_symbols_from_file(p)
    assert any(c["expression"] == "axios.get" for c in result["call_targets"])


def test_json_serializable():
    r = extract_symbols('import axios from "axios";\naxios.get("/x");')
    json.dumps(r)  # must not raise


def test_malformed_source_does_not_crash():
    malformed = 'import axios from "axios"\n function broken( { const x = ; axios.get(("/x");'
    result = extract_symbols(malformed)  # tree-sitter's error tolerance -- must not raise
    assert isinstance(result, dict)

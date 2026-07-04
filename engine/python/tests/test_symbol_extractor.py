"""
FixProve — Milestone 1, Session 1.1 — unit + adversarial + property tests
for symbol_extractor.py.

Run with:  pytest test_symbol_extractor.py -v
"""

import json
import sys
import textwrap
from pathlib import Path

import pytest
from hypothesis import given, settings, strategies as st

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from symbol_extractor import extract_symbols, extract_symbols_from_file  # noqa: E402


def src(code: str) -> str:
    return textwrap.dedent(code)


# ---------------------------------------------------------------------------
# Imports
# ---------------------------------------------------------------------------

def test_plain_import():
    r = extract_symbols(src("import os\n"))
    assert r["imports"] == [
        {"kind": "import", "module": "os", "name": None, "alias": None, "line": 1, "flag": None}
    ]


def test_aliased_import():
    r = extract_symbols(src("import numpy as np\n"))
    assert r["imports"] == [
        {"kind": "import", "module": "numpy", "name": None, "alias": "np", "line": 1, "flag": None}
    ]


def test_multi_import_same_statement():
    r = extract_symbols(src("import os, sys as s\n"))
    assert r["imports"] == [
        {"kind": "import", "module": "os", "name": None, "alias": None, "line": 1, "flag": None},
        {"kind": "import", "module": "sys", "name": None, "alias": "s", "line": 1, "flag": None},
    ]


def test_from_import():
    r = extract_symbols(src("from os import path\n"))
    assert r["imports"] == [
        {"kind": "from_import", "module": "os", "name": "path", "alias": None, "line": 1, "flag": None}
    ]


def test_from_import_aliased():
    r = extract_symbols(src("from os import path as p\n"))
    assert r["imports"] == [
        {"kind": "from_import", "module": "os", "name": "path", "alias": "p", "line": 1, "flag": None}
    ]


def test_from_import_parenthesized_multi():
    r = extract_symbols(src("from os import (path, sep as S)\n"))
    assert r["imports"] == [
        {"kind": "from_import", "module": "os", "name": "path", "alias": None, "line": 1, "flag": None},
        {"kind": "from_import", "module": "os", "name": "sep", "alias": "S", "line": 1, "flag": None},
    ]


def test_wildcard_import_flagged():
    r = extract_symbols(src("from os import *\n"))
    assert r["imports"] == [
        {"kind": "from_import", "module": "os", "name": "*", "alias": None, "line": 1,
         "flag": "unresolvable-by-design"}
    ]


def test_relative_import():
    r = extract_symbols(src("from . import sibling\nfrom ..pkg import thing as t\n"))
    assert r["imports"][0]["module"] == "."
    assert r["imports"][0]["name"] == "sibling"
    assert r["imports"][1]["module"] == "..pkg"
    assert r["imports"][1]["name"] == "thing"
    assert r["imports"][1]["alias"] == "t"


def test_dynamic_import_literal_arg_flagged_and_captured():
    r = extract_symbols(src('__import__("os")\n'))
    dyn = [e for e in r["imports"] if e["kind"] == "dynamic_import"]
    assert dyn == [
        {"kind": "dynamic_import", "module": "os", "name": None, "alias": None, "line": 1,
         "flag": "unresolvable-by-design"}
    ]
    assert any(c["expression"] == "__import__" for c in r["call_targets"])


def test_dynamic_import_nonliteral_arg_still_flagged():
    r = extract_symbols(src("mod_name = 'os'\n__import__(mod_name)\n"))
    dyn = [e for e in r["imports"] if e["kind"] == "dynamic_import"]
    assert len(dyn) == 1
    assert dyn[0]["module"] is None
    assert dyn[0]["flag"] == "unresolvable-by-design"


def test_imports_schema_consistent_keys():
    r = extract_symbols(src(
        "import os\nimport numpy as np\nfrom os import path\nfrom os import *\n__import__('x')\n"
    ))
    expected_keys = {"kind", "module", "name", "alias", "line", "flag"}
    for entry in r["imports"]:
        assert set(entry.keys()) == expected_keys


# ---------------------------------------------------------------------------
# Calls
# ---------------------------------------------------------------------------

def test_simple_call():
    r = extract_symbols(src("foo()\n"))
    assert r["call_targets"] == [{"expression": "foo", "line": 1, "flag": None}]


def test_dotted_call():
    r = extract_symbols(src("obj.attr.sub.method(a, b.c)\n"))
    exprs = {c["expression"] for c in r["call_targets"]}
    assert "obj.attr.sub.method" in exprs


def test_complex_callable_parenthesized_lambda():
    r = extract_symbols(src("(lambda: x)()\n"))
    assert r["call_targets"] == [{"expression": "(lambda: x)", "line": 1, "flag": None}]


def test_call_line_number_is_call_start():
    r = extract_symbols(src("foo(\n    a,\n    b,\n)\n"))
    assert r["call_targets"][0]["line"] == 1


# ---------------------------------------------------------------------------
# Attribute chains + the overlap rule (this is where DEFECT-001 lived)
# ---------------------------------------------------------------------------

def test_nested_attribute_chain_no_duplicates():
    r = extract_symbols(src("obj.attr.sub.value\n"))
    assert r["attribute_chains"] == [{"expression": "obj.attr.sub.value", "line": 1, "flag": None}]


def test_dotted_call_excluded_from_attribute_chains():
    r = extract_symbols(src("obj.attr.sub.method(a, b.c)\n"))
    call_exprs = {c["expression"] for c in r["call_targets"]}
    attr_exprs = {a["expression"] for a in r["attribute_chains"]}
    assert call_exprs & attr_exprs == set()
    assert "obj.attr.sub.method" in call_exprs
    assert "obj.attr.sub.method" not in attr_exprs
    assert "b.c" in attr_exprs


def test_attribute_chain_rooted_in_call_result():
    r = extract_symbols(src("a.b().c\n"))
    assert r["call_targets"] == [{"expression": "a.b", "line": 1, "flag": None}]
    assert r["attribute_chains"] == [{"expression": "a.b().c", "line": 1, "flag": None}]


def test_subscript_rooted_attribute_chain():
    r = extract_symbols(src("d[0].e\n"))
    assert r["attribute_chains"] == [{"expression": "d[0].e", "line": 1, "flag": None}]


def test_assignment_target_attribute_chain():
    r = extract_symbols(src("self.x.y = 1\n"))
    assert r["attribute_chains"] == [{"expression": "self.x.y", "line": 1, "flag": None}]


def test_no_duplicate_visit_via_defensive_loop():
    r = extract_symbols(src("importlib.import_module('os')\n"))
    call_exprs = [c["expression"] for c in r["call_targets"]]
    attr_exprs = [a["expression"] for a in r["attribute_chains"]]
    assert call_exprs.count("importlib.import_module") == 1
    assert "importlib.import_module" not in attr_exprs
    assert attr_exprs == []


def test_nested_call_in_attribute_object_no_duplicate():
    r = extract_symbols(src("a.b().c.d()\n"))
    call_exprs = [c["expression"] for c in r["call_targets"]]
    attr_exprs = [a["expression"] for a in r["attribute_chains"]]
    assert call_exprs.count("a.b") == 1
    assert call_exprs.count("a.b().c.d") == 1
    assert "a.b().c.d" not in attr_exprs
    assert len(attr_exprs) == len(set(attr_exprs))


# ---------------------------------------------------------------------------
# Determinism invariant
# ---------------------------------------------------------------------------

def test_line_numbers_1_indexed():
    r = extract_symbols(src("\n\nimport os\n"))
    assert r["imports"][0]["line"] == 3


def test_determinism_repeat_parse():
    code = src("""
        import os
        from x import *
        __import__("y")

        def f():
            obj.attr.method(a.b)
            a.b().c
    """)
    r1 = extract_symbols(code)
    r2 = extract_symbols(code)
    assert r1 == r2
    assert json.dumps(r1, sort_keys=False) == json.dumps(r2, sort_keys=False)


def test_output_schema_top_level_keys():
    r = extract_symbols(src("import os\n"))
    assert set(r.keys()) == {"imports", "call_targets", "attribute_chains"}


def test_empty_file():
    r = extract_symbols("")
    assert r == {"imports": [], "call_targets": [], "attribute_chains": []}


def test_extractor_does_not_crash_on_malformed_source():
    broken = "def f(:\n    import \n    x.\n"
    r = extract_symbols(broken)
    assert set(r.keys()) == {"imports", "call_targets", "attribute_chains"}


# ---------------------------------------------------------------------------
# File-input contract
# ---------------------------------------------------------------------------

def test_extract_from_file_path(tmp_path):
    f = tmp_path / "sample.py"
    f.write_text("import os\nfoo()\n")
    r = extract_symbols_from_file(f)
    assert r["imports"][0]["module"] == "os"
    assert r["call_targets"][0]["expression"] == "foo"


def test_rejects_non_py_extension(tmp_path):
    f = tmp_path / "sample.txt"
    f.write_text("import os\n")
    with pytest.raises(ValueError):
        extract_symbols_from_file(f)


# ---------------------------------------------------------------------------
# Property-based tests
# ---------------------------------------------------------------------------

# KS-TRACE: S1.4-INCIDENTAL-DEFECT | fix (found during Session 1.4's full
# regression run, in Session 1.1's own property test -- not in
# symbol_extractor.py's production code): the original hardcoded keyword
# blocklist was incomplete (missing "in", "for", "not", "and", "or", "is",
# "while", etc.). Hypothesis eventually shrank to chain="in", generating
# `in()` -- invalid Python syntax -- which tree-sitter correctly does NOT
# parse as an ordinary call, so the test's own assumption ("any generated
# identifier chain is valid Python") was false, not the extractor. Fixed
# by using the stdlib `keyword` module for a complete, authoritative
# exclusion list instead of a hand-maintained one.
import keyword as _keyword_module  # noqa: E402

identifier_strategy = st.from_regex(r"[a-zA-Z_][a-zA-Z0-9_]{0,8}", fullmatch=True).filter(
    lambda s: not _keyword_module.iskeyword(s) and not _keyword_module.issoftkeyword(s)
)

chain_strategy = st.lists(identifier_strategy, min_size=1, max_size=5).map(lambda parts: ".".join(parts))


@given(chain=chain_strategy, args=st.lists(identifier_strategy, max_size=3))
@settings(max_examples=200)
def test_property_call_target_never_leaks_into_attribute_chain(chain, args):
    code = f"{chain}({', '.join(args)})\n"
    result = extract_symbols(code)
    call_exprs = {c["expression"] for c in result["call_targets"]}
    attr_exprs = {a["expression"] for a in result["attribute_chains"]}
    assert call_exprs & attr_exprs == set()
    assert chain in call_exprs


@given(chain=chain_strategy)
@settings(max_examples=200)
def test_property_determinism_across_arbitrary_chains(chain):
    code = f"{chain}\n"
    r1 = extract_symbols(code)
    r2 = extract_symbols(code)
    assert r1 == r2


# ---------------------------------------------------------------------------
# Regression test for DEFECT-002 (RecursionError on deep attribute chains)
# ---------------------------------------------------------------------------

def test_deep_attribute_chain_no_recursion_error():
    depth = 5000
    code = "a" + ".b" * depth + "\n"
    r = extract_symbols(code)  # must not raise RecursionError
    assert len(r["attribute_chains"]) == 1
    assert r["attribute_chains"][0]["expression"] == code.strip()


def test_decorator_call_recorded_once_not_duplicated():
    code = src("""
        import app

        @app.route("/x")
        def handler():
            pass
    """)
    r = extract_symbols(code)
    assert r["call_targets"] == [{"expression": "app.route", "line": 4, "flag": None}]
    assert r["attribute_chains"] == []

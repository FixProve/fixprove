"""
FixProve — Milestone 1, Session 1.3 — unit tests for resolver.py.
"""

import sys
import textwrap
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from resolver import check_source, _build_alias_map, build_import_name_bridge  # noqa: E402


def src(code: str) -> str:
    return textwrap.dedent(code)


def _kb(modules: dict) -> dict:
    return {"lockfile_hash": "test", "modules": modules}


def _ok_module(symbols, callables=None):
    return {"requested_version": "1.0.0", "installed_version": "1.0.0", "status": "ok",
            "symbols": symbols, "callables": callables or {}, "flags": []}


# ---------------------------------------------------------------------------
# Alias-map construction
# ---------------------------------------------------------------------------

def test_alias_map_plain_import():
    imports = [{"kind": "import", "module": "pandas", "alias": None, "name": None, "line": 1, "flag": None}]
    m = _build_alias_map(imports)
    assert m["pandas"] == {"kind": "import", "module": "pandas", "line": 1}


def test_alias_map_aliased_import():
    imports = [{"kind": "import", "module": "pandas", "alias": "pd", "name": None, "line": 1, "flag": None}]
    m = _build_alias_map(imports)
    assert m["pd"] == {"kind": "import", "module": "pandas", "line": 1}


def test_alias_map_dotted_import_no_alias():
    # `import a.b.c` (no alias) only binds the top-level name "a" in scope,
    # per real Python semantics.
    imports = [{"kind": "import", "module": "a.b.c", "alias": None, "name": None, "line": 1, "flag": None}]
    m = _build_alias_map(imports)
    assert m == {"a": {"kind": "import", "module": "a", "line": 1}}


def test_alias_map_from_import():
    imports = [{"kind": "from_import", "module": "pandas", "name": "DataFrame", "alias": None, "line": 1, "flag": None}]
    m = _build_alias_map(imports)
    assert m["DataFrame"] == {"kind": "from_import", "module": "pandas", "leaf": "DataFrame", "line": 1}


def test_alias_map_from_import_aliased():
    imports = [{"kind": "from_import", "module": "pandas", "name": "DataFrame", "alias": "DF", "line": 1, "flag": None}]
    m = _build_alias_map(imports)
    assert m["DF"] == {"kind": "from_import", "module": "pandas", "leaf": "DataFrame", "line": 1}


def test_alias_map_skips_wildcard_and_dynamic_imports():
    imports = [
        {"kind": "from_import", "module": "os", "name": "*", "alias": None, "line": 1,
         "flag": "unresolvable-by-design"},
        {"kind": "dynamic_import", "module": "os", "name": None, "alias": None, "line": 2,
         "flag": "unresolvable-by-design"},
    ]
    m = _build_alias_map(imports)
    assert m == {}


# ---------------------------------------------------------------------------
# Core resolution: the contract's named cases
# ---------------------------------------------------------------------------

def test_catches_typo_attribute_call():
    kb = _kb({"pandas": _ok_module(["read_excel", "DataFrame"])})
    code = src("import pandas as pd\npd.read_exel('x.xlsx')\n")
    findings = check_source(code, kb, filename="f.py")
    assert len(findings) == 1
    assert findings[0] == {"file": "f.py", "line": 2, "kind": "call_targets",
                            "expression": "pd.read_exel", "reason": "unresolved-symbol"}


def test_catches_not_installed_dependency():
    kb = _kb({"fastapi-helpers": {"requested_version": "1.0.0", "installed_version": None,
                                   "status": "not-installed", "symbols": [], "callables": {}, "flags": []}})
    code = src("import fastapi_helpers\nfastapi_helpers.do_thing()\n")
    findings = check_source(code, kb, filename="f.py")
    assert len(findings) == 1
    assert findings[0]["reason"] == "dependency-not-installed"
    assert findings[0]["line"] == 1  # flagged once, at the import line


def test_catches_bad_from_import():
    kb = _kb({"pandas": _ok_module(["read_excel"])})
    code = src("from pandas import read_exel_typo\n")
    findings = check_source(code, kb, filename="f.py")
    assert len(findings) == 1
    assert findings[0]["reason"] == "unresolved-symbol"
    assert findings[0]["expression"] == "pandas.read_exel_typo"


def test_does_not_flag_reexported_symbol():
    # KB's "symbols" list is populated by dir() on the real module object,
    # so a re-exported name is present exactly like any other public name.
    kb = _kb({"requests": _ok_module(["get", "post", "Session"])})
    code = src("import requests\nrequests.get('https://x')\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_does_not_flag_local_variable():
    kb = _kb({})
    code = src("""
        class Widget:
            def render(self): pass
        w = Widget()
        w.render()
    """)
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_does_not_flag_stdlib():
    kb = _kb({})
    code = src("import os\nimport json\nos.path.join('a','b')\njson.dumps({})\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_never_flags_degraded_module():
    kb = _kb({"weird-pkg": {"requested_version": "1.0.0", "installed_version": "1.0.0",
                              "status": "crashed", "symbols": [], "callables": {}, "flags": ["returncode:1"]}})
    code = src("import weird_pkg\nweird_pkg.might_not_exist()\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []  # cannot verify -> never flag, per the locked Session 1.3 decision


def test_never_flags_timeout_module():
    kb = _kb({"slow-pkg": {"requested_version": "1.0.0", "installed_version": "1.0.0",
                            "status": "timeout", "symbols": [], "callables": {}, "flags": []}})
    code = src("import slow_pkg\nslow_pkg.anything()\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_catches_version_mismatch():
    kb = _kb({"pandas": {"requested_version": "1.0.0", "installed_version": "2.3.3",
                          "status": "version-mismatch", "symbols": [], "callables": {}, "flags": []}})
    code = src("import pandas\npandas.read_excel('x')\n")
    findings = check_source(code, kb, filename="f.py")
    assert len(findings) == 1
    assert findings[0]["reason"] == "dependency-version-mismatch"


def test_resolution_stops_after_one_hop():
    # pandas.io exists (hop 1 OK), but we have no data on pandas.io's own
    # attributes -- "common" (hop 2) must NOT be checked/flagged either way.
    kb = _kb({"pandas": _ok_module(["io"])})
    code = src("import pandas as pd\npd.io.common.get_handle('x')\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_module_not_in_kb_is_out_of_scope():
    # numpy referenced in code but not declared in requirements.txt at all
    # (and not stdlib) -- out of scope this session, never flagged.
    kb = _kb({})
    code = src("import numpy as np\nnp.array([1, 2])\n")
    findings = check_source(code, kb, filename="f.py")
    assert findings == []


def test_bridge_handles_distribution_import_name_mismatch():
    # "pyyaml" is the distribution name; "yaml" is the import name. The
    # bridge must connect them so `import yaml` resolves against the
    # "pyyaml" KB entry.
    kb = _kb({"pyyaml": _ok_module(["safe_load", "dump"])})
    bridge = build_import_name_bridge(kb)
    assert bridge.get("yaml") == "pyyaml"
    code = src("import yaml\nyaml.safe_load('x: 1')\nyaml.unsafe_typo_fn()\n")
    findings = check_source(code, kb, filename="f.py", bridge=bridge)
    assert len(findings) == 1
    assert findings[0]["expression"] == "yaml.unsafe_typo_fn"


# ---------------------------------------------------------------------------
# Determinism
# ---------------------------------------------------------------------------

def test_determinism_repeat_check():
    kb = _kb({"pandas": _ok_module(["read_excel"])})
    code = src("import pandas as pd\npd.read_exel('x')\npd.read_excel('y')\n")
    r1 = check_source(code, kb, filename="f.py")
    r2 = check_source(code, kb, filename="f.py")
    assert r1 == r2

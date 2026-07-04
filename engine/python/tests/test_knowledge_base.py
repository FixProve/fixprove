"""
FixProve — Milestone 1, Session 1.2 — unit + adversarial tests for
knowledge_base.py / _kb_worker.py.
"""

import json
import os
import sys
import textwrap
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from knowledge_base import (  # noqa: E402
    build_knowledge_base,
    introspect_module_via_subprocess,
    parse_requirements,
    _lockfile_hash,
    _normalize_dist_name,
    _resolve_import_name,
    _build_reverse_map,
)


# ---------------------------------------------------------------------------
# requirements.txt parsing
# ---------------------------------------------------------------------------

def test_parse_valid_pins():
    entries = parse_requirements("requests==2.31.0\nnumpy==1.26.0\n")
    assert entries == [
        {"name": "requests", "version": "2.31.0", "raw_line": "requests==2.31.0", "line_ok": True},
        {"name": "numpy", "version": "1.26.0", "raw_line": "numpy==1.26.0", "line_ok": True},
    ]


def test_parse_skips_blank_and_comment_lines():
    entries = parse_requirements("\n# a comment\n\nrequests==2.31.0\n")
    assert len(entries) == 1
    assert entries[0]["name"] == "requests"


def test_parse_handles_extras():
    entries = parse_requirements("requests[security]==2.31.0\n")
    assert entries[0]["name"] == "requests"
    assert entries[0]["version"] == "2.31.0"


def test_parse_handles_trailing_comment_and_marker():
    entries = parse_requirements('requests==2.31.0 ; python_version >= "3.8"  # pinned\n')
    assert entries[0]["line_ok"] is True
    assert entries[0]["name"] == "requests"
    assert entries[0]["version"] == "2.31.0"


@pytest.mark.parametrize("bad_line", [
    "requests>=2.31.0",       # range, not an exact pin -- out of scope this session
    "requests~=2.31",         # compatible-release, out of scope
    "-e .",                   # editable install
    "-r other-requirements.txt",
    "git+https://github.com/psf/requests.git",
    "requests",                # no version at all
])
def test_parse_flags_unsupported_line_shapes(bad_line):
    entries = parse_requirements(bad_line + "\n")
    assert len(entries) == 1
    assert entries[0]["line_ok"] is False
    assert entries[0]["raw_line"] == bad_line


# ---------------------------------------------------------------------------
# Cache-key / lockfile hash invariant
# ---------------------------------------------------------------------------

def test_lockfile_hash_stable_ordering():
    e1 = parse_requirements("a==1.0\nb==2.0\n")
    e2 = parse_requirements("b==2.0\na==1.0\n")
    assert _lockfile_hash(e1) == _lockfile_hash(e2)


def test_lockfile_hash_changes_with_version():
    e1 = parse_requirements("a==1.0\n")
    e2 = parse_requirements("a==2.0\n")
    assert _lockfile_hash(e1) != _lockfile_hash(e2)


def test_lockfile_hash_ignores_unsupported_lines():
    # An unsupported line shouldn't perturb the hash of the resolvable pins.
    e1 = parse_requirements("a==1.0\n")
    e2 = parse_requirements("a==1.0\n-e .\n")
    assert _lockfile_hash(e1) == _lockfile_hash(e2)


# ---------------------------------------------------------------------------
# Distribution-name normalization + import-name resolution
# ---------------------------------------------------------------------------

def test_normalize_dist_name():
    assert _normalize_dist_name("Pillow") == "pillow"
    assert _normalize_dist_name("python_dateutil") == "python-dateutil"
    assert _normalize_dist_name("python.dateutil") == "python-dateutil"


def test_resolve_import_name_prefers_exact_match_over_internal():
    # Regression test for DEFECT-003: "pytest" distribution maps to
    # ["_pytest", "py", "pytest"] via packages_distributions(); must resolve
    # to the real public "pytest" module, not the internal "_pytest".
    reverse_map = {"pytest": ["_pytest", "py", "pytest"]}
    assert _resolve_import_name("pytest", reverse_map) == "pytest"


def test_resolve_import_name_prefers_public_over_underscored():
    # "pyyaml" -> ["_yaml", "yaml"]: no candidate matches the normalized
    # dist name exactly, so the fallback must prefer the non-underscored one.
    reverse_map = {"pyyaml": ["_yaml", "yaml"]}
    assert _resolve_import_name("pyyaml", reverse_map) == "yaml"


def test_resolve_import_name_fallback_normalization():
    # Distribution not present in the reverse map at all -> best-effort
    # normalized-name guess.
    assert _resolve_import_name("Some-Package", {}) == "some_package"


def test_resolve_import_name_via_packages_distributions_real_env():
    # Integration check against the REAL environment's actual metadata
    # (not mocked) -- this is the exact scenario DEFECT-003 was found in.
    reverse_map = _build_reverse_map()
    assert _resolve_import_name("pytest", reverse_map) == "pytest"


# ---------------------------------------------------------------------------
# End-to-end: real, currently-installed packages (matches the master plan's
# own reality-check philosophy: verify against real dependencies, not mocks)
# ---------------------------------------------------------------------------

def _real_version(dist_name):
    from importlib import metadata
    return metadata.version(dist_name)


def test_build_knowledge_base_end_to_end_real_packages(tmp_path):
    pytest_v = _real_version("pytest")
    hyp_v = _real_version("hypothesis")
    req_file = tmp_path / "requirements.txt"
    req_file.write_text(f"pytest=={pytest_v}\nhypothesis=={hyp_v}\n")

    kb = build_knowledge_base(req_file, cache_dir=tmp_path / "cache")

    assert kb["modules"]["pytest"]["status"] == "ok"
    assert "fixture" in kb["modules"]["pytest"]["symbols"]
    assert "raises" in kb["modules"]["pytest"]["symbols"]
    assert kb["modules"]["pytest"]["installed_version"] == pytest_v

    assert kb["modules"]["hypothesis"]["status"] == "ok"
    assert "given" in kb["modules"]["hypothesis"]["symbols"]
    assert "given" in kb["modules"]["hypothesis"]["callables"]
    assert kb["modules"]["hypothesis"]["callables"]["given"]["kind"] == "function"


def test_build_knowledge_base_not_installed(tmp_path):
    req_file = tmp_path / "requirements.txt"
    req_file.write_text("definitely-not-a-real-package-xyz==1.0.0\n")
    kb = build_knowledge_base(req_file, cache_dir=tmp_path / "cache")
    entry = kb["modules"]["definitely-not-a-real-package-xyz"]
    assert entry["status"] == "not-installed"
    assert entry["installed_version"] is None


def test_build_knowledge_base_version_mismatch(tmp_path):
    real_v = _real_version("pytest")
    req_file = tmp_path / "requirements.txt"
    req_file.write_text(f"pytest=={real_v}.does-not-exist\n")
    kb = build_knowledge_base(req_file, cache_dir=tmp_path / "cache")
    entry = kb["modules"]["pytest"]
    assert entry["status"] == "version-mismatch"
    assert entry["installed_version"] == real_v


def test_build_knowledge_base_unsupported_line(tmp_path):
    req_file = tmp_path / "requirements.txt"
    req_file.write_text("requests>=2.0.0\n")
    kb = build_knowledge_base(req_file, cache_dir=tmp_path / "cache")
    entries = [e for e in kb["modules"].values() if e["status"] == "unsupported-requirement-line"]
    assert len(entries) == 1


# ---------------------------------------------------------------------------
# Cache hit / miss / invalidation
# ---------------------------------------------------------------------------

def test_cache_hit_skips_reintrospection(tmp_path, monkeypatch):
    pytest_v = _real_version("pytest")
    req_file = tmp_path / "requirements.txt"
    req_file.write_text(f"pytest=={pytest_v}\n")
    cache_dir = tmp_path / "cache"

    kb1 = build_knowledge_base(req_file, cache_dir=cache_dir)
    assert kb1["modules"]["pytest"]["status"] == "ok"

    # Sabotage introspection so a cache MISS would be obviously detectable.
    import knowledge_base as kb_mod
    def _boom(*a, **kw):
        raise AssertionError("introspection should not run on a cache hit")
    monkeypatch.setattr(kb_mod, "introspect_module_via_subprocess", _boom)

    kb2 = build_knowledge_base(req_file, cache_dir=cache_dir)
    assert kb2 == kb1  # served from cache, no crash from the sabotaged function


def test_cache_miss_on_version_change(tmp_path, monkeypatch):
    req_file = tmp_path / "requirements.txt"
    cache_dir = tmp_path / "cache"
    req_file.write_text("fakepkg==1.0.0\n")

    import knowledge_base as kb_mod
    calls = []
    def _fake_introspect(module_name, timeout=10.0, extra_sys_path=None):
        calls.append(module_name)
        return {"status": "ok", "symbols": ["x"], "callables": {}, "flags": []}
    monkeypatch.setattr(kb_mod, "introspect_module_via_subprocess", _fake_introspect)
    monkeypatch.setattr(kb_mod, "_get_installed_version", lambda name: "1.0.0")

    kb1 = build_knowledge_base(req_file, cache_dir=cache_dir)
    assert len(calls) == 1

    # Same version again -> cache hit, no re-introspection.
    kb2 = build_knowledge_base(req_file, cache_dir=cache_dir)
    assert len(calls) == 1
    assert kb2 == kb1

    # Version changes -> the lockfile hash changes -> cache MISS -> rebuild.
    req_file.write_text("fakepkg==2.0.0\n")
    monkeypatch.setattr(kb_mod, "_get_installed_version", lambda name: "2.0.0")
    kb3 = build_knowledge_base(req_file, cache_dir=cache_dir)
    assert len(calls) == 2
    assert kb3["lockfile_hash"] != kb1["lockfile_hash"]


# ---------------------------------------------------------------------------
# Adversarial: subprocess isolation against catastrophic failures
# ---------------------------------------------------------------------------

ADVERSARIAL_MODULES = {
    "boom_hard_exit.py": """
import os
os._exit(1)
""",
    "boom_infinite_loop.py": """
while True:
    pass
""",
    "boom_import_error.py": """
raise RuntimeError("deliberate import-time failure")
""",
    "boom_getattr_raises.py": """
__all__ = ["ok_name", "bad_name"]

def ok_name():
    pass

def __getattr__(name):
    if name == "bad_name":
        raise RuntimeError("monkeypatched module __getattr__ blew up")
    raise AttributeError(name)
""",
    "boom_signature_raises.py": """
class Weird:
    def __init__(self, *a, **kw):
        pass

    @property
    def __signature__(self):
        raise RuntimeError("monkeypatched __signature__ blew up")

__all__ = ["Weird"]
""",
}


@pytest.fixture
def adversarial_dir(tmp_path):
    for filename, code in ADVERSARIAL_MODULES.items():
        (tmp_path / filename).write_text(textwrap.dedent(code))
    return tmp_path


def test_subprocess_survives_hard_exit(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_hard_exit", timeout=5.0, extra_sys_path=[str(adversarial_dir)]
    )
    assert result["status"] == "crashed"


def test_subprocess_survives_infinite_loop(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_infinite_loop", timeout=2.0, extra_sys_path=[str(adversarial_dir)]
    )
    assert result["status"] == "timeout"


def test_subprocess_survives_import_error(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_import_error", timeout=5.0, extra_sys_path=[str(adversarial_dir)]
    )
    assert result["status"] == "import-error"
    assert result["symbols"] == []


def test_worker_module_getattr_raises_is_flagged_not_fatal(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_getattr_raises", timeout=5.0, extra_sys_path=[str(adversarial_dir)]
    )
    assert result["status"] == "ok"
    assert "ok_name" in result["symbols"]
    assert "bad_name" not in result["symbols"]
    assert any("attr-access-failed:bad_name" in f for f in result["flags"])


def test_worker_signature_unavailable_is_flagged(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_signature_raises", timeout=5.0, extra_sys_path=[str(adversarial_dir)]
    )
    assert result["status"] == "ok"
    assert "Weird" in result["callables"]
    assert result["callables"]["Weird"]["signature"] is None
    assert any("signature-unavailable:Weird" in f for f in result["flags"])


def test_worker_respects_dunder_all(adversarial_dir):
    result = introspect_module_via_subprocess(
        "boom_getattr_raises", timeout=5.0, extra_sys_path=[str(adversarial_dir)]
    )
    # __all__ = ["ok_name", "bad_name"] -- __getattr__ itself must never
    # leak into symbols even though it's module-level.
    assert "__getattr__" not in result["symbols"]


def test_duplicate_requirement_entry_is_flagged_not_silent(tmp_path):
    pytest_v = _real_version("pytest")
    req_file = tmp_path / "requirements.txt"
    req_file.write_text(f"pytest=={pytest_v}\npytest==0.0.1\n")
    kb = build_knowledge_base(req_file, cache_dir=tmp_path / "cache")
    entry = kb["modules"]["pytest"]
    assert entry["requested_version"] == "0.0.1"  # last pin wins, deterministically
    assert any("duplicate-requirement-entry" in f for f in entry["flags"])
    assert "0.0.1" not in "".join(f for f in entry["flags"] if "also requested" not in f)  # sanity: message mentions the *other* version

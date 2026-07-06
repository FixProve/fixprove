"""
FixProve — Milestone 1, Session 1.2: Dependency Knowledge Base Builder
=======================================================================

Builds a queryable map of the REAL, currently-installed public API of a
project's dependencies: module -> {public symbols, callables, signatures}.
Introspection only (no .pyi/typeshed parsing this session -- deferred, see
the Keystone Report's Known Limitations).

CONTRACT (locked with Yehor, 2026-07-04)
-----------------------------------------
  Input      : path to a requirements.txt file. Only exact `name==version`
               pins are resolved; every other line shape (ranges, `-e`,
               `-r`, VCS URLs, poetry.lock/uv.lock/Pipfile.lock content) is
               explicitly OUT OF SCOPE this session and is captured as a
               per-line "unsupported-requirement-line" entry, never fatal.
  Output     : plain JSON-serializable dict:
                   {
                     "lockfile_hash": "<sha256 hex>",
                     "modules": {
                        "<distribution-name>": {
                           "requested_version": "<from requirements.txt>",
                           "installed_version": "<from importlib.metadata>" | None,
                           "status": "ok" | "not-installed" | "version-mismatch"
                                     | "import-error" | "timeout" | "crashed"
                                     | "degraded" | "unsupported-requirement-line"
                                     | "subprocess-launch-error",
                           "symbols": [<public attribute names>],
                           "callables": {name: {"kind": ..., "signature": str|None}},
                           "flags": [<best-effort degradation notes>],
                        },
                        ...
                     }
                   }
  Invariant  : the KB is cached to disk keyed by a sha256 hash of the
               normalized requirements.txt content (name+version pairs,
               sorted). ANY version change changes the hash, which is a
               cache miss and forces a full rebuild. This is the "lockfile
               hash" cache-keying named in the master build plan.
  Adversarial: each dependency is introspected in its OWN subprocess with a
               timeout. A package that segfaults, hangs, or calls
               os._exit() cannot crash the builder -- the parent degrades
               that module's entry to "timeout" / "crashed" and continues
               with the rest. Within the subprocess, every import / dir() /
               getattr() / inspect.signature() call is separately
               try/excepted so ordinary Python-level exceptions (a raising
               module __getattr__, a signature-less C builtin, a
               monkeypatched __all__) degrade to a per-symbol flag instead
               of failing the whole module. See _kb_worker.py.

ASSUMPTIONS (AI-logged, pending Yehor override)
-------------------------------------------------
  - Distribution name -> importable module name resolution uses
    importlib.metadata.packages_distributions() (Python 3.10+) as the
    primary source of truth, since it is built from the installed
    dist-info RECORD metadata and does not depend on a package having
    shipped a top_level.txt. Falls back to PEP 503 name normalization
    (lowercase, `-`/`_`/`.` collapsed) as a best-effort guess if the
    distribution isn't found in that map (e.g. very old/nonstandard
    installs). This fallback is itself best-effort and may be wrong for
    packages whose import name differs unpredictably from their
    distribution name (e.g. "beautifulsoup4" -> "bs4") when
    packages_distributions() doesn't know about them.
  - No automatic installation of missing/mismatched packages. A
    requirements.txt entry that isn't installed, or is installed at a
    different version, is recorded as a flagged, non-fatal degraded entry
    ("not-installed" / "version-mismatch") -- never silently pip-installed.
    This is a deliberate security/scope boundary, not an oversight.
"""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from importlib import metadata as importlib_metadata
from pathlib import Path
from typing import Optional

_WORKER_SCRIPT = Path(__file__).resolve().parent / "_kb_worker.py"

# PEP 508-ish: name[extras]==version, optional trailing environment marker
# (";...") or comment ("#..."). Only an exact "==" pin is in scope.
_REQ_LINE_RE = re.compile(
    r"""^\s*
        (?P<name>[A-Za-z0-9][A-Za-z0-9._-]*)
        (?:\[[^\]]*\])?          # optional extras, e.g. requests[security]
        \s*==\s*
        (?P<version>[A-Za-z0-9._+!-]+)
        \s*
        (?:;[^#]*)?              # optional environment marker
        (?:\#.*)?                # optional trailing comment
        $""",
    re.VERBOSE,
)


def _normalize_dist_name(name: str) -> str:
    # KS-TRACE: S1.2-NORMALIZE | requirement: PEP 503 normalization so
    # requirements.txt casing/separator differences ("Pillow", "pillow",
    # "PIL_lo-w") match installed distribution metadata consistently
    # | test: test_normalize_dist_name
    return re.sub(r"[-_.]+", "-", name).lower()


# KS-TRACE: S4.2-DEFECT-YAML-BRIDGE | requirement: fix
# test_bridge_handles_distribution_import_name_mismatch failing at
# release-gate time (v0.1.0 pipeline, 2026-07-04) | root cause: this
# session's Session 1.2 docstring ("Assumptions" above) already logged
# that packages_distributions()-based resolution "may be wrong for
# packages whose import name differs unpredictably from their
# distribution name ... when packages_distributions() doesn't know about
# them" -- i.e. when the distribution is NOT actually installed in the
# environment running the KB builder. That is exactly the "dependency-
# not-installed" case this tool exists to detect, so the previous
# behavior was worse than a test-only inconvenience: a customer whose
# requirements.txt pins "PyYAML" (not installed) and whose code does
# `import yaml` would silently never be checked at all, because the
# fallback (`_normalize_dist_name("pyyaml").replace("-", "_")` ==
# "pyyaml", not "yaml") never matches the alias actually bound in code --
# a false NEGATIVE on the not-installed case for every well-known
# name-mismatched package. Fixed with a small static table of known
# distribution -> import-name mismatches, consulted only as a fallback
# AFTER the dynamic (real, installed-package-derived) reverse_map has had
# its chance -- so a real installed environment's own metadata always
# wins, and this table only fills the gap when nothing is installed to
# ask. Not exhaustive by design (adding entries is safe and additive,
# never a behavior-breaking change) | assumption: this table only needs
# to cover well-known cases; an unlisted mismatch for an actually-
# uninstalled package still falls back to the previous best-effort
# normalized guess, same as before this fix | test:
# test_bridge_handles_distribution_import_name_mismatch,
# test_resolve_import_name_static_fallback_used_when_not_installed,
# test_resolve_import_name_prefers_dynamic_map_over_static_fallback,
# test_resolve_import_name_property_always_returns_nonempty_string
_KNOWN_DIST_TO_IMPORT_NAME_MISMATCHES: dict = {
    "pyyaml": "yaml",
    "beautifulsoup4": "bs4",
    "pillow": "PIL",
    "protobuf": "google.protobuf",
    "python-dateutil": "dateutil",
    "pyjwt": "jwt",
    "opencv-python": "cv2",
    "scikit-learn": "sklearn",
    "msgpack-python": "msgpack",
    "python-dotenv": "dotenv",
    "pyzmq": "zmq",
    "pycrypto": "Crypto",
    "pycryptodome": "Crypto",
    "attrs": "attr",
}


def parse_requirements(text: str) -> list[dict]:
    """Parse requirements.txt content into structured requirement entries.

    KS-TRACE: S1.2-REQ-PARSE | requirement: exact name==version pins only;
    every other shape is captured, flagged, never fatal | test:
    test_parse_valid_pins, test_parse_skips_blank_and_comment_lines,
    test_parse_flags_unsupported_line_shapes, test_parse_handles_extras
    """
    entries = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue  # blank/comment-only lines are not requirement lines at all
        match = _REQ_LINE_RE.match(line)
        if not match:
            entries.append({
                "name": None, "version": None, "raw_line": raw_line,
                "line_ok": False,
            })
            continue
        entries.append({
            "name": match.group("name"),
            "version": match.group("version"),
            "raw_line": raw_line,
            "line_ok": True,
        })
    return entries


def _lockfile_hash(entries: list[dict]) -> str:
    # KS-TRACE: S1.2-CACHE-KEY | requirement: KB cache keyed by exact
    # installed version; sorted (name, version) pairs -> stable hash
    # regardless of requirements.txt line ordering, but ANY version change
    # produces a different hash | test: test_lockfile_hash_stable_ordering,
    # test_lockfile_hash_changes_with_version
    pins = sorted(
        (_normalize_dist_name(e["name"]), e["version"])
        for e in entries if e["line_ok"]
    )
    canonical = json.dumps(pins, sort_keys=True)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _resolve_import_name(dist_name: str, reverse_map: dict) -> str:
    # KS-TRACE: S1.2-IMPORT-NAME | assumption: packages_distributions() is
    # the authoritative source; normalized-name fallback is best-effort
    # | test: test_resolve_import_name_via_packages_distributions,
    #         test_resolve_import_name_fallback_normalization
    #
    # KS-TRACE: S1.2-DEFECT-003 | fix: a distribution can map to MULTIPLE
    # import names (e.g. dist "pytest" -> ["_pytest", "py", "pytest"], dist
    # "pyyaml" -> ["_yaml", "yaml"]), and list order is not guaranteed to
    # put the real public package first. Naively taking candidates[0] for
    # "pytest" silently resolved to the internal "_pytest" package (only 2
    # public names) instead of the real "pytest" module (88 public names)
    # -- a correctness bug that would make the KB report a near-empty API
    # for a real, correctly-installed dependency. Fixed with a two-tier
    # preference: (1) an exact match to the normalized/fallback name, then
    # (2) the first candidate that doesn't look private (no leading "_").
    # | test: test_resolve_import_name_prefers_exact_match_over_internal,
    #         test_resolve_import_name_prefers_public_over_underscored
    normalized = _normalize_dist_name(dist_name)
    fallback = normalized.replace("-", "_")
    candidates = reverse_map.get(normalized)
    if not candidates:
        # KS-TRACE: S4.2-DEFECT-YAML-BRIDGE | the dynamic map has nothing
        # (package not actually installed) -- consult the static
        # known-mismatch table before giving up on the normalized guess.
        # See _KNOWN_DIST_TO_IMPORT_NAME_MISMATCHES's own KS-TRACE above.
        return _KNOWN_DIST_TO_IMPORT_NAME_MISMATCHES.get(normalized, fallback)
    for c in candidates:
        if c == fallback or _normalize_dist_name(c) == normalized:
            return c
    public_candidates = [c for c in candidates if not c.startswith("_")]
    if public_candidates:
        return public_candidates[0]
    return candidates[0]


def _build_reverse_map() -> dict:
    reverse: dict = {}
    try:
        forward = importlib_metadata.packages_distributions()
    except Exception:
        return reverse
    for import_name, dist_names in forward.items():
        for dist_name in dist_names:
            key = _normalize_dist_name(dist_name)
            reverse.setdefault(key, []).append(import_name)
    return reverse


def _get_installed_version(dist_name: str) -> Optional[str]:
    try:
        return importlib_metadata.version(dist_name)
    except importlib_metadata.PackageNotFoundError:
        return None


def introspect_module_via_subprocess(
    module_name: str, timeout: float = 10.0, extra_sys_path: Optional[list] = None,
) -> dict:
    """Run _kb_worker.py in a fresh subprocess to introspect one module.

    KS-TRACE: S1.2-SUBPROCESS-ISOLATION | requirement: a package that
    segfaults, hangs, or calls os._exit() must degrade this one module's
    entry, never crash the builder | test:
    test_subprocess_survives_hard_exit, test_subprocess_survives_infinite_loop,
    test_subprocess_survives_import_error
    """
    import os
    env = os.environ.copy()
    if extra_sys_path:
        existing = env.get("PYTHONPATH", "")
        env["PYTHONPATH"] = (
            os.pathsep.join(extra_sys_path) + (os.pathsep + existing if existing else "")
        )

    try:
        proc = subprocess.run(
            [sys.executable, str(_WORKER_SCRIPT), module_name],
            capture_output=True, text=True, timeout=timeout, env=env,
        )
    except subprocess.TimeoutExpired:
        return {
            "status": "timeout", "symbols": [], "callables": {},
            "flags": [f"introspection-timeout:{timeout}s"],
        }
    except Exception as e:  # noqa: BLE001 - launching the subprocess itself failed
        return {
            "status": "subprocess-launch-error", "symbols": [], "callables": {},
            "flags": [f"{type(e).__name__}:{e}"],
        }

    if proc.returncode != 0:
        # Negative returncode on POSIX means the child was killed by a
        # signal (e.g. SIGSEGV) -- exactly the catastrophic case this
        # subprocess boundary exists to contain.
        return {
            "status": "crashed", "symbols": [], "callables": {},
            "flags": [f"returncode:{proc.returncode}", (proc.stderr or "")[-2000:]],
        }

    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return {
            "status": "crashed", "symbols": [], "callables": {},
            "flags": ["invalid-worker-output", (proc.stdout or "")[-500:]],
        }
    return data


def build_knowledge_base(
    requirements_path,
    cache_dir=None,
    timeout_seconds: float = 10.0,
    force_rebuild: bool = False,
) -> dict:
    """Build (or load from cache) the dependency knowledge base.

    KS-TRACE: S1.2-ORCHESTRATION | requirement: end-to-end pipeline —
    parse requirements -> check installed version -> introspect via
    isolated subprocess -> cache by lockfile hash
    | test: test_build_knowledge_base_end_to_end_real_packages,
            test_build_knowledge_base_not_installed,
            test_build_knowledge_base_version_mismatch,
            test_cache_hit_skips_reintrospection,
            test_cache_miss_on_version_change
    """
    text = Path(requirements_path).read_text(encoding="utf-8")
    entries = parse_requirements(text)
    lockfile_hash = _lockfile_hash(entries)

    cache_path = None
    if cache_dir is not None:
        cache_path = Path(cache_dir) / f"{lockfile_hash}.json"
        if cache_path.exists() and not force_rebuild:
            return json.loads(cache_path.read_text(encoding="utf-8"))

    reverse_map = _build_reverse_map()
    modules = {}

    # KS-TRACE: S1.2-DEFECT-004 | fix: a requirements.txt listing the same
    # package twice with different pins (e.g. a merge artifact or manual
    # editing mistake) was silently overwritten in modules[name] with no
    # trace of the conflict -- a real "resolved environment" should not
    # have this, but the builder must not pretend it didn't happen. Now
    # detected up front and surfaced as a flag on the surviving (last-wins,
    # for determinism) entry instead of silently vanishing.
    # | test: test_duplicate_requirement_entry_is_flagged_not_silent
    seen_versions: dict = {}
    for entry in entries:
        if entry["line_ok"]:
            key = _normalize_dist_name(entry["name"])
            seen_versions.setdefault(key, []).append(entry["version"])

    for entry in entries:
        if not entry["line_ok"]:
            key = entry["raw_line"].strip() or "<blank>"
            modules[key] = {
                "requested_version": None, "installed_version": None,
                "status": "unsupported-requirement-line",
                "symbols": [], "callables": {}, "flags": [entry["raw_line"]],
            }
            continue

        name, version = entry["name"], entry["version"]
        dup_flag = []
        prior_versions = seen_versions.get(_normalize_dist_name(name), [])
        if len(prior_versions) > 1:
            others = [v for v in prior_versions if v != version]
            dup_flag = [f"duplicate-requirement-entry: last pin wins ({version}); "
                        f"also requested: {sorted(set(others))}"]

        installed_version = _get_installed_version(name)

        if installed_version is None:
            modules[name] = {
                "requested_version": version, "installed_version": None,
                "status": "not-installed",
                "symbols": [], "callables": {}, "flags": dup_flag,
            }
            continue

        if installed_version != version:
            modules[name] = {
                "requested_version": version, "installed_version": installed_version,
                "status": "version-mismatch",
                "symbols": [], "callables": {}, "flags": dup_flag,
            }
            continue

        import_name = _resolve_import_name(name, reverse_map)
        result = introspect_module_via_subprocess(import_name, timeout=timeout_seconds)
        result = dict(result)
        result["flags"] = list(result.get("flags", [])) + dup_flag
        modules[name] = {
            "requested_version": version,
            "installed_version": installed_version,
            **result,
        }

    kb = {"lockfile_hash": lockfile_hash, "modules": modules}

    if cache_path is not None:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(kb, indent=2, sort_keys=True), encoding="utf-8")

    return kb

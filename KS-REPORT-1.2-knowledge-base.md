# Keystone Report — Session 1.2: Dependency Knowledge Base Builder

**Project:** FixProve — Milestone 1 (Core Deterministic Engine)
**Session:** 1.2 — Resolver Engine, second component
**Director:** Yehor
**Date:** 2026-07-04

---

## 1. Provenance

100% of the code in this delivery was AI-generated (Claude, Sonnet 5) in this session. No human edits have been applied yet. Every non-trivial block carries a `#KS-TRACE` tag. Four defects were found and fixed during Verify before this report was written (Section 3).

Files delivered (under `engine/python/`, alongside Session 1.1's `symbol_extractor.py`):
- `knowledge_base.py` — requirements parsing, distribution resolution, subprocess-isolated introspection orchestration, lockfile-hash caching (~330 lines)
- `_kb_worker.py` — the isolated subprocess worker that does the actual `import`/`dir()`/`getattr()`/`inspect.signature()` work (~130 lines)
- `tests/test_knowledge_base.py` — 32 tests (parsing, name resolution, real-package integration, cache invariant, adversarial subprocess isolation)

No new third-party dependencies: both modules import stdlib only.

## 2. Verification Summary

| Check | Tool | Result |
|---|---|---|
| Unit + integration + adversarial tests | pytest 9.1.1 | **32/32 passed** |
| Dependency footprint | manual review | `knowledge_base.py` and `_kb_worker.py` import stdlib only (`hashlib`, `json`, `re`, `subprocess`, `sys`, `importlib`, `inspect`, `pathlib`, `typing`) — **zero third-party runtime dependencies to scan** |
| Real-package integration | pytest run against the actual installed `pytest` and `hypothesis` distributions in this environment (not mocks) | correctly resolves `pytest.fixture`, `pytest.raises`, `hypothesis.given` with signatures |
| Adversarial subprocess isolation | 5 deliberately-hostile local test modules (hard exit, infinite loop, import-time exception, raising module `__getattr__`, raising `__signature__` property) | **builder survived all 5 without crashing**, each degraded to the correct flagged status |
| Cache invariant | direct test of hash stability under reordering + hash change under version bump + sabotaged-introspection cache-hit test | **passed** |

No test in this suite should be read as "should work." Every claim above is backed by a named test in `test_knowledge_base.py`.

## 3. Defects Caught and Fixed

### DEFECT-003 — Import-name resolution silently picked an internal/wrong module
- **Symptom:** For the real, currently-installed `pytest` distribution, `build_knowledge_base` reported only 2 public symbols (`__version__`, `version_tuple`) instead of the real ~88 (`fixture`, `raises`, `mark`, `MonkeyPatch`, ...).
- **Root cause:** `importlib.metadata.packages_distributions()` maps the `pytest` distribution to **three** import names: `["_pytest", "py", "pytest"]` (its dist-info RECORD legitimately covers the internal `_pytest` implementation package as well as the public `pytest` one). The original code took `candidates[0]`, which happened to be `_pytest` — a real, importable, but internal-by-convention module with almost no public surface. `hypothesis` worked only by accident: it isn't in the reverse map at all, so it fell through to the normalized-name fallback, which happened to be correct.
- **How found:** Deliberately testing against real, already-installed packages (`pytest`, `hypothesis`) rather than synthetic fixtures — matching the master build plan's own "resolves known-good symbols of pandas/requests" verification philosophy. A synthetic single-import-name test package would never have surfaced this.
- **Fix:** Two-tier preference in `_resolve_import_name`: (1) an exact match between a candidate and the normalized/fallback name (catches `pytest` -> `pytest` even among `["_pytest","py","pytest"]`), then (2) the first candidate that isn't underscore-prefixed (catches `pyyaml` -> `["_yaml","yaml"]` -> `yaml`, where no candidate matches the normalized dist name exactly).
- **Regression tests:** `test_resolve_import_name_prefers_exact_match_over_internal`, `test_resolve_import_name_prefers_public_over_underscored`, `test_resolve_import_name_via_packages_distributions_real_env` (runs against this environment's real metadata, not a mock).

### DEFECT-004 — Duplicate requirements.txt entries silently overwritten
- **Symptom:** `requirements.txt` containing the same package name twice with different version pins (a plausible merge-conflict or hand-edit artifact) silently dropped the earlier entry with no trace in the output.
- **How found:** Deliberately probing input-shape edge cases beyond the three named adversarial cases in the contract (monkeypatching), in the same spirit as Session 1.1's out-of-contract deep-recursion probe.
- **Fix:** Duplicate normalized names are detected up front; the surviving (last-wins, for determinism) entry now carries a `duplicate-requirement-entry` flag naming the version(s) it overrode, so the conflict is visible rather than silent.
- **Regression test:** `test_duplicate_requirement_entry_is_flagged_not_silent`.

### Adversarial cases that passed WITHOUT requiring a fix (verified, not assumed)
- `os._exit(1)` at import time -> subprocess killed/exited non-zero, parent reports `"crashed"`, builder continues.
- Infinite `while True: pass` at import time -> subprocess timeout enforced, parent reports `"timeout"`, builder continues.
- Plain `raise` at import time -> worker's own try/except reports `"import-error"` without needing the subprocess boundary at all.
- A module-level `__getattr__` that raises for one specific name -> that name is flagged `attr-access-failed`, excluded from `symbols`, and every other name in the module is still captured.
- A property named `__signature__` that raises when read -> that symbol is still recorded in `callables` with `"signature": null` and a `signature-unavailable` flag, rather than aborting the module.

No other defects were found during this session's Verify pass. This does not mean none exist — see Section 4.

## 4. Known Limitations (stated honestly)

- **No `.pyi`/typeshed stub parsing.** The master plan's own "HOW" line names both introspection and stub parsing; this session builds introspection only, per your explicit scope decision at Stage 1. Packages that are stub-only, or whose C-extension internals resist `inspect.signature()`, will have thinner (but honestly flagged, never fabricated) entries than a stub-aware KB would produce. This is a real capability gap, not a hidden one.
- **requirements.txt, exact `==` pins only.** `poetry.lock`, `uv.lock`, `Pipfile.lock`, version ranges (`>=`, `~=`), editable installs, and VCS URLs are all captured as `unsupported-requirement-line` and never resolved. A project using any of these exclusively would get a near-empty KB (each line flagged, nothing crashes, but nothing resolves either).
- **No automatic installation.** A dependency listed in requirements.txt but not installed (or installed at a different version) is flagged `not-installed` / `version-mismatch` with an empty symbol set — the KB does not attempt to `pip install` it. This was a deliberate security/scope decision (Stage 1 assumption), not an oversight, but it means the KB's coverage is only as good as what's already installed in the environment it runs in.
- **Import-name resolution is still best-effort in the worst case.** DEFECT-003's fix (exact-match-first, then prefer-non-underscore) resolves the two real conflicts found in this environment (`pytest`, `pyyaml`). A distribution with multiple *equally public-looking* import names and no exact match to its own normalized name (a genuinely ambiguous case) could still resolve to the wrong one. No such case was found in this environment's real packages, but none was exhaustively ruled out either.
- **POSIX-specific crash detection.** The "negative return code = killed by signal" interpretation used to label a module `"crashed"` is a POSIX convention; this was verified in the Linux sandbox this session ran in. Windows subprocess crash signaling differs, and this has NOT been verified on Windows, which matters since Yehor's own machine (and the `D:\Dev\Projects\FixProve` path) is Windows. The builder will still not *crash* on Windows (the try/except around `subprocess.run` is platform-agnostic), but the specific `"crashed"` vs. some other status label for a Windows-side hard failure is unverified.
- **No coverage.py run.** As in Session 1.1, verification relied on test count (32 passing) plus targeted adversarial probing, not a line-coverage report.

## 5. Accountability Statement

This module was built and verified by Claude under the Keystone protocol for FixProve Session 1.2. All defects found are disclosed above with exact reproduction and fix. No claim in this report exceeds what a specific named test verifies. This work has **not** been reviewed or approved by Yehor as of this report's writing.

**Signed:** _____________________ (Yehor, Director) **Date:** _____________

## 6. Methodology Note — One Suggested Improvement

Both defects this session (DEFECT-003 and DEFECT-004) were found by testing against **real installed packages and real-shaped edge cases** rather than synthetic single-purpose fixtures — DEFECT-003 in particular would not have been caught by a test fixture package with a clean one-to-one distribution-to-import-name mapping, because that's not how real, widely-used packages like `pytest` are actually packaged. Suggested improvement for Session 1.3 and beyond: whenever a resolver/KB/parser component is being verified, deliberately include at least one or two "famous" real-world packages known for irregular structure (packaging quirks, lazy `__getattr__` namespaces, C extensions, re-exports) in the adversarial test set, not just clean synthetic fixtures — real packages are where real users' hallucination-detection false negatives will actually come from.

One open item carried over from Session 1.1, still unresolved: the `engine/python/` package placement and the eventual Node/TS CLI integration path (Session 1.3) have not yet been confirmed by Yehor. This session's files were added to the same `engine/python/` location for consistency, but that placement remains open per the Session 1.1 report.

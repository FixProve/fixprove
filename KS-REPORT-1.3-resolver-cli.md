# Keystone Report — Session 1.3: Resolver + Hallucination Detection + CLI MVP

**Project:** FixProve — Milestone 1 (Core Deterministic Engine)
**Session:** 1.3 — Resolver Engine, third component + first shippable CLI
**Director:** Yehor
**Date:** 2026-07-04

---

## 1. Provenance

100% of the code in this delivery was AI-generated (Claude, Sonnet 5) in this session. No human edits have been applied yet. Every non-trivial block carries a `#KS-TRACE` tag.

Files delivered (under `engine/python/`, alongside Sessions 1.1–1.2):
- `resolver.py` — joins Session 1.1's symbol extraction against Session 1.2's knowledge base; the actual "reference set ∩ KB → unresolved = hallucination" logic (~250 lines)
- `cli.py` — `fixprove check <path>` CLI: file/directory discovery, KB build/cache, reporting, exit codes (~120 lines)
- `eval_corpus.py` — runs the labelled corpus below and computes precision/recall
- `corpus/` — 8 labelled Python files (5 true-negative "clean," 3 true-positive "hallucinated") + `requirements.txt` + `manifest.json` of expected findings
- `tests/test_resolver.py` (19 tests), `tests/test_cli.py` (10 tests, including the corpus precision/recall check)

No defects were found requiring a fix this session — see Section 3 for what was deliberately probed and passed clean on the first implementation.

## 2. Verification Summary

| Check | Result |
|---|---|
| Unit tests (resolver + CLI) | **29/29 passed** |
| Full engine regression (Sessions 1.1 + 1.2 + 1.3 together) | **93/93 passed**, zero regressions |
| Labelled corpus precision/recall | **precision = 1.0, recall = 1.0, F1 = 1.0** (3 true positives, 0 false positives, 0 false negatives) — see `corpus/manifest.json` for exact expected findings |
| Named acceptance-criteria cases | `pd.read_exel` (typo) caught; `import fastapi_helpers_fake` (not installed) caught; both against the REAL, installed `pandas` 2.3.3 |
| Re-exported symbol adversarial case | `requests.get` (defined in `requests.api`, re-exported at top level) correctly NOT flagged, verified against the real installed `requests` 2.34.2 |
| Degraded-KB false-positive protection | End-to-end test against a genuinely pip-installed local package (`fp-monkeypatch-demo`, hard-exits at import time exactly like Session 1.2's adversarial fixture) — a real, undetectable-by-us hallucinated call into it (`something_that_might_not_exist()`) is correctly NOT flagged, proving the locked Stage-1 decision holds through the full CLI pipeline, not just in KB isolation |
| Determinism | repeat-run equality tests at both the resolver and CLI level; corpus eval is itself run inside the test suite |
| Performance | warm-cache check step: **0.05s** on the smoke/corpus projects (target: <5s); cold KB build (separate, unbudgeted per the locked Stage-1 decision): ~1.3s for 4 dependencies |
| Robustness | a file with a genuine Python syntax error does not abort the run — the rest of the files are still checked (tree-sitter's error tolerance from Session 1.1 propagates cleanly) |

## 3. Adversarial Probing (no fix required — reported for completeness, per Keystone's "don't just report the happy path" standard)

The following were deliberately tested beyond the four named contract cases and passed without needing a code change:
- **Distribution/import-name case mismatch**: a KB entry keyed `"Requests"` (capitalized, as it might appear verbatim in a requirements.txt) correctly bridges to `import requests` in code, via Session 1.2's PEP-503 normalization reused in `build_import_name_bridge`.
- **stdlib `from`-imports**: `from os import path` is correctly never checked/flagged (stdlib exclusion applies to both plain and `from`-imports).
- **Syntax-error resilience**: a file with unparseable Python does not crash the batch check; other files in the same run are still fully checked.
- **One-hop depth boundary**: `pd.io.common.get_handle(...)` is correctly left unflagged (we only have data on `pd.io` existing, not `pd.io.common`'s own attributes) — proving the single-hop scope decision fails safe (toward silence, not false positives).

Given the Keystone process's expectation that every session's adversarial pass turns something up, the honest report here is: three prior sessions' worth of already-hardened building blocks (Session 1.1's traversal/overlap-rule fixes, Session 1.2's import-name-resolution and subprocess-isolation fixes) meant this session's NEW code — which is comparatively thin glue logic joining two already-verified components — held up under the same style of adversarial probing without needing a fix. This is reported plainly rather than manufacturing a defect narrative that didn't happen.

## 4. Known Limitations (stated honestly)

- **Undeclared dependencies are out of scope.** A real, installed package referenced in code but never mentioned in requirements.txt (e.g. `numpy` used without being pinned) is silently unchecked — not flagged, not verified. This was a scope decision (Stage 1, this session) to avoid stdlib false positives and unscoped live-install-checking, not an oversight, but it means the resolver's blind spot for "undeclared dependency" hallucinations is intentional and real.
- **One-hop resolution depth only.** `pd.read_excel` is checked; `pd.io.common.get_handle` is not (see Section 3). Deeper hallucinations inside submodule chains will not be caught. Protects zero-false-positives at the cost of recall on deep chains.
- **No scope/type awareness.** A name reused for different purposes in different functions, or shadowing an import with a local variable of the same name, is not distinguished — the alias map is file-global, not scope-aware. This is a known static-analysis simplification, consistent with "no type inference" being explicitly out of scope.
- **Degraded-KB entries are never flagged, by design — but this includes real hallucinations we simply can't see.** If a project depends on a package that happens to crash/timeout during introspection, ANY reference into that package (real API or hallucinated) is silently passed. This is the direct, accepted cost of the locked zero-false-positive priority — verified end-to-end in Section 2, not just asserted.
- **Cold-cache CI performance is unresolved, not solved.** The <5s target was explicitly scoped to warm-cache runs only (locked at Stage 1). A genuinely cold CI container (no prior `.fixprove_cache`) would pay the full KB-build cost (~1.3s for 4 packages in this session's corpus; scales with dependency count and subprocess-launch overhead) on every run unless a caching strategy across CI runs is built later — flagged, not addressed, this session.
- **Corpus is synthetic but built on real dependencies.** The 8 labelled corpus files are hand-written (not sourced from a real GitHub project), given sandbox constraints, but every "clean" example runs against genuinely pip-installed real packages (`pandas` 2.3.3, `requests` 2.34.2) and the degraded-package case uses a genuinely pip-installed local package that crashes exactly like Session 1.2's adversarial fixture — not mocks. A larger, real-world-sourced corpus would strengthen this further and is a natural next step.
- **`corpus/requirements.txt` is a test fixture, not the engine's own dependency list.** `engine/python/requirements.txt` (pytest, hypothesis, tree-sitter, tree-sitter-python) is unchanged — pandas/requests/fp-monkeypatch-demo are corpus-only fixtures for the precision/recall evaluation, not engine runtime dependencies.

## 5. Accountability Statement

This module was built and verified by Claude under the Keystone protocol for FixProve Session 1.3. All verification claims in Section 2 are backed by a named test or the corpus eval script's own output. No claim exceeds what was actually run. This work has **not** been reviewed or approved by Yehor as of this report's writing.

**Signed:** _____________________ (Yehor, Director) **Date:** _____________

## 6. Methodology Note — One Suggested Improvement

This session's "no defects found" result should be read with appropriate skepticism rather than as an all-clear: it likely reflects that Sessions 1.1 and 1.2 already absorbed the bulk of the adversarial hardening for their respective layers (tree-sitter traversal, subprocess introspection), and Session 1.3's genuinely new surface area (the alias-map/bridge join logic) is smaller and more mechanical. Suggested improvement: before Milestone 1's exit gate, run one dedicated adversarial session whose ONLY job is trying to break the full three-component pipeline end-to-end with inputs none of the three sessions individually anticipated (e.g. deeply nested conditional imports, `importlib.reload`, package name typosquatting patterns, mixed absolute/relative imports in a real multi-file package) — rather than assuming each component's individual adversarial pass composes safely.

Per Yehor's Session 1.3 framing, the architectural placement question from Sessions 1.1/1.2 (`engine/python/` location, Python-stays-Python decision) is now explicitly LOCKED and closed — no longer an open item.

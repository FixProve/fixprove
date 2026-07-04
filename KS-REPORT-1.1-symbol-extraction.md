# Keystone Report — Session 1.1: Deterministic Python Symbol Extractor

**Project:** FixProve — Milestone 1 (Core Deterministic Engine)
**Session:** 1.1 — Resolver Engine, first component
**Director:** Yehor
**Date:** 2026-07-04

---

## 1. Provenance

100% of the code in this delivery was AI-generated (Claude, Sonnet 5) in this session. No human edits have been applied yet — Yehor has not touched `symbol_extractor.py` or `test_symbol_extractor.py`. Every non-trivial block carries a `#KS-TRACE` tag mapping it to a requirement, an assumption (if any), and the test(s) that exercise it. Two defects were found and fixed during the AI's own Verify stage before this report was written (Section 3) — neither reached a "done" state without a failing reproduction first.

Files delivered (under `engine/python/`, a new package — see Section 6 on placement):
- `symbol_extractor.py` — the extraction engine (~340 lines)
- `tests/test_symbol_extractor.py` — 33 tests (unit + adversarial + 2 property-based)
- `requirements.txt` — pinned dependency versions

## 2. Verification Summary

| Check | Tool | Result |
|---|---|---|
| Unit + adversarial tests | pytest 9.1.1 | **33/33 passed** |
| Property-based tests (2) | Hypothesis 6.156.1, 200 examples each | **passed** |
| Dependency vulnerability scan | pip-audit, scoped to this module's 4 direct deps | **no known vulnerabilities** |
| Determinism check | repeat-parse equality + `json.dumps` byte comparison | **identical on every run**, including under Hypothesis's randomized inputs |
| Manual adversarial probing | ad hoc scripts (see Section 3) | **2 defects found, both fixed and regression-tested** |

Coverage is test-count-based, not line-based (no coverage.py run this session — noted as a limitation in Section 4). All 33 tests are enumerated in the test file; nothing was skipped or xfailed.

No test in this suite should be read as "should work." Every claim below cites the specific test that backs it.

## 3. Defects Caught and Fixed

### DEFECT-001 — Overlap-rule violation via broken identity check
- **Symptom:** For any call whose callee is a dotted attribute chain (e.g. `importlib.import_module("os")`, or `a.b().c.d()`), the callee expression was appearing in **both** `call_targets` and `attribute_chains` — a direct violation of the locked overlap rule.
- **Root cause:** `_visit_call`'s "defensive" child loop compared `id(func)` / `id(args)` (Python object identity) against `id(child)` for nodes obtained via `node.children`. tree-sitter's Python bindings do not intern/cache `Node` wrapper objects — re-fetching the same underlying AST node via a different accessor returns a new Python object with a different `id()`. The identity check therefore never matched, so the "defensive" loop silently re-visited the callee with `suppress_attr=False` and double-recorded it.
- **How found:** Manually running the extractor against the Stage-1 adversarial fixture (mixed imports, dotted calls, chained calls) and diffing `call_targets` against `attribute_chains` for overlap — caught immediately, before any test was written to hide it.
- **Fix:** Replaced `id(node)` comparisons with `node.id`, the stable identifier tree-sitter exposes for the underlying C node pointer. Confirmed via direct comparison (`id(a) == id(b)` → `False`, `a.id == b.id` → `True` for the same node fetched two ways).
- **Regression tests:** `test_no_duplicate_visit_via_defensive_loop`, `test_dotted_call_excluded_from_attribute_chains`, `test_nested_call_in_attribute_object_no_duplicate`, `test_decorator_call_recorded_once_not_duplicated`.

### DEFECT-002 — RecursionError on deep attribute/call chains
- **Symptom:** `extract_symbols` raised `RecursionError: maximum recursion depth exceeded` on a source file containing a ~2000-level-deep attribute chain (`a.b.b.b...`). A crash is a determinism-invariant violation — there is no deterministic JSON output if the function raises.
- **Root cause:** The original traversal (`_visit`) was native Python recursion — one call-stack frame per AST nesting level. Python's default recursion limit (1000) is easily exceeded by generated, obfuscated, or deeply chained builder-pattern code, which is plausible input for a tool meant to run over arbitrary real-world repositories.
- **How found:** Deliberate adversarial stress test (`'a' + '.b' * 2000`), run specifically to probe the traversal's robustness beyond the three adversarial cases named in the original contract.
- **Fix:** Rewrote the traversal as an explicit-stack (iterative) walk (`_Extractor.run`, `_push_call`, `_push_attribute`), preserving the exact same pre-order visiting sequence (verified: all pre-existing tests still pass unchanged) but bounded only by heap memory, not call-stack depth.
- **Verification:** Stress-tested at depths 500 / 2000 / 10,000 — all succeed with correct single-entry output. Regression test `test_deep_attribute_chain_no_recursion_error` locks in depth 5000.

No other defects were found during this session's Verify pass. This does not mean none exist — see Section 4.

## 4. Known Limitations (stated honestly)

- **No line-coverage measurement.** Verification relied on test count (33 passing, including 2 property-based tests with 200 generated examples each) and targeted adversarial probing, not a coverage.py report. Untested code paths may exist, particularly around rare tree-sitter grammar nodes (e.g. `type_arguments` in generic calls, match-statement patterns, f-string internals) that were not explicitly exercised.
- **`importlib.import_module(...)` and other non-`__import__` dynamic-import mechanisms are NOT flagged as imports.** Only the contract-specified `__import__(...)` is special-cased. `importlib.import_module` appears solely as an ordinary `call_targets` entry. This was a deliberate scope decision, not an oversight — but it means a resolver built on this engine's output will not "see" that class of dynamic import as import-shaped data.
- **Purely syntactic — no alias resolution.** `import numpy as np` followed later by `np.array(...)` will show `call_targets: ["np.array"]`, not `numpy.array`. Any consumer needing real module resolution must join `imports[].alias` against `call_targets`/`attribute_chains` itself; this engine does not do that join.
- **No diff/patch input support.** Explicitly out of scope for this session per the locked contract — deferred to a future CLI/ingress-layer session (Session 1.3 per the master build plan).
- **Environment note (non-functional):** during this session, the sandbox's mounted view of this output directory intermittently returned stale/truncated reads of a file immediately after it was written. All development and testing was done against a separately-verified copy to route around this; the delivered files were confirmed correct via direct read after the fact. This is an environment quirk, not a defect in the deliverable, but it's recorded here for transparency since it affected how this session was executed.

## 5. Accountability Statement

This module was built and verified by Claude under the Keystone protocol for FixProve Session 1.1. All defects found are disclosed above with the exact reproduction and fix. No claim in this report exceeds what a specific named test verifies. This work has **not** been reviewed or approved by Yehor as of this report's writing — it awaits his review and sign-off before being considered closed.

**Signed:** _____________________ (Yehor, Director) **Date:** _____________

## 6. Methodology Note — One Suggested Improvement, and One Open Decision for Yehor

**Suggested process improvement:** This session's contract-first stop (four clarifying questions before writing code) was valuable and caught real ambiguities (output shape, line-indexing, overlap semantics) that would have been expensive to unwind after downstream sessions started depending on a wrong schema. The gap it exposed: the two defects above were found through **ad hoc manual adversarial scripting**, not a pre-declared adversarial checklist. Suggested improvement: maintain a standing "adversarial checklist" file per component category (parsers, API clients, state machines) that gets consulted and extended every session — turning "did we get lucky probing this time" into "did we run the checklist."

**Open architectural decision — package placement (flagging per the standing rule to get explicit approval before closing an architectural decision):** The rest of this monorepo (`cli/`, `app/`, `web/`) is a pnpm/TypeScript workspace; this session's deliverable is Python, per the master build plan's own Session 1.1 spec. There was no existing home for non-JS engine code, so I created `engine/python/` at the repo root (not added to `pnpm-workspace.yaml`, since it isn't a JS package) as the most conservative, easily-relocatable placement — mirroring the master plan's own parallel-language framing ("Shares the deterministic core + output schema with the Python path," anticipating a `engine/typescript/` sibling in Session 1.4). **This placement is not yet confirmed by Yehor.** It also raises a real forward question for Session 1.3 (the `fixprove check` CLI, which is a Node/TypeScript package per `cli/package.json`): how does the Node CLI invoke this Python engine — subprocess shell-out, a packaged Python runtime bundled with the npm install, or a future rewrite? That's explicitly a Session 1.3 concern, not this session's, but it's flagged now so it isn't a surprise later.

# KS-REPORT-4.4 — TypeScript B5 Live Verify and v0.1.5 Release

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode
**Scope:** First live B4/B5 execution against a real TypeScript/MDX repository (`yehorcallmedai-maker/yehor.ai`), carried forward from Session 4.3's Python-only B5 pass against `autonomous-core`. Covers: re-verifying the GitHub App installation, pushing the corrected Action template, opening and iterating a seeded-hallucination test PR, one real code fix found and shipped mid-session (Defect A), a live `v0.1.5` PyPI+npm release required to make that fix take effect, and two further real defects found and explicitly scoped out for a future session (Defects B and C).

---

## 1. Provenance

All code changes this session (the `ts_knowledge_base.py` parser fix, its five new unit tests, the version bump in `engine/python/pyproject.toml` and `cli/package.json`, and the two seeded-test-file revisions in `yehor.ai`) were AI-generated, then reviewed and approved by Yehor in real time before each commit. Every git commit, tag, and push — on both `FixProve/fixprove` and `yehorcallmedai-maker/yehor.ai` — was executed by Yehor from his own machine; no push credentials exist in this session's sandbox for either repository (confirmed: `git fetch` against `yehor.ai` fails with "could not read Username," consistent with prior sessions' findings). All architectural scoping decisions (fixing Defect A now vs. deferring Defects B and C) were AI-proposed with explicit root-cause tracing and Yehor-approved before any code was written, per the standing sign-off rule. The version-number correction (`0.1.1` → `0.1.5`, after discovering `v0.1.1`-`v0.1.4` already existed as tags) was an AI-caught defect, corrected before any tag was pushed, not after a failed push.

## 2. Verification summary

- **Automated tests:** 190/190 passing in the Python engine suite after Defect A's fix (`python3 -m pytest` from `engine/python/`), including 5 new tests targeting the exact defect (bare export-list parsing: plain list, aliased list, type-only list, empty-list regression guard, and an end-to-end `build_package_entry` test reproducing the real `resend`-shaped bundle). No regressions in the other 185 pre-existing tests.
- **Release pipeline:** `v0.1.5` tag push triggered `release.yml`'s full gate (test → artifact-content verification → parallel PyPI Trusted Publish + npm publish) — completed green in 2m46s per GitHub's own Actions UI.
- **Independent live verification (not just CI's own report):** queried both registries directly. `https://pypi.org/pypi/fixprove/0.1.5/json` → `version: 0.1.5`, uploaded `2026-07-08T16:53:46`. `https://registry.npmjs.org/fixprove/0.1.5` → `version: 0.1.5`, resolvable tarball URL. This is the first real npm publish with an actual version bump in this project's history (all prior npm publishes were the original `0.1.0` seed, per Session 4.2).
- **Live seeded-PR verification, first run** (`yehor.ai#1`, commit `0119e44`, check run `85907180130`, engine `0.1.0` — before Defect A's fix was live): Check Run `failed`, but for the wrong reasons — 12 false positives on real, valid, in-production imports (`resend.Resend`, five `react` hooks/types, `@privy-io/react-auth`'s `PrivyProvider`/`usePrivy`/etc.), and the actual seeded hallucination (`resend.emails.sendBulkWithRetry`, an instance-method call) was not among them at all — a false negative. Root-caused before any fix was written (see Section 3).
- **Live seeded-PR verification, second run** (`yehor.ai#1`, commit `c4724dc`, check run `85931030080`, engine `0.1.5` — after Defect A's fix was live and the seeded hallucination was revised to match the resolver's actual scope): Check Run still `failed`, but now correctly and exclusively for `resend.notARealExport` within `scripts/fixprove-seed-test.ts` at the import-statement level, exactly as seeded — `resend.Resend` and every `@privy-io/react-auth` false positive from the first run are gone. The 8 remaining findings are all `react` named imports (Defect C, found on this run, not fixed this session).
- **Tools used:** direct source reading of `ts_knowledge_base.py`/`ts_resolver.py` to trace root cause (not guessed at from symptoms alone), `tree_sitter_typescript` grammar inspection via the real installed `.d.ts` files (`resend`, `@privy-io/react-auth`, `@types/react`) to confirm each hypothesis against real package shapes before writing any fix, `pytest` for local verification, direct PyPI/npm registry HTTP queries for live-infrastructure verification, GitHub's Checks UI (via browser automation) for both seeded-PR runs.

## 3. Defects caught and fixed (specific, not summarized)

### Defect A — Bare `export { A, B, C };` list silently dropped from the knowledge base

**Symptom:** First live seeded-PR run against `yehor.ai` flagged `resend.Resend`, `@privy-io/react-auth`'s `PrivyProvider`/`usePrivy`/three more, and five `react` hooks/types as "unresolved symbol" — all real, valid, in-production imports, none of them hallucinated.

**Root cause:** `ts_knowledge_base.py`'s `_parse_export_statement()` only recognized four export shapes: `export {...} from "mod"` (re-export), `export default X`, `export = X`, and a single inline declaration (`export interface Foo {...}`). A bare `export { A, B, C };` — re-exporting names already declared elsewhere in the same file via `declare class/function X {...}`, with no inline `export` keyword on the declaration itself — matched none of these. It fell through to the inline-declaration fallback, which expects one declaration node, not an `export_clause` of `export_specifier`s; the names were silently never added to `exported_names`. Confirmed as a real, common shape: both `resend` and `@privy-io/react-auth`'s bundled `.d.ts` files use exactly this pattern (a `tsup`/`rollup-plugin-dts`-style bundler output convention), not a synthetic edge case.

**Fix:** Added a dedicated branch in `_parse_export_statement()` recognizing a bare `export_clause` (no `from`) and adding each specifier's external-facing name (the alias if `as` is used) to `exported_names`. Handles `export { X }`, `export { X as Y }`, and `export type { X }` uniformly.

**Verified by:** 5 new unit tests (full engine suite 190/190 passing) plus live re-verification against real, unmodified `resend`/`@privy-io/react-auth` packages on the second seeded-PR run — `resend.Resend` and all `@privy-io/react-auth` findings cleared, with no change to those packages' own files. Confirms the fix generalized correctly to a second, independent real package, not just the one it was written against.

**Operational complication surfaced by this fix:** the live CI workflow installs `fixprove` from PyPI (`pip install fixprove`), not from source — so the fix, though correct locally, had no live effect until a new version was actually published. Required cutting `v0.1.5` (see Section 2). Discovered and flagged to Yehor *before* attempting to re-verify, not after a confusing "the fix didn't work" re-run.

---

### Defect B — Resolver cannot trace a `new NamedImportClass(...)` instance back to its import (scoped out, not fixed)

**Symptom:** The original seeded hallucination, `resend.emails.sendBulkWithRetry(...)` — a call on `resend`, a local variable assigned via `const resend = new Resend(...)` — was never flagged, on either live run.

**Root cause:** `ts_resolver.py`'s Pass B (`check_source`) only checks member-access chains rooted at a binding of kind `default_import` or `namespace_import` (the `axios.get(...)` shape it was built and tested against). `Resend` here is a `named_import`; the local variable `resend` it gets assigned to via `new Resend(...)` is never added to `alias_map` at all (which is built solely from `extracted["imports"]`, not from variable declarations). The chain is structurally invisible to Pass B — not a narrow bug, but a scope gap: the resolver currently cannot catch a hallucinated method on any class instance created via `new` from a named import, arguably a very common OOP usage pattern in real TS/JS.

**Decision (Yehor's explicit sign-off, this session):** not fixed tonight. This is a real architectural extension — tracking local-variable-to-import bindings through `new` expressions — not a quick patch, and the session had already run long with two other live-infrastructure actions completed. Instead, the seeded PR's hallucination was revised to a pattern within the resolver's current, actually-supported scope (a hallucinated named import, checked by Pass A) so B5 could still produce a meaningful signal on Defect A's fix tonight. Logged here as the explicit mandate for a dedicated future session.

---

### Defect C — `@types/react`'s `export = Namespace` shape still false-positives every hook import (found this session, not fixed)

**Symptom:** After Defect A's fix went live, the second seeded-PR run still showed 8 false positives — every one a `react` named import (`useEffect`, `useState`, `Component`, `ReactNode`, `FormEvent`) in real production files (`app/error.tsx`, `components/CaseStudyShell.tsx`, `components/sections/AccessSection.tsx`, `components/sections/AccessSectionGate.tsx`).

**Root cause:** `@types/react/index.d.ts` uses a third, distinct export shape from either Defect A's bundle pattern or the two already-modeled cases: `export = React;` at module level, where `React` is a `declare namespace React { ... }` containing these names as un-prefixed namespace members (confirmed directly by reading the installed `.d.ts`: `export = React;` / `export as namespace React;` at lines 67-68, `function useState(...)` / `class Component<P, S>` / `type ReactNode` / `interface FormEvent` all declared inside the namespace without individual `export` keywords). TypeScript's real resolution treats namespace members as valid named-import targets when a module does `export = NamespaceName` — a UMD-global-style interop pattern this KB has never modeled. `default_ref`/`export =` handling in `ts_knowledge_base.py` only ever populates `default_export_symbols` (for default-import member access); it has no path that flattens a namespace's own members into `exported_names` for named-import checks.

**Decision (Yehor's explicit sign-off, this session):** not fixed tonight, same class of reasoning as Defect B — a real architectural extension, not a quick patch. Flagged as arguably the highest-impact of the three defects found this session: `import { useState } from "react"` (or any of its sibling hooks/types) is close to universal across the TypeScript ecosystem, meaning this defect would false-positive on the overwhelming majority of real-world React/TS codebases as they stand today. Logged as the second explicit mandate for the same dedicated future session as Defect B.

---

**Non-code finding — tag/version history collision:** `git tag -l "v*"` on `FixProve/fixprove` showed `v0.1.1` through `v0.1.4` already existed before this session touched anything — used purely to retrigger the release workflow during Session 4.2's iterative debugging, while `pyproject.toml`'s `version` field stayed at `0.1.0` the entire time (explaining Session 4.2's log statement that "`fixprove 0.1.0` is now confirmed live" despite iterating through four different tag names). Caught before the first `git tag v0.1.1` attempt failed (`fatal: tag 'v0.1.1' already exists`) turned into a wasted push; corrected to `v0.1.5`, the first genuinely unused version, before any further action. Also surfaced two broken/orphaned tag refs (`v0.1.4.lock.bak.*`, `v0.1.4.bak.1783353789`) — plausibly the same class of mount-lock corruption already documented for `.git/index.lock`, now apparently affecting tag refs too. Not investigated or cleaned up this session; flagged for Yehor's attention given the standing "never force-move an existing git tag" rule.

## 4. Known limitations (stated plainly)

1. **TS/JS is not general-availability-ready.** Defects B and C are both real, live-verified gaps, not hypothetical: any TypeScript codebase using `new SomeImportedClass()` (Defect B) will have hallucinated instance methods silently missed, and any codebase using React (or any other package with an `export = Namespace` shape) will get false positives on legitimate named imports (Defect C). Both must be addressed before this pipeline should be represented as reliable for TypeScript in general, as distinct from Python (where `autonomous-core#3` achieved a fully clean pass in Session 4.3).
2. `yehor.ai#1` still shows Check Run conclusion `failed` overall as of session close — correctly, due to Defect C's 8 remaining false positives, even though the seeded hallucination itself is now caught correctly and exclusively. B5 on this repo has not yet reached the fully clean bar `autonomous-core#3` already cleared.
3. `npm --provenance` remains removed from `release.yml`'s `publish-npm` job (carried forward from Session 4.2) — must be restored before the D2 public-repo flip.
4. The broken/orphaned tag-ref artifacts noted above are unexplained and untouched.
5. All previously-carried-forward items not touched this session remain open (see the session log's Section 4 for the full list): PyPI Trusted Publisher's original rejection never conclusively root-caused, `ci.yml` not running the Python suite on regular pushes, `push`-event Check Run correlation unimplemented, `npx wrangler` on 3.114.17, untracked `logo/` directory uninvestigated.
6. This session confirmed a previously-logged mount-reliability limitation firsthand: an `Edit` tool call on `SESSION-LOG-INDEX.md` reported success while `bash`'s own `wc -l`/`tail`/`grep` immediately showed the old, unedited content — resolved by re-reading via the `Read`/`Grep` tools (which showed the edit had, in fact, correctly applied) rather than trusting `bash`'s stale view. No data was lost; this is a read-staleness issue, not a write-corruption one, and matches the already-documented `feedback_fixprove_mount_write_quirks` pattern rather than being a new defect class.

## 5. Accountability statement

Reviewed and directed in real time throughout by: Yehor Kaliberda (approved the fix-A-now/scope-B-and-C-later decision, the seeded-hallucination redesign, the v0.1.5 release, and this wrap-up protocol explicitly, at each respective decision point this session).

Final document review: pending Yehor's read of this report before commit/push.
Signed: Yehor Kaliberda
Date: 08.07.26

## 6. Methodology note — one suggested improvement to the process itself

Both live seeded-PR runs this session produced a *complete* symptom picture in a single shot — a list of every unresolved symbol, not just the first one — because `ts_resolver.py`'s `check_source` collects findings across the whole file/repo rather than stopping at the first flag. That completeness is exactly what made Defect C visible immediately after Defect A's fix landed, instead of requiring a third live run to discover it one defect at a time. Worth deliberately preserving as a design principle for any future resolver work (Defects B/C included): a partial, first-match-only signal would have cost this session at least one more full release-and-reverify cycle (each costing several real minutes of live Actions runtime, not free) to surface the same information.

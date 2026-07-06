# Keystone Report — Session 4.2: Release-Gate Fix and Live Publish (v0.1.0 → v0.1.4)

**Project:** FixProve — Milestone 4 (Live Deployment)
**Session:** 4.2 — Root-cause and fix the Python test-gate failures that blocked the `v0.1.0` release pipeline; carry the fix through repeated real pipeline runs until both PyPI and npm are genuinely, verifiably live.
**Director:** Yehor
**Date:** 2026-07-06

---

## 1. Provenance

100% of the diagnostic work, code, and workflow changes in this session are AI-generated (Claude, Sonnet 5). Every commit below was reviewed and explicitly approved by Yehor before being applied; every `git push` was executed by Yehor personally from his own machine (no push credentials exist in the AI's sandbox — this is a standing constraint, not a one-off).

**Files delivered/modified this session, across five commits:**

| Commit | Tag | Change |
|---|---|---|
| `612b525` | `v0.1.1` | `engine/python/knowledge_base.py` — static distribution→import-name fallback table (`_KNOWN_DIST_TO_IMPORT_NAME_MISMATCHES`); `tests/test_knowledge_base.py` — 3 regression tests + 1 hypothesis property test; new `engine/python/corpus/local_fixtures/fp-monkeypatch-demo/` package + `corpus/NOTES.md`; `.github/workflows/release.yml` — install real corpus-eval fixture dependencies before `pytest` |
| `206b094` | `v0.1.2` | `.github/workflows/release.yml` — added `contents: read` to `publish-pypi`/`publish-npm` job permissions (both jobs had only `id-token: write`, which silently zeroed default permissions) |
| `1d2670d` | `v0.1.3` | `engine/python/pyproject.toml` — removed a literal comma from the `[project.urls]` label (PyPI's Project-URL field is comma-delimited); `.github/workflows/release.yml` — removed `--provenance` from the npm publish step (requires a public source repo; this one is deliberately private pre-D2) |
| `dce076c` | `v0.1.4` | `engine/python/pyproject.toml` — shortened the same label from 35 to 20 characters (PyPI enforces a 32-character Project-URL label limit) |
| *(this report)* | — | This document, rewritten to cover the full session per Yehor's explicit request |

**Architectural decisions made this session (logged as they happened, each with Yehor's explicit sign-off before the triggering commit/tag/push):**

1. **Static fallback table vs. pinning PyYAML as a test dependency** (v0.1.1). Rejected the narrower fix (just installing PyYAML so the test passes) because it would fix the test without fixing the real gap: a customer with an uninstalled, name-mismatched dependency would never get a "dependency-not-installed" finding. The static table only activates when the dynamic, real-environment resolution has nothing to say, and never overrides real installed-package data (verified by a dedicated test).
2. **New local fixture package (`fp-monkeypatch-demo`) rather than a real hard-exiting third-party package** (v0.1.1). No real PyPI package reliably hard-exits at import time on demand; built as a proper local `pyproject.toml` package mirroring the already-established `ts_corpus/local_fixtures/` pattern.
3. **Drop `npm --provenance` rather than delay the npm release or flip the repo public early** (v0.1.3, Yehor's explicit decision). Rationale, in Yehor's own words: live end-to-end testing of the GitHub Action template on private test repos could not wait, and prematurely flipping the repo public would short-circuit the deliberate, separate D2 launch decision. Logged as a temporary, explicitly-approved trade-off with a standing requirement to restore `--provenance` immediately before the D2 public flip — this is carried forward as an open item (Section 4).
4. **PyPI Trusted Publisher entry: delete-and-recreate rather than debug the existing entry** (external action, between v0.1.1 and v0.1.2). The existing entry's fields *appeared* correct in a clear screenshot (`FixProve/fixprove`, `release.yml`, `pypi`) but PyPI still rejected the OIDC exchange as an invalid-publisher mismatch. Root cause was never conclusively identified (most likely invisible whitespace from a prior paste); resolved pragmatically by having Yehor delete the entry and retype it fresh rather than continuing to debug a config that looked correct. This is logged honestly as an unresolved root cause, not a false claim of full diagnosis.

## 2. Verification Summary

This session had two distinct verification phases with two different kinds of evidence, and neither should be mistaken for the other:

**Phase A — local/sandbox verification (v0.1.1's code changes, before any pipeline run):**

| Check | Result |
|---|---|
| Root cause reproduced in an isolated sandbox (fresh venv, no prior cache/`node_modules`) | Confirmed both failures independently, before any fix: yaml-bridge test fails deterministically (`assert None == 'pyyaml'`); corpus eval reproduces the exact reported numbers — precision 0.143 (Python), 8 false positives (TS) |
| Full Python test suite, fully clean environment | 185/185 passed (181 pre-existing + 4 new) |
| `eval_corpus.py` / `eval_ts_corpus.py`, fresh environment | precision = recall = f1 = 1.0 on both corpora |
| Real `python -m build` (sdist + wheel), fresh environment | No leakage of `tests/`, `corpus/`, `ts_corpus/`, eval scripts, or cache dirs |
| `pip-audit` against the new dependency set | 0 known vulnerabilities |
| Property-based test (`hypothesis`, 200 examples) on `_resolve_import_name` | Never raises, never returns an empty/falsy import name |

**Phase B — live infrastructure verification (v0.1.1 through v0.1.4, real GitHub Actions / PyPI / npm):**

This is the phase that actually matters for "is the release pipeline fixed," and it is also the phase that repeatedly proved Phase A insufficient on its own — every single defect in Section 3 below (the permissions bug, the Trusted Publisher mismatch, the npm 2FA gap, the comma bug, the provenance/visibility conflict, the label-length limit) was **invisible to Phase A** and only surfaced by an actual push to real infrastructure. This is the concrete case for why Keystone Stage 3 requires live verification, not just local test-suite success — a point this session's own Methodology Note (Section 6) returns to.

| Pipeline run (tag) | `test` | `verify-artifact-contents` | `publish-npm` | `publish-pypi` |
|---|---|---|---|---|
| v0.1.0 | **Failed** (the original defect) | not reached | not reached | not reached |
| v0.1.1 | Passed | Passed | Failed (checkout: missing `contents: read`) | Failed (same) |
| v0.1.2 | Passed | Passed | Failed (npm EOTP/2FA) | Failed (PyPI Trusted Publisher invalid-publisher) |
| v0.1.3 | Passed | Passed | **Passed — real publish** | Failed (comma-fixed label exceeds 32-char limit) |
| v0.1.4 | Passed | Passed | Failed (E403, see below — expected, not a defect) | **Passed — real publish** |

**External, out-of-band confirmation (not just CI's own self-report):**

- `https://pypi.org/project/fixprove/` — live page, "fixprove 0.1.0", "Released 2 minutes ago" at time of check, Project-URL label reads exactly "GitHub App (paid CI)" as committed, Repository link independently verified by PyPI ("Verified details"), Homepage/GitHub App links correctly shown as "Unverified details" (expected — PyPI only verifies the OIDC-linked source repo, not arbitrary URLs).
- `https://www.npmjs.com/package/fixprove` — live page, package present with the expected README/description content, confirming the v0.1.3 npm publish is real and persistent, not a one-time CI artifact.

**v0.1.4's `publish-npm` failure, explained (not a defect):** the exact error was `403 Forbidden ... You cannot publish over the previously published versions: 0.1.0`. This is npm's registry correctly refusing to republish an already-published version — expected, correct behavior, because the CLI's `package.json` version was never bumped between v0.1.3 (where 0.1.0 was first published successfully) and v0.1.4 (which only changed the *Python* package's `pyproject.toml`). It is documented here so it is not mistaken for a new defect in a future session, and is carried forward as an open item only in the sense that a future real npm publish attempt will need an actual version bump to test against (Section 4).

## 3. Defects Caught and Fixed (specific, not summarized)

| # | Defect | Root cause | Fix | Evidence |
|---|---|---|---|---|
| 1 | `bridge.get("yaml")` returns `None` instead of `"pyyaml"` | `_resolve_import_name`'s only source of distribution↔import-name mapping is `importlib.metadata.packages_distributions()`, which reflects only actually-installed packages. PyYAML is correctly not a runtime dependency, so this is a genuine false-negative risk for any uninstalled, name-mismatched dependency. | Static fallback table `_KNOWN_DIST_TO_IMPORT_NAME_MISMATCHES`, consulted only when the dynamic map has nothing; dynamic data always wins when present. | 185/185 tests pass; dedicated "dynamic wins" test |
| 2 | Corpus-eval precision/false-positive regression | Not resolver logic drift — the corpus eval's own fixture dependencies (`pandas`, `requests`, `fp-monkeypatch-demo`, and TS's `axios`/`lodash`) were never installed by any CI workflow, only by whatever ad hoc local environment validated Sessions 1.1–1.4. | Added explicit fixture-install steps to `release.yml`; built `fp-monkeypatch-demo` as a real, committed, buildable local package. | precision = recall = f1 = 1.0 on both corpora, fresh environment |
| 3 | `publish-pypi`/`publish-npm` fail at checkout with a misleading "repository not found" (v0.1.1, real pipeline) | Both jobs' `permissions:` blocks declared only `id-token: write`. In GitHub Actions, an explicit job-level `permissions:` block **replaces** the default permission set rather than adding to it — `contents: read` (required by `actions/checkout@v4`) silently dropped to `none`. Pre-existing since Session 3.1; invisible until v0.1.1 because these jobs had never actually executed before (v0.1.0 died earlier, at the test gate). | Added `contents: read` explicitly to both jobs' `permissions:` blocks. | Real GitHub Actions run, v0.1.2 — both jobs pass checkout |
| 4 | PyPI rejects the OIDC exchange as an invalid-publisher mismatch (v0.1.2, real pipeline) | Configuration fields *appeared* correct (`FixProve/fixprove`, `release.yml`, `pypi`) in a clear screenshot; exact root cause not conclusively identified (most likely invisible whitespace from an earlier paste). **This is the one defect this session did not fully root-cause** — logged honestly rather than papered over. | Deleted and re-created the Trusted Publisher entry on pypi.org, typed fresh rather than pasted. | Real GitHub Actions run, v0.1.3 — Trusted Publisher OIDC exchange succeeds |
| 5 | npm publish blocked by 2FA/OTP requirement in unattended CI (v0.1.2, real pipeline) | The existing `NPM_TOKEN` (`fixprove-release-ci`) was created without the "Bypass 2FA" flag, which cannot be toggled after token creation. | Generated a new npm token with "Bypass two-factor authentication" enabled, scoped to the `fixprove` package specifically (not the `@fixprove` org scope), read+write; updated the `NPM_TOKEN` GitHub secret. | Real GitHub Actions run, v0.1.3 — `publish-npm` passes |
| 6 | PyPI upload fails: `400 Bad Request: '...private-repo CI), https://fixprove.dev/app' is not a valid url` (v0.1.2, real pipeline) | PyPI's core-metadata Project-URL field is itself comma-delimited (`Label, URL`); the label `"GitHub App (paid, private-repo CI)"` contained a literal comma, so PyPI's parser split on the first comma and mis-parsed the label/URL boundary. Pre-existing since Session 3.1; invisible until the first real upload attempt (v0.1.2) — local `build`/inspect checks never validate this. | Removed the comma from the label (`,` → `+`). | Real GitHub Actions run, v0.1.3 — comma-parsing error gone (new, different error surfaced next, see #8) |
| 7 | npm publish fails: `E422 ... Unsupported GitHub Actions source repository visibility: "private". Only public source repositories are supported when publishing with provenance.` (v0.1.2, real pipeline) | `npm publish --provenance` categorically requires the source repo to be public; `FixProve/fixprove` is deliberately private until the project's own D2 launch decision. | Removed `--provenance` from the npm publish step, per Yehor's explicit, logged decision (Section 1, item 3). Flagged to restore before D2. | Real GitHub Actions run, v0.1.3 — `publish-npm` succeeds; `fixprove@0.1.0` confirmed live on npmjs.com |
| 8 | PyPI upload fails: `400 Bad Request: 'GitHub App (paid + private-repo CI)' must be 32 characters or less` (v0.1.3, real pipeline) | The comma-fixed label (35 characters) was never checked against PyPI's separate 32-character Project-URL label limit — no local build/inspect check validates label length, only PyPI's live upload endpoint enforces it. Third distinct real-infrastructure-only defect in this same job, each discovered only because the previous fix let the pipeline progress one step further. | Shortened the label to `"GitHub App (paid CI)"` (20 characters). | Real GitHub Actions run, v0.1.4 — `publish-pypi` succeeds; `fixprove 0.1.0` confirmed live on pypi.org |
| 9 (sandbox process defect, not shipped code) | A `git tag v0.1.4` command succeeded and reported a tag pointing at the wrong commit — the *previous* commit (`1d2670d`, same as `v0.1.3`) instead of the label-fix commit. This happened because an immediately preceding `git commit` had silently failed (missing local git identity — `user.email`/`user.name` were unset) and the shell chain did not treat that failure as fatal before proceeding to `git tag`. | Local git identity was never configured in this sandbox session before this point; the commit's exit code was not gated on before tagging. | Caught before any push occurred (verified `git rev-parse v0.1.4` against `git rev-parse HEAD` before proceeding); deleted the bad tag, set `user.email`/`user.name`, retried the commit, verified the resulting diff and label length against the committed blob, then re-tagged and re-verified `v0.1.4` matched the intended commit. Nothing incorrect was ever pushed to GitHub. | `git rev-parse` cross-check before and after; all four prior tags (`v0.1.0`–`v0.1.3`) confirmed unchanged after the correction |
| 10 (sandbox process defect, not shipped code) | Recurring stale `.git/index.lock`, `.git/HEAD.lock`, `.git/packed-refs.lock`, and loose-ref files under `.git/refs/tags/` throughout the session, on this specific sandbox mount. `rm`/`os.remove` reliably fail with "Operation not permitted"; `mv` (rename) usually succeeds, but was itself observed to silently fail-without-erroring at least once this session (a renamed file reappeared under its original name on a later `ls`). | Not root-caused to a specific mount/filesystem mechanism — logged as an operating constraint of this sandbox, not resolved at the source. | Adopted a retry-loop workaround (move-and-retry, up to 5 attempts with short backoff) for every git write operation for the remainder of 
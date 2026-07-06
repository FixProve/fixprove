# Session Log — 2026-07-06 — Session 4.2: Release-Gate Fix and Live Publish

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Root-cause and fix the two defects that blocked the `v0.1.0` release pipeline at its `test` gate (logged as Defect #7 in Session 4.1's log): the deterministic `bridge.get("yaml")` bug and the suspected corpus-eval environment drift. Once genuinely passing, tag `v0.1.1` and retry the release pipeline for real — explicitly not skipping ahead to B4/B5/D1/D2 until the release pipeline is genuinely green. As the session progressed, new real defects surfaced on live infrastructure that had never been reached before (v0.1.0 died too early to expose them); Yehor directed fixing each in turn through `v0.1.2`, `v0.1.3`, and `v0.1.4`, ending with both PyPI and npm confirmed live.

## 2. Live state changes (verified, not assumed)

- **`v0.1.1` tagged and pushed** (commit `612b525`). Real pipeline run: `test` and `verify-artifact-contents` passed for the first time ever on this project's real CI. `publish-pypi`/`publish-npm` both failed at checkout (Defect #3, Section 3).
- **`v0.1.2` tagged and pushed** (commit `206b094`, fixes the checkout-permissions bug). Real pipeline run: `test`/`verify-artifact-contents` passed; `publish-pypi` failed (Trusted Publisher invalid-publisher mismatch); `publish-npm` failed (2FA/EOTP block).
- **External fixes applied directly by Yehor** (not from this sandbox, which has no credentials for either registry):
  - PyPI Trusted Publisher entry on `pypi.org` deleted and recreated (typed fresh, not pasted) under `FixProve/fixprove`, workflow `release.yml`, environment `pypi`.
  - New npm access token generated with "Bypass two-factor authentication" enabled, scoped to the `fixprove` package (read+write), and set as the `NPM_TOKEN` GitHub Actions secret.
- **`v0.1.3` tagged and pushed** (commit `1d2670d`, comma-label fix + npm `--provenance` removal). Real pipeline run: `publish-npm` **succeeded** — `fixprove@0.1.0` published to the real npm registry for the first time in this project's history. `publish-pypi` failed (label exceeds PyPI's 32-character limit).
- **`v0.1.4` tagged and pushed** (commit `dce076c`, label shortened to 20 characters). Real pipeline run: `publish-pypi` **succeeded** — `fixprove 0.1.0` published to the real PyPI registry for the first time in this project's history. `publish-npm` failed with `E403 ... cannot publish over the previously published versions: 0.1.0` — expected/benign, not a defect (no version bump occurred; npm already has this exact version live from `v0.1.3`).
- **Independently verified, not just from CI's own report:**
  - `https://pypi.org/project/fixprove/` shows `fixprove 0.1.0`, released minutes before the check, correct 20-character Project-URL label, Repository link independently verified by PyPI.
  - `https://www.npmjs.com/package/fixprove` shows the live package with the expected description/README content.
- **All five prior tags (`v0.1.0`–`v0.1.4`) confirmed distinct and un-force-moved** at session close — `v0.1.0` through `v0.1.3` point at exactly the commits they always did; only `v0.1.4` is new.

## 3. Real defects found this session

| # | Defect | Root cause | Status |
|---|---|---|---|
| 1 | `bridge.get("yaml")` returns `None` instead of `"pyyaml"` (carried over from Session 4.1's open item) | `_resolve_import_name` only consults `importlib.metadata.packages_distributions()`, which reflects only installed packages; PyYAML is correctly not installed as a runtime dependency | **Fixed** — static fallback table, dynamic data always wins when present |
| 2 | Corpus-eval precision/false-positive regression (carried over from Session 4.1's open item) | Not environment drift — the corpus eval's own fixture dependencies were never installed by any CI workflow, only by ad hoc local environments in Sessions 1.1–1.4 | **Fixed** — explicit fixture-install steps added to `release.yml`; new local `fp-monkeypatch-demo` fixture package |
| 3 | `publish-pypi`/`publish-npm` fail at checkout, misleading "repository not found" (v0.1.1, real pipeline, never seen before because v0.1.0 never reached these jobs) | Job-level `permissions: id-token: write` silently replaced (not added to) default permissions, dropping `contents: read` needed by `actions/checkout@v4` | **Fixed** — `contents: read` added explicitly to both jobs |
| 4 | PyPI Trusted Publisher OIDC exchange rejected as invalid-publisher (v0.1.2, real pipeline) | Not conclusively root-caused — config fields appeared correct in a clear screenshot; likely invisible whitespace from an earlier paste | **Fixed pragmatically** (delete + retype the entry), root cause not fully confirmed — see Keystone Report Known Limitations |
| 5 | npm publish blocked by 2FA/OTP in unattended CI (v0.1.2, real pipeline) | Existing `NPM_TOKEN` lacked "Bypass 2FA," not togglable post-creation | **Fixed** — new token generated with the flag set |
| 6 | PyPI upload `400`: comma in Project-URL label breaks PyPI's comma-delimited parsing (v0.1.2, real pipeline) | PyPI's Project-URL field is `Label, URL`; the label itself contained a literal comma | **Fixed** — comma replaced with `+` |
| 7 | npm publish `E422`: `--provenance` requires a public source repo (v0.1.2, real pipeline) | `FixProve/fixprove` is deliberately private pre-D2; `--provenance` categorically requires public | **Fixed per Yehor's explicit, temporary decision** — `--provenance` removed, must be restored before the D2 public flip |
| 8 | PyPI upload `400`: comma-fixed label (35 chars) exceeds PyPI's 32-character Project-URL label limit (v0.1.3, real pipeline) | No local check validates label length; only PyPI's live upload endpoint enforces it | **Fixed** — label shortened to 20 characters |
| 9 (sandbox process defect) | A `git tag v0.1.4` briefly pointed at the wrong commit (the pre-fix commit, same as `v0.1.3`) because an immediately preceding `git commit` had silently failed (missing local git identity) and the tag command ran anyway | Local git identity was unset in this sandbox session; commit exit status wasn't gated on before tagging | **Caught before any push; corrected.** Nothing incorrect ever reached GitHub — see Keystone Report Section 3, Defect #9 for full detail |
| 10 (sandbox process defect) | Recurring stale `.git/index.lock` / `.git/HEAD.lock` / `.git/packed-refs.lock` / stray loose refs throughout the session, on this specific sandbox mount | Not root-caused to a specific mechanism; `rm` reliably denied, `mv` usually but not always succeeds | Worked around with a retry-loop + independent post-hoc verification (`git rev-parse`/`git show`/`diff`) after every git write op for the rest of the session |

## 4. Known limitations (stated plainly, nothing softened)

1. Defect #4 (PyPI Trusted Publisher mismatch) was fixed pragmatically, not conclusively root-caused — if it recurs, don't assume "delete and retype" is guaranteed to work a second time.
2. `npm --provenance` is currently absent from `release.yml` — a deliberate, temporary, Yehor-approved gap that **must** be restored before the D2 public-repo flip. No automated check currently enforces this restoration; it depends on this report/log being read.
3. `v0.1.4`'s `publish-npm` job shows a red X in GitHub's UI but is not an outstanding defect (Section 2) — a future session should check the actual npm registry state before assuming this needs fixing.
4. No real npm publish has been exercised with an actual version bump since the `--provenance` removal — the current `publish-npm` step is only proven against republishing the same already-live `0.1.0`.
5. `ci.yml` still does not run the Python test suite at all (pre-existing gap from Session 4.1, not addressed this session — out of scope).
6. The static distribution→import-name mismatch table covers 14 known cases, not exhaustive.
7. This sandbox's mount had real, only partially understood git lock/rename reliability issues this session (Defect #10) — every git write operation required independent post-hoc verification; this is a constraint of the current AI working environment, not of the FixProve repo.
8. An untracked `logo/` directory is present in the working tree at session close — not created by this session, origin not investigated.

## 5. Current state snapshot as of session close

- **GitHub repo (`FixProve/fixprove`):** private, `main` at commit `dce076c`. Tags `v0.1.0`–`v0.1.4` all present and distinct; none force-moved.
- **PyPI (`pypi.org/project/fixprove/`):** `fixprove 0.1.0` **live**, published via the `v0.1.4` pipeline run, Trusted Publishing (OIDC, no stored token).
- **npm (`npmjs.com/package/fixprove`):** `fixprove@0.1.0` **live**, published via the `v0.1.3` pipeline run, classic token (`NPM_TOKEN`, bypass-2FA), no `--provenance` (temporary, must restore before D2).
- **Release pipeline (`release.yml`):** genuinely green end-to-end for both registries as of this session, across two different tag runs (npm on `v0.1.3`, PyPI on `v0.1.4`) rather than a single all-green run — no single tag has yet triggered a run where both publish jobs succeed simultaneously, since `v0.1.4`'s npm job correctly refused a duplicate-version republish.
- **B4/B5/D1/D2 (GitHub App live seeded-PR test, public launch):** not started this session, per Yehor's explicit instruction to stay focused on the release pipeline.

## 6. Immediate next step

Add `.github/workflows/fixprove-check.yml` to the two private test repos from Session 4.1 (`yehorcallmedai-maker/autonomous-core`, `yehorcallmedai-maker/yehor.ai`) now that `pip install fixprove` / `npm install -g fixprove` both work for real, and run the first live seeded-PR test (B5) — the single step that proves the whole webhook → Action → OIDC callback → Checks API round trip works end-to-end. Before that, confirm with Yehor whether a version bump + real npm republish test is wanted first, since the current `publish-npm` step has only been proven against a duplicate-version rejection, not a genuine new-version publish.

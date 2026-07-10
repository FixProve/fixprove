# Session Log — 2026-07-10 — Session 4.6: CI Hardening, Python Suite Wired Into `ci.yml`

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Following Session 4.5's clean B5 close (TS/JS now matches Python's bar on `yehor.ai#1`), Session 4.6's mandate shifted to operational/CI technical debt. Of four listed priorities (restore `npm --provenance`, wire the Python suite into `ci.yml`, audit the PyPI Trusted Publisher/OIDC config, decide the Defect B two-hop disposition), Yehor selected priority 2: `ci.yml` did not run `engine/python/tests/` (217 tests) on regular pushes/PRs — only `release.yml`'s release pipeline did. Full design rationale and local/simulated verification are in `KS-REPORT-4.6-ci-python-gate.md`; this log covers only what was actually executed against live infrastructure.

## 2. Live state changes

1. Yehor committed and pushed the single code change (`.github/workflows/ci.yml`, a new parallel `test-python` job) plus `KS-REPORT-4.6-ci-python-gate.md`, directly to `main` — commit `e6bc429` (`FixProve/fixprove`).
2. Push triggered `CI #20` on GitHub Actions. **Confirmed live via GitHub's Actions UI (Claude-in-Chrome), not assumed from local simulation:** run [`29093574746`](https://github.com/FixProve/fixprove/actions/runs/29093574746) completed **Success** in 1m 20s. Both jobs green: `build` (1m16s, pre-existing TS/JS job, unaffected) and the new `test-python` (43s). The `Test Python engine` step's expanded log reads exactly `217 passed in 13.46s` — first real confirmation that this exact fixture-install sequence (requirements.txt, pandas/requests, local `fp-monkeypatch-demo`, `ts_corpus` npm install) reaches the full 217/217 count on an actual GitHub-hosted runner (Python 3.11, `ubuntu-latest`), not just in this session's off-mount sandbox simulation (which used Python 3.10).
3. No other live systems touched this session — no tag pushed, no PyPI/npm publish, no Cloudflare Worker change, no GitHub App reconfiguration.

## 3. Real defects found this session

None in the shipped `ci.yml` change itself — it passed live on the first attempt. One defect was found and fixed in this session's own **verification methodology** (not in shipped code), documented in full in `KS-REPORT-4.6-ci-python-gate.md` Section 3: a stale `corpus/.fixprove_cache/` directory leaked into an early local "fresh copy" adversarial test (fixtures deliberately withheld), producing a false 217/217 pass. Corrected by excluding that directory from the copy; the corrected adversarial run reproduced the exact Session-4.2-class failure (`precision == 0.142857...`) as expected. Confirmed this cannot affect the real CI job: `.fixprove_cache/` is `.gitignore`'d, never committed, so every real Actions run starts from a cache-free checkout.

**Non-blocking annotation, both jobs, this run:** GitHub Actions surfaced a deprecation warning — `actions/checkout@v4`, `actions/setup-node@v4`, `actions/setup-python@v5` target Node.js 20, which GitHub is forcing to run on Node.js 24 for now (see [GitHub's changelog](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)). Present on `build` too, so not introduced by this session's change — a pre-existing condition of the pinned action versions across both workflows. Not a failure, not addressed this session; worth a future minor bump of the pinned action versions.

## 4. Known limitations (stated plainly)

1. Branch-protection status for `main` is unchecked — if required-status-checks protection exists, `test-python` needs to be added to that list on GitHub's side (Settings → Branches) for this gate to actually block a merge on failure rather than just reporting red. This is a GitHub UI action, Yehor's to perform or decline; not verified either way this session.
2. The other three Session 4.6 priorities remain untouched: `npm --provenance` restoration, the PyPI Trusted Publisher/OIDC root-cause audit, and the Defect B two-hop disposition decision.
3. All items carried forward from Session 4.5's Known Limitations that this session did not touch remain open (Defect B's two-hop case uncaught by design; namespace-nested-class instantiation uncaught; orphaned tag refs `v0.1.4.lock.bak.*`/`v0.1.4.bak.*`; `npx wrangler` on 3.114.17; untracked `logo/` directory, confirmed still present, still out of scope; the `build_knowledge_base` cache-invalidation gap found this session, real but out of scope — see KS-REPORT-4.6 Section 3).

## 5. Current state snapshot as of session close

- **`FixProve/fixprove`:** `main` at `e6bc429`. `ci.yml` now runs both `build` (TS/JS) and `test-python` (Python engine, 217 tests) on every push/PR. Confirmed green live (`CI #20`). No new tag; `v0.1.6` remains the latest release, unaffected by this change.
- **`yehorcallmedai-maker/yehor.ai` PR #1:** unchanged from Session 4.5's close — still the clean B5 TS/JS test fixture, still not merged.
- **`yehorcallmedai-maker/autonomous-core` PR #3:** unchanged — still the clean B5 Python test fixture.
- **Cloudflare Worker / GitHub App:** unchanged, untouched this session.

## 6. Immediate next step

Confirm with Yehor whether to (a) proceed to the next Session 4.6 priority (`npm --provenance` restoration, the PyPI Trusted Publisher/OIDC audit, or the Defect B two-hop disposition decision), or (b) check/update `main`'s branch-protection required-status-checks list to include `test-python` first.

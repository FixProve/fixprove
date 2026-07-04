# Session Log — 2026-07-04 — Session 4.1: Live Deployment Execution

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Execute `RUNBOOK-LIVE-DEPLOYMENT.md` Parts A (Cloudflare Worker) and B (GitHub App) end-to-end against real, live infrastructure — not a dry run. Begin Part C (PyPI/npm release). Widen B4's test-repo plan from one repo to two, per Yehor's own suggestion, and run a pre-launch risk clarification pass before public launch (D1/D2, not reached this session).

## 2. Live state changes (verified, not assumed)

### Part A — Cloudflare Worker
- **A1:** Real KV namespace created (`PENDING_CHECKS_KV`, id `e1ebb96855394533958a666869e62306`), wired into `worker/wrangler.toml`.
- **A2:** Custom domain route `api.fixprove.dev` bound via `wrangler.toml`'s `routes` config (`custom_domain = true`). Corrected mid-session from an invalid wildcard/path pattern that `wrangler deploy` itself rejected — see Defect #1.
- **A3:** All three Worker secrets set via `wrangler secret put`: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`. Confirmed via wrangler's own per-secret success output.
- **A4:** `wrangler deploy` succeeded on the third attempt (first two failed on real defects — see Section 3). Worker is live at `api.fixprove.dev`.
- **A5:** Smoke test confirmed: `curl -i -X POST https://api.fixprove.dev/webhooks` → `401 {"ok":false,"error":"missing signature"}` — exact expected behavior.

### Part B — GitHub App
- **B1:** App registered under `yehorcallmedai-maker`. App ID `4216898`, Client ID `Iv23liIQsHs1hJEsFWAF`. Permissions: Checks (read/write), Pull requests (read-only), Contents (no access) — matches the architecture's own claim that this backend never reads repository contents.
- **B2:** Private key generated and downloaded once (GitHub only shows it once). Found to have landed inside the FixProve repo working directory by accident (browser default download location) — moved to `C:\Users\truff\Documents\fixprove-secrets\fixprove.2026-07-04.private-key.pem` and confirmed removed from the repo folder before any git operation could commit it.
- **B4 (partial):** App installed on two private test repos: `yehorcallmedai-maker/autonomous-core` (Python, 100%, real multi-agent codebase, single contributor) and `yehorcallmedai-maker/yehor.ai` (TypeScript/MDX, confirmed 27 production deployments via Vercel auto-deploy on merge to `main` — **constraint: never merge the deliberately-broken seeded-PR test into this repo's main branch**). Adding `.github/workflows/fixprove-check.yml` to either repo is deliberately deferred until Part C actually publishes an installable package, since the template's install step depends on `pip install fixprove` working for real (see Defect #7's ordering note in Session context).
- **Not done:** workflow file not yet added to either repo; B5 (live seeded-PR test) not attempted.
- GitHub App Description field: finalized copy drafted (Nordic Warm Minimalism voice, corrected to remove a "blocks bad pull requests" overclaim — enforcement depends on the customer's own branch protection, not something FixProve's Check Run does unilaterally). **Not yet confirmed pasted into the live App settings — verify at next session start.**
- GitHub App logo: not addressed this session. Not blocking for private-repo testing.

### Git repository (net-new this session)
- Discovered `D:\Dev\Projects\FixProve` had **never been git-initialized**, despite Sessions 1.1–3.2 having built and delivered code into it across many prior sessions. This was an invisible gap until this session actually tried to use git.
- Confirmed with Yehor that `pyproject.toml`/`cli/package.json`'s existing `github.com/fixprove/fixprove` reference is correct, not a stale placeholder — the `fixprove` GitHub org exists, owned/administered by Yehor (confirmed via a Copilot billing banner only admins see), but had zero repositories in it before this session.
- `git init` → first commit `7159abb` (141 files, 15,424 insertions) → pushed to `https://github.com/FixProve/fixprove` (private — Yehor's explicit choice; flipping to public is reserved for the deliberate D2 public-launch moment, not a side effect of fixing CI plumbing).
- First push attempt failed: the repo had been created under the wrong owner (`yehorcallmedai-maker/fixprove`, personal account) — caught via a 404 on `git push`, corrected by creating a second repo under the correct `fixprove` org and repointing the git remote (`git remote set-url origin ...`). The personal-account repo was left empty/unused, not deleted.
- `.gitignore` extended this session (on top of the previous session's `*.pem`/`*.key`/`.dev.vars`/Python-build additions) to also exclude: `target/` (Rust build artifacts — a previously-unknown `placeholders/crates-fixprove/` Rust crate placeholder exists in this repo), `invoices/` (real business PDFs — domain-registration invoices — that were about to be committed), and `*.check` (a stray leftover scratch file from an earlier session's write-verify-move file-delivery protocol).
- `ci.yml` fired automatically on the initial push and **passed** (build, typecheck, test — TS/JS workspaces only; does not run the Python test suite).

### Part C — PyPI / npm release
- **C1:** PyPI Trusted Publisher configured — Owner `fixprove`, Repository `fixprove`, Workflow `release.yml`, Environment `pypi`. Configured against the existing `fixprove` PyPI project: a name-reservation placeholder (v0.0.1, "Real package coming soon," released 2026-06-30, sole-owned by Yehor) that was **previously undocumented anywhere in this project's own history** until discovered this session.
- **C2:** `NPM_TOKEN` repository secret set on `github.com/FixProve/fixprove` — granular access token, scoped to the `fixprove` package only, read+write, no IP restriction (GitHub Actions runner IPs are not stable enough to allowlist meaningfully).
- **C3:** `v0.1.0` tag pushed. **Release pipeline ran and FAILED at the `test` job.** Downstream jobs (`verify-artifact-contents`, `publish-npm`, `publish-pypi`) correctly did not run — the gate held. Directly verified via both registries' own APIs/pages: PyPI and npm each still show only the pre-existing `0.0.1` placeholder. **Nothing was published.**

## 3. Real defects found this session

| # | Defect | Root cause | Status |
|---|---|---|---|
| 1 | `wrangler deploy` rejected `routes = [{ pattern = "api.fixprove.dev/*", custom_domain = true }]` | Cloudflare Custom Domains require a bare hostname — no wildcard, no path (unlike a zone-based Route) | **Fixed** — pattern corrected to `api.fixprove.dev` |
| 2 | `wrangler deploy` failed to resolve `@fixprove/github-app/dist/src/index.js` | `app/` package had never been built in this fresh checkout (`pnpm install` doesn't run each package's own `build` script) | **Fixed** — `cd app && pnpm build` before `worker`'s deploy |
| 3 | First smoke test returned `500` instead of the expected `401` | Worker's 3 GitHub App secrets weren't set yet at that point in the sequence (A5 was attempted before A3 completed) — `new App({appId: undefined, ...})` throws synchronously | Not a code bug — sequencing issue, resolved by finishing A3 before re-running A5 |
| 4 | GitHub App private key `.pem` downloaded into the FixProve repo working directory | Browser default download location, not intentional | **Fixed** — moved outside the repo before any git operation |
| 5 | `.gitignore` had no `.pem`/`.key`/build-artifact/`invoices`/`.check` exclusions | Accumulated gap across sessions; each caught only when the corresponding file type actually appeared in a `git add -A` | **Fixed** |
| 6 | PyPI Trusted Publisher initially pointed at `owner: fixprove` while the pushed repo was actually under `yehorcallmedai-maker` | Repo created under the wrong GitHub account on the first attempt | **Fixed** — repo recreated under the correct `fixprove` org, git remote repointed |
| 7 | **Release pipeline `v0.1.0` failed at the `test` job — multiple Python test failures** | Partially diagnosed. `test_bridge_handles_distribution_import_name_mismatch` (`tests/test_resolver.py:183`) is a **deterministic logic failure**, not environment drift: `build_import_name_bridge` returns `None` for `bridge.get("yaml")` against an in-test hardcoded KB keyed `pyyaml`. Corpus-eval failures (`test_corpus_eval_reports_perfect_precision_recall`: precision 0.143 vs. expected 1.0; `test_ts_corpus_eval_reports_perfect_precision_recall`: 8 false positives vs. expected 0) are **suspected** environment drift — first time this suite has run on a clean GitHub Actions runner rather than whatever local/dev environment validated it across Sessions 1.1–1.4 — but this is not yet confirmed, only suspected. | **OPEN — not fixed. Immediate next task.** |

## 3a. False alarm, checked and closed

Near session close, Claude's own sandbox mount showed 6 files (`.gitignore`, 3 KS-REPORT files, `test_symbol_extractor.py`, `pnpm-lock.yaml`) as "modified" relative to the pushed commit, in a pattern that looked like a reversion. Verified directly on Yehor's machine: `git status` clean, `git diff --stat` empty. Confirmed this was a stale cache in the sandbox's view of the mount, not real file drift or corruption. No action needed — noted here only so a future session doesn't waste time re-investigating the same non-issue.

## 4. Known limitations (stated plainly, nothing softened)

1. The core resolver/KB logic is currently **failing its own test suite** in the real, clean CI environment used for release. Until Defect #7 is root-caused and fixed, no tag should be re-pushed, and this pipeline is not launch-ready.
2. B4 is incomplete: the Action workflow file has not been added to either test repo. B5 (the live seeded-PR test — the single step that proves the whole webhook → Action → OIDC callback → Checks API round trip works live) has not been attempted at all.
3. The GitHub App's Description field update is drafted but not confirmed live. No logo has been set.
4. `README.md` at the FixProve repo root still states "Session 0.2 (scaffold)... resolver engine ships in Milestone 1" — stale now that the engine is built and the Worker is live. Fix before D2.
5. The personal-account repo `github.com/yehorcallmedai-maker/fixprove` (created by mistake, first attempt) still exists, empty, unused. Harmless but should be deleted eventually.
6. D1 (pre-launch risk clarification research) and D2 (publish launch copy) have not been started.
7. This log's "suspected environment drift" characterization of the corpus-eval failures is exactly that — suspected, not confirmed. Next session must verify, not assume.

## 5. Current state snapshot (as of session close, 2026-07-04)

- **Cloudflare Worker:** live at `api.fixprove.dev`, verified via smoke test returning the expected `401`.
- **GitHub App:** registered (App ID `4216898`), installed on 2 private repos, workflow file not yet added to either.
- **Git repository:** exists, pushed, private, at `github.com/FixProve/fixprove`, commit `7159abb`, tag `v0.1.0`.
- **PyPI:** `fixprove` project exists (sole-owned by Yehor), only `0.0.1` (placeholder) published. Trusted Publisher configured and functioning as a gate (correctly blocked publish on test failure).
- **npm:** `fixprove` package exists, only `0.0.1` (placeholder) published. `NPM_TOKEN` secret configured.
- **Release pipeline (`v0.1.0`):** FAILED at the test gate. Nothing published. Gate behaved exactly as designed.

## 6. Immediate next step

Investigate and fix Defect #7 (Python test suite failures) before anything else:

1. Reproduce in a sandbox: install `engine/python/requirements.txt` fresh, run `python -m pytest tests/ -q`, confirm whether the same failures reproduce outside GitHub Actions too (isolates "CI-environment-specific" vs. "universal, was always broken, was never actually caught before").
2. Root-cause `build_import_name_bridge` returning `None` for `bridge.get("yaml")` against a `pyyaml`-keyed KB first — it's deterministic and doesn't depend on environment, so it's the cleanest lead. Check whether this connects to the standing `feedback_kb_import_name_resolution` guidance (one distribution can map to multiple import names) — this may be a regression of a previously-understood issue, not a new one.
3. Root-cause the corpus-eval precision/false-positive regressions — determine whether they cascade from the same bridge bug or are a separate, second issue (e.g., installed package version drift between Yehor's dev environment and a clean Ubuntu runner).
4. Once genuinely passing locally (not just "should work"), commit the fix, then tag `v0.1.1` (do not force-move the existing `v0.1.0` tag) and push to retry the release pipeline for real.
5. Only after the release pipeline is genuinely green: resume B4 (add the Action workflow to both installed test repos) → B5 (live seeded-PR test, in the same sitting once started — don't leave a broken test PR open across a session boundary) → D1 (pre-launch risk research) → D2 (publish launch copy, after fixing the stale README status line too).

**Do not skip ahead to B4/B5/D1/D2 before this is resolved.** The release pipeline failing at the test gate is the single most load-bearing open item from this session.

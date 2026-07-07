# Session Log Index — FixProve

**Purpose:** this folder is the authoritative, git-tracked record of what has actually been *executed* against live infrastructure (Cloudflare, GitHub, PyPI, npm) — as distinct from the Keystone Reports at the repo root, which document what was *built and locally verified*. A KS-REPORT says code was written and its own test suite passed. A session log says a real command was run against a real, live system, and states exactly what happened, including failures.

**Mandatory for every new session:** before taking any action in this repository, read this index in full, then read the most recent dated log file below. Do not rely on conversation memory alone — memory can be incomplete or reset between sessions; this folder is the durable source of truth for live/deployment state. If something here contradicts what you're told at the start of a session, trust what you can verify live (re-check the actual system), not the log or the prompt alone — then correct the log if it's gone stale.

**Naming convention:** `SESSION-LOG-YYYY-MM-DD-session-N.N-<slug>.md`. One file per work session. Files are never edited after the session that wrote them closes — corrections go in a new file, not a rewrite of history.

**Required structure for every log file, in this order:**
1. Scope — what the session set out to do
2. Live state changes — every real, externally-verifiable action taken (deploys, secrets set, tags pushed, accounts/repos created), with the verification evidence, not just "should have worked"
3. Real defects found — exact error, root cause if known, fix status (fixed / open)
4. Known limitations — stated plainly, nothing softened
5. Current state snapshot as of session close — one line per live system
6. Immediate next step — the single next action, unambiguous, for whoever picks this up next (human or AI)

---

## Index of sessions

- [2026-07-04 — Session 4.1: Live deployment execution](SESSION-LOG-2026-07-04-session-4.1-live-deployment.md) — Parts A (Cloudflare Worker) and B1/B2 (GitHub App registration) live-deployed and verified end-to-end; git repository created and pushed for the first time in this project's history; PyPI Trusted Publishing and npm token configured; `v0.1.0` tag pushed and the release pipeline **failed at the Python test gate** — real defects found, not yet fixed, nothing published to either registry. **Open item carried forward: fix the failing test suite before any further release attempt.**
- [2026-07-06 — Session 4.2: Release-gate fix and live publish](SESSION-LOG-2026-07-06-session-4.2-release-gate-fix-and-live-publish.md) — fixed the test-gate defects from 4.1, then fixed six further real, live-infrastructure-only defects across `v0.1.1`-`v0.1.4` (permissions, PyPI Trusted Publisher, npm 2FA, PyPI comma, npm provenance/visibility, PyPI label length). **`fixprove 0.1.0` is now confirmed live on both PyPI and npm**, independently verified against each registry directly, not just CI's own report. `npm --provenance` is temporarily removed and must be restored before the D2 public flip. **Open item carried forward: add the GitHub Action workflow to the two private test repos and run the first live seeded-PR test (B5).**
- [2026-07-07 — Session 4.3: Distributable template fix, B4/B5 prep, and live execution](SESSION-LOG-2026-07-07-session-4.3-template-fix-and-b4b5-prep.md) — adversarially verified `app/templates/fixprove-check.yml` before handing it to Yehor (Defects #1-#3: engine install, JS/TS deps, Python deps), then executed B4/B5 live against `autonomous-core` and found four further real defects entirely on live infrastructure (Defect #4: Worker error-boundary had no logging; #5: GitHub App private key stored in PKCS#1 instead of required PKCS#8; #6: `/callback`'s classified rejections also unlogged; #7 — deepest root cause: pending Check Run lookup correlated by the OIDC token's `sha` claim, which is the ephemeral merge commit for `pull_request`-triggered runs, never the real PR head sha — fixed by re-keying the pending store on a tagged `(owner, repo, kind, correlationId)` and correlating by PR number instead). **First fully clean, correct end-to-end B5 pass achieved this session** (`autonomous-core` PR #3, seeded hallucination correctly detected, valid code correctly left clean). Full detail in `KS-REPORT-4.3-addendum.md`. **Open item carried forward: `yehor.ai` (TypeScript/MDX) has not yet been exercised under this fixed pipeline — B5 there is still outstanding.**

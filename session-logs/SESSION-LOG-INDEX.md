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

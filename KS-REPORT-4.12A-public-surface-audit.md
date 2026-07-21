# Keystone Report — Session 4.12-A: Public-Surface Audit ("Cover Audit")

**Date:** 2026-07-21 · **Director:** Yehor Kaliberda · **Co-Pilot:** Claude (Cowork), Lead Technical Co-Pilot (Node 1)
**Scope:** read-only audit of every public-facing surface — what a cold stranger sees. No fixes executed this session except this report and `COVER-FIX-STRATEGY.md`.
**HARD BOUNDARY honored throughout:** no Stripe action, no pricing drafted, no GitHub App visibility touched, nothing CVR-dependent attempted.

---

## 0. Escalation — read this before anything else in the report

Two findings surfaced during this audit are not ordinary "cover" polish items — they touch the subject matter of the standing legal pause directly, and existed **before** this session started (this session did not create them, only found them). Per this session's own instruction ("if a finding suggests one of the three blocked items needs addressing sooner — STOP, flag it prominently, escalate"), flagging here first, not buried in the lens findings below:

1. **`STRIPE-SETUP-CHECKLIST.md` and `TRADEMARK-FILING-NOTES.md` are tracked in git, part of HEAD `c36d2e5`, and are live right now** at `https://github.com/FixProve/fixprove/blob/main/STRIPE-SETUP-CHECKLIST.md` and the equivalent `TRADEMARK-FILING-NOTES.md` URL (both fetched and visually confirmed rendering, 2026-07-21). The Stripe file contains specific subscription pricing figures ($29/mo solo, $99/mo team) already public, while pricing publication is currently BLOCKED PENDING LEGAL COUNSEL per `MEMORY/critical-actions.md`. This is an existing gap between the stated boundary and reality, not a new action — no fix was made, only found and reported.
2. **PyPI's public project-links section for the `fixprove` package includes a link labeled "GitHub App (paid CI)"** (confirmed live at `https://pypi.org/project/fixprove/`, 2026-07-21) — monetization-implying language on an indexed public page while Stripe has no account and the App is ORG-ONLY.

Neither item was acted on. Both are logged in §6 (Lens 3/4 findings) and carried into `COVER-FIX-STRATEGY.md` as a decision Yehor must make, not a session Claude can execute unilaterally (redacting or rewriting already-public git history is CA-2-class: irreversible-in-public).

---

## 1. Stage 1 — Intake, as run this session

- `.git/*.lock`: none present at session start. A fresh `index.lock` was created by `git status` itself mid-session (documented, expected behavior on this mount — see `feedback_fixprove_mount_write_quirks` project memory) and renamed away immediately, not deleted.
- `git log -1 --oneline`: `c36d2e5 docs: fix self-referential commit hash in next-session prompt` — matches the HEAD named in the 4.12 starting prompt. No drift.
- `MEMORY/state.md` and `MEMORY/critical-actions.md`: read in full (re-confirmed unchanged since the prior read this same working session — mtimes identical). Session 4.11 is closed and signed; Stripe/pricing/App-visibility remain BLOCKED PENDING LEGAL COUNSEL as of 2026-07-17, unchanged by anything found this session.
- `PITFALL-WATCHLIST.md`: confirmed absent — searched at root and via `find . -iname "*pitfall*"`, no match anywhere in the tree.
- **Not requested by the 4.12-A prompt but discovered in passing:** `git status` shows substantial uncommitted content (see the prior session's turn for the full list) including `MEMORY/` itself, several KS-REPORTs, and modified tracked files. Not re-litigated here — already flagged to Yehor earlier this session; restated only so this report doesn't imply the working tree is clean.

## 2. Context taken as given (not re-derived)

Engine verified 217/217, 0 false positives; repo public; npm v0.1.9 and PyPI v0.1.9 live; Cloudflare Worker live. This session's sole subject is the public face — GitHub org/repo, `fixprove.dev`, npm page, PyPI page.

## 3. Lens 1 — The Cold Developer (60-second test)

| # | Finding | Evidence | Severity | One-line fix |
|---|---|---|---|---|
| 1.1 | GitHub org page (`github.com/FixProve`) is at GitHub's untouched default state: no bio, no website link, no location, no pinned repos, no org README, "Turn on discussions" / "create a README file or pin repositories" onboarding prompts still showing, generic default avatar. | Screenshot + zoom, `github.com/FixProve`, 2026-07-21 | BLOCKER-FOR-IMAGE | Set org avatar (asset already exists at `logo/FP LOGO.png`), write a 1-2 sentence bio + website link, pin `fixprove`. |
| 1.2 | Repo About sidebar (`github.com/FixProve/fixprove`) reads literally **"No description, website, or topics provided."** — confirmed by direct zoomed screenshot on a second pass, correcting an earlier WebFetch summary that had (incorrectly) reported a description was present. No topics at all. | Zoomed screenshot, `github.com/FixProve/fixprove`, 2026-07-21 (Stage 3 second-pass catch — see §7) | BLOCKER-FOR-IMAGE | Copy the README's existing one-sentence value prop into the About description field; add website `https://fixprove.dev`; add ≥5 topics. |
| 1.3 | Zero badges anywhere in `README.md` — confirmed by direct source read (32 lines, no badge markdown of any kind). No CI status, npm version, PyPI version, license, or provenance signal visible at a glance. | Direct file read, `README.md` | BLOCKER-FOR-IMAGE | Add a badge row: npm version, PyPI version, CI status (`ci.yml`), license, npm provenance. |
| 1.4 | Latest release notes (`v0.1.9`) are the raw merge-commit title, not a human-readable changelog. | `github.com/FixProve/fixprove/releases/tag/v0.1.9`, 2026-07-21 | NOTICEABLE | Write a 2-3 sentence description for the next tag forward (no need to rewrite past releases). |
| 1.5 | Repo shows 0 stars / 0 forks / 0 watchers. Not independently fixable, but compounds items 1.1-1.3's "nobody's home" impression. | Screenshot, `github.com/FixProve/fixprove` | NOTICEABLE (context only) | No direct fix; sequence 1.1-1.3 before any launch push. |
| 1.6 | npm and PyPI package pages both render cleanly with a strong, consistent one-sentence value prop. | `npmjs.com/package/fixprove`, `pypi.org/project/fixprove/`, both 2026-07-21 | Clean pass | — |

## 4. Lens 2 — The Evaluating Engineer (10-minute test)

| # | Finding | Evidence | Severity | One-line fix |
|---|---|---|---|---|
| 2.1 | Root `README.md` (what GitHub shows on the repo homepage) has no install command, no quickstart, no output example, and still reads: *"Session 0.2 (scaffold) of the FixProve master build plan. The deterministic resolver engine itself ships in Milestone 1."* — the exact scaffold remnant KS-REPORT-4.11 already flagged (item C) as needing a fix. Confirmed still present, verbatim, at `README.md` lines 20-24, and rendering live on GitHub. | Direct file read + `github.com/FixProve/fixprove` fetch, 2026-07-21 | BLOCKER-FOR-IMAGE | Replace the "Status" section with current reality + install/quickstart; see 2.3 below — the content already exists, it just isn't here. |
| 2.2 | `CONTRIBUTING.md` still reads "is in early build... targeted at Session 3.1, public npm/PyPI launch" (line 7) and "Before you open a PR (once public)" (line 15) — both milestones it's waiting on have already happened. | Direct file read, `CONTRIBUTING.md` | NOTICEABLE | Update both lines to reflect the repo is public and packages are live now. |
| 2.3 | By contrast, `cli/README.md` (50 lines) — the README actually shipped to npm — is current, has real install/usage/exit-code documentation, and is not scaffold language. This is a consolidation gap, not a missing-content problem: good copy exists, it just isn't on the repo homepage. | Direct file read, `cli/README.md`; confirmed live rendering at `npmjs.com/package/fixprove` | BLOCKER-FOR-IMAGE (contrast finding) | Pull `cli/README.md`'s install/usage content (or an adapted version) into the root `README.md`. |
| 2.4 | `cli/package.json` is missing `keywords` and `author` fields (has correct `license`, `repository`, `homepage`). | Direct file read, `cli/package.json` | NOTICEABLE | Add `keywords` (mirror the PyPI package's: `ai`, `hallucination`, `static-analysis`, `ci`, `linter`) and `author`. |
| 2.5 | `NOTICE.md` deliberately documents why there's no root `LICENSE` file (per-package licensing: `/cli` MIT, `/app` and `/web` proprietary) — a considered, logged decision, not an oversight. But GitHub's own UI doesn't surface this nuance: the About sidebar shows no license at all (see 1.2/4.3), so a stranger who doesn't open `NOTICE.md` may read the repo as unlicensed/ambiguous rather than intentionally mixed-licensed. | Direct file read, `NOTICE.md` | NOTICEABLE | One line in the README pointing to `NOTICE.md` before a stranger has to go looking for it. |
| 2.6 | The public repo contains the full source of the "proprietary, all rights reserved" `/app` and `/web` packages. Legally consistent (public visibility ≠ license grant) but the README never explains the source-available-but-proprietary model, which could read as inconsistent to an evaluating engineer. | Direct file read, `README.md`, `NOTICE.md` | NOTICEABLE | One sentence in README or NOTICE.md naming the model explicitly ("source-available for transparency; `/app` and `/web` are not licensed for reuse"). |
| 2.7 | Python and TypeScript/JS are each documented, on their respective package pages, as the two engines FixProve ships (each explains it's the counterpart/wrapper for the other language). | `npmjs.com/package/fixprove`, `pypi.org/project/fixprove/` | Clean pass | — |

## 5. Lens 3 — The Skeptic (trust test)

| # | Finding | Evidence | Severity | One-line fix |
|---|---|---|---|---|
| 3.1 | `STRIPE-SETUP-CHECKLIST.md` is tracked, part of HEAD, and live on the public repo — contains specific pricing figures. See §0. | `git ls-files`, `git log`; live URL confirmed via browser, 2026-07-21 | **Escalated in §0** — not filed as routine severity | Yehor decision required: redact/relocate/rewrite-history — CA-2-class, see `COVER-FIX-STRATEGY.md` §5. |
| 3.2 | `TRADEMARK-FILING-NOTES.md` — same tracked/live status; draft, non-attorney-reviewed USPTO filing language and strategy notes. | Same as 3.1 | **Escalated in §0** | Same decision track as 3.1. |
| 3.3 | `KS-REPORT-0.2-trademark-stripe-scaffold.md` is also tracked/live; not read in depth this session (out of scope to duplicate 3.1/3.2's content) but flagged for the same relocate/redact review. | `git ls-files` | NOTICEABLE (bundled with 3.1/3.2) | Review alongside 3.1/3.2. |
| 3.4 | A stray git tag `v0.1.4.bak.1783353789` is visible on the public tags list — reads as debugging residue. | `git tag --sort=-creatordate` | NOTICEABLE | Delete the tag (note: deleting a *public* tag is itself a minor irreversible-in-public action; get an explicit nod before doing it, not because it's high-risk but for consistency with the CA-2 spirit). |
| 3.5 | Commit-message scan (last 100 commits) for leaked secrets/tokens/personal data: clean. Two keyword hits were both descriptions of a fix ("remove legacy npm token env"), not actual leaked values. | `git log -100 --pretty=format:'%h %s' \| grep -iE ...` | Clean pass | — |
| 3.6 | `fixprove.dev` waitlist form tested with a malformed email (`not-an-email`) and a valid throwaway (`ks-4.12a-audit-test@example.com`). Malformed input was correctly rejected client-side ("Please enter a valid email address."); valid input was accepted with a clear "You're on the list." confirmation. No silent drop, no error. | Live browser test, `fixprove.dev`, 2026-07-21 | Clean pass (one housekeeping note: the real test row is now sitting in whatever the waitlist backend stores to — Yehor may want to remove it) | — |
| 3.7 | No favicon on `fixprove.dev` — confirmed by direct DOM query (`document.querySelectorAll('link[rel*="icon"]')` returns empty). | JS query, `fixprove.dev`, 2026-07-21; corroborated by no favicon asset anywhere under `web/` | BLOCKER-FOR-IMAGE | Add a favicon (derive from `logo/FP LOGO.png`). |
| 3.8 | No GitHub Discussions enabled; `.github/` contains only `workflows/ci.yml` and `workflows/release.yml` — no `ISSUE_TEMPLATE/`, no `PULL_REQUEST_TEMPLATE.md`, no `CODE_OF_CONDUCT.md`, no `FUNDING.yml`. Confirmed by recursive directory listing. | `device_list_dir` on `.github/`, recursive | NOTICEABLE | Add minimal versions of each before actively soliciting outside contributions (which `CONTRIBUTING.md` already invites). |

## 6. Lens 4 — The Operator (consistency + hygiene)

| # | Finding | Evidence | Severity | One-line fix |
|---|---|---|---|---|
| 4.1 | Version consistency: npm shows `0.1.9`, PyPI shows `0.1.9`, latest git tag is `v0.1.9` — all agree. | npm/PyPI pages, `git tag` | Clean pass | — |
| 4.2 | Product one-liner is consistent (word-for-word on README/npm, close in spirit on PyPI/fixprove.dev). | Direct comparison across all four surfaces | Clean pass | — |
| 4.3 | License consistency: `cli/package.json` says MIT, `engine/python/pyproject.toml` says MIT, PyPI shows "License: MIT License" as a **PyPI-verified** detail — all three agree. The one surface that disagrees is the most prominent one: the GitHub repo sidebar shows no license at all (root has no `LICENSE` file; MIT files exist only nested at `cli/LICENSE` and `engine/python/LICENSE`, confirmed present by repo-wide search). | `find . -iname "LICENSE*"`, package metadata reads, PyPI page | BLOCKER-FOR-IMAGE | Either add a root `LICENSE` pointing to the mixed-licensing model, or add a one-line About-description note ("mixed licensing — see NOTICE.md") since GitHub's own detector won't surface nested licenses. |
| 4.4 | `cli/package.json` missing `keywords` (repeat of 2.4, cross-referenced for the metadata-consistency angle). | — | NOTICEABLE | See 2.4. |
| 4.5 | PyPI's public "Project links" section for `fixprove` includes a link labeled **"GitHub App (paid CI)"** — monetization-implying wording live on an indexed public page. See §0 for why this is escalated rather than filed as routine. | `pypi.org/project/fixprove/`, 2026-07-21 | Escalated in §0 | Yehor decision — see `COVER-FIX-STRATEGY.md` §5. |
| 4.6 | `.github/` community health files: only CI workflows present, no issue/PR templates or code of conduct (repeat of 3.8, cross-referenced for the hygiene angle). | — | NOTICEABLE | See 3.8. |
| 4.7 | Repo-root file triage — KEEP-PUBLIC / RELOCATE / REDACT recommendation per file group (flag only, not executed): | — | — | — |

**4.7 detail — per-file recommendation:**

- **KEEP-PUBLIC:** all `KS-REPORT-*.md`, `session-logs/`, `CLIENT-SUMMARY-*.md`, `MILESTONE-*.md`, `NEXT-SESSION-*-STARTING-PROMPT.md`, `FIXPROVE_MASTER_BUILD_PLAN.md`, `KS-MANIFEST-*.md`, `OPERATING-PLAN-D17-D60.md`, `RUNBOOK-LIVE-DEPLOYMENT.md`, `LAUNCH-COPY-BUILD-IN-PUBLIC.md`, `SESSION-0.1-GEMINI-HANDOFF.md`. These are the deliberate build-in-public asset the project's own launch copy describes ("Every defect we found along the way, written down, in the repository, next to the fix"); no operational secrets found in the ones read this session.
- **REDACT or RELOCATE (Yehor decision, not executed):** `STRIPE-SETUP-CHECKLIST.md`, `TRADEMARK-FILING-NOTES.md`, `KS-REPORT-0.2-trademark-stripe-scaffold.md` — see §0.
- **No action needed / not currently public:** `Bookkeeping last update 20.07.26/` — currently untracked (not live on GitHub). Recommend adding it to `.gitignore` explicitly given it holds real financial data (per KS-REPORT-4.11.5, `TAX-OPERATIONS.md` lives here), so a future `git add .` can't accidentally publish it.

## 7. Stage 3 — Verify (adversarial second pass)

- **Correction caught by the second pass:** an initial WebFetch summary of the repo page reported the About sidebar description as present (quoting the README's opening line). A direct browser screenshot + zoom on the same URL showed the sidebar actually reads "No description, website, or topics provided." The zoomed screenshot is the evidence of record (§3, finding 1.2); the WebFetch summary was wrong and is not used anywhere else in this report. This is exactly the failure mode Stage 3 exists to catch.
- **Re-confirmed on a second read:** README.md's "Session 0.2 (scaffold)" text (2.1) — confirmed both by direct file read and by the live GitHub rendering (WebFetch), independently agreeing.
- **Absence claims actually searched, not assumed:** the root `LICENSE` file's absence was confirmed by a repo-wide `find` (not just a root listing) before being reported, which is how the nested `cli/LICENSE` and `engine/python/LICENSE` files were found and the finding was refined from "no license" to "no *root* license, nested ones exist and are correctly referenced." `PITFALL-WATCHLIST.md`'s absence was confirmed the same way.
- **YEHOR-MUST-CHECK (could not independently verify):**
  - Whether the npm/PyPI package pages' download-count/star-count reflect any real installs yet (not fetched — out of this audit's scope, informational only if wanted).
  - Whether the waitlist form's backend actually persists submissions durably (only the frontend confirmation was observed; a full backend check was out of scope for a read-only audit). The test row (`ks-4.12a-audit-test@example.com`) should be located and removed by Yehor if it lands somewhere he manages directly.
  - GitHub Marketplace listing and legacy NPM_TOKEN status were already closed in KS-REPORT-4.11.5 (items H and J) — not re-checked this session, carried as already-resolved.

## 8. Accountability Statement

Signed by: ______________ (Yehor Kaliberda) — Date: ____________

## 9. Methodology note

Every BLOCKER-FOR-IMAGE finding above was checked at least twice: once via an automated fetch (WebFetch or a direct file/`git` read) and once via a live, logged-in-free browser visit with a screenshot (and, for the About-sidebar finding, a zoomed screenshot specifically because the two methods disagreed). Where the two methods disagreed, the direct screenshot is the evidence of record, and the disagreement itself is logged in §7 rather than silently resolved. No finding in this report rests on a single observation.

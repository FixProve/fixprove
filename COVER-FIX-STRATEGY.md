# COVER-FIX-STRATEGY.md — Ordered Fix Plan from KS-REPORT-4.12A

Companion to `KS-REPORT-4.12A-public-surface-audit.md`. This is a plan, not an execution — no fixes were made producing this document. Each session below is sized to ≤ one working day and has a falsifiable done-check, not a vague "improve X."

**Standing constraint carried into every session below:** no Stripe, no pricing (not even placeholders), no GitHub App visibility change, nothing CVR-dependent. None of the sessions below require any of those four things — verified during planning, not assumed.

---

## CVR-GATED / legal-gated queue (restated verbatim, parked — not this document's business)

Per `MEMORY/critical-actions.md`, unchanged by this session: Stripe account completion, publishing pricing anywhere public-facing, and flipping the GitHub App "fixprove" from ORG-ONLY to public remain **BLOCKED PENDING LEGAL COUNSEL** (effective 2026-07-17). No finding in KS-REPORT-4.12A requires any of these three to proceed — every fix session below is executable today, independent of the CVR or legal counsel's answer.

## Escalated items — Yehor decision needed before a session can be planned around them

These aren't sized into a session because they need a decision, not just execution:

1. **`STRIPE-SETUP-CHECKLIST.md`, `TRADEMARK-FILING-NOTES.md`, `KS-REPORT-0.2-trademark-stripe-scaffold.md`** — currently live on the public repo with real pricing figures and draft trademark strategy. Options: (a) redact the specific figures/strategy language in place and add a new commit, (b) relocate the files out of the repo entirely going forward (doesn't remove them from git history — that needs `git filter-repo`/BFG plus a force-push, which is CA-2-class and its own irreversible-in-public action), (c) decide the exposure is acceptable and leave as-is. **This document takes no position — it's Yehor's call**, but recommends: given `git filter-repo` + force-push is a bigger, riskier action than removing the current file content, decide the *content* question first (redact vs. accept) before deciding whether history-rewriting is worth the risk.
2. **PyPI's "GitHub App (paid CI)" project-link label** — a one-word edit (`pyproject.toml`'s project-links or wherever this is sourced from) but touches monetization-adjacent language while CA-1 is paused. Recommend Yehor simply says "fix the label to remove 'paid'" or "leave it" — this one is low-effort either way, the only question is whether it's in scope before the legal pause lifts.

---

## Session 4.12-B — GitHub Cold-Start Fix

**Size:** ≤1 day. **Touches:** GitHub org settings, GitHub repo settings, `README.md`, `CONTRIBUTING.md`, `cli/package.json`. No code behavior changes.

Must-close list:
- Upload `logo/FP LOGO.png` (already in the repo) as the GitHub org avatar.
- Write a 1-2 sentence org bio + set website `https://fixprove.dev`; pin the `fixprove` repo.
- Fill the repo's About sidebar: description (reuse the README's existing opening sentence), website `https://fixprove.dev`, ≥5 topics (e.g. `ai`, `static-analysis`, `ci`, `python`, `typescript`, `hallucination-detection`).
- Rewrite `README.md`'s "Status" section: remove the "Session 0.2 (scaffold)" language entirely; replace with current reality (engine verified 217/217, CLI live on npm v0.1.9/PyPI v0.1.9) and pull in `cli/README.md`'s install/usage content (or an adapted version) so the repo homepage itself has an install command and quickstart.
- Add a badge row to the top of `README.md`: npm version, PyPI version, CI status, license, npm provenance.
- Add one line to `README.md` or `NOTICE.md`'s visibility pointing a reader to the mixed-licensing explanation before they have to go looking.
- Update `CONTRIBUTING.md`: remove "once public" / "targeted at Session 3.1" — both already happened.
- Add `keywords` and `author` fields to `cli/package.json`.

**Done-check (falsifiable):** `github.com/FixProve/fixprove`'s About sidebar shows a non-empty description, a website link to `fixprove.dev`, and ≥5 topics. `github.com/FixProve` shows a non-default avatar, a bio, and the `fixprove` repo pinned. `README.md` contains no occurrence of the string "Session 0.2" or "scaffold". A badge row renders at the top of `README.md` and every badge shows a valid/green state (not an error icon).

## Session 4.12-C — fixprove.dev Reality Sync + Social Metadata

**Size:** ≤1 day. **Touches:** `web/src/app/layout.tsx`, landing page copy, one new favicon asset, one new OG image asset.

Must-close list:
- Update the landing page hero/CTA to reflect the CLI is live today: swap "join the waitlist and we'll reach out when the CLI... are ready" for the prepared `pip install fixprove` / `npm install -g fixprove` copy already drafted in `LAUNCH-COPY-BUILD-IN-PUBLIC.md` §1, adjusted so it does **not** imply the GitHub App is installable by third parties (keep "GitHub App" framed as in-progress/CI-integration, not "install it now" — this is the one place this session must actively guard the HARD BOUNDARY, since the source copy needs a compliance pass, not a verbatim copy-paste).
- Add `openGraph` and `twitter` fields to the `metadata` export in `web/src/app/layout.tsx` (currently only `title`/`description` at lines 3-7).
- Add a real social preview image (1200x630) derived from `logo/FP LOGO.png`, referenced from the new `openGraph.images` field.
- Add a favicon (also derived from the existing logo asset) — none exists anywhere under `web/` today.

**Done-check (falsifiable):** viewing `fixprove.dev`'s page source shows `og:title`, `og:description`, `og:image`, and `twitter:card` meta tags with non-empty values. A browser tab open to `fixprove.dev` shows a non-default favicon. The page's visible copy includes an install command (`pip install fixprove` or `npm install -g fixprove`) and does not claim the CLI is not yet available.

## Session 4.12-D — Community Health + Release Hygiene

**Size:** ≤1 day (can be done in parallel with 4.12-C by a second contributor, or sequentially — no dependency between them). **Touches:** `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODE_OF_CONDUCT.md`, the next git tag's release description, one stray tag.

Must-close list:
- Add a minimal bug-report and feature-request issue template under `.github/ISSUE_TEMPLATE/`.
- Add a minimal `.github/PULL_REQUEST_TEMPLATE.md` (a short checklist referencing `CONTRIBUTING.md`'s determinism-test requirement is enough).
- Add a `CODE_OF_CONDUCT.md` (can be a short, direct one matching the project's existing "be direct, be technical, assume good faith" tone from `CONTRIBUTING.md` rather than importing a generic template verbatim).
- Write a real 2-3 sentence description for the *next* tagged release going forward (v0.1.9's own notes are not worth retroactively rewriting).
- Get Yehor's explicit OK, then delete the stray `v0.1.4.bak.1783353789` tag from the public tag list.

**Done-check (falsifiable):** opening a new issue or PR on `github.com/FixProve/fixprove` shows a template, not a blank textbox. `git tag` no longer lists `v0.1.4.bak.1783353789`. The next release after this session has a written description, confirmed by viewing its releases page.

## Session 4.12-E — Sensitive-Content Decision (Yehor-led, not a normal build session)

**Size:** decision + execution, ≤1 day once the decision is made — but the decision itself has no deadline and isn't Claude's to make.

Must-close list:
- Yehor decides the fate of `STRIPE-SETUP-CHECKLIST.md`, `TRADEMARK-FILING-NOTES.md`, `KS-REPORT-0.2-trademark-stripe-scaffold.md` (redact in place / relocate going forward / rewrite history / accept as-is) and records the decision in `MEMORY/critical-actions.md` (this is CA-2-class if history-rewriting or a force-push is chosen).
- Yehor decides the fate of the PyPI "(paid CI)" link label.
- Add `Bookkeeping last update 20.07.26/` to `.gitignore` explicitly (low-risk, bundle in alongside the above since it's the same "don't accidentally publish financial data" concern) — this one item in this session is *not* waiting on a Yehor decision, just needs doing.

**Done-check (falsifiable):** `MEMORY/critical-actions.md` has a new dated entry recording the decision for the three files and the PyPI label. `.gitignore` contains an explicit `Bookkeeping*/` (or equivalent) entry.

---

## Critical path — the smallest set of fixes that makes every public surface stranger-ready

If only one session can run before any public launch push, it's **4.12-B** — it's the highest-leverage, cheapest fix (mostly GitHub UI settings plus two file edits, no code, no new assets to design) and it directly addresses the two BLOCKER-FOR-IMAGE findings a stranger hits in the first 10 seconds (the org page and the repo About sidebar/README). **4.12-C** is the second-most critical — it's the only session that fixes the landing page actively telling visitors to wait for something that already shipped, which is a real, ongoing adoption cost every day it's not fixed. **4.12-D** matters before actively soliciting outside contributions but doesn't block a stranger's first impression as acutely. **4.12-E** is not "polish" at all — despite not fitting the cold-stranger-UX framing this audit was scoped around, it is arguably the highest real-world *risk* item in this entire report, and Yehor should not let its lower position in this ordering read as lower priority; it's ordered last here only because it's a decision, not a build session, and has no dependency on the others.

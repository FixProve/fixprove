NEXT SESSION — 4.18 — "NJORD meets Wednesday; watch for the written answer;
version-sync safeguard and Capturi are the only owed tasks"
Written 2026-08-20 at the close of Session 4.17. Read the git-state section
below rather than assuming — this prompt asserts repo STATE and is untrusted
until checked against the mount, same as every prior starting prompt in this
project. Session 4.17 itself demonstrated why twice: a release run's own
run-level "Success"/"Failure" badge was misleading (job-level inspection
found the real fault), and a piece of relayed remediation guidance proposed
a fix that would have failed for a different, non-obvious reason (registry
immutability) — caught only by reasoning it through before executing, not by
trusting the pasted plan. Re-verify everything below fresh.

SESSION START (Keystone Stage 1 — Intake):
1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (mv, never rm). Reappeared repeatedly
   throughout Session 4.17 (at least 6 times across three separate
   commit/tag/push cycles); the stale-lock accumulation in `.git/` continues
   to grow. Treat a fresh appearance at 4.18's open as completely normal —
   still not urgent, still not blocking.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else. Four prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md`, `state.superseded-4.14-close-
   session-snapshot.md`, `state.superseded-4.15-close-snapshot.md`,
   `state.superseded-4.16-close-snapshot.md`) — none is authoritative; only
   the un-suffixed `state.md` is current.
4. Read `PITFALL-WATCHLIST.md`'s tail and `MEMORY/critical-actions.md`'s
   tail (the Session 4.17 entries — nine of them, recount fresh, don't
   trust that number either) before doing anything with either file.
5. Verify all refs, don't assume:
   * `main` and `origin/main` — expect `a0932c7cf658cfcd2367d04329779d4ad477d75c`
     (Session 4.17's version-parity commit), tag `v0.1.12` pointing at the
     same commit. Re-verify fresh via `git fetch` + `git rev-parse`; do not
     trust this prompt's SHA if it's stale.
   * `drafts/operating-plan-d17-d60`, `drafts/row4-legal-drafts`,
     `held-back-pile-2026-07-28` — not touched in 4.16 or 4.17, not
     re-verified in either; check fresh if relevant.
6. Live-verify, don't assume 4.17's checks are still current:
   * npm `fixprove` — last confirmed `0.1.12` at Session 4.17's close
     (`registry.npmjs.org/fixprove/latest`, `gitHead` matched the commit
     exactly). Re-check if any release work is planned.
   * PyPI `fixprove` — last confirmed `0.1.12` at Session 4.17's close, via
     `pypi.org/project/fixprove/` (the JSON API,
     `pypi.org/pypi/fixprove/json`, returned empty through this sandbox's
     `web_fetch` twice in Session 4.17 — try again fresh, it may be a
     transient gap, but don't be surprised if it's still empty; fall back to
     the HTML project page via Chrome as 4.17 did).
   * `fixprove.dev` routes — not touched or re-checked in 4.16 or 4.17; last
     confirmed HTTP 200 at 4.15's close. Check fresh if relevant.
   * GitHub repo — last confirmed 0 stars/0 forks/0 open issues at 4.17's
     close (Chrome-verified, not just API-assumed). Re-check.
7. **Check for NJORD's written Phase-1 answer.** The meeting is
   **Wednesday 26 August 2026, 16:00–17:00**, in person, at NJORD's Aarhus
   office (TRÆ, Sydhavnen) — accepted by Yehor, scoping brief delivered, both
   confirmed via a fresh Gmail thread read (not Yehor's report alone) at
   4.17's close. If today's date is on or after 26 Aug, check email for any
   follow-up (meeting notes, a written answer, a rescheduling). If today's
   date is before 26 Aug, no lawyer action is expected yet — don't chase.
8. Check Gmail more broadly for anything new: AarhusJS (organizers may have
   settled on a talk format and proposed a date), WasteHero/Kamal (this
   outreach happened via LinkedIn, not Gmail — if a Gmail-reachable channel
   opens, note it, but the primary channel to check is LinkedIn, which this
   sandbox cannot reach directly; ask Yehor for a screenshot if a reply is
   suspected), Cernel.

## What actually changed in Session 4.17 (don't re-derive, read this instead)

- **PITFALL-WATCHLIST.md's pricing-exposure hold: CLOSED.** Open since
  2026-08-08 (Session 4.12-M), carried through 8 sessions. Redacted (the
  count grew from six originally-scoped files to ten — three of the four new
  ones were this project's own session records documenting the exposure,
  which enlarged it during the sessions the decision sat open — a real,
  disclosed finding, not smoothed over). Committed `46264b2`, pushed, live.
  Do not reopen; if a new pricing-adjacent exposure surfaces, it's a new
  finding, not a reason to relitigate this one.
- **Row 4 moved for the first time since outreach was sent.** NJORD proposed
  a meeting, Yehor accepted, and the fact-checked scoping brief was
  delivered as an attachment. This is now the single most likely next
  substantive event in the project — restate this at the top of whatever
  Session 4.18 actually opens with.
- **GTM outreach is now fully sent and identity-confirmed, all three Tier-1
  targets.** Cernel (CEO Andreas Busch, LinkedIn), AarhusJS (organizer Lars
  Gyrup Brink Nielsen, replied, talk format now theirs to choose), WasteHero
  (Tech Lead Mohamed Kamal, LinkedIn profile confirmed exact match to the
  GTM synthesis's target). **Capturi remains held** — its Puzzel-
  independence question was not investigated in 4.16 or 4.17.
- **npm/PyPI both live at `0.1.12`.** The npm-rendered `cli/README.md` now
  has its own `## Privacy` heading (Lars's correct feedback, acted on).
  `v0.1.11` exists as a permanently "skipped" npm version number — correct
  content, just consumed by a mid-session scoping defect before PyPI caught
  up. Cosmetic only; does not need remediation.
- **A version-sync safeguard was proposed, not built.** Concept: a ~5-8
  line check early in `.github/workflows/release.yml`, before any publish
  job, that reads both `cli/package.json`'s and `engine/python/pyproject.
  toml`'s `version` fields and fails the run immediately if they don't
  match. Full writeup in `KS-REPORT-4.17-*.md` §4 and this session's log.
  **Ask Yehor if he wants this built** — cheap, directly prevents the exact
  defect this session hit, no urgency otherwise.

## Standing verification rule, restated because 4.17 needed it

**Run-level CI status is not sufficient for a multi-job release pipeline.**
`v0.1.11`'s release run showed a clear pass/fail badge at the workflow-list
level, but only reading each job individually (via the run's own page, not
the summary) revealed `publish-npm` had succeeded while `publish-pypi` had
failed. Any future session touching `release.yml` or checking a release's
outcome must inspect job-level status explicitly, every time — this is now
a standing rule, not a one-off habit from 4.17.

## Live clocks

| Clock | Date | Status as of 2026-08-20 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Accepted, recompute days-out fresh |
| VAT Q2 filing | 2026-09-01 | 12 days out at 4.17's close — recompute fresh |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |
| Day-60 gate | 2026-08-29 | 9 calendar days out at 4.17's close — recompute fresh |

## Priority for Session 4.18, in order

1. Check for NJORD's written answer (if the meeting has happened by session
   time) or simply confirm the meeting is still on (if it hasn't).
2. Check AarhusJS/Cernel/WasteHero for any replies since 4.17's close.
3. Ask Yehor whether to build the version-sync safeguard — small, scoped,
   ready to go.
4. Capturi's Puzzel-independence question — pick this up if nothing above
   needs immediate attention; it's been sitting since Session 4.16.
5. VAT filing prep — 12 days out as of 4.17's close; getting close enough to
   need attention soon, though not yet urgent.

None of Session 4.17's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting. That boundary remains
untouched and should stay that way absent a new, explicit decision from
Yehor.

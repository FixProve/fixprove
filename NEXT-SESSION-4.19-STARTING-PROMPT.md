NEXT SESSION — 4.19 — "NJORD's written answer is the headline watch;
Kondrup send and the version-sync gate's first live proof are the only
owed tasks"

Written 2026-08-21 at the close of Session 4.18. Read the git-state section
below rather than assuming — this prompt asserts repo STATE and is
untrusted until checked against the mount, same as every prior starting
prompt in this project. Session 4.18 itself demonstrated why three times
over: its own starting prompt (4.18's) carried a one-commit-stale HEAD SHA,
an undercounted CA-entry tally, and a stale claim about a PyPI API outage —
all three caught only by re-verifying fresh rather than trusting the
prompt. Separately, a relayed brief mid-session asserted the
branch-protection bypass was "newly observed, undecided" when it had
actually been formally decided five sessions earlier — caught only by
grepping the project's own prior record before acting, not by trusting the
brief. Re-verify everything below fresh.

SESSION START (Keystone Stage 1 — Intake):

1. Availability line: state which tools/folders/files are reachable. Note
   specifically whether Calendar access covers `yehor.callmedai@gmail.com`
   this time — Session 4.18 only had `egorka30001@gmail.com`, which left
   one genuine gap (see item 7 below).
2. `.git/*.lock` check — rename away (mv, never rm). Reappeared repeatedly
   throughout Session 4.18 (at least 5 times across the build/commit/log
   cycle); the stale-lock accumulation in `.git/` continues to grow.
   Treat a fresh appearance at 4.19's open as completely normal — still
   not urgent, still not blocking.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else. Five prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.17-close-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current.
4. Read `PITFALL-WATCHLIST.md`'s tail and `MEMORY/critical-actions.md`'s
   tail (the Session 4.18 entries — four of them, recount fresh, don't
   trust that number either) before doing anything with either file.
5. Verify all refs, don't assume:
   * `main` and `origin/main` — expect `994e742be35de5f4c38a20175ad98a3aba09152f`
     (Session 4.18's version-sync-gate + NJORD-confirmation commit). Re-verify
     fresh via `git fetch` + `git rev-parse`; do not trust this prompt's SHA
     if it's stale. **Also check whether Session 4.18's close-out commit
     (session log, KS-Report, PROGRESS.md, SESSION-LOG-INDEX.md — committed
     locally at 4.18's close but not confirmed pushed in this prompt) has
     landed on `origin/main` or is still sitting local-only.**
   * `drafts/operating-plan-d17-d60`, `drafts/row4-legal-drafts`,
     `held-back-pile-2026-07-28` — not touched in 4.17 or 4.18, not
     re-verified in either; check fresh if relevant.
6. Live-verify, don't assume 4.18's checks are still current:
   * npm `fixprove` — last confirmed `0.1.12` at Session 4.17's close, not
     re-checked in 4.18 (no release work happened). Re-check if any release
     work is planned.
   * PyPI `fixprove` — same, last confirmed `0.1.12` at Session 4.17's
     close via the JSON API, which 4.18 found working again after 4.17's
     transient gap. Re-check if any release work is planned.
   * `fixprove.dev` routes — not touched or re-checked since 4.15. Check
     fresh if relevant.
   * GitHub repo stars/forks/issues — **not re-checked in Session 4.18**
     (`api.github.com` failed via the sandbox's `curl`; `github.com`'s own
     web pages worked fine via `web_fetch` throughout the session, so this
     is a routing quirk, not a real block — try the web-page route if the
     API route fails again). Last confirmed 0/0/0 at Session 4.17's close.
     Treat as stale, re-check if relevant.
7. **Check for NJORD's written Phase-1 answer.** The meeting is
   **Wednesday 26 August 2026, 16:00–17:00**, in person, at NJORD's Aarhus
   office (TRÆ, Sydhavnen). Session 4.18 confirmed the meeting itself by
   reading the primary Gmail thread directly (not a screenshot alone):
   NJORD's booking and Yehor's written acceptance, scoping-brief PDF
   attached, all confirmed at the source (`1a01a8267835adfc`). **One
   narrower question was deliberately left open, not resolved:** whether
   the separate calendar invite (`invite.ics`, thread `1a01f0a429cc13b3`)
   was ever accepted on `yehor.callmedai@gmail.com`'s calendar — that
   account's calendar was not reachable from Session 4.18. If Calendar
   access now covers that account, check it. If today's date is on or
   after 26 Aug, check email for any follow-up (meeting notes, a written
   answer, a rescheduling). If today's date is before 26 Aug, no lawyer
   action is expected yet — don't chase.
8. Check Gmail more broadly for anything new: AarhusJS (organizers may have
   settled on a talk format), Cernel, WasteHero (this channel is LinkedIn,
   which this sandbox cannot reach directly — ask Yehor for a screenshot if
   a reply is suspected, but independently verify any screenshot's claims
   against a reachable primary source wherever one exists, per Session
   4.18's standing practice, not 4.18's own precedent of accepting a
   screenshot as sufficient on its own).

## What actually changed in Session 4.18 (don't re-derive, read this instead)

- **Version-sync CI safeguard: BUILT, tested, committed, pushed — but
  CI-unproven.** `#KS-TRACE: S4.18-VERSION-SYNC-GATE`, step 2 of
  `release.yml`'s `test` job. 8 adversarial cases pass locally, including
  an exact reproduction of Session 4.17's `v0.1.11` defect. **It has never
  run inside GitHub Actions** — `release.yml` triggers only on `v*.*.*`
  tags, and 4.18's commit was a direct push to `main`. **The next real
  release tag is this gate's first live test.** If Session 4.19 or any
  future session cuts a release, watch this step specifically — confirm
  it runs, confirm it passes (or correctly fails, if a real mismatch is
  ever introduced), and update this gate's status from "locally verified"
  to "CI-verified" only once that's actually observed.
- **CA-5 (branch-protection convention) reaffirmed, not reopened.**
  Session 4.18 corrected a relayed brief that misread this as a new,
  undecided question — it was formally decided 2026-07-21 and remains in
  force unchanged: owner direct-pushes to `main` are permitted, branch
  protection stays enabled, the `remote: Bypassed rule violations` line in
  push output is expected and not an error. **Do not relitigate this
  unless a second committer is ever added to the repo** — that was the
  one condition CA-5 itself named for revisiting it.
- **NJORD row 4 status: meeting CONFIRMED, table Status still OPEN.**
  These are two different facts — don't conflate them again. The written
  Phase-1 answer, not the meeting itself, is what closes Row 4.
- **Capturi is closed as a GTM question.** 100%-owned by Puzzel since 22
  Nov 2024. Do not treat it as a separate outreach target again. The one
  live item from it is the Kondrup draft (see below).
- **Kondrup outreach: DRAFTED, saved to
  `Kondrup-outreach-draft-2026-08-21.md`, NOT sent, NOT committed** (matches
  the existing convention for uncommitted outreach drafts, same as
  AarhusJS's and Cernel's). Two ready-to-paste options inside: a 213-char
  LinkedIn connection note and a longer first-message text. **Ask Yehor
  whether to send** — no urgency, this was backlog, not a live thread.
- **One open anomaly, low priority:** `6d251c5`'s `ci.yml` run
  (`32378841176`) showed a stuck "Status: In progress" with no job
  durations, checked fresh a day after that push. Not chased in 4.18
  because the commit itself is moot (superseded same-session by
  `a0932c7`). If it's still stuck at 4.19's open, or if the pattern
  recurs on a commit that matters, look into it properly.

## Live clocks

| Clock | Date | Status as of 2026-08-21 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Confirmed, recompute days-out fresh |
| Day-60 gate | 2026-08-29 | 8 calendar days out at 4.18's close — recompute fresh |
| VAT Q2 filing | 2026-09-01 | 11 days out at 4.18's close — recompute fresh, getting closer |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |

## Priority for Session 4.19, in order

1. Check for NJORD's written answer (if the meeting has happened by session
   time) or simply confirm the meeting is still on (if it hasn't).
2. Check AarhusJS/Cernel/WasteHero for any replies since 4.18's close.
3. Ask Yehor whether to send the Kondrup draft — small, scoped, ready to go.
4. If a release is planned for any reason, watch the version-sync gate's
   first live run closely — job-level, not run-level, per this project's
   standing rule.
5. VAT filing prep — 11 days out as of 4.18's close; getting close enough
   to need real attention soon.

None of Session 4.18's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting. That boundary remains
untouched and should stay that way absent a new, explicit decision from
Yehor.

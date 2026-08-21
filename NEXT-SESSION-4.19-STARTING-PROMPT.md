NEXT SESSION — 4.19 — "NJORD's written answer is the headline watch;
watch four GTM threads for replies; the version-sync gate's first live
proof is the only owed technical task"

Written 2026-08-21, revised same day after Session 4.18 closed twice — a
first close (commit `c22e9c4`) and a post-close addendum batch after Yehor
took the drafted Kondrup outreach to a separate guide-chat session and sent
it. Read the git-state section below rather than assuming — this prompt
asserts repo STATE and is untrusted until checked against the mount, same
as every prior starting prompt in this project. Session 4.18 demonstrated
why four separate times in one day: its own starting prompt carried a
one-commit-stale HEAD SHA, an undercounted CA-entry tally, and a stale
claim about a PyPI API outage; a relayed brief mid-session asserted the
branch-protection bypass was "newly observed, undecided" when it had been
formally decided five sessions earlier; and a second relayed critique
(from the guide-chat session, post-close) correctly flagged a real
inconsistency but overstated how consistently the project had already
applied it — caught only by checking `KS-REPORT-4.14-*.md` directly, not
by accepting the critique's framing whole. Re-verify everything below
fresh, including this list.

SESSION START (Keystone Stage 1 — Intake):

1. Availability line: state which tools/folders/files are reachable. Note
   specifically whether Calendar access covers `yehor.callmedai@gmail.com`
   this time — Session 4.18 only had `egorka30001@gmail.com`, which left
   one genuine gap (see item 7 below).
2. `.git/*.lock` check — rename away (mv, never rm). Reappeared repeatedly
   throughout Session 4.18 (at least 6 times across the build/commit/log/
   addendum cycle); the stale-lock accumulation in `.git/` continues to
   grow. Treat a fresh appearance at 4.19's open as completely normal —
   still not urgent, still not blocking.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else. Six prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.18-interim-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current. **The 4.18-interim one is
   worth noting specifically: it was this session's own first close,
   superseded hours later the same day by genuinely new information, not
   by a mistake.**
4. Read `PITFALL-WATCHLIST.md`'s tail and `MEMORY/critical-actions.md`'s
   tail (the Session 4.18 entries — five of them as of this writing,
   recount fresh, don't trust that number either) before doing anything
   with either file.
5. Verify all refs, don't assume:
   * `main` and `origin/main` — as of this prompt's writing, `main` is
     `c22e9c4712b708b14155bc8c3f23fabcbe5193c7`, but **a second small
     commit is owed** — the KS-Report and session-log addenda recording
     the Kondrup send were written to the mount after `c22e9c4` was
     pushed, and were NOT yet committed when this prompt was written.
     **Check whether that second commit exists and is pushed.** If it
     isn't, that's 4.19's first housekeeping task, not a blocker to
     anything else — see item 9 below.
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
   narrower question remains deliberately left open, not resolved:**
   whether the separate calendar invite (`invite.ics`, thread
   `1a01f0a429cc13b3`) was ever accepted on `yehor.callmedai@gmail.com`'s
   calendar — that account's calendar was not reachable from Session 4.18.
   If Calendar access now covers that account, check it. If today's date
   is on or after 26 Aug, check email for any follow-up (meeting notes, a
   written answer, a rescheduling). If today's date is before 26 Aug, no
   lawyer action is expected yet — don't chase.
8. **Check all four GTM outreach threads for replies** — Cernel, AarhusJS,
   WasteHero, and **Kondrup (new this session — sent, not yet confirmed
   received or replied to)**. Kondrup's channel is LinkedIn, which this
   sandbox cannot reach directly — ask Yehor for a screenshot if a reply is
   suspected, but independently verify any screenshot's claims against a
   reachable primary source wherever one exists. This is now a
   three-times-demonstrated project rule (the NJORD screenshot, the
   branch-protection framing, and the "static analysis consistency" claim
   all needed independent checking before being trusted whole) — not a
   one-off habit.
9. **Housekeeping: commit and push the Kondrup-send addenda, if not already
   done.** Two git-tracked files need a small commit:
   `KS-REPORT-4.18-version-sync-gate-njord-confirmation-capturi-close.md`
   (§7 addendum) and the Session 4.18 session log (trailing addendum).
   `MEMORY/critical-actions.md` is gitignored, no commit needed for it.
   `Kondrup-outreach-draft-2026-08-21.md` stays uncommitted by existing
   convention (matches AarhusJS's and Cernel's drafts) even though it's
   now sent. Verify per-job CI green on whatever commit lands this, same
   as every push this project.

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
  Nov 2024. Do not treat it as a separate outreach target again.
- **Kondrup outreach: SENT.** Via LinkedIn, Yehor-reported, **not
  independently verified by this session** (no LinkedIn access here —
  same limitation as every prior LinkedIn-channel action this project has
  recorded). Sent via a connection note revised in a separate guide-chat
  session — the final text differs materially from this session's own
  draft; both are archived, with the actual sent text and full reasoning
  trail, in `Kondrup-outreach-draft-2026-08-21.md`'s own addendum. **No
  action needed until/unless he replies.**
- **A guide-chat critique of this session's own draft was checked against
  the project's record, not accepted whole.** It correctly flagged this
  session's Option B for using "static analysis" — a phrase Session
  4.14's D2 positioning decision moved away from — and that check is real
  (verified directly against `KS-REPORT-4.14-*.md`). But its scope, as
  actually recorded, was `web/src`/`README.md`/`cli/README.md` only, never
  outreach drafts, and two already-sent artifacts from this same week's
  GTM push (`LINKEDIN-CAROUSEL-FINAL-DRAFT-2026-08-19.md`,
  `Tier1-outreach-drafts-2026-08-19.md`) already use the same phrase. The
  preference is real; the premise that outreach copy had already been
  consistent about it wasn't, and the record now says so precisely. No
  live harm — the flagged phrase was never in the text actually sent.
- **One open anomaly, low priority, unchanged:** `6d251c5`'s `ci.yml` run
  (`32378841176`) showed a stuck "Status: In progress" with no job
  durations, checked a day after that push. Not chased in 4.18 because the
  commit itself is moot (superseded same-session by `a0932c7`). If it's
  still stuck at 4.19's open, or the pattern recurs on a commit that
  matters, look into it properly.

## Live clocks

| Clock | Date | Status as of 2026-08-21 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Confirmed, recompute days-out fresh |
| Day-60 gate | 2026-08-29 | 8 calendar days out at 4.18's close — recompute fresh |
| VAT Q2 filing | 2026-09-01 | 11 days out at 4.18's close — recompute fresh, getting closer |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |

## Priority for Session 4.19, in order

1. Commit and push the Kondrup-send addenda if not already done (item 9
   above) — small, mechanical, no decision required.
2. Check for NJORD's written answer (if the meeting has happened by
   session time) or simply confirm the meeting is still on (if it hasn't).
3. Check all four GTM threads (Cernel, AarhusJS, WasteHero, Kondrup) for
   any replies since 4.18's close.
4. If a release is planned for any reason, watch the version-sync gate's
   first live run closely — job-level, not run-level, per this project's
   standing rule.
5. VAT filing prep — 11 days out as of 4.18's close; getting close enough
   to need real attention soon.

None of Session 4.18's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting. That boundary remains
untouched and should stay that way absent a new, explicit decision from
Yehor.

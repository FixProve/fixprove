NEXT SESSION — 4.22 — "One meeting to read the outcome of, everything
else genuinely quiet"
Written 2026-08-25, Session 4.21 TRUE close. Session 4.21 found and fixed
a real continuity defect: a Session 4.19 resolution (the NJORD-calendar
event is a deliberate personal prep reminder, not a defect) had silently
dropped out of `state.md` between Session 4.20's interim snapshot and its
TRUE close, causing this session's own opening pass to re-flag it. Fixed
at the root — the resolution now lives as a standalone DURABLE NOTE, not
narrative — not just re-settled by trust. No code touched, no calendar
edit made. Every number below was correct as of 2026-08-25 — recompute
the live clocks fresh at session open rather than trusting this file,
same standing rule as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable.
   Note specifically whether Calendar access now covers
   `yehor.callmedai@gmail.com` — as of Session 4.21's close it still only
   covers `egorka30001@gmail.com` (confirmed via `list_calendars`),
   leaving the `.ics` invite accept-status gap open (non-urgent).

2. **`.git/*.lock` check** — rename away (`mv`, never `rm`). If a stale
   lock is found anywhere under `.git/refs/**`, an in-place rename is NOT
   sufficient — move it fully outside the `.git/refs/` tree (e.g. to
   `.git-stale-locks/`), or `git fetch` can fail with `fatal: bad object`
   (standing rule since Session 4.20). The routine `index.lock`/
   `maintenance.lock` recreation-after-every-command pattern (can't
   `unlink` on this mount, only `mv`) is unchanged and still cosmetic —
   Session 4.21 hit exactly this, a stale 0-byte `index.lock`, routine.

3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Twelve prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.21-interim-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current. **Read the DURABLE NOTE in
   Reload Question (c) before treating any early-dated calendar event as
   a possible scheduling defect** — this is the second session running
   that pattern has needed resolving; the note exists specifically so a
   third re-litigation doesn't happen.

4. **Verify `main` and `origin/main` fresh, don't assume from this
   prompt.** At the time this prompt was finalized (2026-08-25, same
   session, pre-push), local `main` carries one new commit on top of
   `993a31e`, holding Session 4.21's own close (`KS-REPORT-4.21-*.md`,
   this session's log, `SESSION-LOG-INDEX.md`, this file — `PROGRESS.md`
   and `MEMORY/state.md` are both gitignored, mount-only, not part of
   that commit), not yet pushed — Yehor pushes it himself per the
   standing CA-class convention. **Don't trust any specific hash quoted
   for this not-yet-pushed commit — a commit's own hash can't be known
   with certainty from inside a file that becomes part of it. Re-verify
   fresh: run `git log -1 --oneline` for the true hash, and check
   whether `origin/main` already matches local `main`, or whether a push
   is still owed.**

5. **CI job-level check on whatever the new HEAD is**, per the standing
   CA-5 mandatory post-push obligation — job-level, not run-level, same
   as every prior session. Use the commit's own `/checks` page
   (`github.com/<owner>/<repo>/commit/<sha>/checks`) and each job's own
   run page if the workflow-scoped run-list page comes back stale/cached
   — the pattern from Sessions 4.20 and 4.21's own closes.
   `api.github.com`/`gh` remain unreachable from this sandbox, consistent
   with every prior session.

6. **Check whether the NJORD meeting happened and for a written
   Phase-1 answer.** The meeting was **Wednesday 26 August 2026,
   16:00–17:00**, in person, at NJORD's Aarhus office (TRÆ, Sydhavnen) —
   confirmed by direct primary-source Gmail thread read, re-confirmed
   fresh at Session 4.21's close (1 day out at that point). **If today's
   date is on or after 26 Aug, the meeting has happened — check email for
   meeting notes, a written answer, or a rescheduling.** If today is
   before 26 Aug, no lawyer action is expected yet — don't chase. **Also
   check the separate `.ics` invite's accept-status**, if Calendar access
   now covers `yehor.callmedai@gmail.com` (thread `1a01f0a429cc13b3`) — a
   visibility gap, not a suspected defect, unchanged since Session 4.19.
   **Do not re-flag the `egorka30001@gmail.com` "Njord meeting Traæ
   26.08.26" event's own date/title as a defect — see item 3 above.**

7. **Check all four GTM outreach threads for replies** — Cernel,
   AarhusJS, WasteHero, Kondrup. As of Session 4.21's close, none had
   replied. AarhusJS (Lars) specifically: Yehor sent format options
   2026-08-20 14:00; no reply to that specific message as of 4.21's close
   (6 days silent at that point) — not treated as stalled or urgent, an
   optional light nudge is Yehor's own call, not queued as a default
   action. Cernel, WasteHero, and Kondrup are all LinkedIn-channel, not
   email — `search_threads` returning zero hits for them is expected, not
   a gap; ask Yehor for a screenshot if a reply is suspected, and
   independently verify any relayed claim against a reachable primary
   source wherever one exists, per this project's now well-established
   rule (nine-plus documented instances across the project).

8. **VAT Q2 2026 is CLOSED — filed 2026-08-24, independently verified
   against the actual TastSelv receipt.** Do not re-open or re-prompt
   Yehor to file it. The next VAT clock is Q3 2026, due **1 December
   2026** — 98 days out at Session 4.21's close, not yet a near-term item
   worth dedicated attention this session.

## What actually happened in Session 4.21 (don't re-derive, read this
## instead)

- **No code, no build, no deploys, no calendar changes.** A
  verification-and-record-repair session.
- **Session-start's own opening pass re-flagged a calendar event Session
  4.19 had already resolved** (the `egorka30001@gmail.com` "Njord
  meeting Traæ 26.08.26" event, dated one day before the confirmed
  meeting, as a possible scheduling defect), because that resolution's
  explanation had silently dropped out of `state.md` before this session
  opened. Yehor relayed a guide-chat correction and explicitly asked for
  independent verification, not trust.
- **Verified genuine against five internal sources** (`KS-REPORT-4.19-
  *.md` §2–4, two superseded `state.md` snapshots, the 4.20 starting
  prompt, `PROGRESS.md`) before being accepted — corroborated, not
  fabricated by the relay.
- **Root cause found and fixed, not just the symptom re-settled.** The
  resolution had survived into `state.superseded-4.20-interim-
  snapshot.md` but was dropped from Session 4.20's own TRUE-close
  `state.md` and the 4.21 starting prompt, because it had been recorded
  as passing narrative rather than a durable, quotable note.
  `MEMORY/state.md` now carries it as a standalone "DURABLE NOTE," with
  its own honest limit stated plainly (Yehor's attestation only, not
  independently verifiable from the calendar object, not to be
  auto-applied to a future early-dated event without the same standing
  explanation). **No calendar edit was made or is planned.**
- **A relayed praise-summary of this fix was itself checked** against
  what was actually written before being treated as accurate — both its
  named claims verified true.
- **Session-start checks, fresh, no drift.** `origin/main = main =
  993a31e` (Session 4.20's own already-pushed addendum commit — not new
  drift). CI run `32745659225` (CI #70): `build` 56s, `test-python` 38s,
  both green. One stale `.git/index.lock` renamed away, routine.
- **NJORD and GTM checked fresh, unchanged in substance from 4.20.**
- **No CA-class action was taken by the assistant.** No money, repo-
  visibility, in-name publishing, report/log/MEMORY deletion, or
  instruction changes occurred.

## Live clocks

| Clock | Date | Status as of 2026-08-25 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Confirmed, 1 day out at 4.21's close — recompute fresh |
| Day-60 gate | 2026-08-29 | 4 days out at 4.21's close — recompute fresh |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT, 17 days out at close |
| VAT Q2 2026 | ~~2026-09-01~~ | **CLOSED — filed 2026-08-24** |
| VAT Q3 2026 | 2026-12-01 | 98 days out at close — not yet near-term |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |

## Priority for Session 4.22, in order

1. **Re-verify whether Session 4.21's close was pushed** — this prompt
   records it as committed locally, push handed to Yehor; confirm
   `origin/main` fresh rather than trust the file, same standing rule as
   always. If pushed, run the CA-5 job-level CI check on the new HEAD.
2. Check whether the NJORD meeting (26 Aug) has happened; if so, watch
   for a written Phase-1 answer.
3. Check all four GTM threads for replies; consider whether Yehor wants
   the optional AarhusJS nudge sent.
4. **Read the DURABLE NOTE in `MEMORY/state.md` before re-flagging any
   early-dated calendar event as a possible defect.**
5. If a release is planned for any reason, watch the version-sync gate's
   first live run closely — job-level, not run-level, per this project's
   standing rule; it has never yet run inside GitHub Actions.
6. No other time-sensitive item is due this session. VAT Q3 2026
   (1 December) is 98 days out — not worth dedicated attention yet.

None of Session 4.21's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

NEXT SESSION — 4.20 — "NJORD's written answer is still the headline
watch; the meeting itself happens two days after this prompt was
written; everything else is routine watch-and-wait"

Written 2026-08-22, Session 4.19 close. Session 4.19 was verification-
only: no code, no build, no deploys. It opened by catching that its own
starting prompt (4.19's) and the pre-session `MEMORY/state.md` both
carried a one-commit-stale git-state claim — read the git-state section
below rather than assuming, same as every prior starting prompt in this
project. Re-verify everything in this prompt fresh; it is untrusted until
checked against the mount, same standing rule as always.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable.
   Note specifically whether Calendar access now covers
   `yehor.callmedai@gmail.com` — as of Session 4.19's close it still only
   covers `egorka30001@gmail.com`, which leaves one narrow gap open (see
   item 6 below).

2. **`.git/*.lock` check** — rename away (`mv`, never `rm`). Two stale
   locks were found and renamed at Session 4.19's own open; this pattern
   is well-established and non-urgent by now, not worth flagging as new
   unless the count meaningfully jumps.

3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Nine prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.19-interim-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current.

4. **Verify `main` and `origin/main` fresh, don't assume from this
   prompt.** At the time this prompt was written, Session 4.19's own new
   files (`KS-REPORT-4.19-*.md`, its session log, `SESSION-LOG-INDEX.md`
   and `NEXT-SESSION-4.20-STARTING-PROMPT.md` itself) were staged for a
   local commit at session close, with `git push` handed to Yehor as a
   copy-paste command — **not run by the assistant**. Check whether that
   push happened. If `origin/main` is still behind local `main`, that is
   this session's first housekeeping item — not a blocker to anything
   else, and not a defect, since push has always been Yehor's own hands
   per the CA-5 convention.

5. **CI job-level check on whatever the new HEAD is**, per the standing
   CA-5 mandatory post-push obligation — job-level, not run-level. Note:
   the last verified CI check (Session 4.19, on `a3a10de`) used a
   `web_fetch` scrape of GitHub's rendered Actions page, not the GitHub
   API — `api.github.com` remains unreachable from this sandbox. If a
   first fetch of the general Actions run-list looks short (missing
   recent commits), **don't conclude CI didn't run** — re-fetch the
   workflow-scoped URL with a cache-busting parameter before drawing any
   conclusion. This was a real, reproducible gotcha in Session 4.19, not
   a one-off.

6. **Check for NJORD's written Phase-1 answer.** The meeting is
   **Wednesday 26 August 2026, 16:00–17:00**, in person, at NJORD's Aarhus
   office (TRÆ, Sydhavnen) — confirmed by direct primary-source Gmail
   thread read in Session 4.18, unchanged since. As of this prompt's
   writing (2026-08-22), the meeting is still two days out — **not
   expected yet**. If today's date is on or after 26 Aug, check email for
   any follow-up (meeting notes, a written answer, a rescheduling). If
   before, no lawyer action is expected — don't chase.

   **Also check the separate `.ics` invite's accept-status**, if Calendar
   access now covers `yehor.callmedai@gmail.com` (thread
   `1a01f0a429cc13b3`) — this is a visibility gap, not a suspected
   defect, per Yehor's own framing in Session 4.19; no urgency either way.

   **One closed, unrelated item worth knowing so it isn't re-opened by
   mistake:** a separate calendar event on `egorka30001@gmail.com`, dated
   2026-08-25 (title reads "26.08.26"), is a **deliberate** one-day-early
   personal prep reminder — Yehor's own design, confirmed directly to the
   assistant in Session 4.19. Not a scheduling error. Do not re-flag it.

7. **Check all four GTM outreach threads for replies** — Cernel,
   AarhusJS, WasteHero, Kondrup. As of Session 4.19's close, none had
   replied. Cernel, WasteHero, and Kondrup are all LinkedIn-channel, not
   email — `search_threads` returning zero hits for them is expected, not
   a gap; ask Yehor for a screenshot if a reply is suspected, and
   independently verify any screenshot's claims against a reachable
   primary source wherever one exists, per this project's now
   well-established rule (demonstrated on the NJORD screenshot, the
   branch-protection framing, the "static analysis" consistency claim,
   and the calendar-event correction itself — checking relayed claims is
   standard practice here regardless of whether they're corrective or
   complimentary in tone).

## What actually happened in Session 4.19 (don't re-derive, read this
## instead)

- **No code, no build, no deploys.** A verification-only session.
- **Stale git-state claim caught and corrected.** The 4.19 starting
  prompt and pre-session `state.md` both claimed `main = c22e9c4` with a
  commit "owed." It was already `main = origin/main = a3a10de` — the
  claim was stale, the repo wasn't. No repo action was needed.
- **CI job-level status verified for `a3a10de`: Success**, `build` 44s,
  `test-python` 42s, both green, benign Node.js-20 deprecation notices
  only. Verified after catching a stale/cached `web_fetch` of GitHub's
  general Actions run-list (see item 5 above for the gotcha, now
  standing knowledge for this project).
- **Calendar-event "discrepancy" resolved as intentional, not a
  defect.** See item 6 above — do not re-raise this.
- **A relayed praise-summary of this session's own handling was
  independently checked, not just accepted.** Its two named catches
  (stale-cache re-fetch; declining to over-claim the calendar
  correction) both held up against the actual record.
- **No CA-class action was taken or required this session.** No money,
  repo-visibility, in-name publishing, report/log/MEMORY deletion, or
  instruction changes occurred.

## Live clocks

| Clock | Date | Status as of 2026-08-22 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Confirmed, recompute days-out fresh |
| Day-60 gate | 2026-08-29 | 7 calendar days out at 4.19's close — recompute fresh |
| VAT Q2 filing | 2026-09-01 | 10 days out at 4.19's close — recompute fresh, getting close |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |

## Priority for Session 4.20, in order

1. Confirm Session 4.19's new files landed on `origin/main` (or push them
   if Yehor hasn't yet) — small, mechanical, no decision required.
2. Check for NJORD's written answer once 26 Aug has passed; otherwise
   just confirm the meeting is still on.
3. Check all four GTM threads for replies.
4. **VAT Q2 filing prep** — 10 days out as of 4.19's close, now the
   closest real deadline outside the NJORD gate. Worth a dedicated look
   this session or the next.
5. If a release is planned for any reason, watch the version-sync gate's
   first live run closely — job-level, not run-level, per this project's
   standing rule; it has never yet run inside GitHub Actions.

None of Session 4.19's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting. That boundary remains
untouched and should stay that way absent a new, explicit decision from
Yehor.

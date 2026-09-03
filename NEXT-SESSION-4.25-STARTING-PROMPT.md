NEXT SESSION — 4.25 — "NemKonto route decision, then the 8 Sep grant
application — everything else stays a watch item"

Written 2026-09-02, Session 4.24 close. Session 4.24 processed a large
guide-chat relay from Yehor (a decision to pause both NJORD engagements
and pursue grant funding instead), independently verified it rather than
acting on it as given — catching five real defects along the way — and
built a working funding/NemKonto tracker. **`mcp__workspace__bash` was
denied for this entire session: no commit, no push, no real `git status`
was possible.** Every number below was correct as of 2026-09-02 — recompute
the live clocks fresh at session open rather than trusting this file, same
standing rule as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable.
   **Check `mcp__workspace__bash` (or equivalent shell access) first and
   explicitly** — Session 4.24 had none at all, a harder limitation than
   any prior session's "chose not to push." If bash is available this
   session, run a real `git status`/`git fsck` before trusting any
   git-state claim in this file — Session 4.24's git-state claims rest
   only on direct `.git/refs/*` file reads, not a real status pass, and a
   real uncommitted-file backlog has now accumulated across several
   sessions without a `git status` to characterize it precisely. Also
   check whether Calendar access now covers `yehor.callmedai@gmail.com`
   — unchanged since Session 4.21, still only `egorka30001@gmail.com` as
   of Session 4.24's close.

2. **`.git/*.lock` check** — rename away (`mv`, never `rm`), and if a
   stale lock is found under `.git/refs/**`, move it fully outside the
   `.git/refs/` tree (`.git-stale-locks/`), not just an in-place rename —
   standing rule since Session 4.20. **This could not be checked at all
   in Session 4.24** (no bash) — treat it as unchecked, not "clean,"
   until a real scan runs.

3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Read the **five** DURABLE NOTEs in Reload
   Question (c): the calendar prep-reminder pattern, the "D5 does not
   exist" note, the live-channel verification note for relayed
   real-world-event claims (now explicitly extended to the assistant's
   own `WebSearch` output, not just human-relayed claims), the
   never-presume-a-money-decision note, and the **new** note this session
   added — a relayed guide-chat's funding/eligibility research is a lead,
   not a fact, for any claim carrying a real date, price, or eligibility
   rule, however polished or internally consistent it reads.

4. **Verify `main` and `origin/main` fresh** — Session 4.24 read both
   directly as `f3aa6cc` via `.git/refs/*` file reads (no bash available
   to run `git fetch`/`git log`), unchanged since Session 4.22. **Verify
   properly this time** if bash access allows it — Yehor's own commit/push
   of `PITFALL-WATCHLIST.md` + `RUNBOOK-SESSION-OPERATING.md` (still
   sitting modified, uncommitted, since Session 4.22) could have landed
   by now, and Session 4.24's own new/edited files
   (`FUNDING-NEMKONTO-PROGRESS-TRACKER.md`, `KS-REPORT-4.24-*.md`, this
   session's log, the `SESSION-LOG-INDEX.md`/`PROGRESS.md` edits) are
   also sitting uncommitted and could be swept in too.

5. **CI job-level check on the current HEAD** — not re-verified in
   Session 4.24 (no bash, and the session's focus stayed on the funding/
   NemKonto thread throughout). Last known: `f3aa6cc` = run #72
   (`32858388016`), both jobs green, as of Session 4.22's verification.
   Re-check fresh if HEAD has moved.

6. **NemKonto route decision — the P0 for this session.** Read
   `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` §1 in full. Three routes were
   double-checked live in Session 4.24: **A — Nordea Erhverv** (245kr/mo,
   verified live, no open questions); **B — Lunar Business** (~289kr/mo,
   NOT verified live — `lunar.app` was blocked in that session's browser,
   worth a direct check before Yehor commits); **C — a foreign-institution
   account** (Revolut/Wise/etc., potentially free or near-free, officially
   real via `nemkonto.dk`'s own foreign-institution application, but
   slower/less certain — one anecdotal timing report of 3-4 weeks under
   the old paper process — and carrying an open bookkeeping-compliance
   question about personal/freelancer-tier products for a registered
   enkeltmandsvirksomhed). Ask Yehor directly which route he wants; do not
   guess or default silently to Nordea just because it's the
   best-verified option — that's this session's own opinion, not his word
   yet, per this project's "missing or vague → stop and ask" intake rule.

7. **"Tag din virksomhed til næste niveau" application — hard deadline 8
   Sep 2026, 12:00.** Check the date first: if this session opens on or
   after 8 Sep 2026 12:00, the deadline has passed — say so plainly, don't
   silently attempt a late application. If there's still time: open
   `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` §2, read the live page's actual
   5 application questions and scoring criteria (not yet done as of this
   writing), and ask Yehor to paste the real application-form fields once
   he opens it — draft the narrative to the real fields, not guessed
   ones. The 70-hour participation route is already confirmed; no new
   decision needed there.

8. **Check whether NJORD has replied** to Yehor's pause message (sent
   2026-09-02T15:39:01Z, thread `1a062be715af4ce6`). Same-day send at
   4.24's close — likely still too soon, but check fresh rather than
   assume silence continues.

9. **BeyondBeta Pre-Accelerator** — `FUNDING-NEMKONTO-PROGRESS-TRACKER.md`
   §4, not yet independently verified beyond one search pass. Open
   `beyondbeta.dk/pre-accelerator` directly and confirm what "register"
   actually means there before telling Yehor to act on it — next in the
   funding-door queue if there's time after §6/§7 above.

10. **Confirm whether the AI Tinkerers Copenhagen application steps
    actually went through**, and whether the event page's internal date
    inconsistency (Sept 15 vs Sept 16) has resolved. Carried forward
    unverified from Session 4.23, **not re-checked in Session 4.24** (the
    session's attention went entirely to the funding relay). Still no
    connector for that platform — Yehor's own word is the only evidence
    available.

11. **Check all four GTM outreach threads for replies** — Cernel,
    AarhusJS, WasteHero, Kondrup. Unchanged through Session 4.24 — no new
    replies (only the pre-existing 2026-08-20 AarhusJS reply, already
    known). Cernel/WasteHero/Kondrup are LinkedIn-channel, zero Gmail hits
    is expected, not a gap.

12. **ivsr.dk case K145X8** — signed documents returned 2026-08-29, well
    inside their 14-day window (deadline 2026-09-12). Their own stated
    average turnaround is 2-4 weeks from the original case open — do not
    chase before roughly mid-to-late September.

13. **VAT Q2 2026 is CLOSED — filed 2026-08-24.** Do not re-open or
    re-prompt Yehor to file it. Next VAT clock is Q3 2026, due
    **1 December 2026** — 90 days out at Session 4.24's close, not yet a
    near-term item.

## What actually happened in Session 4.24 (don't re-derive, read this
## instead)

- **`mcp__workspace__bash` was denied for the entire session.** No
  commit, no push, no real `git status`/`git fsck`/lock-file scan was
  possible at any point. Git state was checked only via direct
  `.git/refs/heads/main` and `.git/refs/remotes/origin/main` file reads
  (both `f3aa6cc`, matching) — weaker evidence than a real status pass.
  Every write this session used the `Write`/`Edit` file tools with a
  fresh `Read` afterward as the verification step, since write-to-new-
  name-then-`mv` requires a shell.
- **NJORD's incoming reply arrived and was read in full** (thread
  `1a0583baf61a4e21`, 2026-09-02T09:23:41Z): confirms the 30,000kr
  FixProve Phase-1 estimate and a 6,000kr CRA-step-1 estimate, and
  materially clarifies that **11 September 2026 is when the CRA Article
  14 reporting obligation starts applying — not a submission deadline.**
- **Yehor relayed a large guide-chat block** (pause-NJORD decision,
  LinkedIn post/reply with a screenshot, a 19-program funding-landscape
  table). **None of it was acted on as given.**
- **NJORD's pause independently verified as actually sent** — Gmail
  direct read, thread `1a062be715af4ce6`, 2026-09-02T15:39:01Z. Matches
  the relayed decision exactly.
- **Five real defects found and fixed** in the relayed funding table and
  in `WebSearch`'s own first-pass answers, all caught by going to each
  program's own live page: a closed "NextStep" scheme conflated with its
  live successor "Tag din virksomhed til næste niveau" (different terms,
  34,000kr not 24,000kr, 100% not 75% coverage); a missed participation
  cost (70hrs or 8,000kr+moms) on that same live program; a stale
  `WebSearch` Mikrolegat deadline (search said 15 May, live page confirms
  15 September, correcting `WebSearch` not the relay); a flat-wrong
  `WebSearch` claim that Wise/Revolut can't be a NemKonto (resolved via
  `nemkonto.dk`'s own foreign-institution page: they officially can, via
  a separate, slower application); and a NemKonto-sourcing claim that
  didn't match this project's own record (the real fact — no NemKonto
  registered, confirmed 2026-08-04 — was already correctly logged in
  `PITFALL-WATCHLIST.md` Row 6; the relay's specific attribution wasn't).
- **`FUNDING-NEMKONTO-PROGRESS-TRACKER.md` built and refined**, four
  edits, fresh-Read-verified at close. §2 (the live grant, deadline 8 Sep)
  is the priority; §1 (NemKonto route) is the other open decision; §3
  (Mikrolegat) is closed — Yehor confirmed not eligible; §4 (BeyondBeta)
  is next in line, unopened; §5 (everything else) is deprioritized, not
  re-verified.
- **A defect in this session's own close-out process was caught and
  fixed before finishing:** `MEMORY/state.md` was overwritten without
  first preserving the prior (Session 4.23) version, breaking this
  project's own snapshot-preservation convention. Caught immediately;
  `MEMORY/state.superseded-4.23-close-snapshot.md` was written from the
  full content already in this session's own context, restoring the
  convention before the session actually closed.
- **No CA-class action was taken by the assistant.** No money moved (the
  pause was Yehor's own decision and his own sent email), no repo-
  visibility change, no in-name publishing by the assistant, no report/
  log/MEMORY-file deletion, no instruction change. No commit, no push —
  not by choice, by tool denial. No calendar edit.

## Live clocks

| Clock | Date | Status as of 2026-09-02 |
|---|---|---|
| "Tag din virksomhed til næste niveau" application | 2026-09-08, 12:00 | **6 days out — new this session, hard deadline, not yet applied** |
| Day-60 gate ("first real dollar") | 2026-08-29 | MISSED — dispositioned 4.23, unchanged |
| D3 demand-test window | 2026-08-14 → 2026-11-12 | 71 days out at close — running |
| NJORD reply to the pause | (no fixed date) | Sent 2026-09-02, too soon to expect a reply |
| EU CRA Art. 14 reporting | 2026-09-11 | 9 days out — clarified as a rules-start date, not a submission deadline |
| ivsr.dk case K145X8 | (no fixed date) | Signed docs returned 2026-08-29, hold until mid/late Sept |
| VAT Q3 2026 | 2026-12-01 | 90 days out at close — not yet near-term |

## Priority for Session 4.25, in order

1. **Confirm bash/shell access status first, explicitly.** If available,
   run a real `git status` before any other git-state claim is trusted —
   Session 4.24 had none at all and could only read refs directly.
2. **NemKonto route decision** (tracker §1.1) — ask Yehor to choose
   between Nordea (verified), Lunar (unverified live), or the
   foreign-institution route (real but slower/uncertain); don't default
   silently.
3. **"Tag din virksomhed til næste niveau" application** (tracker §2) —
   check the 8 Sep 12:00 deadline hasn't passed, open the actual
   application questions, draft once Yehor supplies the real form fields.
4. Check NJORD's pause reply, if any.
5. Open and verify BeyondBeta (tracker §4) if time allows after 2-3.
6. Confirm AI Tinkerers application status / date-inconsistency
   resolution, and check all four GTM threads — both carried forward
   unverified/unchanged from Session 4.23, neither re-checked in 4.24.
7. Read all five DURABLE NOTEs in `MEMORY/state.md` before re-flagging
   any early-dated calendar event, before recording any decision label
   you haven't personally grepped for, before drafting any reply that
   touches a payment figure, and before treating any relayed research
   (guide-chat or `WebSearch` alike) as fact rather than a lead.

No other time-sensitive item is due this session. ivsr.dk (mid/late
Sept), CRA Art. 14 (9 days out but now clarified as non-urgent unless an
actual incident occurs), and VAT Q3 (1 December) are none of them
near-term action items yet.

None of Session 4.24's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

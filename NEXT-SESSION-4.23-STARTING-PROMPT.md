NEXT SESSION — 4.23 — "Disposition one gate, watch one inbox,
everything else quiet"

Written 2026-08-28, Session 4.22 TRUE close. Session 4.22 was a
verification-and-record-keeping session: three pasted "guide-chat relay"
blocks arrived, each instructing specific register writes, and two of
their premises were checked and found FALSE before anything was written —
an "empty document" claim (the uploaded PDF was read directly and in full;
the transport failure was local to the relaying session, not this one) and
a fabricated "D5" decision (only D4 was ever adopted, 2026-08-19; a prior
proposal to bundle "D4 + D5" is explicitly recorded as **not adopted** five
sessions earlier). What verified true was recorded: the CRA follow-up
email is SENT, NJORD's written notes have NOT arrived, "customer" occurs 6
times in public copy (reclassified as a legal-text amendment, nothing
changed), and the LinkedIn post + Sissi Bak follow-up are POSTED/SENT on
Yehor's own direct word. **No code touched, no calendar edit, no commit
or push.** Every number below was correct as of 2026-08-28 — recompute the
live clocks fresh at session open rather than trusting this file, same
standing rule as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable.
   Note specifically whether Calendar access now covers
   `yehor.callmedai@gmail.com` — as of Session 4.22's close it still only
   covers `egorka30001@gmail.com` (unchanged since Session 4.21;
   independently unaffected by this session's work).
2. **`.git/*.lock` check** — rename away (`mv`, never `rm`). If a stale
   lock is found anywhere under `.git/refs/**`, an in-place rename is NOT
   sufficient — move it fully outside the `.git/refs/` tree (e.g. to
   `.git-stale-locks/`), or `git fetch` can fail with `fatal: bad object`
   (standing rule since Session 4.20). The routine `index.lock`/
   `maintenance.lock` recreation-after-every-command pattern (can't
   `unlink` on this mount, only `mv`) is unchanged and still cosmetic —
   Session 4.22 found and moved two stale ones (`HEAD.lock`,
   `maintenance.lock`, both dated 2026-08-25, neither inside `refs/`),
   routine.
3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Thirteen prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.21-close-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current. **Read BOTH durable notes
   in Reload Question (c) before acting:** the calendar prep-reminder
   pattern (unchanged from 4.21, carried forward for continuity), and the
   NEW note that "D5" is not a real decision — only D4 was ever adopted.
   If any future relayed message references a decision label not found by
   a direct `grep` of `MEMORY/critical-actions.md`, treat it as unverified
   until checked.
4. **Verify `main` and `origin/main` fresh, don't assume from this
   prompt.** As of Session 4.22's close: `origin/main = main = f3aa6cc`,
   confirmed via `git fetch` + `git log -1 --oneline` on both refs. No
   push occurred during Session 4.22. **Re-verify fresh anyway** — a
   further commit or push could exist by the time you read this,
   including Yehor's own commit/push of the `PITFALL-WATCHLIST.md` diff
   left open by 4.22 (see item 7 below).
5. **CI job-level check on the current HEAD.** As of Session 4.22's close:
   `f3aa6cc` (HEAD) verified via the commit's own `/checks` page and each
   job's own run page as **run #72** (`32858388016`) — `build` succeeded
   54s, `test-python` succeeded 39s, both green, only the standing benign
   Node.js-20 deprecation annotation. Note this is one run later than the
   4.22 starting prompt's own reference to "#71 on 48181d4" — `f3aa6cc` is
   itself a new commit and triggered its own CI run; this is the expected
   pattern, not drift. `api.github.com`/`gh` remain unreachable from this
   sandbox, consistent with every prior session. **Re-verify fresh if a
   further push has happened since** — if Yehor has pushed the
   `PITFALL-WATCHLIST.md` commit, there will be a new HEAD and a new CI
   run to check.
6. **Disposition the Day-60 gate — the one concrete task this session
   owes, date-gated.** The gate ("first real dollar," 2026-08-29) was due
   the day after Session 4.22 closed. **If today's date is on or after
   2026-08-29, this is P0:** record it as **MISSED** in
   `MEMORY/critical-actions.md`, append-only, dated. Cause: **D4's own
   demand-first/Gate-1-before-charging sequencing** (not a separate "D5" —
   see the DURABLE NOTE in `state.md`), which made revenue by 29 Aug
   structurally unreachable once the legal-review path became the
   bottleneck. Re-anchor the revenue expectation to the **D3 demand-test
   window** (through 2026-11-12, threshold ≥3–5 hand-picked-team installs
   AND ≥1 willingness-to-pay signal). Do not delete or rewrite the
   original Day-60 gate entry — the miss and its cause are the record. A
   full draft of this disposition's wording exists in
   `KS-REPORT-4.22-intake-verification-and-register-continuity.md` §7 —
   check it still matches the verified facts before using it verbatim,
   don't just copy it blind.
7. **Check whether Yehor has reviewed/committed/pushed
   `PITFALL-WATCHLIST.md`.** Session 4.22 left it modified and
   uncommitted intentionally (`git status --short`), per his own explicit
   task assignment ("your per-instance push word as always"). If it's
   still uncommitted, no action needed — it's his to handle whenever
   convenient, the diff is public-safe (the NJORD fee figure is already
   redacted). If he has committed/pushed it, note the new HEAD and re-run
   the CI check (item 5).
8. **Check for NJORD's written meeting notes.** As of Session 4.22's
   close, still not arrived (`search_threads from:njordlaw.com
   after:2026/08/26`, zero hits, two days post-meeting at that point).
   **Do not chase before Monday 2026-08-31 end-of-day.** If a session
   opens on or after that date with still nothing, flag it as nudge-ready
   — Node 1 will draft a polite nudge on request, not by default. If the
   notes HAVE arrived: this becomes the session's P0 — the phased-quote
   reply (requesting Phase-1-only scope, minimum legally required to open
   the GitHub App for free installs, declining the full-package quote per
   Yehor's own recorded strategy) should be drafted the same hour. The
   exact figure is recorded mount-only in `MEMORY/critical-actions.md`,
   deliberately not restated here since this prompt is a tracked, public
   file — not in the public `PITFALL-WATCHLIST.md` either.
9. **Check all four GTM outreach threads for replies** — Cernel,
   AarhusJS, WasteHero, Kondrup. As of Session 4.22's close, none had
   replied (unchanged from 4.21; AarhusJS specifically was 6+ days silent
   on Yehor's 2026-08-20 format-options message at 4.21's close, now
   longer). Cernel, WasteHero, and Kondrup are LinkedIn-channel, not
   email — zero Gmail hits is expected, not a gap; ask Yehor for a
   screenshot if a reply is suspected, and independently verify any
   relayed claim against a reachable primary source wherever one exists.
10. **VAT Q2 2026 is CLOSED — filed 2026-08-24, independently verified.**
    Do not re-open or re-prompt Yehor to file it. The next VAT clock is
    Q3 2026, due **1 December 2026** — 95 days out at Session 4.22's
    close, not yet a near-term item worth dedicated attention this
    session.

## What actually happened in Session 4.22 (don't re-derive, read this
## instead)

- **No code, no build, no deploys, no calendar changes, no commit, no
  push.** A verification-and-record-keeping session.
- **Three pasted "guide-chat relay" blocks arrived**, each styled as a
  Node-1 report from a separate session and each instructing specific
  register writes. Per this project's standing rule, every checkable claim
  was independently verified before being recorded.
- **Premise #1, FALSE:** the uploaded `FixProve-AID-Funding-Roadmap-
  Canvas.pdf` was claimed to have "arrived EMPTY." Read directly and in
  full this session (3 pages) — the transport failure was local to the
  relaying session, not this one. No re-paste or relay was needed.
- **Premise #2, FALSE, caught before entering the permanent record:** a
  relayed instruction attributed the Day-60 gate's structural
  unreachability to "D4 and D5." Checked directly against
  `MEMORY/critical-actions.md`: only D4 was ever adopted (2026-08-19); a
  prior "D4 + D5" bundling proposal is explicitly recorded as **not
  adopted**, five sessions earlier. No D5 exists in this project's
  register. Now a standing DURABLE NOTE in `state.md`.
- **Independently verified true:** the CRA follow-up email is SENT
  (thread `1a03eea261e68ac5`, 2026-08-26T16:40:58Z, packet attached);
  NJORD's written notes have NOT arrived; "customer" occurs 6 times in
  publicly-tracked legal/site copy (4 of 6 inside `terms-public.md`'s own
  defined-term clause, reclassified as a legal-text amendment deferred
  into NJORD's Phase 1 scope, nothing changed).
- **Recorded on Yehor's own direct word, distinct from the relayed
  material:** LinkedIn Module-1 post and Sissi Bak follow-up, both
  POSTED/SENT ("Yes and Yes," this conversation) — honestly caveated as
  unverifiable from this session (no LinkedIn connector).
- **Four dated addenda appended, each prefix-diff-verified before and
  after write:** two to `MEMORY/critical-actions.md` (mount-only) and two
  to `PITFALL-WATCHLIST.md` (public, tracked). NJORD's verbal full-package
  estimate is recorded in full only in the mount-only file — the exact
  figure is not restated here either, since this prompt is itself a
  tracked, public file — per that file's own 2026-08-19/2026-08-20
  precedent for a third party's confidential fee figure.
  `PITFALL-WATCHLIST.md` is left deliberately uncommitted, for Yehor's own
  review/commit/push.
- **Day-60 gate checked fresh via `date -u` throughout — still
  2026-08-28 at every check.** Correctly NOT dispositioned (the date had
  not arrived); wording is prepared, not applied — see item 6 above.
- **Session-start checks, fresh, no drift.** `origin/main = main =
  f3aa6cc` (Session 4.21's own already-pushed post-push-addendum commit —
  not new drift). CI run `32858388016` (**#72**, one later than the prior
  prompt's "#71" reference since `f3aa6cc` is a new commit): `build` 54s,
  `test-python` 39s, both green. Two stale locks renamed away, routine.
- **NJORD and GTM checked fresh, unchanged in substance from 4.21.**
- **No CA-class action was taken by the assistant.** No money, repo-
  visibility, in-name publishing, report/log/MEMORY deletion, or
  instruction changes occurred. No commit, no push.

## Live clocks

| Clock | Date | Status as of 2026-08-28 |
|---|---|---|
| Day-60 gate ("first real dollar") | 2026-08-29 | Due tomorrow at 4.22's close — **will NOT be met**; disposition prepared, not yet written — recompute fresh |
| NJORD written notes | (no fixed date) | 2 days post-meeting at 4.22's close, hold until Mon 31 Aug EOD |
| EU CRA Art. 14 reporting | 2026-09-11 | 14 days out at close — recompute fresh |
| D3 demand-test window | 2026-08-14 → 2026-11-12 | 76 days out at close — running |
| VAT Q2 2026 | ~~2026-09-01~~ | **CLOSED — filed 2026-08-24** |
| VAT Q3 2026 | 2026-12-01 | 95 days out at close — not yet near-term |

## Priority for Session 4.23, in order

1. **If today is on or after 2026-08-29: disposition the Day-60 gate as
   MISSED**, D4 only, re-anchored to D3 — see item 6 above. This is the
   single concrete task this session owes.
2. **Re-verify `origin/main` and CI job-level status fresh** — this
   prompt records both as of 4.22's close, but re-check rather than
   trust the file, same standing rule as always. Check specifically
   whether Yehor has committed/pushed `PITFALL-WATCHLIST.md`.
3. Check whether NJORD's written notes have arrived; if so, draft the
   phased-quote reply the same hour. If not, and it's on or after Monday
   31 Aug, flag as nudge-ready.
4. Check all four GTM threads for replies.
5. **Read both DURABLE NOTEs in `MEMORY/state.md`** before re-flagging any
   early-dated calendar event as a defect, or before recording any
   decision label you haven't personally grepped for in
   `critical-actions.md`.
6. No other time-sensitive item is due this session. VAT Q3 2026
   (1 December) is 95 days out — not worth dedicated attention yet.

None of Session 4.22's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

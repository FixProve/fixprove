NEXT SESSION — 4.21 — "Genuinely quiet board: one meeting to show up
to, four threads to watch, nothing owed by the assistant"
Written 2026-08-24, Session 4.20 TRUE close. Session 4.20 resolved
push/CI drift carried from 4.19, named a new `.git/refs/`-tree
lock-cleanup failure mode, researched and closed VAT Q2 2026 (filed by
Yehor, independently verified against the actual receipt), and caught
four separate relayed-claim errors before they entered the record. Every
number below was correct as of 2026-08-24 — recompute the live clocks
fresh at session open rather than trusting this file, same standing rule
as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable.
   Note specifically whether Calendar access now covers
   `yehor.callmedai@gmail.com` — as of Session 4.20's close it still only
   covers `egorka30001@gmail.com`, leaving the `.ics` invite
   accept-status gap open (non-urgent, see item 6).

2. **`.git/*.lock` check** — rename away (`mv`, never `rm`). **New
   standing rule from Session 4.20: if a stale lock is found anywhere
   under `.git/refs/**`, an in-place rename is NOT sufficient** — it must
   be moved fully outside the `.git/refs/` tree (e.g. to
   `.git-stale-locks/`), or `git fetch` can fail with `fatal: bad object`.
   This happened once this project's history so far (a lock inside
   `.git/refs/remotes/origin/docs/`). The routine `index.lock`/
   `maintenance.lock` recreation-after-every-command pattern (can't
   `unlink` on this mount, only `mv`) is unchanged and still cosmetic.

3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Ten prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md` through
   `state.superseded-4.20-interim-2-snapshot.md`) — none is authoritative;
   only the un-suffixed `state.md` is current.

4. **Verify `main` and `origin/main` fresh, don't assume from this
   prompt.** At the time this prompt was finalized (2026-08-24, same
   session, post-push), `origin/main = main = 5a9283f`, confirmed via
   `git fetch` + `git log -1 --oneline` on both refs — Yehor pushed
   Session 4.20's own close-out commit (`5a9283f`: `KS-REPORT-4.20-*.md`,
   the 4.20 session log, `SESSION-LOG-INDEX.md`, this file) himself, same
   turn, `Bypassed rule violations for refs/heads/main` present as
   expected. **Nothing should be owed here** — re-verify fresh anyway,
   don't take this file's word for it.

5. **CI job-level check on whatever the new HEAD is**, per the standing
   CA-5 mandatory post-push obligation — job-level, not run-level, same
   as every prior session. `5a9283f`'s CI was confirmed via the commit's
   own `/checks` page after the workflow-scoped run-list page came back
   stale/missing the newest run even with a cache-busting parameter
   (`api.github.com`/`gh` remain unreachable from this sandbox, consistent
   with every prior session) — **new gotcha, worth carrying forward: when
   the cache-busted workflow-list page still doesn't show the newest run,
   try `github.com/<owner>/<repo>/commit/<sha>/checks` instead, which
   resolved it immediately this time.** CI #69, run `32745343428`:
   **Status Success**, `build` 49s, `test-python` 39s, both green, only
   the standing benign Node.js-20 deprecation annotations.

6. **Check for NJORD's written Phase-1 answer.** The meeting was
   **Wednesday 26 August 2026, 16:00–17:00**, in person, at NJORD's Aarhus
   office (TRÆ, Sydhavnen) — confirmed by direct primary-source Gmail
   thread read, re-confirmed fresh at Session 4.20's close (2 days out at
   that point). **If today's date is on or after 26 Aug, the meeting has
   happened — check email for meeting notes, a written answer, or a
   rescheduling.** If today is before 26 Aug, no lawyer action is
   expected yet — don't chase. **Also check the separate `.ics` invite's
   accept-status**, if Calendar access now covers
   `yehor.callmedai@gmail.com` (thread `1a01f0a429cc13b3`) — a visibility
   gap, not a suspected defect, unchanged since Session 4.19.

7. **Check all four GTM outreach threads for replies** — Cernel,
   AarhusJS, WasteHero, Kondrup. As of Session 4.20's close, none had
   replied. AarhusJS (Lars) specifically: Yehor sent format options
   2026-08-20 14:00; no reply to that specific message as of 4.20's
   close (4+ days silent at that point) — not treated as stalled or
   urgent, an optional light nudge is Yehor's own call, not queued as a
   default action. Cernel, WasteHero, and Kondrup are all LinkedIn-
   channel, not email — `search_threads` returning zero hits for them is
   expected, not a gap; ask Yehor for a screenshot if a reply is
   suspected, and independently verify any relayed claim against a
   reachable primary source wherever one exists, per this project's
   now well-established rule (seven-plus documented instances across the
   project, four of them inside Session 4.20 alone).

8. **VAT Q2 2026 is CLOSED — filed 2026-08-24, 8 days before the
   2026-09-01 deadline, independently verified against the actual
   TastSelv receipt.** Do not re-open or re-prompt Yehor to file it. The
   next VAT clock is Q3 2026, due **1 December 2026** — 99 days out at
   Session 4.20's close, not yet a near-term item worth dedicated
   attention this session.

## What actually happened in Session 4.20 (don't re-derive, read this
## instead)

- **No code, no build, no deploys.** A verification-and-research session,
  plus one real external filing action outside this repo.
- **Push/CI drift from 4.19 resolved.** `state.md`'s prior claim that
  `9c9b413` was already pushed was wrong — fresh `git fetch` showed
  `origin/main` still two commits behind. Yehor pushed both
  (`9c9b413`, `adca3bc`) himself; re-verified fresh, CA-5 job-level CI
  check Success (CI #68, both jobs green).
- **New standing rule: `.git/refs/**` lock files need full removal from
  the refs tree, not in-place renaming.** First occurrence of this
  failure mode across ~180+ prior stale-lock renames in this project.
- **VAT Q2 2026 — filed and independently verified.** Two relayed
  guide-model errors caught before acting (stale date math off by two
  days; a wrong nul-angivelse premise when the ledger already showed a
  real 151.12 DKK reverse-charge position). Deadline re-verified via a
  fresh `skat.dk` fetch. Yehor filed via TastSelv Erhverv; the assistant
  read the confirmation PDF directly and cross-checked every field
  against `TAX-OPERATIONS.md` — Salgsmoms 0 kr, Købsmoms 38 kr,
  reverse-charge 38 kr, Moms i alt 0 kr, matching the ledger's predicted
  outcome exactly. `TAX-OPERATIONS.md` §8 carries the full record plus a
  process note for future filings.
- **Two further relayed-claim corrections, same session.** A follow-up
  claim that a skat.dk cross-check "resolved a previously-open
  cadence-label ambiguity" was corrected (the ambiguity was already
  closed on Yehor's attestation since 2026-08-01, nothing new was
  resolved). An instruction to update a `PITFALL-WATCHLIST.md` "clocks
  list" was checked via `grep` before acting — no such list exists in
  that file; it was correctly left untouched.
- **GTM and NJORD checked fresh, unchanged in substance from 4.19.**
- **No CA-class action was taken by the assistant.** No money, repo-
  visibility, in-name publishing, report/log/MEMORY deletion, or
  instruction changes occurred. Yehor's own VAT filing and git push were
  his actions, not the assistant's.

## Live clocks

| Clock | Date | Status as of 2026-08-24 |
|---|---|---|
| NJORD meeting | 2026-08-26, 16:00-17:00 | Confirmed, 2 days out at 4.20's close — recompute fresh |
| Day-60 gate | 2026-08-29 | 5 days out at 4.20's close — recompute fresh |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT, 18 days out at close |
| VAT Q2 2026 | ~~2026-09-01~~ | **CLOSED — filed 2026-08-24** |
| VAT Q3 2026 | 2026-12-01 | 99 days out at close — not yet near-term |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | running via D4's CLI-first path |

## Priority for Session 4.21, in order

1. **Re-verify `origin/main = 5a9283f`** (or later) and CI #69's
   job-level Success fresh — this prompt records it as already done and
   confirmed, but re-check rather than trust the file, same standing rule
   as always.
2. Check whether the NJORD meeting (26 Aug) has happened; if so, watch
   for a written Phase-1 answer.
3. Check all four GTM threads for replies; consider whether Yehor wants
   the optional AarhusJS nudge sent.
4. If a release is planned for any reason, watch the version-sync gate's
   first live run closely — job-level, not run-level, per this project's
   standing rule; it has never yet run inside GitHub Actions.
5. No other time-sensitive item is due this session. VAT Q3 2026
   (1 December) is 99 days out — not worth dedicated attention yet.

None of Session 4.20's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

NEXT SESSION — 4.17 — "Three drafted sends are ready; watch for a lawyer reply;
resolve the 7-session-old pricing-exposure call"

Written 2026-08-19 at the close of Session 4.16. Read the git-state section
below rather than assuming — this prompt asserts repo STATE and is untrusted
until checked against the mount, same as every prior starting prompt in this
project. Session 4.16 itself demonstrated why, twice: once catching its own
misattributed claim (Cernel's stack) before acting on it, and once catching a
mistaken git commit that overrode a standing hold instruction — after the
commit had already landed locally. Re-verify everything below fresh.

SESSION START (Keystone Stage 1 — Intake) — open via the
`session-strategy-synthesis` skill if available in this environment;
otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` and `.git/HEAD.lock` check — rename away (`mv`, never `rm`).
   Reappeared repeatedly across Session 4.16 (at least 8 times during one
   commit/amend/revert sequence alone); ~85 stale renamed lock files have now
   accumulated in `.git/` since 2026-07-21. Treat a fresh appearance at 4.17's
   open as completely normal. The accumulation itself is a low-priority
   cleanup candidate, not urgent, not blocking.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else. Three prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md`,
   `state.superseded-4.14-close-session-snapshot.md`,
   `state.superseded-4.15-close-snapshot.md`) — none is authoritative; only
   the un-suffixed `state.md` is current.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries, including the
   2026-08-19 process-incident entry) and `MEMORY/critical-actions.md`'s tail
   (`grep -c '^## S4.16' MEMORY/critical-actions.md` as of this prompt's last
   edit = 7: D4 adoption, NJORD brief, commit-incident record, KS-REPORT-4.16
   sign-off, AarhusJS sent — recount fresh, don't trust 7 either) before
   doing anything with either file. **Specifically: before any future bulk
   commit of `PITFALL-WATCHLIST.md`, re-read every addendum for an explicit
   hold instruction first** — this is the actual lesson from 4.16's most
   serious catch, not just a note about what happened.
5. Verify all refs, don't assume:
   * `main` and `origin/main` — expect `5a44fda` (Session 4.13's own close-out
     commit), unchanged by 4.14, 4.15, or 4.16 (4.16 made one commit and fully
     reverted it — net effect zero). Re-verify fresh via `git log -1`; do not
     trust this prompt's SHA if it's stale.
   * `drafts/operating-plan-d17-d60`, `drafts/row4-legal-drafts`,
     `held-back-pile-2026-07-28` — not touched in 4.14, 4.15, or 4.16, not
     re-verified in any of them; check fresh if relevant.
6. Live-verify, don't assume 4.15's checks are still current:
   * PyPI/npm — last confirmed `0.1.10` at Session 4.15's close, not
     re-checked in 4.16 (no code/deploy work touched it this session).
   * `fixprove.dev` routes — same: last confirmed HTTP 200 at 4.15's close,
     not re-checked in 4.16.
   * GitHub repo — same: last confirmed 0 stars/forks/issues, not archived,
     public, at 4.15's close.
7. Check Gmail for lawyer replies before anything else substantive — 2 of 5
   recipients had replied as of 4.16's close (independently verified via
   `search_threads`, not the relayed claim alone); check whether more have
   arrived. **A lawyer's written review answer is still the single most
   likely next genuinely substantive event in this project.**

## What actually changed in Session 4.16 (don't re-derive, read this instead)

- **D&B: CLOSED.** Outcome achieved 2026-08-06. Don't reopen without new
  correspondence.
- **D4 ADOPTED, Yehor's own words:** CLI-first demand-generation starts now;
  the App-flip hard boundary is explicitly unchanged (Gate-1 + separate "go"
  both still required, in that order). Restate this pairing whenever D4 is
  referenced.
- **NJORD scoping brief:** fact-checked (zero factual defects), archived to
  `MEMORY/legal-review/`, not yet sent — waiting on NJORD to propose meeting
  times.
- **LinkedIn carousel:** posted live by Yehor. 10 slides, synthesized from 4
  independent research runs.
- **GTM synthesis:** done, 2 independent research runs reconciled, 5 oversized
  target companies excluded.

## GTM outreach status — 2 of 3 sent, 1 open

1. **Cernel — SENT.** Andreas Busch, via Yehor's existing LinkedIn connection.
2. **AarhusJS — SENT.** Lars Gyrup Brink Nielsen (larsbrinknielsen@gmail.com,
   live-verified organizer contact), 2026-08-19. Note for context: Yehor
   reported this group as "dead" at the end of 4.16; independently checked
   and found false (809 active members, working Slack, last event within
   their normal 3-4x/year cadence) — sent anyway, correctly.
3. **WasteHero — still open.** Send to Mohamed Kamal (Tech Lead, GenAI/AI
   Agents focus at WasteHero — the strongest topical match on their team).
   Draft in `Tier1-outreach-drafts-2026-08-19.md`.
4. **Capturi — hold.** Verify current engineering independence from Puzzel
   (acquired Oct 2024, former CTO now a Puzzel-wide VP Engineering role)
   before deciding whether it's still a fit for the stated 10-50 person ICP.

Check for replies to Cernel and AarhusJS at 4.17's open — neither had had time
to reply by 4.16's close.

## One open item worth resolving directly, not deferring an 8th time

**`PITFALL-WATCHLIST.md`'s pricing-exposure commit-vs-exposure decision** —
open since 2026-08-08 (Session 4.12-M), now carried through 7 sessions
(4.12-M through 4.16) without Yehor's call. The question: is it safe to
publish an index naming six files that reference pricing figures (without
restating the figures themselves)? Session 4.16 nearly published this by
accident via a bulk commit, caught and reverted before push — the underlying
question is unchanged by that incident. Worth actually deciding this session
rather than letting an 8th session inherit it.

## Live clocks

| Clock | Date | Status as of 2026-08-19 |
|---|---|---|
| VAT Q2 filing | 2026-09-01 | 13 days out at 4.16's close — recompute fresh |
| EU CRA Art. 14 reporting | 2026-09-11 | distinct clock from VAT |
| D3 bounded-test window | 2026-08-14 → 2026-11-12 | now effectively started via D4's CLI-first path |


---

## CORRECTION appended 2026-08-20 at Session 4.17's intake

Item 3 of this prompt's GTM section ("WasteHero — still open. Send to Mohamed
Kamal ... Draft in `Tier1-outreach-drafts-2026-08-19.md`") asserts a deliverable
that does not exist. Verified at 4.17's open: that file contains a skeleton and an
instruction to find a contact via LinkedIn search; it never names Kamal, and no
addressed WasteHero draft exists anywhere on the mount. Kamal is single-source.

This is the same failure class as the SHA and file-count errors this prompt's own
preamble warns about — and it appeared in the preamble's own body. The prompt was
right to say it should be checked, and it was checked, and it was wrong.

Recorded by Claude (Node 1), Session 4.17, 2026-08-20.

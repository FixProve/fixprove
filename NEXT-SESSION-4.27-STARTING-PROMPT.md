NEXT SESSION — 4.27 — "Check Aarhus reply, push the demo branch, decide
production timing — nothing else is time-pressured"

Written 2026-09-07, Session 4.26 close. Session 4.26 built and verified
a self-contained Claude Code Meetup #3 (Aarhus, 2026-09-17) demo kit
entirely outside the repo, found and documented five real fixprove CLI
product defects, drafted a `/demo` marketing page on an isolated branch
with a real live-previewed Cloudflare Workers preview environment, sent
two LinkedIn messages (Yehor's own account), and closed with a full
formal `session-close` pass. **One commit on `draft/demo-section-4-26`
and one on `main` sit unpushed.** Every number below was correct as of
2026-09-07; recompute the live clocks fresh at session open rather than
trusting this file, same standing rule as every prior starting prompt in
this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable,
   explicitly including whether `mcp__workspace__bash` (or equivalent
   shell access) is available — this varies session to session in this
   project and every prior starting prompt's git-state claims depend on
   it.

2. **If bash is available, immediately check for `.git/index.lock`,
   `.git/HEAD.lock`, and `.git/objects/**/tmp_obj_*` before running any
   other git command.** Standing, reproducible mount-level defect,
   unchanged since Session 4.20 and reconfirmed heavily in 4.26 (7+
   occurrences in one close alone, now also confirmed on the `outputs`
   scratchpad mount). Clear with `mv` (never `rm`) into
   `.git-stale-locks/` and expect to repeat this after every single git
   command.

3. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else. Pay particular attention to the **three
   new DURABLE NOTEs Session 4.26 added**: (a) a demo/marketing feature
   on this Cloudflare Worker project needs its own named `[env.<name>]`
   environment — there is no Pages-style automatic per-branch preview;
   (b) before shipping a planted-hallucination example, confirm it
   actually triggers the real tool's real catch end-to-end, not just
   that the method plausibly doesn't exist; (c) at this mount's current
   state, a `git checkout` between sufficiently different branches (new
   files, or a large CRLF-affected tree) can leave the working tree
   matching neither branch's true content even after `-f` reports
   success — verify with a fresh `git status`/`git diff -w` immediately
   after any switch, and switch back to the confirmed-correct branch
   rather than risk mixing content in a commit.

4. **Verify `draft/demo-section-4-26` and `main` fresh, with real tools
   if available.** As of 4.26's close: `draft/demo-section-4-26` has 3
   local commits (`7aa1be7`, `962ca3d`, `3b8d7f7`, plus a 4th,
   `dbf872e`, holding this session's own KS-Report/session-log/index
   entry) — only the first two are on `origin/draft/demo-section-4-26`.
   `main` sits 1 commit ahead of `origin/main` (`b6a826d`, pre-existing
   from before Session 4.26, unchanged by it). **Do not trust these
   exact hashes** — run `git log --oneline -6` on both refs and
   `git rev-parse <branch> origin/<branch>` fresh instead; a push that
   happened between sessions makes this paragraph stale the moment it
   lands.

5. **Check for an Aarhus Claude Code Meetup reply from Augustin
   Gottlieb before anything else time-sensitive.** A message was sent
   2026-09-07 asking for a 5-minute Show & Tell slot on 2026-09-17 (10
   days out at this writing). No reply had arrived at 4.26's close. The
   entire demo kit (`fixprove-meetup-2026-09-17/` in Yehor's outputs
   folder) is built, proof-verified, and ready regardless of the
   outcome — this is a status check, not a blocker on anything else.

6. **Push decision — the two open governance items from 4.26's close.**
   Ask Yehor explicitly: (a) whether to push
   `draft/demo-section-4-26`'s local commits (including `dbf872e`,
   which carries this session's own KS-Report and session log) to
   origin now; (b) whether to push `main`'s pre-existing `b6a826d`. Both
   were deliberately left for separate approval at 4.26's close, not
   decided there. If yes on (a): note that pushing brings this
   session's governance docs onto GitHub for the first time — they
   currently exist only on the local `draft/demo-section-4-26` branch,
   not on `main`, per 4.26's own disclosed reasoning
   (`KS-REPORT-4.26-*.md` §6). If either push happens, run the CA-5
   post-push per-job CI check (not just the run-level rollup) before
   reporting it done.

7. **`/demo` production merge/deploy — Yehor's call, not urgent.** The
   page is drafted, committed, and live-previewed on an isolated
   Cloudflare Workers environment (`fixprove-preview.truffel30001.
   workers.dev`), but not merged to `main` and not deployed to
   production `fixprove.dev`. Ask whether he wants to merge/deploy now,
   wait for the Aarhus reply, or hold indefinitely — don't assume either
   answer.

8. **Sign `KS-REPORT-4.26-meetup-demo-kit-and-demo-page-session-close.md`
   §5** if Yehor is ready — per this project's convention (4.12-C,
   4.25 precedent), record it as a dated addendum, not by editing the
   report's own text.

9. **Two `*-CONTAMINATED-DO-NOT-SHIP` folders in the outputs
   directory** (`python-sample-fixprove-cache-...`,
   `python-sample-venv-...`, `ts-sample-...`) need manual deletion by
   Yehor via Windows Explorer — confirmed not fixable from the sandbox
   (same unlink defect as git's). Low priority, no deadline.

10. **NemKonto — check whether the Nordea account has actually
    opened.** Unchanged from 4.25/4.26: application acknowledged, account
    itself not yet open at 4.26's close. If it has opened since:
    re-check `virk.nemkonto.dk` directly — see
    `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` §1.

11. **Grant application — check for a confirmation email and any review
    outcome.** Unchanged from 4.25/4.26: submitted 2026-09-03, confirmed
    on-screen, no confirmation email found in same-day or later checks
    yet. No stated review timeline exists on the program's own page —
    don't assume silence means anything either way. See
    `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` §2.

12. **Row 4 (ToS/Privacy/GDPR) — Yehor is self-reviewing, unchanged.**
    His explicit, informed decision from 2026-09-03 — not something to
    re-litigate or re-flag the risk on unless he raises it himself.
    Check whether he has any actual review work or questions this
    session. The `ivsr.dk` free-clinic case (K145X8) status is still
    undecided (keep running in parallel, or close it) — ask, don't
    decide.

13. **Compliance-verification-platform idea — check whether Yehor has
    run the Stage-1 meta-prompt** (unchanged from 4.25/4.26 — no new
    movement reported). If he brings back 4 candidate Stage-2 prompts,
    synthesize before Stage 2 runs.

14. **Check whether NJORD has replied** to Yehor's pause message (sent
    2026-09-02). Still no reply as of 4.26's close.

15. **Check all four GTM outreach threads for replies** — Cernel,
    AarhusJS, WasteHero, Kondrup. Unchanged, not re-verified this
    session (out of 4.26's scope).

16. **VAT Q2 2026 is CLOSED — filed 2026-08-24. Do not re-open or
    re-prompt Yehor to file it.** Next VAT clock: Q3 2026, due
    **1 December 2026** — 85 days out at 4.26's close, not yet
    near-term.

## What actually happened in Session 4.26 (don't re-derive, read this
## instead)

- **Meetup demo kit built and fully verified**, delivered to Yehor's
  outputs folder (`fixprove-meetup-2026-09-17/`): real npm (0.1.12) and
  PyPI installs both tested with explicit full paths, not `$PATH`
  inference. Two planted hallucinations (`requests.get_json`,
  `axios.getJson`) used only after confirming each triggers a real
  fixprove catch end-to-end — two other candidates (a pandas
  inferred-type instance method, a lodash `@types`-only import) were
  tried first and produced genuine false negatives, documented as
  product defects rather than swapped in silently. 3-run determinism
  proof (byte-identical `--json` output each run), a fallback terminal
  recording, a QR code, and a 7-beat cheat sheet all delivered and
  hash-verified.
- **Five real fixprove product defects found and documented, none fixed
  this session** (out of scope): npm/pip CLI syntax mismatch; npm's
  `--version` hardcoded stale at "0.1.0"; a `requirements.txt`
  version-pin mismatch that masks the real finding; the two
  false-negative detection gaps above. Full detail in
  `project_fixprove_cli_defects_4_26.md` and `KS-REPORT-4.26-*.md` §3.
- **`/demo` marketing page drafted, built on branch
  `draft/demo-section-4-26`, and live-previewed — deliberately isolated
  from production.** 3 original commits (`7aa1be7`, `962ca3d`,
  `3b8d7f7`), never merged to `main`. A real, reversible Cloudflare
  Workers `[env.preview]` named environment added to
  `web/wrangler.toml` with no shared production KV binding, deployed by
  Yehor to `fixprove-preview.truffel30001.workers.dev` and independently
  verified by Claude via a real fetch and a real 375px mobile-viewport
  screenshot. One self-authored defect (dead GitHub links in the first
  draft) caught by adversarial self-review and fixed properly (added
  `examples/meetup-demo-2026-09-17/` to the repo).
- **Two of Claude's own instruction errors caught and corrected
  transparently this session**, both logged in full in
  `MEMORY/critical-actions.md`: a Cloudflare Pages-vs-Workers assumption
  error (this project is a Worker, has no automatic per-branch preview);
  a `git checkout`/`wrangler deploy` working-directory sequencing error
  (needed `-f`, `npx`, the right `cwd`, and a `npm run build` step first).
- **Third recurrence of a relayed "NextStep vs Tag din virksomhed"
  funding-program confusion independently caught and permanently
  closed** — NextStep is confirmed CLOSED to new applications via its
  own program page; standing instruction added not to resurface it in
  any live-clocks list again.
- **Two LinkedIn messages drafted, both sent by Yehor personally**: a
  Show & Tell slot ask to Augustin Gottlieb (real Aarhus meetup
  organizer), revised to acknowledge he passed the CCA-F exam; a short
  reply to Ulrik Bergmann. **Neither reply had arrived by this session's
  close.**
- **Full formal session close performed** (`session-close` skill,
  formal-governance path). Git reconciliation found one genuinely new
  defect: `draft/demo-section-4-26`'s third commit (`3b8d7f7`) was never
  pushed, unlike its first two — Yehor's push ran before that commit
  was made. Also re-confirmed, at a much larger scale than any prior
  session (~305 of ~306 tracked files, versus 1-3 in every prior
  occurrence back to Session 4.9), the project's known cosmetic CRLF
  line-ending drift — verified harmless by two independent methods
  (`diff` after stripping `\r`; git's own `git diff -w`, both
  completely empty). **Because of that scale, a clean `git checkout
  main` mid-close proved unreliable on this mount** — the working tree
  ended up matching neither branch's true committed state, so Claude
  switched back to `draft/demo-section-4-26` and committed this
  session's KS-Report and session log there (commit `dbf872e`) instead
  of on `main`, disclosed plainly in `KS-REPORT-4.26-*.md` §6 rather
  than silently accepted. One self-caught defect during the close
  itself: an initial commit had accidentally picked up a whitespace-only
  CRLF conversion of `SESSION-LOG-INDEX.md` alongside the real content
  addition — caught by comparing the new commit's blob line-endings
  against a sibling file, fixed via `git commit --amend` before
  finalizing.
- **No CA-class action taken by the assistant.** No money moved, no
  repo-visibility change, no in-name publishing (both LinkedIn messages
  sent by Yehor from his own account), no report/log/MEMORY-file
  deletion, no instruction change. No production deploy — `/demo` and
  its preview both stay off `fixprove.dev` pending Yehor's separate,
  explicit go.

## Live clocks

| Clock | Date | Status as of 2026-09-07 |
|---|---|---|
| Aarhus Claude Code Meetup #3 (Show & Tell ask sent) | 2026-09-17 | 10 days out — reply pending |
| Grant application review outcome | (no fixed date) | Submitted 2026-09-03; no stated review timeline |
| Nordea account opening / NemKonto propagation | (no fixed date) | Application acknowledged; account not yet open |
| Day-60 gate ("first real dollar") | 2026-08-29 | MISSED — dispositioned 4.23, unchanged |
| D3 demand-test window | 2026-08-14 → 2026-11-12 | 66 days out at close — running |
| NJORD reply to the pause (if any) | (no fixed date) | Sent 2026-09-02, still no reply |
| ivsr.dk case K145X8 | (no fixed date) | Unchanged from 4.25/4.26 — Yehor's call whether to keep it running |
| VAT Q3 2026 | 2026-12-01 | 85 days out at close — not yet near-term |

## Priority for Session 4.27, in order

1. **Confirm bash/git access status first, explicitly**, and clear any
   stale lock files before the first real git command (item 2 above).
2. **Check for an Aarhus reply** before anything else time-sensitive
   (item 5 above).
3. **Get Yehor's explicit push decision** on both pending branches
   (`draft/demo-section-4-26` and `main`, item 6 above) — push if
   approved, then verify CA-5 per-job.
4. **Ask about `/demo` production merge/deploy timing** — his call, not
   urgent (item 7).
5. **Check NemKonto/Nordea progress and the grant confirmation-email
   gap** — both genuinely open, neither urgent yet.
6. **Check NJORD's pause reply, if any**, and the four GTM threads —
   carried forward unverified/unchanged from 4.25/4.26.
7. Read all DURABLE NOTEs in `MEMORY/state.md` before re-flagging any
   early-dated calendar event, before repeating any Cloudflare
   architecture assumption without re-checking `wrangler.toml`, before
   trusting a `git checkout -f`'s success message without a fresh
   `git status`/`git diff -w`, and before shipping any new
   planted-hallucination example without confirming it triggers a real
   catch end-to-end.

No other time-sensitive item is due this session. ivsr.dk (undecided,
not urgent), and VAT Q3 (1 December) are not near-term action items
yet.

None of Session 4.26's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

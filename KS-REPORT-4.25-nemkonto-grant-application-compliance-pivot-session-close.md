# Keystone Report — Session 4.25 — NemKonto Opened, Grant Application Submitted, Row 4 Compliance-Strategy Pivot, Session Close

## 1. Provenance

All prose in the grant application (Q1-Q5, Danish), the founder-background
paragraph (Q2), the two deep-research prompt files, this report, the
session log, and `MEMORY/state.md` was AI-drafted (Claude, Node 1) from
facts supplied by Yehor or already on file in this project, then reviewed
and approved by Yehor before use (the grant narrative was read and
submitted by him personally; the deep-research prompts were reviewed and
their scope corrected by him mid-session — see §3).

All decisions attributed to Yehor in this report (NemKonto route, the
compliance-review DIY pivot, "commit everything" at close, form answers
requiring personal financial judgment) were made by Yehor in chat, not
inferred or defaulted by Claude. Where Claude proposed a default (e.g.
KYC form checkboxes, deposit-purpose category), that is stated as a
proposal in the session transcript, not fact until Yehor acted on it.

The Nordea Erhverv application and the "Tag din virksomhed til næste
niveau" grant application were both filled in and submitted by Yehor
personally, in his own browser, under his own authentication — Claude
supplied drafted text and guidance only, per this session's standing
rule against entering personal/financial data into forms directly.

## 2. Verification summary — method, tools, results

**Git reconciliation (Phase 1 of session-close):**
- `git status`, `git log -1 --oneline`, and `git rev-parse main
  origin/main` run fresh at session open: `f3aa6cc` on both, no drift.
- A recurring, reproducible mount-level defect was found and worked
  around: on this specific FixProve mount, git leaves a `.git/index.lock`
  (and sometimes `.git/HEAD.lock`, and loose-object `tmp_obj_*` files)
  after nearly every git operation, reporting "unable to unlink ...
  Operation not permitted" even though the operation itself succeeds.
  Each occurrence was cleared with `mv` (never `rm`) into
  `.git-stale-locks/` per the project's standing rule before the next git
  command — this happened well over a dozen times this session alone.
  **This is now a confirmed, reproducible pattern, not an occasional
  fluke** — see §4 and §6.
- Pre-commit dry-run (`git add -n`) on both untracked directories caught
  two real problems before staging: `.git-stale-locks/` (0-byte lock
  markers, no content value) and `web/functions-dist/` (compiled JS
  output of tracked `web/functions/*.ts` sources, confirmed by matching
  filenames). Both added to `.gitignore` with a dated, reasoned comment,
  matching this project's existing `.gitignore` documentation style.
- Two commits landed and were independently verified by two methods each
  (`git log -1 --stat` + fresh `git status`): `2116ecb` (68 files, +10392/
  -397, the multi-session 4.14-4.25 backlog + this session's new files)
  and `e28bb63` (1 file, a fixup — see §3, defect 1). Working tree clean
  at close; `main` is 2 commits ahead of `origin/main`, **not pushed** —
  push requires separate explicit approval per this session's own
  decision (see §5/§7) and per the standing CA-class rule on `git push`.

**Application/decision verification (two-pass, per claim):**
| Claim | Pass 1 (direct) | Pass 2 (independent) | Verdict |
|---|---|---|---|
| Nordea Erhverv application submitted | Screenshot, on-screen declaration confirmed by Yehor | Gmail search: confirmation email `no-reply@nordea.dk`, "Nordea Erhverv – tak for din ansøgning," received 2026-09-03T15:48:47Z | **CONFIRMED**, two independent channels |
| Grant application submitted before deadline | Screenshot: "Your application ... has now been received" | Gmail search for a confirmation email (ehsys.dk, ansøgning/tilskud/virksomhed subjects, `newer_than:1d`): **no results** | **CONFIRMED via on-screen evidence; NOT independently confirmed by email** — recorded honestly as such in the tracker, not overclaimed |
| NemKonto route = Nordea Erhverv (A) | `AskUserQuestion` tool response, unambiguous | N/A (a direct decision record, not a claim needing a second channel) | **CONFIRMED** |
| PITFALL row 4 ownership change recorded | Direct read after edit | `git show HEAD:PITFALL-WATCHLIST.md`, independent read from the git object store | **CONFIRMED**, verbatim match |
| `critical-actions.md` entry intact | Direct read after write | `grep`/`tail` fresh read, line count sanity check (2887 lines total) | **CONFIRMED** |
| Both deep-research prompt files complete | Direct read after write | `git show HEAD:<file>` line counts (173, 188) match the working-tree files | **CONFIRMED** |
| Funding tracker internally consistent | Direct read after each edit | `git show HEAD:FUNDING-NEMKONTO-PROGRESS-TRACKER.md` — **caught a real defect**, see §3 | **DRIFTED, then fixed and re-verified — see §3** |

## 3. Defects caught and fixed — specific, not summarized

**Defect 1 — self-contradicting checklist entry in
`FUNDING-NEMKONTO-PROGRESS-TRACKER.md`.** During earlier mid-session
editing, an `Edit` call replacing the old "§2.2 draft narrative" block
with new "§2.2 done" + "§2.4 done" text left the file's *original,
separate* pre-existing "§2.4 pending" checkbox line untouched further
down the same section — because that line was never part of the matched
`old_string`. Result: the file simultaneously claimed §2.4 both done
(`[x]`) and pending (`[ ]`) in two different places. **Caught during this
close's Phase-2 verification** by comparing `git show HEAD:<file>`
against the working file side-by-side (the independent-method check the
skill calls for) — not caught by the direct-read checks performed
mid-session, which only ever looked at the section just edited, not the
whole file. **Fixed:** removed the stale line, renumbered §2.1-2.5 into a
single consistent sequence, and added an honest note about the grant
application's confirmation-email gap (see §2, row 2) while there. Re-
verified via a fresh `grep` for all `- [x]`/`- [ ]` lines in the file
(no duplicates) and a second commit (`e28bb63`).

**Defect 2 (methodology, not content) — recurring git lock/tmp-object
unlink failures on this mount.** Not a defect in any deliverable, but a
real, now well-documented environmental defect: `git status`, `git add`,
and `git commit` each left behind lock/temp files this session's shell
could not remove in the same call that created them, requiring a
follow-up `mv` before the next git command would run. This did not
corrupt any commit (both commits verified clean), but it added real
friction and risk of a genuinely stuck state if not caught. See §6 for
the standing recommendation.

**No other defects found** in this session's own deliverables during the
two-pass check (§2's table). The `.gitignore` gaps caught pre-commit
(`.git-stale-locks/`, `web/functions-dist/`) are recorded as catches, not
defects in prior sessions' work — those directories were never previously
staged or committed.

## 4. Known limitations, stated plainly

- **The grant application's submission is not independently confirmed
  by email**, only by the on-screen "received" message and Yehor's own
  report. This may simply be normal (some programs email only after
  review begins) — it is not being treated as a red flag — but it is
  genuinely unverified by a second channel as of this report, and should
  be re-checked next session rather than assumed to have arrived.
- **NemKonto is not yet actually registered.** Nordea has only
  acknowledged receipt of the application; the account does not exist
  yet, and the "register as NemKonto" checkbox Yehor selected during the
  application only takes effect once the account itself is opened. §1.2-
  1.4 in the tracker remain open, accurately.
- **The compliance-strategy pivot (Row 4) carries a real, named risk that
  was flagged before Yehor decided, not after.** Yehor has chosen to
  personally review FixProve's own ToS/Privacy/GDPR compliance rather
  than pay for licensed professional review, citing one year of law
  study. This is his informed, explicit decision (recorded in
  `MEMORY/critical-actions.md`, 2026-09-03 entry) — but the underlying
  exposure (no liability shield, real GitHub App data access, an already-
  paused 30,000kr NJORD quote and three prepared legal drafts) is
  unchanged by the decision to self-review. The standing block on public
  pricing/Stripe/GitHub App visibility remains in force until that
  self-review is actually complete, not merely decided-upon.
- **The Q4 grant narrative's "legal review" component is now somewhat
  underspecified relative to Yehor's actual plan.** It was written to
  cover CRA classification advice and a second-opinion review of Yehor's
  own drafts — a reasonable, defensible interpretation given his explicit
  instruction to "keep Q4 anchored on the legal review and marketing" —
  but this was Claude's best coherent framing under time pressure, not
  something Yehor separately confirmed word-for-word before submission.
- **The recurring git lock/tmp-object unlink failure on this mount is
  still not root-caused**, only reliably worked around. If a future
  session's environment does not permit the `mv`-and-retry pattern (e.g.
  bash access denied, as happened in Session 4.24), git operations on
  this mount could genuinely stall rather than just need a retry.
- **`.git-stale-locks/` now holds a large and growing number of orphaned
  lock-file markers** (accumulated across many sessions, several dozen
  more added this session) — harmless (now gitignored, confirmed no
  content value), but worth a cleanup pass at some point for tidiness,
  not urgency.
- **This report and the funding tracker were the only files edited after
  the first commit landed** — both were caught by the self-reference
  check in §1.7 of the session-close skill and folded into the fixup
  commit (`e28bb63`) or written after both commits (this report itself).
  This report is being written and will be committed in a follow-up
  step; if that follow-up commit does not happen, this specific KS-REPORT
  file will exist only in the working tree, not yet in git history — a
  reader checking `git log` before that follow-up commit would not find
  it referenced by hash.

## 5. Accountability statement

**PENDING** — awaiting Yehor's sign-off.

## 6. Methodology note

Two process observations worth carrying forward, separate from the
technical defect log in §3:

1. **The two-pass check earned its keep this session.** Defect 1 (§3)
   was invisible to every mid-session direct read — each edit looked
   correct in isolation, checked against the section just touched. It
   only surfaced when the whole file was compared against its own git-
   committed version, a different method than the mid-session checks
   used. This is the concrete argument for treating "committed and
   `git show`-verified" as a stronger claim than "read back after
   editing," not just a formality.
2. **The recurring lock-file unlink failure (§3, Defect 2) should be
   treated as a standing operational fact about this specific mount from
   now on, not investigated fresh each session.** The practical rule for
   any future session with bash access: after every `git status`, `git
   add`, or `git commit` call, immediately check for and `mv` away any
   `.git/index.lock`, `.git/HEAD.lock`, or `.git/objects/**/tmp_obj_*`
   before the next git command, rather than being surprised by "another
   git process seems to be running" errors that aren't actually about a
   concurrent process at all.

## 7. Next step

**Unblocked immediately:** nothing further required to keep this
session's work safe — both commits are landed and verified locally.

**Blocked until Yehor acts (his own actions, not Claude's):**
- Push `main` to `origin/main` (2 commits ahead) — requires his explicit
  per-instance approval, not requested or assumed in this report.
- Nordea account opening completing (bank-side processing, no fixed ETA
  observed yet).
- NemKonto actually registering (depends on the above).
- Grant application review by Erhvervshusene (no fixed ETA stated on the
  program's own page).
- Running the Stage-1 meta-prompt (`DEEP-RESEARCH-PROMPT-META-compliance-
  platform-prompt-design-2026-09-03.md`) through 4 independent deep-
  research models, whenever Yehor chooses to pursue that thread.
- Deciding whether to keep the `ivsr.dk` free-clinic case (K145X8) running
  in parallel to his own self-review, or close it out (flagged, not
  decided, in `MEMORY/critical-actions.md`'s 2026-09-03 entry).

**Gated explicitly:** no further code changes, no pricing/Stripe/GitHub
App visibility changes — unchanged standing block, Row 4 still open by
this session's own record (§4).

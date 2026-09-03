NEXT SESSION — 4.16 — "Record is clean; only 'go' is open; watch for a lawyer
reply"

Written 2026-08-15 at the close of Session 4.15. Read the git-state section
below rather than assuming — this prompt asserts repo STATE and is untrusted
until checked against the mount, same as every prior starting prompt in this
project. Session 4.15 itself demonstrated why: it opened by finding that the
4.15 prompt's own inherited figures (32 untracked files, DECISION-3 = 93) had
already gone stale by the time they were quoted.

SESSION START (Keystone Stage 1 — Intake) — open via the
`session-strategy-synthesis` skill if available in this environment;
otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, never `rm`). Reappeared at least
   eight separate times across Session 4.15's three tasks plus close and was
   renamed away every time; treat a fresh appearance at 4.16's open as
   completely normal, not a signal of anything wrong.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else. Two prior snapshots exist alongside it
   (`state.superseded-4.13-snapshot.md`, `state.superseded-4.14-close-session-
   snapshot.md`) — neither is authoritative; only the un-suffixed `state.md`
   is current.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries) and
   `MEMORY/critical-actions.md`'s tail — Session 4.15 appended six entries in
   total (`grep -c '^## S4.15' MEMORY/critical-actions.md` = 6 as of this
   prompt's last edit; this number moved at least twice during the session's
   own closing pass alone — recount fresh, don't trust 6 either): the
   DECISION-3 selection rule; lawyer outreach independently verified + Row 4
   update (one entry, covers both); the DECISION-3 execution-rule design
   closure (allowlist + `/planning/`); the lawyer-gate waiver closure; a
   signature-line process incident (caught, reverted, logged); and Yehor's
   explicit override authorizing the signature afterward. Read all six in
   order — the last two matter for understanding why the KS-Reports are
   signed at all, not just that they are.
5. Read `MEMORY/ARTIFACT-MANIFEST.md`'s header before treating any named file
   as existing — standing CA-5 requirement, unchanged. **Note: this manifest
   was built in Session 4.13 and has not been regenerated since** — several
   real files now exist that postdate it (`KS-REPORT-4.14-*.md`,
   `KS-REPORT-4.15-*.md`, both new session logs). Treat the manifest as
   directionally useful, not exhaustive, until it is regenerated; a fresh
   on-disk search remains the actual source of truth per its own stated rule.
6. Verify all refs, don't assume:
   * `main` — expect `5a44fda` (Session 4.13's own close-out commit),
     unchanged by 4.14 or 4.15. Neither session committed, staged, or pushed
     anything — every write in both landed in a `.gitignore`d path
     (`MEMORY/`) or as an ordinary uncommitted working-tree edit. Re-verify
     fresh via `git log -1`; do not trust this prompt's SHA if it's stale.
   * `origin/main` — expect it to match `main` (0 ahead / 0 behind, confirmed
     live via `git fetch` at both the start and close of Session 4.15) —
     re-verify fresh.
   * `drafts/operating-plan-d17-d60`, `drafts/row4-legal-drafts`,
     `held-back-pile-2026-07-28` — not touched in 4.14 or 4.15, not
     re-verified in either session; check fresh if relevant to whatever 4.16
     actually works on.
7. Live-verify, don't assume 4.15's checks are still current by the time this
   session opens:
   * PyPI (`pypi.org/pypi/fixprove/json`) and npm
     (`registry.npmjs.org/fixprove/latest`) — both confirmed `0.1.10` in
     4.15. Re-verify fresh.
   * `fixprove.dev/` and `/app` — both HTTP 200 in 4.15; `/app` footer
     confirmed rendering a real `·`, not `&middot;`. `/privacy` and `/terms`
     also both HTTP 200. Re-check fresh.
   * GitHub repo (`FixProve/fixprove`) — 0 stars, 0 forks, 0 open issues, not
     archived, public, as of 4.15. Re-check fresh — this is a live signal,
     not a static fact.
   * `gh release list --repo FixProve/fixprove` — empty in 4.15 (tag
     `v0.1.10` exists, GitHub Release object does not). Re-verify if this
     becomes relevant.
   * **Gmail — check for replies from the 5 lawyer-outreach recipients.**
     `jn@jacobnaur.dk`, `aarhus@njordlaw.com` (two separate outreach emails,
     att. Malene Schlage Schultz Pedersen and Nis Peter Dall),
     `eas@patrade-legal.dk`, `as@otello.dk`. All five sent 2026-08-14,
     16:06–16:08 UTC, confirmed via live `search_threads` on `in:sent` in
     Session 4.15. **This is the single highest-value check at 4.16's open** —
     a reply makes Row 4 live for the first time in this project's history.

ITEMS REQUIRING YOUR ATTENTION BEFORE SUBSTANTIVE WORK BEGINS

1. **A reply from any of the 5 lawyer-outreach recipients, if one has
   arrived.** Not a background item — check first. If a reply exists, that is
   almost certainly 4.16's actual subject, not whatever else this prompt
   suggests. **Re-checked live at this session's own final close (2026-08-15,
   later the same day as the outreach + the mid-session check): still zero
   replies**, confirmed via `search_threads` against all four recipient
   domains, `-in:sent`. That freshness has an expiry — it says nothing about
   the gap between 2026-08-15 and whenever 4.16 actually opens.
2. **"Go" — the GitHub App public-visibility flip. The only genuinely open
   authorization word left in the entire project.** D3 (2026-08-14) authorized
   the bounded-test *plan* that needs this flip; it does not authorize the act
   itself. Publish-class, effectively irreversible, per this project's
   standing rule (push/deploy/publish is never inferred from a delegated
   decision). No repo file controls this setting — it lives at
   `github.com/settings/apps/fixprove` and requires Yehor's own authenticated
   (2FA) session, not something actionable from this sandbox even if
   authorized. Do not chase — surface once if relevant, otherwise wait.
3. **KS-REPORT-4.14 §6 and KS-REPORT-4.15 §6 — SIGNED, both ATTESTED,
   closed.** Real process arc worth reading in full at least once (each
   report's own addenda, plus `MEMORY/critical-actions.md`'s two matching
   S4.15 entries): the executor first wrote Yehor's signature in directly
   from his dictated text (a violation of `RUNBOOK-SESSION-OPERATING.md` §4's
   standing rule); caught it on its own closing double-check and reverted it;
   explained the rule to Yehor; he then gave a distinct, explicit,
   informed override ("You can do it for me I'm taking a resposibility for
   it," verbatim) after understanding what the rule protected against; the
   signature was entered on that basis. **This override is scoped to these
   two reports only** — the standing rule is unchanged for future reports
   unless Yehor separately says he wants it changed. Nothing further owed
   here.
4. **F1–F4 fork-decision research documents — still not archived.** They
   arrived truncated in Session 4.14 (each cut off mid-sentence, a
   large-paste UI artifact) and were correctly NOT written to disk as
   partial copies. `SYNTHESIS-4-14-FORK.md` (the synthesis built from them)
   IS fully archived. If Yehor re-pastes F1–F4 (ideally split across
   separate messages to avoid re-truncation), archive them under
   `MEMORY/research/4-14-FORK/` with the names `F1-fork-decision.md`,
   `F2-market-reality.md`, `F3-memorandum-fork.md`, `F4-evidence-review.md`,
   byte-verify, and only then append the `SESSION-LOG-INDEX.md` line for that
   archive (not before — the archive itself must be complete first).

SEPARATELY, NOW UNBLOCKED AT THE DESIGN LEVEL BUT NOT YET EXECUTED

5. **DECISION-3 (relocate in-scope root-level process/markdown files) — design
   is complete, execution is not.** Session 4.15 closed both of DECISION-3's
   open questions: the selection rule (depth-1 root `*.md`, minus community
   files, minus git-ignored — **92 in scope when first measured, 2026-08-15;
   already moved to 94 by this same session's own final closing pass, purely
   because two more of this session's own files (`KS-REPORT-4.15-*.md`,
   `NEXT-SESSION-4.16-*.md`) landed in the set being measured. This is not a
   hypothetical caveat — it is demonstrated, live, within one session. Recompute
   at point of use; never quote any number here as a bare fact, "94" included**)
   and the bucket specification (keep-at-root allowlist —
   `PITFALL-WATCHLIST.md`, `NOTICE.md`, three runbooks,
   `STRIPE-SETUP-CHECKLIST.md`, plus community files — and a new
   `/planning/` bucket for the plans/research class, parallel to
   `/ks-reports/`, `/session-prompts/`, `/client-summaries/`,
   `/legal-drafts/`). **Nothing has been moved.** Execution requires Yehor's
   explicit go-ahead, separate from the design approval already given. Before
   moving anything: re-run the selection rule fresh (the count will have
   changed again), and handle the 29-ish untracked files differently from the
   ~63 tracked ones (an untracked-file move is git-invisible and
   unrecoverable if it goes wrong; a tracked-file move should be a `git mv`).
6. **Identity build (typefaces/logo per the locked R4 spec)** — confirmed via
   direct code search in Session 4.14, unchanged in 4.15: 0 of 2 remaining
   elements implemented. `web/src/app/globals.css` still only has the
   pre-spec system-font fallback stack; no Space Grotesk/Inter/JetBrains
   Mono, no logo asset, anywhere in `web/src`. Commission-on-request only,
   per standing rule.
7. **`MEMORY/ARTIFACT-MANIFEST.md` is now stale relative to the mount** — it
   predates `KS-REPORT-4.14-*.md`, `KS-REPORT-4.15-*.md`, and both new
   session logs. Not urgent, but a future session should regenerate it rather
   than let staleness compound; CA-5's own rule already covers the interim
   (fresh search beats a stale manifest).
8. Row 4 (the actual gate) — outreach sent, 5 candidates, no replies as of
   2026-08-15. Check fresh per item 1 above — this is the one item on this
   list that is genuinely time-sensitive now, unlike the others.
9. The empty private `yehorcallmedai-maker/fixprove` repo — unchanged, zero
   urgency, still Yehor's delete-vs-leave call.
10. D3's bounded-test clock, once "go" is given: window 2026-08-14 →
    2026-11-12. Whoever opens the session after "go" is said should check how
    many days remain and whether any install/willingness-to-pay signal has
    come in — live and time-sensitive once activated, background until then.

EXPECTED GIT STATE — read before reacting

`main` = `origin/main` = `5a44fda` (0 ahead / 0 behind), unchanged since
Session 4.13's own close-out commit. Neither Session 4.14 nor Session 4.15
committed, staged, or pushed anything — every write in both sessions landed
in a `.gitignore`d path (`MEMORY/`) or as an ordinary uncommitted
working-tree edit, confirmed via `git diff --cached --name-only` returning
empty at every checkpoint across both sessions.

New/changed working-tree state from Session 4.15, all uncommitted:

* `session-logs/SESSION-LOG-2026-08-14-session-4.14-positioning-and-fork-
  decisions.md` and `KS-REPORT-4.14-positioning-and-fork-decisions.md`
  (+ Addendum 1) — new, untracked, written retrospectively this session to
  close 4.14's own SESSION END gap.
* `session-logs/SESSION-LOG-2026-08-15-session-4.15-record-reconciliation.md`
  and `KS-REPORT-4.15-record-reconciliation.md` — new, untracked, this
  session's own close-out pair.
* `MEMORY/critical-actions.md` — six new append-only entries this session,
  independently recounted at final close (`grep -c '^## S4.15'
  MEMORY/critical-actions.md` = 6): DECISION-3 count/rule; lawyer outreach +
  Row 4 update; DECISION-3 execution-rule design closure; lawyer-gate waiver
  closure; a signature-line process incident (caught, reverted, logged); and
  Yehor's explicit override authorizing the signature to be entered after
  that incident. This number, like every count in this document, was correct
  at the moment it was last verified and not guaranteed to still be 6 by the
  time 4.16 opens — recount, don't quote. Git-invisible via `.gitignore:57`.
* `MEMORY/state.md` — fully replaced twice this session (once mid-session to
  close 4.14's gap, once at this session's own close). Prior versions
  preserved as `state.superseded-4.13-snapshot.md` and
  `state.superseded-4.14-close-session-snapshot.md`, git-invisible.
* `PROGRESS.md` — three entries appended this session (4.14's retrospective
  entry, 4.15's mid-session entry, 4.15's close entry).
* `session-logs/SESSION-LOG-INDEX.md` — two updates: 4.14's "in progress"
  line replaced with a closed entry; a new 4.15 entry appended.
* This prompt file itself (`NEXT-SESSION-4.16-STARTING-PROMPT.md`) — new,
  untracked.

Unchanged from 4.13's close, still open, still none of it 4.14's or 4.15's
scope:

* Root-level `.md` backlog (legal drafts, older NEXT-SESSION prompts,
  operating/marketing plans) — pre-existing, DECISION-3's actual subject
  matter, now fully design-scoped (see item 5 above) but not yet moved.
* `.github/workflows/fixprove-check.yml`, `web/functions-dist/`,
  `web/legal/OPEN-QUESTIONS-LOG.md` — all previously confirmed
  intentional/harmless, not re-litigated in 4.14 or 4.15.
* CRLF-only drift on `RUNBOOK-SESSION-OPERATING.md`, `cli/package.json`,
  `engine/python/pyproject.toml` — re-confirmed whitespace-only
  (`git diff -w` empty) at every check across both sessions.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)

No live Stripe keys, no public-facing pricing (even placeholders), no
Marketplace listing publish — until both gates clear (Gate-1 legal review;
Gate-2 = 100 installs + verified publisher, Marketplace route only). Extends
to LinkedIn/GitHub copy too, not just the repo/site. The GitHub App public
flip specifically: D3 (2026-08-14) authorized the bounded-test PLAN that
requires this flip, but the flip itself still requires Yehor's separate,
explicit "go" in chat — treat it as still gated until that word actually
appears, not as cleared by D3 alone. Neither 4.14 nor 4.15 performed the
flip.

GOAL — genuinely open, driven by what's actually true when the session opens

The project's record is clean for the first time in several sessions — no
open contradictions, no undocumented decisions, no unverified claims sitting
in the append-only record. That means 4.16's actual shape depends entirely on
one external fact this prompt cannot know: **has a lawyer replied?** If yes,
that reply is the session. If no, the session defaults to whichever
non-blocking backlog item Yehor wants to move — none of them are urgent, none
of them block each other, and none of them require guessing at priority
without asking him first.

MUST-CLOSE LIST (scope depends on what 4.16 actually finds)

* Verify all refs + on-disk state per intake; report any deviation, don't
  explain away.
* Check Gmail for lawyer replies before anything else — see item 1 above.
* Do NOT flip the GitHub App, and do NOT publish any copy, without Yehor's
  separate explicit "go."
* Do not move any DECISION-3 files without his explicit go-ahead, even though
  the design question is now closed.
* If F1–F4 arrive, complete the archival properly: archive → byte-verify →
  THEN append the index line, in that order, not before.
* VAT Q2: due 2026-09-01 — confirm the window hasn't moved or been missed.
  As of 4.15's close: not missed, ~17 days out.
* CRA Row 7: reporting obligations independently confirmed at 2026-09-11 —
  distinct clock from VAT, do not conflate.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` = `5a44fda` (0 ahead /
  0 behind) — unless Yehor has committed/pushed something since, which would
  itself be worth noting as a deviation from this prompt's expectation.
* `fixprove.dev/app` footer renders a real `·` character, not `&middot;`.
* Gmail `in:sent` still shows exactly 5 messages to the lawyer-outreach
  recipients dated 2026-08-14 — if any reply exists, it will show as a new
  message in the corresponding thread.

KNOWN GOTCHAS TO CARRY FORWARD (unchanged from prior sessions unless noted)

* "Verified" doesn't carry across turns/sessions — only evidence does.
  Session 4.15's clearest demonstration: the same claim (lawyer outreach was
  sent) was correctly EXCLUDED in Task A for lack of on-mount evidence, then
  correctly CONFIRMED in Task B once an independent channel (live Gmail
  search) existed — both were right, because the evidence available changed
  between them, not because the first check was sloppy.
* Independent verification is only as good as the independent channel
  available. The Gmail check in Session 4.15 was possible because that
  session had direct Gmail tool access; if a future session lacks a
  comparable channel for some other relayed claim, the honest move is to
  mark it UNVERIFIED, not to assume access will exist.
* Large single pastes into this chat can silently truncate (confirmed in
  4.14: 4 of 5 research documents cut off mid-sentence with a bare `pasted`
  marker). If archiving pasted research content, check for a clean ending
  before writing it to disk — never archive a fragment as if it were the
  whole document.
* Any bare number quoted without a date is suspect — DECISION-3's count is
  the clearest recurring example (59 → 93 → 92, three sessions, three
  different true snapshots). The fix isn't a better number; it's quoting the
  rule and recomputing.
* This sandbox's `web/node_modules` is a Windows-native pnpm install and
  cannot run `next build`, `pnpm test`, or any native-binary tool on this
  Linux sandbox. Have Yehor run the real build/test/deploy on his own
  machine.
* `git fetch` (read) works from this sandbox against GitHub; `git push`
  (write) does not — Yehor's machine only.
* `MEMORY/` is entirely `.gitignore`d (`.gitignore:57`) — anything written
  there is structurally invisible to `git status`/`git diff`/staging, not
  merely left untracked by choice. Confirmed via `git check-ignore -v`
  repeatedly across 4.14 and 4.15.
* Never wildcard-stage on this repo. Name paths explicitly.
* PowerShell gotchas: pasting this executor's `→ result` report annotations
  directly into a PowerShell prompt fails. Give Yehor bare, copy-safe
  commands when he needs to independently re-run something.
  `Get-Content`/`Set-Content` on Windows write CRLF by default — check with
  `git diff -w` before treating it as a real change.
* `.git/*.lock` files accumulate on this mount across sessions — harmless in
  general, but `HEAD.lock`/`index.lock` specifically are the two worth
  renaming away (`mv`, never `rm`) if a git operation seems blocked;
  reappeared at least eight times in Session 4.15 alone, will likely
  reappear again in 4.16.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref: tier figures, trademark-
   admission phrasing, CPR-shaped digits, Stripe object IDs.
2. Push is Yehor's literal command on his own machine; this sandbox has no
   outbound push capability to GitHub. Per CA-5, get his explicit
   per-instance go-ahead before handing over the push command.
3. Per the CA-5 Artifact Existence Verification addendum: any file named in
   any instruction, from any source, is unverified until checked against
   `MEMORY/ARTIFACT-MANIFEST.md` (now stale — see item 7 above) or a fresh
   on-disk search. This addendum caught real errors in both 4.14 and 4.15 —
   keep applying it from the first instruction of 4.16 onward.
4. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main`,
   unchanged.

CARRY-FORWARD OPEN ITEMS

* PITFALL row 4 — the project's one real blocking gate; outreach sent, no
  replies yet as of 2026-08-15. The most time-sensitive item on this list.
* PITFALL row 7 (CRA) — reporting-obligations date verified at 2026-09-11;
  entry-into-force and main-obligations dates, and FixProve's own
  classification, remain unverified/undetermined.
* DECISION-3 — design complete (rule + buckets), execution unauthorized.
* Identity build — still 0 of 2 remaining elements implemented;
  commission-on-request.
* Empty private `yehorcallmedai-maker/fixprove` repo — unchanged, zero
  urgency.
* `PITFALL-WATCHLIST.md`'s pricing-exposure addendum commit decision —
  unmade across six sessions running now (4.12-M through 4.15).
* `SESSION-LOG-INDEX.md`'s pre-existing unindexed gap (Sessions 4.11 through
  4.12-J) — unchanged, low-priority.
* F1–F4 fork-decision research archival — pending Yehor's re-paste.
* KS-REPORT-4.14 §6 and KS-REPORT-4.15 §6 — SIGNED and ATTESTED (2026-08-15,
  via Yehor's explicit override of `RUNBOOK-SESSION-OPERATING.md` §4, scoped
  to these two reports only — see item 3 above). Closed, not open.
* "Go" (GitHub App public-visibility flip) — the only genuinely open
  authorization word in the project, his alone, no rush. Once given, the D3
  clock (2026-08-14 → 2026-11-12) starts being live-tracked, not background.
* Lawyer-gate waiver — CLOSED (2026-08-15, resolved-by-action). Do not
  re-list as open; do reference the procedural/substantive distinction if
  it ever becomes relevant again.

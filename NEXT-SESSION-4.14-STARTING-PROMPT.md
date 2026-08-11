NEXT SESSION — 4.14 — "DECISION-3 sign-off, Row 4 check, identity build (if commissioned)"
Written 2026-08-11 at the close of Session 4.13. Read the git-state section below rather
than assuming — this prompt asserts repo STATE and is untrusted until checked against the
mount, same as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake) — open via the `session-strategy-synthesis`
skill if available in this environment; otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); a lock reappearing is expected/
harmless on this mount, confirmed across every session to date, including this one
(`index.lock` and `HEAD.lock` both appeared and were renamed away during 4.13's own close).
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before doing anything
else.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries) and
`MEMORY/critical-actions.md`'s tail (last ~4 entries) — Session 4.13 appended entries for:
the middot defect fix, the n=2→n=4 correction, DECISION-5/6/7 (superseded same day),
DECISION-5 REVISED/6/8 (n=4 evidence), the CA-5 addendum + artifact-manifest build, and
DECISION-9/10. Read the CORRECTION entry carefully — DECISION-5 was recorded twice in one
session and only the second (REVISED) version is current.
5. Read `MEMORY/ARTIFACT-MANIFEST.md`'s header before treating any named file as existing —
this is now a standing CA-5 requirement, not optional, as of this session's close.
6. Verify all refs, don't assume:
   * `main` — expect this session's own close-out commit on top of `85d2f2a` (the exact
     new SHA is stated in `KS-REPORT-4.13-public-presence-audit-and-identity-synthesis.md`
     §7/commit log — re-verify fresh via `git log -1`, do not trust this prompt's number if
     it's stale)
   * `origin/main` — expect it to match `main` once Yehor has pushed this session's
     close-out commit; if `main` is ahead of `origin/main`, that push is the very first
     action this session should confirm or perform
   * `drafts/operating-plan-d17-d60` — expect `4f848b4` (not re-verified in 4.13 — check
     fresh)
   * `drafts/row4-legal-drafts` — expect `b3beb1c`
   * `held-back-pile-2026-07-28` — expect `2bfd154` (a branch, not a tag)
7. Live-verify, don't assume 4.13's checks are still current by the time this session opens:
   * `fixprove.dev/app` — footer separators should render `·` (a real middot character),
     not the literal string `&middot;`. This was the exact live defect fixed and shipped in
     4.13 (`85d2f2a`) — a one-glance confirmation this session's own claimed fix actually
     survived.
   * External-signals counter (`api.github.com/repos/FixProve/fixprove`, Chrome fetch, NOT
     `web_fetch`) — was 0/0/0/0 as of 2026-08-08, not re-checked in 4.13, re-verify fresh.
   * GitHub profile README/bio and LinkedIn headline/About — 4.13 corrected both; a fresh
     spot-check (not a full re-audit) is sufficient unless Yehor reports a further edit
     since.

ITEMS REQUIRING YOUR ATTENTION BEFORE SUBSTANTIVE WORK BEGINS

1. **DECISION-3 (relocate 93 root-level process/markdown files into `/ks-reports/`,
   `/session-prompts/`, `/client-summaries/`, `/legal-drafts/`) was presented to Yehor in
   4.13 and never confirmed.** Do not execute the move on an assumed yes and do not silently
   drop it — ask directly whether he still wants it, and if so, whether the proposed folder
   layout still holds.
2. **The empty private `yehorcallmedai-maker/fixprove` repo** (confirmed harmless — zero
   commits, zero stars/forks/watchers, private, an untouched GitHub quick-setup scaffold)
   still needs Yehor's delete-vs-leave call. Zero urgency; ask once, don't chase.
3. **Row 4 (the actual gate)** — not touched in 4.13. Check fresh at session start per the
   standing "don't chase" rule; if Yehor has an update, read it fresh rather than assuming
   it matches any prior summary.
4. **If Yehor wants to commission the identity build** (implementing DECISION-5 REVISED/6/
   8/9/10 — three typefaces, dark-on-teal buttons, brackets-and-checkmark logo, lowercase
   wordmark — into real code/CSS/assets), that is new build work, not a carried-over defect.
   Confirm scope explicitly before starting; nothing has been implemented yet.

EXPECTED GIT STATE — read before reacting

`main` should be at Session 4.13's own close-out commit (new files: this session's own
research/identity/GitHub-LinkedIn-support documents, two previously-missing session logs
for 4.12-L and 4.12-M, the `SESSION-LOG-INDEX.md` update that references them,
`KS-REPORT-4.13-public-presence-audit-and-identity-synthesis.md`, this session's own log,
and this prompt) — pushed if Yehor has run `git push origin main` since; verify, don't
assume.

Deliberately still uncommitted, unchanged from 4.13's close (see
`KS-REPORT-4.13-public-presence-audit-and-identity-synthesis.md` §5 for the full reasoning
on each):

* `PITFALL-WATCHLIST.md` — modified, Task J's pricing-exposure addendum, Yehor's
  exposure-vs-honesty call, still not made across three sessions running.
* `RUNBOOK-SESSION-OPERATING.md`, `cli/package.json`, `engine/python/pyproject.toml` —
  confirmed CRLF-only via `git diff -w` (empty) in 4.13, same recurring non-issue. Do not
  treat as real drift without re-checking `git diff -w` yourself.
* 13 legal drafts, older `NEXT-SESSION-4.12-H` through `-M-STARTING-PROMPT.md`, two more
  untracked older session logs (4.12-J, 4.12-K dates), `OPERATING-PLAN-D17-D60.md`,
  `SESSION-PLAN-TO-R1.md`, `STAGE-1-DEPLOY-RUNBOOK.md`, `EXECUTOR-BRIEF-2026-08-01-
  marketing-hold.md`, `ROAD-TO-FIRST-SALE-MASTER-PLAN-2026-08-01.md`, two `DEEP-RESEARCH-
  PROMPT-road-to-first-sale*.md` files — all pre-existing backlog, none of it this
  session's scope, none of it blocking.
* `.github/workflows/fixprove-check.yml` — confirmed in 4.13 (via its own header comments)
  to be an *intentional* customer-facing distributable template dating to Session 2.1, not
  a misplaced file. Untracked since inception; zero urgency.
* `web/functions-dist/`, `web/legal/OPEN-QUESTIONS-LOG.md` — unchanged, the latter
  deliberately excluded per the 4.12-L public-edition sign-off.

Known debris: none newly flagged this session. If any stray `_tmp_*` or similar files
appear, investigate rather than assume harmless.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)

No live Stripe keys, no public-facing pricing (even placeholders), no GitHub App public
flip, no Marketplace listing publish — until both gates clear (Gate-1 legal review; Gate-2
= 100 installs + verified publisher, Marketplace route only). Nothing in 4.13 touched any
of these. The same boundary now explicitly extends to LinkedIn/GitHub copy, not just the
repo/site — 4.13's LinkedIn catch is the reason this line is being restated here rather
than assumed understood.

GOAL — genuinely open, driven by what Yehor confirms, not predetermined

4.13 closed the identity *decisions* and corrected two public profiles of real defects, but
left three concrete threads open (DECISION-3, the empty-repo call, and whether/when to
commission the identity build) plus the standing row-4 gate. This session's actual shape
depends on which of those Yehor wants to move first — ask, don't assume the calendar or a
prior prompt sets the agenda.

MUST-CLOSE LIST (scope depends on Yehor's answers to the items above)

* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Resolve items 1–3 above (or explicitly re-defer, in Yehor's own words) before any
  substantive new work.
* Fresh live-check of `/app`'s middot fix and the external-signals counter — do not assume
  4.13's checks are still valid without re-verifying.
* VAT filing: do NOT file early (~01-09-2026 is the actual window, now genuinely close —
  confirm the exact date hasn't been missed or moved).
* NemKonto: still open, non-urgent.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` (0 ahead / 0 behind) once Yehor has
  pushed 4.13's close-out commit.
* `fixprove.dev/app` footer renders a real `·` character, not the literal string
  `&middot;`.
* Items 1, 2, and 3 above each explicitly addressed with Yehor this session — not silently
  carried forward a third/second time without at least asking once.

KNOWN GOTCHAS TO CARRY FORWARD

* "Verified" doesn't carry across turns/sessions — only evidence does. 4.13's clearest
  demonstration: a same-day synthesis built on an assumed-but-wrong file count (n=2 instead
  of n=4) was caught only because Yehor checked it himself, not because the process caught
  it first. Re-verify inputs, not just outputs.
* This sandbox's `web/node_modules` is a Windows-native pnpm install and cannot run
  `next build`, `pnpm test`, or any native-binary tool on this Linux sandbox. Have Yehor run
  the real build/test/deploy on his own machine, as in every prior session.
* `git fetch` (read) works from this sandbox against GitHub; `git push` (write) does not —
  Yehor's machine only.
* `api.github.com`, `pypi.org`, `registry.npmjs.org` are reachable via Chrome
  `navigate`+`get_page_text` from this sandbox; `mcp__workspace__web_fetch` has repeatedly
  failed against all three across many sessions.
* LinkedIn's About/Experience sections do not reliably render via automated tooling
  (`get_page_text`, scripted scroll, direct DOM queries) — confirmed failing at every single
  attempt in 4.13 (`document.body.innerText.length` frozen at exactly 11279 chars
  throughout). The only reliable verification method found: ask Yehor for a fresh
  screenshot and read it directly. Do not spend session time re-attempting automated
  LinkedIn extraction without a genuinely new approach.
* React does not HTML-entity-decode string literals inside JSX curly braces
  (`{" &middot; "}` renders literally) — only plain JSX text does. If any future page adds
  a separator character via a JS string, use the literal character (`{" · "}`), not an HTML
  entity name.
* Never wildcard-stage on this repo. Name paths explicitly.
* PowerShell gotchas accumulated this project: `Get-Content`/`Set-Content` on Windows write
  CRLF by default, showing as a full-file diff against this repo's LF-committed blobs —
  always check with `git diff -w` before treating it as a real change.
* `.git/*.lock` files accumulate on this mount across sessions (dozens of renamed
  `.stale-*`/`.bak-*`/`.renamed-*` files exist in `.git/` from prior sessions) — harmless,
  but if a genuinely blocking lock appears (`index.lock`, `HEAD.lock`), rename it away
  (`mv`, never `rm`) and re-verify the git operation succeeds before proceeding.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref: tier figures, trademark-admission
   phrasing, CPR-shaped digits, Stripe object IDs.
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound push
   capability to GitHub (though `git fetch` read access does work). Per CA-5, get his
   explicit per-instance go-ahead before handing over the push command.
3. Per the new CA-5 Artifact Existence Verification addendum (2026-08-11): any file named
   in any instruction, from any source, is unverified until checked against
   `MEMORY/ARTIFACT-MANIFEST.md` or a fresh on-disk search. Apply this from the very first
   instruction of this session onward.
4. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main`, unchanged.

CARRY-FORWARD OPEN ITEMS

* PITFALL row 4 — the project's one real blocking gate; unchanged, not recorded in 4.13.
* DECISION-3 (93-file relocation) — presented, unconfirmed, see item 1 above.
* Empty private `yehorcallmedai-maker/fixprove` repo — see item 2 above.
* Identity build (implementing the now-locked R4 spec) — not started, commission-on-request.
* `PITFALL-WATCHLIST.md`'s pricing-exposure addendum (six files, not three) — uncommitted
  across three sessions running, Yehor's call whether to commit.
* `SESSION-LOG-INDEX.md`'s pre-existing unindexed gap (Sessions 4.11 through 4.12-J) —
  unchanged, low-priority.
* Held-back pile — anchored at `held-back-pile-2026-07-28` = `2bfd154`, Yehor's call.
* `web/functions-dist/` — untracked build output, harmless, low-priority `.gitignore`
  candidate.
* `.github/workflows/fixprove-check.yml` — confirmed intentional, untracked since Session
  2.1, low-priority "should this actually be committed" housekeeping question.

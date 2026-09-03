NEXT SESSION — 4.15 — "D2/D3 decided (Option A + bounded demand test); awaiting Yehor's
separate 'go' to flip the GitHub App public; lawyer-gate waiver still open; F1-F4
re-archival; DECISION-3/identity still unconfirmed"
Written 2026-08-14 at the close of Session 4.14 (updated same day, later in the session,
after Yehor recorded D2/D3). Read the git-state section below rather than assuming — this
prompt asserts repo STATE and is untrusted until checked against the mount, same as every
prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake) — open via the `session-strategy-synthesis`
skill if available in this environment; otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); a lock reappearing is expected/
   harmless on this mount, confirmed across every session to date. `HEAD.lock` and
   `index.lock` both appeared again during 4.14 (as they have in prior sessions) and were
   renamed away at this session's close (`HEAD.lock.stale-1786722260`,
   `index.lock.stale-close-4.14`) — re-verify git operations succeed cleanly at the start
   of 4.15 rather than assuming 4.14's clear-out is still valid.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before doing anything
   else.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries) and
   `MEMORY/critical-actions.md`'s tail — Session 4.14 appended: Row 7 seeded (EU Cyber
   Resilience Act, relayed and initially flagged unverified), then Row 7's
   reporting-obligations date independently VERIFIED via live `WebSearch` in the same
   session (11 September 2026, cross-referenced against 5 independent compliance-tracking
   sources — see that addendum for the source list). Read both Row 7 addenda in order; the
   second doesn't replace the first, it resolves one specific open question inside it.
5. Read `MEMORY/ARTIFACT-MANIFEST.md`'s header before treating any named file as existing —
   standing CA-5 requirement, unchanged.
6. Verify all refs, don't assume:
   * `main` — expect `5a44fda` (Session 4.13's own close-out commit), unchanged by 4.14.
     4.14 did NOT commit, stage, or push anything — re-verify fresh via `git log -1`, do
     not trust this prompt's SHA if it's stale.
   * `origin/main` — expect it to match `main` (0 ahead / 0 behind, confirmed throughout
     4.14) — re-verify fresh.
   * `drafts/operating-plan-d17-d60`, `drafts/row4-legal-drafts`,
     `held-back-pile-2026-07-28` — not touched in 4.14, not re-verified this session either;
     check fresh if relevant to whatever 4.15 actually works on.
7. Live-verify, don't assume 4.14's checks are still current by the time this session opens:
   * PyPI (`pypi.org/pypi/fixprove/json`) and npm (`registry.npmjs.org/fixprove/latest`) —
     both confirmed `0.1.10` in 4.14. Re-verify fresh; do not assume unchanged.
   * `fixprove.dev/` and `/app` — both HTTP 200 in 4.14; `/app` footer confirmed rendering a
     real `·`, not `&middot;`. `/privacy` and `/terms` also both HTTP 200. Re-check fresh.
   * GitHub repo (`FixProve/fixprove`) — 0 stars, 0 forks, 0 open issues, not archived, as of
     4.14. Re-check fresh — this is a live signal, not a static fact.
   * `gh release list --repo FixProve/fixprove` — empty in 4.14 (tag `v0.1.10` exists,
     GitHub Release object does not). Re-verify if this becomes relevant.
   * LinkedIn — 4.14 explicitly could NOT verify current state (no URL on record anywhere in
     this repo/memory, no authenticated access). If Yehor has visibility, ask him directly
     rather than re-attempting automated extraction (see gotchas below).

ITEMS REQUIRING YOUR ATTENTION BEFORE SUBSTANTIVE WORK BEGINS

1. **A/B/C/D positioning word — ✅ CLOSED, same session (2026-08-14).** Yehor's own words:
   "let's fully rely on their decision (this is my decision I'm responsibly taking)."
   Recorded as **D2: Option A adopted** — see `MEMORY/critical-actions.md`'s "S4.14 — D2
   and D3 recorded" entry for the full reasoning. Live-copy audit
   (`MEMORY/drafts/4-14-positioning-copy.md`) found the homepage/README/`/app` copy
   already fully Option-A-aligned since Session 4.12-D — **no copy change is pending.**
2. **Fork word — ✅ CLOSED, same session (2026-08-14).** Same delegation. Recorded as
   **D3: bounded real-demand test authorized** — window 2026-08-14 → 2026-11-12 (30–90
   days), mechanism = open the GitHub App to third-party installs + direct outreach to
   20–30 hand-picked ICP teams, success threshold = ≥3–5 installs AND ≥1
   willingness-to-pay signal within 6–8 weeks. Full reasoning in the same
   `critical-actions.md` entry. **The test PLAN is authorized; the App has not been
   flipped public yet — see item 3.**
3. **"Go" — the GitHub App public-visibility flip — ❌ still open, Yehor's alone.** D3
   authorizes the *plan*; flipping GitHub App installation visibility from internal-only
   to public is a publish-class, effectively-irreversible action, and per this project's
   standing rule (push/deploy/publish is never inferred from a delegated decision), it
   waits on a separate, explicit "go" from Yehor in chat — distinct from D2/D3 themselves.
   No repo file controls this setting; it lives at `github.com/settings/apps/fixprove` and
   requires Yehor's own authenticated (2FA) session to change, same as the Session 4.9
   permissions check. Do not chase — surface once if relevant, otherwise wait.
4. **Lawyer-outreach gate — waiver recommended, still NOT confirmed.** A relayed
   recommendation (from Yehor's separate "guide chat," pasted into 4.14) argued for waiving
   the DECISION-3/identity-build gate on advokatnoeglen.dk outreach, reasoning that the
   live public surfaces are clean and the remaining items (93-file relocation, typefaces,
   logo) are polish, not defects — see Task E's findings in the 4.14 session log for the
   underlying evidence. **This executor never received Yehor's own confirming or
   overruling sentence on this specific gate** — separate from the "go" in item 3, and
   still open. Do not draft or send any outreach message until it's recorded, in his own
   words.

SEPARATELY, NOW EXPLICITLY UNBLOCKED BUT NOT YET INITIATED

5. **DECISION-3 (relocate 93 root-level process/markdown files** into `/ks-reports/`,
   `/session-prompts/`, `/client-summaries/`, `/legal-drafts/`) — the file count is 93, not
   59; a stale "59" figure was caught and corrected in 4.14 (see `critical-actions.md`
   and `state.md` for the two points where the count changed mid-Session-4.13, and 4.14's
   own note on why the correction happened). The relayed guide-chat recommendation called
   this "not blocking" going forward — but it was never actually authorized to execute; ask
   Yehor explicitly before moving any file.
6. **Identity build** (typefaces/logo per the locked R4 spec) — confirmed in 4.14 via direct
   code search: **0 of 2 remaining elements implemented.** `web/src/app/globals.css` still
   only has the pre-spec system-font fallback stack; no Space Grotesk/Inter/JetBrains Mono,
   no logo asset, anywhere in `web/src`. The button-fill token (the 3rd spec element) was
   already live before the spec existed and needs no further work. Commission-on-request
   only, per standing rule.
7. **F1–F4 fork-decision research documents — still not archived.** They arrived truncated
   in 4.14 (each cut off mid-sentence with a bare `pasted` marker — a large-paste UI
   artifact, not a content decision) and were correctly NOT written to disk as partial
   copies. `SYNTHESIS-4-14-FORK.md` (the synthesis built from them) IS fully archived. If
   Yehor re-pastes F1–F4 (ideally split across separate messages to avoid re-truncation),
   archive them under `MEMORY/research/4-14-FORK/` with the names `F1-fork-decision.md`,
   `F2-market-reality.md`, `F3-memorandum-fork.md`, `F4-evidence-review.md`, byte-verify,
   and only then append the SESSION-LOG-INDEX.md line for that archive (not done in 4.14
   because the archive itself wasn't complete — do not claim "archived" before it's true).
8. **Row 4 (the actual gate)** — not touched in 4.14. Check fresh at session start per the
   standing "don't chase" rule.
9. **The empty private `yehorcallmedai-maker/fixprove` repo** — unchanged, zero urgency,
   still Yehor's delete-vs-leave call.
10. **D3's bounded-test clock, once "go" is given:** window 2026-08-14 → 2026-11-12.
    Whoever opens 4.15 should check whether "go" has been said yet and, if so, how many
    days remain and whether any install/willingness-to-pay signal has come in — this is a
    live, time-sensitive item once activated, not a background one.

EXPECTED GIT STATE — read before reacting

`main` = `origin/main` = `5a44fda` (0 ahead / 0 behind), unchanged by 4.14 — 4.14 did no
commits, no staging, no pushes; every write this session landed in a `.gitignore`d path
(`MEMORY/`) or as an ordinary uncommitted working-tree edit, confirmed via
`git diff --cached --name-only` returning empty at every checkpoint this session.

New/changed working-tree state from 4.14, all uncommitted:

* `PITFALL-WATCHLIST.md` — modified. Adds Row 7 (EU Cyber Resilience Act) plus two dated
  addenda (seed + independent date verification). Still carries forward the pre-existing,
  multi-session-old pricing-exposure addendum decision, unmade by Yehor across four
  sessions running now.
* `session-logs/SESSION-LOG-INDEX.md` — modified. New final line (2026-08-14, Session
  4.14, "in progress") documenting the A/B/C/D archive and this session's two caught
  errors (stale baseline SHA, wrong index path). Tracked-status unchanged — it was already
  a tracked file before this edit, same as before.
* `MEMORY/research/4-14-ABCD/` — new directory, 5 files (SYNTHESIS + R1–R4), all
  byte-verified, all git-invisible (`.gitignore:57:MEMORY/`).
* `MEMORY/research/4-14-FORK/` — new directory, 1 file (`SYNTHESIS-4-14-FORK.md`
  only — F1–F4 still pending, see item 7 above), also git-invisible.
* `MEMORY/critical-actions.md` — appended, git-invisible. New "S4.14 — D2 and D3
  recorded" entry: full reasoning for both decisions, in Yehor's own words as the
  authorizing sentence, plus the explicit statement that the GitHub-App public flip is
  NOT authorized by D2/D3 alone.
* `MEMORY/drafts/4-14-positioning-copy.md` — new file, git-invisible. D2's live-copy
  audit: confirms zero "AI reviewer"/"static analysis" framing anywhere in current public
  copy — no copy change is actually pending for Option A.
* This prompt file itself (`NEXT-SESSION-4.15-STARTING-PROMPT.md`) — new, untracked,
  updated once already this same session after D2/D3 were recorded.

Unchanged from 4.13's close, still open, still none of it 4.14's scope:

* 32 loose untracked `.md` files at repo root (legal drafts, older NEXT-SESSION prompts,
  operating/marketing plans) — pre-existing backlog, DECISION-3's actual subject matter.
* `.github/workflows/fixprove-check.yml`, `web/functions-dist/`,
  `web/legal/OPEN-QUESTIONS-LOG.md` — all previously confirmed intentional/harmless, see
  4.13's own prompt for the reasoning; not re-litigated in 4.14.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing) — ONE ITEM NOW
EXPLICITLY PLAN-AUTHORIZED, STILL NOT EXECUTION-AUTHORIZED

No live Stripe keys, no public-facing pricing (even placeholders), no Marketplace listing
publish — until both gates clear (Gate-1 legal review; Gate-2 = 100 installs + verified
publisher, Marketplace route only). Extends to LinkedIn/GitHub copy too, not just the
repo/site. **The GitHub App public flip specifically: D3 (2026-08-14) authorized the
bounded-test PLAN that requires this flip, but the flip itself still requires Yehor's
separate, explicit "go" in chat — treat it as still gated until that word actually
appears, not as cleared by D3 alone.** 4.14 did not perform the flip.

GOAL — genuinely open, driven by what Yehor confirms, not predetermined

4.14 closed two research syntheses (A/B/C/D, fork) AND, later the same session, Yehor
recorded both decision words (D2: Option A; D3: bounded demand test) in his own sentence.
What remains open going into 4.15: (a) his separate "go" to actually flip the GitHub App
public and start the D3 clock, (b) the lawyer-outreach gate waiver (distinct from "go"),
and (c) whether he re-supplies F1–F4. This session's actual shape depends entirely on
which of those he wants to move first — ask, don't assume.

MUST-CLOSE LIST (scope depends on Yehor's answers to the items above)

* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Do NOT flip the GitHub App public, and do NOT publish any copy, without Yehor's
  separate explicit "go" — D3 authorizes the plan, not the act.
* Do not draft or send lawyer outreach without Yehor's own confirming word on the gate
  waiver — the relayed recommendation is not a substitute for it, and it is a different
  gate from "go."
* Do not move any of the 93 DECISION-3 files without his explicit go-ahead.
* If F1–F4 arrive, complete Task D properly: archive, byte-verify, THEN append the
  SESSION-LOG-INDEX.md line (in that order, not before).
* VAT Q2: due 2026-09-01 — now genuinely close (18 days as of 2026-08-14). Confirm the
  window hasn't moved or been missed.
* CRA Row 7: reporting-obligations date now independently confirmed at 2026-09-11 —
  distinct from VAT's 09-01, do not conflate the two clocks.
* If "go" has already been said before 4.15 opens: confirm the App is actually public
  (live check, not assumed), note the exact flip date/time, and start tracking the
  30–90 day window (2026-08-14 → 2026-11-12) and the ≥3–5-installs /
  ≥1-willingness-to-pay-signal threshold against real data, not the plan alone.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` = `5a44fda` (0 ahead / 0 behind) —
  unless Yehor has committed/pushed something since, which would itself be worth noting
  as a deviation from this prompt's expectation.
* `fixprove.dev/app` footer renders a real `·` character, not `&middot;`.
* D2 and D3 recorded (✅, 2026-08-14) — the two REMAINING words ("go" for the App public
  flip, and the lawyer-gate waiver) either given in Yehor's own sentence, or explicitly
  still deferred by him — not silently assumed either way.

KNOWN GOTCHAS TO CARRY FORWARD (unchanged from 4.13/4.14 unless noted)

* "Verified" doesn't carry across turns/sessions — only evidence does. 4.14's clearest
  demonstration: a task prompt confidently cited a baseline SHA (`85d2f2a`) and a file
  count (59) that were both real but stale — the actual close commit was one further
  (`5a44fda`) and the real count was 93. Neither was a fabrication; both were snapshots
  that had already moved on by the time they were quoted. Re-verify inputs, not just trust
  a prior session's stated numbers.
* Large single pastes into this chat can silently truncate (confirmed in 4.14: 4 of 5
  research documents cut off mid-sentence with a bare `pasted` marker). If archiving
  pasted research content, check for a clean ending before writing it to disk — never
  archive a fragment as if it were the whole document.
* This sandbox's `web/node_modules` is a Windows-native pnpm install and cannot run
  `next build`, `pnpm test`, or any native-binary tool on this Linux sandbox. Have Yehor
  run the real build/test/deploy on his own machine.
* `git fetch` (read) works from this sandbox against GitHub; `git push` (write) does not —
  Yehor's machine only.
* `MEMORY/` is entirely `.gitignore`d (`.gitignore:57`) — anything written there is
  structurally invisible to `git status`/`git diff`/staging, not merely left untracked by
  choice. Confirmed via `git check-ignore -v` in 4.14. This is the strongest available
  guarantee against accidental commit of internal research material.
* LinkedIn's About/Experience sections do not reliably render via automated tooling —
  confirmed failing again in spirit in 4.14 (no URL even on record to attempt against).
  Ask Yehor directly for a fresh screenshot if LinkedIn state actually matters this session.
* React does not HTML-entity-decode string literals inside JSX curly braces — use the
  literal character, not an HTML entity name, for any future separator.
* Never wildcard-stage on this repo. Name paths explicitly.
* PowerShell gotchas: pasting this executor's `→ result` report annotations directly into
  a PowerShell prompt fails (`→` is not a redirection operator PowerShell recognizes, and
  trailing "result" text gets parsed as a command). Give Yehor bare, copy-safe commands
  when he needs to independently re-run something — no inline result annotations.
  Separately: `Get-Content`/`Set-Content` on Windows write CRLF by default — check with
  `git diff -w` before treating it as a real change.
* `.git/*.lock` files accumulate on this mount across sessions — harmless in general, but
  `HEAD.lock`/`index.lock` specifically are the two worth renaming away (`mv`, never `rm`)
  if a git operation seems blocked; done again in 4.14, will likely reappear in 4.15.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref: tier figures, trademark-admission
   phrasing, CPR-shaped digits, Stripe object IDs.
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound push
   capability to GitHub. Per CA-5, get his explicit per-instance go-ahead before handing
   over the push command.
3. Per the CA-5 Artifact Existence Verification addendum: any file named in any
   instruction, from any source, is unverified until checked against
   `MEMORY/ARTIFACT-MANIFEST.md` or a fresh on-disk search. This addendum itself caught two
   real errors in 4.14 (the SHA, the file count) — keep applying it from the first
   instruction of 4.15 onward.
4. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main`, unchanged.

CARRY-FORWARD OPEN ITEMS

* PITFALL row 4 — the project's one real blocking gate; unchanged, not recorded in 4.14.
* PITFALL row 7 (CRA) — reporting-obligations date now verified; entry-into-force and
  main-obligations dates, and FixProve's own classification, remain unverified/undetermined.
* DECISION-3 (93-file relocation) — count corrected, still unconfirmed by Yehor.
* Identity build — still 0 of 2 remaining elements implemented; commission-on-request.
* Empty private `yehorcallmedai-maker/fixprove` repo — unchanged, zero urgency.
* `PITFALL-WATCHLIST.md`'s pricing-exposure addendum commit decision — unmade across four
  sessions running now (4.12-M through 4.14).
* `SESSION-LOG-INDEX.md`'s pre-existing unindexed gap (Sessions 4.11 through 4.12-J) —
  unchanged, low-priority.
* F1–F4 fork-decision research archival — pending Yehor's re-paste.
* D2 (Option A) and D3 (bounded demand test) — **CLOSED, decided 2026-08-14**, see
  `MEMORY/critical-actions.md`'s "S4.14 — D2 and D3 recorded" entry.
* "Go" (GitHub App public-visibility flip) and the lawyer-gate waiver — the two words
  still genuinely open, both his alone, no rush, neither blocks the other. Once "go" is
  given, the D3 clock (2026-08-14 → 2026-11-12) starts being live-tracked, not
  background — see item 10 above.

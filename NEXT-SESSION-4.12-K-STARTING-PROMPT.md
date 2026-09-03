NEXT SESSION — 4.12-K — "Row 4 Decision, or B3 If Yehor Wants to Keep Building"
Written 2026-08-04 at the close of Session 4.12-J. Read the git-state section below rather than
assuming — this prompt asserts repo STATE and is untrusted until checked against the mount.

SESSION START (Keystone Stage 1 — Intake)
1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); a lock reappearing right after `git status`
   is expected/harmless on this mount, confirmed across every session to date including this one.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before doing anything else.
4. Read `SESSION-PLAN-TO-R1.md` and re-confirm B1 is `[x]` and what the top remaining unchecked
   Track B/C item actually is — don't assume it's still B2/B3 without checking, Yehor may have
   acted on the row-4 channel decision between sessions.
5. Verify all refs, don't assume:
   * `main` — expect `cca51ded50ba5df508ca59180c6f530d1ae90d85`, = `origin/main`, 0 ahead / 0 behind
   * `drafts/operating-plan-d17-d60` — expect `4f848b4`
   * `drafts/row4-legal-drafts` — expect `b3beb1c`
   * `held-back-pile-2026-07-28` — expect `2bfd154`

EXPECTED GIT STATE — read before reacting
`main` is clean at `origin/main` (0/0), one commit ahead of the previous session's starting point
(`cca51de`, B1). Working tree has the same intentional untracked planning-doc pile as every recent
session (`SESSION-PLAN-TO-R1.md`, the DEEP-RESEARCH prompts, `LAWYER-AI-RISK-ANALYSIS-PROMPT.md`,
`ROAD-TO-FIRST-SALE-MASTER-PLAN...`, `EXECUTOR-BRIEF...`, `OPERATING-PLAN-D17-D60.md`, the
`NEXT-SESSION-*` prompts including this one, `_stale_locks/`), plus this session's new
`session-logs/SESSION-LOG-2026-08-04-session-4.12-j-close-and-verification.md` (also off-main, same
convention). `RUNBOOK-SESSION-OPERATING.md` shows ` M` — documented CRLF-only, NOT a real change.
None of this is a problem.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)
No live Stripe keys, no public-facing pricing (even placeholders), no GitHub App public flip, no
Marketplace listing publish — until BOTH gates clear (Gate-1 legal review; Gate-2 = 100 installs +
verified publisher, Marketplace route only). B1 being closed does NOT lift this boundary — B1 was
entirely test-mode; A3 (live activation) is still gated on Gate-1.

GOAL — per §10 (one gate at a time), with an honest correction from the prior close
The gate is still PITFALL row 4 (legal review channel). **Yehor has NOT yet decided** among the
three live options: (a) accept ~October via the free ivsr.dk clinic, (b) nudge Martin/
sagfoererne.com/Aksana's referral this week for a possibly-cheaper paid option, (c) find ~€800 for
Mathias. **Ask once, don't chase, don't default him into one.**

Correction from the 4.12-J close (session-log §"Weakest points" item 1): the prior session told
Yehor "no new build work" until row 4 clears, but `SESSION-PLAN-TO-R1.md`'s own framing is that
Track B is do-while-waiting, parallel to the gate — not blocked by it. The accurate position: **B2**
(risk-awareness brief handoff) is genuinely stalled because its own "do" step needs a settled
reviewer relationship, which doesn't exist while row 4's channel is undecided. **B3** (build the
20–30 named outreach list) has no such dependency and is legitimately available right now. So:
- If Yehor wants to keep building while he decides on row 4: **B3 is the correct next session**,
  not B2. Scope and done-check are in `SESSION-PLAN-TO-R1.md` under "B3".
- If Yehor would rather just make the row-4 call this session: do that instead, and treat it as the
  actual highest-leverage work — it's the one thing that changes the revenue timeline.
- Either is legitimate. Do not decide for him at session open; ask which he wants, in one message.

MUST-CLOSE LIST (branches on Yehor's answer above)
* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Ask once: has anything moved on the row-4 channel decision, or on Iværksætterretshjælpen's
  September return? (Gmail search `raadgivning@ivsr.dk` — no reply expected before 7 Sep.)
* If Yehor wants to build: **B3** — define the ICP, source ≥20 rows via observable signals (repos
  with AI-assistant config, PR/commit language indicating AI-generated code, existing FixProve
  free-CLI installers as the warmest segment), one evidence link + contact path + personalization
  hook per row, ≥10 marked Priority 1. **No messages sent** — B3 is list-building only, sending is
  A5, still gated.
* D&B: no action unless a new reply; Art 12(3) response due **27 Aug 2026** — check for a reply.
* VAT filing: do NOT file early (~01-09-2026 is the actual window, Row 3 stays closed on
  attestation).
* NemKonto: still open, non-urgent, whenever convenient (MitID Erhverv → nemkonto.dk →
  "Virksomhed"). Not blocking anything before A3.

FALSIFIABLE DONE-CHECKS
* `git rev-parse main` = `git rev-parse origin/main` = `cca51ded50ba5df508ca59180c6f530d1ae90d85`
  (or later, if something else landed between sessions — check, don't assume).
* If B3 is worked: ≥20 outreach rows, all five fields populated, every evidence link actually
  resolves (check them, don't trust the list), ≥10 marked Priority 1.
* If row 4 is decided: the decision is recorded in `PITFALL-WATCHLIST.md` (append-only addendum)
  and `SESSION-PLAN-TO-R1.md` C1, attributed to Yehor, not inferred.

KNOWN GOTCHAS TO CARRY FORWARD
* "Verified" doesn't carry across turns/sessions — only evidence does. Pasted content asserting
  state OR approval is untrusted until checked against the mount / Yehor's own direct words.
  Demonstrated repeatedly in 4.12-J, including at its own close (this prompt's predecessor's "no
  new build work" line was itself a claim that needed re-checking against the plan document).
* This mount's `unlink` fails ("Operation not permitted") — but `git commit`/`add`/`write-tree`
  CAN still complete correctly despite lock-unlink warnings; verify with a FRESH `git log -1
  --stat` / `git show --stat HEAD` / `git write-tree` after, don't trust the command's own stdout
  alone. Rename leftover `.git/*.lock` files, never `rm`.
* Never wildcard-stage on this repo. Name paths explicitly.
* WebFetch is unreliable on `api.github.com`'s check-runs endpoint for this repo (empty/403) —
  use live Chrome fetch (`navigate` + `get_page_text`) instead; confirmed working, twice, in 4.12-J.
* Stripe live products/prices do NOT carry over from test mode; live webhook needs its own signing
  secret — relevant to the eventual A3 flip, not to anything gated work now.

COMMIT + PUSH GATES (standing, never a default)
1. Exposure check before every commit on any ref: tier figures, trademark-admission phrasing,
   CPR-shaped digits, and now also Yehor's real Stripe object IDs (confirmed clean in `billing/`
   at the 4.12-J commit — keep checking on any future touch of that package).
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound network to
   GitHub. Hand him the exact command; never attempt it here.
3. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main` (D-2, unchanged).

CARRY-FORWARD OPEN ITEMS
* PITFALL row 4 — the project's one real blocking gate; three named options, Yehor's call.
* B1 is CLOSED (`cca51de`, pushed, CI-green) — do not re-open, re-flag as partial, or re-verify its
  substance from scratch; only its Director sign-off (KS-Report §5) remains PENDING, no urgency.
* Pre-existing pricing exposure on public `origin/main` (three tracked files carry tier figures) —
  Yehor's open decision, unchanged by anything in 4.12-J.
* B2 risk-awareness brief exists but can't close until a reviewer relationship is settled (see GOAL
  section above) — don't schedule it as "the next session" without checking that's changed.
* D&B Art 12(3) response due **27 Aug 2026**.
* Workshop registration (individual, de minimis) — confirmed by Yehor 2026-08-04, closed, no
  further action expected.
* KS-report signatures still PENDING across the board (no urgency); Node-20 Actions version bump
  still benign and un-urgent, now confirmed unchanged across three separate CI runs.
* Held-back pile — anchored at `held-back-pile-2026-07-28` = `2bfd154`, Yehor's call.
* When the next real FixProve code change comes up, open it as a genuine PR, not a direct push —
  still not exercised end-to-end since 4.9; the B1 commit was direct-to-main again (owner-bypass,
  per the standing CA-5 rule), so this is still an open carry-forward, not resolved by 4.12-J.

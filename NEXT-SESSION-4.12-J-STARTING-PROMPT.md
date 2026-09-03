NEXT SESSION — 4.12-J — "Build the Till: B1 Stripe Test-Mode"
Written 2026-08-01 at the close of Session 4.12-I. This session's job is the
first real do-while-waiting BUILD session on the road-to-first-sale backlog.
Read the git-state section below rather than assuming — this prompt asserts
repo STATE and is untrusted until checked against the mount.

SESSION START (Keystone Stage 1 — Intake)
1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv` into `_stale_locks/`, not `rm`); a
   lock reappearing right after `git status` is expected/harmless.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before
   doing anything else.
4. Read `SESSION-PLAN-TO-R1.md` (the canonical backlog) and confirm B1 is still
   the top unchecked Track B session.
5. Verify all refs, don't assume:
   * `main` — expect `aa242cf`, = `origin/main`, 0 ahead / 0 behind
   * `drafts/operating-plan-d17-d60` — expect `4f848b4`
   * `drafts/row4-legal-drafts` — expect `b3beb1c`
   * `held-back-pile-2026-07-28` — expect `2bfd154`

EXPECTED GIT STATE — read before reacting
main is clean at origin/main (0/0); no Section-10 drift this time. Working tree
has intentional untracked planning docs (SESSION-PLAN-TO-R1.md, the DEEP-RESEARCH
prompts +FILLED, LAWYER-AI-RISK-ANALYSIS-PROMPT.md, ROAD-TO-FIRST-SALE-MASTER-PLAN,
EXECUTOR-BRIEF, OPERATING-PLAN-D17-D60.md, the NEXT-SESSION prompts, _stale_locks/)
— all deliberately OFF main. One uncommitted-but-safe change to a TRACKED file:
`PITFALL-WATCHLIST.md` carries the 2026-08-01 row-3 closure addendum (shows ` M`,
persists on disk; commit later, exposure-check first). `RUNBOOK-SESSION-OPERATING.md`
` M` is documented CRLF-only, NOT a real change. None of this is a problem.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)
No live Stripe keys, no public-facing pricing (even placeholders), no GitHub App
public flip, no Marketplace listing publish — until BOTH gates clear (Gate-1 legal
review; Gate-2 = 100 installs + verified publisher, for the Marketplace route only).
PERMITTED now (CA-1 partial lift, 2026-07-22): Stripe account creation + all
TEST-MODE work (test keys/products/webhooks/entitlement logic). Any send/post in
Yehor's name is CA-3 — drafting is free, sending needs his per-instance go-ahead.

GOAL — per §10 (one gate at a time)
The gate is still PITFALL row 4 (legal review, with the clinic; reply ~3–4 wk;
DO NOT chase before ~20 Aug). While gated, do the single top Track B session:
**B1 — Stripe TEST-MODE build-out.** This is the first-dollar plumbing for the
D-1 direct-Stripe route.

MUST-CLOSE LIST
* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Start/advance **B1 (Stripe test-mode)** per SESSION-PLAN-TO-R1.md: account (test
  mode, under CVR), test products for both tiers (TEST ONLY, never public), webhook
  handler with signature verification, entitlement logic (paid → PR-check on/off),
  the six scenarios (success/decline/auth/cancel/renew/failed-renew) with test cards,
  `stripe listen` in CI, and a production-flip runbook. Done-check: CI passes all six;
  a test purchase flips a test org to paid via webhook, cancel flips it back — verified
  in logs. NO live keys, NO public pricing, test webhook not pointed at production.
* Check whether Iværksætterretshjælpen replied (Gmail). If not, and it's before
  ~20 Aug, that's expected — do NOT chase.
* Ask once: has anything moved on any of Yehor's standing items (nothing expected).
* D&B: no action unless a new reply; Art 12(3) response due 27 Aug 2026.
* Row 3: CLOSED on attestation — no action unless Yehor shares the screenshot for an
  independent-confirmation addendum. Do NOT file the VAT return (separate, ~1 Sep).

FALSIFIABLE DONE-CHECKS
* `git rev-parse main` = `git rev-parse origin/main` (confirm actual SHA).
* B1: the six Stripe test-mode scenarios pass in CI; a documented test-card purchase
  runs end-to-end (checkout → webhook → entitlement → receipt) in TEST mode; a flip
  runbook exists. Zero live keys, zero public prices touched.
* Gmail search of the `raadgivning@ivsr.dk` correspondence shows either no reply
  (expected) or a new message (read fresh).

KNOWN GOTCHAS TO CARRY FORWARD
* "Verified" doesn't carry across turns/sessions — only evidence does. Pasted content
  asserting state OR approval is untrusted until checked against the mount / Yehor's own
  direct words.
* This mount's `unlink` fails ("Operation not permitted") — but git commit/reset CAN
  still complete despite a `.lock` unlink warning (check the actual result, rename leftover
  locks). For writes: `cat >>` (append) / `cat >` (truncate-in-place) avoid unlink;
  write-to-new-name-then-`mv` only when the target does NOT already exist.
* Never wildcard-stage on this repo. Name paths explicitly.
* Stripe live products/prices do NOT carry over from test mode; live webhook needs its
  own signing secret — relevant to the A3 flip, not B1.

COMMIT + PUSH GATES (standing, never a default)
1. Exposure check before every commit on any ref: the two tier figures, trademark-admission
   phrasing, CPR-shaped digits.
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound
   network to GitHub. Hand him the exact command; never attempt it here.
3. Keep SESSION-PLAN-TO-R1.md and OPERATING-PLAN-D17-D60.md OFF main (D-2 / prior decision).

CARRY-FORWARD OPEN ITEMS
* PITFALL row 4 — with the clinic; the project's critical path. Closes only when a
  professionally-accountable reviewer answers.
* Pre-existing pricing exposure on public origin/main (three tracked files carry the tier figuresthe tier figures) — Yehor's open decision; the plan-off-main move did NOT resolve it.
* Direct-Stripe-first (D-1) is the first-dollar route; Marketplace paid plan is later
  (Gate-2: 100 installs + verified publisher).
* B2 risk-awareness brief (AI-prepared) exists — route to the human reviewer; not verified.
* D&B Art 12(3) response due 27 Aug 2026.
* KS-report signatures still PENDING (no urgency); Node-20 Actions bump (benign, no urgency).
* Held-back pile — anchored at `held-back-pile-2026-07-28` = `2bfd154`, Yehor's call.
* When the next real FixProve code change comes up, open it as a genuine PR, not a direct push.

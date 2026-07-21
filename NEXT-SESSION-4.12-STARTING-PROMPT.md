# NEXT SESSION 4.12 — STARTING PROMPT
(Paste everything below the line into a fresh Cowork thread, verbatim.)

---

SESSION 4.12 — LAUNCH-READINESS, NON-FINANCIAL SCOPE ONLY.
Contract-first per Keystone.

HARD BOUNDARY, read this before anything else: this session does NOT touch
Stripe (in any form — no config, no code, no checklist steps), does NOT
publish or draft pricing anywhere public-facing, and does NOT change the
GitHub App "fixprove"'s installation-visibility setting. All three are
formally **BLOCKED PENDING LEGAL COUNSEL** per `MEMORY/critical-actions.md`
(entry dated 2026-07-17) — Yehor is consulting a lawyer on business
structure, VAT/MOMS, Terms of Service/Privacy Policy, GDPR, liability terms,
third-party App-installation registration, and trademark before any of
those three actions proceed further. Do not propose, draft configuration
for, or take any preparatory step toward any of the three — even something
that feels harmless, like drafting placeholder pricing copy "to have ready."
If any finding this session suggests one of the three needs addressing
sooner than the lawyer's pace allows, STOP, flag it prominently, do not
act, and escalate to Yehor for a fresh decision.

Stage 1 — INTAKE.
FIRST tool calls, in order: (a) check `.git/*.lock` — rename away (mv, not
rm; this mount's `unlink` returns "Operation not permitted," so `git status`
itself will leave a fresh `index.lock` behind every time it runs — this is
expected and documented, not a crashed process, see
`SESSION-LOG-2026-07-17-session-4.11-audit-and-legal-pause.md` §2), (b)
`git log -1 --oneline`, confirm HEAD is `c36d2e5` or report the drift, (c)
read `MEMORY/state.md` in full and answer its own 3 reload questions before
doing anything else.

Directorial input (given, do not re-derive): repo is public, `npm
--provenance` is live, engine verified 217/217 (KS-4.5/4.6). GitHub App is
confirmed ORG-ONLY (KS-REPORT-4.11-addendum-legal-pause.md) — this is now a
legal-blocked item, not a technical one; do not touch it. Stripe is
confirmed to have no account yet (founder's own first-hand report,
2026-07-17) — also legal-blocked. Two items from KS-REPORT-4.11 remain
genuinely open and are NOT legal-blocked, safe to close this session if
Yehor has an answer: item H (GitHub Marketplace status,
`github.com/marketplace/manage`) and item J (legacy NPM_TOKEN revocation,
npmjs.com token page) — ask Yehor directly at Stage 1 if he has these; if
not, carry them forward again rather than guessing.

Goal: close every item on `KS-REPORT-4.11-milestone3-audit-and-closeout.md`'s
gap-ordered close-out plan that has NO dependency on Stripe, pricing, or App
visibility.

Standing constraints (unchanged from 4.10/4.11):
 - All file writes: write-to-new-name-then-mv, re-verify with a fresh read
   of the PROJECT-FOLDER path (not a sandbox path).
 - Append-only convention on session-logs/ and KS-REPORT-*.md: new
   addenda, never edits to a signed or pending-signature report.

Stage 2 — scope (from KS-4.11's close-out plan, non-financial items only):

 A. False-positive allowlist escape hatch — ship and document it (master
    plan's own mitigation for the riskiest technical promise; this was
    already identified as needed before launch regardless of the payment
    path).
 B. <5-minute quickstart — write/verify one exists for the free, open-core
    CLI path (`pip install fixprove` / `npm install -g fixprove`, no
    GitHub App, no payment involved at all). If possible, identify a
    non-Yehor human to test it; if none is available this session, flag as
    YEHOR-MUST-CHECK rather than skip it.
 C. README/LICENSE/SECURITY.md/About — confirm presentable to a cold
    stranger arriving at the now-public repo. KS-REPORT-4.11 found the root
    README still reads "Session 0.2 scaffold" (last touched in the repo's
    first commit) despite Milestones 1-4 having shipped, and the GitHub
    "About" sidebar has no description/website/topics set. Fix both — pure
    documentation, zero code, zero CA-class action (does not touch
    pricing, does not touch the App, does not imply the App is
    installable by third parties — say "open-core CLI, GitHub App in
    progress" rather than anything that overclaims installability).
 D. Session 3.3 collision re-check — re-run the npm/PyPI/GitHub-org/domain
    check (RepoMend guard) one more time; report any drift since it was
    last run.
 E. fixprove.dev — improve beyond the Milestone-0 waitlist page IF this
    can be done without stating a live price or an install CTA that
    assumes the App is public. Focus on value-prop clarity and an honest
    "coming soon" signup, not a storefront. Do not add a pricing section
    even as a placeholder or "coming soon" price — that would be drafting
    toward the blocked item, not around it.

Stage 3 — VERIFY. Standard adversarial pass per item; cite evidence
(file+line or URL fetched, per the discipline already established in
KS-REPORT-4.11). Two-pass hard check on anything load-bearing, per this
project's `session-close` skill discipline used to close Session 4.11.

Stage 4 — ATTEST. KS-REPORT-4.12 draft, §7 (or whatever section number
this project's template uses next — check KS-REPORT-4.11's numbering)
pending Yehor. Update `PROGRESS.md` and `MEMORY/state.md`. Explicitly
restate in the report that Stripe/pricing/App-visibility remain BLOCKED
PENDING LEGAL COUNSEL and are NOT part of this session's scope — do not
silently imply readiness on those three by omission.

If, during this session, any finding suggests one of the three blocked
items actually needs addressing sooner — STOP, flag it prominently, do not
act, and escalate to Yehor for a fresh decision rather than assuming the
block lifted.

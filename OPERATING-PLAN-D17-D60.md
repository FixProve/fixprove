# FIXPROVE OPERATING PLAN — Day 17 → Day 60
Version 1.0.0 | Date: 2026-07-16 | Status: ACTIVE on Yehor sign-off
Supersedes: ad-hoc session routing after Session 4.10 close.
Author: Node 1 (Claude, planner/verifier role) | Approver: Yehor Kaliberda

Decisions recorded this date (directorial, CA-class):
- D-2026-07-16-A: Claude holds the Node 1 planner/verifier role. Fable is used
  only for open-ended EXTERNAL research (market/competitor/pricing/collision
  landscape), never internal state; each use gets an explicit contract paste-block.
- D-2026-07-16-B: Keystone Ledger v2 is NOT adopted wholesale. The existing
  Keystone constitution is PATCHED with three elements (see Section 7).
- D-2026-07-16-C: Plan horizon = Day 17 (today) → Day 60 ("first real dollar" gate).

---

## 1. Verified product state (evidence-cited, checked today)

LIVE, verified against on-disk signed reports and this week's live checks:
- Resolver engine (Python + TS), 217/217 tests, 0 false positives on labelled
  corpus (KS-REPORT-4.5/4.6).
- CI gated: `build` + `test-python` required and green per-job (KS-REPORT-4.10,
  signed 16.07.26, 4853 bytes, verified on the project-folder path).
- Both Cloudflare workers live on wrangler v4: api.fixprove.dev, fixprove.dev
  (KS-REPORT-4.9 addendum 2).
- npm `fixprove` v0.1.9 and PyPI published; npm via OIDC Trusted Publishing,
  legacy token env removed from release.yml (KS-REPORT-4.8, PR #6 merged 408e7a6).
- **CORRECTION vs. prior planning context:** the D2 public-repo flip and
  `npm --provenance` restoration are ALREADY DONE — Session 4.7 (KS-REPORT-4.7:
  repo public as FixProve/fixprove, v0.1.8 published with provenance badge,
  Sigstore logIndex cited). The previously drafted "Session 4.12 = D2 flip"
  was stale and is removed from this plan.
- Git HEAD c36d2e5, no .git locks, working tree consistent with 4.10 close.

NOT live (directorial input + repo evidence, final confirmation = Session 4.11):
- Stripe live-mode; visible pricing anywhere a customer can see it;
  GitHub Marketplace listing; any distribution/outreach; MRR = $0, zero
  external users. Open verify-item: legacy NPM_TOKEN revoked on npmjs.com
  (KS-REPORT-4.8 flags this as not durably tracked).

Honest one-liner: a working, tested, deployed, publicly-visible engine with no
storefront and no foot traffic. Every next session builds storefront or traffic.

## 2. Success definitions per rung (recalibrated, Day 1 = 2026-06-30)

| Rung | Target | Success = (falsifiable) |
|---|---|---|
| Machine sellable | Day ~25 (Jul 25) | Test card: payment→install→blocking check→SARIF, <3 min, e2e |
| First external signal | Day ~30–35 | One un-recruited stranger stars/installs/joins waitlist |
| First real dollar | Day ≤60 (Aug 29) | 1 org paying $29/mo, money cleared (plan's own threshold: 1, not 20) |
| Traction | Day ~120 | Honest band: $200–500 MRR = good; $1,000 = stretch, not pass/fail |
| Long term 12–18 mo | — | Moat holds (multi-language resolver depth), open-core→paid conversion, <20 hrs/wk sustainable |

Primary failure mode (own risk register #1): months of feature-building with
zero distribution → solo-bandwidth/motivation collapse.

## 3. Scenarios that raise the success rate (leverage order)

1. Launch narrow — Python-first if TS edge cases threaten the 0-FP promise.
2. Lead with open-core — repo is already public; make the README the funnel.
3. Direct founder outreach at Day ~30 — 20–30 hand-picked teams shipping
   AI-generated code; offer to run FixProve on one of their PRs personally.
4. Ship the false-positive allowlist escape hatch BEFORE launch (plan's own
   mitigation for the riskiest promise).
5. Build in public — Keystone reports are the content; LAUNCH-COPY exists.

## 4. Market entry timing

The wave is present-tense (84% AI adoption vs ~29% trust; AI ≈42% of committed
code; Socket/Snyk/CodeRabbit circling). Entry is defined by READINESS, not a
date: launch the day payment-e2e passes AND the collision re-check clears —
target Day ~28–30. One language, one price, one public repo. Milestone 4
features are built while the market responds, not before.

## 5. Pre-distribution gate — all 8 must read YES before Session 5.1

1. Stripe live-mode active with real $29/$99 product/price objects.
2. Pricing visible where a stranger lands (fixprove.dev).
3. Public repo presentable: README funnel, LICENSE, SECURITY.md (verify — repo
   is already public since 4.7, so presentability is now URGENT, not optional).
4. Stranger goes landing→working check in <5 min, verified by a non-Yehor human.
5. False-positive allowlist shipped and documented.
6. Session 3.3 collision re-check clean (npm/PyPI/trademark — RepoMend guard).
7. Support channel + minimal ToS/privacy page (charging money requires both).
8. Marketplace decision recorded: direct Stripe at launch; Marketplace ~Day 45.

## 6. Session plan — scenario + hard must-close set per session

Rule: a session that does not close its full must-close set does not advance
the ladder. Counts are minimums, not aspirations.

**Session 4.11 — Milestone 3 audit & tracking setup. Target: this week. Must close 5:**
(1) audit matrix LIVE/PARTIAL/MISSING/YEHOR-MUST-CHECK with evidence;
(2) Yehor's 15-minute authenticated checklist (Stripe, Marketplace, npm token
revocation status); (3) gap-ordered close-out plan for "machine sellable";
(4) Keystone patch instantiated: MEMORY/state.md + critical-actions register +
append-only convention (Section 7); (5) PROGRESS.md created and seeded.
Starting prompt: Section 8. Read-only against the repo.

**Session 4.12 — Payment path live. Target: ~Day 22–25. Must close 3:**
(1) Stripe live-mode, $29/$99 products; (2) pricing on fixprove.dev;
(3) full test-card e2e payment→install→blocking check→SARIF <3 min.
Closes "machine sellable". Scope may be split per 4.11's close-out plan.

**Session 4.13 — Launch prep. Target: ~Day 27–28. Must close 4:**
(1) collision re-check clean; (2) <5-min quickstart verified by a non-Yehor
human; (3) allowlist escape hatch shipped + documented; (4) launch post final
from LAUNCH-COPY + 60-second demo GIF.

**Session 5.1 — LAUNCH. Target: Day ~30. Must close 2:**
(1) post public (Show HN + one community + X); (2) outreach list of 20–30
built, first 10 messages sent. Success = shipped, explicitly NOT vote count.

**Session 5.2+ — weekly feedback loop until first dollar. Recurring must-close 3/wk:**
(1) 10 outreaches; (2) all user feedback answered <24h; (3) one falsifiable
improvement shipped from real feedback. Milestone 4 contract is written only
after first-dollar, with customer evidence.

**Mandatory reevaluation points for THIS plan:**
- R1 after 4.11: audit matrix may re-order 4.12/4.13 scope (e.g. Stripe
  already live would collapse 4.12).
- R2 launch +7 days: outreach conversion data decides double-down channel
  vs. pivot messaging vs. Python-only narrowing.
- R3 Day 60 gate: first dollar YES → open Milestone 4 contract; NO → root-cause
  session (funnel data, not feature list) before any new build work.

## 7. Governance: Keystone constitution PATCH (adopted per D-2026-07-16-B)

Ledger v2 (Operational Core 2.0.0, 2026-07-09, read and verified today) is NOT
adopted: its four-role separation, EVOLVE machinery (N=5, rollback text), and
~15x escalation protocol are built for multi-agent higher-stakes operations and
would roughly double per-session overhead against risk register #1
(solo-bandwidth collapse). Three elements ARE ported as working practice:
1. **MEMORY/state.md** with the 3 reload questions (last completed + verdict /
   current open step + definition of done / founder decisions to preserve) —
   fixes the stale-state drift that hit sessions 4.9 and 4.10.
2. **Critical-actions register** (money moves, public flips, publishing in
   Yehor's name, file deletions, instruction changes → recorded Yehor approval
   BEFORE action) — formalizes existing de facto practice.
3. **Append-only audit convention** on session-logs and KS reports — never
   rewrite an entry; convention, platform does not enforce it.
Everything else in the existing constitution stands unchanged.

## 8. Session 4.11 starting prompt (paste verbatim into a fresh thread)

See NEXT-SESSION-4.11-STARTING-PROMPT.md (delivered alongside this plan).

## 9. Tracking & motivation layer

PROGRESS.md (project root, updated at every session close): ladder rungs with
dates; current session's must-close checkboxes; MRR (currently $0 — on-schedule
at Day 17, 43 days of runway to the Day-60 rung); a single "external signals"
counter (stars + installs + signups + replies) so the first stranger registers
as visible progress long before the first dollar.

---
Sign-off: Yehor Kaliberda — Date: 16.07.26
(Plan becomes ACTIVE on signature; unsigned = draft.)

## 10. Addendum — Session Priority Rule (added 2026-07-29, Session 4.12-H)

**Session Priority Rule.** At every session start, identify the single gate
currently blocking progression up the Section 2 ladder. Work that gate, and
only that gate, until it closes. Never build features, polish, or outreach
assets for a rung not yet reachable.

Current gate (as of 2026-07-29): PITFALL row 4 legal review — the sole
blocker between "Machine sellable" (drafted, unpaid-for) and re-opening the
path to "First real dollar." Everything else in a given session (e.g. the
CVR reklamebeskyttelse flag, the row-3 VAT screenshot, the pypsa-earth CI
annotations) is opportunistic, capped at low time cost (a few minutes each
per item), and never takes priority over the current gate.

Approved by Yehor Kaliberda, 2026-07-29 (Session 4.12-H), via an explicit
selection in response to a direct question addressed to him — not inherited
from any pasted or unverified content that claimed to speak for him.

(Note: this was proposed in conversation as "Section 8"; renumbered to
Section 10 on append, since Sections 8 and 9 already exist in this plan.
Numbering error caught before writing to disk, not after.)

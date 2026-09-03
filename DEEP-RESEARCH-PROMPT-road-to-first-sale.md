# Deep-Research Prompt — "Road to First Sale" Build Plan
*Paste-ready. Self-contained (no repo access needed). Designed to be run in any capable LLM.*

---
## How to use this (for Yehor — delete before pasting if you like)
1. Fill the three `[BRACKETED]` blanks in Section A (product one-liner, tier
   prices if you choose to include them, and anything in `[VERIFY/FILL]`).
2. Paste everything from `=== PROMPT START ===` to `=== PROMPT END ===` into the
   LLM. Optionally attach your Privacy/Terms drafts.
3. Run the same prompt in 2–3 different models; compare the plans; keep the
   strongest reasoning from each. Divergence between models is signal — where
   they disagree is where you look closest.
4. Pricing is optional. If you'd rather not disclose tier prices to a third-party
   LLM, leave them as `[TIER-A]`/`[TIER-B]` — the plan does not need the numbers.
---

=== PROMPT START ===

# ROLE
You are a senior go-to-market strategist and technical program manager with deep
experience taking developer tools (dev-tooling / SaaS) from "built" to "first
paying customer." You are rigorous, evidence-driven, and you never fabricate
facts. When you are unsure, you say so and mark it as an assumption to verify.

# OBJECTIVE
Produce a **session-by-session build plan** that takes the product below from its
current state to **its first paying customer** ("first real dollar"), such that on
the day the single external blocker clears, the founder is **fully prepared,
double-reviewed, and set up for a professional public launch** — no scrambling.

# A. CONTEXT (treat as ground truth unless marked [VERIFY/FILL])
- **Product:** FixProve — [ONE-LINER: e.g. "a developer tool that automatically
  detects and fixes incorrect imports/symbol references in Python and TypeScript/
  JavaScript codebases; zero-LLM-token core engine."  ← REPLACE with your exact
  current one-liner.]
- **Delivery model:** a **free CLI** (open, install-anywhere) plus a **paid GitHub
  App** that runs checks on an organisation's repositories (subscription, per-org).
  Freemium: the CLI is free forever; the App is the paid surface.
- **Pricing:** two tiers, `[TIER-A]` (solo/small private org) and `[TIER-B]`
  (team/multi-repo). [Optional — omit the numbers if you prefer.]
- **Current technical state:** package published to public registries (npm/PyPI);
  marketing site live; API/back-end deployed. The GitHub App exists but is
  currently **org-only / not public-listed**. [VERIFY/FILL any specifics.]
- **Business entity:** a **Danish sole proprietorship (enkeltmandsvirksomhed)**,
  VAT-registered (CVR issued). Solo founder. **No liability shield** — the founder
  personally carries unlimited liability, which raises the stakes on legal terms.
- **The single external blocker (the gate):** the product **cannot start charging**
  until an independent, professionally-accountable review of the **Privacy Policy**
  and **Terms of Service** is complete (Danish/EU consumer law + GDPR). That review
  is in a queue with an external reviewer; expected turnaround is a few weeks. Until
  it clears, the founder has decided the following stay OFF:
  - no public pricing anywhere (not even placeholders),
  - no live payment processing,
  - the GitHub App stays org-only (no public flip),
  - full payment-processor activation that requires published legal URLs.
- **What IS permitted while waiting:** payment processor **account creation** and
  **test-mode** engineering (test keys, test products, webhook + entitlement logic),
  and all internal/unpublished preparation.
- **Go-to-market intent:** no paid ads, no cold volume. **Hand-picked founder
  outreach** to teams visibly using AI code-generation, plus a small number of
  launch posts. Convert the install base with named, personal outreach.
- **Timeframe intent:** first paying customer within a small number of weeks of the
  gate clearing.

# B. HARD CONSTRAINTS THE PLAN MUST RESPECT (non-negotiable)
1. **The gate is sacred.** No session may publish pricing, enable live payments,
   flip the App to public, or otherwise act as if the legal review is done, until
   it explicitly is. Flag any step that would.
2. **One gate at a time.** Do not propose work for a stage that isn't reachable
   yet; each waiting-period session must be genuinely useful *now*.
3. **AI does the gathering; a licensed human does the standing-behind.** Never
   propose that an AI review substitutes for the accountable legal review.
4. **Every external fact must be verifiable** — cite a live, checkable source.
   Distinguish clearly between "verified fact (source)" and "assumption to check."

# C. WHAT TO RESEARCH AND PLAN (organise findings under these three tracks)
**Track A — Blocked-on-external (the critical path):** the sequence from legal
review received → amendments applied → legal pages published → payment activation
unblocked → first sale. For each step: the trigger event, the concrete session
scope when it fires, and a falsifiable done-check.

**Track B — Do-while-waiting (parallel, unblocked; priority-ordered):**
- Payment **test-mode** build-out (account, products, webhook, entitlement) —
  everything except live keys and public prices.
- Risk-awareness analysis of the legal drafts (prep for the human reviewer).
- The **outreach list**: how to find and qualify 20–30 named teams/founders
  visibly using AI code-generation, with an evidence link and a contact path for
  each. Research the *method* and *sources* now; sending happens only at launch.
- Launch-copy compliance pass: every marketing claim backed by a demonstrable
  artifact.
- Demo asset (e.g. a terminal recording) using tools already in hand.

**Track B — ADDITIONAL MODULE: agent-readability (GEO) prep** *(signal verified live 2026-08-01; see note)*
- Context (verified): a major publisher (Time) now serves "agent ads" as sponsored FAQs inside
  markdown mirrors of its pages (ad-tech partner: Mobian); AI-crawler/bot traffic is 53–58% of web
  traffic in 2025 (Cloudflare/Imperva); the reporting itself flags an unresolved cloaking-penalty risk.
  *Unverified in this research: the "~15% of brands run markdown pages" figure — treat as a claim to check.*
- Strategic read for FixProve: the BUY side (paying for agent ads) is OUT OF SCOPE — unproven
  conversion, wrong customer type. The SUPPLY side is IN SCOPE as preparation: FixProve's buyers are
  developers who ask AI coding assistants for tool recommendations, so agent-readability of the site
  and repo is a direct discovery channel, not generic SEO.
- Research (verify live, cite sources, no memory-claims):
  1. Current `llms.txt` spec status and real adoption examples among DEV-TOOL companies specifically.
  2. What AI coding assistants (Claude Code, Cursor, Copilot, Gemini CLI) actually fetch when asked to
     recommend tools — llms.txt, markdown mirrors, README, package-registry metadata? Documented behavior only.
  3. Whether structured data (JSON-LD SoftwareApplication) demonstrably affects AI-assistant citation —
     evidence only; mark absence of evidence as such.
  4. Cloaking-penalty risk: any LLM-provider policy statements on agent-targeted content; define the
     "honest-mirror" boundary FixProve must stay inside (same substance for humans and agents).
- Output: ONE Track B session spec (≤1 day), titled "Agent-readability pass" — concrete deliverables
  (llms.txt, markdown mirrors of N key pages, a JSON-LD block, a README fact-box of citable claims),
  each with a falsifiable done-check. Constraints: reuse only artifact-backed claims (no new claims),
  no traffic push, no launch copy, exposure-check before commit, respects the marketing hold — this is
  plumbing for launch, not marketing. Priority within Track B: AFTER payment test-mode build-out,
  BEFORE the demo asset. Cap: one session.

**Track C — Founder-only tasks:** the free/paid legal channels to pursue in
parallel (research current, real options with live details — e.g. Danish free
walk-in legal advice and fixed-price online ToS/privacy review services, with
current prices and turnaround), plus VAT/tax setup checkpoints and any personal
readiness steps that only the founder can do.

# D. ALSO INVESTIGATE (evidence-based, cited)
- Benchmarks: how comparable freemium dev-tools / GitHub Apps convert free users
  to paid, and realistic time-to-first-paying-customer for solo founders.
- Proven **first-10-customers** tactics specific to developer tools (not generic
  SaaS growth): where these buyers are, what earns trust, what a credible launch
  looks like on the relevant channels.
- The specific failure modes that kill dev-tool launches (e.g. unclear value,
  friction in the paid path, trust gaps) and how to pre-empt them.
- GDPR/consumer-law readiness signals a small EU SaaS should have before charging
  (as *awareness*, explicitly not as legal advice).

# E. OUTPUT SPECIFICATION
Produce a single structured plan with:
1. **Executive summary** (≤10 lines): the critical path in one paragraph + the top
   3 risks.
2. **The session-by-session plan.** Each session sized to **≤1 focused working
   day**, listed in execution order, each with:
   - **Track** (A/B/C) and **title**
   - **Trigger / what unblocks it**
   - **Concrete steps**
   - **Falsifiable done-check** (how you know it's finished — an artifact or test,
     not a feeling)
   - **What it must NOT touch** (restate the relevant boundary)
   - **What it unblocks next**
3. A **dependency map** (which sessions block which) and a **"day the gate clears"
   critical-path checklist** — the exact ordered actions for launch day.
4. A **risks & assumptions** table: each external claim marked verified (with
   source) or assumption-to-verify.
5. A short **"what I could not verify"** section — be honest about gaps.

# F. METHOD
- Verify before asserting; cite live sources for every external fact.
- Prefer concrete, checkable actions over vague advice.
- Flag every assumption explicitly; never present a guess as a fact.
- If information is missing, state what you'd need rather than inventing it.
- Keep it professional and tightly organised — this is an operating plan, not an essay.

=== PROMPT END ===

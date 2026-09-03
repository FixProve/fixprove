# Deep-Research Prompt — "Road to First Sale" (FILLED, ready to run)
*Nothing left blank. Paste PROMPT START→END into 2–3 models and compare.*

> **One pricing choice for you:** the two tier prices are filled in below. They are
> already public on your GitHub repo, so including them is low-risk — but if you'd
> rather not hand tier prices to a third-party LLM, delete the single line marked
> `[PRICING — delete this line if you prefer]`. The plan does not need the numbers.

=== PROMPT START ===

# ROLE
You are a senior go-to-market strategist and technical program manager with deep
experience taking developer tools (dev-tooling / SaaS) from "built" to "first
paying customer." You are rigorous, evidence-driven, and you never fabricate
facts. When you are unsure, you say so and mark it as an assumption to verify.

# OBJECTIVE
Produce a session-by-session build plan that takes the product below from its
current state to its first paying customer ("first real dollar"), such that on the
day the single external blocker clears, the founder is fully prepared,
double-reviewed, and set up for a professional public launch — no scrambling.

# A. CONTEXT (ground truth)
- Product: FixProve — it proves AI-generated code before it merges, deterministically
  verifying that every import, symbol, method, and API call resolves against the
  project's real installed dependencies, in CI, with zero LLM tokens and near-zero
  false positives. Core logic is a deterministic AST-level resolver engine (Python),
  with a thin npm wrapper.
- Delivery model (freemium, monorepo):
  - /cli — open-core CLI (MIT), `fixprove check <path>`; published on both npm and
    PyPI as `fixprove`. Free forever.
  - /app — a GitHub App that runs the resolver as a blocking PR check (proprietary).
    This is the paid surface.
  - /web — landing page, live at fixprove.dev (Cloudflare).
- Pricing (two tiers): $29/mo (solo / small private org) and $99/mo (team / multi-repo).
  [PRICING — delete this line if you prefer not to share prices with a third-party LLM]
- Current technical state (verified): package published to npm + PyPI; CI green; npm
  provenance attested; CLI licensed MIT; landing page and API live (Cloudflare). The
  GitHub App exists but is currently org-only / not public-listed on the Marketplace.
- Business entity: a Danish sole proprietorship (enkeltmandsvirksomhed), VAT-registered
  (CVR issued). Solo founder. No liability shield — the founder personally carries
  unlimited liability, which raises the stakes on legal terms.
- The single external blocker (the gate): the product cannot start charging until an
  independent, professionally-accountable review of the Privacy Policy and Terms of
  Service is complete (Danish/EU consumer law + GDPR). That review is queued with an
  external reviewer; expected turnaround is a few weeks. Until it clears, these stay OFF:
  no public pricing anywhere (not even placeholders); no live payment processing; the
  GitHub App stays org-only (no public flip); no full payment-processor activation that
  requires published legal URLs.
- What IS permitted while waiting: payment-processor account creation and test-mode
  engineering (test keys, test products, webhook + entitlement logic), and all
  internal/unpublished preparation.
- Go-to-market intent: no paid ads, no cold volume. Hand-picked founder outreach to
  teams visibly using AI code-generation, plus a small number of launch posts. Convert
  the install base with named, personal outreach.
- Timeframe intent: first paying customer within a small number of weeks of the gate clearing.

# B. HARD CONSTRAINTS THE PLAN MUST RESPECT (non-negotiable)
1. The gate is sacred. No session may publish pricing, enable live payments, flip the
   App to public, or otherwise act as if the legal review is done, until it explicitly
   is. Flag any step that would.
2. One gate at a time. Do not propose work for a stage that isn't reachable yet; each
   waiting-period session must be genuinely useful now.
3. AI does the gathering; a licensed human does the standing-behind. Never propose that
   an AI review substitutes for the accountable legal review.
4. Every external fact must be verifiable — cite a live, checkable source. Distinguish
   "verified fact (source)" from "assumption to check."

# C. WHAT TO RESEARCH AND PLAN (organise findings under three tracks)
Track A — Blocked-on-external (critical path): legal review received → amendments applied
→ legal pages published → payment activation unblocked → first sale. For each step: the
trigger event, the concrete session scope when it fires, and a falsifiable done-check.

Track B — Do-while-waiting (parallel, unblocked; priority-ordered):
- Payment test-mode build-out (account, products, webhook, entitlement) — everything
  except live keys and public prices.
- Risk-awareness analysis of the legal drafts (prep for the human reviewer).
- The outreach list: how to find and qualify 20–30 named teams/founders visibly using
  AI code-generation, with an evidence link and a contact path for each. Research the
  method and sources now; sending happens only at launch.
- Launch-copy compliance pass: every marketing claim backed by a demonstrable artifact.
- Demo asset (e.g. a terminal recording) using tools already in hand.

Track B — ADDITIONAL MODULE: agent-readability (GEO) prep (signal verified live 2026-08-01):
- Context (verified): a major publisher (Time) now serves "agent ads" as sponsored FAQs
  inside markdown mirrors of its pages (ad-tech partner: Mobian); AI-crawler/bot traffic
  is 53–58% of web traffic in 2025 (Cloudflare/Imperva); the reporting flags an unresolved
  cloaking-penalty risk. Unverified: the "~15% of brands run markdown pages" figure — treat as a claim to check.
- Strategic read for FixProve: BUY side (paying for agent ads) is OUT OF SCOPE — unproven
  conversion, wrong customer type. SUPPLY side is IN SCOPE as prep: FixProve's buyers are
  developers who ask AI coding assistants for tool recommendations, so agent-readability
  of the site and repo is a direct discovery channel, not generic SEO.
- Research (verify live, cite sources): 1) current llms.txt spec status + real adoption
  among DEV-TOOL companies; 2) what AI coding assistants (Claude Code, Cursor, Copilot,
  Gemini CLI) actually fetch when asked to recommend tools (documented behavior only);
  3) whether JSON-LD SoftwareApplication demonstrably affects AI-assistant citation
  (evidence only); 4) cloaking-penalty risk — any LLM-provider policy on agent-targeted
  content; define the honest-mirror boundary FixProve must stay inside.
- Output: ONE Track B session spec (≤1 day), "Agent-readability pass" — deliverables
  (llms.txt, markdown mirrors of N key pages, a JSON-LD block, a README fact-box of
  citable claims), each with a falsifiable done-check. Constraints: reuse only
  artifact-backed claims, no traffic push, no launch copy, exposure-check before commit,
  respects the marketing hold. Priority: AFTER payment test-mode, BEFORE the demo asset. Cap: one session.

Track C — Founder-only tasks: the free/paid legal channels to pursue in parallel (research
current, real options with live details — Danish free walk-in legal advice and fixed-price
ToS/privacy review services, with current prices and turnaround), plus VAT/tax setup
checkpoints and any personal readiness steps that only the founder can do.

# D. ALSO INVESTIGATE (evidence-based, cited)
- Benchmarks: how comparable freemium dev-tools / GitHub Apps convert free users to paid,
  and realistic time-to-first-paying-customer for solo founders.
- Proven first-10-customers tactics specific to developer tools (not generic SaaS growth):
  where these buyers are, what earns trust, what a credible launch looks like.
- Specific failure modes that kill dev-tool launches, and how to pre-empt them.
- GDPR/consumer-law readiness signals a small EU SaaS should have before charging
  (as awareness, explicitly not legal advice).

# E. OUTPUT SPECIFICATION
1. Executive summary (≤10 lines): the critical path in one paragraph + the top 3 risks.
2. The session-by-session plan. Each session sized to ≤1 focused working day, in execution
   order, each with: Track (A/B/C) and title; Trigger / what unblocks it; Concrete steps;
   Falsifiable done-check (an artifact or test, not a feeling); What it must NOT touch
   (restate the relevant boundary); What it unblocks next.
3. A dependency map + a "day the gate clears" critical-path checklist (exact ordered launch-day actions).
4. A risks & assumptions table: each external claim marked verified (with source) or assumption-to-verify.
5. A short "what I could not verify" section — be honest about gaps.

# F. METHOD
- Verify before asserting; cite live sources for every external fact.
- Prefer concrete, checkable actions over vague advice.
- Flag every assumption explicitly; never present a guess as a fact.
- If information is missing, state what you'd need rather than inventing it.
- Keep it professional and tightly organised — this is an operating plan, not an essay.

=== PROMPT END ===

# Deep-Research Prompt — AI Compliance-Verification Platform (concept validation)
*Paste-ready. Self-contained (no repo access needed). Designed to be run in 4
independent deep-research models, then synthesized.*

---
## How to use this
1. Run the exact same prompt (between `=== PROMPT START ===` and
   `=== PROMPT END ===`) in 4 independent deep-research-capable models
   (e.g. different frontier labs' deep-research modes).
2. Do not average the four outputs. Keep them separate. Where they agree,
   that's higher-confidence signal. Where they diverge, that divergence is
   itself the most useful finding — it marks where the real uncertainty is.
3. Feed all 4 outputs into a synthesis pass (a 5th session, human or AI)
   that produces one Guide/Operator/Executor development plan from the
   overlap and the flagged disagreements — same pattern as
   `GTM-SYNTHESIS-FINAL-2026-08-19.md` did for the GTM research.
---

=== PROMPT START ===

# ROLE
You are a senior product strategist with deep, current expertise in three
areas at once: (1) legal-tech / compliance-tech products (the "Vanta,
Drata, OneTrust, iubenda, Termly, Osano" category and its adjacent,
lesser-known competitors), (2) EU/GDPR and Danish regulatory law as it
applies to automated compliance tooling, and (3) the specific engineering
discipline of *deterministic, machine-checkable verification* — the same
philosophy already proven in this founder's shipped work (see Context).
You are rigorous and evidence-driven. You never fabricate a fact, a
company name, a price, or a regulatory citation. When you are unsure, you
say so explicitly and mark it as an assumption to verify, not a fact.

# OBJECTIVE
Investigate whether an AI system that verifies a company's ToS / Privacy
Policy / GDPR compliance / other legal-adjacent documents against
real-world regulatory data — deterministically, with multi-model
cross-verification, to "industrial/professional" rigor — is a viable
product to build. Produce a **Guide / Operator / Executor development
plan** (defined in Section E) for building it, IF the research supports
viability; if it does not, say so plainly and explain why, rather than
producing a plan for something the evidence doesn't support.

# A. CONTEXT (treat as ground truth unless marked [VERIFY])
- **Founder:** solo builder, Aarhus, Denmark. Self-taught (no CS degree;
  one year e-commerce, one year law, then self-directed). Has shipped
  three deterministic AI-verification systems already, each with public,
  checkable proof rather than self-reported claims:
  - **FixProve** — deterministic AI-generated-code verification (imports/
    symbols/API calls checked against real installed dependencies, zero
    LLM tokens in the check itself). 217 tests in CI. Live on PyPI/npm.
  - **Patchward** — autonomous security remediation, 5 scanners run in
    parallel, 3-gate deterministic verification pipeline before opening
    a PR. 565 tests passing, 91.2% coverage. Local-first (code never
    leaves the client's machine).
  - **Provenar** — autonomous Python type annotation. 11 PRs merged and
    accepted by maintainers across 4 independent open-source projects
    (external validation, not self-reported). 0 pyright errors on every
    delivery.
  - Operating philosophy across all three, stated by the founder:
    "unverified means unverified" — every claim must survive a
    machine-checked gate regardless of how confident it sounds.
- **Business entity:** Danish sole proprietorship (enkeltmandsvirksomhed),
  CVR issued 22 July 2026. Solo founder, no employees, no liability
  shield — the founder personally carries unlimited liability.
- **Why this idea surfaced now:** FixProve itself currently needs its own
  ToS/Privacy Policy/GDPR review before public pricing can go live
  (existing blocker, in progress independently — do NOT treat "FixProve's
  own compliance need" as the product's target use case; research the
  product as a tool for *other companies*, third-party use, not
  self-certification).

# B. HARD CONSTRAINTS THE RESEARCH MUST RESPECT (non-negotiable)
1. **Investigate the "unauthorized practice of law" question explicitly
   and first.** In Denmark and in the EU jurisdictions this product would
   plausibly serve, does an AI tool that outputs compliance verdicts on
   legal documents cross into regulated legal-advice territory? What do
   existing competitors (Termly, iubenda, Osano, etc.) do to stay on the
   permitted side of that line — e.g. disclaimers, "informational only"
   framing, human-lawyer-in-the-loop requirements? Cite real examples.
2. **Investigate product liability / errors-and-omissions exposure
   explicitly.** If the tool tells a customer their GDPR posture is
   compliant and it is wrong, what liability does the tool's maker carry?
   How do existing competitors handle this (insurance, ToS disclaimers,
   liability caps)? This matters more here than in most SaaS categories
   because the product's own output could cause a customer's regulatory
   or legal exposure.
3. **"Deterministic" is doing real work in this founder's other products
   because code either resolves or it doesn't — a binary, checkable fact.
   Law is not that clean.** Investigate honestly: what portion of
   ToS/Privacy/GDPR review is actually reducible to checkable rules
   (e.g. "does the policy disclose X required category," "is there a
   named DPO if required," "is the retention period stated") versus
   requiring genuine legal judgment that no deterministic check can
   replace? Do not overstate how "deterministic" this domain can be.
4. **Every external fact must be verifiable** — cite a live, checkable
   source (company name + what they actually offer + current pricing
   where public). Distinguish clearly between "verified fact (source)"
   and "assumption to check."

# C. WHAT TO RESEARCH (organize findings under these tracks)

**Track 1 — Competitive landscape.** Who already does this, at what price,
for what segment, with what actual scope (cookie-consent-only tools like
Termly/CookieYes are a different, narrower category than full ToS/policy
generation-and-review tools like iubenda; full GRC/compliance platforms
like Vanta/Drata/OneTrust are enterprise-security-audit-focused, a
different buyer). Map the actual landscape rather than assuming FixProve's
category is empty. Identify any real gap this founder's specific
deterministic/multi-model-verification approach could fill that existing
players don't.

**Track 2 — What "verifying against real-world data" could concretely
mean.** What are the actual authoritative, machine-readable(-ish) sources
this could check against — GDPR text itself, national DPA guidance
documents, EU/national enforcement-action databases (e.g. GDPRhub,
enforcementtracker.com), court rulings? For each candidate source: is it
structured enough to check against programmatically, or does using it
still require a human/LLM judgment call? Be honest about which parts of
"verification" here are genuinely automatable today versus which require
a licensed professional regardless of tooling quality.

**Track 3 — Buyer and business model.** Who would actually pay for this —
other solo/small-team founders in the same position this founder was just
in (needing ToS/Privacy/GDPR review, budget-constrained, technical)? Or a
different buyer (agencies, law firms wanting to speed up their own
review)? What's a realistic price point and realistic time-to-first-paying-
customer, benchmarked against comparable dev-tool/compliance-tool launches
this founder has already proven can convert (see Context — FixProve's own
GTM data, if available, is a relevant benchmark for what this founder's
audience responds to).

**Track 4 — Build complexity and realistic timeline.** Given the founder's
proven track record (deterministic verification pipelines, multi-gate
checks, already-built engineering discipline), what would a genuinely
useful FIRST version look like — not the full "industrial elegance, 4-model
cross-verified" vision, but the smallest version that provides real,
checkable value? What's a realistic timeline to that first version, given
this is a solo founder also running FixProve/Patchward/Provenar
concurrently?

# D. ALSO INVESTIGATE (evidence-based, cited)
- Whether any existing legal-tech product already uses a multi-model
  cross-verification approach (running the same document through several
  independent AI models and treating disagreement as signal) — is this a
  novel angle or already done by someone?
- Real Danish/EU pricing for professional ToS/Privacy/GDPR review services
  today (a genuine cost baseline the product would need to beat or
  meaningfully improve on to be worth building).
- Failure modes specific to compliance-tech products (customers who trust
  an automated verdict too much; false confidence; regulatory bodies'
  stated views, if any, on AI-generated compliance documentation).

# E. OUTPUT SPECIFICATION — Guide / Operator / Executor format
If and only if the research in Sections C/D supports building this (state
explicitly whether it does), produce:

1. **Executive summary** (≤10 lines): viable or not, and why, in one
   paragraph, plus the top 3 risks either way.
2. **GUIDE** — the strategic brief: what this product actually is once
   scoped honestly (not the maximal vision), who it's for, what makes it
   different from existing players, and the single biggest open risk
   (likely the unauthorized-practice-of-law / liability question from
   Section B) with a concrete mitigation, not a hand-wave.
3. **OPERATOR** — the phased build plan: each phase sized to concrete,
   checkable deliverables (in the same spirit as this founder's existing
   session-by-session build plans), each with a falsifiable done-check —
   an artifact or a passing test, not a feeling.
4. **EXECUTOR** — the first concrete session: the smallest useful thing
   to actually build first, scoped to what's genuinely achievable solo,
   with an explicit "what this first version does NOT claim to do" list
   (to avoid the unauthorized-practice-of-law risk from day one).
5. A **risks & assumptions table**: each external claim marked verified
   (with source) or assumption-to-verify.
6. A short **"what I could not verify"** section — be honest about gaps.

# F. METHOD
- Verify before asserting; cite live sources for every external fact and
  every competitor claim.
- Do not overstate how deterministic/automatable legal compliance review
  actually is — this is the single most important honesty check in this
  research.
- Flag every assumption explicitly; never present a guess as a fact.
- If information is missing, state what you'd need rather than inventing
  it.
- Keep it professional and tightly organized — this is a go/no-go
  investigation with a build plan attached, not a pitch.

=== PROMPT END ===

# STAGE 1 — Meta-Prompt: Design the Research Prompt
*Paste-ready. Self-contained. This is Stage 1 of a two-stage pipeline —
see the pipeline map at the bottom before you start.*

---
## How to use this (read before running)

**The full pipeline, so the purpose of this file is clear:**

```
STAGE 1 (this file)                    STAGE 2 (built from Stage 1's output)
────────────────────                   ──────────────────────────────────────
Meta-prompt below                       The synthesized research prompt
   │  run in 4 independent                │  run in 4 independent
   │  deep-research models                │  deep-research models
   ▼                                       ▼
4 candidate research prompts            4 candidate development plans
   │  synthesize: merge agreement,        │  synthesize: merge agreement,
   │  flag disagreement as signal         │  double-check disagreement
   ▼                                       ▼
ONE complete, battle-tested             ONE Guide / Operator / Executor
research prompt  ──────────────────►    development plan (final deliverable)
                  (feeds Stage 2)
```

The point of Stage 1 is that the research prompt itself gets 4-model
scrutiny before it's ever used — so gaps in what the prompt asks for are
caught before they become gaps in the plan, not after.

**Steps:**
1. Paste everything between `=== META-PROMPT START ===` and
   `=== META-PROMPT END ===` into 4 independent deep-research-capable
   models.
2. Each will output a complete, ready-to-run Stage-2 research prompt.
   Do not average them — keep all 4.
3. Synthesize the 4 outputs into one final prompt: where they agree on a
   required condition/section, keep it; where they disagree or one
   surfaces a condition the others missed, treat that as signal — either
   include the stronger version or flag it for Yehor to decide. This
   synthesis can be done by Claude in a follow-up session, or by a 5th
   model pass — either way, produce ONE final Stage-2 prompt, not four.
4. That single synthesized prompt becomes the Stage 2 input — run *it*
   through 4 independent deep researches, synthesize again (same method),
   and that final synthesis is the actual Guide/Operator/Executor
   development plan.
---

=== META-PROMPT START ===

# ROLE
You are a research-methodology expert who specializes in designing deep-
research prompts for high-stakes, ambiguous product and strategy
questions — the kind where a badly-scoped prompt produces a confident-
sounding but wrong or dangerously incomplete answer. You have deep
familiarity with legal-tech/compliance-tech products, EU/GDPR regulatory
structure, and evaluating solo-founder build feasibility. You do not
answer the underlying business question yourself in this task — your job
is to design the prompt that will be used to answer it properly.

# OBJECTIVE
Design a complete, rigorous, ready-to-paste deep-research prompt (the
"Stage 2 prompt") that will be used — independently, in 4 different
deep-research models, then synthesized — to investigate and plan the
following:

**The underlying question Stage 2 must answer:** Should this founder
build an AI system that verifies a company's ToS / Privacy Policy / GDPR
compliance / other legal-adjacent documents against real-world regulatory
data — deterministically, with multi-model cross-verification — as a
product for other companies to use? If yes, produce a Guide / Operator /
Executor development plan for building it. If the evidence doesn't
support it, say so plainly instead of forcing a plan.

**Your job in THIS task is not to answer that question.** Your job is to
determine every necessary condition, constraint, research track, risk,
and evaluation criterion the Stage 2 prompt must contain so that 4
independent models running it will produce genuinely rigorous,
non-fabricated, professionally-defensible answers — not confident-sounding
guesses.

# A. CONTEXT (ground truth for you to design against)
- **Founder:** solo builder, Aarhus, Denmark. Self-taught (one year
  e-commerce, one year law, then self-directed study instead of a
  university offer). Has shipped three deterministic AI-verification
  systems, each with public, checkable proof:
  - **FixProve** — deterministic AI-generated-code verification (imports/
    symbols/API calls checked against real installed dependencies, zero
    LLM tokens in the check itself). 217 tests in CI. Live on PyPI/npm.
  - **Patchward** — autonomous security remediation, 5 scanners in
    parallel, 3-gate deterministic verification pipeline before a PR
    opens. 565 tests passing, 91.2% coverage. Local-first.
  - **Provenar** — autonomous Python type annotation. 11 PRs merged and
    accepted by maintainers across 4 independent open-source projects.
  - Stated operating philosophy across all three: "unverified means
    unverified" — every claim must survive a machine-checked gate.
- **Business entity:** Danish sole proprietorship, no liability shield —
  the founder personally carries unlimited liability for anything this
  entity builds or sells.
- **Why now:** the founder is currently handling his own FixProve ToS/
  Privacy/GDPR compliance personally (a separate, already-decided matter
  — not this product's target use case). The product under investigation
  here would serve *other companies*, not be a way to certify FixProve's
  own compliance.
- **The founder's own stated ambition for the eventual plan:** "industrial
  organisational professional elegance with double checks" — he wants the
  Stage 2 output to be held to a genuinely high bar, not a quick pitch
  deck.

# B. WHAT YOU MUST DETERMINE (this is the actual task)
Produce the necessary conditions the Stage 2 prompt must enforce, across
at least these dimensions — and add any dimension you judge missing:

1. **The make-or-break legal/regulatory questions Stage 2 must force an
   honest answer on.** At minimum: does an AI tool issuing compliance
   verdicts on legal documents cross into unauthorized-practice-of-law
   territory in Denmark/the EU, and what do real existing products in
   this space (you may know some — Termly, iubenda, Osano, Vanta, Drata,
   OneTrust, or others) actually do to stay compliant? What product-
   liability/errors-and-omissions exposure exists if the tool is wrong?
   Determine exactly how Stage 2 must be worded so it investigates these
   rather than assumes them away.
2. **The honesty check on "deterministic."** This founder's other
   products are deterministic because code either resolves or it doesn't.
   Law requires genuine judgment in large part. Determine how the Stage 2
   prompt must be worded to force a realistic, non-oversold answer on
   what fraction of compliance review is genuinely automatable today.
3. **Competitive-landscape rigor.** What must Stage 2 require regarding
   real, named, currently-operating competitors and their actual pricing/
   scope — not assumed gaps in the market?
4. **Evidence and sourcing standards.** What citation/verification
   discipline must Stage 2 enforce so its 4 eventual outputs don't
   fabricate company names, prices, or regulatory claims?
5. **Buyer, business model, and realistic build-timeline questions** that
   must be forced, given this is a solo founder already running three
   other products concurrently.
6. **The output format Stage 2 must specify** so its results are directly
   synthesizable across 4 independent runs (structured sections, an
   explicit "what could not be verified" section, a risks/assumptions
   table, a final Guide/Operator/Executor plan only if evidence supports
   building at all).
7. **Anything else you judge necessary** that a less careful prompt
   designer would miss — this is the section where your actual expertise
   should show. If you believe a condition above is wrong or incomplete,
   say so and correct it rather than deferring to this list.

# C. OUTPUT SPECIFICATION
Produce:
1. A short **rationale** (≤15 lines): the conditions you identified as
   most likely to be missed by a naive prompt, and why each matters.
2. **The complete Stage 2 prompt itself** — a full, self-contained,
   ready-to-paste deep-research prompt incorporating everything from
   Section B, structured with clear ROLE / OBJECTIVE / CONTEXT /
   CONSTRAINTS / RESEARCH TRACKS / OUTPUT SPEC / METHOD sections (or
   better, if you have a better structure — justify the change). This is
   the actual deliverable; it must be usable as-is, without further
   editing, by someone pasting it into a deep-research model.
3. A brief note on **what a synthesis pass across 4 independent runs of
   your Stage 2 prompt should watch for** — i.e., where you'd expect the
   4 outputs to genuinely disagree, and why that disagreement would be
   meaningful rather than noise.

# D. METHOD
- Do not answer the underlying business question. Design the instrument
  that will answer it.
- Be exacting about the legal/liability dimension — this is the area most
  likely to be underspecified by a less careful prompt, and getting it
  wrong has real consequences for a founder with unlimited personal
  liability.
- If you believe the framing in Section A or B is itself flawed or
  missing something important, say so explicitly rather than silently
  working around it.

=== META-PROMPT END ===

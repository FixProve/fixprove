# DEEP RESEARCH PROMPT — LinkedIn Skills-Showcase Piece (FixProve)

**Artifact ID:** `DRP-LINKEDIN-SHOWCASE-2026-08-19` · **Built:** 2026-08-19, Session 4.16
**Status:** DRAFT — not yet run against any model.
**Scope:** FixProve only (Yehor's explicit choice — sharper and easier to verify than a full-portfolio piece).
**Open questions this prompt exists to answer:** format, and audience/goal — deliberately left open by
Yehor rather than pre-decided, so answer them from research, not assumption.

---

## PART 0 — HOW TO USE THIS (read before pasting)

Paste everything from **PART 1** onward into a research-capable AI session — one with live web
access, since this needs current information about what actually performs on LinkedIn right now, not
training-data-era assumptions. A single well-resourced run is enough; this is not designed as a
multi-model reconciliation exercise like FixProve's product-positioning research was — the stakes and
ambiguity here don't warrant that overhead.

**Do not paste this Part 0.** It's operator context, not part of the research brief.

If you want a second opinion, running the same prompt in two different tools and comparing the
*recommended format/goal* and *the actual draft copy* is the cheap way to sanity-check without the
full merge machinery.

---

## PART 1 — SELF-CONTAINED FACTS (verified, do not need external confirmation)

You have no access to any private repository, mount, or prior conversation. Everything you need is
below. Do not infer or invent any fact not stated here — flag it as unknown instead, especially
anything about traction, revenue, or user numbers.

**Who:** Yehor Kaliberda. Runs FixProve as a Danish sole proprietorship (enkeltmandsvirksomhed),
CVR 46646223, based in Aarhus, Denmark. Solo builder — no co-founders, no engineering team.

**What FixProve is:** A developer tool that deterministically verifies AI-generated code against a
project's *actually installed* dependencies — catching calls to functions, methods, classes, or API
surfaces that don't really exist (a common failure mode of LLM-generated code, sometimes called
"hallucinated APIs" or package/function hallucination). It does not use an LLM in the verification
step itself — the check is deterministic, based on static analysis of what's genuinely importable
and callable in the environment. Supports Python and TypeScript/JavaScript. Does not support Rust or
Go, because those languages' own compilers already catch this class of error at build time — Python
and JS/TS don't have that safety net, which is precisely why the problem exists there.

**How it ships, concretely:**
- An MIT-licensed CLI, publicly published on **PyPI** and **npm** (package name `fixprove`,
  currently at v0.1.10), installable by anyone today, free.
- A GitHub App that posts a blocking pull-request status check in CI — currently restricted to
  internal/private use, not yet open for public third-party installation (a deliberate, gated
  decision pending a short legal check, not a technical limitation).
- Backend: Cloudflare Workers + KV (`api.fixprove.dev`). Website on Cloudflare, fully static.
- Public site: **fixprove.dev** — live, free public beta, with a published Privacy Policy and Terms
  of Use.

**Engineering process worth highlighting:** the build follows an unusually formal, self-imposed
discipline for a solo project — every non-trivial change is traceable to a requirement and a test;
architectural decisions are logged as they're made; there's a deliberate adversarial-testing stage
(the builder tries to break his own work before calling anything done); release packaging uses
OIDC-based trusted publishing to PyPI/npm rather than long-lived tokens; CI runs full test suites
(tens of tests across the Python resolver engine, the TS/JS resolver engine, and the Cloudflare
Worker) before anything ships. The tone is closer to how a small compliance-conscious engineering
org would operate than how most solo indie tools get built.

**Legal/GDPR posture worth highlighting, carefully:** actively engaging independent Danish law firms
for a real legal review before any wider rollout — not because something is wrong, but as a
deliberate, disciplined choice by a pre-revenue solo founder to get real compliance signoff before
scaling, rather than treating it as an afterthought. This is a genuine differentiator (most solo
tools don't do this) but must be described modestly — the review is in progress, not complete, and
nothing should imply it's finished or that a law firm has endorsed the product.

**Status, stated precisely (do not round up):** live, free, public beta. **Pre-revenue.** No paid
tier exists yet. No customer testimonials, install counts, or revenue figures are available to cite
— if the research or draft wants a "traction" beat, it must either omit one or explicitly frame the
project's current stage as "early, free, and live" rather than invent numbers.

**Founder context:** building this largely solo, working closely with AI tools as part of the
process itself — which is itself part of the story (an AI-native builder who applies unusually
rigorous engineering discipline specifically *because* AI-assisted development invites exactly the
kind of invented-API errors the product catches). Non-native English speaker.

---

## PART 2 — RESEARCH QUESTIONS (answer with current sources, not priors)

### R1 — Format
What actually performs best on LinkedIn right now for a solo technical founder publishing a
portfolio/skills-showcase piece about one real, live, shipped project? Compare, with sources:
- LinkedIn "document" posts (PDF carousel, ~8–15 slides)
- Single long-form text posts (~1,300–3,000 characters, no attachment)
- A slide deck pinned to the Featured section / linked externally

Consider current algorithm behavior, dwell-time signals, save/share rates, and what LinkedIn is
reportedly prioritizing in 2026. Recommend one primary format, with reasoning tied to evidence, not
general platform lore.

### R2 — Audience and goal
For a pre-revenue solo founder posting about a real shipped developer tool, which goal tends to
actually produce follow-on value, and why — evaluate against real examples or credible sources where
possible:
- (a) attracting early users/testers of the product itself (the ICP: Python/TypeScript teams shipping
  AI-generated code, CI/tooling owners)
- (b) building the founder's own professional reputation (recruiters, collaborators, community
  visibility, credibility for things like technical-community or ambassador-type programs)
- (c) both, deliberately

Recommend one primary emphasis (dual-purpose is fine as the answer, but say so explicitly and explain
the balance) rather than trying to please every audience equally.

### R3 — Structure and proof patterns
What structural pattern do genuinely high-performing "I built X" technical showcase posts follow —
hook in the first 1–2 lines/slides, how they establish credibility without invented metrics, how they
handle the "so what, why should I care" beat, and how they close (call to action vs. soft invitation)?
What do the worst-performing versions of this genre do wrong (buzzword density, generic AI-hype
phrasing, no concrete specificity, overclaiming)?

---

## PART 3 — DELIVERABLE (produce after answering R1–R3)

1. **One-paragraph recommendation**: format + primary goal, with the reasoning compressed to a few
   sentences, referencing what R1–R3 found.
2. **Full draft**, in the recommended format:
   - If a document/carousel: full slide-by-slide text, one slide's content per block, including the
     hook slide and the closing slide.
   - If a single post: the complete post text, ready to paste, under LinkedIn's practical length norms.
   - If a deck: a full slide-by-slide outline with the actual copy for each slide, not just headers.
3. **Annotations**: after the draft, a short note per major section explaining *why* it's structured
   that way, tied back to R1–R3's findings — so Yehor can edit intelligently rather than just accept
   the draft as-is.
4. **Posting mechanics**, if the research surfaces anything credible: best day/time patterns, whether
   hashtags still matter and how many, whether tagging FixProve's own presence (if any) or specific
   communities makes sense.

---

## CONSTRAINTS — apply to every part of the deliverable

- **No invented facts.** Use only what's in Part 1. If a stronger post would benefit from a stat,
  user count, or testimonial that doesn't exist yet, say so explicitly rather than inventing one.
- **No pricing, no payment claims, no "customers" language.** The product is free, pre-revenue, beta.
  Do not imply otherwise, even implicitly through phrasing like "join thousands of teams."
- **No overclaiming on the legal work.** It's in progress. Never phrase it as completed, endorsed, or
  certified by any law firm.
- **Tone:** confident about the engineering work, honest about the early stage. Avoid generic AI-hype
  language ("revolutionary," "game-changing," "disrupting"). Specificity beats adjectives — the tech
  stack, the discipline, and the real product behavior are the actual differentiators; let them do
  the work rather than adjectives.
- **This is a draft for Yehor's own review and edit before posting** — flag anything in the output
  that's a judgment call rather than a settled fact, so it's easy for him to catch before it goes out
  under his name.

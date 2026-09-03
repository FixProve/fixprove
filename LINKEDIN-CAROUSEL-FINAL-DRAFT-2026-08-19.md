# LinkedIn Showcase — Final Synthesized Draft

**Built:** 2026-08-19, Session 4.16 — synthesized from four independent research runs against
`DEEP-RESEARCH-PROMPT-linkedin-skills-showcase-2026-08-19.md`, cross-checked against each other,
with the two most load-bearing claims independently re-verified against primary sources (not
trusted from any single run).

## What converged across all four independent runs (trust this)

- **Format: native PDF document/carousel, 9–10 slides, personal profile.** All four runs agree,
  independently. This is the strongest signal in the whole exercise — genuine convergence across
  four separately-run research passes.
- **Audience: reputation-primary, product-discovery secondary.** All four agree, with similar
  reasoning: no traction numbers exist to pitch users on, but the engineering story is real and is
  the actual asset. Treat early testers as upside, not the scoreboard.
- **Structural skeleton**, converged across all four: concrete failure mode → why it's specific to
  Python/JS and not Rust/Go → the deterministic (no-LLM) mechanism → what's shipped today vs. gated
  → the engineering discipline as the credibility payload → honest, in-progress legal framing →
  soft close naming the real stage (free, live, pre-revenue).
- **Never claim the legal review is finished. Never invent traction. Never use pricing/customer
  language.** Every run enforced this independently — it was a hard constraint in the prompt, and
  all four respected it without being asked twice.

## What genuinely disagreed (don't pretend these are settled)

- **Exact engagement-rate percentages for document posts** varied by source in every run (7.00% vs.
  6.60% vs. 21.77%-vs-3.18% vs. others) — different studies (Socialinsider, Buffer, Metricool,
  AuthoredUp), different methodologies, not comparable to each other. The direction (documents beat
  text, by a wide margin) is robust; the precise number is not. Don't quote a specific percentage
  in the actual post — it's not needed and picking one implies false precision.
- **Best posting day/time** ranged from "Wednesday afternoon" to "Friday midday" to "Tuesday–Thursday
  morning," depending on which vendor dataset the run leaned on. The most careful of the four runs
  said this outright: pick a consistent slot and test it yourself rather than trust any single
  vendor's global average for a European solo-founder audience specifically.
- **Whether link-in-caption actually hurts reach** — genuinely contested even within single runs
  (one run cited two vendors disagreeing with each other directly). Default below: keep the link off
  the slides' body text and out of the caption, put it in the first comment — this is the
  lower-risk default, not a proven law.
- **"360Brew"** — real and LinkedIn-confirmed (March 2026 engineering post) as a deployed system, but
  *not* confirmed as the sole feed-ranking mechanism — it also powers other surfaces (job matching,
  "people you may know"). Corrected below to avoid overclaiming a specific mechanism.

## The corrected academic anchor (verified against primary sources this session)

Spracklen et al., **"We Have a Package for You! A Comprehensive Analysis of Package Hallucinations
by Code-Generating LLMs,"** 34th USENIX Security Symposium, 2025 — real, peer-reviewed, GitHub repo
confirms methodology (`github.com/Spracks/PackageHallucination`).

**Verified directly:** 16 code-generating models, Python and JavaScript, **2.23 million** code
samples generated (not 576,000 — one research run had this wrong), **205,474 unique non-existent
package names** invented across the runs. Hallucination rate averaged **at least 5.2%** for
commercial models and **21.7%** for open-source models.

**Not independently re-confirmed this session** (reported consistently across research runs, math
is internally consistent, but check once more against the actual paper before publishing): the
blended ~19.7% headline rate, and the finding that ~58% of hallucinated names recur across repeated
runs (the point that makes them exploitable, not just noise).

---

## FINAL DRAFT — ready to use

### Caption (post body)

> A peer-reviewed USENIX study generated 2.23 million code samples across 16 AI models. Hundreds of
> thousands of the packages they referenced didn't exist.
>
> That's the failure mode I built FixProve to catch.
>
> AI models write Python and JavaScript that looks right — confident function calls, plausible method
> names — and some of it references things that were never real. It compiles. It passes a glance.
> Then it fails at runtime, or silently does the wrong thing.
>
> FixProve checks AI-generated code against what's *actually* installed in your project — deterministically.
> No model in the verification step. Same input, same output, every time.
>
> It's a free, MIT-licensed CLI on PyPI and npm. Live public beta, built solo, in Aarhus.
>
> Swipe through for how it works, and how it's built. →
>
> If you ship AI-assisted Python or TypeScript: how are you catching invented APIs today?

*(Keep this link-free. Put `fixprove.dev` in the first comment, not here.)*

### Slide 1 — Hook

> AI writes code that calls functions that don't exist.
> A peer-reviewed USENIX study found this happens routinely — at real scale, across 16 models.
> I built a tool that catches it. Deterministically.
>
> *FixProve — free, live beta*

### Slide 2 — The problem, made concrete

> The code looks right. It compiles. It passes a quick review.
> Then a method that was never real gets called — and it fails at runtime, or silently does the
> wrong thing.
> This is the everyday failure mode of AI-assisted coding, not an edge case.

### Slide 3 — The scale (verified, not asserted)

> USENIX Security 2025 — "We Have a Package for You!" (Spracklen et al.):
> — 2.23 million code samples, 16 LLMs, Python + JavaScript
> — 205,474 unique non-existent package names invented
> — Hallucination averaged 21.7% for open-source models, 5.2%+ for commercial ones
>
> This is a measured, published problem — not an opinion.

### Slide 4 — Why this class of bug survives in Python and JS

> Rust and Go catch this at build time — their compilers reject calls to things that don't exist
> before you ship.
> Python and JavaScript don't have that safety net. That's the gap, and it's exactly where FixProve
> works — which is also exactly why it doesn't bother with Rust or Go.

### Slide 5 — What FixProve does

> FixProve verifies AI-generated code against your project's actually installed dependencies.
> It flags calls to functions, methods, classes, and API surfaces that aren't really importable or
> callable in your environment.
> The check is deterministic static analysis. No LLM in the loop.

### Slide 6 — Why "no LLM in the check" matters

> You can't reliably check AI code with more AI — if a model can hallucinate the code, it can
> hallucinate the review of the code too.
> FixProve breaks that loop: same input → same output, every run. A fact check against your real
> environment, not a second opinion.

### Slide 7 — How it ships today

> — MIT-licensed CLI on PyPI and npm — `fixprove`, v0.1.10. Install and run it today, free.
> — A GitHub App that posts a blocking PR status check in CI — currently internal-only while an
>   independent legal review is in progress, not yet open for public installation.
> — Backend on Cloudflare Workers + KV. Fully static site on Cloudflare.

### Slide 8 — How it's built

> Built solo, with the discipline of a compliance-conscious engineering team:
> — Every non-trivial change traces to a requirement and a test
> — Architectural decisions logged as they're made
> — A deliberate adversarial stage — I try to break it before calling it done
> — OIDC trusted publishing to PyPI/npm — no long-lived tokens
> — Full CI test suites across the Python resolver, the TS/JS resolver, and the Cloudflare Worker

### Slide 9 — The honest part

> I build closely with AI tools myself — that's exactly why I hold this to a higher bar. AI-assisted
> development invites the invented-API errors this tool catches.
> I'm also actively engaging independent Danish law firms for a real compliance review before wider
> rollout. That review is **in progress, not finished** — nothing here is endorsed or certified yet.

### Slide 10 — Close

> FixProve is free, live, and in public beta. Pre-revenue — no paid tier, no customer numbers to
> cite. Just a tool I think should exist.
>
> Try it: `pip install fixprove` or `npm install fixprove`
> `fixprove.dev`
>
> If you ship AI-assisted Python or TypeScript: how do you catch invented APIs today? I read every
> reply.
>
> *Yehor Kaliberda — building FixProve solo, Aarhus*

---

## Posting mechanics — defaults, not laws

- **Format:** native PDF upload, portrait orientation, 9–10 slides as above.
- **Timing:** pick one consistent weekday mid-morning-to-early-afternoon slot (Wednesday is the
  single most-repeated recommendation across runs, but not unanimous) and stick with it for this and
  future posts — consistency matters more than chasing the "optimal" hour, which no two sources
  agreed on anyway.
- **Links:** keep the caption and slides link-free; put `fixprove.dev` in the first comment.
- **Hashtags:** 3–5 max — `#Python #TypeScript #DevTools #BuildInPublic #StaticAnalysis` is a
  reasonable set; swap for tags of communities you're actually active in if you have a preference.
- **After posting:** reply to every substantive comment in the first hour or two — this was the one
  posting-mechanics point every run agreed on without hedging.
- **Featured:** pin the same PDF to your profile's Featured section after posting, so it keeps
  working after the feed life of the post ends.

## Before you post — your own review, not mine

1. Confirm v0.1.10 is still the current version and the App is still internal-only — both are
   time-sensitive and stated as current facts in the draft.
2. One more check of the exact USENIX figures against the paper itself (or its GitHub repo) if you
   want to state the blended 19.7% figure or the 58%-recurrence stat — I verified the sample size and
   unique-name count directly; those two specific figures I did not.
3. Decide if you're comfortable naming the legal review publicly at all (Slide 9). It's a genuine
   differentiator, but optional — cut the sentence if you'd rather not reference it before it's done.

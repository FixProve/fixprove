# DEEP RESEARCH PROMPT — FixProve Public Presence & Customer Funnel

**Artifact ID:** `DRP-PRESENCE-2026-08-11` · **Version:** v2.1 (post-adversarial + agent-discovery amendment)
**Built:** 2026-08-11, Session 4.13, by Claude (Node 1) under Keystone v1.1.0
**Status:** DRAFT — not yet run against any model. Untracked, off `main`.
**#KS-TRACE:** `S4.13-R1` | assumption: the four research models have **no** access to
the repo, the mount, or any private context — everything they need is inside this
document | test: Part 0.5 self-containment check + the v1→v2 defect log (Appendix)

> **v2 supersedes v1.** v1 was written, then adversarially reviewed and found to carry
> **27 defects**, of which 5 were structural enough to have wasted all four model runs.
> The three that mattered most: sub-section IDs were specified for `R1` only and left as
> prose for `R2`–`R8`, which would have broken the mechanical merge for seven of eight
> sections; the brief paid models to be contrarian while the synthesis protocol read
> disagreement as signal, inverting the meaning of the entire agreement matrix; and the
> generative tasks sat last in a single oversized response, guaranteeing that the
> verbatim deliverables — not the disposable prose — would be the parts that got
> truncated. All 27 are logged in the Appendix. **v1 must not be run.**
>
> **v2.1 (2026-08-11):** added `R1.AGENT-DISCOVERY` sub-block and `F37`
> (structured-data / AI-answer-engine legibility), per an amendment proposed in a
> separate advisory chat and independently verified before being applied. Added as a
> single new sub-block, in one place, per the same discipline that produced v2 — see
> the note at the end of Part 1 for why it was not scattered across multiple sections.

---

## PART 0 — OPERATOR INSTRUCTIONS (Yehor only — do NOT paste this part)

### 0.1 What this is

Two self-contained research briefs, run **in sequence** against the same four models.
Each returns one report in a rigidly-specified schema. Those reports are then merged
into one build document.

The rigidity is the whole mechanism. Four models asked an open question produce four
essays that cannot be compared. Four models filling an identical schema produce a matrix
where **agreement signals confidence and disagreement signals a decision you have to
make yourself.** Disagreement is the valuable output, not noise.

### 0.2 Why two prompts and not one

**PROMPT A — assessment** (`R1` funnel, `R2` positioning, `R3` credibility, `R7` proof
surfaces). Comparable, analytic, high merge value.

**PROMPT B — generation** (`R4` identity system, `R5` image briefs, `R6` homepage copy,
`R8` motion). Run **only after A is synthesised**, with A's settled positioning pasted
in as fact.

Two reasons, both real:

1. **Truncation lands on the wrong thing in a single prompt.** The generative tasks
   demand verbatim output — actual copy, actual prompts, actual script. In one giant
   response those sit last, so every model runs out of budget precisely where budget
   matters most. You would then be comparing one full homepage deck against three stubs
   and misreading it as a fringe opinion.
2. **Visual work started before positioning is settled gets thrown away.** In a single
   prompt, `R4` and `R6` are generated *simultaneously* with the `R2` positioning they
   are supposed to express. Splitting enforces the dependency instead of hoping for it.

### 0.3 Why four models

One model gives one prior. Four give a distribution:

| Pattern | Reading | Action |
|---|---|---|
| **Consensus 4/4** | Low-risk, well-supported | Act |
| **Majority 3/4** | Sound, with a live objection | Act; record the dissent |
| **Split 2/2** | A genuine judgement call | **Do not act** — escalate to Yehor |
| **Singleton 1/4** | Usually noise; occasionally the only one who saw it | Assess on merit |

### 0.4 Run procedure

1. Paste **PROMPT A (Part 1) + FACT BASE (Part 2)** — everything between the
   `▼ BEGIN PROMPT A` and `▲ END PROMPT A` markers — into a fresh conversation in each
   of four models.
2. Spread the priors: Claude Opus class, GPT-5 class, Gemini Pro class, and one
   non-US or open-weight model. **Do not use two checkpoints of the same family** —
   that halves your effective sample.
3. **No additional context, no follow-up steering on the first pass.** Steering
   contaminates the independence that makes the comparison mean anything.
4. Save verbatim as `research/PRESENCE-A-<model>-2026-08-11.md`.
5. Return all four for synthesis. **Then** run PROMPT B (Part 3) with A's consensus
   positioning pasted into its `B-INPUT` block.

### 0.5 Self-containment check (run before pasting)

Both prompts must survive being read by a model that has never heard of FixProve.
Confirm: does the Fact Base alone let a stranger understand what the product does, what
has shipped, what has not, and what is off-limits? **If any task depends on a fact not
in Part 2, the prompt is broken** — fix it before spending four runs on it.

### 0.6 What this deliberately does NOT ask for

- **Pricing, tiers, or willingness-to-pay.** Standing hard boundary: no public-facing
  pricing exists and none may be created, even as illustration. Asking four models to
  opine on price produces exactly the artifact you are not allowed to publish.
- **Legal drafting or review.** Row 4 needs a professionally-accountable human. A
  model's opinion on your Privacy Policy is worth nothing to a regulator and risks a
  false sense of closure.
- **Anything acting in your name.** This is research. Nothing here authorises a post,
  a publish, a send, or a deploy.

### 0.7 One live defect found while building this (act on it independently)

**PyPI's project sidebar links "GitHub App (CI)" → `https://fixprove.dev/app`, which
returns HTTP 404.** Verified live 2026-08-11. Every PyPI visitor who clicks it hits a
dead page. This is recorded as `F24` in the Fact Base so the models can assess it, but
it does not need a research study to justify fixing.

---

## PART 1 — PROMPT A: ASSESSMENT

▼ ▼ ▼ BEGIN PROMPT A — PASTE FROM HERE (through the end of Part 2) ▼ ▼ ▼

# Research Brief A — Public Presence Assessment: FixProve

## Your role

You are a senior independent reviewer combining **developer-tools positioning**,
**conversion and funnel design**, and **technical due-diligence assessment**. You are
being paid for judgement, not encouragement.

You are one of four models independently answering this identical brief; your output
will be compared field-by-field against three others. **Answer as you actually judge it.
Do not moderate toward what you expect other models to say, and do not moderate away
from it either.** Neither agreement nor disagreement is rewarded here — accuracy is.

## Ground rules

**G1 — Evidence tiering. Label every factual claim:**

- `[VERIFIED]` — stated in the Fact Base. Rely on it fully.
- `[RESEARCHED]` — looked up or known from training. Name the basis and a confidence
  level: `H`, `M`, or `L`.
- `[INFERRED]` — your reasoning from the above. Show the chain in one line.
- `[ASSUMED]` — a fact you needed and do not have. **State it, and state what changes
  if it is false.**

An unlabelled factual claim is a defect in your output.

**G2 — No fabrication of the subject.** Do not invent FixProve features, metrics,
users, traction, funding, team, or history. If the Fact Base does not state it, it is
not established. If you need it, mark `[ASSUMED]`.

**G3 — Calibration.** State strengths and weaknesses at their true magnitude. Do not
inflate and do not deflate. Where something is weak, say how weak, in specific terms.

**G4 — Forbidden recommendations.** Do not recommend or design around: publishing
prices or tiers; launching paid plans; claiming the product is used by anyone; claiming
security or privacy properties beyond the Fact Base; any claim that source code "never
leaves" the user's machine or CI (see `F15` — that exact claim was found false on live
surfaces and removed).

**G5 — Specificity.** Every recommendation must be unambiguous and self-contained: a
competent operator could execute it without asking you a clarifying question.
"Improve the messaging" fails. "Replace the H1 with this exact text: …" passes. This is
a test of precision, **not** of size — how long something takes belongs in the `EFFORT`
field, not in whether you may recommend it.

**G6 — The `CLAIM` line.** Every sub-block below **opens** with a line of the form:

```
CLAIM: <one declarative sentence, maximum 25 words>
```

That single line is what gets compared across the four reports. Everything after it is
your supporting evidence and reasoning. A sub-block without a `CLAIM` line cannot be
merged and will be discarded.

## Context

You are assessing the experience of a stranger encountering FixProve — from first
exposure to the moment they install, star, email, join the waitlist, or leave.

Immediate business purpose: FixProve's founder is about to approach Danish lawyers and
potential partners. **They will search for him and the product before replying.** Assume
each evaluator forms a verdict within **60 seconds**. Use 60 seconds consistently.

**Scope boundary:** assess **only** the surfaces described in the Fact Base
(`F13`–`F35`). The founder's personal search-results footprint — LinkedIn, personal
site, prior projects — is **not** in the Fact Base and is **out of scope for this
brief.** Do not model it, do not assume it, and do not build recommendations on it.

## Research tasks

Answer all four. Use the exact section IDs from the output schema.

---

### R1 — Funnel map and leak diagnosis

Map every touchpoint from arrival to a terminal outcome (installs / stars / emails /
joins waitlist / leaves). For each: what the visitor is trying to learn, what they
actually get, and where the leak is.

Then, precisely: **assume 100 qualified engineers land on `fixprove.dev/`. At which
single subsequent step is the largest fraction lost, and roughly what fraction?**
Name one step. Not three.

Separately and additionally: assess **pre-arrival discovery** — how a qualified
engineer would come to be on that page at all, given the Fact Base. Treat it as its own
question; do not fold it into the on-site answer.

Third and separately: assess **agent-mediated discovery**. A growing share of qualified
engineers ask an LLM or AI answer-engine to recommend a tool before visiting any site;
the agent can only surface facts it can actually extract from the public surfaces
(`F13`–`F37`). Assess: given the current surfaces, if an engineer asks a general AI
assistant *"what tools deterministically verify AI-generated code against installed
dependencies?"*, how likely is FixProve to be named accurately, and what specifically
limits or enables that? Treat this as its own question; do not fold it into the
human-discovery answer above. This is sometimes called GEO (Generative Engine
Optimization) or AI answer-engine visibility — a distinct discipline from classical SEO,
concerned with what a crawling agent can extract as fact rather than what ranks.

### R2 — Positioning and narrative

The product's current framing: *deterministic AST-level verification that AI-generated
code references real, installed symbols — no model in the loop.*

- Is this the strongest available framing? If not, give the exact alternative.
- **Ideal first user:** the person whose pain is most acute *today*. Specify role,
  company size, stack, and the situation they are in when they need this.
  "Developers" is not an answer.
- **Landscape** `[RESEARCHED]`: linters, type checkers, AI code reviewers,
  import-validation tooling, existing hallucination-detection work. Where does this
  sit? What is the defensible wedge, and where is the claim weakest against an
  informed skeptic?
- **One sentence** a competent engineer would repeat accurately to a colleague after
  reading it once.

### R3 — Credibility architecture

Three evaluators reach a verdict in 60 seconds:

1. A **Danish advokat** considering a professional relationship
2. A **senior engineer** deciding whether to run this in their CI
3. A **prospective design partner or first customer**

For each: what they check, in what order, and what the Fact Base surfaces make them
conclude. Where does it fail their check?

Then assess two structural facts on their own terms:

- **Sole proprietorship** — the founder is personally the data controller and
  personally a party to the Terms (`F1`, `F2`).
- **Zero external signals** — 0 stars, 0 forks, 0 watchers, 0 open issues, 0 GitHub
  Releases (`F23`, `F22`).

Do not recommend faking either. What actually converts credibility in the absence of
social proof?

### R7 — Proof surfaces

GitHub, PyPI, and npm. For each: what a technical evaluator concludes today, and the
exact remediation.

Facts in play: the repository root holds **59 tracked markdown files against 10
directories** (`F21`), largely governance and session documents; there is **no root
`LICENSE`** though `cli/LICENSE` and `engine/python/LICENSE` exist and the Terms assert
MIT (`F20`); there are **zero GitHub Releases against 7 published PyPI versions**
(`F22`); and PyPI's own sidebar link to `fixprove.dev/app` **404s** (`F24`).

Assess directly: how does a technical evaluator read a repository root whose markdown
is predominantly the project's own process documentation? Argue your answer — this is a
question, not a prompt for a predetermined verdict.

Produce **one ranked list of all remediations across all three surfaces**, ordered by
impact per hour of work.

---

## Mandatory output format — PROMPT A

Reproduce **exactly** these headings, in this order, verbatim including the ID
prefixes. Every `###` sub-block begins with its `CLAIM:` line (G6), then your evidence.
Do not merge, reorder, rename, or omit any heading. Do not echo the explanatory text in
parentheses.

```
## EXECUTIVE VERDICT
(3-5 sentences. The single most important thing. No preamble.)

## SEVERITY INDEX
(One row per R-section, keyed exactly R1, R2, R3, R7. Add extra rows keyed X1, X2, …
for findings that fit no section. Confidence enum is exactly H, M, or L.)

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|

## R1 — FUNNEL MAP AND LEAK DIAGNOSIS
### R1.FINDINGS
### R1.TOUCHPOINT-MAP
### R1.SINGLE-BIGGEST-LEAK
### R1.DISCOVERY
### R1.AGENT-DISCOVERY
### R1.RECOMMENDATION
### R1.STEELMAN-AGAINST
### R1.EFFORT
### R1.CONFIDENCE

## R2 — POSITIONING AND NARRATIVE
### R2.FINDINGS
### R2.FRAMING-VERDICT
### R2.ICP
### R2.LANDSCAPE
### R2.ONE-SENTENCE
### R2.RECOMMENDATION
### R2.STEELMAN-AGAINST
### R2.EFFORT
### R2.CONFIDENCE

## R3 — CREDIBILITY ARCHITECTURE
### R3.FINDINGS
### R3.VERDICT-ADVOKAT
### R3.VERDICT-ENGINEER
### R3.VERDICT-PARTNER
### R3.SOLE-PROP
### R3.ZERO-SIGNALS
### R3.RECOMMENDATION
### R3.STEELMAN-AGAINST
### R3.EFFORT
### R3.CONFIDENCE

## R7 — PROOF SURFACES
### R7.FINDINGS
### R7.GITHUB
### R7.PYPI
### R7.NPM
### R7.PROCESS-DOCS-VERDICT
### R7.RANKED-REMEDIATIONS
### R7.STEELMAN-AGAINST
### R7.EFFORT
### R7.CONFIDENCE

## PRIORITISED BACKLOG
| Rank | Action | Surface | Effort (integer hours, one person) | Impact (1-5) | Needs legal review (Y/N) | Reversible (Y/N) |

## WHAT I WOULD DO FIRST
(One action. One paragraph. If you could change only one thing.)

## ASSUMPTIONS I HAD TO MAKE
(Every [ASSUMED] item, each with what changes if it is false.)
```

**Field rules.**

- `STEELMAN-AGAINST` is mandatory in `R1`, `R2`, `R3`, `R7`. Write the strongest honest
  argument that **your own recommendation is wrong.** A section whose steelman is
  perfunctory will be treated as low-confidence at merge.
- `EFFORT` is stated as **integer hours for one person**. Not "S/M/L", not "a sitting".
- `CONFIDENCE` is exactly one of `H`, `M`, `L`.
- `R1.SINGLE-BIGGEST-LEAK`, `R2.ONE-SENTENCE`, and `R7.PROCESS-DOCS-VERDICT` must each
  be answerable from their `CLAIM:` line alone.

▲ ▲ ▲ END PROMPT A — the Fact Base below is part of this paste ▲ ▲ ▲

---

## PART 2 — VERIFIED FACT BASE (paste with BOTH prompts)

Every fact below was independently verified against a primary source on **2026-08-11** —
live registry APIs, live HTTP responses, and the public git tree. Treat all of it as
`[VERIFIED]`. Anything not stated here is not established.

### The business

- **F1.** FixProve is a Danish **enkeltmandsvirksomhed** (sole proprietorship),
  CVR 46646223, trading as *FixProve v/ Yehor Kaliberda*, Aarhus, Denmark.
- **F2.** Not a separate legal person: the founder is **personally the data controller**
  and **personally a party to the Terms of Service**.
- **F3.** Solo operator. No employees, no co-founder, no external funding.
- **F4.** Revenue: **zero**. No paid tier exists; no payment surface is live.
- **F5.** Independent legal review of the Privacy Policy and Terms is **in progress,
  not complete** — both live documents state this on their face.

### The product

- **F6.** Deterministic, AST-level static verification: resolves every import, symbol,
  method, and attribute in code against the dependencies actually installed. **No
  language model is involved in the analysis.**
- **F7.** Target failure mode: AI-generated code referencing things that do not exist —
  hallucinated imports, renamed methods, non-existent API calls.
- **F8.** Two engines: Python and TypeScript/JavaScript. Distributed as a CLI.
- **F9.** Live on **PyPI** (`fixprove`) and **npm** (`fixprove`), both at **v0.1.10**.
  The npm package is a thin wrapper around the Python resolver engine; the deterministic
  logic lives in Python. If the engine is absent, `fixprove check` prints an actionable
  `pip install fixprove` message.
- **F10.** npm publishes via GitHub Actions **OIDC trusted publishing**, signed and
  provenance-attested. `gitHead` on the published package matches the verified
  `origin/main` commit exactly.
- **F11.** **7 versions** have been published to PyPI: `0.0.1`, `0.1.0`, `0.1.5`,
  `0.1.6`, `0.1.8`, `0.1.9`, `0.1.10`.
- **F12.** A **GitHub App** exists and posts a blocking check on pull requests. It is
  **private — not open for third-party installation.** Analysis runs inside the user's
  own CI; results post to `api.fixprove.dev`.

### The website

- **F13.** `fixprove.dev` — Next.js **static export** (`output: "export"`) on
  Cloudflare. Verified live: `/` → 200, `/privacy` → 200, `/terms` → 200,
  `/app` → **404**, `/docs` → **404**. There are exactly three real pages.
- **F14.** Homepage content, in order: eyebrow `FIXPROVE`; H1 **"Prove your code. Don't
  hope it."**; subhead **"FixProve checks every import, every call, every attribute your
  AI wrote — against what's actually installed. Deterministically. No model in the
  loop."**; a command block reading exactly:

  ```
  $ pip install fixprove
  $ npm install -g fixprove
  $ fixprove check /path/to/your/project
  ```

  a note that the npm package wraps the Python engine; a note that the GitHub App is
  *"currently limited to internal use, not yet open for third-party installation, with
  no paid tier yet"* and that *"Only finding fragments (file paths, line numbers, the
  unresolved expression) transit our endpoint, encrypted and never persisted"*; a
  problem section with a diff example showing `pd.read_exel("data.xlsx")` and
  `from fastapi_helpers import cache`; a waitlist email capture; a footer reading only
  **"FixProve · fixprove.dev"**.
- **F15.** The Privacy Policy explicitly states FixProve **does not** claim "your code
  never leaves your CI" — code *fragments* (file paths, line numbers, the unresolved
  expression) do transit FixProve's endpoint, encrypted, in memory, not persisted. Any
  marketing claim contradicting this is a live legal exposure. That exact contradiction
  existed on four public surfaces and was corrected on 2026-08-08.
- **F16.** The waitlist consent copy reads **verbatim**: *"By submitting your email, you
  consent to receiving FixProve launch news at this address. You can withdraw consent at
  any time via the unsubscribe link in any email. See our Privacy Policy."* — with
  "Privacy Policy" linked to `/privacy`. This text is GDPR-load-bearing and **must be
  reproduced exactly** in any homepage rewrite.
- **F17.** No analytics, tracking pixel, advertising tag, third-party script, or cookie
  anywhere on the site — verified by source and build-output search. Consequently there
  is **no visitor data of any kind**; every funnel judgement must be made from first
  principles, not from measurement.
- **F18.** `/terms` is **orphaned** — no page links to it. `/privacy` is linked twice
  from the homepage (from the GitHub App note and from the consent copy).
- **F19.** The homepage links to **no repository, no package page, and no
  documentation**, while its own copy invites the reader to read the source. It carries
  **no trader identification** — no CVR, address, or contact email; those appear only on
  `/privacy` and `/terms`.

### Repository and registries

- **F20.** Public repo `github.com/FixProve/fixprove`. **No root `LICENSE` file**, so
  GitHub's sidebar detects no licence. `cli/LICENSE` and `engine/python/LICENSE` both
  exist, and the root README's licence badge points at `./cli/LICENSE`.
- **F21.** Repository root: **59 tracked markdown files** against **10 directories**
  (`.github`, `app`, `billing`, `cli`, `engine`, `logo`, `placeholders`, `session-logs`,
  `web`, `worker`). The markdown is predominantly internal governance and process
  documentation — session logs, per-session reports, starting prompts, watchlists,
  build plans.
- **F22.** **Zero GitHub Releases**, against 7 published PyPI versions and existing tags.
- **F23.** External signals, verified live 2026-08-11: **0 stars, 0 forks, 0 watchers,
  0 open issues.**
- **F24.** PyPI project links: Homepage → `fixprove.dev`; Repository → GitHub; and
  **"GitHub App (CI)" → `fixprove.dev/app`, which returns HTTP 404** (verified live).
- **F25.** A root `README.md` exists — **71 lines**. It opens with five badges (npm
  version, PyPI version, CI status, MIT licence, npm provenance attestation), a
  one-paragraph description claiming *"zero LLM tokens and near-zero false positives"*,
  and an Install section carrying the same three commands as the homepage. Separate
  READMEs at `engine/python/README.md` (43 lines) and `cli/README.md` (54 lines) serve
  as the **PyPI and npm long descriptions** respectively.

### Current visual state

- **F26.** **No design system exists.** Styling is hand-written plain CSS. No Tailwind,
  no component library, no token layer beyond seven CSS variables.
- **F27.** Those seven variables are the entire visual identity:
  `--bg: #0b0d10` · `--fg: #e8eaed` · `--muted: #9aa4ad` · `--accent: #5eead4` ·
  `--danger: #f87171` · `--card: #14171c` · `--border: #262b33`.
  For reference: `#5eead4` is Tailwind's `teal-300` and `#f87171` is its `red-400`,
  both unmodified.
- **F28.** **No typeface has been selected.** Body uses the OS system stack
  (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
  sans-serif`); code uses the system mono stack (`ui-monospace, SFMono-Regular, Menlo,
  monospace`).
- **F29.** Type scale in use: H1 40px/1.15 · subhead 19px/1.5 · section H2 22px ·
  body ~16px/1.6 · mono 13.5px/1.6. Layout: a single centred column, `max-width: 720px`,
  padding `72px 24px 96px`. Accent-coloured eyebrow at 13px, 600 weight, uppercase,
  0.08em tracking.
- **F30.** Logo assets: exactly one file, `logo/FP LOGO.png` — at the repository root, in
  a directory of its own, **with a space in the filename**, and **referenced by nothing
  in the codebase**. The site itself uses only `favicon.ico` and `apple-icon.png`.
- **F31.** One social card exists: `web/public/og-image.png` (1200×630), wired into
  both OpenGraph and Twitter `summary_large_image` metadata.
- **F32.** No documentation site, changelog, blog, demo, screenshots, or video exist
  anywhere.

### Standing constraints (bounds on every recommendation)

- **F33.** **No public-facing pricing** may be proposed or published, including
  placeholder or illustrative figures.
- **F34.** **No live payment surface.** Paid plans are not authorised.
- **F35.** **The GitHub App may not be made public**, and no marketplace listing may be
  published, until independent legal review completes.
- **F36.** Every public claim must be consistent with the live Privacy Policy and Terms.
  Those documents are the constraint; the marketing copy is what must bend.

### Machine and agent legibility

- **F37.** Live HTTP fetch of `fixprove.dev/` on 2026-08-11 (raw HTML, not rendered
  text): **no `application/ld+json` structured-data block anywhere on the page** —
  zero JSON-LD, so no schema.org markup of any kind (no `SoftwareApplication`, no
  `Organization`). A `<meta name="description">` tag is present with the same text as
  the homepage subhead. Open Graph tags are present and complete (`og:title`,
  `og:description`, `og:url`, `og:site_name`, `og:image` with width/height/alt).
  Twitter Card tags are present and complete (`twitter:card`, `twitter:title`,
  `twitter:description`, `twitter:image`). **No `<link rel="canonical">` tag.** **No
  `<meta name="robots">` tag.** No reference to a `sitemap.xml` anywhere in the served
  HTML. In short: the page is well-described for a human sharing a social-media link,
  but carries no machine-readable structured claim of what the product *is*, its
  licence, or its install command — the kind of fact block a crawling AI agent would
  need to answer a question about FixProve accurately rather than describe it vaguely
  or omit it in favour of a competitor whose site does carry that markup.

▲ ▲ ▲ END OF SHARED FACT BASE ▲ ▲ ▲

---

## PART 3 — PROMPT B: GENERATION

> **Do not run PROMPT B until PROMPT A has been synthesised.** B's `B-INPUT` block must
> be filled with A's settled positioning before pasting. Running B first produces a
> visual system expressing a positioning that the research has not yet agreed on.

> **DEPLOYMENT-STATUS ADDENDUM — added 2026-08-11, after Tier 1 shipped.** Facts
> `F13`–`F37` above were captured before Tier 1's hygiene fixes existed and are NOT
> retroactively edited (traceability). Live-verified split, same day, after commit
> `fb13c4b`:
> - **`origin/main` (GitHub source) reflects Tier 1**: root `README.md` now carries the
>   softened claim and the `NOTICE.md` license note; `web/src/app/app/page.tsx` and the
>   expanded footer exist in source.
> - **`fixprove.dev` (the deployed site) does NOT yet reflect Tier 1** — re-verified live
>   by fetch immediately before this addendum: `/app` still returns **404** (`F24`
>   unchanged in practice), the homepage still has no CVR/footer links (`F18`/`F19`
>   unchanged in practice). `git push` updates GitHub; it does not trigger a Cloudflare
>   Pages deploy — that is a separate `wrangler deploy` Yehor has not yet run.
> - **Consequence for R5/R6 below:** design as if Tier 1 *will* be live (per the
>   Sequencing constraint already in `B-INPUT`), not as if it *is* live. Don't let a
>   model that happens to fetch `fixprove.dev` mid-task get confused by the gap — it
>   isn't a regression, it's an undeployed commit.

▼ ▼ ▼ BEGIN PROMPT B — PASTE FROM HERE (plus the Fact Base, Part 2) ▼ ▼ ▼

# Research Brief B — Identity and Asset Generation: FixProve

## Your role

You are a senior brand and product-design lead specialising in developer-tools
identity systems. You are one of four models independently answering this identical
brief; outputs will be compared field-by-field. Answer as you actually judge it.

All ground rules `G1`–`G6` from Brief A apply unchanged, including the mandatory
`CLAIM:` line opening every sub-block.

**Additional rule — G7:** where a piece of copy you are asked to write would require a
fact not in the Fact Base (supported languages beyond Python and TypeScript, CLI output
format, runtime, install size, benchmark numbers), **do not invent it.** Write
`[NEEDS-FACT: <precisely what is missing>]` inline. Those placeholders are a wanted
output — they identify what must be established before the copy can ship.

## B-INPUT — settled positioning from Brief A

> **Filled 2026-08-11, Session 4.13, from the four-model Prompt A synthesis
> (`PRESENCE-BUILD-DOCUMENT-2026-08-11.md`) plus three decisions Yehor confirmed
> in his own words the same session — recorded in `MEMORY/critical-actions.md`.
> RISK-1 (see below) was independently verified against Pyright's own
> documentation before this block was filled, not assumed from any single model.**
>
> - **Agreed positioning statement:** FixProve's wedge is deterministic runtime
>   introspection of a project's actually-installed dependencies — including
>   untyped and dynamic libraries where stub-based type checkers are blind or
>   admittedly incomplete (Pyright's own docs describe its library-source
>   inference as "typically incomplete") — as a zero-config, single-purpose CI
>   gate that never guesses: every hard case (dynamic imports, `__getattr__`,
>   C-extension builtins, crashing subprocesses) degrades to a flag, not a false
>   positive. **Do not** frame this as "no other tool checks installed
>   dependencies" — that is false (Pyright does, by default, via
>   `useLibraryCodeForTypes`) and independently verified false this session.
> - **Agreed ideal first user:** a senior/staff engineer or CI owner at a
>   **10–50 person, Python-first, AI-coding-heavy team**, where the person
>   deciding to adopt the tool is the same person who feels the pain — no
>   procurement gate, no dedicated devtools team. This was the overlap zone
>   across 3 of 4 independent model reports; the other two bands (2–20 and
>   20–200) were considered and are not the design target.
> - **Agreed one-sentence description:** FixProve is a deterministic CLI that
>   fails your CI when AI-written code calls imports, methods, or attributes
>   that don't actually exist in your installed dependencies.
> - **Agreed single biggest funnel leak:** the promise-to-proof gap — the
>   homepage invites the reader to verify the claim (read the source, check the
>   packages) but links to no repository, package page, or documentation. All
>   four models independently named this same step. Magnitude estimates ranged
>   55–92% of qualified visitors; treat the number as "the largest single loss,
>   materially higher than any other step," not as a precise figure.
> - **Sequencing constraint on this run:** hygiene fixes (LICENSE re-scoped per
>   `NOTICE.md`'s deliberate mixed-licensing — do NOT propose a blanket root MIT
>   licence; PyPI `/app` 404; GitHub Releases; footer trader ID) are being
>   applied ahead of and separately from anything R4–R8 produces. Design as if
>   those hygiene items will already be fixed by the time this identity system
>   ships — do not re-solve them here.
> - **Open decisions NOT settled — do not design around these:** the exact
>   effort/timeline is not settled (model estimates spread 5.6×, from ~10h to
>   ~56h for the full backlog); whether the 59 process-markdown files get
>   relocated is Yehor's call and not yet made; the "near-zero false positives"
>   claim's exact wording (evidence-supported vs. softened) is drafted in two
>   options, neither chosen yet.

Treat the filled block above as `[VERIFIED]`. Everything you produce must express it.

## Tasks

### R4 — Visual identity system

Ground everything in `F26`–`F32`. Produce a complete, specified system — not a process
for arriving at one.

- **Logotype.** Wordmark vs. mark-plus-wordmark; the construction concept; required
  file set and formats; clear-space and minimum-size rules; monochrome and inverse
  behaviour. Note that the sole existing asset (`F30`) is unreferenced and unusable as
  a system.
- **Typography.** Name **specific, licensable typefaces** (display / text / mono), each
  with its licence model and a one-line justification tied to this product. Give a full
  type scale in px with line-heights, mapped against the current scale in `F29`.
- **Colour.** A considered palette: full ramp with hex values and semantic roles.
  State **WCAG AA contrast ratios to two decimal places** for exactly these six pairs:
  body-text-on-background, muted-text-on-background, accent-on-background,
  body-text-on-card, accent-button-label-on-accent-fill, danger-text-on-background.
  Address whether the current values in `F27` should be retained, adjusted, or replaced.
- **The proof motif.** This product's promise is deterministic verification. What is
  the visual language of proof, resolution, and certainty — as distinct from the
  probabilistic-shimmer visual language most AI products use? Answer concretely, with
  specific forms, and state at least one direction you considered and rejected.
- **Layout and grid.** Grid, spacing scale, component rules. The current state is one
  720px column (`F29`).

### R5 — Image generation briefs

Produce **exactly six** ready-to-paste image-generation prompts, one per surface, in
this fixed order:

1. `R5.OG-CARD` — 1200×630, replacing `F31`
2. `R5.HERO` — homepage hero visual
3. `R5.README-BANNER` — top of the root README (`F25`)
4. `R5.SOCIAL` — square 1080×1080
5. `R5.DOCS-DIAGRAM` — how the verification actually works (`F6`)
6. `R5.LOOKBOOK-PLATE` — a single plate summarising the R4 system

Each brief states: `SURFACE`, `DIMENSIONS`, `PROMPT` (complete, paste-ready, no
editing needed), and `AVOID` (what would make it wrong).

**Constraint:** these must read as engineering-grade, not AI-generated stock imagery.
If your direction is an abstract glowing neural network, you have failed the task.

### R6 — Homepage rewrite

Full information architecture, section by section in order, with the **exact copy** —
headline, subhead, body, CTA labels, microcopy. Not descriptions of copy. The copy.

Hard constraints:

- The GitHub App is **not open for third-party installation** (`F12`). The page must
  not imply otherwise.
- The waitlist capture is retained and its consent copy reproduced **verbatim from
  `F16`** — do not rewrite it.
- No pricing anywhere (`F33`).
- Every claim must survive comparison against `F15`.
- Apply `G7`: unestablished specifics become `[NEEDS-FACT: …]`, never invention.
- `F19` records that the page currently links to no repository, package, or
  documentation, and carries no trader identification. Your IA should reflect whatever
  you judge correct about that.

### R8 — Motion and narrated explainer

A programmatic, code-driven video approach (React-based, e.g. Remotion) is under
consideration.

- Is motion worth the effort at this stage, or is it premature? **Give a yes or no
  first, then defend it.** A "no" is a fully acceptable answer and should be given if
  you believe it.
- If yes: specify the single highest-value piece — duration (cap at 60 seconds),
  shot-by-shot beats, the **actual narration script**, and what it must *prove* rather
  than assert.
- **Propose the narrative lens.** State at least one alternative lens you considered
  and rejected, and why.
- Does code-driven, deterministic video reinforce the product thesis substantively, or
  is the resonance merely decorative? Answer honestly; "merely cute" is a valid finding.

---

## Mandatory output format — PROMPT B

Reproduce **exactly** these headings, verbatim, in order. Every `###` sub-block opens
with its `CLAIM:` line.

```
## EXECUTIVE VERDICT
## SEVERITY INDEX
| ID | Finding | Severity | Confidence |

## R4 — VISUAL IDENTITY SYSTEM
### R4.FINDINGS
### R4.LOGOTYPE
### R4.TYPOGRAPHY
### R4.COLOUR
### R4.CONTRAST-TABLE
### R4.PROOF-MOTIF
### R4.REJECTED-DIRECTION
### R4.LAYOUT
### R4.STEELMAN-AGAINST
### R4.EFFORT
### R4.CONFIDENCE

## R5 — IMAGE GENERATION BRIEFS
### R5.OG-CARD
### R5.HERO
### R5.README-BANNER
### R5.SOCIAL
### R5.DOCS-DIAGRAM
### R5.LOOKBOOK-PLATE
### R5.STEELMAN-AGAINST
### R5.EFFORT
### R5.CONFIDENCE

## R6 — HOMEPAGE REWRITE
### R6.IA-OUTLINE
### R6.FULL-COPY
### R6.NEEDS-FACT-REGISTER
### R6.STEELMAN-AGAINST
### R6.EFFORT
### R6.CONFIDENCE

## R8 — MOTION AND NARRATED EXPLAINER
### R8.YES-OR-NO
### R8.DEFENCE
### R8.SPEC
### R8.NARRATION-SCRIPT
### R8.NARRATIVE-LENS
### R8.REJECTED-LENS
### R8.PROGRAMMATIC-RESONANCE
### R8.STEELMAN-AGAINST
### R8.EFFORT
### R8.CONFIDENCE

## PRIORITISED BACKLOG
| Rank | Action | Surface | Effort (integer hours, one person) | Impact (1-5) | Needs legal review (Y/N) | Reversible (Y/N) |

## WHAT I WOULD DO FIRST
## ASSUMPTIONS I HAD TO MAKE
```

**Budget rule.** If you are running short of output budget, truncate `FINDINGS` and
`STEELMAN-AGAINST` prose. **Never truncate the verbatim deliverables** in
`R5.*.PROMPT`, `R6.FULL-COPY`, or `R8.NARRATION-SCRIPT` — those are the product of
this brief.

▲ ▲ ▲ END PROMPT B ▲ ▲ ▲

---

## PART 4 — SYNTHESIS PROTOCOL (executed in the FixProve session, not by the models)

### 4.1 Inputs

Four files per brief, conforming to the mandatory schema. **A file that deviates from
the schema is not silently repaired** — the deviation is recorded, because a model that
could not follow a rigid format is weaker evidence on everything else it said.

### 4.2 Merge procedure

For each sub-block ID:

1. Extract all four `CLAIM:` lines verbatim. **The `CLAIM` line is the diff unit** —
   supporting prose is evidence, not the comparison surface.
2. Classify: **Consensus (4/4) / Majority (3/4) / Split (2/2) / Singleton (1/4)**.
3. **Consensus and Majority** → carry into the build document as a recommendation, with
   the dissent recorded beneath it, never deleted.
4. **Split** → the **OPEN DECISIONS** register. **Not resolved by Node 1.** Goes to
   Yehor with both cases stated at their strongest.
5. **Singleton** → assess on merit alone; record whether kept, and why.
6. Collect every `STEELMAN-AGAINST`. Any steelman **no other model rebutted** is
   promoted to a **standing risk** in the build document.
7. Collect every `[ASSUMED]` item and every `[NEEDS-FACT: …]` placeholder. Anything
   **two or more** models independently needed is a **real information gap** — it goes
   on a list of things to establish, not to guess at.

### 4.3 Output

`PRESENCE-BUILD-DOCUMENT-2026-08-11.md`: consolidated findings by severity; the
agreement matrix; the OPEN DECISIONS register (Yehor's calls only); standing risks;
the information-gap list; and one sequenced backlog, every item tagged
**reversible / irreversible** and **needs-legal-review / clear**.

The **lookbook is built from that document**, not in parallel with it.

### 4.4 Honest note on tooling

There is **no synthesis skill installed** in this environment. The procedure above is
executable by hand today. If it will run more than once — a second study, or a re-run
after the site changes — building it as an actual skill first is worth doing. That is a
separate, real deliverable, not a step inside this one.

---

## PART 5 — SEQUENCING AND BOUNDARIES

```
  [1] Prompt A  ──►  [2] 4 runs  ──►  [3] Synthesis A  ──►
  [4] Prompt B (B-INPUT filled from 3)  ──►  [5] 4 runs  ──►
  [6] Synthesis B → build document  ──►  [7] Lookbook  ──►  [8] Site rebuild
```

The common failure mode is starting the lookbook at step 1, on taste, then discovering
at step 6 that the research disagreed with it. Visual work started before positioning
is settled is work that gets thrown away — the two-prompt split exists specifically to
prevent that.

**Nothing in this document authorises any change to a public surface.** It produces
research and a plan. Every commit, push, publish, and deploy remains a separate,
explicitly-approved action under the standing commit and push gates. The hard boundary
is unchanged: no live Stripe, no public pricing, no GitHub App public flip, no
marketplace publish.

---

## APPENDIX — ADVERSARIAL REVIEW LOG (Keystone Stage 3)

v1 of this prompt was submitted to an independent adversarial review before any model
run. **27 defects** were returned. All were triaged; the disposition is recorded here
because "it was reviewed" is not a claim, and "it passed" is not a claim either.

**Structural — would have wasted all four runs (5, all fixed):**

| # | Defect | Fix applied |
|---|---|---|
| D5 | Sub-section IDs specified literally for `R1` only; `R2`–`R8` given as prose lists, while the brief simultaneously ordered "do not rename sections" | Every sub-heading now written out literally and prefixed, ~60 in total |
| D23 | The brief paid models to take unusual positions, while the synthesis protocol read disagreement as signal — inverting the entire agreement matrix | Contrarianism reward removed; replaced with "answer as you actually judge it, do not moderate in either direction" |
| D27 | Generative tasks placed last in one oversized response, guaranteeing the verbatim deliverables would be the parts truncated | Split into Prompt A (assessment) and Prompt B (generation), sequenced, with an explicit budget rule |
| D11 | The merge premise was unsupported — only 3 of ~40 fields were mechanically comparable | Mandatory `CLAIM:` line (≤25 words) opens every sub-block and is the diff unit |
| D18 | `R8` supplied its own answer ("this is a correctness story"), guaranteeing false 4/4 consensus | Deleted; replaced with "propose the lens, state one you rejected" |

**Leading the witness (5, all fixed):** `G3` pre-committed every model to a negative
verdict (D20) → rewritten as calibration. `R7` stated its conclusion then asked for it,
and "dominated by" pre-loaded the answer (D21) → neutralised to a plain count.
`R4` embedded two verdicts as premises — "reads as template", "i.e. no typographic
decision has been made" (D22) → stripped to bare facts in `F27`/`F28`. `R1`'s headline
field was contaminated by three separate prior hints (D19) → editorialising removed.

**Missing facts — models would have invented them (4, all fixed by verification, not
by guessing):** the root README was never described (D2) → `F25` added after reading it.
The consent copy was required "intact" but never quoted (D3) → `F16` now carries it
verbatim. Install commands, H1, and subhead were unquoted (D3) → `F14` now carries all
three verbatim. `/app` was ambiguous (D13) → checked live, **found to be a 404 reached
from PyPI's own sidebar**, now `F24`.

**Precision (13, all fixed):** wrong fact-range citation (D4); missing `R2.ICP`,
`R2.LANDSCAPE`, `R3.SOLE-PROP`, `R3.ZERO-SIGNALS` IDs (D7); unmergeable `BRIEF-1…N`
(D8) → six fixed surface IDs; undefined severity-index keys and three inconsistent
confidence encodings (D9) → single `H|M|L` enum; `EFFORT` unitless (D10) → integer
hours; "biggest leak" undefined against zero traffic (D12) → reframed as 100 landed
engineers, with discovery split out; two different first-impression budgets, 40s and
60s (D14) → 60s throughout; unbounded WCAG matrix (D15) → six named pairs; "two
published versions" wrong (D16) → **7 PyPI versions**, verified; `/privacy` linkage
unstated (D17) → `F18`; `G5`'s one-sitting rule contradicted `R4`/`R8` (D24) →
rewritten as a precision test with sizing moved to `EFFORT`; `G2` vs `R6` made honest
copy impossible (D25) → `G7` `[NEEDS-FACT: …]` convention; `R7` ranking scope ambiguous
(D15b) → one ranked list across all three surfaces; `R5` steelman and `R7`/`R8` missing
fields (D6) → schema completed.

**Not fixed, accepted deliberately (1):** D1 flagged that the founder's personal
search-results footprint is absent from the Fact Base and that `R3` implicitly needs it.
Rather than invent an inventory, the brief now **explicitly scopes it out** — models are
told not to model it. The gap is real and remains open: a LinkedIn/personal-footprint
audit is separate work, and cannot be done from this repository.

---

*Prepared by Claude (Node 1), Session 4.13, 2026-08-11. Not run. Not committed. The
Fact Base was verified against primary sources on 2026-08-11 and has a shelf life —
re-verify `F9`–`F13` and `F20`–`F24` before running if more than a few days have passed.*

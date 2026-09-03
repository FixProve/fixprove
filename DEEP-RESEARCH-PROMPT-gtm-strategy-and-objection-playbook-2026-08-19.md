# DEEP RESEARCH PROMPT — FixProve GTM Strategy, Right-Room Mapping & Objection Playbook

**Artifact ID:** `DRP-GTM-2026-08-19` · **Built:** 2026-08-19, Session 4.16, from Yehor's own
calendar-recorded session brief (created 2026-08-17, refreshed and fact-checked this session).
**Status:** DRAFT — not yet run against any model.
**Source of the brief:** Yehor's own working notes from the 17 Aug founders/investors event and two
voice-rehearsal sessions the same day, consolidated here. Nothing in Part 1 is invented for this
prompt — it is either Yehor's own recorded words, or independently verified this session against a
primary source (marked where relevant).

---

## PART 0 — HOW TO USE THIS (read before pasting)

Paste **PART 1 onward** into a research-capable AI session with live web access — several of the
deliverables below (the named target list, the community/event mapping) are worthless without
current, real, checkable information, not training-era guesses.

**Do not paste this Part 0** — it's operator context.

This prompt is dense — six deliverables plus a playbook. If your research tool has a response-length
limit, consider running Part 2's deliverables in two passes: **D1 + D1B first** (the target list and
room-mapping, both research-heavy and comparable), **D2 + D2B + D3 + D4 second** (the objection
playbook, pitch script, measurement plan, and demo plan, which lean more on synthesis than fresh
lookup). This mirrors a lesson already learned once on this project: generative deliverables placed
last in an oversized single response are the ones that get truncated.

---

## PART 1 — SELF-CONTAINED FACTS (verified; do not need external re-confirmation)

You have no access to any private repository or prior conversation. Everything needed is below.

### 1.1 — Product and ICP

FixProve deterministically verifies AI-generated code against a project's actually installed
dependencies — catching calls to functions, methods, or API surfaces that don't really exist. No LLM
is used in the verification step; it's static, deterministic analysis.

**Supports:** Python (primary) and TypeScript/JavaScript.
**Does not support, deliberately:** Rust or Go. Their own compilers already reject calls to
non-existent functions at build time — the failure mode FixProve catches structurally cannot occur
the same way in those languages. This is a confident, settled answer, not a gap: *"Rust's compiler
already catches this. Python doesn't have one — that's exactly why the problem exists in Python and
TypeScript."* Do not propose pitching FixProve to Rust/Go-only audiences.

**ICP:** 10–50 person, Python-first, AI-codegen-heavy software teams. **Buyer/entry point: whoever
owns CI** (not the CEO, not necessarily engineering leadership — the person who actually configures
and is accountable for the CI pipeline).

**Geography:** Aarhus first (home base), then Copenhagen (stronger Python scene), then online/remote.

### 1.2 — Current distribution reality (as of 2026-08-19 — this changes what you can credibly offer)

- **CLI**: MIT-licensed, live, free, installable by anyone today via PyPI or npm (`fixprove`, v0.1.10).
  **This is the only thing outreach can currently offer someone to install.**
- **GitHub App**: exists, posts a blocking PR status check, but is **currently restricted to
  internal/private use — NOT open for third-party installation.** Do not write outreach copy, demo
  scripts, or pitch material that offers or implies public App access. If App functionality comes up,
  frame it honestly as "coming once a short legal check clears" — do not give a date, none is set.
- **Standing decision (D4, adopted 2026-08-19):** demand generation runs through the CLI specifically,
  on purpose, while the App's legal clearance proceeds in parallel on its own timeline. This is not a
  temporary workaround to route around — it is the actual current strategy, and outreach material
  should be built around the CLI as the hero artifact, not the App.

### 1.3 — Standing constraints (apply to every deliverable below)

- **Phase R0 holds: free beta only.** No pricing, no payment language, no "buy," "subscribe," or
  "purchase" anywhere in any generated material. This is a hard, project-wide rule, not a style choice.
- **No cold volume, no paid ads.** Outreach is small, targeted, engineer-to-engineer. Explicitly not a
  numbers game.
- **Tone: specific, not pitchy.** Enter every conversation seeking feedback, not a yes. (Yehor's own
  words, 17 Aug: *"I really need to sell this."* — noted explicitly as the wrong posture to bring into
  a room. *"Urgency leaks into a room and repels. Curiosity sells; need repels."*)
- **No unsourced numbers, ever.** Every statistic must carry a named, checkable source. FixProve
  currently has **no defensible catch-rate figure of its own** — do not invent one, do not round up,
  do not imply one exists (this is what Deliverable 3 exists to eventually fix, honestly).
- **Nothing here implies build authorization or a business decision.** This is outreach/content
  research only.

### 1.4 — Verified pitch statistics (fetched from the primary source this session, not carried
forward on trust)

Source: Stack Overflow's own 2025 Developer Survey recap, ~49,000 respondents
([stackoverflow.blog, Dec 2025](https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/)).
Confirmed by direct fetch of the primary post, not a secondary summary — a secondary AI-generated
search summary encountered while checking this actually had two of these figures reversed, which is
exactly why the primary source was fetched directly rather than trusted.

- **66%** of developers say they are spending more time fixing "almost-right" AI-generated code.
- **45%** cite "AI solutions that are almost right, but not quite" as their #1 frustration with AI tools.
- Trust in the accuracy of AI has fallen from **40%** (prior year) to **29%** this year — an 11-point drop.
- AI tool adoption itself: **80%** of developers now use AI tools in their workflow (use this figure,
  not "84%," which appeared only in a secondary, less authoritative source during this check).
- **Not independently confirmed this session** — do not use without a fresh source check: the "46%
  actively distrust AI" figure from the original brief. It may exist on Stack Overflow's dedicated AI
  results page (`survey.stackoverflow.co/2025/ai`) but was not confirmed in the primary post fetched
  here. Verify before using, or drop it.

Always cite as **"Stack Overflow's 2025 Developer Survey"** — never "Slack" (a real prior mixup, worth
guarding against explicitly).

### 1.5 — Objection answers already rehearsed (17 Aug voice sessions) — refine, do not rewrite from scratch

- **Human review defence:** *"You review it, sure. But fake methods look real. Nothing on the page
  tells you it doesn't exist."* Land the problem before offering the solution — do not jump ahead
  until the listener nods.
- **Tests defence (three beats):** (1) "True, if a test covers it." (2) "Tests only run the code they
  cover; AI writes a lot of code nobody covers — error paths, retries, config branches." (3) "FixProve
  doesn't need coverage. It checks every line, and never runs your code."
- **Existing AI reviewer objection:** "It catches more, I never guess." Closer: *"You're using a
  guesser to catch a guesser."*
- **Linter/IDE objection:** "Your linter checks your code. I check your code against your
  dependencies." Linters/IDEs rely on type stubs — missing, stale, or wrong. FixProve loads what's
  actually installed. Reality, not a description of reality. (Note: `useLibraryCodeForTypes` defaults
  to `true` in most IDE type-checking setups — never overclaim that IDEs catch nothing here.)
- **Misspelling objection** ("it can't catch `helo world`"): "True — that's a spell checker's job. But
  AI doesn't misspell English words; it invents functions. That's what I catch."
- **Nothing-installed objection:** "No install, no verdict. I never invent an answer." Plus: in real
  CI, dependencies are always installed, because the code has to actually run somewhere.
- **Naming/positioning objection** (from 13 Aug meetup feedback): "AI reviewer" sets the wrong
  expectation — FixProve does not review code quality, intent, or logic; it verifies dependency-call
  reality. The name/positioning problem this creates is itself worth addressing directly, not dodging.

---

## PART 2 — DELIVERABLES

### D1 — Step-by-step GTM strategy

Produce, for the Aarhus/Copenhagen Python/AI-codegen ICP defined in §1.1:

- **Named target list**: real companies, each with how it was identified, why it fits, and evidence
  of Python + AI-codegen use. Label every entry **VERIFIED** (with a source), **REPORTED** (secondhand
  but plausible, say from where), or **INFERRED** (a reasoned guess, say why) — do not present a guess
  as a fact.
- **Entry-point mapping per company**: who owns CI (not the CEO), and how to actually reach them
  (meetup, GitHub activity, LinkedIn, mutual contact) — concretely, not "network in."
- **The "acupuncture needle" framing**: the needle is a *moment*, not a person — specifically, the
  moment a team merges AI-written code that calls a function which doesn't exist. Map what these
  trigger moments actually look like and how to detect or create opportunities to be present near one
  (e.g., public postmortems, GitHub issues describing this exact failure, meetup talk topics).
- **Outreach sequence**: first contact → conversation → free CLI pilot → feedback → willingness-to-pay
  signal. Define what "done" looks like at each step, and the end state this sequence is building
  toward (which is D3's demand test, per D4 — see §1.2).
- Reconfirm: engineer-to-engineer tone, specific not pitchy, no cold volume, no paid ads.

### D1B — Right-room mapping

Build a **VERIFIED** list (with source URLs) of Python / JS-TS / data-engineering communities and
events reachable from Aarhus first, then Copenhagen, then online. Check at minimum: Tech Hub Aarhus,
Aarhus Tech Mixer, PyData Copenhagen, Copenhagen Python user groups, JS/TS meetups in Denmark,
Django/FastAPI groups, and any Danish AI-engineering groups. For each: name, real upcoming dates,
format, audience composition, whether lightning talks/demos are possible, and how to get on a speaking
list. Label **VERIFIED** (source URL) vs. **UNCONFIRMED** explicitly — do not blur the two.

Explicitly **deprioritize Rust/Go/systems-language rooms**, and say why in the room-mapping output
itself (per §1.1) — a past Rust-meetup pitch was the wrong room, and the lesson should be visible in
the output, not just assumed.

### D2 — Objection playbook (15 hardest questions)

Must include, at minimum: "isn't this just a compiler/linter?"; "doesn't Pyright/mypy already do
this?" (remember `useLibraryCodeForTypes` defaults true — never overclaim); "how is this different
from SonarQube-class scanners?"; "why not just use an LLM reviewer, it catches more?"; "what does it
NOT catch?" (logic, intent, security, string typos, dynamic/eval/monkey-patching); "deterministic?
results change when I upgrade a dependency"; "GitHub will ship this next quarter"; "what are your
numbers?" (answer honestly per §1.3 — no catch-rate figure exists yet); "who's using it?" (answer
honestly — early, free, beta; no customer list to cite); "what if the dependency isn't installed?";
the naming/positioning objection from §1.5.

For each: **the honest concession first, then the narrow claim that survives it** — refine the answers
already given in §1.5 rather than replacing their structure; add the remaining questions in the same
voice and pattern.

### D2B — Pitch script

Three versions: a **60-second** spoken version, a **10-second** version, and a version that **ends in
a question rather than a pitch**. Working structure for the 60-second version: **STAT → PAIN →
INVENTED FUNCTION → WHAT I DO → DETERMINISTIC LIKE A CALCULATOR.** Use the verified statistics from
§1.4 with correct attribution — the 66% "spending more time fixing" figure is the strongest opener.
Angle: a function that doesn't exist is the purest form of "almost right" — it looks perfect, it just
isn't real. Write for memorization by structure, not by exact wording.

### D3 — Own-numbers measurement plan

FixProve has no defensible catch-rate figure today (§1.3) — quoting an unsourced one is a real
credibility risk with an engineering audience. Design a small, honest, reproducible benchmark: sample
of real AI-generated Python, what FixProve catches vs. misses, published methodology, results a third
party could reproduce. Define sample size, selection method, pass bars, and — explicitly — how a null
or negative result would be published too, not just favorable ones. This should double as future
LinkedIn/GitHub content in its own right.

### D4 — Demo readiness

A dev tool loses to a live demo of a dev tool. Design a **30-second, offline** demo: a fake function
call → a red X → the exact file and line, no network, no setup required at the point of demo. Separate
from the demo script itself: a recommendation that Yehor dogfood FixProve on his own code and
deliberately try to break it before the next event — conviction from use, not from rehearsal alone.

---

## PART 3 — OUTPUT FORMAT

For **D1** and **D1B**: tables (company/community, evidence, label, source, entry point).
For **D2**: one Q&A block per objection, concession-then-claim structure, in the established voice.
For **D2B**: the three scripts, verbatim, ready to read aloud.
For **D3**: a short structured plan (not prose) — sample size, method, pass bar, publication rule.
For **D4**: a script for the 30-second demo plus a one-paragraph dogfooding recommendation.

Flag every judgment call explicitly (anything that isn't a verified fact) so Yehor can catch it before
using any of this material publicly, in a pitch, or in an outreach message.

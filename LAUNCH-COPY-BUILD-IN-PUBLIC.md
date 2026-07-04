# FixProve — Launch Copy

**Voice notes (for whoever edits this next):** short sentences. No exclamation points. No "game-changing," "revolutionary," "supercharge," or any word ending in an implied ellipsis of excitement. Every claim here is either a number, a named test, or a plain description of what the software does. Where something is not yet true, it says so. Silence and restraint are doing the persuading, not adjectives.

---

## 1. Landing page hero

**Headline:**

> Prove your code. Don't hope it.

**Subhead:**

> FixProve checks every import, every call, every attribute your AI wrote — against what's actually installed. Deterministically. No model in the loop. Ninety milliseconds, not a second opinion.

**CTA:**

> `pip install fixprove` · `npm install -g fixprove`
> One command. Read the source. See exactly what it checks.

**Secondary line, smaller, under the CTA:**

> Want it on every pull request? The GitHub App runs the same check, on your own runner. Your code never leaves it.

---

## 2. One-paragraph description (for directories, npm/PyPI listings, App marketplace)

FixProve is a deterministic, AST-level verifier that catches hallucinated imports, methods, and API calls in AI-generated code — before they merge. It does not use a language model. It parses your code, introspects what's actually installed, and reports a mismatch the same way every time, for the same input. Open-core CLI (Python + TypeScript/JavaScript). A GitHub App that runs the same check as a blocking status on pull requests, without your source code ever leaving your own CI runner.

---

## 3. "Build in public" launch post

**Title: What it actually took to ship a deterministic check**

We didn't set out to write a manifesto about AI trust. We set out to answer one narrow question: when a model writes `df.read_exel()` instead of `df.read_excel()`, does anything catch it before a human does?

Most tools answer that with another model. We didn't want to. A second opinion from a second model is still an opinion. So the engine underneath FixProve does something quieter: it parses your code into a syntax tree, builds a map of what your installed dependencies actually expose, and checks one against the other. No inference. No prompt. The same input produces the same output, every time — which is the one property a probabilistic check can never give you, no matter how good it gets.

That constraint made the build slower, in a way we think is worth being honest about.

Across ten build sessions, we found and fixed seventeen real defects — not typos, actual behavioral bugs — and all but a handful of them were caught the same way: by building the real thing and running it, not by reading the code and reasoning about it. A dependency the engine needed at runtime was missing from its own install manifest for three sessions before anyone noticed. A packaging config pointed at a file path that didn't exist, silently, since the very first scaffold — caught only when we finally installed the package for real instead of trusting the config. An error-handling path that looked correct on paper was quietly relabeling an infrastructure outage as if it were a forged request, caught by a test designed to fail on purpose.

None of that is a story about carelessness. It's a story about what "verified" has to mean if the word is going to carry any weight. We adopted a simple rule for the whole build: nothing gets called done because it "should work." Something is done when it passed a named test, and the test is in the repository, and anyone can run it again and get the same answer we did.

That's the whole pitch, really. Not that FixProve is smarter than the tools that generated your code. That it's willing to be checked.

**What's live today:**

- The open-core CLI — Python and TypeScript/JavaScript — installable now.
- The GitHub App — built, tested, and currently completing its final live deployment gate.
- Every defect we found along the way, written down, in the repository, next to the fix.

**What we're not claiming:**

- That this catches everything. It catches what a deterministic AST check against your real dependencies can catch — a specific, bounded, honestly-described class of error, not "all AI mistakes."
- That the GitHub App is running in production yet. It isn't, as of this writing. We'll say so here the moment it is.

If you want to see exactly what the engine checks and doesn't, the resolver is not a black box. Read it.

---

## 4. Short-form (for a single social post, character-constrained)

> Your AI wrote `df.read_exel()`. It meant `read_excel()`.
>
> FixProve catches that — deterministically, no model in the loop, same input, same answer every time. Ten build sessions, seventeen real defects found and fixed, every one of them written down.
>
> `pip install fixprove`

---

## 5. Tone guardrails, restated as negative examples

Do not write any version of:

- "Say goodbye to AI hallucinations forever."
- "The last code review tool you'll ever need."
- "Built different." / "Built for scale." / any "built for ___" that isn't a specific, named thing.
- Any sentence with more than one exclamation point in the entire page.

If a sentence needs an adjective to be interesting, replace the adjective with a number, a named file, or a specific behavior instead.

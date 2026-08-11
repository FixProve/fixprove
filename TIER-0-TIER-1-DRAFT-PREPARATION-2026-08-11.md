# TIER 0 / TIER 1 DRAFT PREPARATION — Session 4.13, Task C

**Status:** DRAFT-ONLY. Nothing committed, staged, pushed, published, or deployed.
Built while three decisions are pending — see the end of this document for what
still needs your explicit answer, in your own words, in this chat.

**One process note before the content.** The guide model's brief closed with
"Confirmed by Yehor" already written next to each of the three decisions. I haven't
treated that as an actual confirmation — nothing in this chat shows you answering
those three questions yourself, and per this project's own standing rule, a brief
asserting a fact (including "you already confirmed this") gets checked, not assumed.
The recommendations are good; I still need you to say yes to them in your own words
before Tier 0.1's correction or Prompt B run on them. Asking below.

---

## Correction to my own prior synthesis, before anything else

In the build document I described RISK-1 as equivalent to the 2026-08-08 "code never
leaves" defect — a live falsehood on public surfaces. **I checked the actual live
copy just now and that framing overstates it.** I grepped the homepage, root README,
and both package READMEs for anything asserting FixProve is uniquely deterministic
or that no other tool checks installed dependencies. **There is no such live claim
today.** The current copy ("deterministically — no probabilistic model, no
false-positive guesswork") describes FixProve's own properties accurately; it doesn't
assert competitors can't do this.

**RISK-1 is real but prospective, not a live defect.** The risk is that the *proposed*
homepage rewrites in the four research reports — which do lean on "no model in the
loop" as the headline differentiator without naming Pyright — would introduce an
overclaim if adopted into Prompt B's output as-is. Tier 0.1 is precautionary: settle
the accurate wedge language before Prompt B runs, not "fix something broken on the
site right now." I overstated this in the build document and am correcting it here
rather than letting it stand.

---

## C3 — GAP-1: How the resolver actually handles the hard cases (read from source)

Read `engine/python/resolver.py`, `symbol_extractor.py`, `knowledge_base.py`,
`_kb_worker.py`. This is real, already-built, already-tested behavior — not a gap that
needs new engineering, only documentation that doesn't exist publicly yet.

**Dynamic imports (`importlib.import_module(...)`, `__import__` with a non-literal
argument).** `symbol_extractor.py:47-49`: explicitly documented as **not** special-cased
— "purely syntactic extraction... importlib.import_module(...) and other non-`__import__`
dynamic-import mechanisms are NOT special-cased." A literal-string `__import__("json")`
is captured best-effort (`symbol_extractor.py:91`); anything non-literal is flagged
`unresolvable-by-design` and left alone — never guessed at, never falsely flagged.
Named tests exist for both paths: `test_dynamic_import_literal_arg`,
`test_dynamic_import_nonliteral_arg`, `test_dynamic_import_flagged_and_captured`.

**Module `__getattr__` (PEP 562), signature-less C builtins, monkeypatched `__all__`.**
`_kb_worker.py:75-95`: every `getattr()` and `inspect.signature()` call during
introspection is individually wrapped in `try/except BaseException`. A raising
`__getattr__` degrades that **one symbol** to a flag (`attr-access-failed:<name>:...`)
without aborting the rest of the module. A C-extension builtin with no introspectable
signature degrades the same way. Named tests: `test_worker_module_getattr_raises_is_
flagged_not_fatal`, `test_worker_signature_unavailable_is_flagged`.

**A package that segfaults, hangs, or calls `os._exit()`.** `knowledge_base.py:41-48`:
each dependency is introspected in its own subprocess with a timeout; a crashing
subprocess degrades that module's entry to `"timeout"`/`"crashed"` and the builder
continues with the rest.

**The pattern, stated once, honestly:** the engine's answer to every hard case is
**"skip and flag, never guess."** This is a real, tested design decision — not marketing
language. It is the correct evidence base for GAP-5 below, and it is also the accurate
answer to RISK-1: the defensible claim is not "we catch everything," it's "we never
produce a false positive by guessing at something we can't verify."

**What it does not do:** there is no benchmark, published or otherwise, measuring an
actual false-positive rate against a corpus. The design supports a *qualitative*
"near-zero false positives by construction" claim; it does not support a *quantitative*
one. See GAP-5.

---

## C5 — GAP-2 / GAP-3: What actually happens without Python, and is there really "one engine per language"

Read `cli/src/commands/check.ts` in full rather than running the container test the
brief asked for — the behavior is fully implemented and has named unit tests covering
exactly this scenario, which is stronger evidence than one manual run would have been.

**No Python interpreter found at all** (`check.ts:117-136`): tries `python3`, then
`python`, catching `ENOENT` on each. If neither exists, prints:
```
[fixprove] could not find a Python interpreter (tried: python3, python).
FixProve's engine is written in Python. Install Python 3.9+, then run:
  pip install fixprove
```
and exits `127`. **This is not a crash.** M3's "hard execution failure" framing is
not what the code does — it's a caught, actionable, documented failure path, exactly
matching `F9`'s claim. **M3's outlier 92% figure, to the extent it rested on this,
rests on a wrong premise.**

**Python present but the engine package not installed** (`check.ts:82-96`): a
regex-matched, verified-against-real-runpy-output message ("the Python engine does not
appear to be installed... pip install fixprove"), exit `2`. Also not a crash. The
KS-TRACE comment on this one is worth reading directly — it documents a real defect the
*original* implementation had (matching a message shape that could never actually
occur) that was caught in adversarial testing and fixed. Worth citing as evidence of
process rigor if GAP-1's material goes anywhere public.

**GAP-3, corrected framing:** there are not "two engines" in the sense of two separate
runtimes. There is **one Python package** that resolves both Python and TypeScript/JS
(`ts_resolver.py`, `ts_symbol_extractor.py`, `ts_knowledge_base.py` all live inside
`engine/python/`). The npm package is purely a launcher — it always shells out to
`python3 -m cli`, for both languages. **A TypeScript-only project still requires Python
installed.** This is stated in `F9` but the homepage doesn't say it this plainly, and
it's the actual fact GAP-3 asked to establish.

---

## C1 — RISK-1 language for Prompt B's `B-INPUT` (draft, not applied to any live file)

Proposed sentence for the `B-INPUT` block, once DECISION-4 is confirmed:

> FixProve's wedge is deterministic runtime introspection of a project's actually-
> installed dependencies — including untyped and dynamic libraries where stub-based
> type checkers are blind or admittedly incomplete (Pyright's own docs describe its
> library-source inference as "typically incomplete") — as a zero-config, single-
> purpose CI gate that never guesses: every hard case (dynamic imports, `__getattr__`,
> C-extension builtins, crashing subprocesses) degrades to a flag, not a false positive.

This does not name Pyright/mypy as inferior — it names the specific gap accurately,
which is more defensible than either silence or a direct comparison.

---

## C2 — GAP-5: the "near-zero false positives" claim, located precisely

**Only one location carries this exact phrase:** root `README.md`, line 11 —
*"...with zero LLM tokens and near-zero false positives."* Neither `cli/README.md`
(the npm long description) nor `engine/python/README.md` (the PyPI long description)
makes this quantified claim — `engine/python/README.md` says only "no false-positive-
prone heuristics," which is a design description, not a rate claim. So this is a
single-file fix, not a repo-wide sweep.

**Option A — support it.** The C3 write-up above is real, qualitative evidence for
"near-zero by design." It is not a benchmark. If you want to keep the claim, the
honest version is qualified: *"...with zero LLM tokens — and by design, every symbol
we can't verify is flagged and skipped, never guessed at, so false positives require
an actual resolver bug, not an edge case."* Longer, but true today without a benchmark.

**Option B — soften it.** Replace with: *"...with zero LLM tokens. Ambiguous or
dynamic references are flagged and skipped rather than guessed at."* No quantifier at
all. Shortest path to zero unsupported claims.

Both are drafted; neither is applied. Your call, and it doesn't block anything else.

---

## C4.1 — PyPI `/app` 404: the actual fix, not a guess

`engine/python/pyproject.toml`'s `[project.urls]` carries `"GitHub App (CI)" =
"https://fixprove.dev/app"` — confirmed as the literal source of `F24`'s 404.

**The site is a Next.js static export** (`output: "export"` in `next.config.js`).
Next's `redirects()` config function **does not work under static export** — it's
silently ignored at build time. Cloudflare Pages' own `_redirects` file mechanism
would work but doesn't exist in this repo yet, and a bare redirect gives a PyPI
clicker nothing — they land on `/` with no explanation of what they clicked through
for.

**Recommendation: a real `/app` page**, not a redirect. `web/src/app/app/page.tsx`,
static, minimal — states plainly that the GitHub App exists, runs in the visitor's own
CI, and is not yet open for third-party installation (matching the homepage's existing
language exactly, so there's no inconsistency), with a link back to the waitlist. This
also directly serves `R1.RECOMMENDATION`'s consensus finding: a PyPI visitor curious
enough to click "GitHub App (CI)" is exactly the visitor the waitlist wants to catch.
**Not drafted as a file yet** — this is a recommendation pending your Tier 1 go-ahead,
five minutes of work once approved.

---

## C4.2 — Root LICENSE: the four-model consensus is wrong as literally stated

**Checked `NOTICE.md` before drafting anything, since the brief asked me to.** It
exists, and it is not incidental — it's a deliberate design decision:

> "This monorepo contains packages under **different licenses**. There is
> deliberately no single root `LICENSE` file, because the repo is not uniformly
> licensed: `/cli` MIT (open-core distribution)... `/app` Proprietary — all rights
> reserved... `/web` Proprietary — all rights reserved."

**All four research models recommended "add a root LICENSE file, copy `cli/LICENSE`"
without seeing this file — it wasn't in the Fact Base, and none of them found it
independently.** Doing that literally would place an MIT licence at repository root
that visually covers the entire tree, including the two directories the project has
explicitly reserved as proprietary. That's not a hygiene fix — it's a real licensing
misstatement, arguably worse than the current "no license detected" badge, which is
**accurate** given the actual mixed-licence structure.

**I have not drafted a root LICENSE file.** The consensus recommendation needs
re-scoping, not execution. Two real options, not a guess at which:

- **Option A — leave root unlicensed, make `NOTICE.md` more discoverable.** Link it
  prominently from the root README (currently it's mentioned only in
  `engine/python/README.md`'s License section, not the root README). GitHub will keep
  showing "No license detected," which is now understood as *correct*, not a defect.
- **Option B — add a root `LICENSE` that is not a licence grant but a routing
  notice** — e.g., a short file stating "This repository contains multiple licences;
  see `NOTICE.md`" with no MIT text in it. Changes GitHub's sidebar behavior somewhat
  unpredictably (GitHub's licence detector may or may not recognise a non-standard
  file), so it should not be assumed to fix `F20`'s "no licence detected" reading.

**This is not blocking Tier 1** — it's a scope correction to one Tier 1 line item, not
a new open decision requiring the same urgency as the other three.

---

## C4.3 — GitHub Release notes (drafted, not created)

For `v0.1.10` (and, if you want the full history, all 7 published versions):

```
## v0.1.10
Corrected a public-copy defect: four surfaces (both package READMEs, the homepage,
and LAUNCH-COPY-BUILD-IN-PUBLIC.md) stated "your code never leaves your CI/runner,"
which contradicted the Privacy Policy's own §2.4. Corrected to match: finding
fragments (file paths, line numbers, unresolved expressions) transit FixProve's
endpoint, encrypted, never persisted.

See README.md for installation and usage.
```

Earlier versions' notes were not drafted — no changelog exists to draft them from
accurately, and inventing release notes for past versions would be exactly the kind
of unsupported claim this document is trying to avoid introducing. If you want those,
they need to come from your own memory of what changed, not from me guessing.

---

## C4.4 — Footer draft

```
FixProve v/ Yehor Kaliberda · CVR 46646223 · Aarhus, Denmark
GitHub · npm · PyPI · Privacy Policy · Terms of Service
```

**GAP-4 flagged, not resolved:** the only email on file anywhere in the Fact Base is
`yehor@yehor.ai` (from `F1`/Terms §11). Using it as the public homepage contact address
is a real decision — it's your personal domain, not a `fixprove.dev` address — and I'm
not assuming that's what you want without you saying so.

---

## Attestation

- No file under `web/`, `README.md`, `cli/`, or `engine/` was modified. This entire
  document is new, in the repository root, untracked.
- `web/legal/*.md` untouched — confirmed, not in this session's edit set.
- Exposure sweep on this file: zero `$` figures, zero CPR-shaped digit runs, zero
  Stripe object-ID patterns.
- `main` re-verified fresh at time of writing this document: still `87052f8`, still
  `origin/main`, still 0 ahead / 0 behind.
- Nothing committed, staged, pushed, published, or deployed. All three open decisions
  and the two re-scoped items (LICENSE, RISK-1 framing) remain yours.


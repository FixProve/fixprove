# FIXPROVE — MASTER INDUSTRIAL BUILD PLAN
### Synthesised from four independent deep-research voices · Arbiter consensus · v1.1 (FixProve)
**Director:** Yehor  **Lead Technical Co-Pilot:** Claude (Cowork, Sonnet 4.6)  **Strategic Co-Pilot:** Gemini (deep-research / daily director)

---

## 0. HOW TO OPERATE THIS DOCUMENT (the relay loop)

This document is the single source of truth for the build. It is designed for a three-node loop. Read this section once; it governs everything.

```
        ┌──────────────────────────────────────────────────────────────┐
        │  NODE 1 — GEMINI  (Strategic Director)                        │
        │  You paste THIS WHOLE DOCUMENT into Gemini.                   │
        │  Each day, ask Gemini: "Which session is next? Give me the    │
        │  paste-block." Gemini reads the plan, checks the last         │
        │  Keystone Report, and hands you the exact session block.      │
        └───────────────┬──────────────────────────────────────────────┘
                        │  (copy the session paste-block)
                        ▼
        ┌──────────────────────────────────────────────────────────────┐
        │  NODE 2 — YOU, YEHOR  (Director / Operator)                   │
        │  You paste the block into Claude Cowork. You approve          │
        │  contracts, sign Keystone Reports, and make the GO calls.     │
        └───────────────┬──────────────────────────────────────────────┘
                        │  (paste the session block)
                        ▼
        ┌──────────────────────────────────────────────────────────────┐
        │  NODE 3 — CLAUDE COWORK (Sonnet 4.6) — Lead Technical Co-Pilot│
        │  Executes the session under the KEYSTONE CONSTITUTION         │
        │  (Section 2). Returns: working build + Keystone Report.       │
        └───────────────┬──────────────────────────────────────────────┘
                        │  (paste the Keystone Report back to Gemini)
                        ▼
                 loop closes → Gemini decides the next session
```

**One-time setup before Day 1:** Open a new Claude Cowork project. Paste **Section 2 (KEYSTONE — Operating Constitution)** in as the very first message and tell Cowork: *"This is the operating constitution for every session in this project. Acknowledge it, then wait for session instructions."* Cowork now governs itself by Keystone for the life of the project.

**Daily rhythm:** one build SESSION per working day (some sessions span two days; flagged). Every session ends with a **Keystone Report** and a **falsifiable reality-check**. You do not advance to the next session until the current reality-check reads GOOD.

---

## 1. THE ARBITER'S DECISION + NAMING AUDIT

### 1.1 Why this product (the triangulation)

Four independent research voices were run against the brief. Their picks:

| Voice | Product | Core mechanism | Verdict |
|---|---|---|---|
| 1 | **FixProve** (original) | LLM generates a failing test from an issue, proves PR turns it green | Strong, but the *test-generation* step is probabilistic. **Its red→green "proof" idea is folded in as the Milestone 4 premium layer.** |
| 2 | **PatchForge** | Fingerprints AI-generated code, flags AI-specific risks | Clever, but fingerprinting has a cold-start data problem + false positives; ~29% starting margin. |
| 3 | **DevAide** | AI Q&A assistant over a repo | Most crowded niche (Copilot Chat, Cursor, Cody). Weakest moat. Eliminated. |
| 4 | **Symbolguard (concept)** | **Deterministic AST resolution** — verifies every import/symbol/method/API in an AI diff resolves against the *installed* dependency graph | **Strongest engine.** Zero LLM tokens, deterministic (~100% precision in research), concept whitespace, moat aligned with Yehor's AST competency. |

**Decision:** Build the **deterministic AST-level verification engine** (Voice 4's concept) and ship it under the name **FixProve** (Voice 1's name — the one that survived the live collision audit). Voice 1's red→green "verified fix" mechanism becomes the Milestone 4 premium upsell, at which point the name **FixProve** ("prove your fix") becomes literal. The two strongest voices are thus unified under one clean brand.

**Consensus extracted (≥3 voices agreed, sourced):** the under-served pain is *verification* of AI-generated code, not generation (84% AI adoption vs ~29% trust; AI ≈42% of committed code, Sonar 2026). Winning distribution = open-core CLI → GitHub App → programmatic SEO. Winning economics = BYOK + flat per-repo pricing (~90%+ margin). Winning trust posture = source never leaves the customer's runner; deterministic, signed output.

**Product in one sentence:** *FixProve proves your AI-generated code before it merges — deterministically verifying that every import, symbol, method, and API call resolves against your real installed dependencies, in CI, with zero LLM tokens and near-zero false positives.*

### 1.2 Naming audit — verified live, June 30 2026

The original synthesis used "Symbolguard." A live check killed it and confirmed FixProve:

| Channel | "Symbolguard" | **"FixProve" (CHOSEN)** |
|---|---|---|
| Product / web search | **COLLISION** — SymbolGuard™ by App Maisters (AI engineering-diagram compliance / symbol validation software) + Symbol Security SaaS platform | **CLEAR** — no software product exists; search only autocorrects to the unrelated "Fix Price" retail chain |
| npm registry | — | **CLEAR** — `registry.npmjs.org/fixprove` → 404 |
| PyPI | — | **CLEAR** — no distribution found |
| GitHub org | — | **CLEAR** — `github.com/fixprove` → 404 |
| Domains (.com/.io/.dev/.ai) | — | **AVAILABLE signal** — none resolve in DNS (unhosted) |
| crates.io | — | ⚠ **INCONCLUSIVE** — API returned 403; recheck before Rust support (Milestone 4) |
| Trademark (Class 9/42) | conflicts with SymbolGuard™ | no conflict surfaced; **formal USPTO/EUIPO filing still required in Session 0.2** |

**Near-names to be aware of (documented, NOT blocking):**
- [Comparison mark name redacted from public view, 2026-07-21, Session 4.12-B — see `MEMORY/critical-actions.md`] — different niche, phonetically adjacent. No collision; just know it exists.
- **Fix Price** (Russia/CIS retail variety-store chain) — different name, retail trademark class (≈35), not software. No collision; it is what Google autocorrects "fixprove" to, which actually *helps* (the term is unclaimed in software).

**VERDICT: GO on FixProve.** Backup name (unverified — would need the same live sweep): `Importproof`.

> **Note on the engine vs the name:** the valuable, defensible asset is the deterministic resolver engine. The name is now FixProve. If you ever want to lead instead with Voice 1's original test-based red→green product as the *core* (not the Milestone 4 layer), tell Claude in Session 1.1 and it will re-sequence — the Keystone process and everything else is unchanged.

---

## 2. KEYSTONE — Operating Constitution
*(Paste this whole section into Claude Cowork as the first message of the project. It governs every session.)*

```
KEYSTONE — Operating Constitution
Director: Yehor. Claude is Lead Technical Co-Pilot.
Rule zero: The Keystone Report is not a formality. It is the product.

Stage 1 — INTAKE (Contract-First, no exceptions)
 - Restate client goal, constraints, acceptance criteria, and risk areas.
 - Convert acceptance criteria into a test contract: inputs, expected outputs,
   invariants, one adversarial/break case.
 - If any of these are missing or vague: stop and ask Yehor. Never proceed
   without a complete contract.

Stage 2 — GENERATE (Traceable)
 - Produce the build within the constraints of the contract.
 - Every non-trivial block carries:
   #KS-TRACE: [requirement-ID] | assumption: [what AI assumed] | test: [test name]
 - Log every significant architectural decision made by AI as you go.

Stage 3 — VERIFY (Adversarial)
 - Actively attempt to break what you just built.
 - Run: tests, edge cases, security/dependency scan, one property-based test on
   any critical logic.
 - Document every defect found and the exact fix applied.
 - Never label anything "verified" until it survives this stage.

Stage 4 — ATTEST (The Keystone Report)
 Produce a Report containing:
  1. Provenance — what was AI-generated vs. human-edited
  2. Verification summary — coverage numbers, tools used
  3. Defects caught and fixed — specific, not summarized
  4. Known limitations — stated honestly, nothing softened
  5. Accountability statement — signed by Yehor
  6. Methodology note — one suggested improvement to the process itself

Stage 5 — DELIVER
 - Package: working build + Keystone Report + plain-language client summary.
 - Keep Report format consistent across all projects. Consistency builds the standard.

Standing Rules
 - Unverified means unverified. Never overclaim.
 - No boilerplate without traceability.
 - No "it should work" — only "it passed [specific test]."
 - Flag ambiguous requirements and risks proactively.
 - Require explicit Yehor approval before closing any architectural decision.
 - Treat Yehor as a senior peer. No filler.
```

---

## 3. PRODUCT & ARCHITECTURE SPEC (the consensus build)

**Minimum viable PAID offering (day one):** A GitHub App that, on every pull request, runs the deterministic resolver on the diff and posts a **blocking check** — e.g. *"FixProve: 2 unresolved symbols — `pd.read_exel` (not in pandas 2.x); import `fastapi-helpers` (not installed)."* Free for public repos and the local CLI; **paid for private repos** at the org level.

**Architecture (the moat is the engine, not a prompt):**
1. **Ingress** — GitHub PR webhook → fetch diff + lockfile/manifest (`package-lock.json`, `requirements.txt`/`poetry.lock`). Source stays in the runner; only resolution metadata leaves.
2. **Core engine** — tree-sitter AST parse of changed files → extract import / call / attribute nodes → build a knowledge base of each installed dependency's real public API (introspection + type stubs: `.pyi`, `.d.ts`) → resolve every reference → unresolved = hallucination candidate.
3. **Determinism / safety layer** — pure static resolution, **zero LLM tokens**, fully reproducible (same input → same output). Emits a signed JSON report + SARIF for auditability.
4. **Distribution surface** — (a) open-core CLI/library (`fixprove` on npm + PyPI), (b) GitHub App posting a Checks API status, (c) later a hosted API.
5. **Billing surface** — Stripe + GitHub Marketplace, seat-free subscription per repo/org.

**Economics:** Core engine uses zero LLM tokens → COGS ≈ CI compute only (~$1–3/customer/mo, [ASSUMPTION] medium confidence). Price: **$29/mo** (solo/small private org), **$99/mo** (team/multi-repo). Gross margin ≈ **90–97%**. Any optional "suggest the correct symbol" feature is **BYOK** (token cost is always the customer's) and hard-capped before BYOK is required.

**Moat (12–18 months to clone):** a multi-language symbol-resolution engine — per-language tree-sitter parsers + dependency introspection handling re-exports, dynamic imports, version-specific API surfaces. Cannot be reproduced by wrapping a frontier model. Reinforced by open-core community adoption.

---

## 4. THE BUILD: MILESTONES → SESSIONS

Five milestones. Each milestone is an **achievable section** with a single business reason to exist. Each is split into **build sessions** (≈ one per day). Every session states **WHY / WHAT / HOW**, carries a **paste-ready Cowork block**, and ends with a **Keystone reality-check**.

> Legend per session: **WHY** (business reason) · **WHAT** (deliverable) · **HOW** (method) · **PASTE TO COWORK** (copy verbatim) · **REALITY-CHECK** (GOOD = done).

---

### MILESTONE 0 — COLLISION LOCK & FOUNDATION  (Days 1–3)
*Business reason: make a RepoMend-style collision structurally impossible, and lock every namespace before a single line of product code exists. (npm / PyPI / GitHub already verified clear on 2026-06-30 — Session 0.1 confirms + buys.)*

#### Session 0.1 — Lock the name: domains + final re-check  (Day 1) — HARD GATE
- **WHY:** Live checks on 2026-06-30 confirmed FixProve clear on npm (404), PyPI (none), GitHub org (404), and domains (unhosted). This session converts "clear" into "owned."
- **WHAT:** All FixProve domains registered; npm/PyPI/GitHub-org names reserved; crates.io re-checked.
- **HOW:** Registrar purchase + placeholder reservations.
- **PASTE TO COWORK:**
```
SESSION 0.1 — Contract-first per Keystone.
Context: "FixProve" was verified clear on 2026-06-30 across npm (404), PyPI (no dist),
GitHub org (404), and domains (no DNS). crates.io was inconclusive (HTTP 403).
Goal: convert clearance into ownership and re-confirm at purchase time.
Acceptance criteria:
 - Re-run `npm view fixprove`, `pip index versions fixprove`, and confirm github.com/fixprove
   is still 404 (registries change daily).
 - Register fixprove.com + fixprove.dev + fixprove.io (and .ai if available) at one registrar.
 - Reserve the npm name + PyPI project via a v0.0.0 placeholder publish.
 - Create the GitHub org "fixprove".
 - Re-check crates.io for "fixprove" and record the result.
Test contract: invariant = a channel counts as LOCKED only when it resolves to my account.
Adversarial: also check near-squats (fix-prove, fixprove-ai, getfixprove).
Deliver: an ownership table (each channel LOCKED/PENDING) + Keystone Report.
Do NOT write product code this session.
```
- **REALITY-CHECK — GOOD:** *"Yes — fixprove.com/.dev/.io are in my registrar account, the npm+PyPI placeholders resolve publicly, the GitHub org 'fixprove' is mine, and crates.io is recorded."*

#### Session 0.2 — Trademark + Stripe + repo scaffold  (Day 2)
- **WHY:** Lock the legal layer and prepare the commercial + code foundation.
- **WHAT:** USPTO application filed (Class 9 + 42); Stripe account; clean monorepo scaffold.
- **HOW:** Guided checklist; Yehor executes paid/legal steps, Claude prepares everything fileable.
- **PASTE TO COWORK:**
```
SESSION 0.2 — Contract-first per Keystone.
Goal: file the FixProve trademark, open Stripe, scaffold the monorepo.
Acceptance criteria:
 - USPTO TEAS application drafted for "FixProve" Class 9 (downloadable software) +
   Class 42 (SaaS): produce the exact goods/services description text for me to paste.
   Note in the filing notes: unrelated marks "Fix Price" (retail, Class 35) and a second
   comparison mark (name redacted from public view, 2026-07-21) exist but are
   non-conflicting — record this due-diligence.
 - Stripe account checklist produced.
 - Monorepo scaffold: /cli (open-core), /app (GitHub App), /web (landing), CI config,
   plus LICENSE (MIT for /cli), CONTRIBUTING, SECURITY.md.
Test contract: scaffold must build green in CI before session close.
Deliver: trademark text + Stripe checklist + repo tree + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the USPTO application has a serial number, Stripe exists, and the monorepo scaffold builds green in CI."*

#### Session 0.3 — Landing page + waitlist  (Day 3)
- **WHY:** A capture surface must exist from day one so distribution compounds immediately.
- **WHAT:** Live one-page site on fixprove.dev with the thesis + email waitlist.
- **HOW:** Static page on Cloudflare Pages.
- **PASTE TO COWORK:**
```
SESSION 0.3 — Contract-first per Keystone. MILESTONE CLOSE.
Goal: ship a live landing page (thesis + waitlist) on fixprove.dev.
Acceptance criteria:
 - Page live with the one-sentence value prop ("prove your AI-generated code before it
   merges"), the problem (hallucinated imports/methods/APIs), and a working email waitlist.
 - Adversarial: a malformed email is rejected gracefully.
Produce the MILESTONE 0 KEYSTONE REPORT (provenance, coverage, defects, limitations,
Yehor sign-off, methodology note). Deliver live URL + Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — fixprove.dev is live, the waitlist accepted a test signup, and the Milestone 0 Keystone Report is signed."*

**MILESTONE 0 EXIT GATE (industrial check #1):** Name owned across all channels · domains registered · trademark filed · landing page live with ≥1 signup · Keystone Report signed. **If any item is PENDING, do not enter Milestone 1.**

---

### MILESTONE 1 — THE DETERMINISTIC ENGINE  (Days 4–12)
*Business reason: build the moat. A working, zero-token, multi-file symbol resolver that catches hallucinated imports and methods in Python and TypeScript.*

#### Session 1.1 — AST parse + symbol extraction (Python)  (Day 4–5)
- **WHY:** Everything downstream depends on accurately extracting what the code *references*.
- **WHAT:** A module that returns every import, call target, and attribute access from a Python diff as structured nodes.
- **HOW:** tree-sitter Python grammar; AST walk; structured output.
- **PASTE TO COWORK:**
```
SESSION 1.1 — Contract-first per Keystone.
Goal: extract all referenced symbols from a Python file/diff via tree-sitter.
Acceptance criteria:
 - Input: a .py file. Output: JSON list of {imports, call_targets, attribute_chains}
   with line numbers.
 - Invariant: deterministic — same file always yields identical output.
 - Adversarial: `from x import *`, aliased imports, and dynamic `__import__` must be
   handled or explicitly flagged "unresolvable-by-design".
Every non-trivial block carries a #KS-TRACE tag. Run the Verify stage adversarially.
Deliver: module + unit tests + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — identical structured output across 3 runs on a 500-line file; aliased/star imports handled or flagged."*

#### Session 1.2 — Dependency-graph knowledge base  (Day 6–7)
- **WHY:** To know if `pd.read_exel` is real, you must know pandas' *actual* installed API.
- **WHAT:** A builder that introspects installed dependencies (+ type stubs) into a queryable symbol table.
- **HOW:** Import-time introspection + `.pyi` parsing; cache per lockfile hash.
- **PASTE TO COWORK:**
```
SESSION 1.2 — Contract-first per Keystone.
Goal: build a knowledge base of the real public API of installed dependencies.
Acceptance criteria:
 - Input: a resolved environment (requirements/lock). Output: queryable map of
   module -> {public symbols, callables, signatures}.
 - Invariant: KB keyed by exact installed version; a version change invalidates cache.
 - Adversarial: a package doing heavy runtime monkeypatching must not crash the builder —
   it degrades to "best-effort, flagged".
#KS-TRACE on every block. Verify adversarially. Deliver KB module + tests + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the KB resolves known-good symbols of pandas/requests at the installed version and is cache-keyed to the lockfile hash."*

#### Session 1.3 — Resolver + hallucination detection + CLI MVP  (Day 8–9)
- **WHY:** The product's heartbeat: reference set ∩ KB → unresolved = hallucination.
- **WHAT:** `fixprove check` CLI that flags hallucinated imports/methods in a Python repo.
- **HOW:** Set resolution against the KB; CLI with CI exit codes.
- **PASTE TO COWORK:**
```
SESSION 1.3 — Contract-first per Keystone.
Goal: ship `fixprove check` for Python — flag unresolved symbols deterministically.
Acceptance criteria:
 - Catches `pd.read_exel` (typo of read_excel) and `import fastapi-helpers` (not installed).
 - ZERO false positives on a clean, known-good real project.
 - Runs <5s on a typical diff; non-zero exit code on any unresolved symbol.
 - Invariant: deterministic verdict across runs.
 - Adversarial: a correct-but-unusual valid call (re-exported symbol) must NOT be flagged.
#KS-TRACE everywhere. Build a labelled corpus (true-positives + true-negatives) and report
precision/recall. Deliver CLI + corpus + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — on the labelled corpus the CLI catches the seeded hallucinations with 0 false positives, runs <5s, returns a CI-usable exit code."*

#### Session 1.4 — TypeScript resolver  (Day 10–11)
- **WHY:** Python + TypeScript covers the bulk of AI-generated-code; two languages = credible launch.
- **WHAT:** The same resolver pipeline for TS/JS using `.d.ts` types.
- **HOW:** tree-sitter TS grammar + TypeScript declaration parsing.
- **PASTE TO COWORK:**
```
SESSION 1.4 — Contract-first per Keystone.
Goal: extend the resolver to TypeScript/JavaScript using .d.ts type info.
Acceptance criteria:
 - Catches a hallucinated method on a real npm package and a non-existent import.
 - 0 false positives on a clean TS reference repo.
 - Shares the deterministic core + output schema with the Python path.
 - Adversarial: type-only imports and re-exports resolve correctly.
#KS-TRACE + adversarial Verify. Deliver TS resolver + corpus + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the TS resolver passes its labelled corpus with 0 false positives and emits the same schema as Python."*

#### Session 1.5 — Open-core hardening + Milestone Keystone Report  (Day 12)
- **WHY:** The CLI is the top of the funnel; it must be trustworthy and publishable.
- **WHAT:** Hardened CLI, docs, determinism guarantee, milestone attestation.
- **HOW:** Property-based tests; determinism check; doc pass.
- **PASTE TO COWORK:**
```
SESSION 1.5 — Contract-first per Keystone. MILESTONE CLOSE.
Goal: harden the open-core `fixprove` CLI for public release and attest the milestone.
Acceptance criteria:
 - Property-based test: for any random valid program, 0 false positives (within documented limits).
 - Determinism check: 100 repeated runs => identical output.
 - README with install + usage + an explicit "known limitations" section.
Produce a MILESTONE 1 KEYSTONE REPORT covering all of M1. Deliver.
```
- **REALITY-CHECK — GOOD:** *"Yes — property + determinism tests pass, docs complete, and the signed Milestone 1 Keystone Report is in the repo."*

**MILESTONE 1 EXIT GATE (industrial check #2):** Python + TS resolvers pass labelled corpora with **0 false positives**, determinism proven, property tests green, milestone Keystone Report signed.

---

### MILESTONE 2 — DISTRIBUTION SURFACE  (Days 13–21)
*Business reason: turn the engine into a thing customers can install and pay for — the GitHub App + billing — with no dashboard to maintain.*

#### Session 2.1 — GitHub App + webhook + blocking Checks API  (Day 13–14)
- **WHY:** The App is where value meets the developer's workflow (the PR) and where the viral "billboard" comment lives.
- **PASTE TO COWORK:**
```
SESSION 2.1 — Contract-first per Keystone.
Goal: GitHub App that posts a blocking check with unresolved-symbol findings on each PR.
Acceptance criteria:
 - On a seeded PR with a hallucinated symbol, the App posts a FAILING check naming the
   symbol + file + line.
 - Source code never leaves the runner; only findings metadata is transmitted.
 - Webhook signatures validated; malformed payloads rejected.
 - Adversarial: a PR with no code changes must produce a clean PASS, not an error.
#KS-TRACE + adversarial Verify. Deliver App + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — a real seeded PR gets a red blocking check naming the hallucinated symbol; clean PRs pass; no source leaves the runner."*

#### Session 2.2 — SARIF + signed report output  (Day 15)
- **WHY:** Auditability is the enterprise-trust unlock and a differentiator.
- **PASTE TO COWORK:**
```
SESSION 2.2 — Contract-first per Keystone.
Goal: emit a SARIF file + a signed JSON report for every scan.
Acceptance criteria:
 - SARIF validates against schema and renders in GitHub's security tab.
 - Report is signed; tampering invalidates the signature.
 - Invariant: report content reproducible for identical input.
#KS-TRACE + Verify. Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — SARIF validates and renders in GitHub, and the signed report fails verification if altered."*

#### Session 2.3 — Stripe + Marketplace billing + private-repo gating  (Day 16–18)
- **WHY:** No billing = no income. This is the conversion mechanism.
- **PASTE TO COWORK:**
```
SESSION 2.3 — Contract-first per Keystone.
Goal: paywall private-repo scanning behind a Stripe subscription tied to the GitHub install.
Acceptance criteria:
 - A test card can subscribe ($29 plan) and immediately unlock private-repo checks.
 - Cancelling disables private-repo scanning at the next PR.
 - Public repos + local CLI remain free.
 - Adversarial: a spoofed webhook must NOT grant entitlement.
#KS-TRACE + adversarial Verify (especially the entitlement-spoof case).
Deliver billing flow + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — a test card subscribed, a private repo unlocked, cancellation re-locked it, and a spoofed webhook was rejected."*

#### Session 2.4 — End-to-end integration + Milestone Keystone Report  (Day 19–21)
- **WHY:** Prove the whole machine works as one before spending a day on launch.
- **PASTE TO COWORK:**
```
SESSION 2.4 — Contract-first per Keystone. MILESTONE CLOSE.
Goal: green end-to-end run + milestone attestation.
Acceptance criteria:
 - One scripted run covers: payment -> install -> PR with hallucinated symbol ->
   failing check -> SARIF -> billboard comment, all passing.
 - Performance: full scan <3 min on a mid-size repo.
Produce the MILESTONE 2 KEYSTONE REPORT. Deliver.
```
- **REALITY-CHECK — GOOD:** *"Yes — the scripted E2E passes start to finish in <3 min, and the signed Milestone 2 Keystone Report is filed."*

**MILESTONE 2 EXIT GATE (industrial check #3):** E2E green · billing verified incl. spoof rejection · SARIF renders · source-stays-in-runner confirmed · milestone Keystone Report signed.

---

### MILESTONE 3 — LAUNCH & FIRST REVENUE  (Days 22–60)
*Business reason: distribution is the real bottleneck. Light the open-core + SEO flywheel and convert the first paying private repos. Money in the bank is the only success signal.*

#### Session 3.1 — Publish open-core CLI to npm + PyPI  (Day 22–24)
- **WHY:** Every install seeds trust and funnels toward the paid App.
- **PASTE TO COWORK:**
```
SESSION 3.1 — Contract-first per Keystone.
Goal: publish the open-core `fixprove` CLI publicly with funnel copy.
Acceptance criteria: installs cleanly from a fresh machine via npm AND pip; README links to
the paid GitHub App; CHANGELOG + version tag in git.
Adversarial: install on a clean container to catch missing-dependency bugs.
Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — `npm i -g fixprove` and `pip install fixprove` both work from a clean container and the README funnels to the App."*

#### Session 3.2 — Programmatic-SEO generator  (Day 25–35)
- **WHY:** Long-tail capture of "does X method exist in Y library" / "npm 404 hallucinated import" — compounding, zero-sales traffic.
- **PASTE TO COWORK:**
```
SESSION 3.2 — Contract-first per Keystone.
Goal: generate + deploy programmatic-SEO pages targeting hallucinated-symbol queries.
Acceptance criteria: >=100 unique, technically-accurate pages live and indexable; each has a
one-click "install FixProve" CTA; sitemap submitted to Search Console.
Invariant: every page's claim about a real package API is verified by the resolver itself
(no hallucinated SEO content).
Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — ≥100 verified pages are live, the sitemap is submitted, and each page's API claims were checked by the resolver."*

#### Session 3.3 — Launch sequence  (Day 36–45) — includes pre-launch collision re-check
- **WHY:** Concentrated visibility to seed the first cohort.
- **PASTE TO COWORK:**
```
SESSION 3.3 — Contract-first per Keystone.
Goal: execute the public launch.
Acceptance criteria:
 - PRE-LAUNCH GUARD: re-run `npm view fixprove`, `pip index versions fixprove`, and confirm
   no new "FixProve" software product/trademark has appeared since Day 1. Abort launch if a
   collision emerged.
 - GitHub Marketplace listing approved + live.
 - "Show HN" post drafted with the deterministic-vs-probabilistic angle.
 - Product Hunt assets ready; launch-day checklist with timing.
 - Target: >=500 CLI installs and >=50 waitlist->trial.
Deliver launch kit + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the pre-launch collision re-check is clean, the Marketplace listing is live, launch posts shipped, and installs/trials are tracked against target."*

#### Session 3.4 — Trial→paid conversion + onboarding automation  (Day 46–60)
- **WHY:** Convert attention into recurring dollars with zero manual onboarding.
- **PASTE TO COWORK:**
```
SESSION 3.4 — Contract-first per Keystone. MILESTONE CLOSE.
Goal: convert trials to paid and make onboarding self-serve.
Acceptance criteria: one-click "report false positive" with allowlist escape hatch; automated
welcome + setup emails; FAQ deflecting the top 5 support questions.
Target: >=1 paying private-repo org (stretch: 10), dollars cleared into the bank.
Produce MILESTONE 3 KEYSTONE REPORT. Deliver.
```
- **REALITY-CHECK — GOOD:** *"Yes — ≥1 org is paying $29–99/mo, the money cleared into the bank, onboarding is self-serve, and the Milestone 3 Keystone Report is signed."*

**MILESTONE 3 EXIT GATE (industrial check #4 — the only one that counts):** **Real money from a real external customer has cleared into the bank**, open-core has ≥500 installs, SEO pages indexed, support automated.

---

### MILESTONE 4 — COMPOUND & EXPAND  (Days 61–120)
*Business reason: turn a product into effortless income — add a second language, fold in the red→green verified-fix premium (where the name "FixProve" becomes literal), and automate renewals so founder time drops below 20 hrs/week.*

#### Session 4.1 — Go + Rust resolvers  (Day 61–80)
- **WHY:** Each language is a new addressable market on the same engine. (Re-confirm crates.io name here.)
- **PASTE TO COWORK:**
```
SESSION 4.1 — Contract-first per Keystone.
Goal: add Go and Rust resolution paths reusing the deterministic core.
Acceptance criteria: each new language passes its own labelled corpus with 0 false positives
and shares the common output schema; re-confirm the crates.io "fixprove" name is still free.
Adversarial: Go interface methods + Rust trait resolution handled or explicitly flagged.
Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — Go and Rust resolvers pass their corpora at 0 false positives, crates.io is confirmed, and ≥1 customer cites them."*

#### Session 4.2 — Verified-fix / red→green layer (the FixProve premium)  (Day 81–95)
- **WHY:** This is where the name pays off — once trust exists, *proving* a fix (not just flagging) is the premium upsell. (Voice 1's original concept.)
- **PASTE TO COWORK:**
```
SESSION 4.2 — Contract-first per Keystone.
Goal: premium layer — for an unresolved symbol, optionally generate a candidate fix and PROVE
it by running the project's own test suite in the runner (red->green), BYOK only.
Acceptance criteria: a suggested fix is shown only if it makes the failing reference resolve
AND the existing test suite still passes; all LLM calls are BYOK + hard-capped; the fix is
never auto-merged (draft suggestion only). Adversarial: a fix breaking another test is suppressed.
Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the premium layer proposes a fix only when tests pass, uses BYOK keys exclusively, never auto-merges, and suppresses regressions."*

#### Session 4.3 — Metered API / BYOK tier  (Day 96–105)
- **WHY:** A second revenue line that scales with usage, not headcount.
- **PASTE TO COWORK:**
```
SESSION 4.3 — Contract-first per Keystone.
Goal: ship a metered hosted-API tier with BYOK suggest-fix.
Acceptance criteria: usage metered + billed via Stripe; hard daily spend cap; downgrade to
free tier on cap breach. Adversarial: cap-evasion attempts blocked. Deliver + Keystone Report.
```
- **REALITY-CHECK — GOOD:** *"Yes — the metered tier bills correctly, enforces the cap, and resists cap-evasion."*

#### Session 4.4 — Renewal + churn automation; sub-20-hr/week  (Day 106–120)
- **WHY:** "Effortless" is only real when the system runs itself.
- **PASTE TO COWORK:**
```
SESSION 4.4 — Contract-first per Keystone. PROJECT-STABILISATION CLOSE.
Goal: automate renewals/dunning, add churn-risk alerts, and drive maintenance below 20 hrs/wk.
Acceptance criteria: automated dunning on failed payments; churn-risk email when usage drops;
7 consecutive days with no manual DB/support intervention; logged founder hours <20/wk.
Produce the FINAL MILESTONE KEYSTONE REPORT + a plain-language state-of-the-business summary.
Deliver.
```
- **REALITY-CHECK — GOOD:** *"Yes — renewals/dunning automated, the system ran 7 days untouched, MRR ≥ $1,000, churn <5%/mo, and my logged hours are <20/week."*

**MILESTONE 4 EXIT GATE (industrial check #5):** MRR ≥ $1,000 · churn <5%/mo · ≥2 languages with paying customers · renewals automated · founder time <20 hrs/week · final Keystone Report signed.

---

## 5. THE INDUSTRIAL VERIFICATION STACK (the "multiple checks")

Quality is enforced at four nested levels. Nothing is "done" until its level passes.

1. **Per-block (every session):** `#KS-TRACE` tag on every non-trivial block — requirement ID, the assumption made, and the covering test. *(Keystone Stage 2.)*
2. **Per-session (Keystone Stage 3 — Verify, adversarial):** unit tests + edge cases + dependency/security scan + one property-based test on critical logic + the session's named break case. No "it should work" — only "it passed [named test]."
3. **Per-session attestation (Keystone Stage 4):** a Keystone Report — provenance, coverage numbers, specific defects caught+fixed, honest known limitations, Yehor's signature, one methodology improvement.
4. **Per-milestone exit gate:** checks #1–#5 above. The plan cannot pass a gate until its reality-check reads GOOD.

**Two standing cross-cutting checks:**
- **Determinism check** — the product's core promise. Any resolver change must pass "100 identical runs → identical output."
- **Pre-launch collision re-check** — built into Session 3.3: re-run `npm view` / `pip index` / a "FixProve" product+trademark search the day you go public. Registries change; this five-minute guard is the final defense against the RepoMend failure.

---

## 6. EFFORTLESS-INCOME SEQUENCE (the honest reality ladder)

Each rung is falsifiable. BAD if it asserts feeling; GOOD if it asserts evidence + bank balance.

| Rung | When | GOOD reality-check |
|---|---|---|
| **Foundation locked** | Day 3 | "FixProve owned across all channels, domains registered, trademark filed, landing page live with ≥1 signup." |
| **Engine proven** | Day 12 | "Python+TS resolvers catch seeded hallucinations at 0 false positives, determinism proven, Milestone 1 Report signed." |
| **Machine sellable** | Day 21 | "E2E run passes payment→install→blocking check→SARIF in <3 min; a test card subscribed and unlocked a private repo." |
| **First real dollar** | Day ≤60 | "An external org is paying $29–99/mo and the money has cleared into the bank." |
| **Effortless** | Day ≤120 | "MRR ≥ $1,000, churn <5%, the system ran 7 days untouched, and I work <20 hrs/week on it." |

**Honest flag:** the genuinely risky parts are (a) a robust Python+TS resolver in ~9 days — real codebases use dynamic imports, re-exports, and metaclasses that cause edge-case false positives unless launch scope stays narrow; and (b) converting open-core installs into *paid private-repo* subscriptions inside 90 days. Mitigation, already in the plan: launch Python-first if needed, ship a false-positive allowlist escape hatch, and treat **1 paying org by Day 60** — not 20 — as the real success threshold.

---

## 7. MODEL ROUTING FOR THE BUILD

- **Lead build co-pilot (this environment):** **Claude Cowork, Sonnet 4.6** — organises sessions, holds Keystone, produces the build + Reports.
- **Heaviest engine architecture (AST resolver, sessions 1.1–1.4, 4.2):** escalate to **Claude Opus** for multi-file planning + AST/compiler reasoning.
- **CI / infra scripting:** a Codex-class model is a strong specialist second opinion for Actions/runner wiring.
- **Daily strategic director:** **Gemini (Deep Research)** as Node 1 — holds this plan, reads each Keystone Report, hands you the next session block.
- **Cost rule:** every unbounded-token feature is **BYOK**, so model spend never touches product COGS.

---

## 8. RISK REGISTER (condensed)

| # | Failure mode | Impact | Mitigation (in the plan) |
|---|---|---|---|
| 1 | Solo-bandwidth collapse | High | Deterministic, token-free engine = near-zero ops; Python+TS only at launch; Marketplace handles billing; 20 hr/wk cap enforced by milestone gates. |
| 2 | API-cost runaway | Low–Med | Core uses 0 LLM tokens; all suggestion features BYOK + hard-capped. |
| 3 | Commoditization by Socket/Snyk/CodeRabbit | High | Moat = multi-language AST resolver depth (12–18 mo); ship languages fast; own "deterministic, 0 false positives" positioning; open-core lock-in. |
| 4 | Enterprise-trust barrier | Med | Source never leaves the runner; SARIF + signed reports; self-hostable CLI; SOC 2 deferred until revenue justifies. |
| 5 | Name/legal collision (RepoMend repeat) | High | FixProve verified clear on npm/PyPI/GitHub/domains (2026-06-30); Phase-0 ownership gate; pre-launch re-check in Session 3.3; crates.io re-confirm in 4.1; `Importproof` as backup. |

---

*End of master plan. Operate it via the Section 0 loop. Sign every Keystone Report. Advance only on GOOD reality-checks.*

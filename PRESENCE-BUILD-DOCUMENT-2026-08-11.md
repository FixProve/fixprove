# PRESENCE BUILD DOCUMENT — Synthesis of Prompt A

**Artifact ID:** `PBD-PRESENCE-2026-08-11` · **Source:** `DRP-PRESENCE-2026-08-11` v2.1, Prompt A
**Synthesised:** 2026-08-11, Session 4.13, by Claude (Node 1), Keystone v1.1.0
**Status:** DRAFT — untracked, off `main`. Nothing here authorises a public-surface change.
**#KS-TRACE:** `S4.13-R2` | assumption: the four reports are independent runs of the same
brief | test: schema-conformance audit (§1) + agreement matrix (§2)

---

## 0. HEADLINE — read this before the tables

Four models converged hard on the *operational* findings and produced one genuinely
uncomfortable *strategic* finding that only one of them saw clearly.

**The operational consensus (4/4, act on it):** the homepage is a dead end. It invites
the reader to inspect the source and then links to nothing — no repository, no package,
no docs. Every model independently identified this same step as the largest funnel leak,
and every model independently ranked the same handful of sub-two-hour hygiene fixes at
the top of its backlog.

**The strategic finding (1/4, and it survived verification):** one model challenged the
product's core differentiation claim on evidence, and **it was right.** This is the most
valuable output of the entire study and it is covered in §3 before anything else,
because if it holds it changes the positioning that Prompt B is supposed to express.

---

## 1. SCHEMA CONFORMANCE AUDIT

Per the synthesis protocol (§4.1 of the source prompt): deviations are **recorded, not
silently repaired.** A model that could not follow a rigid format is weaker evidence on
everything else it said.

| # | Report | Sub-blocks | `CLAIM:` lines | Order | Verdict |
|---|---|---|---|---|---|
| **M1** | OpenAI Codex | **37 / 37** | **37 / 37** | correct | **Full conformance.** Only report to hit the schema exactly. Every claim additionally carries an inline evidence tier. |
| **M2** | Compass deep-research | 37 / 37 | 20 / 37 | correct | **Structural pass, field-level partial.** All headings present and correctly ordered; 17 sub-blocks open with prose instead of a `CLAIM:` line. Merge-usable. |
| **M3** | Gemini-class (pasted) | 37 / 37 | ~37 | **`R2` emitted before `R1`** | **Order violation.** Content complete and evidence-tiered, but section order was reversed, which the brief explicitly forbade ("do not merge, reorder"). |
| **M4** | Claude-class (pasted) | 37 / 37 | 37 / 37 | correct | **Full conformance** on structure. Carries the largest number of explicit `[ASSUMED]` declarations (8), which is a quality signal, not a defect. |

**Weighting consequence.** M1 and M4 are treated as full-weight evidence. M2 is
full-weight on content (its partial `CLAIM:` compliance did not obscure any position).
M3's order violation is recorded but did not affect extractability; **however, see §3 —
M3 is also the report whose headline number is the furthest outlier, and the two facts
are worth holding together.**

---

## 2. AGREEMENT MATRIX — the diff, field by field

### 2.1 CONSENSUS (4/4) — act, low risk

| Field | The agreed position |
|---|---|
| **`R1.SINGLE-BIGGEST-LEAK`** *(step)* | The promise→proof gap. A qualified engineer reads the pitch, wants to verify it, and **cannot** — there is no link to repository, package, or docs. All four named this same step independently. |
| **`R7.PROCESS-DOCS-VERDICT`** | **Negative — relocate them.** All four were asked to argue the question rather than assume it, all four independently reached "this reads as a personal scratchpad, not a product," and all four explicitly considered and rejected the transparency defence. This is as strong as a consensus gets. |
| **`R2.FRAMING-VERDICT`** *(direction)* | Retire "Prove your code. Don't hope it." as the H1. Lead with the **failure mode**, not the mechanism. Keep "deterministic / no model in the loop" as the reason-to-believe in the subhead. |
| **`R1.AGENT-DISCOVERY`** *(direction)* | FixProve is unlikely to be named accurately by an AI answer-engine today. Zero JSON-LD is the named cause in all four. |
| **`R3` — all three evaluators** | All four models had **all three** evaluator personas (advokat, engineer, partner) reach a negative verdict inside 60 seconds. No model found a persona who passes. |
| **Top hygiene fixes** | Root `LICENSE`, fix the PyPI `/app` 404, outbound links on the homepage, GitHub Releases, trader ID + `/terms` in the footer. Every model put these in its top tier. |

### 2.2 MAJORITY (3/4) — act, dissent recorded

| Field | Majority | Dissent |
|---|---|---|
| **`R1` leak magnitude** | **55–70%** of qualified engineers lost at that step (M1 ≈60%, M2 ≈65%, M4 55–70%) | **M3 says ~92%** — and attributes much of it to a *different* cause (npm-wrapper/Python runtime coupling), not the missing links. See §3.2. |
| **`R1.AGENT-DISCOVERY` severity** | **Medium** — a repairable clarity defect (M1 is explicit: JSON-LD is "not the primary cause"; the real constraint is thin indexable content and no external citations) | **M3 rates it High** and frames it as total non-indexability. |

### 2.3 SPLIT (2/2 or worse) — **NOT resolved here. Yehor's call.** See §4.

| Field | The split |
|---|---|
| **`R2.ICP`** | Four different answers spanning **2 to 500 people**. M2: 2–20 AI-native startup. M1: 10–50 Python-first SaaS. M4: 20–200 Series A–B. M3: 50–500 mid-market. |
| **`WHAT I WOULD DO FIRST`** | **Hygiene-first** (M3, M4 — fix the 404, add LICENSE, add nav) vs **proof-first** (M1 — publish a reproducible quickstart with real captured output). M2 sits between: links first, *but only after* the repo they point at is presentable. |
| **Total effort** | M4: ~10h. M2: ~21h. M1: ~56h. A 5.6× spread on the same backlog. |

---

## 3. STANDING RISKS — unrebutted steelmen, promoted per protocol §4.2.6

### 3.1 ⚠ RISK-1 — The differentiation claim is narrower than the marketing implies. **VERIFIED.**

**Raised by M2 alone (singleton). Independently verified by Node 1 this session — and it holds.**

M2 challenged the positioning directly: Pyright *already* resolves imports and attributes
against installed dependencies, because its `useLibraryCodeForTypes` setting **defaults to
true** and causes it to read and parse library source code to extract type information
when stubs are absent.

**M4's report states the opposite** — that type checkers "do not check import resolution
against installed dependencies." Two reports in direct factual conflict on the single
question that determines whether the product has a defensible wedge.

**Node 1 verified against Pyright's own documentation. M2 is correct; M4's claim as
stated is wrong.** `useLibraryCodeForTypes` defaults to `true`, and Pyright does parse
installed library source in the absence of stubs.

**But the wedge is not dead — it is narrower and it must be stated accurately.** The same
documentation notes that type information inferred this way "will typically be
incomplete." M2's own framing of the surviving wedge is the defensible one:

> runtime introspection of **untyped and dynamic** libraries, where mypy is blind (pandas
> is not a `py.typed` library) and Pyright's static parse is admittedly incomplete —
> plus single-purpose, zero-config CI adoption rather than a type checker a team must
> adopt and tune.

**Consequence — this is the most important line in this document.** Any homepage copy
implying "no other tool checks your code against what's installed" is **false and
publicly falsifiable by any reviewer who knows Pyright.** Given `F15`'s history — a
public claim that contradicted FixProve's own Privacy Policy, found live on four
surfaces — this is precisely the class of defect the project cannot afford twice.

**This must be resolved before Prompt B runs.** Prompt B's `B-INPUT` block asks for the
settled positioning; feeding it an overclaim would propagate the error into the visual
system, the homepage copy, and the narration script simultaneously.

### 3.2 ⚠ RISK-2 — The npm-without-Python failure path is unverified and may be a real leak

M3 built a substantial part of its 92% figure on the claim that a JS developer running
`npm install -g fixprove` hits a hard execution failure without a Python runtime. `F9`
states the CLI prints an *actionable* `pip install fixprove` message in that case — a
graceful degradation, not a crash. **M3's severity reading is probably too harsh, but
nobody has actually tested the path.** Unrebutted by the other three, who did not examine
it. See `GAP-2`.

### 3.3 ⚠ RISK-3 — Adding outbound links exposes a repository that is currently unpresentable

Raised as a steelman by M1 and M4 and *rebutted* by both — but **M2 accepted it and
changed its recommendation because of it**, sequencing repo cleanup *before* adding links.
That makes it a live sequencing constraint rather than a settled objection: adding
prominent GitHub links today points every visitor at 0 stars, 0 releases, no root
licence, and 59 process docs. **Order matters.**

### 3.4 ⚠ RISK-4 — "Near-zero false positives" is an unproven public claim

Raised by M4, unrebutted. `F25` — the root README — makes this claim publicly. No
published evidence supports it, and RISK-1 makes the surrounding claims more scrutinised,
not less. An informed skeptic will ask how the resolver handles `__getattr__`,
`importlib`, conditional imports, and C extensions.

---

## 4. OPEN DECISIONS — Yehor's calls only. Not decided by Node 1.

### DECISION-1 — Which ICP? *(4-way split)*

| Option | Source | Case for |
|---|---|---|
| **2–20, AI-native startup, founding engineer** | M2 | Feels the pain weekly; adopts a CLI in minutes; no procurement; no legacy mypy config to fight. Fastest path to a first real user. |
| **10–50, Python-first SaaS, staff eng owning CI** | M1 | Enough AI-generated change volume to hurt, no dedicated devtools team to build it in-house. |
| **20–200, Series A–B B2B SaaS** | M4 | Has CI discipline and budget maturity. |
| **50–500, mid-market** | M3 | Largest contract value — but longest sales cycle, and procurement will ask about the sole proprietorship (`F1`). |

**Node 1's observation, not a decision:** three of four cluster at or below 200, and the
overlap zone across those three is roughly **20–50 people**. M3's 50–500 is the outlier
and is also the band where the enkeltmandsvirksomhed structure (§`R3.VERDICT-PARTNER`)
does the most damage. **Your call.**

### DECISION-2 — Hygiene-first or proof-first? *(2/2 split, with a real argument underneath)*

- **Hygiene-first** (M3, M4): the fixes are trivially cheap (~2h total), zero legal risk,
  fully reversible, and remove active, recurring failures — the PyPI 404 fires on every
  single visitor who clicks it.
- **Proof-first** (M1): hygiene fixes remove *reasons to reject* but add no *reason to
  adopt.* You can fix every link and still lose the same people, because there is still
  nothing on the site that demonstrates the tool actually works. M1 wants a
  `/docs/quickstart` with one real captured failing example per language.

**These are not mutually exclusive** — the honest framing of the split is *sequencing
under a limited-time budget*, not either/or. M2's position (hygiene first, but only as a
precondition for the links) is arguably the synthesis of both.

### DECISION-3 — Relocate the 59 process docs? *(4/4 recommend yes — but it is your call, not theirs)*

Unanimous technical recommendation. **However**, this collides with the project's own
append-only convention and its deliberate build-in-public posture, and two of the six
files carrying pricing exposure are among those the models want moved. Relocation is a
`git mv` — it does not delete history. **Still your call.**

### DECISION-4 — Correct the differentiation claim now, or after counsel review?

Per RISK-1. Node 1's read: this is an **accuracy** fix, not a legal one, and the
precedent from 2026-08-08 is to fix accuracy defects promptly rather than bundle them.
But it touches public product claims, so it is flagged rather than assumed.

---

## 5. INFORMATION GAPS — needed by 2+ models independently. Establish, do not guess.

| ID | Gap | Who needed it | How to close |
|---|---|---|---|
| **GAP-1** | How the resolver handles dynamic imports, `importlib`, `__getattr__`/`__getattribute__`, conditional imports, and C extensions | M4 explicit, M2 implicit (via the Pyright comparison), M1 (via "does the positioning survive comparison") | Read the engine source; write it up. **This is also the evidence base for RISK-1 and RISK-4.** |
| **GAP-2** | Actual behaviour of `npm install -g fixprove` on a machine with no Python | M3 (built its outlier figure on it), M1 (flagged install-path ambiguity) | Run it in a clean container. 20 minutes. |
| **GAP-3** | Whether `fixprove check .` auto-detects language, and whether both packages are needed | M1, M4 | Read the CLI entrypoint; state it in one line on the homepage. |
| **GAP-4** | A public contact email for the homepage | M3, M4 | `F1` gives `yehor@yehor.ai` — decide whether that is the public-facing address. |
| **GAP-5** | Any measured accuracy figure at all | M2, M4 (both flag "near-zero false positives" as unsupported) | Either produce evidence or **remove the claim.** |

---

## 6. SEQUENCED BACKLOG — consensus items only

Split and singleton items are **excluded** pending §4. Effort is Node 1's own estimate,
reconciled across a 5.6× model spread by taking the median and rounding up.

### Tier 0 — do before anything else *(blocks correctness of everything downstream)*

| # | Action | Surface | Effort | Legal? | Reversible |
|---|---|---|---|---|---|
| 0.1 | **Resolve RISK-1.** Establish the accurate wedge vs Pyright/mypy; correct any overclaim on the homepage and both package READMEs | Copy | 2h | N | Y |
| 0.2 | **Close GAP-1** — document resolver edge-case behaviour | Docs | 3h | N | Y |
| 0.3 | **Close GAP-5** — evidence the "near-zero false positives" claim, or delete it | Copy | 1h | N | Y |

### Tier 1 — trivial cost, active failures, 4/4 consensus *(~2 hours total)*

| # | Action | Surface | Effort | Legal? | Reversible |
|---|---|---|---|---|---|
| 1.1 | Fix the PyPI `/app` **404** — repoint the project URL or create the route | PyPI/web | 0.5h | N | Y |
| 1.2 | Add root `LICENSE` (copy `cli/LICENSE`, MIT) — GitHub sidebar then detects it | GitHub | 0.25h | N | Y |
| 1.3 | Create GitHub Releases for published versions | GitHub | 0.5h | N | Y |
| 1.4 | Add trader ID (CVR 46646223, Aarhus) + `/terms` link to the footer — closes the `F18` orphan | Web | 1h | N | Y |

### Tier 2 — the consensus leak fix *(gated on DECISION-3 and RISK-3 sequencing)*

| # | Action | Surface | Effort | Legal? | Reversible |
|---|---|---|---|---|---|
| 2.1 | Relocate 59 process docs to `project-history/` — **precondition for 2.2** per RISK-3 | GitHub | 2h | N | Y |
| 2.2 | Add outbound GitHub / PyPI / npm links to the homepage | Web | 1h | N | Y |
| 2.3 | Rewrite H1 to lead with the failure mode — **must wait for Tier 0.1** | Web | 1h | N | Y |

### Tier 3 — agent legibility *(4/4 direction, majority says Medium not High)*

| # | Action | Surface | Effort | Legal? | Reversible |
|---|---|---|---|---|---|
| 3.1 | Add `SoftwareApplication` JSON-LD to `/` | Web | 2h | N | Y |
| 3.2 | Add `robots.txt`, `sitemap.xml`, `canonical` | Web | 1h | N | Y |
| 3.3 | Quickstart/proof page — **M1's singleton, promoted because it also closes GAP-1 and GAP-3** | Docs | 4h | N | Y |

**Tier 0 + Tier 1 ≈ 8.25 hours** and resolves every active public failure plus the one
finding that could embarrass the project in front of a technical reviewer.

---

## 7. WHAT THIS DOES NOT AUTHORISE

Nothing here is a commit, a push, a publish, or a deploy. The hard boundary is unchanged:
no live Stripe, no public pricing, no GitHub App public flip, no marketplace listing.
Every Tier item remains a separate, explicitly-approved action under the standing gates.

**Prompt B is blocked** until DECISION-1 (ICP), DECISION-2 (sequencing), and RISK-1 (the
accurate wedge) are settled — its `B-INPUT` block requires all three as `[VERIFIED]`
input, and feeding it an unresolved overclaim would propagate that error simultaneously
into the identity system, the homepage copy, and the narration script.

---

*Synthesised by Claude (Node 1), Session 4.13, 2026-08-11, from four independent Prompt A
runs. RISK-1 was independently verified against Pyright's own documentation this session
and is the only finding here that overturned a majority position on evidence. Source
reports preserved at `research/PRESENCE-A-*.md` (two uploaded); the two pasted reports
are preserved in this session's transcript.*

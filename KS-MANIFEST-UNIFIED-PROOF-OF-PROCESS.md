# FixProve — Unified Keystone Proof-of-Process Manifest

**Compiled:** 2026-07-04 · **Sessions covered:** 0.1 through 3.1 · **Source:** the 10 individual Keystone Reports in this repository, cross-checked directly against their own verification-summary tables and accountability sections while compiling this manifest — no figure below is carried forward from memory alone.

**Purpose:** a single document answering, for the whole project so far: what was built, what was verified and how, what defects were found and fixed, and — critically — what is actually **signed and closed** versus **still awaiting Yehor's review**. This last distinction is the one most at risk of being blurred when many sessions accumulate, so it is stated plainly per session below, not implied.

---

## Sign-off status at a glance

| # | Session | Deliverable | Tests | Defects found & fixed | Signed? |
|---|---|---|---|---|---|
| 0.1 | Name clearance | npm/PyPI/GitHub org/domain ownership | — (live API checks, not unit tests) | 1 (D4: PyPI token pasted in plaintext, revoked same session) | ✅ **Signed** — Yehor Kaliberda, 30.06.26 |
| 0.2 | Trademark + Stripe + repo scaffold | Trademark filing text, Stripe checklist, monorepo scaffold | — | none reported | ❌ Not signed |
| M0 | Milestone 0 close | Foundation attestation | — | 1 (stale-language contradiction in an earlier draft, corrected before signing) | ✅ **Signed** — Yehor Kaliberda, 01.07.26 |
| 1.1 | Python symbol extraction | `symbol_extractor.py` | 33/33 | 2 | ❌ Not signed |
| 1.2 | Knowledge base | `knowledge_base.py` + `_kb_worker.py` | 32/32 | 2 | ❌ Not signed |
| 1.3 | Resolver + CLI | `resolver.py` + `cli.py` | 29/29 (93/93 full regression) | 0 (deliberately probed for; none found) | ❌ Not signed |
| 1.4 | TS/JS resolver | `ts_*.py` + shared `finding.py` | 88/88 (179/179 full regression) | 3 (+1 incidental fix to a 1.1 property test) | ❌ Not signed |
| 2.1 | GitHub App | `app/` (webhook, Checks API, OIDC callback) | 45/45 | 2 (Octokit `.rest` assumption, twice) | ✅ **Signed** — Yehor Kaliberda, 04.07.26 |
| 2.2 | KV store + Worker | `worker/` (Hono, Cloudflare KV) | 48/48 + 16/16 | 2 (`AggregateError` misclassification, twice) | ✅ **Signed** — Yehor Kaliberda, 04.06.27 *(date as entered — see note below)* |
| 3.1 | PyPI/npm packaging + release CI | `pyproject.toml`, `cli/` wiring, `release.yml` | 179/179 + 6/6 | 4 (missing dependency; broken `bin` path; test-file leak; dead-code regex) | ✅ **Signed** — Yehor Kaliberda, 04.07.26 |

**Note on the 2.2 signature date:** the report as currently on disk reads `04.06.27`, which does not fall in sequence with the surrounding 04.07.26 dates on 2.1 and 3.1. This is reproduced exactly as signed rather than silently corrected — if this was a typo made while signing, it is Yehor's to amend, not this manifest's to guess at.

**Reading this table honestly:** five sessions (0.2, 1.1, 1.2, 1.3, 1.4) remain unsigned. This does not mean their work is wrong; every one of them reports its own passing test suite and discloses its own limitations. It means Yehor has not yet performed the human review step Keystone reserves for him. Milestone-level closes (Milestone 0, and the Gemini-audited closes of Milestone 1 and Milestone 2 recorded in this session's own conversation history) have proceeded on the strength of the *audit*, not on every individual session report being individually countersigned — that is a real, if minor, procedural gap worth Yehor's attention, not this manifest's to resolve unilaterally.

---

## Milestone 0 — Foundation (Sessions 0.1–0.2, closed 2026-07-01)

**What was built:** the name "FixProve" locked across npm, PyPI, the GitHub org, and `fixprove.com`/`fixprove.dev`; trademark filing text drafted (Class 9 + 42, intent-to-use — not yet filed with the USPTO, that remains Yehor's action); a Stripe setup checklist; the initial pnpm/TypeScript monorepo scaffold (`cli/`, `app/`, `web/`); a live landing page with a working waitlist signup.

**How it was verified:** live, programmatic checks against the real npm registry, PyPI JSON API, crates.io API, GitHub API, and Cloudflare DNS-over-HTTPS — not simulated. The landing page's waitlist was tested against the real production domain (valid signup, XSS-shaped email rejection, malformed body, wrong HTTP method, duplicate-signup idempotency), not just unit tests.

**Real defect caught:** a PyPI API token was pasted in plaintext during a terminal session, visible in the chat transcript — a HIGH-severity finding. Yehor revoked it immediately (confirmed via a screenshot of the deletion). The recommended fix — credentials must be set as environment variables, never typed inline — is the direct ancestor of every "HUMAN, interactive-only" step in this session's own deployment runbook.

**Known unfinished side-items, as of Milestone 0's own close:** USPTO filing not submitted; landing page copy not reviewed by Yehor; Stripe account not actually opened; the waitlist KV namespace has test/junk entries mixed with any real signups.

---

## Milestone 1 — The Deterministic Engine (Sessions 1.1–1.4, functionally complete 2026-07-04, Gemini-audited)

**What was built:** `engine/python/` — a from-scratch, tree-sitter-based, AST-level resolver that checks whether every import, call target, and attribute chain in a Python or TypeScript/JavaScript file resolves against the real, installed public API of the project's declared dependencies. Zero LLM calls anywhere in the resolution path. Four components, one per session:

- **1.1 — `symbol_extractor.py`:** extracts the reference set (imports, call targets, attribute chains) from Python source via `tree-sitter-python`.
- **1.2 — `knowledge_base.py` + `_kb_worker.py`:** builds the "ground truth" by subprocess-isolated introspection of each installed package's real public API, cached by a `requirements.txt` lockfile hash.
- **1.3 — `resolver.py` + `cli.py`:** joins 1.1 against 1.2 (`reference set ∩ knowledge base → unresolved = finding`) and exposes it as the `fixprove check` CLI. Precision/recall on the labelled corpus: **1.0 / 1.0**.
- **1.4 — `ts_symbol_extractor.py` / `ts_knowledge_base.py` / `ts_resolver.py` + shared `finding.py`:** extends the same architecture to TypeScript/JavaScript via `tree-sitter-typescript` and a custom `.d.ts` parser (an explicit, accepted-tradeoff choice by Yehor over the real TypeScript Compiler API, in order to keep the whole engine in one language). Precision/recall on its own labelled corpus: **1.0 / 1.0 / 1.0**, against real installed `axios` and `lodash`/`@types/lodash`.

**How it was verified:** 179 tests across the four sessions (unit, integration, and property-based via Hypothesis), all passing, plus two independently-built labelled corpora evaluated for precision/recall rather than asserted. Session 1.3 additionally verified, end-to-end against a genuinely pip-installed crashing package (not a mock), that a knowledge-base build failure degrades to "never flagged" rather than a false positive.

**Real defects caught across these four sessions:** an unbounded-recursion risk in the AST traversal (fixed with an iterative, explicit-stack walk); an `extends`-chain that missed class-declared members; multi-hop re-export chains that silently dropped symbols; a corpus fixture that broke `npm install`; plus one incidental fix to a Session 1.1 property test's incomplete keyword blocklist, found while working on 1.4.

**Known limitation, stated plainly and still true today:** TypeScript module augmentation (e.g. the real-world `@types/lodash` pattern) is detected and safely skipped — never flagged, but also not checked — rather than guessed at. This is an accepted, disclosed gap, not a silent one.

**Sign-off status:** Milestone 1 was declared "functionally complete" per a Strategic Director (Gemini) audit of Session 1.4's own report, and Milestone 2 was authorized to begin on that basis. **None of the four individual session reports (1.1–1.4) have Yehor's own signature on file as of this manifest's compilation.**

---

## Milestone 2 — Distribution Surface (Sessions 2.1–2.2, closed per Gemini audit, live deploy pending)

**What was built:**

- **2.1 — the GitHub App (`app/`):** receives `pull_request` webhooks, opens a Check Run immediately, and later completes it via an OIDC-authenticated callback from the customer's own GitHub Action (published as `app/templates/fixprove-check.yml`) — the architecture chosen specifically to make "source code never leaves the customer's runner" literally true rather than a claim resting on trust.
- **2.2 — the Worker (`worker/`):** wraps 2.1's logic in a Hono-based Cloudflare Worker, replacing the in-memory pending-check-run store with one backed by Cloudflare KV, with every KV failure caught and classified rather than left to hang or silently succeed.

**How it was verified:** 45 tests (2.1) then 48+16 (2.2, including 2.1's own suite plus new DI/regression tests), all passing — against locally-generated OIDC test tokens/JWKS and fake Checks-API/KV clients, explicitly labeled "logic-verified, not live-verified" in both reports. Session 2.2 additionally ran a real `wrangler deploy --dry-run` (290 KiB bundle, KV binding and vars resolve) and a real (failing-as-expected) `wrangler deploy` attempt, confirming the only blocker to a live deploy is Cloudflare credentials this environment cannot supply.

**Real defects caught, both by adversarial testing rather than inspection:**

- **2.1:** the `ChecksClient` adapter assumed a real Octokit instance exposes `.rest.checks.create/update`. It does not — `@octokit/app`'s default Octokit has no `.rest` namespace at all, only the generic `.request()` method. Caught by `tsc --noEmit`, not a test, the moment an unsafe cast was removed.
- **2.2:** `@octokit/webhooks` wraps *any* listener exception (not just genuine signature/payload failures) in the same `AggregateError` shape it uses for real validation errors — Session 2.1's blanket `catch → 400` was silently mislabeling a KV outage as if it were a forged request. Fixed by checking the one distinguishing signal (`.status === 400`, set only by genuine validation errors).

**Known limitation, carried forward into this session's runbook (Part A2):** `worker/wrangler.toml` has no custom-domain route bound to `api.fixprove.dev`, the address the customer-facing Action template already hardcodes. This gap was found while compiling this session's deployment runbook and is now an explicit step there — it was not previously called out as a blocker in either 2.1's or 2.2's own report.

**Sign-off status:** **Both 2.1 and 2.2 carry Yehor's signature** — this is the strongest verification/attestation gap of any component covered by this manifest. Live deployment (this session's Part A/B) remains the last gate.

---

## Milestone 3 (in progress) — Launch & First Revenue (Session 3.1 complete, 3.2 this document)

**What was built (3.1):** the Python engine packaged for PyPI (`pyproject.toml`, explicit `py-modules` list to guarantee no test/corpus leakage, keeping the existing flat module layout since files cannot be renamed in this environment); the npm `cli/` package rewritten from a Session 0.2 placeholder into a real subprocess wrapper that invokes the installed Python engine; a tag-triggered `.github/workflows/release.yml` with an automated, permanent CI gate that builds the real sdist/wheel/npm tarball and fails the run if any test/fixture/corpus content leaks in.

**How it was verified:** 179/179 Python tests (unchanged — no engine logic was touched) plus 6/6 new wrapper tests; a real `python -m build` and real `npm pack --dry-run`, both inspected by hand; a genuinely fresh virtualenv install exercising both the console-script and module-invocation surfaces; a real end-to-end run of the built Node CLI correctly invoking the pip-installed Python engine against a real hallucinated-symbol fixture.

**Real defects caught, three of four only by actually building and installing the artifacts (not by config review):** a missing `tree-sitter-typescript` runtime dependency, present since Session 1.4 and never added to `requirements.txt`; `cli/package.json`'s `bin`/`main` pointing at a path that does not exist in the real build output (a Session-0.2-era bug, never caught because the scaffold was never actually installed end-to-end before this session); compiled test files leaking into the npm tarball; and a "Python engine not installed" detection regex matching a message shape that can never actually occur given how the wrapper invokes Python, found only by running the real wrapper against a real interpreter.

**Sign-off status:** **Signed** — Yehor Kaliberda, 04.07.26. Not yet live: no release tag has been pushed, PyPI Trusted Publishing is not yet configured, `NPM_TOKEN` is not yet set (see this session's runbook, Part C).

---

## What "proof of process" means for this project, concretely

Every one of the ten sessions summarized above followed the same five-stage discipline: a contract restated and locked before any code was written; every non-trivial block traced to a requirement, an assumption, and a named test; an adversarial verify pass that actively tried to break the work rather than confirm it; a report disclosing exactly what was tested, what broke, and what remains unverified; and a place for Yehor's own signature that no session has ever filled in on his behalf. Seventeen real defects were found and fixed across these ten sessions (1 + 0 + 1 + 2 + 2 + 0 + 3 + 2 + 2 + 4, per the table above), the majority of them by adversarial testing against real built artifacts rather than by code review alone. That ratio — defects caught by *running the thing*, not by *reading the thing* — is the actual, load-bearing claim behind "deterministic proof" as a product premise, and this manifest exists so that claim can be checked against ten independent, individually-falsifiable records rather than taken on faith.

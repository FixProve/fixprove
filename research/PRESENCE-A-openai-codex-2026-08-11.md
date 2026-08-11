## EXECUTIVE VERDICT

[VERIFIED] FixProve already exposes a specific failure mode, live packages in two ecosystems, a public repository, and a deterministic no-model mechanism. [INFERRED] Its main commercial defect is not visual polish but an absent proof path: homepage claims cannot be followed into documentation, source, packages, release history, or a reproducible result. [RESEARCHED] (H) The wedge is real but narrow and crowded: existing linters and type checkers overlap, while recent research demonstrates closely related AST-and-oracle methods. [INFERRED] Treat the current presence as a technically credible alpha, not yet a CI trust product; make the evidence navigable before approaching partners.

## SEVERITY INDEX

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| R1 | [INFERRED] Qualified traffic meets a clear promise but no linked proof or next technical step. | High | M |
| R2 | [INFERRED] Pain-led framing is stronger; the current headline overstates breadth and understates mature-tool overlap. | High | M |
| R3 | [INFERRED] Visible business and engineering evidence is insufficient for a complete 60-second trust check. | High | M |
| R7 | [INFERRED] A dead link, missing root licence, absent releases, and root clutter contradict otherwise disciplined publishing. | High | H |

## R1 — FUNNEL MAP AND LEAK DIAGNOSIS

### R1.FINDINGS
CLAIM: [INFERRED] FixProve explains the failure mode quickly, then asks for trust before supplying navigable proof.

- [VERIFIED] The homepage names the mechanism, shows install commands, illustrates two bad references, offers a waitlist, and discloses the private App status (F14–F16).
- [VERIFIED] It links to neither source, registries, nor documentation; `/docs` is a 404, `/terms` is orphaned, and the footer has no trader or contact identity (F13, F18–F19).
- [INFERRED] A qualified engineer can understand what FixProve claims within 60 seconds but cannot verify behaviour, compatibility, limitations, maintenance, or licence without leaving the intended funnel and searching manually.
- [INFERRED] The site therefore optimises for comprehension and email capture before it has earned installation or CI trust.

### R1.TOUCHPOINT-MAP
CLAIM: [INFERRED] Every meaningful path either requires manual search, asks for an unearned install, or terminates at the waitlist.

| Touchpoint | Visitor is trying to learn or do | What the visitor actually gets | Leak or terminal outcome |
|---|---|---|---|
| Generic search or AI answer | [INFERRED] Find a tool for hallucinated imports and APIs. | [VERIFIED] One three-page site, registry pages, a public repository, no docs, blog, demo, screenshots, or external signals (F13, F23, F32, F37). | [INFERRED] FixProve is unlikely to enter the consideration set; terminal outcome: never arrives. |
| Direct homepage hero | [INFERRED] Decide whether this addresses the problem. | [VERIFIED] A memorable but broad H1, a precise subhead, and three commands (F14). | [INFERRED] Problem comprehension succeeds; breadth ambiguity remains. |
| Problem example | [INFERRED] See whether the product catches a realistic failure. | [VERIFIED] Two erroneous references in a diff-style example, but no FixProve output or before/after execution (F14, F32). | [INFERRED] The page illustrates the problem but does not prove detection. |
| Install block | [INFERRED] Evaluate requirements, expected output, compatibility, and reversibility before running code. | [VERIFIED] Copyable commands and one wrapper note, but no package links, quickstart, output, requirements matrix, or documentation (F14, F19, F32). | [INFERRED] Some copy the command and install; most proof-sensitive evaluators pause or leave. |
| GitHub App note | [INFERRED] Add a blocking CI check. | [VERIFIED] The App is private, not installable by third parties, and finding fragments transit the endpoint (F12, F14–F15). | [INFERRED] No current third-party App action exists; the honest route is CLI evaluation or waitlist. |
| Waitlist | [INFERRED] Preserve future intent. | [VERIFIED] An email capture with complete consent language and a Privacy link (F14, F16). | [VERIFIED] Terminal outcome: joins waitlist; [INFERRED] the page gives little product-specific reason to do so beyond future availability. |
| Footer and policies | [INFERRED] Verify operator, contact, Terms, and data handling. | [VERIFIED] The footer contains only the brand; Privacy is linked, Terms is not, and identity/contact live only inside policies (F18–F19). | [INFERRED] Email contact and legal verification require extra discovery; some leave. |
| Manually found GitHub | [INFERRED] Inspect code, licence, releases, activity, and evidence. | [VERIFIED] Source and badges exist, but there is no detected root licence, no Releases, zero external signals, and 59 process-heavy markdown files (F20–F25). | [VERIFIED] Terminal outcome: may star; [INFERRED] present evidence is insufficient for many CI adopters. |
| Manually found PyPI | [INFERRED] Validate Python distribution and install. | [VERIFIED] Seven versions exist, but the promoted App link returns 404 (F11, F24–F25). | [VERIFIED] Terminal outcome: may install; [INFERRED] the dead link creates immediate doubt. |
| Manually found npm | [INFERRED] Validate the JavaScript/TypeScript route. | [VERIFIED] v0.1.10 has OIDC provenance, but it is a wrapper requiring the Python engine (F9–F10, F25). | [VERIFIED] Terminal outcome: may install; [INFERRED] cross-runtime friction reduces adoption among JS-only teams. |

### R1.SINGLE-BIGGEST-LEAK
CLAIM: [INFERRED] The largest loss is promise-to-proof: roughly 60% at that step, or about 54 of the original 100 visitors.

[INFERRED] Planning model, not observed analytics: 100 qualified engineers land; about 90 understand the promise; about 36 proceed to a proof surface or run an installation; roughly 54 abandon between understanding and evidence-backed action. [INFERRED] The 60% step loss has a reasonable uncertainty band of approximately ±15 percentage points because F17 establishes that no behavioural data exists. [INFERRED] No downstream step plausibly loses more people: the waitlist is optional, and GitHub, PyPI, npm, email, and starring are not even presented as linked next actions.

### R1.DISCOVERY
CLAIM: [INFERRED] Pre-arrival discovery is effectively branded; registries can find FixProve, but generic problem searches probably will not.

- [RESEARCHED] (H) A live four-query search check on 2026-08-11 returned research papers, security vendors, and adjacent products for generic hallucinated-API queries, but did not return FixProve; even the branded test did not surface it in the reviewed results.
- [VERIFIED] FixProve has no documentation site, blog, demo, screenshots, video, repository stars, forks, watchers, or open issues (F22–F23, F32).
- [INFERRED] The realistic current arrival channels are a direct founder link, an exact registry search, a direct repository link, or outreach; organic discovery from the problem category is weak.
- [INFERRED] The remedy is not generic “SEO”: publish a crawlable, technically specific explanation and proof page, interlink every owned surface, and earn legitimate third-party references through real technical work.

### R1.AGENT-DISCOVERY
CLAIM: [INFERRED] FixProve is unlikely to be named accurately without a branded cue; use a below-10% planning likelihood today.

- [VERIFIED] The raw homepage has a useful meta description and complete social cards, but no JSON-LD, canonical link, or referenced sitemap; the public corpus is only three pages (F13, F37).
- [RESEARCHED] (H) Structured data gives crawlers explicit clues about page meaning, and Schema.org's `SoftwareApplication` supports fields such as install URL, software version, runtime platform, and requirements ([Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [Schema.org](https://schema.org/SoftwareApplication)).
- [RESEARCHED] (H) A sitemap can help a new site with few external links, although Google says a small, comprehensively linked site may not need one and crawling is not guaranteed ([Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)).
- [RESEARCHED] (M) GEO experiments report that authoritative citations, quotations, and statistics can improve source visibility, but effectiveness varies by domain and system ([KDD 2024 GEO paper](https://arxiv.org/abs/2311.09735)).
- [INFERRED] Missing JSON-LD is therefore a repairable clarity defect, not the primary cause and not a guarantee of omission. The larger constraint is retrieval authority: thin indexable content, no technical citations, no external references, and no proof page.
- [INFERRED] If retrieved, an agent can describe the mechanism reasonably well from the H1, subhead, and meta description; it cannot confidently answer compatibility, limitations, observed accuracy, release history, or comparative coverage.

### R1.RECOMMENDATION
CLAIM: [INFERRED] Build one linked proof path before adding traffic: hero → reproducible example → package or source → optional waitlist.

1. [INFERRED] Add primary CTA **“See a failing example”** linking to `/docs/quickstart`, and secondary CTA **“View source”** linking to `https://github.com/FixProve/fixprove`.
2. [INFERRED] Make `/docs/quickstart` a reproducible v0.1.10 proof: one Python fixture, one TypeScript/JavaScript fixture, exact install/check commands, captured current output, expected exit status, and links to PyPI, npm, and source. Do not state runtime or coverage figures not measured during the capture.
3. [INFERRED] Add persistent links to GitHub, PyPI, npm, Privacy, Terms, and the existing contact address; do not make the private GitHub App a primary CTA.
4. [INFERRED] Add a canonical link and valid `SoftwareApplication` JSON-LD containing only F6–F12 facts: name, description, v0.1.10, author, site URL, and both install URLs. Add the licence only after confirming repository-wide scope; do not add ratings, offers, user counts, unsupported operating systems, or unverified requirements.
5. [INFERRED] After legal review of measurement, record aggregate transitions for hero-to-quickstart, quickstart-to-registry, source clicks, and waitlist completion; replace the 60% estimate with observed data.

### R1.STEELMAN-AGAINST
CLAIM: [INFERRED] Qualified engineers can already copy an install command, so missing links may matter less than weak urgency or mature-tool overlap.

[INFERRED] The strongest countercase is that a genuinely motivated engineer needs no CTA: `pip install fixprove` is already visible, and copying it is faster than reading documentation. [INFERRED] If the target user already runs Pyright, mypy, Pylint, or `tsc` and expects them to catch these errors, a proof page may reveal category redundancy rather than improve conversion. [INFERRED] Because there is no analytics, the real biggest loss could be product relevance rather than navigation; the recommendation should therefore pair a proof page with explicit comparative cases, not merely add links.

### R1.EFFORT
CLAIM: [INFERRED] The minimum coherent funnel repair requires 8 hours for one person.

[INFERRED] Estimate: two hours for links, footer, canonical metadata, and structured data; four hours for two captured quickstart fixtures and their page; two hours for cross-surface validation and mobile/accessibility checks. [INFERRED] Measurement implementation and legal review are excluded.

### R1.CONFIDENCE
CLAIM: [INFERRED] Confidence is M because surface facts are strong but the 60% loss estimate has no behavioural data.

M

## R2 — POSITIONING AND NARRATIVE

### R2.FINDINGS
CLAIM: [INFERRED] The mechanism is credible, but the current slogan promises broader proof than the product performs.

- [VERIFIED] FixProve verifies existence and resolvability of imports, symbols, methods, and attributes against installed dependencies without an LLM (F6–F9).
- [INFERRED] “Prove your code” commonly implies semantic correctness, formal verification, tests, security, or behavioural guarantees; the product's established scope is narrower.
- [INFERRED] “No model in the loop” is valuable supporting evidence, but it describes implementation rather than the user's urgent failure.
- [RESEARCHED] (H) Mature Python and TypeScript tooling already checks missing imports, attributes, calls, and module resolution, so a credible position must name the cases FixProve catches beyond correctly configured existing tools.

### R2.FRAMING-VERDICT
CLAIM: [INFERRED] Strongest framing: “Catch AI-written API calls that don't exist—against the dependencies actually installed in your project.”

[INFERRED] Use this exact homepage pair:

> **H1:** Catch AI-written API calls that don't exist.
>
> **Subhead:** FixProve checks Python and TypeScript/JavaScript imports, methods, and attributes against the dependencies installed in your project—deterministically, with no model in the loop.

[INFERRED] This leads with the failure, narrows the promise to API existence, names the ground truth, and retains determinism as the reason to believe. [INFERRED] Retire “Prove your code. Don't hope it.” as the H1; it may remain as an internal theme, not a product claim.

### R2.ICP
CLAIM: [INFERRED] Ideal first user: a staff engineer owning CI at a 10–50-person Python-first SaaS merging agent-generated dependency-heavy pull requests.

| Dimension | Exact profile |
|---|---|
| Role | [INFERRED] Staff/senior engineer or platform lead accountable for merge quality and CI reliability. |
| Company size | [INFERRED] A 10–50-person product company: enough AI-generated change volume to feel review overload, without a dedicated developer-productivity team. |
| Stack | [INFERRED] Python services with partially typed third-party dependencies, GitHub pull requests, and CI; TypeScript/JavaScript may be present but is not the acute initial wedge. |
| Trigger situation | [INFERRED] An agent-generated or dependency-migration PR introduces unfamiliar library calls; tests do not execute every path, and the reviewer cannot manually verify each external symbol. |
| Job to be done | [INFERRED] Fail the PR deterministically when a referenced dependency API is absent from the environment being built. |

[ASSUMED] This team is allowed to add an MIT CLI to CI. If that is false, the first user shifts to an individual engineer running the CLI locally before review, and the partner funnel must lead with a sandboxed evaluation.

### R2.LANDSCAPE
CLAIM: [RESEARCHED] (H) FixProve overlaps linting and type checking; installed-version grounding is a plausible wedge, not yet a moat.

| Category | Established capability | FixProve's overlap and remaining opening |
|---|---|---|
| Python linting | [RESEARCHED] (H) Pylint reports unavailable imports and nonexistent members; its own documentation also notes blind spots for dynamic code and C extensions ([import-error](https://pylint.readthedocs.io/en/v4.0.7/user_guide/messages/error/import-error.html), [no-member](https://pylint.readthedocs.io/en/v4.0.7/user_guide/messages/error/no-member.html)). | [INFERRED] Direct overlap is high. A real opening exists only where FixProve resolves installed libraries more completely or with lower noise, which needs a benchmark. |
| Python type checking | [RESEARCHED] (H) Pyright reports missing imports, attribute-access issues, and call issues; mypy checks imported names, attributes, and call signatures when type information exists ([Pyright configuration](https://github.com/microsoft/pyright/blob/main/docs/configuration.md), [mypy error codes](https://mypy.readthedocs.io/en/stable/error_code_list.html)). | [INFERRED] The wedge is untyped, partially typed, dynamically exposed, or version-skewed dependency surfaces. It is unproven until tested on the same environments. |
| TypeScript compiler | [RESEARCHED] (H) TypeScript module format and resolution affect both import resolution and type checking, including modern Node ESM/CJS behaviour ([TypeScript module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)). | [INFERRED] Overlap is strongest in well-typed TypeScript projects; FixProve must publish concrete `tsc`-passing cases it catches or narrow the TS claim. |
| Import validation | [RESEARCHED] (H) Import Linter enforces architectural contracts between Python modules rather than validating third-party API existence ([Import Linter](https://import-linter.readthedocs.io/en/stable/)). | [INFERRED] Adjacent terminology, limited functional overlap. |
| AI code review | [RESEARCHED] (H) CodeRabbit and Qodo provide broad, context-aware PR reviews using AI systems ([CodeRabbit](https://docs.coderabbit.ai/overview/pull-request-review), [Qodo](https://docs.qodo.ai/code-review)). | [INFERRED] FixProve is narrower and reproducible; it should complement these tools, not claim to replace review. |
| Deterministic verification products | [RESEARCHED] (M) Aviator Verify markets AST-based deterministic checks with an AI fallback for complex criteria ([Aviator Verify](https://www.aviator.co/verify)). | [INFERRED] “Deterministic verification for AI code” is already a contested phrase; FixProve should own installed-dependency API existence, not determinism in general. |
| Hallucination research | [RESEARCHED] (H) 2026 work uses ASTs plus documentation or introspection-derived API oracles, including Hallucination Inspector and deterministic AST analysis ([Hallucination Inspector](https://arxiv.org/abs/2604.20202), [deterministic AST analysis](https://arxiv.org/abs/2601.19106)). | [INFERRED] FixProve's concept is not unique. Its practical wedge is a maintained, installable, dual-ecosystem tool grounded in the user's installed versions—if accuracy and coverage are demonstrated. |

[RESEARCHED] (H) A 2026 empirical study found static analysis detected 14–85% of library hallucinations depending on model and dataset, while remaining structurally unable to catch all errors ([study](https://arxiv.org/abs/2604.07755)). [INFERRED] This supports the category but makes broad “proof” language untenable.

[VERIFIED] The root README claims “near-zero false positives,” while no benchmark or compatibility corpus exists (F25, F32). [INFERRED] This is the weakest informed-skeptic point: the most valuable claimed advantage is presently asserted rather than demonstrated, especially against dynamic Python and well-typed TypeScript baselines.

### R2.ONE-SENTENCE
CLAIM: [VERIFIED] FixProve deterministically checks AI-written Python and TypeScript/JavaScript references against the dependencies installed in the project.

### R2.RECOMMENDATION
CLAIM: [INFERRED] Lead with nonexistent APIs, then prove installed-version grounding against Pyright, mypy, Pylint, and tsc on a public corpus.

1. [INFERRED] Replace the H1 and subhead with the exact pair in `R2.FRAMING-VERDICT`.
2. [INFERRED] Publish a versioned comparison corpus containing at least ten Python and ten TypeScript/JavaScript cases, each run in the same locked environment against FixProve and the correctly configured baseline tool.
3. [INFERRED] For every case, publish source, lockfile, tool configurations, versions, commands, raw output, expected finding, and adjudication; separate true positives, false positives, unsupported dynamic cases, and duplicate findings.
4. [INFERRED] Retain “no model in the loop” as the first proof point beneath the outcome, not as the category headline.
5. [INFERRED] Do not call FixProve a general code prover, security scanner, or replacement for tests, type checking, linting, or human review.

### R2.STEELMAN-AGAINST
CLAIM: [INFERRED] The current slogan is memorable and future-flexible; a narrow API-existence headline may undersell the intended platform.

[INFERRED] A founder may rationally prefer a broad category claim before the product expands, and “Prove your code. Don't hope it.” is emotionally stronger than a diagnostic description. [INFERRED] A twenty-case comparison can also invite arguments over configuration and edge-case selection before user demand is established. [INFERRED] The answer is not to avoid precision: keep the broad line as brand language only after the first screen states the present capability exactly.

### R2.EFFORT
CLAIM: [INFERRED] Reframing requires 2 hours; the minimum credible comparison corpus requires another 12 hours.

[INFERRED] Total: 14 one-person hours, excluding fixes revealed by the comparison and independent replication.

### R2.CONFIDENCE
CLAIM: [INFERRED] Confidence is M because tool overlap is documented, but FixProve lacks benchmarks and ICP interviews.

M

## R3 — CREDIBILITY ARCHITECTURE

### R3.FINDINGS
CLAIM: [INFERRED] All three evaluators can verify FixProve is real, but none can complete a 60-second trust check.

[VERIFIED] The business identity, product packages, repository, policies, and publishing provenance are real and inspectable (F1–F12, F20–F25). [INFERRED] The failure is assembly: decisive facts are scattered, important links are absent, and the public evidence does not connect claim → implementation → release → limitation → accountable operator.

### R3.VERDICT-ADVOKAT
CLAIM: [INFERRED] The advokat sees an identifiable, transparent sole trader but an unfinished public legal and contact architecture.

| Order | 60-second check | Present conclusion |
|---|---|---|
| 1 | [INFERRED] Who is the counterparty and controller? | [VERIFIED] Policies identify FixProve v/Yehor Kaliberda, CVR 46646223, and personal controller/contracting responsibility, but the homepage does not (F1–F2, F19). |
| 2 | [INFERRED] Are Terms and Privacy easy to reach and internally candid? | [VERIFIED] Privacy is linked and the data-flow limitation is explicit; Terms is orphaned; both state independent review is incomplete (F5, F15, F18). |
| 3 | [INFERRED] Are marketing and legal claims aligned? | [VERIFIED] Current copy discloses transiting fragments and does not repeat the removed absolute-locality claim (F14–F15, F36). |
| 4 | [INFERRED] Can the evaluator contact and identify the trader from the commercial surface? | [VERIFIED] No trader identification or contact appears on the homepage (F19). |

[INFERRED] Verdict: candid and traceable early-stage operator, not yet professionally assembled for relationship due diligence. [INFERRED] Failure point: the evaluator must discover essential counterparty, Terms, and contact information indirectly. This is a credibility assessment, not a legal sufficiency opinion.

### R3.VERDICT-ENGINEER
CLAIM: [INFERRED] The engineer sees plausible packages and strong npm provenance, then stops at missing proof, licensing, releases, and documentation.

| Order | 60-second check | Present conclusion |
|---|---|---|
| 1 | [INFERRED] Can I inspect and install it? | [VERIFIED] Yes: public repo, PyPI and npm v0.1.10, and install commands exist (F9, F14, F20, F25). |
| 2 | [INFERRED] Is the source licence unambiguous? | [VERIFIED] No root licence is detected despite subdirectory MIT files and a Terms claim (F20). |
| 3 | [INFERRED] Is a registry artefact tied to source? | [VERIFIED] npm OIDC provenance and matching `gitHead` are unusually strong (F10). [RESEARCHED] (H) npm provenance lets consumers inspect build environment, workflow, and source commit ([npm documentation](https://docs.npmjs.com/viewing-package-provenance/)). |
| 4 | [INFERRED] Is version history and maintenance visible? | [VERIFIED] Seven PyPI versions exist, but GitHub has zero Releases and zero external signals (F11, F22–F23). |
| 5 | [INFERRED] Can I reproduce a finding and understand limitations? | [VERIFIED] No docs, changelog, demo, benchmark, screenshots, or video exist (F32). |
| 6 | [INFERRED] What data crosses a service boundary? | [VERIFIED] The current disclosure states exactly which finding fragments transit the endpoint, encrypted and unpersisted (F14–F15). |

[INFERRED] Verdict: inspectable alpha worth a local experiment, not yet a justified blocking CI dependency.

### R3.VERDICT-PARTNER
CLAIM: [INFERRED] A prospective partner sees a sharp problem, but no evidence sufficient to justify implementation dependence.

| Order | 60-second check | Present conclusion |
|---|---|---|
| 1 | [INFERRED] Is the pain specific and current? | [VERIFIED] Yes: hallucinated imports, renamed methods, and nonexistent API calls are named directly (F7, F14). |
| 2 | [INFERRED] Is there a working product rather than a concept? | [VERIFIED] CLI packages and a private blocking App exist (F8–F12). |
| 3 | [INFERRED] Can we evaluate it quickly and safely? | [VERIFIED] Install commands exist, but no quickstart proof, docs, limitation register, or benchmark does (F14, F32). |
| 4 | [INFERRED] Is there a reliable accountable relationship? | [VERIFIED] A named sole trader exists, but contact and identity are absent from the homepage and legal review remains open (F1–F5, F19). |
| 5 | [INFERRED] Is there evidence beyond the founder's own assertions? | [VERIFIED] Stars, forks, watchers, issues, and Releases are all zero (F22–F23). |

[INFERRED] Verdict: credible reason to accept an exploratory conversation, insufficient reason to depend on the product or promise a rollout.

### R3.SOLE-PROP
CLAIM: [INFERRED] Sole proprietorship is not disqualifying at beta stage; opaque identity and continuity planning would be.

[VERIFIED] Yehor is personally the controller and contracting party (F1–F2). [INFERRED] That can increase clarity because responsibility is not hidden behind a shell, but it also concentrates continuity, support, and counterparty risk in one person. [INFERRED] The correct response is not corporate theatre: display the exact trader identity, CVR, location, contact, and links consistently; state beta status and App availability accurately; answer continuity questions directly in partner conversations.

### R3.ZERO-SIGNALS
CLAIM: [INFERRED] Zero social proof converts only when first-party evidence is unusually reproducible, inspectable, and current.

[VERIFIED] GitHub shows no external engagement signals (F22–F23). [INFERRED] At this stage, the honest substitutes are not testimonials or synthetic activity; they are a reproducible five-minute example, a detected licence, release notes tied to tags, raw comparison results, known limitations, a compatibility matrix, a public issue path, and verifiable publishing provenance. [INFERRED] These do not prove demand, but they let an evaluator verify engineering claims without trusting popularity.

### R3.RECOMMENDATION
CLAIM: [INFERRED] Replace absent social proof with a trust spine: identity, licence, release, demo, limitations, data flow, and contact.

1. [INFERRED] Add this global footer structure using the existing policy contact address: **“FixProve v/Yehor Kaliberda · CVR 46646223 · Aarhus, Denmark · Contact · Privacy · Terms.”**
2. [INFERRED] Add `/docs/trust` containing only verified facts: product and App status; exact local-versus-endpoint boundary; no-persistence statement; current package versions; links to source, licence, releases, policies, and contact; explicit “independent legal review in progress.”
3. [INFERRED] Put **“Public beta · no paid tier · GitHub App not open for third-party installation”** beside the App section, not in a distant policy.
4. [INFERRED] Complete the root licence, v0.1.10 GitHub Release, reproducible quickstart, comparison corpus, and known-limitations register before using “CI trust” language in outreach.
5. [INFERRED] Send `/docs/trust`, not the homepage alone, when approaching an advokat or design partner.

### R3.STEELMAN-AGAINST
CLAIM: [INFERRED] A trust page before legal review could create contradictions; minimal navigation repair may be safer until counsel finishes.

[INFERRED] Consolidating privacy, contracting, and operational statements onto a new public page increases the number of surfaces that must remain consistent with evolving legal documents. [INFERRED] A sophisticated lawyer may also prefer candid source documents over a polished trust page. [INFERRED] Mitigation: copy only verified, already-public facts, link rather than paraphrase legal clauses, place the page under the same legal-review checklist, and delay any new assurance language.

### R3.EFFORT
CLAIM: [INFERRED] The minimum identity, navigation, and trust-spine repair requires 6 hours for one person.

[INFERRED] Estimate: two hours for global footer and link validation; four hours for a fact-only trust page and consistency check. [INFERRED] Counsel time, root proof work, and benchmark creation are excluded.

### R3.CONFIDENCE
CLAIM: [INFERRED] Confidence is M because visible defects are verified but evaluator reactions remain reasoned predictions.

M

## R7 — PROOF SURFACES

### R7.FINDINGS
CLAIM: [INFERRED] Registries prove shipping discipline, while GitHub undermines adoption through licence ambiguity, release gaps, and process clutter.

- [VERIFIED] Seven PyPI versions, current npm/PyPI parity, npm trusted publishing, provenance, and a matching source commit demonstrate real release work (F9–F11).
- [VERIFIED] The same evaluator sees no detected root licence, no GitHub Releases, zero external signals, no docs/demo/benchmark, and a PyPI-promoted 404 (F20–F24, F32).
- [INFERRED] The evidence is not absent; it is arranged so that low-value uncertainty appears before high-value proof.

### R7.GITHUB
CLAIM: [INFERRED] GitHub reads as an active internal build archive, not yet a deliberately packaged open-source product.

[VERIFIED] Positive evidence: a 71-line root README, five status badges, install commands, source code, CI status, licence pointers, registry versions, tags, and npm provenance (F20, F22, F25). [VERIFIED] Negative evidence: GitHub detects no root licence, Releases are empty, 59 tracked markdown files dominate ten directories, and no product documentation or benchmark exists (F20–F23, F32).

[RESEARCHED] (H) GitHub displays a detectable licence prominently, and Releases package deployable iterations around tags with notes and subscriptions ([licence documentation](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository), [release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)).

[INFERRED] Exact remediation:

1. [ASSUMED] If the entire repository is intended to be MIT, verify `cli/LICENSE` and `engine/python/LICENSE` are the intended text, add the same text as `/LICENSE`, and point the badge to `/LICENSE`. If scope differs, publish a root licence map instead of a global MIT file.
2. [INFERRED] Create a GitHub Release for v0.1.10 from the matching tag, listing shipped engines, registry links, known limitations, and upgrade notes; do not invent backfilled dates or compatibility claims.
3. [INFERRED] Add `/docs/quickstart.md`, `/docs/known-limitations.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and `SECURITY.md`, then link them from the first README screen.
4. [INFERRED] Move session reports, starting prompts, watchlists, and build plans into `/project-history/`, preserving git history; add one index explaining why the archive remains public.

### R7.PYPI
CLAIM: [INFERRED] PyPI shows repeated shipping but loses trust through a promoted GitHub App link that returns 404.

[VERIFIED] The project has seven published versions and a 43-line package description, but its App project URL is dead (F11, F24–F25). [INFERRED] This is the highest-impact-per-hour registry repair because it converts an explicit promise into visible failure.

[INFERRED] Exact remediation:

1. [INFERRED] Serve `/app` as a 200 status page whose opening sentence is: **“The FixProve GitHub App is currently limited to internal use and is not open for third-party installation.”** Link CLI quickstart, PyPI, npm, source, Privacy, and Terms; offer no install button.
2. [INFERRED] In the next authorised package release, rename the PyPI project URL from **“GitHub App (CI)”** to **“GitHub App status”** so availability is not implied.
3. [INFERRED] Put the captured Python quickstart and expected output into `engine/python/README.md`, followed by source, changelog, limitations, and contact links.
4. [RESEARCHED] (H) Move PyPI publication to a Trusted Publisher with hosted attestations if not already configured; PyPA recommends short-lived publisher credentials and current actions can upload PEP 740 attestations ([PyPA guide](https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/)).

### R7.NPM
CLAIM: [INFERRED] npm provenance is excellent, but the wrapper creates a two-ecosystem adoption cost that must be disclosed before installation.

[VERIFIED] npm v0.1.10 is OIDC-published, provenance-attested, and tied to the verified source commit; the package is a wrapper and requires the Python resolver engine (F9–F10). [RESEARCHED] (H) npm states trusted publishing automatically generates provenance and gives consumers build and source-commit evidence ([npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [viewing provenance](https://docs.npmjs.com/viewing-package-provenance/)).

[INFERRED] Exact remediation: make the first two lines of `cli/README.md` read:

> **FixProve for npm is a CLI wrapper around FixProve's Python resolver engine.**
>
> **Install both components:** `npm install -g fixprove` and `pip install fixprove`.

[INFERRED] Follow with one TypeScript/JavaScript fixture, exact current output, an engine-detection troubleshooting block, and direct links to provenance, source, limitations, and the quickstart. [INFERRED] Do not imply a TypeScript-native resolver or silently install Python from npm.

### R7.PROCESS-DOCS-VERDICT
CLAIM: [INFERRED] The process archive signals discipline after inspection; at repository entry it primarily signals weak product-boundary curation.

[VERIFIED] The repository contains 59 tracked markdown files, predominantly session logs, reports, prompts, watchlists, and build plans, against ten directories (F21). [INFERRED] The positive reading is unusual traceability: decisions and verification work are inspectable. [INFERRED] The stronger 60-second reading is curation failure: internal operating artefacts outnumber and visually outrank a short product README, making navigation harder and leaving evaluators unsure which documents are current or normative. [INFERRED] Preserve the transparency, but move it behind one clearly labelled `/project-history/README.md`; keep the root for product use, contribution, security, licence, changelog, and architecture.

### R7.RANKED-REMEDIATIONS
CLAIM: [INFERRED] Repair the broken promise and licence ambiguity before root cleanup or new proof assets.

| Rank | Remediation across GitHub, PyPI, and npm | Effort (hours) | Impact (1–5) | Why this rank |
|---:|---|---:|---:|---|
| 1 | [INFERRED] Serve a transparent 200 `/app` status page and relabel the next PyPI project URL. | 1 | 5 | [VERIFIED] Removes a live, promoted 404 without opening the App. |
| 2 | [INFERRED] Add the correctly scoped root `LICENSE` or licence map and repair the badge. | 1 | 5 | [RESEARCHED] (H) Restores GitHub's immediate licence signal. |
| 3 | [INFERRED] Create the v0.1.10 GitHub Release from the matching tag. | 2 | 4 | [INFERRED] Connects package shipping to an inspectable release narrative. |
| 4 | [INFERRED] Put the Python-engine requirement in the first two npm README lines. | 1 | 4 | [INFERRED] Prevents avoidable surprise at the JS entry point. |
| 5 | [INFERRED] Add captured Python and TS/JS quickstarts to all three README surfaces. | 4 | 5 | [INFERRED] Converts claims into reproducible product evidence. |
| 6 | [INFERRED] Configure PyPI Trusted Publishing and attestations if absent. | 3 | 3 | [INFERRED] Extends existing npm supply-chain discipline across registries. |
| 7 | [INFERRED] Relocate process documents under one indexed project-history directory. | 4 | 4 | [INFERRED] Improves first-screen curation without deleting transparency. |
| 8 | [INFERRED] Publish the versioned comparison corpus and compatibility/limitations matrix. | 12 | 5 | [INFERRED] Highest strategic proof, but lower impact per hour than repairs above. |

### R7.STEELMAN-AGAINST
CLAIM: [INFERRED] Early adopters may value process transparency, tags identify versions, and registries—not GitHub Releases—are the real distribution channels.

[INFERRED] The repository can be read as a deliberate evidence ledger, not clutter; moving files may hide the very discipline FixProve wants to signal. [INFERRED] GitHub Releases can duplicate PyPI/npm history, and a root MIT file may oversimplify a monorepo with component-specific scope. [INFERRED] The recommendation survives only if it preserves history, avoids false global licensing, and makes Releases concise pointers rather than redundant prose.

### R7.EFFORT
CLAIM: [INFERRED] The complete ranked proof-surface backlog totals 28 one-person hours.

[INFERRED] The first four repairs total five hours and should precede the 23-hour proof and curation work.

### R7.CONFIDENCE
CLAIM: [INFERRED] Confidence is H because the defects are directly observable and the remediation mechanics are standard.

H

## PRIORITISED BACKLOG

| Rank | Action | Surface | Effort (integer hours, one person) | Impact (1-5) | Needs legal review (Y/N) | Reversible (Y/N) |
|---:|---|---|---:|---:|:---:|:---:|
| 1 | [INFERRED] Serve the factual `/app` status page and remove the 404. | Website / PyPI | 1 | 5 | N | Y |
| 2 | [INFERRED] Add a correctly scoped root licence or licence map and repair the badge. | GitHub | 1 | 5 | Y | Y |
| 3 | [INFERRED] Link GitHub, PyPI, npm, Terms, contact, and trader identity globally. | Website | 2 | 5 | Y | Y |
| 4 | [INFERRED] Publish and link the reproducible Python and TS/JS quickstart. | Website / registries | 6 | 5 | N | Y |
| 5 | [INFERRED] Replace the H1 and subhead with the pain-led exact copy in R2. | Website | 2 | 4 | N | Y |
| 6 | [INFERRED] Create the v0.1.10 GitHub Release with limitations and registry links. | GitHub | 2 | 4 | N | Y |
| 7 | [INFERRED] Put the Python-engine requirement first on npm. | npm | 1 | 4 | N | Y |
| 8 | [INFERRED] Add canonical metadata and fact-only `SoftwareApplication` JSON-LD. | Website | 2 | 3 | N | Y |
| 9 | [INFERRED] Consolidate process artefacts under an indexed project-history directory. | GitHub | 4 | 3 | N | Y |
| 10 | [INFERRED] Publish the comparative benchmark, compatibility matrix, and limitations register. | GitHub / docs | 12 | 5 | N | Y |
| 11 | [INFERRED] Publish the fact-only trust page after consistency review. | Website | 6 | 4 | Y | Y |
| 12 | [INFERRED] Define aggregate funnel events and obtain privacy/legal approval before instrumentation. | Website | 4 | 3 | Y | Y |

## WHAT I WOULD DO FIRST

[INFERRED] Publish `/docs/quickstart` with one reproducible failing Python example and one TypeScript/JavaScript example, capture v0.1.10's actual output, and link that single proof page from the hero and every package README. This one action attacks the largest conditioned funnel leak, tests whether the positioning survives comparison with existing tooling, and creates evidence usable by an engineer, advokat, partner, search engine, and answer engine without manufacturing social proof.

## ASSUMPTIONS I HAD TO MAKE

- [ASSUMED] The ideal first-user team may add an MIT CLI to local or CI workflows. If false, lead with a sandboxed evaluation and individual local use rather than CI adoption.
- [ASSUMED] v0.1.10 can produce stable, readable output for small Python and TypeScript/JavaScript fixtures. If false, use a verbatim recorded transcript, disclose instability, and do not promise a five-minute quickstart.
- [ASSUMED] The repository is intended to be MIT across its full scope. If false, do not add a global root MIT file; publish a component-by-component licence map and obtain legal confirmation.
- [ASSUMED] The contact address already present in the policies is intended for business and technical inquiries. If false, create a dedicated address before adding a global contact link.
- [ASSUMED] A live general web-search check is a useful directional proxy for agent retrieval. If false, the below-10% agent-discovery estimate may be wrong; test the exact query across named answer engines and record results separately.

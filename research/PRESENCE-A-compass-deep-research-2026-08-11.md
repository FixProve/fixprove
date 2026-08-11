Title: Public Presence Assessment — FixProve (Prompt A)

## EXECUTIVE VERDICT
FixProve's single largest problem is not the product — it is that the homepage is a dead end that gives a qualified engineer nothing to verify and no next click. [VERIFIED F19] The site links to no repository, no package page, and no docs while inviting the reader to "read the source," so the largest on-site leak is the gap between reading the pitch and finding proof. The positioning ("deterministic, no model in the loop") is good but overclaims uniqueness: CLI Pyright already resolves imports and attributes against installed dependencies by default and, per its own configuration docs, "reads, parses and analyzes library code to extract type information in the absence of type stub files" with that behavior defaulting to true [RESEARCHED, H] — so the defensible wedge is narrower: runtime introspection of untyped/dynamic libraries where mypy is blind and Pyright's static parse is admittedly incomplete. For the Danish-lawyer use case, the credibility surfaces are currently net-negative: a 404 in PyPI's own sidebar, zero releases, zero stars, and a repo root dominated by 59 internal process markdown files read as abandonment or amateurism within 60 seconds.

## SEVERITY INDEX
| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| R1 | Homepage is a terminal dead-end: no repo/package/docs links, so proof-seeking engineers leave | High | H |
| R2 | Framing overclaims uniqueness vs Pyright; real wedge is narrower and unstated | High | M |
| R3 | Credibility surfaces net-negative for a lawyer/partner doing a 60-second search | High | M |
| R7 | Proof surfaces broken/noisy: 404 link, 0 releases, no root LICENSE, 59 process-doc MDs | High | H |
| X1 | Zero machine-readable structured data (no JSON-LD), so AI answer-engines cannot cite FixProve accurately | Medium | H |
| X2 | Live legal exposure pattern: marketing/privacy contradiction existed on 4 surfaces, corrected 2026-08-08 | Medium | H |

## R1 — FUNNEL MAP AND LEAK DIAGNOSIS

### R1.FINDINGS
The site has exactly three real pages [VERIFIED F13]. The homepage carries a strong hook, an honest install block, a diff example, and a waitlist capture, but no outbound path to any artifact the reader can inspect [VERIFIED F14, F19]. There is no analytics of any kind [VERIFIED F17], so every judgement here is from first principles. The terminal outcomes available are: copy an install command, join the waitlist, or leave. Starring/emailing/filing an issue require the reader to first find the repo, which the site never links [VERIFIED F19]. This is the core structural flaw: the copy explicitly invites source inspection while withholding the link that would enable it.

### R1.TOUCHPOINT-MAP
CLAIM: Every touchpoint funnels the visitor toward install or waitlist, but the missing repo/package/docs links strand proof-seekers with no next step.
- Arrival (H1 + subhead): visitor wants to learn "what is this in one line." They get a clear, memorable claim [VERIFIED F14]. Low leak.
- Command block: visitor wants "how do I try it." They get three copy-able commands [VERIFIED F14]. But there is no confirmed "copy" button and no link to the package pages to verify the commands are real. Medium leak.
- Problem/diff section: visitor wants "is this a real problem and does the tool catch it." They get a concrete `pd.read_exel` / `fastapi_helpers` diff [VERIFIED F14]. Good — this is the strongest block.
- GitHub App note: visitor wants "can I use this in CI now." They learn it is internal-only, not open for third-party install, no paid tier [VERIFIED F14]. Honest but deflating; no CTA recovers the disappointed reader.
- Waitlist capture: visitor wants "what do I get for my email." They get launch news only, with GDPR-correct consent copy [VERIFIED F16]. Weak value exchange.
- Footer: "FixProve · fixprove.dev" only [VERIFIED F14] — no repo, no contact, no trader ID. Dead end.

### R1.SINGLE-BIGGEST-LEAK
CLAIM: Of 100 qualified engineers landing on the homepage, roughly 60–75 are lost at the single step from reading the pitch to seeking proof, because no link to repo, package, or docs exists.
The homepage invites source inspection but links to nothing inspectable [VERIFIED F19]. A qualified engineer's reflex after a compelling claim is to click through to GitHub/PyPI to check activity, license, and code. That click is impossible on-site. Most will open a new tab and search "fixprove github" — and many will not bother, or will find the discouraging repo (see R7) and leave. I estimate this single step loses a strong majority; naming one figure: ~65%. It exceeds the waitlist-conversion leak because it happens earlier and to more people.

### R1.DISCOVERY
CLAIM: Pre-arrival discovery is effectively nil today; there is no plausible organic path onto the page for a stranger who was not handed the URL.
Nothing in the Fact Base creates inbound discovery. There is no blog, no changelog, no docs site, no Show HN, no package-README backlinks that pull traffic [VERIFIED F32]. The repo has zero stars/forks/watchers [VERIFIED F23], so it does not surface in GitHub trending or search. PyPI/npm listings exist [VERIFIED F9] but package-registry search is low-intent and name-driven; "fixprove" is not a term anyone searches. Realistically, every current visitor arrives because the founder personally sent the link. For the immediate use case (Danish lawyers/partners who search his name and the product before replying), discovery is not organic — it is the founder's outreach — which means the on-site and proof surfaces must carry 100% of the persuasion load.

### R1.AGENT-DISCOVERY
CLAIM: A general AI assistant is very unlikely to name FixProve accurately for the target query, because the site carries zero machine-readable structured claims about what it is.
Asked "what tools deterministically verify AI-generated code against installed dependencies," an answer-engine surfaces what it can extract as fact. FixProve's page has a good `<meta description>` and complete Open Graph/Twitter tags [VERIFIED F37] — optimized for a human sharing a link, not for a crawler extracting facts. There is no JSON-LD, no schema.org SoftwareApplication or Organization block, no canonical tag, no robots meta, no sitemap reference [VERIFIED F37]. GEO practice holds that structured data is how crawlers extract citable claims without ambiguity — as one 2026 B2B GEO guide puts it, "If your pages lack JSON-LD schema markup, clear header hierarchies, and direct answer sections, RAG systems skip you entirely" because "they cannot extract your data with confidence, and citing ambiguous content creates hallucination risk" [RESEARCHED, M]. Competitors (slop-scan, VibeDoctor, deptry, Endor Labs, Socket) have far richer indexed content — blogs, docs, third-party coverage — so an agent will name them and omit FixProve. Enabling factors present: clear H1/subhead text, an unambiguous category phrase. Limiting factors dominant: no structured data, no docs corpus, no third-party mentions, a name-collision problem (many "fix"/"prove" projects). Net likelihood of accurate naming today: low.

### R1.RECOMMENDATION
CLAIM: Add three outbound proof links to the homepage and a JSON-LD SoftwareApplication block, converting the dead end into a verifiable path.
1. Add a visible links row directly under the command block with this exact text and targets: "Source on GitHub" → https://github.com/FixProve/fixprove ; "Python package (PyPI)" → https://pypi.org/project/fixprove/ ; "npm package" → https://www.npmjs.com/package/fixprove. 2. Add a "copy" button to each of the three install commands. 3. Add a `<script type="application/ld+json">` SoftwareApplication block to the homepage `<head>` declaring name "FixProve", applicationCategory "DeveloperApplication", operatingSystem "Cross-platform", the one-line description matching the subhead, and offers/url pointing to the package pages (no price). 4. Link /terms from the footer to de-orphan it [VERIFIED F18]. Keep the GDPR consent copy verbatim [VERIFIED F16].

### R1.STEELMAN-AGAINST
The strongest case against my "biggest leak = missing proof links" claim: the GitHub App being internal-only [VERIFIED F14] may mean the founder deliberately does NOT want strangers inspecting a repo full of raw session logs (R7), and linking to a discouraging repo could convert MORE people to "leave" than the missing link does today. Under that reading, the biggest leak is actually the value-exchange at the waitlist (nothing concrete offered), not the missing links, and adding links before cleaning the repo would deepen the leak, not fix it. This is why R7's repo cleanup must precede or accompany the link addition — my recommendation is only safe if sequenced after the repo is presentable.

### R1.EFFORT
6

### R1.CONFIDENCE
M

## R2 — POSITIONING AND NARRATIVE

### R2.FINDINGS
The current framing is deterministic AST-level verification that AI-generated code references real, installed symbols, with no model in the loop [VERIFIED F6, F7]. This is a genuinely good, differentiated hook against the noisy "AI reviews your AI" category. But the implicit claim of uniqueness is weak: CLI Pyright, run with dependencies installed, already reports uninstalled imports (`reportMissingImports`, error by default) and bad attributes on real libraries (`reportAttributeAccessIssue`, error by default), and by default parses untyped library source — its configuration docs state `useLibraryCodeForTypes` "Determines whether pyright reads, parses and analyzes library code to extract type information in the absence of type stub files" and that "The default value for this option is true" [RESEARCHED, H]. mypy catches these too for typed libraries but misses untyped ones: per mypy's own docs it will emit "module is installed, but missing library stubs or py.typed marker [import-untyped]" and then "will continue to be of type Any," so it does not infer types for third-party libraries lacking py.typed/PEP 561 stubs [RESEARCHED, H]. Ruff does neither [RESEARCHED, H]. So the honest wedge is narrower than "we verify against installed deps."

### R2.FRAMING-VERDICT
CLAIM: The framing is strong but overclaims; the stronger version names the specific gap — catching hallucinated symbols in untyped/dynamic libraries that type checkers can't see — plus zero-config CI.
Replace the uniqueness implication with a claim an informed skeptic cannot puncture. The defensible facts: (1) type checkers require type stubs or clean static parsing; for untyped/dynamic libraries mypy is blind — and pandas' own contributing docs confirm "pandas is not yet a py.typed library (PEP 561)!," so a plain pandas install gives mypy nothing to check [RESEARCHED, H] — while Pyright's source-parse is admittedly incomplete for dynamic libraries; (2) FixProve is single-purpose and zero-config in CI rather than a general type checker teams must adopt and tune; (3) determinism / no tokens / near-zero false positives [VERIFIED F6, F25]. The strongest framing leads with the failure mode (AI writes calls to things that don't exist), not the mechanism.

### R2.ICP
CLAIM: The ideal first user is a solo founder or lead engineer at a 2–20-person AI-native startup shipping Python/TypeScript written largely by Cursor/Claude Code, merging fast with thin review.
Role: founding engineer or tech lead who is also the de-facto reviewer. Company size: 2–20 people, pre- or early-Series-A. Stack: Python and/or TS, heavy AI-assisted codegen (Cursor, Claude Code, Copilot), GitHub, minimal CI, sparse tests. Situation of acute pain: they are merging agent-generated PRs faster than anyone can read them; a hallucinated import or a renamed method (`pd.read_exel`) slips through and breaks a deploy or, worse, invites slopsquatting risk. They have no time to adopt and configure mypy across a legacy codebase. They want one command in CI that deterministically says "this references something that doesn't exist." This person feels the pain weekly and can adopt a CLI in minutes without procurement.

### R2.LANDSCAPE
CLAIM: FixProve sits between type checkers (Pyright/mypy/Ruff) and AI code reviewers (CodeRabbit/Greptile); its only defensible wedge is deterministic symbol verification for untyped/dynamic libraries plus zero-config single purpose.
Type checkers: Pyright already does import + attribute resolution against installed deps by default and even introspects untyped source (`useLibraryCodeForTypes` defaults true) [RESEARCHED, H]; mypy does it for typed libs only — untyped third-party libs resolve to `Any` per its "[import-untyped]" diagnostic [RESEARCHED, H]; Ruff (F821 undefined-name, F401 unused-import) does neither [RESEARCHED, H]. Dependency tools: deptry/FawltyDeps compare declared vs imported deps but do not verify method/attribute existence [RESEARCHED, H]. Slopsquatting scanners (slop-scan, VibeDoctor, Socket, Snyk, Endor Labs) verify package existence against the registry but not intra-code symbol resolution [RESEARCHED, H]. AI reviewers (CodeRabbit, Greptile) are LLM-in-the-loop, non-deterministic, and explicitly not what FixProve is [RESEARCHED, H]. There is even a 2026 academic line — Khati et al., arXiv:2601.19106, "Detecting and Correcting Hallucinations in LLM-Generated Code via Deterministic AST Analysis" (FORGE '26/ICSE), which "parses generated code into an Abstract Syntax Tree (AST) and validates it against a dynamically-generated Knowledge Base (KB) built via library introspection," reporting "100% precision and 87.6% recall (0.934 F1-score)" [RESEARCHED, H] — validating the exact approach, which is useful for credibility but dangerous for uniqueness. Weakest point against an informed skeptic: "pyright already flags my hallucinated imports and attributes for free; what do you add?" FixProve must answer that in one line (untyped/dynamic-lib coverage via introspection + zero-config CI + determinism).

### R2.ONE-SENTENCE
CLAIM: "FixProve is a deterministic CLI that fails your CI when AI-written code calls imports, methods, or attributes that don't actually exist in your installed dependencies."
This is the sentence a competent engineer repeats accurately after one read: it names the actor (CLI, deterministic), the trigger (AI-written code), the check (imports/methods/attributes), and the ground truth (installed dependencies).

### R2.RECOMMENDATION
CLAIM: Rewrite the H1/subhead to lead with the concrete failure mode and add a one-line "vs a type checker" differentiator.
Keep the H1 "Prove your code. Don't hope it." — it is memorable [VERIFIED F14]. Replace the subhead with exactly: "AI writes code that calls methods and imports that don't exist. FixProve is a deterministic CLI that catches every hallucinated import, method, and attribute against your installed dependencies — including libraries type checkers can't see. No model in the loop." Add one line below the diff: "Not a linter or type checker: no config, no stubs, no tokens — one command, exit code 1 when a symbol isn't real." Do not add pricing or claim any user [VERIFIED G4, F33].

### R2.STEELMAN-AGAINST
The strongest case against narrowing to "untyped/dynamic libraries type checkers can't see": most target users don't run Pyright at all, so against their actual baseline (nothing) FixProve's broad claim is true and compelling, and narrowing to a technical edge case (untyped-lib introspection) may shrink the perceived value and confuse a non-expert founder who just wants "catch the AI's mistakes." If the ICP genuinely doesn't use type checkers, the honest-but-narrow framing under-sells. Counter-counter: the founder is approaching sophisticated evaluators (lawyers' technical advisors, potential partners) who WILL ask the Pyright question, so the narrow, defensible version protects credibility where it matters most — but for the mass ICP a two-tier message (broad hook, narrow proof) is the real answer.

### R2.EFFORT
4

### R2.CONFIDENCE
M

## R3 — CREDIBILITY ARCHITECTURE

### R3.FINDINGS
Three evaluators, 60 seconds each. All three will search the founder and product and land on the homepage plus, if they can find them, the repo/registry surfaces. The homepage carries no trader identification — no CVR, address, or contact email; those live only on /privacy and /terms [VERIFIED F19]. The privacy/terms documents state on their face that independent legal review is in progress, not complete [VERIFIED F5]. The GitHub App is internal-only [VERIFIED F12, F14]. These facts shape each verdict below.

### R3.VERDICT-ADVOKAT
CLAIM: A Danish advokat concludes "early, legitimate, but unproven"; they find correct trader identification only after digging, and see legal review explicitly incomplete.
Order of checks: (1) Is this a real, identifiable Danish business? They look for CVR/name/address. On the homepage: absent [VERIFIED F19]; they must open /privacy or /terms to find CVR 46646223, FixProve v/ Yehor Kaliberda, Aarhus [VERIFIED F1]. Finding it there is fine but the homepage's lack of trader ID is a minor professional red flag for a lawyer. (2) Are the legal documents sound? They read that independent review is "in progress, not complete" [VERIFIED F5] — for a lawyer this is honest but signals immaturity. (3) Is the person real and consistent? Out of scope [brief]. Where it fails: no contact email or trader identity on the primary page; the lawyer must work to confirm basic legitimacy in a 60-second window.

### R3.VERDICT-ENGINEER
CLAIM: A senior engineer deciding on CI concludes "interesting, but I can't run it — internal-only App, no releases, no stars, broken PyPI link."
Order of checks: (1) What is it, in one line? Homepage delivers [VERIFIED F14]. (2) Can I actually run it in CI? The GitHub App is internal-only [VERIFIED F14] — so the CI path is closed today. (3) Is it maintained and real? They hit the repo: 0 stars/forks/watchers, 0 issues [VERIFIED F23], 0 GitHub Releases against 7 PyPI versions [VERIFIED F22], no root LICENSE [VERIFIED F20], and a root full of session logs [VERIFIED F21]. (4) Is the package legit? npm is OIDC-signed and provenance-attested [VERIFIED F10] — a genuine positive a sharp engineer will notice — but PyPI's own "GitHub App (CI)" sidebar link 404s [VERIFIED F24]. Where it fails: the strongest technical buyer cannot use the product now and the repo reads as a one-person work-in-progress.

### R3.VERDICT-PARTNER
CLAIM: A prospective design partner concludes "too early to rely on, but a real person shipping real artifacts" — the packages are the only strong signal.
Order of checks: (1) Is there a product at all? Yes — live on PyPI and npm at v0.1.10 [VERIFIED F9], signed with provenance [VERIFIED F10]. (2) Is anyone else using it? No visible signal at all [VERIFIED F23]; zero social proof. (3) Can I partner/contact? Only via waitlist or the email buried in /privacy [VERIFIED F14, F19]. (4) Is it safe to associate my brand? Legal review incomplete [VERIFIED F5], sole proprietorship [VERIFIED F1]. Where it fails: nothing converts "this exists" into "others trust it"; the partner must take a pure bet on the founder.

### R3.SOLE-PROP
CLAIM: The sole proprietorship is a legitimate, common Danish structure but concentrates all liability and data-controller responsibility on one person, which sophisticated partners will weigh.
An enkeltmandsvirksomhed is not a separate legal person; the owner has unlimited personal liability and is personally the data controller and party to the Terms [VERIFIED F1, F2]. This is normal for a Danish solo founder and not disqualifying — as one Danish advisory notes, "there is no separation between your private and business assets," so it is a standard, accepted structure rather than a defect [RESEARCHED, H]. But for a partner sharing code-derived data, it means their counterparty is one individual with personal, unlimited exposure and no corporate shield — a real consideration when the product transmits code fragments to an endpoint [VERIFIED F15]. What converts credibility here is not hiding it but pairing it with concrete operational controls: a named DPA offer, clear data-handling description, and the completed legal review. Do not misrepresent the structure.

### R3.ZERO-SIGNALS
CLAIM: Zero external signals read as "nobody uses this," and in the absence of social proof, credibility is converted by verifiable artifacts, not by manufactured metrics.
0 stars, 0 forks, 0 watchers, 0 issues, 0 releases [VERIFIED F23, F22]. You may not fake these [G4]. What actually converts in their absence: (1) cryptographic/verifiable trust — the npm OIDC provenance attestation [VERIFIED F10] is worth more to a sharp engineer than 100 stars; surface it. (2) Reproducibility — a copy-paste command that runs against a public sample repo and shows a real failure. (3) Cut GitHub Releases matching the 7 PyPI versions [VERIFIED F22] so the timeline reads as active. (4) A short, dated changelog. (5) The founder's own honest usage narrative ("I run this on every project I ship") — as one dev-tools conversion guide notes, "'I use this in every project I ship' is credible if you're the builder" [RESEARCHED, M]. These are earned, verifiable signals — not social-proof theater.

### R3.RECOMMENDATION
CLAIM: Put trader identity and verifiable provenance on the homepage, cut Releases, and add a runnable demo — convert credibility through artifacts, not metrics.
1. Add to the footer, exact text: "FixProve v/ Yehor Kaliberda · CVR 46646223 · Aarhus, Denmark · [contact email from /privacy]" (use the real contact address published on /privacy). 2. Surface the npm provenance attestation with a one-line link "Verified build provenance (npm OIDC)" → the npm package page. 3. Cut 7 GitHub Releases matching the PyPI versions [VERIFIED F22]. 4. Add a "Try it in 30 seconds" block: a public sample repo URL and the exact command that reproduces a caught hallucination. 5. Keep legal-review-in-progress language accurate [VERIFIED F5].

### R3.STEELMAN-AGAINST
The strongest case against my "surface trader identity + provenance" push: for a pre-launch solo founder approaching lawyers privately, putting a personal name, CVR, and email prominently on a public page increases personal exposure (spam, liability visibility, GDPR-controller identification) for essentially zero gain, since the actual evaluators were sent the link personally and will get identity directly from the founder. Under this view, the homepage should stay minimal and identity should be shared in the outreach email, not published. Counter: Danish/EU e-commerce and transparency norms expect trader identification on the site, and its absence is itself a red flag to a lawyer — so the exposure is unavoidable and better handled openly. On balance I hold my recommendation, but the risk is real and the founder may reasonably prefer a contact form over a published email.

### R3.EFFORT
5

### R3.CONFIDENCE
M

## R7 — PROOF SURFACES

### R7.FINDINGS
GitHub, PyPI, and npm are the artifacts a technical evaluator inspects. Today they send mixed-to-negative signals. GitHub: no root LICENSE so the sidebar shows none [VERIFIED F20], despite MIT asserted in Terms and per-engine LICENSE files existing [VERIFIED F20]; 0 Releases against 7 PyPI versions [VERIFIED F22]; a root of 59 tracked markdown files vs 10 directories, mostly internal session logs and process docs [VERIFIED F21]; zero external signals [VERIFIED F23]. PyPI: 7 versions [VERIFIED F11], but the "GitHub App (CI)" sidebar link → fixprove.dev/app 404s [VERIFIED F24]. npm: OIDC trusted publishing, signed, provenance-attested, gitHead matches origin/main [VERIFIED F10] — the single strongest proof surface.

### R7.GITHUB
CLAIM: A technical evaluator reads the GitHub repo as an unmaintained one-person work-in-progress, mainly because of the missing LICENSE, zero releases, and process-doc clutter.
The first-screen signals a developer scans are: license (none detected [VERIFIED F20]), release cadence (none [VERIFIED F22]), activity/stars (zero [VERIFIED F23]), and the README/root file list. A root dominated by 59 markdown files that are session logs and build plans [VERIFIED F21] tells an evaluator the repo is a personal working scratchpad, not a consumable product. The README itself is decent — five badges, a clear description, install commands [VERIFIED F25] — but it is buried in noise. Remediation: move all governance/session markdown into a `/docs/internal/` folder or a separate branch; add a root LICENSE (MIT) file; cut Releases; ensure the README is the first thing visible.

### R7.PYPI
CLAIM: A technical evaluator sees a real, versioned package undermined by a 404 in its own sidebar link, signaling carelessness.
7 published versions [VERIFIED F11] establish real iteration. But the "GitHub App (CI)" project link points to fixprove.dev/app, which returns 404 [VERIFIED F24]. A developer checking the sidebar links (a standard trust check) hits a dead page immediately — this reads as "the author doesn't test their own links," disproportionately damaging for a tool whose entire pitch is catching things that don't resolve. Remediation: either remove the "GitHub App (CI)" link or point it at a live page; verify all project URLs resolve; ensure the PyPI long description (from engine/python/README.md [VERIFIED F25]) is complete.

### R7.NPM
CLAIM: A technical evaluator sees npm as the strongest surface — signed, provenance-attested, gitHead matching main — and this is FixProve's best trust asset.
OIDC trusted publishing with signed provenance and a gitHead matching origin/main exactly [VERIFIED F10] is a high-quality, verifiable supply-chain signal that most early projects lack. The only weakness is that it is a thin wrapper around the Python engine [VERIFIED F9], which a careful evaluator will note. Remediation: minimal — make the provenance visible from the website and README; ensure the "engine absent" `pip install fixprove` message is as polished as described [VERIFIED F9].

### R7.PROCESS-DOCS-VERDICT
CLAIM: A repository root dominated by the project's own session logs and process docs reads as an unfinished personal workspace, not a product — it lowers credibility.
59 markdown files, mostly internal governance and session reports, against 10 directories [VERIFIED F21], is the strongest argument. Some may argue this signals transparency and disciplined process — and to a rare evaluator it does. But the dominant first-glance read for a senior engineer in 60 seconds is "this person committed their scratchpad"; it obscures the actual product code and README, and it makes the repo look like a work-in-progress rather than something to depend on. The verdict is negative: relocate them.

### R7.RANKED-REMEDIATIONS
Ranked by impact per hour across all three surfaces:
1. Fix the PyPI fixprove.dev/app 404 (remove or repoint the link) [VERIFIED F24]. ~0.5h. Highest impact/hour: kills an active carelessness signal on the pitch's core promise.
2. Add a root LICENSE (MIT) file [VERIFIED F20]. ~0.5h. Restores the GitHub sidebar license and removes a legal-ambiguity flag.
3. Relocate the 59 process/session markdown files out of the repo root [VERIFIED F21]. ~2h. Transforms the repo's first impression from scratchpad to product.
4. Cut 7 GitHub Releases matching the PyPI versions [VERIFIED F22]. ~2h. Makes the timeline read as active and maintained.
5. Ensure README is first-visible and surface the npm provenance [VERIFIED F25, F10]. ~1h. Amplifies the best existing asset.

### R7.STEELMAN-AGAINST
The strongest case against aggressively cleaning the repo root: the GitHub App is internal-only [VERIFIED F14], so the repo may not be intended as a public front door at all, and the founder may value the session-log transparency as a differentiator or as documentation of AI-assisted process for exactly the sophisticated audience he's courting. If the repo is not the intended entry point, spending hours reorganizing it is lower priority than website/registry fixes, and moving working docs could disrupt his own workflow. Counter: the homepage invites source inspection [VERIFIED F19] and PyPI links to the repo [VERIFIED F24], so the repo IS a public surface whether intended or not — cleanup stands, but could be as light as a single relocation commit rather than a full restructure.

### R7.EFFORT
6

### R7.CONFIDENCE
H

## PRIORITISED BACKLOG
| Rank | Action | Surface | Effort (integer hours, one person) | Impact (1-5) | Needs legal review (Y/N) | Reversible (Y/N) |
|------|--------|---------|-----------------------------------|--------------|--------------------------|-------------------|
| 1 | Fix/remove PyPI fixprove.dev/app 404 link | PyPI | 1 | 4 | N | Y |
| 2 | Add root LICENSE (MIT) file | GitHub | 1 | 4 | N | Y |
| 3 | Add repo/PyPI/npm links + copy buttons to homepage | Website | 3 | 5 | N | Y |
| 4 | Relocate 59 process-doc markdown files from repo root | GitHub | 2 | 4 | N | Y |
| 5 | Rewrite subhead to concrete failure-mode + differentiator | Website | 2 | 4 | N | Y |
| 6 | Add JSON-LD SoftwareApplication block | Website | 2 | 3 | N | Y |
| 7 | Cut 7 GitHub Releases matching PyPI versions | GitHub | 2 | 3 | N | Y |
| 8 | Add trader ID + contact to footer | Website | 1 | 3 | Y | Y |
| 9 | Add "Try in 30 seconds" runnable demo + sample repo | Website/GitHub | 4 | 4 | N | Y |
| 10 | Surface npm provenance attestation on site + README | Website/npm | 1 | 3 | N | Y |
| 11 | De-orphan /terms with a footer link | Website | 1 | 2 | N | Y |

## WHAT I WOULD DO FIRST
If I could change only one thing, I would add the three outbound proof links (GitHub, PyPI, npm) plus copy buttons directly beneath the command block on the homepage — but only after a single relocation commit moving the 59 process-doc markdown files out of the repo root and adding a root MIT LICENSE, so the repo the links point to is presentable. The homepage's fatal flaw is that it invites source inspection while linking to nothing inspectable [VERIFIED F19]; closing that loop converts the largest leak (proof-seekers stranded with no next click) into a verifiable path, and it is the one change that makes every other credibility asset — the packages, the provenance, the versions — actually reachable in the 60-second window the evaluators will give it.

## ASSUMPTIONS I HAD TO MAKE
- [ASSUMED] The repo/PyPI/npm URLs follow the standard forms (github.com/FixProve/fixprove, pypi.org/project/fixprove, npmjs.com/package/fixprove). If false, the exact link targets in R1.RECOMMENDATION change but the recommendation stands.
- [ASSUMED] The command block has no existing "copy" button. If false, that sub-step is already done and effort drops by ~1h.
- [ASSUMED] The target ICP largely does not already run Pyright/mypy in CI. If false (they do run type checkers), FixProve's broad value claim weakens and the narrow untyped-library wedge becomes the only honest pitch, strengthening R2's narrowing recommendation.
- [ASSUMED] The ~65% single-biggest-leak figure is a first-principles estimate; there is no analytics [VERIFIED F17]. If the true figure is much lower, the leak is still the largest single step but its magnitude claim softens.
- [ASSUMED] A public sample repo demonstrating a caught hallucination can be created without exposing private App code. If false, the "Try in 30 seconds" demo needs a different vehicle (e.g. an asciinema recording).
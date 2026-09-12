# FixProve — Comprehensive Diligence & Action Report (Competitive, Monitoring, Development, Legal)
Date: 2026-09-09 · Prepared for: Yehor Kaliberda / FixProve (CVR 46646223)

## Executive Summary — 5 most decision-relevant findings
1. **vFault's pricing DROPPED, not raised, and its UK company is now DISSOLVED.** vFault's live pricing today is Pro £9.99 / Team £29.99 / Business £49.99 (the lower figures), not £19/£49/£99. EXCEED WEB SERVICES LTD (Companies House 15127870) shows status **Dissolved on 3 March 2026** on the direct Companies House record — confirming the diligence claim. So the trading entity behind vFault is legally dissolved while the product still sells subscriptions. (Confidence: High)
2. **FixProve's core differentiator is real and defensible.** No competitor verifies against the user's *actually installed* package versions with zero LLM. vFault checks a pre-parsed "shard"/database (WordPress-only in the open repo); Socket/Snyk/Semgrep check registries/behaviour; CodeRabbit/Bugbot/Qodo are LLM-as-judge. FixProve's "installed-environment truth" niche is genuinely unoccupied. (Confidence: High)
3. **The single most dangerous gap is distribution, not technology — specifically the missing VS Code/Cursor extension.** vFault already ships a Marketplace extension (v1.0.0, 0 reviews) despite a weaker product; every serious competitor meets developers in the IDE or PR. FixProve is CLI-only. (Confidence: High)
4. **You can legally publish a v1 Privacy Notice + Terms now, without a lawyer, for a free tool + waitlist** — GDPR Art. 13 transparency + a "last updated" versioning practice is standard. The lawyer-required items (Art. 28 DPA, point-of-sale withdrawal disclosures, calibrated liability caps) only become mandatory once you charge. (Confidence: High)
5. **A near-zero-budget automated competitor monitor is entirely feasible on your existing GitHub Actions + Cloudflare stack**, with self-hosted changedetection.io (dgtlmoon/changedetection.io — 33.7k GitHub stars / 2k forks as of Sep 2026; note the repo license is **Apache-2.0, not MIT**) as an optional upgrade. (Confidence: High)

---

# PART 1 — COMPETITIVE LANDSCAPE

## 1a. vFault public-surface audit (re-verified 2026-09-09)

| Item | Finding (observed) | Confidence |
|---|---|---|
| Live pricing | Free £0; **Pro £9.99/mo**; **Team £29.99/mo**; **Business £49.99/mo** (homepage pricing block). Note: vFault's own GitHub README lists a *different* scheme (Developer £15, Pro £30, Team £50/seat) — the site and repo disagree. | High |
| Prior report's £19/£49/£99 | Not observed today. Either changed or was an earlier tier. The 2026-09-08 direct fetch (£9.99/£29.99/£49.99) is what is live now. | High |
| Supported ecosystems | Homepage claims 7: WordPress, WooCommerce, Python, JavaScript, Laravel, React/Next.js, Django. **But** the open GitHub repo ships only a WordPress shard; Python/JS/Laravel are marked "Paid tier (coming soon)" in the VS Code extension listing. Free product = WordPress only. | High |
| VS Code extension | **Exists**: "VFault — AI Hallucination Detector", publisher exceed-web-services, v1.0.0, **0 ratings**. Works by sending function names to a hosted API (exceedweb.pythonanywhere.com). Not offline/deterministic-local — depends on their server. | High |
| GitHub repo (Digitalcdj/vfault) | **0 stars, 0 forks, 0 watchers, 1 commit**. WordPress-only. Roadmap lists VS Code extension + JS/Python shards as NOT done (`[ ]`), contradicting the marketing site. MIT licensed. | High |
| Legal surface (privacy/terms/refund/entity) | No privacy policy, terms, or refund policy visible in the homepage/footer. Footer credits "Ian Fraser — Exceed Web Services, Ceredigion, Wales." No legal entity, VAT, or company number shown on the site. | High |
| EXCEED WEB SERVICES LTD (15127870) | **Dissolved on 3 March 2026** (direct Companies House record). Incorporated 10 Sep 2023; registered office Manaros, Penygarn, Bow Street, Wales SY24 5BQ; SIC 58290/62012/62020. Director d.o.b. July 1972. | High |

**Interpretation (framed as observation, not accusation):** vFault is a solo/hobby-scale project whose public marketing overstates maturity (7 ecosystems, a VS Code extension "as you write") relative to what is shipped and verifiable (WordPress shard, 0-star repo, API-dependent extension with 0 reviews). The trading company is dissolved, and the site sells recurring subscriptions with no visible terms, refund policy, or GDPR notice and no live legal entity. For FixProve this is both an opportunity (a credible, legally-clean competitor can win the "trust" framing) and a caution (do not copy their marketing-ahead-of-product posture). The name/architecture overlap ("deterministic, no AI in the verification layer, catches AI hallucinations") is close enough that FixProve should differentiate sharply on *installed-version truth*, multi-language depth, and legal cleanliness.

## 1b. Competitor inventory

### Tier (i) — DIRECT: deterministic / static tools targeting hallucinated or non-existent APIs/imports/packages

| Tool | URL | Method | Languages | Pricing | Distribution | Notes / traction | Most-overlapping claim |
|---|---|---|---|---|---|---|---|
| **vFault** | vfault.com | Deterministic lookup vs pre-parsed "shard" DB (hosted API) | WordPress live; PHP/Py/JS/Laravel claimed | Free; £9.99/£29.99/£49.99 | Web, VS Code ext, CLI, API | 0-star repo; dissolved UK entity | "Deterministic, no AI in verification layer, catches AI hallucinations" — near-identical positioning |
| **deptry** | deptry.com | Deterministic: scans imports vs installed/declared deps | Python | Free, OSS | CLI, pre-commit, CI | Mature, Rust-accelerated (ruff AST); widely used | Detects missing/undeclared imports vs project dependencies (closest OSS analogue for Python) |
| **pyright / pyflakes / Flake8 / Ruff** | microsoft.github.io/pyright | Deterministic static type/name analysis | Python | Free, MIT | CLI, LSP, Pylance ext (196M+ installs) | Pyright is the incumbent; catches unresolved imports & undefined names | "Import could not be resolved"/undefined name detection |
| **TypeScript compiler (tsc) / typescript-eslint** | typescriptlang.org | Deterministic type/name resolution | TypeScript | Free | CLI, IDE, CI | Universal in TS projects | Flags non-existent imports/methods at compile time |
| **Open-source slopsquatting scanners** (e.g. DZone/Denis Ermakov scanner, VibeDoctor "Vibe Check") | dzone.com; vibedoctor.io | Registry existence + heuristic (age/downloads/name pattern) | Py/JS | Free / freemium | CLI, web | Emerging, niche | "Verify every import against the registry before install" |
| **check-hallucinations** | pypi.org/project/check-hallucinations | Deterministic: checks BibTeX refs vs Semantic Scholar | (references, not code) | Free, OSS | CLI | Adjacent domain (academic refs) | "CLI to detect hallucinated references" |

### Tier (ii) — ADJACENT: LLM-based AI code review / PR bots & security scanners marketing hallucination/dependency checks

| Tool | URL | Method | Languages | Pricing | Distribution | Funding/size | Overlapping claim |
|---|---|---|---|---|---|---|---|
| **Socket** | socket.dev | Behavioural + registry analysis (not LLM-as-judge for this) | Multi (npm, PyPI, Maven, Go, etc.) | Free GitHub app; paid tiers | GitHub App, CLI, browser ext, CI | VC-backed | "Even if a hallucinated package gets published, Socket can stop it" — slopsquatting focus |
| **Snyk** | snyk.io | SCA + AI ("DeepCode AI") | Multi | Free tier; paid | CLI, IDE, GitHub App, CI | Large, late-stage | "Slopsquatting detection", package hallucination mitigation |
| **Semgrep** | semgrep.dev | Deterministic AST rules + Assistant (LLM) | Multi | Free OSS; paid | CLI, CI, IDE | VC-backed | Static rules catch some fabricated APIs |
| **Aikido** | aikido.dev | SCA + malware intel ("Aikido Intel") | Multi | Freemium | GitHub App, CI | VC-backed | Tracks hallucinated malicious packages |
| **CodeRabbit** | coderabbit.ai | LLM-as-judge PR review | Multi | Free (public/OSS); Pro/Essentials $24–30/dev/mo; Team $48–60 | GitHub/GitLab/Bitbucket/Azure App, IDE, CLI | Per Sacra: hit ~$40M ARR April 2026, up ~700% YoY (from ~$5M ARR April 2025); closed a $60M Series B Sept 2025 led by Scale Venture Partners at ~$550M valuation | AI review catches AI-generated errors incl. bad imports |
| **Cursor Bugbot** | cursor.com | LLM (8 parallel passes) | Multi | Usage-based ~$1–1.50/run (from 8 Jun 2026) | GitHub App (Cursor ecosystem) | Anysphere; acquired Graphite Dec 2025; per Cursor's 2026 disclosure processes 2M+ PRs/month, resolution rate risen from 52% at launch to ~70–80%, across 110,000+ enabled repos | Catches runtime-relevant bugs incl. fabricated calls |
| **Qodo (ex-CodiumAI)** | qodo.ai | Multi-agent LLM | Multi | ~$30–38/seat/mo | GitHub App, IDE, CLI | $70M Series B announced Mar 30 2026, led by Qumra Capital, total raised $120M | PR review + test-gen; "does not train on your code" |
| **Greptile** | greptile.com | LLM + repo code-graph | Multi | $30/dev/mo (+overage) | GitHub/GitLab App | $25M Series A; 2000+ customers | Traces cross-file deps during review |
| **Graphite Diamond** | graphite.dev | LLM | Multi | $40/user/mo (folding into Cursor) | GitHub App | Acquired by Cursor | Low-FP bug review |
| **GitHub Copilot code review** | github.com | LLM (agentic Mar 2026) | Multi | $19 Business/$39 Enterprise | Native GitHub | Microsoft | Runs linters + reviews PRs |
| **Endor Labs / Mend / Sonar (+Gitar)** | endorlabs.com; mend.io; sonarsource.com | SCA / static + AI | Multi | Enterprise | CLI, CI, App | Sonar acquired Gitar May 2026 | Dependency/reachability + AI reviewer |

### FixProve's differentiation (explicit)
- **Verifies against the ACTUALLY INSTALLED package versions in the user's environment** — not a pre-parsed shard (vFault), not a registry existence check (Socket/slopsquatting scanners), not the model's guess (LLM bots). This catches a class others miss: a real package that exists on the registry but whose *installed version* doesn't have the imported symbol/method (version-drift hallucinations).
- **Zero LLM** in the verification layer → deterministic, reproducible, no per-run cost, no data sent to a model.
- **MIT open source**, published on both npm and PyPI (v0.1.12) — trust and auditability vs vFault's closed hosted API.
- **Python + TypeScript**, real language depth vs vFault's WordPress-only free product.

### FixProve's known gaps (honest)
- No VS Code/Cursor extension yet (every serious competitor has IDE or PR-surface presence).
- Only Python + TypeScript (Socket/Snyk/CodeRabbit are polyglot).
- Documented false negatives: (a) inferred-type instance methods (can't resolve the method when the receiver's type is only inferred), (b) `@types/*`-only packages (type stubs with no runtime package).
- GitHub App not yet open to third-party installation.
- Pre-revenue; no traction signals (stars/downloads/customers) to display yet.

## 1c. Positioning verdict

**Where FixProve is AHEAD:** correctness model (installed-version truth), legal cleanliness (once v1 docs ship), open-source trust, determinism with zero marginal cost, and honest scoping. Against vFault specifically, FixProve is ahead on product substance, entity legitimacy, and multi-language runtime checking.

**Where FixProve is BEHIND:** distribution surface (no IDE extension, GitHub App not public), ecosystem breadth, and — critically — *demonstrable traction*. The LLM PR-bots have funding, ARR, and PR-volume network effects FixProve cannot match on features-per-dollar.

**The single most strategically dangerous gap: the missing IDE (VS Code/Cursor) extension.** Developers adopt hallucination-catching where they write and review code. A CLI alone loses to a mediocre extension (vFault's) on discoverability. If FixProve ships a thin extension that wraps the existing CLI as LSP diagnostics, it neutralises vFault's only real distribution advantage and puts FixProve on the surface where the category is actually consumed.

---

# PART 2 — AUTOMATED COMPETITOR-MONITORING PLAN (solo-founder, near-zero budget)

## Design principle
Run everything on **GitHub Actions cron + a single Python/Node script + a JSON state file committed to the repo (or Cloudflare KV)**, with a weekly digest to email/Telegram. Add **self-hosted changedetection.io** (dgtlmoon/changedetection.io — 33.7k GitHub stars / 2k forks as of Sep 2026, **Apache-2.0 licensed**; hosted plan ~$8.99/mo if you ever want it managed) only if you want visual/rendered-page diffing of JS-heavy pricing pages. Alternatives with free tiers: Visualping (free tier = 5 pages / ~150 checks/mo; paid from ~$10–13/mo), Distill.io (free = 25 monitors, only 5 cloud).

## What to monitor per competitor

| Signal | Source / API | Cadence | Alert threshold |
|---|---|---|---|
| Pricing page text | Fetch HTML, strip, hash & diff stored copy | Daily | Any change in price numbers or added legal links (terms/refund/privacy) |
| Website copy (features, ecosystems, "VS Code extension") | Same fetch+diff | Daily | New ecosystem, new distribution channel, new claim |
| GitHub repo | GitHub REST API: stars, latest release/tag, last commit date, open issues | Daily | New release, star jump, first commit in a dormant repo |
| npm package | registry.npmjs.org/<pkg> (latest version) + api.npmjs.org/downloads | Daily | New version, download spike |
| PyPI package | pypi.org/pypi/<pkg>/json (info.version) | Daily | New version |
| VS Code Marketplace | Marketplace query API (version, install count, rating count) | Daily | New extension published, install/rating growth |
| Company status | UK Companies House free API (company number → status); Danish CVR via cvrapi.dk/Virk | Weekly | Status change (e.g. dissolved→active, new filing) |
| News / social | Google Alerts (free) or Talkwalker Alerts; HN via hnrss.org RSS; Reddit RSS; Product Hunt RSS | Daily RSS pull | New mention of competitor or keyword ("slopsquatting", "hallucinated imports") |

## Storage & diffing rules
- One `competitors.json` in a private repo: per competitor, store last hash of each watched URL, last npm/PyPI/Marketplace version, last GitHub release id, last CH/CVR status.
- Diff rule: normalise (strip whitespace/dates), compare SHA-256; if changed, capture a small text diff and set a flag.
- Threshold rule: escalate (immediate alert) on price change, new extension, new ecosystem, or pricing page adding legal links; otherwise batch into the weekly digest.

## Delivery
- **Weekly digest** every Monday: a GitHub Actions cron job renders the accumulated flags into a Markdown summary and sends via (a) an email API free tier, or (b) a Telegram bot (free) — Telegram is simplest for a solo founder.

## Step-by-step build plan (effort estimate)

| Step | Task | Hours |
|---|---|---|
| 1 | Define competitor list + watched URLs/packages in `competitors.json` | 1 |
| 2 | Write fetch+hash+diff script (URLs) | 2–3 |
| 3 | Add GitHub/npm/PyPI/Marketplace API pulls | 2–3 |
| 4 | Add Companies House + CVR status checks | 1–2 |
| 5 | Wire RSS (hnrss.org, Reddit, PH) + Google Alerts→email | 1 |
| 6 | Digest renderer + Telegram/email send | 1–2 |
| 7 | GitHub Actions cron (daily collect, Monday digest) + secrets | 1 |
| 8 | (Optional) Docker changedetection.io on a small VPS for visual diffs | 2–3 |
| **Total** | **Core system** | **~9–13 h** (core), +2–3 h optional |

## Weekly review ritual (one page, 15 min)
Open the Monday digest → scan the "escalated" section first (price/extension/ecosystem/legal changes) → note any action in a running log → check star/download deltas for momentum → decide one response (or none). Keep it to a single markdown note per week.

## Checklist of what NOT to do
- ❌ No scraping behind logins or paywalls; only public pages.
- ❌ Respect robots.txt and each site's ToS; keep polling gentle (once/day is plenty).
- ❌ No aggressive request rates that resemble a DoS.
- ❌ No storing of competitors' private/personal data beyond public company-registry facts.
- ❌ No competitor-disparaging public claims; keep the intel internal and factual.
- ❌ Don't republish competitors' copyrighted page content; store hashes/diffs, not full mirrors.

---

# PART 3 — UPDATED DEVELOPMENT PLAN

## (a) Fastest credible path to a VS Code extension
**Verdict: wrap the existing CLI. Feasible in roughly a week of focused work.** The VS Code Extension API supports a `DiagnosticCollection` — you run the FixProve CLI on save (or on demand) over the open file/workspace, parse its output, and surface red squiggles + hover messages. You do NOT need a full Language Server initially; a diagnostics-provider extension calling the CLI is the minimum viable version. Later, if you want cross-file/real-time performance, promote to an LSP server.
- **Publish to BOTH** the VS Code Marketplace (via `vsce`, needs an Azure DevOps PAT + publisher) **and Open VSX** (via `ovsx`, needs an Eclipse Foundation agreement + token). Open VSX is essential because it serves **Cursor, Windsurf, VSCodium, Gitpod** — where much of the AI-coding audience lives (one publisher reports Open VSX out-installing the MS Marketplace ~8× in the first days for a dev-focused tool).
- Automate publishing with the `HaaLeo/publish-vscode-extension` GitHub Action on tag push.
- Effort: MVP diagnostics extension wrapping the CLI ≈ 3–5 dev-days; add quick-fix suggestions + config toggles ≈ +2 days; publishing setup on both registries ≈ 0.5–1 day (mostly account/token friction).

## (b) Pre-commit hook / GitHub Action vs the extension — which is the cheaper distribution win?
**Both are cheaper than the extension and should ship FIRST — but they serve a different point in the funnel.** A **pre-commit hook** (a few lines of YAML in `.pre-commit-config.yaml`) and a **GitHub Action Marketplace listing** are near-zero effort (hours, not days) because FixProve is already a CLI. They capture the CI/PR-gate use case and are the natural distribution for a deterministic checker. Recommendation: **ship the pre-commit hook + GitHub Action listing this week (cheap, high-fit), then build the extension** (higher effort, but it's where the category is discovered and where vFault has its only edge). The Action/hook wins on effort-per-install now; the extension wins on strategic positioning.

## (c) Prioritised fixes for the five documented defects

| Priority | Defect | Why | Fix |
|---|---|---|---|
| **P0** | CLI syntax mismatch (pip form takes a path directly; npm form takes `check <path>`) | Inconsistent UX breaks first-run for half of users; every demo (Sep 11/16/17) risks live failure | Unify the command grammar across both distributions (pick one: `fixprove check <path>` everywhere), keep an alias for back-compat, update README/`--help` |
| **P0** | npm `--version` hardcoded stale at 0.1.0 (actual 0.1.12) | Signals abandonment/untrustworthiness to the exact technical buyers evaluating you | Wire version to package.json at build; add a test asserting reported == package version |
| **P1** | requirements.txt version-pin mismatch masking findings | Correctness bug — the tool's entire value is correctness; a masked finding is worse than a false negative | Ensure the installed-version resolver reads the actual installed metadata, not the pin; add regression test |
| **P2** | False negative: inferred-type instance methods | Known limitation; document now, fix later | Document in README "known limitations"; scope a fix using type inference from the language server later |
| **P2** | False negative: `@types/*`-only packages | Same | Document; special-case type-only packages in TS resolver |

Do P0s **before the Sep 11 mentor call and Sep 16/17 demos** — a stale version string or a broken command in a live demo is disproportionately damaging.

## (d) Realistic first-paying-customer motion (evidence-based)
- **Pricing benchmark:** dedicated dev-tool per-seat pricing clusters at **$12–$40/dev/mo** (Sourcery $12, CodeRabbit $24–30, Qodo $30–38, Bugbot/Graphite $40); usage-based bug bots run ~$1–1.50/review. For a deterministic single-purpose checker, price **below** the LLM reviewers: a **free OSS CLI forever**, and a **$5–$10/dev/mo** paid tier for the GitHub App/team dashboard/private-repo automation. This matches the "$5–$20/dev/month CI/IDE dev tool" band and undercuts LLM incumbents on price while differentiating on determinism.
- **Free-tier design that converts:** keep the CLI and single-developer local use free (drives adoption and trust); charge for the *team/CI* surface — the GitHub App posting checks on PRs, org dashboards, and private-repo automation. This is exactly how CodeRabbit (free for public/OSS) and Socket (free GitHub app, paid tiers) convert.
- **What converts at this stage:** land 3 paying customers by *direct founder outreach* to people who already feel the pain — Python/TS teams shipping AI-generated code, the AI Tinkerers/Claude Code meetup crowd, and slopsquatting-aware security-conscious teams. Offer the paid GitHub App free during D3, then convert the ones who keep it. The D3 exit (3+ paying + one renewal) is a classic "repeatable revenue" proof.

## (e) What DanBAN / Innovation Fund Denmark actually look for
- **DanBAN:** "Denmark's largest network of business angels with more than 300 members" (danban.org); The Hub notes applications go via StartupIncluder and the 3 criteria to be invited to pitch are: *looking for funding, a working MVP, and some validation/traction*. They recommend at least a working MVP before applying, with bi-monthly pitch events in Copenhagen/Odense/**Aarhus**. Traction they value: early customers, engaged early users, encouraging cohort feedback, key hires, early press.
- **Innovation Fund Denmark — Innobooster:** grant **DKK 200,000–5,000,000**, co-financing **max 35%** of the company's relevant expenses, projects up to 24 months (verbatim from Innovationsfonden's 2026 Innobooster pool). **Eligibility gate (verbatim):** *"You must have a CVR number and EITHER have raised 100,000 in capital within the last 3 years OR have a gross profit of min. 250,000 DKK in one of the last 3 published annual accounts."* **⚠️ Flag:** as a pre-revenue enkeltmandsvirksomhed, FixProve likely does **not** meet the Innobooster financial gate yet — note this and revisit after revenue or a capital raise. Innofounder (for early founders) may be a better near-term fit; verify current eligibility.
- **Bottom line for traction evidence:** paying customers + renewal + download/star growth + named design partners. The D3 exit metrics ARE the traction narrative both audiences want.

## (f) Week-by-week plan 2026-09-09 → 2026-11-12 (with gates)

| Week | Dates | Focus | Gate/deliverable |
|---|---|---|---|
| 0 | Sep 9–10 | Fix P0 defects (CLI syntax, version string); publish v1 Privacy + Terms; rehearse demo | Demo runs clean end-to-end; v1 legal docs live |
| 1 | Sep 11–15 | **Sep 11 10:00 Travis Mathers mentor call**; ship pre-commit hook + GitHub Action listing | Action published; mentor feedback logged |
| 2 | Sep 16–17 | **Sep 16 AI Tinkerers science-fair demo**; **Sep 17 Claude Code Meetup Show & Tell** | ≥10 qualified conversations; ≥5 waitlist signups; ≥3 design-partner leads |
| 3 | Sep 18–24 | Fix P1 (requirements.txt masking); start VS Code extension MVP | Correctness regression test green; extension skeleton runs locally |
| 4 | Sep 25–Oct 1 | VS Code extension diagnostics MVP; convert 1–2 design partners to paid GitHub App | Extension installs locally; 1 paying customer |
| 5 | Oct 2–8 | Publish extension to Marketplace + Open VSX; outreach round 2 | Extension live on both registries |
| 6 | Oct 9–15 | Convert; document known limitations (P2 false negatives) | 2nd paying customer |
| 7 | Oct 16–22 | Iterate on paid GitHub App feedback; add quick-fix to extension | 3rd paying customer (D3 exit metric hit) |
| 8 | Oct 23–29 | Secure first renewal conversation; monitoring system live | Renewal commitment from earliest customer |
| 9 | Oct 30–Nov 5 | Consolidate traction deck; prep DanBAN application (StartupIncluder) | Traction one-pager; DanBAN submission drafted |
| 10 | Nov 6–12 | **D3 close (Nov 12):** confirm 3+ paying + 1 renewal | D3 exit decision; go/no-go on scale |

## Publishing v1 legal terms & iterating them — what EU/Danish law allows
- **Publishing a v1 for a FREE tool + waitlist without a lawyer is normal practice.** For a free service the binding obligation is **GDPR Art. 13 transparency** at the point of collection (the waitlist email). You can self-author a compliant privacy notice and lightweight terms now, and iterate.
- **Free vs paying users on updates:** For **free users**, EU practice is a dated "Last updated" notice + accessible publication; material privacy changes should be actively communicated (GDPR requires clear notice, commonly ~30 days for material changes) — but for a free waitlist the bar is low and a dated changelog suffices. For **paying consumers**, more applies: the EU Consumer Rights Directive **14-day right of withdrawal** must be disclosed at point of sale, material term changes need advance notice and often affirmative re-acceptance, and unfair-terms rules bite.
- **Danish specifics:** Denmark's Forbrugeraftaleloven (Consumer Contracts Act) gives a 14-day cooling-off for distance sales of goods AND services; for digital content/services the withdrawal right can be **waived** if the consumer expressly consents to immediate performance and acknowledges losing the right (standard SaaS practice). Datatilsynet enforces transparency strictly (vague notices = non-compliant), so keep the notice specific.
- **Minimum mandatory NOW (free service, GDPR Art. 13):** controller identity + contact; purposes + legal basis of processing (waitlist email → e.g. legitimate interest/consent to be contacted); recipients/processors (Cloudflare); international transfer facts + safeguard; retention period; data-subject rights (access/erasure/objection/portability) + right to complain to Datatilsynet. No DPO needed (not required here); no cookie banner needed (no cookies set).
- **Only mandatory ONCE PAYMENTS START:** point-of-sale consumer disclosures incl. the withdrawal right + waiver mechanism; a controller/processor split + **Art. 28 DPA** where you process others' data via the GitHub App; calibrated liability caps; specific commercial retention/refund terms.

---

# PART 4 — LEGAL-DOCUMENT FINALISATION GUIDANCE

## (a) Open questions: defensible DEFAULT now (free service) vs needs counsel before charging

| Open question | Default position defensible NOW (free) | Wording direction / source | Needs counsel before charging? |
|---|---|---|---|
| Controller/processor split | For the website/waitlist you are sole **controller**. The GitHub App relays code fragments without storing them → argue **no persistent processing** for free beta; state it plainly. | "FixProve is the data controller for this website and waitlist." (GDPR Art. 4/13) | **Yes** — once paid & processing customer code at scale, need Art. 28 DPA defining you as processor/sub-processor |
| Art. 28 DPA | Not required while free and not storing customer code. | State GitHub App "relays code fragments in-memory and does not store them." | **Yes** |
| Point-of-sale withdrawal disclosure | N/A while free. | — | **Yes** — CRD 14-day + waiver text |
| Retention periods | Adopt concrete defaults now (see (b)). | "Waitlist: until withdrawal or max 24 months of inactivity." | No (but revisit) |
| Liability caps | Free-service disclaimer: "provided as-is, no warranty, no liability for damages" (MIT already disclaims for the CLI). | Track MIT warranty disclaimer language. | **Yes** — calibrated caps for paid |
| Cloudflare transfer/subprocessor schedule | State Cloudflare as processor + US transfer under SCCs/DPF (see (c)). | See (c). | No |
| DPO | Not required (no large-scale/systematic monitoring). State "No DPO is required; contact [email] for privacy queries." | GDPR Art. 37 | No |
| Cookies | None set → "This site sets no cookies and uses no tracking." | Danish Cookie Order (Cookiebekendtgørelsen) — consent only needed if cookies set | No |

## (b) Recommended concrete retention periods
- **Waitlist (email + timestamp in Cloudflare KV, currently no TTL):** set a concrete default of **retain until the person unsubscribes/withdraws, or a maximum of 24 months from signup or last engagement, whichever first**, then delete. Add a KV TTL or a scheduled cleanup Worker to enforce it (currently there is no TTL — this is a live gap to fix). 12 months is a defensible tighter alternative.
- **Short-lived CI correlation records** (if/when the GitHub App logs a run id to correlate a check): retain **≤30 days** then purge — long enough to debug, short enough to minimise. 7 days is a defensible tighter option.

## (c) Cloudflare DPA/SCC/DPF references & Workers KV data-location facts (as of 2026-09-09)
- **DPA:** `https://www.cloudflare.com/cloudflare-customer-dpa/` — it **incorporates the EU SCCs**. Cloudflare's GDPR FAQ states: *"Our standard Data Processing Addendum ('DPA') will continue to incorporate the EU SCCs to ensure we have multiple legal bases for processing data."* The DPA's Section 6.2 confirms EU SCCs apply to restricted transfers (Module Two where the customer is a controller, Module Three where a processor). Dedicated SCC doc: `https://www.cloudflare.com/cloudflare-customer-scc/`.
- **DPF:** Cloudflare is **certified under the EU-U.S. DPF, the Swiss-U.S. DPF, and the UK Extension** (Cloudflare GDPR FAQ / privacy policy — *"we rely on our certifications under the EU-U.S. Data Privacy Framework, the Swiss-U.S. Data Privacy Framework, and the UK Extension… Should these certifications lapse… Cloudflare relies on the EU standard contractual clauses"*). Verify live status at `https://www.dataprivacyframework.gov/` (search "Cloudflare").
- **Subprocessors:** `https://www.cloudflare.com/gdpr/subprocessors/` (the DPA commits to ≥30 days' notice before adding/replacing subprocessors).
- **Workers KV data location:** KV stores data in **central stores and replicates to all Cloudflare locations** (eventually consistent). Per Cloudflare KV docs: *"Workers KV stores data in central stores and replicates the data to all Cloudflare locations."* Cloudflare's GDPR FAQ describes metadata processing *"in our data centers in the United States and Europe."* A **jurisdiction/EU data-residency restriction for KV exists only in PRIVATE BETA** (per developers.cloudflare.com/kv/concepts/kv-namespaces/) and is effectively unavailable to a self-serve sole proprietor. **Practical position for the notice:** waitlist data may be stored in/transferred to the US, covered by Cloudflare's DPA + SCCs + DPF certification. (Sources: developers.cloudflare.com/kv/reference/faq/, developers.cloudflare.com/kv/concepts/kv-namespaces/.)
- ⚠️ Do **not** cite a specific DPA version number/date as official — the "v6.4 / 3 April 2026" figure appears only in a third-party blog, not confirmed on Cloudflare's own page. Cite the canonical URL, not a version.

## (d) Datatilsynet complaint wording & controller identification
- **Controller identification (Danish sole proprietorship):** use **"Dataansvarlig: FixProve v/ Yehor Kaliberda, CVR 46646223, [full physical/postal address], [contact email]."** GDPR Art. 13(1)(a) requires the controller's identity + contact details; for an enkeltmandsvirksomhed the owner is personally the controller and the CVR + address are the standard identifiers (Danish practice — the name/address of an enkeltmandsvirksomhed is itself treated as identifying data; there is no single Datatilsynet sentence mandating "name+CVR+address," so treat this as a compliance interpretation of Art. 13, not a quoted rule).
- **Complaint paragraph wording** (put in the privacy notice): *"You have the right to lodge a complaint about our processing of your personal data with Datatilsynet (the Danish Data Protection Agency), Carl Jacobsens Vej 35, 2500 Valby, Denmark; tel. +45 33 19 32 00; www.datatilsynet.dk."* (⚠️ verify the street address on datatilsynet.dk/kontakt before printing.) Datatilsynet advises data subjects to first contact the controller, then complain via its online form using MitID (datatilsynet.dk/borger/klage/saadan-klager-du — *"Vi opfordrer dig til at starte med selv at tage kontakt til… den dataansvarlige… inden du klager til Datatilsynet… vi anbefaler, at du bruger vores klageformular… ved at logge ind med MitID"*).

## (e) Versioning & change-notice practice (compliant for free users now, paying users later)
- **Now (free):** put a dated **"Last updated: YYYY-MM-DD"** at the top of both documents and keep a short changelog ("v1.0 — initial publication"). This mirrors Suno's dated "Terms updated" practice and is sufficient for a free tool/waitlist. For material privacy changes, add a brief website banner and (if you have waitlist emails) a one-line email notice.
- **Later (paying users):** move to **advance notice (≈30 days) of material changes + affirmative re-acceptance** (clickwrap "I agree to the updated Terms") at next login/purchase, and allow users who decline to stop/cancel. Keep every dated version archived so you can answer "which terms governed on date X" with a version number + date (the same discipline Cloudflare uses for its DPA).
- **Do NOT** rely on silent "continued use = acceptance" for material changes to paying consumers under EU law; it is weak and can be treated as unfair.

---

## Confidence & thin-evidence flags
- **High confidence:** vFault pricing/entity status (direct Companies House + live site), competitor pricing/funding (vendor pages + Sacra/TechCrunch), Cloudflare legal references (primary sources), GDPR/CRD/Danish withdrawal-right framework, Innobooster financial gate (verbatim from Innovationsfonden), VS Code/Open VSX publishing mechanics.
- **Medium confidence:** exact FixProve npm/PyPI download/traction numbers (not independently verified here); whether the prior report's £19/£49/£99 was ever live (not observed — could be a historical tier); Innofounder suitability (eligibility should be re-checked on the current call); the changedetection.io hosted price (~$8.99/mo — verify on current pricing page).
- **Low confidence / verify before relying:** Cloudflare DPA exact version number/date (third-party only); Datatilsynet exact street address (confirm on official kontakt page); whether FixProve's GitHub App as currently built triggers any persistent processing (depends on implementation detail not audited here).
- **Could be wrong:** the assumption that FixProve stores no customer code via the GitHub App is taken from the brief, not independently verified — confirm in code before making it a legal representation.

## Source list (external claims)
- vFault site/pricing: vfault.com, vfault.com/pricing.html
- vFault repo: github.com/Digitalcdj/vfault
- vFault VS Code extension: marketplace.visualstudio.com/items?itemName=exceed-web-services.vfault
- Companies House (EXCEED WEB SERVICES LTD): find-and-update.company-information.service.gov.uk/company/15127870
- Slopsquatting / package hallucination: usenix.org (package hallucinations study), arxiv.org/html/2406.10279v3, snyk.io/articles/slopsquatting-mitigation-strategies, aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks, socket.dev/blog/slopsquatting-how-ai-hallucinations-are-fueling-a-new-class-of-supply-chain-attacks, trendmicro.com (slopsquatting), digitalapplied.com, vibedoctor.io, dzone.com/articles/slopsquatting-ai-package-scanner
- Deterministic tools: deptry.com, pypi.org/project/deptry, pydevtools.com/handbook/reference/pyright, dev.to (Flake8/pyflakes), github.com/Doist/py_static_check, pypi.org/project/check-hallucinations
- AI code-review pricing/funding: coderabbit.ai/pricing + docs.coderabbit.ai/management/plans, macroscope.com, theairankings.com/best-ai-code-review, critique.sh/blog/ai-code-review-pricing-2026, stackpick.net/tools/bugbot, buildmvpfast.com, dupple.com/learn/best-ai-code-review-tools (Sacra ARR + Qodo/Cursor funding per enrichment)
- Change detection: github.com/dgtlmoon/changedetection.io, visualping.io/blog, contextbolt.com, competiflow.com, analook.com
- VS Code/Open VSX publishing: github.com/marketplace/actions/publish-vs-code-extension, dev.to (publishing guide), gitstudio.dev, eclipse.org/openvsx, github.com/eclipse/openvsx
- Pre-commit / GitHub Action: github.com/marketplace/actions/pre-commit, github.com/pre-commit/action
- DanBAN: danban.org, thehub.io/funding/danish-business-angels, medium.com/the-european-vc, fundingtrip.com
- Innobooster: innovationsfonden.dk/en/p/innobooster (2026 pools), innovayt.eu/funding/innobooster
- GDPR Art. 13 / privacy notices: gdpr.eu/privacy-notice, gdprledger.com, cms.law, whitecase.com (Denmark), lexology.com (Denmark), denmark.dk/privacy-notice
- Consumer withdrawal right (EU/Denmark): businessindenmark.virk.dk, norden.org, eur-lex.europa.eu (CRD 2011/83/EU), insideprivacy.com, key-g.com, lawgratis.com
- ToS update practice: toslawyer.com, ironcladapp.com, usercentrics.com, termsfeed.com, contractscounsel.com, lexsoy.com
- Cloudflare legal (primary): cloudflare.com/cloudflare-customer-dpa, cloudflare.com/cloudflare-customer-scc, cloudflare.com/trust-hub/gdpr, cloudflare.com/privacypolicy, cloudflare.com/gdpr/subprocessors, developers.cloudflare.com/kv/reference/faq, developers.cloudflare.com/kv/concepts/kv-namespaces, developers.cloudflare.com/data-localization
- Datatilsynet: datatilsynet.dk, datatilsynet.dk/borger/klage/saadan-klager-du, dataprivacyframework.gov

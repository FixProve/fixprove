# SESSION-PLAN-TO-R1 — FixProve: Road to First Paying Customer
**Canonical session backlog. Synthesised 2026-08-01 from three independent deep-research runs.**
Owner: Yehor Kaliberda · Maintainer: Node 1 · Governed by OPERATING-PLAN-D17-D60.md §10.
Status: internal. Kept **off `main`** (like the operating plan). Pricing shown as tier labels only.

---

## HOW TO USE THIS EACH SESSION (read first)

Per operating-plan §10 (one gate at a time):
1. The current **gate** is PITFALL row 4 — the accountable legal review of Privacy Policy + ToS
   (submitted 2026-07-29; ~3–4 wk; **do not chase before ~20 Aug**).
2. While the gate is closed, do the **single highest-priority not-yet-done Track B or C session** below.
   One session ≈ ≤1 focused working day.
3. **Track A is gated** — do not start any A-session until the review actually returns.
4. At session start: pick the top unchecked B/C item, do it to its done-check, tick it, stop.

**Status legend:** [ ] not started · [~] in progress/partial · [x] done.

### The TWO gates (both must clear before a first Marketplace dollar)
- **Gate 1 — Legal review** (external, in progress): unblocks pricing, live payments, public flip.
- **Gate 2 — GitHub Marketplace paid-plan eligibility** (VERIFIED 2026-08-01): a paid GitHub App
  needs **≥100 installations**, must be **org-owned**, and the org must be a **verified publisher**
  (2FA + domain verified). FixProve is pre-launch and org-only → **not yet eligible**.
  **Consequence:** the realistic **first-dollar path is direct Stripe billing**, not the Marketplace
  paid plan. Marketplace becomes the channel later, once installs accumulate. This is a decision to
  confirm (see B1 / OPEN DECISIONS).

---

## TRACK B — Do-while-waiting (parallel, unblocked; PRIORITY ORDER)

### [x] B1 — Payment test-mode build-out  *(highest priority — DONE + COMMITTED + PUSHED 2026-08-04)*
- **Committed `cca51de`, pushed to `origin/main`, CI-green (`build`+`test-python` both
  `success`, run `30945005006`, both annotations read — the known Node-20 platform warning only,
  nothing new).** `main` = `origin/main` = `cca51ded50ba5df508ca59180c6f530d1ae90d85`, 0/0.
- **Status 2026-08-04 (Session 4.12-J, live-verification pass): done-check MET.**
  New `billing/` workspace package (`@fixprove/billing`): signature verification, six-event
  lifecycle handler, idempotency + out-of-order guards, entitlement gate, hosted-Checkout session
  builder, a runtime refusal of any non-test key, a `stripe listen` receiver, and a manual CI job.
  **45/45 offline tests pass** (grown 40→43 same day for the grace-period revision, then 43→45 for
  the Defect 3 regression tests below). **3 real defects found and fixed** (see KS-REPORT-4.12J +
  Addenda). Yehor created the real test-mode Stripe account (`acct_1U0jS23QDGNK4abQ`), created both
  tier products, installed the Stripe CLI, and ran a genuine end-to-end test: a real Checkout
  session paid with `4242 4242 4242 4242` flipped the account to `active`
  (`checkout_completed_active` + `subscription_active` in the receiver log), and
  `stripe subscriptions cancel` flipped it back (`subscription_canceled`). **Both halves of the
  done-check verified in real logs against a real account — this is DONE, not partial.**
  Live testing also caught **Defect 3**: Stripe's invoice API (version required for Managed
  Payments) nests the subscription link and metadata under `parent.subscription_details`, not the
  flat top-level fields our fixtures assumed from documentation. Found via a real
  `invoice.payment_succeeded` event, fixed with a shared `subscriptionIdOf()` helper, regression-
  tested from the literal captured payload. See KS-REPORT-4.12J Addendum B (§E–G) for full evidence.
- **Do:** create the Stripe account (test mode, under CVR); build test products for both tiers
  (test mode only, never public); implement subscription lifecycle + webhook handler with
  signature verification + the entitlement logic that turns the paid PR-check on/off; test the six
  scenarios (success, decline, auth/3DS, cancellation, renewal, failed renewal) with test cards;
  add `stripe listen` to CI so webhook handling is regression-tested. Write a production-flip runbook.
- **Why / unblocks:** turns A3 (live activation) into a config swap, not a build. Also the direct-Stripe
  path (Gate-2 workaround) depends entirely on this.
- **Done-check:** CI passes all six scenarios; a test purchase flips a test org to paid via webhook,
  a cancellation flips it back — both verified in logs.
- **MUST NOT:** no live keys; no public pricing; test webhook must not point at production.
- **Permitted now:** yes — CA-1 partial lift (2026-07-22) explicitly allows Stripe account creation +
  all test-mode work.

### [~] B2 — Risk-awareness analysis of the legal drafts  *(prep for the human reviewer)*
- **Status:** a detailed **RISK-AWARENESS-BRIEF already exists** (produced by external AI research).
  It is **AI-prepared triage, NOT verified legal advice** — its case-law and statute citations
  (e.g. IDdesign/ILVA retention fine, aftaleloven §36, forbrugeraftaleloven fortrydelsesret,
  Cloudflare DPA, Brussels I recast) have **not** been independently verified here.
- **Do (to close):** hand the brief to the accountable reviewer as *input/questions*, not conclusions;
  keep the "assumption — verify with advokat" labels intact.
- **Why / unblocks:** shortens A1 (reviewer gets a prepared package). Its top flagged blockers:
  liability-cap drafting, Art. 28 DPA, KV retention TTL, fortrydelsesret waiver, §7 provider identity.
- **Done-check:** brief delivered to reviewer; every claim still marked verified-vs-assumption.
- **MUST NOT:** do not treat any AI legal conclusion as final or as clearing the documents.

### [ ] B3 — Build the 20–30 named outreach list  *(build now; sending is A5)*
- **Do:** define a specific ICP (e.g. 5–15-eng private orgs merging AI-generated PRs into CI);
  source via observable signals — repos with AI-assistant config (`.cursor/`, `CLAUDE.md`, Copilot
  workflows), PR/commit language indicating AI-generated code, "we build with Cursor/Copilot" posts,
  and **existing FixProve free-CLI installers (npm/PyPI) — the warmest segment**. Per row: name, team,
  one evidence link, a contact path, a one-line personalization hook.
- **Why / unblocks:** A5 outreach is instant on gate-clear; warm outreach is the proven first-10 tactic.
- **Done-check:** ≥20 rows, all five fields populated, each evidence link resolves; ≥10 marked Priority 1.
- **MUST NOT:** no messages sent; no scraping that violates platform terms; no cold-volume tooling.

### [ ] B4 — Launch-copy compliance pass
- **Do:** list every marketing claim (site/README/listing) — "proves AI-generated code before merge,"
  "deterministic," "every import/symbol/method/API call resolves," "zero LLM tokens," "near-zero false
  positives," "in CI"; attach a demonstrable **artifact** to each (a CI run, a test fixture, a benchmark,
  MIT source). Rewrite or delete any claim without an artifact. Stage pricing copy behind a flag.
- **Why / unblocks:** defensible launch messaging; feeds B5 and A4.
- **Done-check:** claim→artifact table at 100% coverage; zero unbacked claims; pricing copy staged, not live.
- **MUST NOT:** no pricing published; no comparative claims that can't be substantiated.

### [ ] B5 — Agent-readability (GEO) pass  *(after B1, before B6)*
- **Do:** ship `llms.txt` at the site root (curated index); publish **honest markdown mirrors** of N key
  pages (faithful to the human pages, no bot-only content); add a JSON-LD `SoftwareApplication` block
  matching visible content; add a README "fact box" of artifact-backed claims. Reuse only B4's backed claims.
- **Why / unblocks:** AI coding assistants can discover + accurately describe FixProve when asked to
  recommend a CI import-checker. (Signal verified 2026-08-01: bots are 53–58% of web traffic; Time/Mobian
  agent-ads exist. **Honest read:** llms.txt has no proven citation lift and Google doesn't use it — treat
  this as cheap option value, not a growth lever.)
- **Done-check:** `/llms.txt` 200 + validates; each mirror is claim-faithful to its human page (diff shows
  no divergence); JSON-LD validates + matches on-page content; README fact box live.
- **MUST NOT:** no pricing in any mirror; no traffic push; no launch copy; **honest-mirror boundary** —
  agent version must not diverge from human version (cloaking-penalty risk); exposure-check before commit.

### [ ] B6 — Demo asset (terminal recording)  *(last in Track B)*
- **Do:** record a short (<60s) `fixprove check <path>` session catching a hallucinated import/method
  against real installed deps, using tools in hand (asciinema/vhs → GIF+MP4); export repo- and site-embeddable.
- **Why / unblocks:** A5 launch posts + outreach; feeds B4 artifact library.
- **Done-check:** <60s MP4 + GIF exist, play in README and site, show a genuine catch (not a mock).
- **MUST NOT:** no pricing shown; no unverifiable captions.

### [ ] B7 — GitHub Marketplace listing prep  *(after B6; note Gate-2)*
- **Do:** draft the Marketplace listing (name, description, category, screenshots from B6, support URL,
  privacy-policy URL placeholder); set up **draft** (unpublished) plans; test install flow in a test org;
  write the publish checklist. **In parallel, resolve Gate-2:** transfer the App to an org (if not already),
  start **publisher verification** (2FA + domain verify), and plan how to reach **100 installs** (free-CLI
  → free App installs) — because the paid plan can't publish until then.
- **Why / unblocks:** makes the eventual Marketplace publish a flip, not a build — but **only after 100 installs**.
- **Done-check:** listing fully drafted + installable in test org; publisher-verification started; a written
  install-growth plan to 100 exists.
- **MUST NOT:** do not publish the listing; do not flip public; do not enable live payments.

---

## TRACK C — Founder-only (parallel)

### [~] C1 — Legal channels (primary + fallback)
- **UPDATED 2026-08-04:** Iværksætterretshjælpen replied 2026-08-03 — **summer holiday until
  7 September**, and they asked for a re-confirmation of interest. Free path now closes row 4 no
  earlier than early October. **Director's decision: hold the free slot (reply drafted, Yehor
  sends) but DEMOTE it to backstop; a PAID accountable reviewer becomes the primary channel,
  pursued in parallel this week.** Fallback trigger is therefore already fired — see PITFALL
  addendum 2026-08-04.
- Primary (now backstop): the queued reviewer (Iværksætterretshjælpen) — **already contacted, docs sent
  2026-08-01.** Note: student-level with a liability disclaimer → a strong second opinion, **not** an
  advokat-accountable sign-off.
- Fallbacks (if it stalls past ~20 Aug): a fixed-price Danish package (e.g. LegalUp combined
  privacy+terms, Aarhus office) or a named Aarhus advokat by quote for full accountability.
- Not the review: Advokatvagten (oral first-aid only) or self-service template sites.
- **Done-check:** a dated status line per channel so the fallback can trigger the moment the primary slips.
- *(Details in THIS-WEEK-legal-review-plan.pdf.)*

### [ ] C2 — VAT / OSS / invoicing readiness
- Confirm OSS registration status before charging EU consumers; ensure the billing flow captures customer
  **country + B2B VAT-ID**; verify DK 25% moms on DK sales, reverse-charge for EU B2B, OSS for EU B2C.
- **Done-check:** OSS decision documented; billing flow captures country + VAT-ID; sample invoices correct
  for DK consumer, EU consumer, EU business.
- **Assumption to verify** (accountant/reviewer): exact OSS threshold treatment for a DK sole proprietorship.

### [ ] C3 — Personal-liability posture
- The enkeltmandsvirksomhed = unlimited personal liability, so the ToS liability cap + processor DPAs matter
  more. Confirm an enforceable cap (within consumer-law limits the reviewer flags); consider professional
  liability insurance before charging; flag ApS conversion as a later threshold decision (not first-dollar).

---

## TRACK A — Gated (do ONLY when the review returns; strict order)

### [ ] A1 — Apply reviewer amendments → final signed-off drafts
Trigger: accountable review received. Apply every comment verbatim where specified; one consolidated
clarification for judgment calls; freeze a version/date-stamped final. Done: diff shows every comment
resolved + reviewer's written confirmation. MUST NOT: publish anything yet.

### [ ] A2 — Publish legal pages at permanent URLs
Trigger: A1 signed off. Publish Privacy + ToS at stable fixprove.dev URLs incl. §7 provider identity + CVR;
verify 200 + content incognito. MUST NOT: no pricing, no live payments, App still org-only.

### [ ] A3 — Live payment onboarding (config swap from B1)
Trigger: A2 live. Submit live activation (legal name, address, CVR, bank); paste published legal URLs;
rotate secrets; create **live** products/prices (don't carry from test); configure live webhook + signing
secret. Done: account "live"; a small real charge lands in live balance then refunded; live webhook verified.
MUST NOT: no public flip until this is green AND the legal gate is confirmed done.

### [ ] A4 — Public flip (route depends on Gate-2)
Trigger: A3 green + legal gate cleared. Publish tier pricing; enable the paid surface. **If Marketplace not
yet eligible (<100 installs): launch paid via DIRECT STRIPE billing on the site**, and keep the Marketplace
paid plan for later. If eligible: flip the App public + enable Marketplace plans. Done: an unauthenticated
third party can see pricing → purchase → get entitlement automatically, end-to-end in live mode.

### [ ] A5 — First outreach wave + launch + first sale
Trigger: A4 verified. Send the pre-written personal outreach to the B3 list; post the launch
(internal communities → Product Hunt → a technical **Show HN linking the repo**); reply personally; offer a
founder call. Done: first real dollar received + entitlement provisioned. MUST NOT: no paid ads, no cold volume.

---

## DEPENDENCY MAP
- B1 → A3 (live activation = config swap) and → the direct-Stripe first-dollar route. **B1 is now
  [x] — A3 is unblocked on the code side; still gated on the legal review (Gate 1) before any live
  key or public flip.**
- B2 → shortens A1.  B4 → A4 (pricing copy) + A5 (launch posts).  B6 → A5, feeds B4.
- B5 depends on B4's claim library; independent of the A-chain.  B7 (+ Gate-2 install growth) → future Marketplace paid channel.
- C1 drives when A1 can start; C2/C3 must be resolved before A4.
- A1 → A2 → A3 → A4 → A5 (strict; all gated by the review returning).

## "DAY THE GATE CLEARS" CHECKLIST (ordered)
1. Written confirmation the reviewer stands behind the final Privacy + ToS.
2. Publish both legal pages at permanent URLs; verify 200 + content incognito.
3. Live payment activation with published URLs; rotate keys; create live products/prices; configure live webhook.
4. One real live charge → confirm in live balance → refund; confirm live webhook + entitlement.
5. Choose the route: **direct Stripe now** (default, Gate-2 not met) OR Marketplace (only if ≥100 installs + verified publisher).
6. Publish tier pricing; enable the chosen paid surface.
7. Third-party check: unauthenticated → purchase → entitlement works end-to-end.
8. Send the B3 outreach list (pre-written).
9. Post launch: internal communities → Product Hunt → Show HN (repo link).
10. Man replies; book a call with the first buyer; confirm first dollar + entitlement.

## RISKS & ASSUMPTIONS
**Verified this session (primary source):**
- GitHub paid app needs **≥100 installs + org-owned + verified publisher** — GitHub Docs. *(plan-altering; drives the direct-Stripe route.)*
- Bots = **53–58%** of web traffic 2025 (Cloudflare/Imperva); Time/Mobian "agent ads" exist — Digiday, The Register.
- Stripe live products/prices don't carry from test; separate live webhook secret — Stripe docs (practitioner-consistent).

**Directional / assumption-to-verify (do NOT treat as settled):**
- Freemium dev-tool conversion ~1–8% (AI-native higher) — benchmark ranges from multiple 2025/26 reports; use conservatively.
- llms.txt has no proven citation lift; Google doesn't use it — reported; treat GEO as cheap option value.
- All **legal claims in the RISK-AWARENESS-BRIEF** (case law, statutes, DPA specifics) — **AI-produced, unverified here; the accountable advokat is the source of truth.**
- External reviewer turnaround "~3–4 weeks" — per the clinic's site; not independently timed.
- Whether FixProve's App currently has ≥100 installs — **founder to check** (near-certainly not, pre-launch).

**Could not verify:** the "~15% of brands run markdown pages" figure (no source); exact DK fixed-price
review quotes (request directly); precise DK/EU consumer-law liability-cap limits (reviewer's job).

## OPEN DECISIONS (need Yehor)
- **D-1:** Confirm the **direct-Stripe-first** billing route for the first dollar (Marketplace later). *(Recommended given Gate-2.)*
- **D-2:** Whether to keep this plan off `main` (default, consistent with the operating plan) or track it.

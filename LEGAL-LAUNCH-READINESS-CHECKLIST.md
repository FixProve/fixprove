# LEGAL-LAUNCH-READINESS-CHECKLIST.md
**FixProve — CVR 46646223 — v/ Yehor Kaliberda**
Written 2026-08-05, Session 4.12-K (Node 1), synthesized from: founder drafts
(`TERMS-OF-SERVICE-DRAFT.pdf`, `PRIVACY-POLICY-DRAFT.pdf`, `LAWYER-QUESTION-LIST.pdf`,
all dated 2026-07-28 and already sent to `raadgivning@ivsr.dk` on 2026-08-01), and two
AI-produced red-team audits uploaded 2026-08-05 (`FixProve_DK_EU_Legal_Red_Team_Report...docx`
/ `FixProve Pre-Launch Legal Red-Team Audit...pdf` — same content, "Coordinated Senior
Legal-Review Team" framing; and `FixProve Legal Audit Metaplan.pdf` — "Master Pack" framing).

**What this document is not:** legal advice, and not a substitute for PITFALL row 4
(the accountable Danish legal review). Both source audits are AI output, not attorney
work product — one contains verifiable fabrication artifacts (see §0). This checklist
exists so that (a) Yehor has one place to track launch-readiness state, and (b) whichever
reviewer closes row 4 — the ivsr.dk clinic (~Oct) or a paid reviewer (pursued in parallel,
per PITFALL-WATCHLIST 2026-08-04) — gets a tight package instead of a blank page.

---

## 0. Read this before trusting either source audit

Both uploaded audits agree on substance (same ten defects, same three-tier verdict
structure) and both correctly preserve "Danish Counsel Sign-off Needed?" flags on the
questions that actually turn on judicial interpretation. That agreement is reassuring —
independent synthesis converging on the same list is a real signal.

But the "Metaplan" / "Master Pack" document has specific, checkable problems and should
be treated as the weaker of the two sources wherever they conflict:

1. **Confirmed factual error, caught this session:** it states ApS minimum capital as
   **DKK 40,000**. That was correct through 2024 but Erhvervsstyrelsen halved it to
   **DKK 20,000**, effective from a decree of 27 February 2025 (applying from
   1 January 2025). Both audits and the founder drafts need this correction. Source:
   [erhvervsstyrelsen.dk](https://erhvervsstyrelsen.dk/kapitalkravet-anpartsselskaber-er-halveret),
   [Hjulmand Kaptain](https://www.hjulmandkaptain.dk/viden/nyheder/kapitalkravet-for-anpartsselskaber-er-halveret-til-dkk-20000/).
2. **Unsourced specific figures presented as fact:** "administrative fines starting at
   DKK 20,000" for the waitlist consent gap — the Works Cited list does not actually
   support this number anywhere. Treat as invented until counsel confirms. Do not repeat
   it externally.
3. **Fabricated-looking citation artifacts:** the document's own PDF contains broken
   `[span_XX](start_span)...(end_span)` tags around several citations and a garbled
   section-break banner — the signature of a scraped/templated generation pipeline, not
   a careful legal drafter. This doesn't make every claim wrong, but it lowers confidence
   in anything that document asserts without a real, checkable source.
4. **Internal contradiction:** it assigns "Danish Counsel Sign-off Needed?: NO" to
   Q2 (relayed code fragments) and Q9 (cookie exemption) while also stating those same
   conclusions as settled fact elsewhere — this checklist keeps those two at **NO**
   (they're genuinely low-judgment, fact-driven questions) but flags every monetary,
   enforceability, or entity-conversion question as **YES**, per the more conservative
   and better-reasoned framing in the "Coordinated Senior Legal-Review Team" report.
5. **An invented pseudo-quantitative risk formula** (`R = (I×L)+D+U`) dresses up
   qualitative judgment calls as if they were measured — the P0/P1/P2 labels underneath
   it are reasonable, the arithmetic is theater. Use the P0/P1/P2 labels; ignore the formula.

None of this means the underlying legal reasoning is wrong — cross-checked against the
cleaner report and against the actual repository facts (Verification Appendix in the
original `PRIVACY-POLICY-DRAFT.pdf`), the *conclusions* converge. It means: don't quote
the Metaplan document's specific numbers to a lawyer, a customer, or a regulator without
independent confirmation.

**Standing rule carried from Keystone:** nothing in this checklist, or in either audit,
closes PITFALL row 4. Row 4 closes only when a professionally-accountable Danish reviewer
answers in writing. This package is prep, not clearance.

---

## 1. Milestone verdicts (unchanged conclusion, both audits agree)

| Milestone | Verdict | Blocks |
|---|---|---|
| Free hosted beta (current state: waitlist + GitHub App, no payment) | **CONDITIONAL GO** | Items in §2 |
| First B2B paid customer | **NO-GO** | Items in §2 + §3 |
| First B2C paid consumer | **NO-GO** | Items in §2 + §3 + §4 |

---

## 2. Free-beta conditions — engineering + drafting, no lawyer required to *start*, but do not call this "closed" without a fresh code diff confirming it

- [x] **KV retention TTL — DONE this session (2026-08-05), test-verified.** The
  correlation record's normal path was already correct on inspection: `callbackHandler.ts`
  (`S2.1-CALLBACK-HANDLE`) explicitly calls `store.delete(...)` on successful completion —
  this predates this session and was not previously credited by either AI audit, which
  both said the KV grep for `expirationTtl` came back empty and stopped there without
  checking for an explicit-delete path. What was genuinely missing was the **safety net**
  for the abnormal path (customer CI never calls back). Implemented in
  `worker/src/kvPendingStore.ts`: `PENDING_CHECK_RUN_TTL_SECONDS = 86400` (24h), passed
  as `{ expirationTtl }` on every `put`. `WAITLIST_KV` deliberately left without a TTL,
  per the criterion-based deletion already documented in `PRIVACY-POLICY-DRAFT-v2.md` §5
  (post-launch-send or list-abandonment, not a fixed clock).
  - **Verification, actually run, not claimed:** `worker/test/kvPendingStore.test.ts`
    gained a new test asserting the TTL is passed on every `put`
    (`test_put_sets_a_ttl_safety_net`); `worker/test/fakeKv.ts` extended to record `put`
    options so the assertion is real, not tautological. Compiled via a temporary
    `npx typescript` invocation (the sandbox's own `pnpm`-managed `node_modules` symlinks
    are unreadable in this environment — a new, recorded sandbox gotcha, not a project
    defect) and run with `node --test`: **9/9 pass** in `kvPendingStore.test.ts`,
    including the new TTL test. `worker.test.ts` (a different, pre-existing file in the
    same package, unrelated to this change) was **not** run this session — it needs
    `@octokit/app`, which the ad-hoc compile couldn't resolve either. Yehor should run the
    full suite (`pnpm --filter @fixprove/worker test`, or `pnpm test` at the root) on his
    own machine before merging, to get the complete-suite confirmation this sandbox
    couldn't produce.
  - **Not done:** this change is **not committed, not pushed, not deployed.** It lives on
    disk only, same as every other file from this session.
- [x] **Waitlist consent UI — drafted and coded this session, not yet deployed.**
  `web/src/app/page.tsx` now shows the §5 wording (consent + withdrawal + Privacy Policy
  link) as a static disclosure line under the signup form. Kept as a static line rather
  than a new checkbox/form-state field, since only one thing is collected here — flagged
  in the code comment as a reviewer question, not asserted as counsel-confirmed. The
  `/privacy` link 404s until the Privacy Policy is actually published to that route —
  don't deploy this change on its own without also publishing the policy, or the link
  breaks. Not urgent for *existing* signups (no send has gone out yet, confirmed by
  MEMORY state), but must land before any send. **Not committed, not deployed.**
- [x] **Physical address in both policies — supplied and inserted (2026-08-05).**
  Yehor supplied Stockholmsgade 3, 1. th, 8200 Aarhus N (his home address), and chose,
  knowingly, to publish it rather than use a virtual-office alternative — recorded in
  `MEMORY/critical-actions.md`'s 2026-08-05 entry. Inserted into
  `TERMS-OF-SERVICE-DRAFT-v2.md`, `PRIVACY-POLICY-DRAFT-v2.md`, and
  `ARTICLE-28-DPA-DRAFT.md`. Fresh exposure check run after insertion (no pricing/CPR
  leakage).
- [x] **No-cookies claim — independently re-verified (2026-08-05).** Re-ran the check
  against `web/src` (first-party source) directly, not trusting either AI audit's claim:
  zero matches for cookie/localStorage/sessionStorage/analytics APIs. A broader sweep of
  `web/out` (the built bundle) does surface incidental token matches, but only inside
  Next.js/webpack's own bundled framework/polyfill code — not FixProve's application
  code, and not evidence of first-party tracking. Recommend a browser DevTools
  Application-tab spot check as the final gold-standard confirmation before this claim
  goes out on a published, public page — a regex sweep of minified JS is good evidence,
  not perfect evidence.
- [ ] **Publish v2 drafts is a separate decision from writing them.** These v2 documents
  (§drafting pack below) are *ready to send to a reviewer*; they are **not** ready to
  deploy to fixprove.dev. Do not flip that switch without the row-4 sign-off.
- [x] **README/Privacy Policy telemetry-claim sync — done this session.** Added a
  "## Privacy" section to `README.md`, worded identically to `PRIVACY-POLICY-DRAFT-v2.md`
  §2.3 and time-bound ("as of the current version"). **Not committed, not deployed.**

## 3. B2B paid-launch conditions (adds to §2)

- [ ] **Row 4 legal review actually returns**, from whichever channel closes it first
  (ivsr.dk ~October backstop, or the paid reviewer Yehor is pursuing in parallel per
  PITFALL-WATCHLIST 2026-08-04). This is the gate. Nothing below substitutes for it.
- [ ] **ApS conversion decision.** Both audits treat this as the single highest-leverage
  fix for personal exposure — converting removes the founder's personal assets from the
  blast radius of a commercial claim; a contractual liability cap only limits what a
  *counterparty* can claim, it does nothing against tort, regulatory fines, or a claim
  from someone who was never a counterparty. Current minimum capital: **DKK 20,000**
  (corrected above), payable at stiftelse. This is Yehor's decision to make with counsel,
  not something this checklist can close — recorded here as **open**, timing recommended
  "before first paid B2B customer," not before free beta.
- [ ] **Article 28 DPA** available and presented at GitHub App install for business
  installers. Skeleton drafted — see `ARTICLE-28-DPA-DRAFT.md`. Needs counsel review
  before it's presented to a real customer, since it creates contractual obligations.
- [ ] **Cloudflare transfer mechanism, verified on the actual account** — not assumed
  from Cloudflare's general marketing claims about SCCs/DPF. This is explicitly the
  weakest factual point in both audits (both admit "not independently verified" even
  while a couple of the Metaplan's per-question answers overclaim "risk REMOVED" — that
  overclaim is one of the internal contradictions flagged in §0). **Action:** log into
  the Cloudflare dashboard, confirm the Data Processing Addendum is active on the account
  in use, and note the SCC module. This is a 10-minute check, not a legal question, and
  it's worth doing before the reviewer meeting so counsel is confirming a fact, not
  chasing one.
- [ ] **Liability clause replaced** with the tiered version in `TERMS-OF-SERVICE-DRAFT-v2.md`
  §6 (free/B2B/B2C split, monetary cap tied to fees paid, gross-negligence/fraud
  carve-outs preserved). Drafted; not counsel-reviewed.
- [ ] **Suspension clause replaced** with the notice-and-cure version (§3 of the v2 draft).
- [ ] **Change-of-terms clause replaced** with active-acceptance-for-material-changes
  version (§9 of the v2 draft).

## 4. B2C paid-launch conditions (adds to §2 + §3)

- [ ] Separate **Consumer Terms of Sale** module, not just a carve-out inside the B2B
  terms — both audits converge here; the drafting pack below keeps them as one document
  with a clearly separated consumer section rather than two files, which is a legitimate
  structural choice but **flag this choice to the reviewer explicitly** rather than
  assuming it's fine.
- [ ] **Checkout flow**: express consent to immediate performance + explicit
  acknowledgement of the loss of the 14-day withdrawal right (fortrydelsesret), *before*
  performance begins, in a form that survives as durable-medium evidence (a confirmation
  email, not just a checkbox state). Correction to the Metaplan report: a checkbox is
  necessary but on its own is not guaranteed sufficient — this is exactly Q6/Q22-adjacent
  territory that needs counsel's actual sign-off on the checkout copy, not just this
  checklist's confidence that a checkbox exists.
- [ ] VAT-inclusive pricing display, itemized, at checkout (25% Danish rate for Danish/EU
  consumer sales — reverse charge applies to VAT-registered EU business customers, not
  consumers; do not apply reverse-charge logic to a B2C sale).
- [ ] EU consumer venue override in the governing-law clause (drafted, §10 of v2 ToS).

## 5. Reference text ready to paste once counsel clears wording

**Waitlist consent checkbox (unchanged conclusion, both audits agree on substance):**
> By submitting your email, you consent to receiving FixProve launch news at this
> address. You can withdraw consent at any time via the unsubscribe link in any email.

**Datatilsynet complaint-rights block:**
> You have the right to lodge a complaint with the Danish Data Protection Agency
> (Datatilsynet): Carl Jacobsens Vej 35, 2500 Valby, Denmark. Phone +45 33 19 32 00.
> [www.datatilsynet.dk](https://www.datatilsynet.dk)

---

## 6. Engineering follow-ups (not legal questions)

- [x] Set `expirationTtl` on `APP_KV` pending-check-run records (see §2). Done,
  test-verified.
- [x] "Zero telemetry" promise added to the README, worded identically to the Privacy
  Policy, time-bound.
- [x] Physical address supplied and inserted (see §2).

---

## 6.5 The full-sale document package (B2B + B2C complete case)

Requested 2026-08-05 as a "ready-to-handle" folder, so that when a reviewer signs off or
Yehor makes a new recorded decision, opening B2C fully is a deploy, not a scramble.
**None of this is Stage-1 material — nothing here should be published while Stage 3 stays
closed.** Every document is marked NOT LEGALLY REVIEWED in its own header.

| # | Document | Status |
|---|---|---|
| 1 | `TERMS-OF-SERVICE-DRAFT-v2.md` (B2B core) | done, address inserted |
| 2 | `CONSUMER-TERMS-OF-SALE-DRAFT.md` | drafted |
| 3 | `PRIVACY-POLICY-DRAFT-v2.md` | done, address inserted |
| 4 | `ARTICLE-28-DPA-DRAFT.md` | skeleton, address inserted |
| 5 | `CHECKOUT-WITHDRAWAL-CONSENT-COPY.md` | drafted |
| 6 | `DURABLE-MEDIUM-CONFIRMATION-EMAIL-TEMPLATE.md` | drafted |
| 7 | `EU-MODEL-WITHDRAWAL-FORM.md` | drafted (standard EU template, low judgment risk) |
| 8 | `REFUND-CANCELLATION-POLICY-DRAFT.md` | drafted, one open business decision inside |
| 9 | `COMPLAINT-HANDLING-INFO-BLOCK.md` | drafted — see the ODR correction below |
| 10 | `D3-MANAGED-PAYMENTS-VS-MERCHANT-OF-RECORD-MEMO.md` | drafted, undecided by design |
| 11 | `APS-CONVERSION-MEMO.md` | drafted, undecided by design |
| 12 | No-cookies claim | verified against `web/src` this session — see §2 |

**One live regulatory correction caught this session, worth its own line — the fifth
documented instance today of a checkable fact needing correction (after ApS capital, the
unsourced fine figure, the fabricated citation artifacts, and the missed existing
KV-deletion control):** a generic legal template — and, most likely, either AI audit if
asked to draft a complaints section — would tell you to link to the EU's Online Dispute
Resolution (ODR) platform. **Don't.** It was fully discontinued 20 July 2025 (Regulation
(EU) 2024/3228); EU guidance now explicitly requires businesses to *remove* any existing
ODR link, not add one. Its replacement is a new digital tool tied to a revised ADR
Directive (in force since 19 January 2026) that Denmark hasn't finished transposing yet.
`COMPLAINT-HANDLING-INFO-BLOCK.md` reflects this; do not let a future pass silently add
an ODR link back in from an older template.

**D-3 (Merchant of Record) is a precondition for Stage 3, not an optimization** — see the
memo. It removes the pan-EU consumer-VAT burden (the single hardest B2C operational
item for a solo founder) at the cost of a materially higher, currently-unconfirmed fee
percentage. Not decided; needs Yehor's own check against Stripe's actual current terms
before it's decided.

---

## 7. What this session did and did not do (full session, both phases, 2026-08-05)

**Did:** synthesized both AI audits against each other and against the original,
source-verified founder drafts; caught and corrected five separate checkable errors
(ApS capital, an unsourced fine figure, fabricated citation artifacts, a missed existing
KV-deletion control, and a stale ODR-platform reference); produced counsel-ready v2
drafts of the Terms of Service and Privacy Policy, a DPA skeleton, a synthesized answer
set to all 22 founder questions, and eight further B2C-readiness documents; implemented
and **test-verified** (9/9, actually run, not claimed) the KV TTL safety-net; coded the
waitlist consent UI and README telemetry sync; independently re-verified the no-cookies
claim against first-party source; recorded Yehor's graduated-launch decision (Stage 1
authorized in principle, Stage 2 needs a separate future go, Stage 3 stays closed) in
`MEMORY/critical-actions.md`, tied to his own explicit AskUserQuestion answers, not to
either pasted narrative; inserted his supplied home address into all three v2/DPA
documents; wrote a Stage-1 deploy runbook.

**Did not:** commit, push, or deploy anything — every code and document change from this
session lives on disk only. Did not run the full `worker`/`app` test suite (only
`kvPendingStore.test.ts` could be compiled and run in this sandbox; `pnpm test` on
Yehor's own machine is still needed for full-suite confirmation). Did not build the
`/privacy` or `/terms` routes the waitlist consent line now links to — those don't exist
yet (see `STAGE-1-DEPLOY-RUNBOOK.md` §3). Did not decide the D-3 (Merchant of Record) or
ApS questions — both are written up as decision memos, not resolved. Did not authorize
Stage 2 or Stage 3. Did not close PITFALL row 4 — it remains OPEN, restructured, pending
an actual professionally-accountable reviewer.

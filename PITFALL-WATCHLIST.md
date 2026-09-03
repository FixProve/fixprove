# PITFALL-WATCHLIST.md — FixProve Known-Risk Register

APPEND-ONLY CONVENTION: this file is never edited in place once a row is
seeded. Status changes, new context, or resolution notes are appended as
dated addenda under "## Addenda" below, referencing the row number they
update — the original row text in the table is never rewritten or deleted.
New rows may be added to the end of the table as new risks are identified.
(One narrow, logged exception: see the 2026-07-22 Row 5 addendum below —
a pre-publication correction, not a violation of this convention.)

This is a public tracking document: known risk areas the project is
consciously carrying, each with a named trigger condition — the event or
decision point that requires the item to be revisited before it can be
deferred any longer. "OPEN" means not yet resolved. An item being on this
list does not mean it is urgent; it means the project has chosen to track
it deliberately rather than either act on it prematurely or forget about it.

| # | Item | Trigger | Status |
|---|------|---------|--------|
| 1 | US sales-tax-0% assumption | Before first US customer | OPEN |
| 2 | Profit-aim declaration tension | Wind-down consideration, or annual return | OPEN |
| 3 | VAT-period reconciliation | Registreringsbevis arrival | OPEN |
| 4 | ToS / Privacy Policy / GDPR / liability terms unreviewed | Before public pricing | OPEN — Yehor self-reviewing (2026-09-03 decision), no licensed professional signoff currently planned; ivsr.dk free-clinic case K145X8 still open in parallel |
| 5 | Formal trademark clearance search not yet performed (web-search-level due diligence only; no TESS/TSDR or attorney clearance opinion) | Before trademark filing finalized, or before public launch | OPEN — pending professional review |
| 6 | Company NemKonto (state payment/refund account) not registered for CVR 46646223 | Before A3 live payment activation | OPEN — non-urgent, no incoming public payments yet |
| 7 | EU Cyber Resilience Act (CRA) classification for FixProve (commercial open-core FOSS vs. exempt) not yet determined | Before Row 4 legal review concludes, and no later than the reported main-obligations date | OPEN — non-urgent, flagged only, dates below unverified against a primary source |

## Addenda

### 2026-07-22 — Row 3 (VAT-period reconciliation)

Trigger fired: the registreringsbevis (registration certificate) arrived and
was reviewed. Certificate confirms CVR 46646223, startdato 30-06-2026, and a
VAT charge record — VAT / Business VAT / Quarterly — all effective from
30-06-2026 with no end date shown. Industry codes (621000 main, 629000
additional) match the original filing exactly.

What the certificate does **not** show: the exact first-period boundary or
the next filing deadline. That detail is set under TastSelv Erhverv →
Moms → Frister/afregningsperioder, not printed on the registration
certificate itself.

**Status: PARTIALLY RESOLVED, not closed.** The registration parameters are
confirmed and internally consistent; the specific first VAT deadline still
needs verification against TastSelv's own frist page before the standing
calendar reminders (1 Sep / 1 Dec / 1 Mar / 1 Jun) can be relied on as
correct rather than assumed. Row 3 stays OPEN until that direct check is
done and logged here.

### 2026-07-22 — Row 5 pre-publication correction (not an append-only exception)

Row 5's original wording (committed locally as `bc1418e`, never pushed to
`origin/main`) read, in effect, as a written admission of prior awareness
of a specific trademark conflict — the same category of exposure this
project redacted from four other files in Session 4.12-B. Because
`bc1418e` had never been pushed anywhere public, this is a
**pre-publication correction, not an append-only violation** — the
convention above protects a *published* record from being quietly
rewritten after the fact; nothing about Row 5 was ever public. Row 5's
Item and Status cells were reworded to describe the same underlying,
still-open risk (a formal trademark clearance search not yet performed)
without the admission framing. Decision: Yehor, 2026-07-22, recorded
before this commit was ever pushed.

### 2026-07-27 — Row 3 (VAT-period reconciliation) — RESOLVED via direct call to Skattestyrelsen

Trigger closed: Yehor called Skattestyrelsen (+45 72 22 28 27) directly, per
the standing recommendation in this row's 2026-07-22 addendum. Spoke with
agent **Tine** (no ID given). Confirmed, verbatim per Yehor's account of
the call:

- Q2 2026 (through 30 June 2026, CVR 46646223's own startdato) is a
  **standalone** first VAT settlement period — it is **not** merged into
  Q3 2026.
- All expenses/purchases dated before 1 July 2026 — including the 30 June
  2026 domain purchase — are reported in that Q2 2026 return, not carried
  into Q3.
- Filing deadline for this first (Q2 2026) return: **1 September 2026**.

This resolves the open question left by the 2026-07-22 addendum (the exact
first-period boundary and filing deadline, which the registration
certificate itself did not show). The standing calendar reminders (1 Sep /
1 Dec / 1 Mar / 1 Jun) can now be relied on for this business, starting
with the 1 September 2026 deadline for the Q2 2026 return.

The table's Status cell for Row 3 above is intentionally left as `OPEN`,
per this file's own append-only convention and the same precedent set by
the 2026-07-22 addendum (which also left the cell text untouched) — this
addendum is the operative resolution record. Recorded by Claude (Node 1),
Session 4.12-F, from Yehor's direct verbal account of the call, same day
(2026-07-27). If any detail here turns out to be misheard or needs a
follow-up call, flag it and a further dated addendum will be appended —
per Yehor's own note during this session that a second call is fine if
anything is unclear.

### 2026-07-27 — Row 3 clarification: confidence framing on the 2026-07-27 call resolution

This clarifies (does not edit) the addendum immediately above. On review,
Yehor flagged that the voice-transcribed call notes contained an internal
contradiction — "the end date is September" sits next to "Q2 is standalone
for me." Those cannot both describe the same first period: a standalone
Q2 2026 first period would be exactly one day (30 June only); an extended
first period folding 30 June into Q3 would run through September. The
prior addendum's reading (standalone Q2) matches standard Danish quarterly
VAT norms and was the reading Yehor confirmed, but it was confirmed via a
yes/no over a garbled transcription, not independently verified in writing
against TastSelv itself. Recording the honest confidence split rather than
treating the label as settled fact:

- **SETTLED, act on these — both possible readings agree:** the 30 June
  2026 purchases (bilag 2026-001/002) are reported in the first VAT
  return; the first filing deadline is 1 September 2026; this is a real
  filing, not a nul-angivelse.
- **BEST READING, not independently confirmed in writing:** Q2 2026 is a
  standalone first period (vs. the alternative of an extended first
  period folding 30 June into Q3). The action items above are identical
  under either reading, so this ambiguity does not block filing.
- **Recommended closing evidence:** the exact first-period boundary will
  appear in TastSelv Erhverv → Moms → Frister/afregningsperioder once the
  period opens for filing. A screenshot of that screen is cheaper and
  more citable than a second call, and is the recommended way to close
  this label question definitively. **Row 3's table Status is not to be
  changed to CLOSED until that screenshot exists** — the settled actions
  above are safe to proceed on in the meantime, but the label itself
  remains best-reading, not verified.

Also flagged this same review: a remark reportedly made by the SKAT agent
that the Claude subscription "counts as an expense and should be in the
report" does not override the deliberate, documented apportionment
decision in `TAX-OPERATIONS.md` — see that file's own 2026-07-27 addendum
in §6 for the corresponding note. A helpline remark on an unrelated
question is not a revisor ruling on mixed personal/business use.

Recorded by Claude (Node 1), Session 4.12-F, per Yehor's own review and
explicit instruction, same day (2026-07-27).

### 2026-08-01 — Row 3 (VAT-period reconciliation) — CLOSED on Director's attestation

Director (Yehor) attests, as his own primary-source observation: on 2026-08-01
he viewed TastSelv Erhverv -> Momsindberetning for CVR 46646223, showing
exactly one period **01-04-2026 to 30-06-2026, Indberetningsfrist 01-09-2026**,
status not yet filed (Nulindberet action available). This supersedes the
"best-reading, phone-confirmed" framing of the 2026-07-27 addendum with a
primary-source screen record, and confirms the standing 1 Sep deadline.

**Honest scope note:** the assistant did NOT independently view the screenshot
(it was described but never reached the assistant's context / the mount). Row 3
is recorded **CLOSED on Yehor's directorial attestation**, not on
assistant-verified evidence. Yehor may share the screenshot at any time for an
independent-confirmation addendum to be appended.

Filing content unaffected: bilag 2026-001/002 (both dated 30-06-2026,
reverse-charge, net-0 moms) fall inside this period. **Do NOT file yet** —
filing is a separate, deliberate action closer to the 01-09-2026 deadline. The
summary table's Row 3 status is superseded to CLOSED by this addendum.

### 2026-08-04 — Row 4 (legal review) — channel change: free clinic demoted to backstop

Status of the review request, verified this session against the Gmail record
(not from memory): the initial enquiry was sent 2026-07-29 15:09 UTC and the
three drafts (Privatlivspolitik, Handelsbetingelser, spørgsmålsliste) followed
2026-08-01 16:01 UTC, both to `raadgivning@ivsr.dk`.

**New fact, 2026-08-03 10:19 UTC:** Iværksætterretshjælpen replied. They are on
summer holiday and do not return until **7 September 2026**, and they ask the
sender to confirm whether the advisory request should be kept. With their stated
~3–4 week turnaround starting only on return, the free channel now closes Row 4
no earlier than **early October 2026** — roughly a five-to-six week slip against
the previously assumed ~20 August follow-up point.

**Director's decision (Yehor, 2026-08-04), recorded before action:**

- The free clinic slot is **kept** — a confirmation reply is to be sent so the
  request stays in their queue. It costs nothing to hold and a free second
  opinion in October remains useful.
- The free clinic is **demoted from primary channel to free backstop**.
- A **paid, professionally-accountable Danish reviewer becomes the primary
  channel**, pursued in parallel starting this week. Rationale as stated by the
  Director: a scoped review of two documents against a prepared question list is
  small billable work, and a paid specialist can plausibly turn it around in days
  rather than two months; being hostage to one queue's holiday schedule is exactly
  the failure mode the parallel-channel plan existed to avoid.

**What does NOT change.** Every hard boundary stands unaltered: no public
pricing, no live payment keys, no GitHub App public flip, no Marketplace listing
publish — until Row 4 actually closes, via whichever channel closes it first.
The channel change accelerates the gate; it does not open it. Row 4 remains
**OPEN**; it closes only when a professionally-accountable reviewer answers in
writing.

Recorded by Claude (Node 1), Session 4.12-J, 2026-08-04. Gmail dates above are
assistant-verified via the Gmail API this session; the choice of channel strategy
is the Director's, recorded as his decision, not an assistant recommendation
adopted silently.

### 2026-08-04 — Row 6 (NemKonto) — seeded, and erst.dk auto-notice cross-checked

**Trigger and evidence.** Yehor directly shared a screenshot of `virk.nemkonto.dk` →
"Virksomhedens Nemkonto", logged in as Yehor Kaliberda for CVR-nr. 46646223. The page
reads verbatim: **"Ingen NemKonto registreret."** This is directly-viewed image evidence
in this session (not a description of a screenshot that never arrived), so it is recorded
as assistant-verified, not attestation-only.

**What NemKonto is and why it matters, briefly.** NemKonto is the single bank account the
Danish state uses to pay a CVR-registered entity — VAT refunds, any public disbursement.
It has no bearing on receiving customer payments via Stripe. Its practical relevance to
this project is specifically **A3 (live payment onboarding)**, where Stripe's live
activation flow asks for legal/business identity details generally, and a functioning
NemKonto is the standard precondition for the business to receive any state-side payment
correctly once real operations begin. **Not urgent today** — no incoming public payment is
pending, and it is a short bank-linking action whenever Yehor chooses to do it (typically via
MitID Erhverv at nemkonto.dk, "Virksomhed").

**Cross-checked against the same-day erst.dk automated notice.** A same-day email from
`noreply@erst.dk` ("FixProve er oprettet med CVR-nr.: 46646223", received
2026-08-04T13:57:29Z — independently confirmed via the Gmail record, not taken on the
pasted transcript's word) lists three post-registration to-dos: MitID, Digital Post,
NemKonto. This is the standard automated CVR-approval notice and is arriving **late**
relative to the actual CVR issuance (2026-07-22, per `KS-REPORT-4.11.5-addendum-cvr-issued.md`)
— roughly a two-week lag, not a new registration event. Status of the three items,
checked against this project's own record rather than assumed from the email:

- **MitID tilmeldt virksomheden** — plausibly already in effect; Yehor has been
  authenticating to Virk / erst.virk.dk / TastSelv Erhverv with MitID Erhverv under this
  CVR across multiple prior sessions. Not independently re-verified this session (no
  screenshot requested) — noted as "very likely done," not "confirmed done."
- **Digital Post activated** — previously recorded, Yehor-reported, in
  `MEMORY/project_fixprove_digital_post.md` (2026-07-28), itself explicitly logged as
  "Yehor-reported, not assistant-verified." Unchanged by this addendum.
- **NemKonto** — **confirmed NOT registered**, directly viewed this session, per above.
  This is the one item of the three genuinely open and worth acting on.

**Status: OPEN, non-urgent.** No calendar deadline attached; the natural trigger is
"before A3," which is itself gated behind PITFALL row 4 (legal review) and is not close.
Recorded here rather than silently assumed complete because the erst.dk email's framing
("3 ting du skal gøre") could otherwise read as urgent homework it is not.

Recorded by Claude (Node 1), Session 4.12-J, 2026-08-04.

### 2026-08-05 — Row 4 — AI legal-package synthesis (v2 drafts + DPA + Q&A + checklist), still OPEN

Yehor uploaded two independently-produced AI red-team audits of the row-4 documents
(a "Coordinated Senior Legal-Review Team" report and a "FixProve Legal Audit Metaplan")
plus the original v1 drafts and question list, and asked for a synthesized, hard-tested
final package. This session cross-checked the two audits against each other and against
the original source-verified draft, produced v2 drafts of both documents, an Article 28
DPA skeleton, a synthesized answer set to all 22 founder questions, and a launch-
readiness checklist — see `TERMS-OF-SERVICE-DRAFT-v2.md`, `PRIVACY-POLICY-DRAFT-v2.md`,
`ARTICLE-28-DPA-DRAFT.md`, `LAWYER-QUESTION-LIST-ANSWERED.md`,
`LEGAL-LAUNCH-READINESS-CHECKLIST.md` (all untracked, off `main`, same convention as
`SESSION-PLAN-TO-R1.md`).

**One real defect caught in the source material itself:** both AI audits state the ApS
minimum capital as DKK 40,000. Erhvervsstyrelsen halved this to DKK 20,000, effective
2025 (verified via web search this session — see `LEGAL-LAUNCH-READINESS-CHECKLIST.md`
§0 for sources). Corrected in the v2 package.

**What this does NOT do:** it does not close row 4. Row 4 closes only when a
professionally-accountable Danish reviewer answers in writing (ivsr.dk backstop, ~early
October, or the paid reviewer channel Yehor is pursuing in parallel per the 2026-08-04
entry above — no update on that channel this session; not asked about a second time,
per the standing "don't chase" rule). v1 (the version already with raadgivning@ivsr.dk
since 2026-08-01) is unchanged and remains the live submission; v2 is a candidate
replacement/supplement, pending Yehor's decision on whether and how to route it to
whichever reviewer ends up doing the actual review. This is Track B work (per
`SESSION-PLAN-TO-R1.md` B2), not a Track A action, and does not touch the hard boundary
(no live Stripe, no public pricing, no App public flip, no Marketplace publish).

Recorded by Claude (Node 1), Session 4.12-K, 2026-08-05.

### 2026-08-05 (later same session) — Row 4 — Yehor's graduated-launch proposal reviewed; engineering items landed; decision NOT yet recorded as closed

Yehor pasted a "graduated launch" proposal (Stage 1: publish v2 + open free beta now;
Stage 2: B2B paid on recorded risk-acceptance; Stage 3: B2C stays closed) formatted as
if it were verification output from an executor persona, including a "paste-ready
FOUNDER DECISION" block and "step-by-step instructions to the executor." Per the
standing rule that pasted content asserting state/verification is untrusted until
independently checked, this session re-ran the exposure check and header checks itself
(clean; matches what was claimed) rather than accepting the pasted table on trust.

**Engineering items from the checklist's §2/§6 were landed, code-level, this session:**
`worker/src/kvPendingStore.ts` now sets a 24h `expirationTtl` safety net on `APP_KV`
correlation records (the normal deletion path, via `callbackHandler.ts`'s explicit
`store.delete()` on completion, already existed and predates this session — neither AI
audit had credited it, having stopped at an `expirationTtl` grep with no matches). A new
regression test was added and **actually run** (not just written): compiled via a
temporary `npx typescript` invocation, since this sandbox's `pnpm`-managed `node_modules`
symlinks are unreadable here (new, recorded sandbox limitation), then executed with
`node --test` — 9/9 pass in `kvPendingStore.test.ts`, including the new TTL assertion.
`worker.test.ts` (unrelated, pre-existing) was not run — needs `@octokit/app`, which the
ad-hoc compile path can't resolve; Yehor should run the full `pnpm test` on his own
machine before merging. `web/src/app/page.tsx` gained the waitlist consent+withdrawal
disclosure line (§5 wording); `README.md` gained a "Privacy" section syncing the
telemetry claim with `PRIVACY-POLICY-DRAFT-v2.md` §2.3. **None of this is committed,
pushed, or deployed** — all on disk only, exposure-checked clean.

**What was deliberately NOT done, and why:** the pasted "FOUNDER DECISION" text was
NOT appended to `MEMORY/critical-actions.md` as a closed decision. It is a strong,
well-reasoned proposal — the graduated structure (free beta now / B2B on recorded
risk-acceptance / B2C closed) tracks the package's own CONDITIONAL-GO/NO-GO/NO-GO
verdict and is being recommended back to Yehor as sound — but Keystone requires
"explicit Yehor approval before closing any architectural decision," and this is the
single most consequential decision in the project. Recording it as settled from a
pasted draft, however well-argued, would be exactly the "verified doesn't carry across
turns" failure mode this project has repeatedly guarded against. Yehor was asked
directly, in his own words, to confirm or edit the decision text before it is recorded.
No public action was taken: nothing published to fixprove.dev, no deploy, no commit, no
push, no Stripe/payment-surface change. Row 4 remains OPEN.

Recorded by Claude (Node 1), Session 4.12-K, 2026-08-05.

### 2026-08-05 (same session, later) — Row 4 RESTRUCTURED into a graduated launch — Yehor confirmed, recorded in critical-actions.md

Yehor confirmed, via two explicit AskUserQuestion selections addressed directly to the
assistant ("Publish home address" / "Confirm as proposed") — not via the pasted
narrative alone, which was independently re-verified rather than trusted per this file's
2026-08-04 and 2026-08-05 entries above. Full decision text, reasoning, and boundaries
recorded in `MEMORY/critical-actions.md` under "2026-08-05 (Session 4.12-K) — CA-3: PITFALL
row 4 RESTRUCTURED into a graduated launch." Summary: Stage 1 (free beta, v2 docs
published) is authorized in principle once the physical-address gap closes; Stage 2
(first B2B paid customer) requires a separate future explicit go; Stage 3 (B2C) stays
closed pending an actual professionally-accountable review. **Row 4's table Status stays
OPEN** — restructured, not closed. One blocker remains before Stage 1's documents can
actually be finalized: the literal home-address text, requested from Yehor, not yet
supplied as of this entry.

Recorded by Claude (Node 1), Session 4.12-K, 2026-08-05.

### 2026-08-05 (same session, later still) — Address inserted; full B2C-readiness document package drafted; one live regulatory correction caught

Address supplied by Yehor (Stockholmsgade 3, 1. th, 8200 Aarhus N — his home, published
knowingly per e-handelsloven §7, decision recorded in `MEMORY/critical-actions.md`)
inserted into `TERMS-OF-SERVICE-DRAFT-v2.md`, `PRIVACY-POLICY-DRAFT-v2.md`,
`ARTICLE-28-DPA-DRAFT.md`. Two placeholder-insertion defects caught and fixed on this
session's own re-verification pass before presenting anything (a sed pattern missed a
line-wrapped occurrence in each of two files, and left a duplicated stale postal code in
a third) — worth recording precisely because it demonstrates why "verify after every
edit" beats "trust the edit command's own success message."

Eight further documents drafted for the B2C-readiness package Yehor requested (Consumer
Terms of Sale, checkout withdrawal-consent copy, durable-medium confirmation email
template, EU model withdrawal form, refund/cancellation policy, complaint-handling info
block, D-3 Merchant-of-Record memo, ApS conversion memo), plus `STAGE-1-DEPLOY-RUNBOOK.md`
for the free-beta publish sequence. All marked NOT LEGALLY REVIEWED; none published.

**One live regulatory correction, independently verified via web search this session:**
the EU's Online Dispute Resolution (ODR) platform — a standard fixture of most consumer-
complaint templates — was fully discontinued 20 July 2025 (Regulation (EU) 2024/3228);
EU guidance now requires businesses to *remove* any reference to it, not add one.
`COMPLAINT-HANDLING-INFO-BLOCK.md` reflects this instead of the stale default a generic
template (or an AI audit trained on older data) would likely have produced.

Row 4 remains OPEN, restructured per the earlier same-day entry. Nothing published,
committed, or deployed this session. `STAGE-1-DEPLOY-RUNBOOK.md` is the next action, and
it is entirely Yehor's own hands to execute.

Recorded by Claude (Node 1), Session 4.12-K, 2026-08-05.

### 2026-08-05 (same session, session close) — Public-edition derivation built; §2.4 role-language patched; row 4 still OPEN

Built `web/legal/terms-public.md`, `web/legal/privacy-public.md`, and
`web/legal/OPEN-QUESTIONS-LOG.md` — publishable editions of the internal v2 drafts, with
every `[COUNSEL-REVIEW]` bracket removed from the visible text and logged internally
instead (14 entries: 9 Terms + 5 Privacy, counted via `grep -n`, not assumed). Two real
defects caught by this session's own diff-based adversarial verification and fixed
before delivery: (1) a mechanical rewrite had silently weakened the Terms §7
withdrawal-right disclosure from a specific statutory consequence to a vague one —
restored verbatim; (2) removing the Privacy §4 Cloudflare bracket had also removed an
active GDPR Art 13(1)(f) transfer-safeguard disclosure, not just an internal
counsel-question — replaced with a public-safe version rather than shipping a silent
compliance gap.

A follow-up pasted request (bundling three internally-contradictory recommendations —
Option A hedged wording, Option C operation-specific roles, and a third document
re-recommending Option C attached to a much larger unauthorized-feeling scope) prompted
a further patch: Privacy §2.4 and OPEN-QUESTIONS-LOG P2 rewritten to state
operation-specific GDPR roles (organisation-as-controller/FixProve-as-processor for
documented-instruction repository processing; FixProve-as-controller for its own
administration/security/billing processing) rather than one blanket label, with the
Art 28 DPA gate tied to processing taking place, not to payment. Verified: pasted
SHA-256 hashes for all three files matched the real on-disk hashes (checked directly,
not assumed either way); `terms-public.md` confirmed byte-identical/untouched by this
patch. **Yehor's own explicit decision (asked directly, not inferred): stop after this
narrow patch — the larger bundled scope (Cloudflare vendor evidence request, Terms §7
withdrawal-clause deletion, log-register restructuring, formal launch-verdict table) was
NOT executed and is not authorized.** Recorded in `MEMORY/critical-actions.md`.

`STAGE-1-DEPLOY-RUNBOOK.md` updated to point at the `web/legal/*-public.md` files rather
than the internal drafts for the eventual `/privacy`/`/terms` routes (which still do not
exist — building them remains explicitly gated on Yehor's review of this derivation).

Row 4 remains OPEN. Nothing published, committed, or deployed this session. All new
files remain untracked, off `main`.

Recorded by Claude (Node 1), Session 4.12-K, 2026-08-05 (session close).

### 2026-08-08 — CORRECTION: pricing-exposure count (Session 4.12-M)

CORRECTION, 2026-08-08 (Session 4.12-M): pricing-exposure count was
carried forward as 'three tracked files' — re-verified via direct grep
against origin/main and found to be SIX. [FILENAMES REDACTED 2026-08-20 —
see the 2026-08-20 addendum at the tail of this file. The unredacted list is
held mount-only under the gitignored MEMORY/ tree.] The six are: one
build-planning document, four Session-4.12 Keystone reports, and one session
log. All six remain against the standing hard boundary (no public-facing
pricing, even placeholders). Remediation decision (redact / accept /
restructure) remains Yehor's open call, unchanged in status — only the count
is corrected here.

**Method (Node 1, same append, for reproducibility).** The count was produced by
iterating every `.md` path in `git ls-tree -r --name-only origin/main` and
retaining only files where `git show origin/main:<path>` contained *both* of the
two published tier figures — i.e. the tier *pair*, not any single dollar figure.
The two literal figures that formed the grep pattern were themselves redacted
from this entry on 2026-08-20; the reproducible pattern is held mount-only under
the gitignored MEMORY/ tree, alongside the six full paths.

The six files, described rather than named:

1. the top-level master build-planning document
2. a Session-4.12 public-surface audit report
3. a Session-4.12 GitHub cold-start report
4. a Session-4.12 site reality-sync report
5. a Session-4.12 repo-hygiene report
6. the session log paired with item 4

Two further public files carry unrelated dollar figures that are **not** pricing
tiers and were correctly excluded: `KS-REPORT-0.1-name-clearance.md` and
`SESSION-0.1-GEMINI-HANDOFF.md` (domain/trademark costs).

**Exposure caveat on this very entry, flagged before any commit.**
`PITFALL-WATCHLIST.md` is itself a tracked file published on `origin/main`. This
addendum names the six files but deliberately does **not** restate the figures
themselves. Committing it would still publish an index pointing a reader directly
at the exposure. That trade-off is Yehor's call and is not made by this append —
the entry is written to the mount only and remains uncommitted.

Recorded by Claude (Node 1), Session 4.12-M, 2026-08-08. No pre-existing
pricing-exposure row existed in this register before this entry; nothing above was
edited, and the six flagged files were not touched in this task.

### 2026-08-14 — Row 7 (EU Cyber Resilience Act) — seeded, from relayed fork-decision research; dates unverified

**Provenance, stated plainly.** This row was not independently researched by this
executor session. It is relayed from one of four independent fork-decision research
passes (labelled F4, "FixProve evidence review") run in a separate guide chat and
pasted into this session as part of a broader synthesis (`SYNTHESIS-4-14-FORK.md`,
archived under `MEMORY/research/4-14-FORK/`). This executor session has not fetched
the CRA text or the European Commission's own guidance directly — nothing here
should be read as independently VERIFIED in this session's own sense of that word.

**The claim, including its own internal red flag.** The relayed synthesis states the
EU Cyber Resilience Act entered into force 2024-12-10, with reporting obligations
beginning — the source text itself gives two different dates in the same sentence,
first "2026-09-01," immediately followed by "sorry, correction, verified date is
2026-09-11" — and main obligations from 2027-12-11. A source that self-corrects its
own date mid-sentence is a source that has not been independently checked here; both
dates are recorded so neither is silently dropped, and the discrepancy itself is the
reason this row is flagged "dates unverified" rather than taken as settled.

**Why it's tracked at all despite being unverified.** Commission guidance reportedly
says non-monetized FOSS outside commercial activity is generally out of scope — but
FixProve's commercial intent, open-core structure, and active Danish sole-proprietorship
status mean that exemption is not automatic and needs a real determination, not an
assumption either way. This belongs inside the existing Row 4 legal-review gate, not
decided ad hoc here.

**Status: OPEN, non-urgent, flagged only.** No action taken or recommended today. The
trigger is Row 4's own conclusion, or the actual (still-unconfirmed) main-obligations
date, whichever comes first. A future session should independently verify the CRA's
actual in-force and obligation dates against the regulation's Official Journal text or
the Commission's own CRA guidance page before this row's dates are relied on for
anything time-sensitive.

Recorded by Claude (Node 1), Session 4.14, 2026-08-14. Four fork-decision research
documents (F1–F4) referenced in the source synthesis have not yet been archived in
this session — they arrived truncated (each cut off mid-sentence, pasted-content
artifact) and were not written to disk rather than saved as partial/corrupted copies.
`SYNTHESIS-4-14-FORK.md` itself was archived in full; F1–F4 archival is pending
re-submission of their complete text.

### 2026-08-14 (same session, later) — Row 7 date independently VERIFIED via live search

**This closes the "dates unverified" flag above for the reporting-obligations date
specifically** — not by trusting the relayed source's self-correction, but by an
independent live `WebSearch` this session, cross-referencing multiple independent
compliance-tracking sources (Element, HeroDevs, Star Global, cyberresilienceact.eu,
Zealience), none of which is the original relayed source. All agree: **CRA Article 14
reporting obligations (exploited-vulnerability and severe-incident reporting to ENISA
and the national CSIRT) apply from 11 September 2026** — confirming "2026-09-11," not
"2026-09-01," as the correct date. The 09-01 figure appears to have been a same-sentence
typo in the relayed source, now resolved rather than carried forward unverified.

Also confirmed: reporting is tiered (24h early warning / 72h fuller notification / 14-day
final report), and the September 2026 requirement applies to products already on the
market, not only new releases — relevant if Row 4's eventual review reaches a
CRA-in-scope conclusion for FixProve.

**Still not independently verified:** the entry-into-force date (2024-12-10) and the
main-obligations date (2027-12-11) — both are carried forward from the relayed source
only and were outside the scope of this specific search. FixProve's own CRA
classification (commercial-FOSS vs. exempt) remains entirely undetermined — this
addendum verifies a date, not FixProve's status, per this row's own standing instruction
not to assert that.

Sources: [Element](https://www.element.com/resources/articles/cyber-resilience-act-article-14-reporting-obligations-guide),
[HeroDevs](https://www.herodevs.com/blog-posts/cra-reporting-obligations-start-september-2026-what-eol-dependencies-mean-for-your-compliance),
[Star Global](https://star.global/posts/cyber-resilience-act-article-14-reporting-requirements/),
[cyberresilienceact.eu](https://www.cyberresilienceact.eu/reporting.html),
[Zealience](https://zealience.com/resource-hub/cyber-resilience-act-article-14-reporting/).

Recorded by Claude (Node 1), Session 4.14, 2026-08-14 (session-close verification pass).

### 2026-08-19 (Session 4.16) — Row 4 — two of five outreach recipients replied; both now priced or scoped

**Two lawyer replies received**, independently verified via live `search_threads`
(not from any relayed brief): **NJORD** (Nis Peter Dall, Partner, Advokat (L),
npd@njordlaw.com, 2026-08-17 14:00 UTC) — willing to review Privacy Policy + ToS;
declines both no-cure-no-pay and deferred-to-first-revenue ("for usikkert for os");
offers a free initial scoping meeting, in person or online, then an estimate.
**Otello** (Anders Skov, Partner, Advokat (L), as@otello.dk, 2026-08-18 13:47 UTC) —
willing, ordinary time-based terms only; quoted a four-figure DKK estimate
(exact figure redacted 2026-08-20 — a third party's confidential fee quote; held
mount-only under the gitignored MEMORY/ tree) for document review +
question-list response.

**Yehor replied to both, sent himself** (verified via live `search_threads`,
2026-08-19): to NJORD, accepting the meeting — in person, at their Sydhavnen,
Aarhus office, not online — to scope the task; to Otello, acknowledging the quote
and asking whether it holds for 2–3 months given the demand-first sequencing
(see `critical-actions.md`, D4 discussion, same date). Otello replied again
same day (2026-08-19 16:02 UTC): estimate holds, unless the task itself changes.

**Row 4 status: two of five channels are now priced/scoped options, not unknowns.**
Naur, Patrade, and the second NJORD addressee remain silent (3/5). Row 4 remains
OPEN — outreach and pricing are not a review. The gate still closes only on an
actual professionally-accountable sign-off. Engagement with either firm proceeding
to paid work remains gated on the D3 demand-test threshold firing, per the
demand-first sequencing under discussion this session (recorded separately in
`critical-actions.md`, not yet formally adopted as of this entry).

Recorded by Claude (Node 1), Session 4.16, 2026-08-19.

### 2026-08-19 (same session, later) — Row 4 — D4 adopted: CLI-first demand track decouples the App flip from D3

**Yehor adopted D4** (demand-first sequencing) with a specific resolution to
a structural conflict this session identified: the GitHub App flip requires
Gate-1 (legal review, this row) per the unchanged hard boundary, while D3's
demand test needs installs — naively circular. Resolved by using the
already-public, MIT-licensed CLI (`fixprove`, live at `0.1.10` on PyPI/npm)
as the demand-signal vehicle instead of the App. CLI installs, pilot
conversations, and pricing questions now count toward D3's threshold,
independent of Row 4's status.

**Row 4 itself is unchanged and remains OPEN.** Gate-1 still requires a
professionally-accountable reviewer's written answer before the App flip.
What's new: the pending NJORD scoping meeting will be used to ask for a
**minimal-scope, free-install-only opinion** (not the full paid review) as
the fastest legitimate path to clearing Gate-1 for the flip specifically —
the full review (pricing/payment/consumer-law scope) remains gated behind
D3's demand trigger, per D4. The second firm's quoted estimate (figure redacted,
see above) remains the priced fallback for that full review. No payment authorized by this entry;
Yehor's words: "No money without my separate word."

Recorded by Claude (Node 1), Session 4.16, 2026-08-19.

### 2026-08-19 (Session 4.16, later) — Row 4 continuation — organic GTM push drafted, not sent
AarhusJS speaking-slot outreach and Tier-1 direct outreach (Cernel, WasteHero) drafted and delivered
to mount, hash-verified. Capturi held — Puzzel acquisition (Oct 2024) puts its independent-CI status
in question; do not send until confirmed. WasteHero contact emails found via third-party aggregator
were explicitly NOT used — flagged UNCERTAIN, LinkedIn name-finding recommended instead. Nothing sent;
Yehor sends these himself per standing CA discipline (message content, not a registered critical
action).

### 2026-08-19 (Session 4.16, close) — process incident: mistaken commit of this file, caught and reverted before push

At session close, this file's backlog since the 4.13 commit (2026-08-11) was staged
and committed (`33d2d79`, later amended to `7a91fda`) without first re-reading its own
prior addenda. This directly violated the 2026-08-08 pricing-exposure entry's explicit
instruction above: *"the entry is written to the mount only and remains uncommitted"*
pending Yehor's own call on whether naming the six flagged files is safe to publish,
even without the dollar figures. That call was never made — this commit would have
published the index anyway.

**Caught before push** (only Yehor's machine pushes, per standing convention — nothing
went live) via this same close-out's own verification pass. Fixed by `git reset --soft
HEAD~1` then `git reset PITFALL-WATCHLIST.md`, confirmed back to `5a44fda` (matching
`origin/main` exactly) with this file unstaged, modified-on-disk only. Content verified
intact (565 lines, byte-identical to pre-commit) — nothing lost, only the premature
commit undone.

**Standing instruction restated, unchanged:** the pricing-exposure commit-vs-exposure
call is still Yehor's alone, still open, now a seventh session running (4.12-M through
4.16). Before any future bulk commit of this file, re-read every addendum for an
explicit hold instruction first — do not assume "modified" means "safe to commit."

Recorded by Claude (Node 1), Session 4.16, 2026-08-19.


### 2026-08-20 (Session 4.17) — pricing-exposure question CLOSED by Yehor: Option 2 (redact + commit). Two defects found in the premise while executing.

**Yehor's call, 2026-08-20:** redact, then commit. The question had been open
since 2026-08-08 (Session 4.12-M) and was carried unresolved through eight
sessions. Closed same-session on the call.

**What was redacted from the 2026-08-08 entry above:** the six literal filenames,
and the two literal tier figures that formed the grep pattern. Each filename is
replaced by a generic descriptor — sufficient for internal navigation, and
insufficient to point an external reader of git history at the exposure. Nothing
was deleted: the full unredacted pre-redaction copy of this file is preserved
mount-only at
`MEMORY/redaction-originals/PITFALL-WATCHLIST.unredacted-pre-4.17-2026-08-20.md`
(SHA-256 `c3043c7c1b48717748e1a6b841258388bb05c567630c9e139ee3ee2488245eaf`,
589 lines), under the gitignored `MEMORY/` tree.

**Append-only convention — deviation declared, not glossed.** This register is
append-only by standing convention. Redaction is the one operation that cannot be
performed by appending: removing signposting requires removing text. The
deviation is therefore explicit, bounded to the two blocks named above,
authorised by Yehor's 2026-08-20 call, and made non-destructive by the preserved
mount-only original. No other line of this file was altered.

**DEFECT 1, found while executing — the count is no longer six. It is TEN.**
The 2026-08-08 figure was accurate on 2026-08-08 and is now stale. A fresh re-run
of the same method against `origin/main` on 2026-08-20 returns ten tracked files
carrying the tier pair, not six. The four additions, described rather than named:
a Session-4.13 public-presence audit report, the session log for Session 4.12-M,
the session log for Session 4.13, and the session-log index. Three of those four
are the very session records that documented the exposure — **the act of
recording the problem in tracked files enlarged it.** The exposure grew by
roughly two-thirds during the eight sessions the remediation decision sat open.
That is the concrete cost of the deferral, recorded here rather than softened.

**DEFECT 2, found while executing — the entry restated the figures it claimed not
to restate.** The 2026-08-08 entry's own exposure caveat asserted that it
"deliberately does **not** restate the figures themselves." That was false: its
method paragraph carried both literal tier figures inline, as the grep pattern.
Committing the entry as written would have published the exact tier pair, not
merely an index pointing at it — strictly worse than the outcome the caveat was
weighing. Both figures are redacted above.

**What this redaction does and does not achieve, stated plainly.** It removes the
signpost. It does **not** remediate the underlying exposure: ten files carrying
the tier pair remain public on `origin/main`, unchanged by this entry, and git
history would retain the figures even if all ten were edited today. Whether to
remediate that underlying exposure — and whether ten public files quoting an
unlaunched product's tier pair matters commercially at all — is a separate
question this entry does not answer and does not claim to have closed.

**Not pushed.** Committed locally only. `git push` remains Yehor's machine and
his per-instance go-ahead, unchanged.

Recorded by Claude (Node 1), Session 4.17, 2026-08-20.

### 2026-08-20 (Session 4.17, same task) — SECOND redaction, found by the pre-staging exposure grep, outside the scope Yehor decided

The standing pre-staging exposure grep — run on the redacted candidate before
anything was staged — did **not** come back clean. It caught a second, unrelated
exposure that no prior session had flagged and that Yehor's redaction call did not
cover: two Session-4.16 addenda above quoted **a named external law firm's
confidential fee estimate**, verbatim and attributed, in a file tracked on a public
repository. Those addenda are uncommitted; `git show origin/main:PITFALL-WATCHLIST.md`
confirms the figure is not yet public. This commit would have been its first
publication.

Assessment, stated plainly: this is a worse exposure than the one that took eight
sessions to decide. The FixProve tier pair is the project's own unlaunched pricing.
A law firm's quoted fee is a third party's commercial information, given to Yehor
in confidence during a live negotiation with that same firm, and published here
under the partner's name and email. It was redacted on the same principle and by
the same method — figure replaced by a non-specific description, exact figure
preserved mount-only under the gitignored MEMORY/ tree. Both firms' names, roles
and public office email addresses were left intact; only the fee figure was
removed.

This was not authorised in advance and is flagged for Yehor's review before any
push. If he judges the redaction unnecessary it reverses in one edit, and the
unredacted text is preserved. The reverse mistake would not have been reversible.

Standing lesson, added to this register's own operating rules: the pre-staging
exposure grep earns its keep on the hits nobody was looking for. Run it against
the whole file every time — not only the section being edited.

Recorded by Claude (Node 1), Session 4.17, 2026-08-20.

### 2026-08-21 (Session 4.18) — Row 4 — NJORD meeting CONFIRMED by primary evidence; Row 4 itself stays OPEN

Yehor supplied a screenshot of the Gmail thread "SV: Att: Nis Peter Dall —
Forespørgsel om vurdering af Privatlivspolitik/Vilkår" and asked that the
meeting be recorded as confirmed. Rather than record it on the strength of the
screenshot's description, the underlying thread was fetched and read directly
this session (`get_thread`, thread `1a01a8267835adfc`). The screenshot's claims
check out against that primary source, item for item:

- `npd@njordlaw.com`, 2026-08-20 11:57:15 UTC (13:57 CEST): "Jeg har reserveret
  et mødelokale på onsdag d. 26. kl. 1600-1700."
- Yehor, from `yehor.callmedai@gmail.com`, SENT 2026-08-20 13:57:37 UTC (15:57
  CEST): "Onsdag den 26. august kl. 16.00-17.00 passer fint, og jeg møder gerne
  fysisk op hos jer."
- Attachment `FixProve-NJORD-scoping-brief.pdf` present on that sent message,
  confirmed by filename in the message's own attachment list.

**Status recorded: the meeting is CONFIRMED** — Wednesday 26 August 2026,
16:00–17:00, in person at NJORD, Aarhus. A written acceptance sent by Yehor in
his own words to the booking party is stronger evidence than any calendar
artefact, and it is now on record from the source rather than from a report.

**Row 4's table Status is unchanged and stays OPEN.** This is stated explicitly
because the two are easy to conflate: a scheduled scoping meeting is not a
professionally-accountable review. Row 4 closes when NJORD's written Phase-1
answer lands, not before, and the hard boundary is untouched — no GitHub App
public flip without Gate-1 clearing **and** Yehor's separate explicit "go."

**One narrower item is NOT closed by this, and is separated out rather than
folded in.** The flag raised earlier in Session 4.18 was that no NJORD entry
appears on the only calendar reachable from this session
(`egorka30001@gmail.com`; 26 August holds only unrelated events). The email
evidence proves the meeting is agreed. It does not prove a calendar reminder
exists anywhere. NJORD did send an `invite.ics` (separate thread
`1a01f0a429cc13b3`, "Møde mellem Fixprove og NJORD", 2026-08-20 11:59:15 UTC,
cc `malped@njordlaw.com`), addressed to `yehor.callmedai@gmail.com`, whose
calendar is not connected to this session. Whether that invite was accepted is
**still unverifiable from here** and remains Yehor's to confirm. Recording the
status question as closed while leaving the reminder question open is the
accurate split; collapsing them would overclaim.

Unrelated and also left open: a calendar entry titled "Freja work 27.08" is
recorded as 26 Aug 08:00 → 27 Aug 09:00, a 25-hour block that nominally spans
the NJORD slot. It reads as a date-entry slip for a 27 August event. Flagged
for Yehor, no action taken.

Recorded by Claude (Node 1), Session 4.18, 2026-08-21.

### 2026-08-28 (Session 4.22) — Row 4 — NJORD scoping meeting held; verbal estimate received (figure redacted, see `MEMORY/critical-actions.md`); phased-quote strategy set; "customer" copy occurrences listed; CRA follow-up independently verified SENT

**Meeting outcome, Yehor-reported (not independently verifiable beyond the
meeting's confirmed occurrence, itself already established by the
2026-08-21 addendum above).** NJORD gave a verbal estimate for the
full-scope review. Per this file's own 2026-08-19/2026-08-20 precedent for a
firm's confidential fee figure, the exact number is **not recorded in this
public file** — held mount-only in `MEMORY/critical-actions.md`, same
treatment as Otello's earlier quote. Described only as: a verbal
full-package estimate, described by Yehor as substantially above the
previously-quoted comparison figure. Nothing was committed in the meeting.

**Strategy set, not yet executed (Yehor's decision, relayed):** once NJORD's
written notes arrive, request a phased quote — Phase 1 scoped to the minimum
legally required to open the GitHub App for free third-party installs,
declining the full package. **NJORD's written notes have not arrived as of
2026-08-28** — independently checked this session (`search_threads
from:njordlaw.com after:2026/08/26`, zero hits), two days post-meeting, not
yet treated as overdue.

**"Business user" vs. "customer" framing — a free substantive takeaway from
the meeting, per Yehor.** Prompted a listing-only grep this session (nothing
changed): "customer" appears **6 times** across the publicly-tracked legal/
site copy — `web/legal/terms-public.md` (4 occurrences, including its own
defining clause, "a binding agreement between you (\"Customer\") and...");
`web/legal/OPEN-QUESTIONS-LOG.md` (2 occurrences, already flagged internally
as counsel-review items near T4). Zero occurrences in `web/src` or
`README.md`. Whether to reword any of this toward "business user" is a
future decision for Row 4's eventual review, not decided or actioned here.

**Separate CRA-scoping email, independently verified SENT** 2026-08-26T16:40:58Z
to `npd@njordlaw.com` (thread `1a03eea261e68ac5`, fetched directly via
`get_thread`, not taken on the relay's word): asks whether NJORD covers CRA/
product-regulation advisory work, and whether the Article 14 reporting
question (obligations from 2026-09-11, Row 7 above) can be scoped as a small
separate task alongside Phase 1; a briefing packet is attached. This serves
both FixProve (this row and Row 7) and the separate Patchward product under
the same CVR 46646223 — cross-referenced, not duplicated.

**Row 4 status: unchanged, OPEN.** A verbal estimate and a strategy intent
are not a written, professionally-accountable answer. The Day-60 ("first
real dollar," 2026-08-29) target, recomputed fresh this session, falls due
tomorrow with Row 4 still open — the gate will not be met by its own date on
current facts. Recorded plainly, not softened; see the matching entry in
`MEMORY/critical-actions.md` for full detail.

Recorded by Claude (Node 1), Session 4.22, 2026-08-28.

### 2026-08-28 (Session 4.22, same session, later) — Row 4 — "customer" → "business user" reclassified: a legal-text amendment, not a copy edit; deferred into NJORD Phase 1 scope

**Classification, prompted by a reviewer's observation this session, checked
against the grep result already on record above.** Of the 6 "customer"
occurrences found, 4 sit in `web/legal/terms-public.md` — including that
document's own defining clause ("a binding agreement between you
(\"Customer\") and..."). A defined term inside a live, published legal
document is not copy in the ordinary sense; changing it changes what the
document says the counterparty's legal role is. This is **deferred into the
NJORD Phase 1 review scope**, not treated as a standalone task someone could
"quickly fix" outside that review. The 2 `OPEN-QUESTIONS-LOG.md` occurrences
are internal tracking notes, not public-facing text, and follow automatically
whenever (and if) the public term changes.

**No text has been changed.** This is a classification decision only — where
the eventual change belongs, not what it should say or when.

Recorded by Claude (Node 1), Session 4.22, 2026-08-28.

### 2026-08-31 (Session 4.23) — Row 4 / Row 7 — NJORD's written estimates received; Yehor's reply sent (phased FixProve terms + split CRA request); one draft defect caught and corrected

**Row 4.** NJORD's promised written meeting notes arrived (2026-08-31,
morning), with three written estimates (figures redacted here per this
file's own 2026-08-19/2026-08-20/2026-08-28 precedent for third-party fee
figures — full figures in `MEMORY/critical-actions.md`, mount-only): a
full-scope FixProve terms + privacy engagement, a company-formation/
conversion option (new ApS recommended over converting the existing
enkeltmandsvirksomhed), and a scoped Patchward CRA Art. 14 assessment
(Row 7). NJORD's notes also confirmed in writing their business-users-only
recommendation, already folded into the Phase 1 ask below, and contained
one factual drift (describing FixProve as having a web-based version — it
does not) corrected in Yehor's reply.

Yehor sent his own reply the same day (independently verified via
`get_thread` against the actual sent message, not taken from any relayed
account): requesting a narrower **Phase 1** scope for FixProve terms/
privacy (legal minimum to open the GitHub App to free installs; full
consumer-law scope deferred to an actual paid launch); parking the ApS
question pending real demand; and — for the CRA item — asking NJORD to
split the work into an applicability-only opinion first, procedure outline
only if applicable, rather than approving the full quoted figure outright.

**A defect caught in this session's own drafting process, worth recording
here since it is a process lesson, not just a private-register note:** an
earlier draft of the reply (prepared, not sent, by the assistant) had
worded the CRA paragraph as an outright approval of the quoted figure —
a money-commitment decision the assistant should present as a choice, not
pre-write as a "yes." Yehor's own actual sent reply used the split-request
framing instead. Corrected; the lesson is recorded in
`MEMORY/critical-actions.md` in full.

**Row 4 status: unchanged, OPEN.** A sent reply requesting narrower scope
is not itself a written, professionally-accountable legal answer. Row 7
status: unchanged, OPEN — the Art. 14 applicability question is now
explicitly with NJORD, response pending, main-obligations date
2026-09-11 unchanged.

Recorded by Claude (Node 1), Session 4.23, 2026-08-31.

### 2026-08-31 (Session 4.23, later) — Row 4 — free-clinic backstop channel (ivsr.dk) actively engaged: case opened, signed documents returned same day

Independently verified via fresh Gmail search (public-safe detail, no fee
figures involved): `ivsr.dk` opened case **K145X8** on 2026-08-29,
requesting a signed disclaimer + privacy policy be returned within 14 days
(deadline 2026-09-12) or the case would be closed. Signed documents were
returned the same day, 2026-08-29, well inside the window — the case is
not at risk of closing for non-response. Their own stated average
processing time is 2-4 weeks. This is the backstop channel referenced in
the 2026-08-04 entry above (demoted to backstop, ~early October estimate)
— now formally in progress, running in parallel with the NJORD paid
channel. **Row 4 status: unchanged, OPEN** — an open case with a
processing-time estimate is not a written, professionally-accountable
answer yet.

Recorded by Claude (Node 1), Session 4.23, 2026-08-31.

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
| 4 | ToS / Privacy Policy / GDPR / liability terms unreviewed | Before public pricing | OPEN |
| 5 | Formal trademark clearance search not yet performed (web-search-level due diligence only; no TESS/TSDR or attorney clearance opinion) | Before trademark filing finalized, or before public launch | OPEN — pending professional review |
| 6 | Company NemKonto (state payment/refund account) not registered for CVR 46646223 | Before A3 live payment activation | OPEN — non-urgent, no incoming public payments yet |

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

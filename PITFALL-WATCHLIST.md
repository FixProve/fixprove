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

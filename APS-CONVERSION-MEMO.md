# ApS Conversion Memo — DRAFT

Written 2026-08-05, synthesizing what's already established across this session's legal
package. Not a recommendation to convert today — a decision memo for when Yehor is ready
to decide.

## The core fact

FixProve trades today as an enkeltmandsvirksomhed (Danish sole proprietorship). This
structure has no separate legal personality — Yehor Kaliberda is personally and
unlimitedly liable for the business's contractual obligations, tort claims, and
regulatory fines. A contractual liability cap in the Terms of Service only limits what a
*counterparty* can claim under that contract; it does nothing against a claim from a
non-counterparty, a regulatory fine, or any liability a court finds the cap doesn't
validly cover.

## What converting to an ApS (Anpartsselskab) actually does

Creates a separate legal entity. Business creditors' claims are generally satisfied out
of the company's assets, not Yehor's personal ones, subject to normal exceptions
(personal guarantees, fraud, certain tax/employer liabilities that can pierce through
regardless of entity form — a lawyer's confirmation, not this memo, is the source of
truth on exactly which liabilities survive incorporation).

## Cost and mechanics

- Minimum share capital: **DKK 20,000**, payable at stiftelse (incorporation) — corrected
  this session from both uploaded AI audits' stale DKK 40,000 figure; Erhvervsstyrelsen
  halved the requirement, effective 2025. Sources:
  [erhvervsstyrelsen.dk](https://erhvervsstyrelsen.dk/kapitalkravet-anpartsselskaber-er-halveret),
  [Hjulmand Kaptain](https://www.hjulmandkaptain.dk/viden/nyheder/kapitalkravet-for-anpartsselskaber-er-halveret-til-dkk-20000/).
  The capital stays the company's own money/working capital — it is not a fee paid away.
- Registration is done via Erhvervsstyrelsen/virk.dk; typical mechanics involve drafting
  vedtægter (articles of association) and a stiftelsesdokument.
  [COUNSEL-REVIEW / not independently re-verified this session: exact current process
  steps and any professional-fee estimate for drafting the incorporation documents —
  confirm with counsel or Erhvervsstyrelsen's own guidance rather than this memo before
  budgeting.]
- CVR number changes; existing contracts, the GitHub App identity, Stripe account, and
  published Terms would all need updating to name the new entity — a real migration, not
  a paperwork-only event.

## Recommended timing, per both source audits and this session's synthesis

Before the first paid B2B customer, not at a revenue threshold — the risk this addresses
is exposure per contract/claim, not cumulative revenue. Free beta carries materially
lower exposure (no payment relationship, no consumer-law trigger) and can reasonably
proceed under the current sole-proprietorship structure while this decision is made.

## What this memo does NOT do

It doesn't convert anything. It's the standing reference for when Yehor is ready to
decide, consistent with `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §3 and
`MEMORY/critical-actions.md`'s 2026-08-05 Stage 2 entry, which already names this
decision as a precondition for Stage 2 (first paid B2B customer), not Stage 1.

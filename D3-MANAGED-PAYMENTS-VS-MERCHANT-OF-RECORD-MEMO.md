# D-3 Decision Memo — Merchant of Record vs. Self-Merchant for B2C — DRAFT

Written 2026-08-05. This is a precondition decision for Stage 3 (B2C), not an
optimization — see `LEGAL-LAUNCH-READINESS-CHECKLIST.md`. Not yet decided; presented as
a memo for Yehor to decide, not a recommendation to silently adopt.

## The question

If FixProve ever sells to EU consumers directly, who is legally the seller — FixProve
itself, or a payment/commerce platform acting as Merchant of Record (MoR)?

## Option A — FixProve is the seller of record (status quo assumption in the drafts above)

- FixProve must register for the EU VAT One-Stop-Shop (OSS) scheme (or per-country VAT
  registration) once it sells digital services to consumers in other EU member states,
  and charge VAT at the consumer's local rate, not Denmark's.
- FixProve is the party a consumer disputes/chargebacks against.
- FixProve carries the direct consumer-law compliance burden (withdrawal mechanics,
  conformity, complaint handling) as principal, not agent.
- No extra platform fee beyond Stripe's standard payment-processing fee.

## Option B — a Merchant-of-Record platform (e.g. Stripe's Managed Payments product, if
applicable to FixProve's product type) is the seller of record

- The MoR platform charges, collects, and remits consumer VAT across the EU — FixProve
  does not need OSS registration for those sales.
- The MoR platform is typically the contracting party for the consumer purchase, taking
  on a share of the consumer-facing compliance and dispute burden.
- Materially higher fee than plain payment processing — **the exact percentage FixProve
  would pay has not been independently confirmed against Stripe's current published
  rates or Yehor's own account terms; do not quote a specific number externally until
  that's checked directly against Stripe's dashboard/contract.**
- FixProve's own Terms/Privacy Policy would need to describe this relationship (FixProve
  providing the software/service, the MoR handling the sale) accurately — a real
  structural difference from Option A, not just a payments detail.

## Recommendation shape, not a decision

Both source audits and this session's own analysis agree: if B2C ever opens, Option B
removes the single most operationally difficult item on the B2C risk list (pan-EU
consumer VAT as a solo founder) at the cost of a materially larger fee and a real
contractual restructuring. Option A is viable but meaningfully more operational burden.
This memo does not pick one — it exists so the choice is made deliberately, with the
actual current fee figures in hand, before Stage 3 is ever seriously discussed, not
decided implicitly by whichever integration happens to be easiest to wire up first.

## What this does NOT decide

Nothing here authorizes B2C sales, VAT registration of any kind, or a live payment
integration change. Stage 3 remains closed regardless of which option this memo
eventually resolves to.

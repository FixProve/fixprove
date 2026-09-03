# Checkout Withdrawal-Consent Copy — DRAFT, NOT LEGALLY REVIEWED

Exact UI text for the moment of payment, for consumer (B2C) checkout only — B2B checkout
does not need this section (businesses don't have a statutory withdrawal right). Written
2026-08-05. [COUNSEL-REVIEW: see `CONSUMER-TERMS-OF-SALE-DRAFT.md` §5 — whether a
checkbox extinguishes the withdrawal right outright, or only entitles FixProve to a
pro-rata charge if the consumer later withdraws anyway, is not settled. The copy below is
written to be honest and defensible under EITHER answer: it asks for consent and
records an acknowledgement, but does not itself assert to the customer that the right is
gone — that legal conclusion is left for the Terms, not the checkout button.]

## Checkout page copy

```
[Order summary]
FixProve — [tier name]                                   [price incl. VAT]
Billed monthly. Cancel anytime.

[ ] I want FixProve to start providing the service now, before the 14-day
    withdrawal period ends.

[ ] I understand that once the service has been provided as described in
    the Consumer Terms of Sale, my right to withdraw may be limited or
    lost, and if I withdraw before that point I may owe payment for the
    part of the service already used. Full details: [link to Consumer
    Terms of Sale §4–5].

                              [ Pay €X.XX/month ]
```

Both checkboxes must be checked before the pay button is enabled; neither is
pre-checked. [ENGINEERING: this is a UI/product requirement, not yet built — no
checkout flow exists today, per `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §4.]

## Durable-medium requirement

Checking both boxes is not on its own sufficient evidence under Danish/EU consumer law —
see `DURABLE-MEDIUM-CONFIRMATION-EMAIL-TEMPLATE.md`. The confirmation email, not the
checkout page's transient UI state, is the evidence artifact that actually matters if
this is ever disputed.

## What NOT to do

- Do not pre-check either box.
- Do not bundle this consent into a general "I agree to the Terms of Service" checkbox —
  Danish/EU practice (and the audits both flag this) wants the withdrawal-specific
  consent to be its own, separately visible action, not buried in a general agreement.
- Do not represent in any marketing copy that "the 14-day right doesn't apply" — see the
  open [COUNSEL-REVIEW] question above; that claim is not yet settled.

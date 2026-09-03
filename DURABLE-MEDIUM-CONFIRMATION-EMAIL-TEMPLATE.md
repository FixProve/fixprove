# Durable-Medium Confirmation Email Template — DRAFT, NOT LEGALLY REVIEWED

Sent immediately after a successful consumer checkout. This email — not the checkout
page's UI state — is the evidence artifact for the consent-and-acknowledgement mechanism
described in `CHECKOUT-WITHDRAWAL-CONSENT-COPY.md`. Written 2026-08-05.
[ENGINEERING: not yet built — no checkout flow exists today.]

## Subject
Your FixProve order — confirmation and your right of withdrawal

## Body

```
Hi [name/email],

Thanks for subscribing to FixProve [tier name].

ORDER DETAILS
Product: FixProve [tier name] subscription
Price: €X.XX / month, including VAT where applicable
Billing start: [date]
Seller: FixProve v/ Yehor Kaliberda, CVR 46646223, Stockholmsgade 3, 1. th,
        8200 Aarhus N, Denmark

YOUR RIGHT OF WITHDRAWAL
You have a 14-day right to withdraw from this purchase without giving a
reason (Danish Consumer Contracts Act; Directive 2011/83/EU). At checkout,
you told us to start the service immediately and acknowledged what that
means for this right — see [link to Consumer Terms of Sale §4-5] for the
full, current explanation of how that affects a withdrawal made now versus
later in the 14 days.

To withdraw: email yehor@yehor.ai, or use the attached model withdrawal
form. We will confirm receipt without delay.

QUESTIONS OR COMPLAINTS
See [link to complaint-handling info] for how to reach us and, if needed,
the relevant Danish authorities.

— FixProve
```

## Attachment
`EU-MODEL-WITHDRAWAL-FORM.md`, rendered as a simple fillable text/PDF form.

[COUNSEL-REVIEW: confirm this email, sent via the payment processor or FixProve's own
transactional mail, satisfies the "durable medium" requirement as drafted — the general
principle (a medium the consumer can store and reproduce unchanged) is well-established,
but the exact triggering timing relative to the checkout consent above is not yet
counsel-confirmed.]

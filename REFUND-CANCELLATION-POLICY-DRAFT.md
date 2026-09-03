# Refund & Cancellation Policy — DRAFT, NOT LEGALLY REVIEWED, NOT PUBLISHED

Written 2026-08-05. Needed both as a customer-facing page and because Stripe's own
account-activation flow asks for a refund-policy URL before enabling certain payment
methods. No pricing appears here, deliberately.

## Free tier
No payment, nothing to refund.

## Paid tier — cancelling

You can cancel your subscription at any time from [account settings / by emailing
yehor@yehor.ai]. Cancellation stops future billing; it does not retroactively refund
the current billing period unless you're within your 14-day consumer withdrawal window
(see `CONSUMER-TERMS-OF-SALE-DRAFT.md` §4–5 — business/B2B customers do not have this
statutory right, and this policy does not extend it to them as a matter of grace unless
Yehor decides otherwise).

## Paid tier — refunds outside the withdrawal window

[COUNSEL-REVIEW / BUSINESS DECISION, not yet made: does FixProve offer any discretionary
refund beyond the statutory consumer withdrawal window (e.g. "pro-rated refund if you
cancel mid-cycle due to a service defect") or is the policy strictly "no refunds outside
the 14-day consumer window, cancel anytime to stop future billing"? Both are legitimate
commercial choices; this draft does not pick one. Recommend deciding this at the same
time the paid tier's actual terms are set, per `TERMS-OF-SERVICE-DRAFT-v2.md` §7.]

## Billing errors

If you believe you were charged incorrectly (duplicate charge, wrong amount), email
yehor@yehor.ai with your receipt; we will investigate and correct genuine errors.

## How refunds are issued

To the original payment method, via Stripe, normally within [X] business days of
approval. [ENGINEERING: exact timeframe depends on Stripe's own refund processing —
confirm before publishing a specific number.]

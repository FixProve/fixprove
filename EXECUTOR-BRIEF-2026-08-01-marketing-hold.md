# FixProve — Executor Brief: Why We Hold Before Marketing
**Date:** 2026-08-01 · **Owner:** Yehor Kaliberda · **Prepared by:** Node 1 (Lead Technical Co-Pilot)
**Status of this document:** internal handoff. Not legal advice. Pricing figures deliberately omitted.

---

## 1. Bottom line (read this first)

We are **not** stalled and we are **not** out of ideas. We are deliberately
**holding all marketing, paid-traffic, pricing, and site-conversion work**
until one specific gate clears: an independent legal review of FixProve's
**Privacy Policy** and **Terms of Service**.

That review was submitted to a free Danish startup legal clinic
(Iværksætterretshjælpen) on **2026-07-29**. Their own site states a
**3–4 week** turnaround, so a reply is realistically expected **late August**.
Until then, the correct move is to wait — not to fill the time with work that
can't pay off yet or that creates risk.

---

## 2. The single gate right now

**Gate = Row 4: professional review of Privacy Policy + Terms of Service.**

Two things are switched **off on purpose** and stay off until Yehor gives an
explicit go-ahead *after* that review completes:

- **Public pricing** anywhere (site, repo, marketing).
- **Live payments / Stripe** (the "Buy / Subscribe" path).

Both are a standing, written boundary. Their existence is why marketing can't
convert yet — see the next section.

---

## 3. Why marketing and site polish are on hold — a plain example

Think of a lemonade stand in a town that requires a health permit before you
can sell to the public.

- The **product** works — the lemonade is made. ✅
- The **stand** looks good — sign, location, install commands, live site. ✅
- The **permit** — reviewed Privacy Policy + Terms — is **not done yet.** It's
  with the reviewer, out of our hands, ~3–4 weeks.

Building a bigger sign or a prettier stand **before** the permit doesn't help,
because the stand still can't legally open for paid business. Two concrete
downsides to marketing *now*:

1. **Wasted first impression.** If a marketing push sends 50 visitors to the
   site today, none of them can actually subscribe (pricing + payments are
   deliberately off). Most first-time visitors who hit a "not yet" state do
   not come back later. We'd be spending our best introduction on people who
   can't convert.
2. **Real risk, not hypothetical.** Charging money or collecting customer data
   before the Privacy Policy and Terms have been reviewed is exactly the
   exposure the review exists to remove. Doing it early means operating without
   the paperwork that protects us if a dispute or complaint arises.

So the honest sequence is: **legal review clears → pricing + payments go live
→ marketing makes sense** (now the traffic we attract can actually become
paying customers).

> Note: this is a risk-and-readiness judgement, not formal legal advice. The
> point of the external review is precisely to get a qualified opinion.

---

## 4. What this hold is NOT

- **Not indefinite.** It's a ~3–4 week wait that started 2026-07-29.
- **Not idleness.** It's sequencing: doing the right thing before the
  dependent thing.
- **Not a product problem.** The technical surface (live site, working
  install, published package, clean repo) is already in place.

---

## 5. Priority order (do them strictly in this order)

1. **Clear the gate (Row 4).** Nothing outranks this. Action right now = wait
   for the clinic's reply; do **not** chase them before ~20 August.
2. **Everything else is capped and secondary.** Small, time-boxed items only;
   never let them displace or pre-empt the gate.

---

## 6. Step-by-step: executor instructions during the wait

**DO NOT (until Yehor says the review has cleared and explicitly lifts the hold):**

1. Do **not** run any marketing, ads, launch posts, or outreach campaigns.
2. Do **not** publish pricing anywhere — site, repo, social, or collateral.
3. Do **not** touch the payment / Stripe surface, even in test mode.
4. Do **not** change the site's conversion path (no "Subscribe/Buy" flows, no
   checkout, no signup that collects personal data).
5. Do **not** email or message the legal clinic to chase before ~20 August.
   Passively checking for their reply is fine; nudging is not.

**SAFE, GENUINELY USEFUL WORK during the wait (all internal, unpublished, no
pricing, no personal-data collection):**

6. Draft — but do **not** publish — launch content: announcement copy, a demo
   walkthrough / GIF, README and docs improvements that explain *what the
   product does* (no pricing).
7. Improve non-pricing product clarity: onboarding docs, error messages,
   examples. Anything a visitor reads that isn't a price or a checkout.
8. Prepare a launch checklist so that the day the hold lifts, publishing
   pricing + enabling payments + starting marketing can happen fast and in the
   right order.
9. Keep drafts on a branch or locally — do **not** merge marketing/pricing
   drafts into the public `main` branch.

**WHEN THE REVIEW CLEARS (Yehor confirms in writing):**

10. Yehor lifts the hold explicitly. Only then, in order: (a) finalize Privacy
    Policy + Terms per the reviewer's feedback, (b) publish pricing, (c) enable
    live payments, (d) start marketing to a site that can now convert.

---

## 7. Timeline

- **2026-07-29** — Privacy Policy + Terms sent for review.
- **~late August 2026** — reply expected (3–4 week window).
- **After the reply + Yehor's explicit go-ahead** — pricing, payments, and
  marketing unlock, in the order above.

---

## 8. Verification (how this brief was checked)

- Review request confirmed **sent** 2026-07-29, recipient verified; **no reply
  received as of 2026-08-01** (checked directly, not assumed).
- The pricing/payments hold is a standing written boundary in the project's
  operating record; it lifts only on Yehor's explicit word after review.
- Legal characterisation above is a readiness/risk judgement, not formal legal
  advice — the external review is what produces the qualified opinion.

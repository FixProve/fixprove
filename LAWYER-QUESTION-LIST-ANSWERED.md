# LAWYER-QUESTION-LIST — Synthesized Answers, v1

**Not legal advice.** Synthesized 2026-08-05 from two independently-produced AI red-team
audits (cross-checked against each other and, where possible, against the source-code
Verification Appendix in the original `PRIVACY-POLICY-DRAFT.pdf`), for the accountable
Danish reviewer's use as a starting point — not as a substitute for their judgment. See
`LEGAL-LAUNCH-READINESS-CHECKLIST.md` §0 for why the two source audits are weighted
differently where they disagree.

Format per question: **Working answer** (what both audits converge on, or the more
conservative one where they diverge) · **Counsel sign-off** (YES = a judgment call that
needs an actual lawyer; NO = fact-driven, both audits agree, low residual risk) ·
**Note** (disagreements, corrections, or caveats).

## A. Blocking questions

**Q1 — Processor or controller for the GitHub App?**
Working answer: processor for the installing business, once a business installs it;
Art 28 DPA required before that happens. Sign-off: **YES**. Note: both audits agree;
this is the single highest-leverage open question in the whole package.

**Q2 — Relayed code fragments, never retained?**
Working answer: still "processing" under Art 4(2) even though transient; in-transit
encryption + a contractual warranty from Customer about not routing special-category
data through the endpoint is the right shape. Sign-off: **NO** (fact-driven). Note: no
disagreement between audits.

**Q3 — Liability limitation that actually holds?**
Working answer: blanket exclusion (v1 draft) is void under Aftaleloven §36; replace with
a monetary cap tied to fees paid. Sign-off: **YES**. Note: audits differ on the exact
multiplier — this package uses 1× trailing-12-months fees (the more conservative
figure); confirm with counsel whether that's too low to be commercially workable or
exactly right to survive review.

**Q4 — Liability cap by customer type?**
Working answer: three tiers — free (near-total exclusion, gross-negligence/fraud
carved out), B2B (fee-based cap), B2C (mandatory rights never excluded). Sign-off:
**YES**. Note: both audits agree on structure.

**Q5 — Personal liability and entity form?**
Working answer: contractual terms cannot protect personal assets from tort/regulatory
exposure; ApS conversion is the actual answer, timed before first paid customer rather
than at a revenue threshold. Sign-off: **YES**. Note: **corrected figure** — current ApS
minimum capital is DKK 20,000, not the 40,000 both audits state (Erhvervsstyrelsen
halved it, effective 2025 — see `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §0 for sources).

**Q6 — Before the payment surface goes live?**
Working answer: ToS/PP finalized post-review, Art 28 DPA available, checkout
pre-contract disclosures + withdrawal mechanism built, VAT registration confirmed,
consider insurance. Sign-off: **YES**. Note: no disagreement on the list; disagreement
only on whether a checkbox alone extinguishes the withdrawal right (Metaplan overclaims
this — see Q6 note in the checklist).

## B. Blocking before publication

**Q7 — Cloudflare and international transfer?**
Working answer: Cloudflare's standard DPA likely incorporates SCCs, but **account-
specific execution is unverified** by either audit. Sign-off: **NO** for the legal
question of whether SCCs are an adequate mechanism in principle; **YES** implicitly
becomes irrelevant once the account is actually checked — this is a 10-minute
verification task, not a legal judgment call. Note: do the account check before the
reviewer meeting so counsel confirms a fact rather than chases one.

**Q8 — Hosting request logs disclosure?**
Working answer: yes, disclose even though we don't access them (Art 13(1)(e)). Sign-off:
**NO**. Note: both audits agree; already reflected in the v2 draft.

**Q9 — Cookie/ePrivacy position?**
Working answer: no client-side storage removes the consent requirement entirely.
Sign-off: **NO**. Note: both audits agree, and it's independently source-verified
(zero matches for tracker/storage APIs in the production build).

**Q10 — Controller identification format?**
Working answer: "FixProve v/ Yehor Kaliberda, CVR 46646223" plus a physical address.
Sign-off: **NO**. Note: physical address is the one open input — Yehor to supply.

**Q11 — DPO required?**
Working answer: no, Art 37 doesn't trigger at this scale. Sign-off: **NO**
(recommend a one-line internal memo recording the reasoning, in case it's ever asked).

**Q12 — Datatilsynet wording?**
Working answer: full contact block required in practice even if GDPR's letter is
minimal (Art 13(2)(d)). Sign-off: **NO**. Note: text already in v2 draft.

## C. Lawful basis and marketing

**Q13 — Basis for GitHub App data?**
Working answer: Art 6(1)(b) (performance of contract) primary. Sign-off: **NO**. Note:
document an LIA only if Art 6(1)(f) is also relied on, e.g. for abuse-prevention logging.

**Q14 — Waitlist and markedsføringsloven §10?**
Working answer: yes, a launch announcement is direct marketing; current consent wording
needs strengthening (explicit opt-in text + visible withdrawal mechanism). Sign-off:
**YES**. Note: the DKK 20,000 "fine starting at" figure in the Metaplan audit is
unsourced — don't repeat it externally without a real citation.

**Q15 — Timestamp disclosure?**
Working answer: yes, disclose explicitly (already done in both draft versions).
Sign-off: **NO**.

## D. Retention

**Q16 — Defensible retention periods?**
Working answer: a stated criterion (not a fixed period) is acceptable — "until launch
sent or list abandoned" for waitlist, "shortly after check run completes" plus a safety-
net TTL for correlation records. Sign-off: **NO** for the legal question; **engineering
action required** to actually implement the TTL (not yet done).

## E. Terms-of-service mechanics

**Q17 — MIT licence coexistence?**
Working answer: yes, if the hosted-terms scope is explicitly limited to hosted
infrastructure — done in v2 draft §2–3. Sign-off: **NO**.

**Q18 — Suspension right?**
Working answer: needs a notice-and-cure structure for anything short of active security
threat. Sign-off: **YES** (drafted in v2 §3; wording itself needs review).

**Q19 — Availability / implied SLA?**
Working answer: no strict implied uptime obligation for free tier; a paid tier likely
carries an implied "reasonable care and skill" standard even without an explicit SLA
number. Sign-off: **YES**.

**Q20 — Changing the terms?**
Working answer: passive acceptance is insufficient for material changes to a paying
relationship; active acceptance + 30 days' notice required. Sign-off: **YES**.

**Q21 — Governing law and venue?**
Working answer: Retten i Aarhus for B2B is fine; consumer venue rules override for
EU/EEA consumers (Brussels I Recast Art 18 / Rome I Art 6). Sign-off: **YES** (to
confirm the exact override wording).

## F. Drafting question

**Q22 — "No telemetry" as a representation?**
Working answer: yes, binding; keep it time-bound ("as of this version") and mirror the
same language in the README so the two documents don't contradict each other. Sign-off:
**NO**. Note: this is a drafting/product-honesty question, not a hard legal call, but
get it right regardless — both audits and the original source-verification appendix
agree the current README/Privacy-Policy pairing already has this exact gap.

---

**Tally:** 12 of 22 questions genuinely need a lawyer's judgment call (Q1, Q3, Q4, Q5,
Q6, Q14, Q18, Q19, Q20, Q21, plus Q7 and Q16's legal-adequacy sub-questions even though
their factual sub-parts don't). The rest are fact-driven and already answered
consistently across both source audits and the original code-verified draft — worth
telling the reviewer this up front so their billable time goes to the 12 that actually
need it.

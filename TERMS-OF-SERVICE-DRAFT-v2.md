# Terms of Service — DRAFT v2, NOT LEGALLY REVIEWED, NOT IN FORCE

This is a founder+AI synthesized draft, not a finished document and not legal advice.
It supersedes `TERMS-OF-SERVICE-DRAFT.pdf` (v1, sent to raadgivning@ivsr.dk 2026-08-01)
for internal drafting purposes only — v1 remains the version currently with the free
clinic; do not send v2 to any reviewer without Yehor's explicit decision on which version
is live with which channel (see `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §0). Every
[COUNSEL-REVIEW] marker is a question this draft still leaves open. Do not deploy to
fixprove.dev. No pricing appears anywhere in this document, deliberately.

Synthesized 2026-08-05, Session 4.12-K, from the v1 founder draft plus two AI red-team
audits, cross-checked against each other and against source code where the audits
touched factual (not legal-judgment) claims.

## 1. Who you are agreeing with

These Terms of Service ("Terms") are a binding agreement between you ("Customer") and
FixProve v/ Yehor Kaliberda, CVR 46646223, Stockholmsgade 3, 1. th, 8200 Aarhus N,
Denmark ("FixProve", "we", "us"). Contact: yehor@yehor.ai.

Because a sole proprietorship (enkeltmandsvirksomhed) is not a separate legal entity,
Yehor Kaliberda is personally a party to these Terms. If FixProve is later incorporated
as FixProve ApS, these Terms and all rights and obligations under them transfer to that
entity automatically from the date of incorporation, and this section will be updated
with the new CVR number at that time.

[COUNSEL-REVIEW: personal liability is the defining risk of trading as an
enkeltmandsvirksomhed. Confirm what these Terms can and cannot do to limit it. Current
working position (not yet counsel-confirmed): a contractual liability cap only limits
what a *counterparty* can claim under this contract — it does nothing against tort
claims from non-counterparties, regulatory fines, or claims exceeding what a court finds
enforceable under Aftaleloven §36. ApS conversion (current minimum capital: DKK 20,000,
reduced from 40,000 by Erhvervsstyrelsen effective 2025) is the mechanism that actually
moves the exposure off personal assets. Recommended timing and whether a cap clause is
still worth drafting even post-ApS-conversion: counsel's call.]

## 2. What these terms cover — and what they do not

These Terms cover the hosted parts of FixProve: the website at fixprove.dev, the
waitlist, the GitHub App, and the API at api.fixprove.dev.

They do **not** cover the FixProve source code, CLI, or analysis engine. Those are open
source under the MIT licence, and your rights to them come from that licence alone.
Nothing in these Terms — including §3's acceptable-use rules — narrows, conditions, or
restricts the MIT grant in any way. Acceptable-use restrictions in §3 apply only to your
use of the hosted API endpoints (api.fixprove.dev) and the GitHub App; they do not apply
to, and cannot be read to apply to, your local use of the CLI or engine binaries under
the MIT licence.

[COUNSEL-REVIEW: confirm this explicit carve-out language is sufficient to prevent any
reading of §3 as an additional restriction on the MIT-licensed code — the ambiguity both
audits independently flagged in v1.]

## 3. Using the hosted service

Use the hosted API and GitHub App lawfully and don't try to break them. Concretely: no
attempts to gain unauthorised access, no deliberate overloading of the API, no use of
the service to process material you have no right to process, and no automated scraping
of the site beyond ordinary use. This section governs hosted infrastructure only — see §2.

**Suspension.** We may suspend or limit access to the hosted API/GitHub App:
(a) immediately, without prior notice, if we reasonably believe there is an active
security threat, ongoing attack, or emergency originating from or affecting your
account; or (b) with at least 7 days' written notice and an opportunity to cure, for any
other breach of these Terms. Where we suspend under (a), we will explain why within
24 hours. You may appeal a suspension by writing to yehor@yehor.ai; we will respond
within 5 business days. Suspension does not affect your statutory rights.

[COUNSEL-REVIEW: is this tiered structure (immediate for security, notice+cure for
everything else) enforceable against a consumer as drafted, or does the appeal
mechanism need to be more formal?]

## 4. The open-source software is provided as is; the hosted service has a narrower promise

**MIT-licensed software (CLI, engine, everything distributed under the MIT licence):**
no warranty of any kind, as the licence states. FixProve analyses code and reports what
it cannot resolve; it is a verification aid, not a guarantee of correctness. A clean
FixProve result does not mean your code is correct, safe, or fit for any purpose. You
remain responsible for reviewing, testing, and deploying your own software.

**Paid hosted subscriptions (once they exist):** FixProve additionally warrants that the
hosted service will perform substantially in line with its documented behaviour. This
does not extend to warranting that verification will catch every defect — see the
paragraph above, which still applies in full. This paragraph does not create any
obligation for the free tier or for the MIT-licensed software.

[COUNSEL-REVIEW: this is the clause that matters most commercially. If a customer merges
broken code after a clean FixProve run and suffers a loss, what limitation actually holds
under Danish law, and does the answer change once money changes hands? Confirm the
"substantially in line with documented behaviour" language for paid tiers doesn't
inadvertently create a stronger warranty than intended.]

## 5. The hosted service — availability

We aim to keep the service available but do not promise any particular uptime for the
free tier, and we may change or discontinue parts of it. For paid subscriptions, we
target reasonable commercial availability but this section does not itself constitute an
SLA; any specific availability commitment for a paid tier will be stated separately when
that tier is defined, and forms part of these Terms only from that point.

[COUNSEL-REVIEW: confirm whether an implied availability obligation arises for a paid
tier even absent an explicit SLA, and whether the wording above is sufficient to avoid
that or whether an explicit numeric target is safer.]

## 6. Limitation of liability

This section applies differently depending on who you are — read the paragraph that
applies to you.

**6.1 Free users (no payment relationship with FixProve).** To the fullest extent
permitted by Danish law, FixProve is not liable for any loss arising from use of the
free hosted service or the MIT-licensed software, except for death, personal injury,
fraud, or gross negligence (grov uagtsomhed) or wilful misconduct (forsæt) on
FixProve's part, which are never excluded.

**6.2 Paying business (B2B) customers.** FixProve's total aggregate liability arising
out of or related to the hosted service, whether in contract, tort, or otherwise, is
limited to the total fees you paid FixProve in the 12 months before the claim arose.
FixProve is not liable for indirect, consequential, or special damages, or for loss of
profit, revenue, or business interruption. Nothing in this clause excludes liability for
death, personal injury, fraud, wilful misconduct, gross negligence, or any liability that
cannot lawfully be excluded or limited.

**6.3 Consumers (B2C).** Nothing in these Terms excludes or limits any statutory right
you have as a consumer under Danish or EU law, including rights relating to conformity
of digital services and the withdrawal right described in §7. Where this clause conflicts
with a mandatory consumer protection, the mandatory protection applies instead.

You remain responsible for reviewing, testing, and deploying your own software — a clean
FixProve result is not a guarantee, in every case described above.

[COUNSEL-REVIEW: state the actual defensible cap multiplier under Aftaleloven §36 case
law for a Danish sole-proprietorship SaaS tool (this draft uses 1× trailing-12-months
fees, following the more conservative of the two audits — confirm whether 1× is right,
too low, or too high for an enforceable, non-illusory remedy). Confirm the consumer
carve-out wording in 6.3 is sufficient rather than voiding the whole clause under EU
unfair-terms rules.]

## 7. Paid plans (not live yet)

A paid tier is planned and does not exist yet. When it does: its price, billing cycle,
refund policy, and cancellation terms will be published before purchase and will form
part of these Terms. Nothing in this document is an offer to sell anything today.

**Consumer withdrawal right (fortrydelsesret).** If you are a consumer purchasing a
digital service not supplied on a tangible medium, you have a 14-day statutory right of
withdrawal under the Danish Consumer Contracts Act (Forbrugeraftaleloven). If you want
the service to begin before that period ends, we will ask you to expressly consent to
immediate performance and to acknowledge, separately, that doing so means you lose the
withdrawal right once performance has begun. You will receive written (email)
confirmation of both your consent and that acknowledgement.

[COUNSEL-REVIEW: confirm the exact checkout-flow wording and sequencing needed for the
consent-and-acknowledgement mechanism to actually extinguish the withdrawal right under
Forbrugeraftaleloven §18, rather than merely stating that it does. This is a place where
the AI Metaplan audit overclaimed a checkbox as sufficient — treat as unresolved until
counsel confirms actual checkout copy.]

## 8. Ending it

You can stop using the service at any time, and remove the GitHub App from your
repositories yourself. We can end access if these Terms are materially breached, subject
to §3's notice-and-cure process where it applies. On account closure, GitHub App
correlation records are deleted per §5 of the Privacy Policy; any deletion request goes
to yehor@yehor.ai and will be actioned within 30 days.

## 9. Changes to these terms

**Non-material changes** (clarifications, typo fixes, changes that don't affect your
rights or obligations) take effect when posted here with a date.

**Material changes** — anything affecting price, liability, your rights, or the scope of
the service — will be communicated to you with at least 30 days' notice before taking
effect. For an active paying customer, we will ask for active acceptance (a click-through
or equivalent explicit action); if you don't accept, you may terminate without penalty
and receive a pro-rata refund of any prepaid, unused term. Continued passive use of a
free tier after a material change is not, on its own, treated as acceptance for paying
customers, but may be treated as acceptance for free-tier use where no consideration has
been exchanged.

[COUNSEL-REVIEW: confirm 30 days and the active-acceptance mechanism are sufficient, and
whether "continued use" can validly bind even free users to anything beyond the
non-material category.]

## 10. Governing law and venue

Danish law governs these Terms. For business (B2B) disputes, the parties agree to the
exclusive venue of Retten i Aarhus. If you are a consumer resident in the EU/EEA, this
venue clause does not affect your right under the Brussels I Recast Regulation to bring
proceedings before the competent courts of your own country of residence, and Rome I
determines which mandatory consumer-protection rules of your home country continue to
apply regardless of this governing-law clause.

[COUNSEL-REVIEW: confirm Retten i Aarhus as opposed to leaving B2B venue general, and
confirm the consumer-override wording correctly reflects Brussels I Recast Art 18 /
Rome I Art 6.]

## 11. Contact

yehor@yehor.ai — FixProve v/ Yehor Kaliberda, CVR 46646223, Stockholmsgade 3, 1. th,
8200 Aarhus N, Denmark.

---
*Change log: v2 (2026-08-05) — bifurcated liability cap by customer type; replaced
suspension clause with notice-and-cure structure; replaced passive-acceptance change
clause with active-acceptance-for-material-changes; added explicit MIT non-contamination
language in §2 and §3; added consumer venue override in §10; added physical-address
placeholder. v1 (2026-07-28) — original founder draft, sent to raadgivning@ivsr.dk
2026-08-01, unchanged and still the version with that reviewer.*

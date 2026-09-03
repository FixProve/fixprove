# OPEN-QUESTIONS-LOG.md — internal only, never link from the public site

Derived 2026-08-05 (Session 4.12-K) from `TERMS-OF-SERVICE-DRAFT-v2.md` and
`PRIVACY-POLICY-DRAFT-v2.md` as part of the public-edition derivation
(`web/legal/terms-public.md`, `web/legal/privacy-public.md`). Every open question that
was visible as a `[COUNSEL-REVIEW: ...]` bracket in the internal draft is logged here,
verbatim in substance, so removing the bracket from the public page does not mean the
question was dropped — it means it isn't exposed to a customer or regulator reading the
live page. **14 entries: 9 from the Terms of Service, 5 from the Privacy Policy** —
counted directly from the source files (`grep -n COUNSEL-REVIEW`), not assumed.

## From TERMS-OF-SERVICE-DRAFT-v2.md

| # | Source section | Open question |
|---|---|---|
| T1 | §1 Who you are agreeing with | What these Terms can and cannot do to limit Yehor's personal liability as a sole proprietor, and the right timing for ApS conversion relative to a liability-cap clause, is not yet counsel-confirmed. |
| T2 | §2 Scope / MIT coexistence | Whether the explicit MIT non-contamination carve-out is sufficient to prevent §3's acceptable-use rules from ever being read as restricting the MIT-licensed CLI/engine is not yet counsel-confirmed. |
| T3 | §3 Suspension | Whether the tiered suspension structure (immediate for security, 7-day notice+cure otherwise) is enforceable against a consumer as drafted, or needs a more formal appeal mechanism, is not yet counsel-confirmed. |
| T4 | §4 Warranty / disclaimer | The exact liability consequence if a customer merges broken code after a clean FixProve run, and whether the paid-tier "substantially in line with documented behaviour" language accidentally creates a stronger warranty than intended, is not yet counsel-confirmed. |
| T5 | §5 Availability | Whether an implied availability obligation arises for a paid tier even absent an explicit SLA, and whether the current wording is enough to avoid that, is not yet counsel-confirmed. |
| T6 | §6 Limitation of liability | The actual defensible liability-cap multiplier under Aftaleloven §36 case law (this draft uses 1× trailing-12-months fees, the more conservative of the two source audits) and whether the §6.3 consumer carve-out is sufficient rather than voiding the whole clause, is not yet counsel-confirmed. |
| T7 | §7 Withdrawal right | The exact checkout-flow wording/sequencing needed for the consent-and-acknowledgement mechanism to actually extinguish the statutory withdrawal right under Forbrugeraftaleloven §18 is not yet counsel-confirmed — not yet operative in practice since no paid tier exists. |
| T8 | §9 Changes to terms | Whether 30 days' notice plus active acceptance is sufficient for material changes, and how far "continued use" can validly bind even free-tier users, is not yet counsel-confirmed. |
| T9 | §10 Governing law/venue | Whether Retten i Aarhus as the named B2B venue, and the consumer-override wording, correctly reflect Brussels I Recast Art 18 / Rome I Art 6, is not yet counsel-confirmed. |

## From PRIVACY-POLICY-DRAFT-v2.md

| # | Source section | Open question |
|---|---|---|
| P1 | §1 Controller identity / DPO | That no Data Protection Officer is required at current scale is the working assumption of both source AI audits and this draft, not yet counsel-confirmed. |
| P2 | §2.4 GitHub App | **Highest-stakes open item in either document.** GDPR roles are assessed per processing activity, not globally. Working position, not yet Danish-counsel confirmed: for repository metadata, findings, and annotations processed solely on an installing organisation's documented instructions, the organisation is likely controller and FixProve likely processor for that specific processing; FixProve remains controller for its own administration/security/support/billing processing. Before any organisation-controlled personal data is processed on FixProve's systems — including during a free beta, since Article 28 is triggered by processing, not payment — a binding Article 28 DPA must be in place (see `ARTICLE-28-DPA-DRAFT.md`, itself unreviewed). Until that control exists, organisation-scale GitHub App installations are not ready, independent of the free-beta status of the rest of the product. |
| P3 | §3 Lawful basis | Whether Art 6(1)(b) alone is sufficient for the GitHub App correlation data, or a documented Legitimate Interests Assessment under Art 6(1)(f) is also needed as a fallback (e.g. for abuse-prevention logging), is not yet counsel-confirmed. |
| P4 | §4 Cloudflare transfers | Which Cloudflare DPA/SCC module applies once the account is actually checked, and whether a documented Transfer Impact Assessment is needed beyond SCC reliance, is not yet counsel-confirmed — the account-specific check itself is a pending action item, not a legal judgment call. |
| P5 | §5 Retention | Whether criterion-based retention (rather than a single fixed published period) adequately satisfies GDPR Art 13(2)(a)'s disclosure requirement is not yet counsel-confirmed. |

## Not logged here (already resolved, no bracket removed)

Questions the source drafts already answered with a fact-driven, non-judgment-call
conclusion (no cookies, no DPO trigger at this scale as a factual matter, Datatilsynet
contact wording, the ApS capital figure, the ODR-platform correction, etc.) are not
open questions and are not repeated in this log — see
`LAWYER-QUESTION-LIST-ANSWERED.md` for the full 22-question breakdown with sign-off
flags, and `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §0 for the source-reliability notes.

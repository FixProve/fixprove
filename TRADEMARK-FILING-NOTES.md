# USPTO TEAS Filing Notes — "FixProve"
**Prepared for:** Yehor Kaliberda
**Filing basis:** Section 1(b), Intent-to-Use (per Yehor's confirmation — FixProve is in Milestone 0 development, not yet in commercial use)
**Prepared:** 2026-07-01, Session 0.2

---

## 1. Goods/services description text — paste into TEAS

**IMPORTANT before you paste this:** this text is drafted from Claude's understanding of the
product (deterministic AST-level verification of AI-generated code, per
`FIXPROVE_MASTER_BUILD_PLAN.md` §1.1/§3) crossed against USPTO ID Manual conventions. It is
**not** attorney-reviewed. Wording in trademark applications is highly consequential (overly
broad language draws office actions; overly narrow language limits future enforcement) —
have a trademark attorney or agent review before you file, even under 1(b) where you have
latitude to refine before the Statement of Use.

### Class 009 — Downloadable computer software

```
Downloadable computer software for verifying and validating computer source code, namely,
software that analyzes source code and source code modifications to determine whether
imported modules, functions, methods, and application programming interface (API) calls
resolve against a user's installed software dependencies; downloadable computer software
for detecting erroneous, non-existent, or hallucinated code references in computer programs,
including computer programs generated in whole or in part using artificial intelligence.
```

### Class 042 — Software as a service (SaaS)

```
Software as a service (SAAS) services featuring software for verifying and validating
computer source code, namely, software that analyzes source code and source code
modifications in software repositories to determine whether imported modules, functions,
methods, and application programming interface (API) calls resolve against a user's
installed software dependencies; software as a service (SAAS) services featuring software
for detecting erroneous, non-existent, or hallucinated code references in computer programs,
including computer programs generated in whole or in part using artificial intelligence,
for use in continuous integration and software development pipelines.
```

**Assumption flagged (#KS-TRACE):** requirement = "produce exact goods/services text";
assumption = product function taken from the master build plan's one-sentence description
("deterministically verifying that every import, symbol, method, and API call resolves
against your real installed dependencies... zero LLM tokens"); test = None — this is legal
drafting, not code, so the "test" is Yehor/counsel sign-off before filing, not an automated
check.

---

## 2. Filing basis notes

- **Basis: 1(b) Intent-to-Use.** No specimen of use is required at filing. A Statement of
  Use (or extension request) will be required later, before registration, once FixProve is
  actually offered in commerce — track this against the master build plan (Milestone 3,
  first paying customer, is the natural trigger to file the SOU).
- Filing under 1(b) for both classes means **two Class fees** apply (Class 9 + Class 42) —
  confirm current USPTO fee schedule at filing time; fees change and this document is not a
  fee quote.

---

## 3. Due-diligence record — near-name search

This due diligence is a **general web search**, not a formal USPTO TESS/TSDR search or an
attorney clearance opinion. Treat it as a starting point, not a substitute for professional
clearance search before filing.

### "Fix Price" (retail, Class 35)
Confirmed via web search: Fix Price is a Russia/CIS retail variety-store chain. Retail store
services fall under Class 35, an entirely different class and channel of trade from
downloadable software / SaaS (Classes 9/42). Google autocorrects "fixprove" queries toward
this chain, which — per the master build plan's naming audit — is read as a *positive*
signal (the term "FixProove" is otherwise unclaimed in software). **Assessment: low risk.**
Different mark, different class, different goods, different consumer base.

### "BugProve" (firmware security, bugprove.com)
Confirmed via web search: BugProve is a real, operating company (founded 2021, Budapest,
also associated with a Dover, DE entity) offering an automated IoT/embedded firmware
vulnerability-analysis SaaS platform. This is the closer of the two comparisons and
**deserves a more careful read than "non-conflicting" on its own**:

- **Points toward no conflict:** different first syllable/element ("Bug" vs. "Fix" — the
  dominant, memorable portion of each mark); different specific function (firmware binary
  vulnerability/CVE scanning vs. deterministic source-code symbol resolution for
  AI-generated diffs); no evidence of an existing federal trademark registration or
  application surfaced in a general web search (not the same as a confirmed TESS clear).
- **Points toward caution:** both are single-word marks combining a verb/noun with the
  suffix "-Prove"; both are developer-facing security/verification SaaS tools; both could
  plausibly file in Class 9 and/or Class 42. Shared suffix + same broad industry + same
  buyer (software engineering teams) is exactly the fact pattern where a USPTO examiner or
  the other party could raise a likelihood-of-confusion argument, even though the marks are
  not identical.
- **Net assessment: low-to-moderate risk, not zero.** This is flagged as a genuine due
  diligence finding, not a rubber-stamp of "non-conflicting" — recommend a formal TESS
  search (or an attorney-run clearance search covering Classes 9/42 and coordinated classes)
  specifically checking "-Prove"/"-Proof" formatives in software classes before you commit
  filing fees.

**Standing-rules note:** per Keystone ("unverified means unverified"), this record should be
read as "web search did not surface an existing FixProve conflict" — not as "a clearance
search was performed." Those are different claims and only the first is true here.

---

## 4. Recommended next action
1. Yehor reviews/edits the Class 9 and Class 42 text above (or has counsel do so).
2. Run (or commission) a real TESS/TSDR clearance search before filing, specifically on
   "BugProve" and any other "-Prove"/"-Proof" software marks in Classes 9/42.
3. File via TEAS Plus (lower fee, requires using pre-approved ID Manual language where
   possible — the text above is written close to ID Manual style for this reason) or
   standard TEAS if you want the free-text latitude above verbatim.

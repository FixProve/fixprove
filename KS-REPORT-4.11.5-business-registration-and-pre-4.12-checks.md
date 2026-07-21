# Keystone Report — Operational Sub-Session 4.11.5: Business Registration & Pre-4.12 Checks
**Date:** 2026-07-20 · **Director:** Yehor Kaliberda · **Co-Pilot:** Claude (Cowork)
**Scope:** Danish business registration (the action the 4.11 legal pause was FOR), the
pre-4.12 two-minute checks (A2, A3), lawyer-brief status, and the tax-operations system.
Append-only per MEMORY/critical-actions.md convention — no prior report edited.
Filed identically in FixProve and Patchward roots (both products share this registration).

---

## 1. Provenance

Executed in Claude Cowork with Yehor operating every authenticated surface personally
(virk.dk via MitID, Nordea netbank, npmjs.com, GitHub) — the AI drafted, verified, and
double-checked every field; it never entered credentials or submitted anything. Every
form value was screenshot-reviewed before Yehor clicked. All legal claims verified
against primary sources (skat.dk, retsinformation.dk, Erhvervsstyrelsen) during the
session; one goods-vs-services PMV ambiguity was escalated to a deeper research pass
against Skat.dk's own text before proceeding.

## 2. Main event — enkeltmandsvirksomhed REGISTERED (submitted)

| Field | Value |
|---|---|
| Entity | Enkeltmandsvirksomhed (sole proprietorship), owner Yehor Kaliberda |
| Name | **FixProve** (CVR-cleared, 0 collisions; "Patchward" also CVR-cleared 0 results) |
| Case | **Sag B26-EF-27-TM** — submitted 2026-07-20 → Skattestyrelsen review ≤14 hverdage |
| CVR | PENDING — arrives at yehor@yehor.ai; receipt to yehor.kaliberda.official@gmail.com |
| Startdato (business + moms) | **30-06-2026** (evidence: Cloudflare invoices IN-70010671/-693, Rompelman preparatory-cost doctrine) |
| Moms | Voluntary, normal, **kvartalsvis** — chosen over PMV because Skat.dk bars PMV from EU-B2B service sales (disqualifying for worldwide SaaS) |
| Branche | 62.10.00 Computerprogrammering (primary) + 62.90.00 (secondary) |
| Public data | Aarhus address; mobile NOT published; yehor@yehor.ai published; reklamebeskyttelse ON |
| Products under this CVR | FixProve AND Patchward — **one CVR = one set of books**, product-tagged |

**Effect on the 4.11 standing block:** the "sole trader vs. registered entity" question —
the reason for the legal pause — is now DECIDED AND EXECUTED by Yehor personally.
Stripe setup becomes actionable the moment the CVR arrives. Formal lift of the
CA-1/CA-2 block should be logged by Yehor in MEMORY/critical-actions.md per its own
convention (this report flags it; does not edit that file).

## 3. Pre-4.12 checks — RESULTS (Yehor-verified, this session)

| # | Check | Expected | **Confirmed** | Verdict |
|---|---|---|---|---|
| A2 | GitHub Marketplace listing (github.com/marketplace/manage) | NONE | **NONE** — only an unrelated "Free Disk Space" Action is publishable; no FixProve listing exists | ✅ CLOSED — matches plan (Marketplace deferred ~Day 45). KS-4.11 item H resolved. |
| A3 | Legacy NPM_TOKEN (npmjs.com → Access Tokens) | Revoked | **STILL ACTIVE** — token "fixprove-release-ci v3" (npm_YhVn……Sj9s), **Bypass-2FA ✓**, created 2026-07-13, last used 2026-07-13, expires 2026-08-12 | ⚠️ **ACTION REQUIRED — see §4.** KS-4.11 item J resolved: NOT revoked. |
| A4 | Lawyer brief (FixProve-Legal-Brief-2026-07-17.docx) sent to counsel? | — | **NOT CONFIRMED this session** — Yehor did not state sent/pending | OPEN — YEHOR-TO-CONFIRM. Note: this session executed the brief's central open question (entity structure), reducing but not eliminating its remaining scope (ToS/Privacy, GDPR, liability, trademark). |

## 4. Defect found — ACTIVE bypass-2FA npm token (HIGH)

OIDC Trusted Publishing is the live publish path (verified in KS-REPORT-4.11 item C:
`trustedPublisher` confirmed on the registry). The bypass-2FA token therefore serves
no purpose and is pure standing risk — a theft-grade credential able to publish as
`fixprove` without 2FA. It auto-expires 2026-08-12, but 23 days of unnecessary
exposure on a supply-chain-critical package is not acceptable posture.

**Required action (Yehor, ~1 minute):** npmjs.com → Access Tokens → delete
"fixprove-release-ci v3". Then confirm the next CI release still publishes green via
OIDC. Log the revocation date here: 2026-07-21 (see Addendum below).

---

## Addendum (2026-07-21, during Session 4.12-A follow-up)

**§4 defect closed.** Yehor deleted "fixprove-release-ci v3" directly on
npmjs.com (`npmjs.com/settings/fixprove/tokens/`) — confirmed via screenshot
showing the "deleted 1 token" banner. Yehor separately confirmed the next CI
release still publishes green via OIDC (Trusted Publishing), per the
required verification step above. No further action needed on this token.

**Noted in passing, not itself an action item:** the same tokens page now
shows a second token, "fixprove-release-ci v2" (Bypass-2FA also on,
created 2026-07-06, expired 2026-07-13) — already expired, so it carries no
active risk and does not need deletion, but is left as a visible record on
the account. Also noted: npmjs.com is now showing an in-product banner that
bypass-2FA tokens are being restricted platform-wide (account changes
arriving Aug 2026, direct publishing restricted Jan 2027) — external
confirmation that moving `fixprove` to OIDC Trusted Publishing in Session
4.8 was the correct call ahead of npm's own deprecation timeline, not
something to revisit.

KS-4.11 item J: **CLOSED — revoked 2026-07-21.**

## 5. Tax-operations system delivered (this session)

- `Bookkeeping last update 20.07.26/TAX-OPERATIONS.md` — single source of truth:
  identity table, standing rules, ledger (seeded: bilag 2026-001/002, the two domain
  purchases, −81,36 / −69,76 DKK, reverse-charge net-0), VAT-by-customer table,
  period-close checklist, two-pass verification protocol, deadline table.
- Skill **`dk-enkeltmand-tax`** — installed and ACTIVE in Cowork (verified in session).
- Google Calendar (egorka30001@gmail.com), 4 recurring series: MOMS due
  (1 Sep/1 Dec/1 Mar/1 Jun — file even if zero), MOMS prep (~2 wks ahead, first
  2026-08-18), annual oplysningsskema (~1 Jul), annual prep (mid-June).
- `PATCHWARD-TAX-README.md` in Patchward root — pointer to the master ledger; Patchward
  keeps NO separate books, only `Produkt = Patchward` tags.
- Advokat project memory (`OPERATING-STANDARD-AND-RECORD.md`) — decisions + rationale
  recorded so they are not relitigated.

## 6. Known limitations (stated plainly)

- CVR not yet issued — everything downstream (MitID Erhverv, NemKonto, Digital Post,
  Stripe, registreringsbevis/VAT-period confirmation) blocks on Skattestyrelsen.
- VAT-period calendar series assumes standard quarters — MUST be reconciled against
  the registreringsbevis when it arrives.
- Lawyer-brief send status unconfirmed (§3 A4).
- The npm token remains active until Yehor revokes it (§4).
- Claude-subscription costs deliberately NOT booked/backdated — mixed personal/business
  use; a revisor apportionment question, not a ledger entry. Honesty over framing.

## 7. Session 4.12 readiness

A2 answered (NONE ✓), A3 answered (STILL-ACTIVE → revoke as first act of 4.12 or
before), brief status flagged for confirmation. **Session 4.12 (non-financial scope,
paste-block prepared) is READY TO OPEN.** Recommended first item: execute §4 revocation.

## 8. Accountability Statement

Signed by: Yehor Kaliberda — Date: 21.07.26

## 9. Methodology note

Two disciplines carried this session: (1) escalate ambiguous secondary sources to
primary text before acting (the PMV goods-vs-services fork — blogs said "no non-EU
trade"; Skat.dk's own page said services are permitted, EU-B2B is the actual
disqualifier — the opposite risk profile of the naive reading); (2) the operator
executes, the AI verifies — every authenticated step stayed in Yehor's hands with a
screenshot check before each click. Suggested improvement: token hygiene checks
(§4-class) should run at every session open, not wait for a checklist — a standing
30-second `npmjs.com → Access Tokens` glance until OIDC is the only credential.

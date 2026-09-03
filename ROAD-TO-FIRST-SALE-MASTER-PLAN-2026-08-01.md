# FixProve — Road to First Sale: Master Plan
**Date:** 2026-08-01 · **Owner:** Yehor Kaliberda · **Prepared by:** Node 1 (Lead Technical Co-Pilot)
**Status:** internal planning. Not legal advice. Pricing figures parameterised as `[TIER-A]`/`[TIER-B]`.

> Governing discipline: OPERATING-PLAN-D17-D60.md **Section 10** — one gate at a
> time. The gate is **PITFALL row 4** (legal review of Privacy Policy + Terms).
> Everything below either *accelerates that gate* or is *safe preparation that
> touches no standing boundary*. Nothing here publishes pricing, flips the
> GitHub App, or uses live Stripe.

---

## 0. Verified footing (checked this session, not assumed)

- **Row 4 email sent 2026-07-29** to `raadgivning@ivsr.dk` — **no documents
  attached**; it asks whether to send them. Confirmed from the thread body.
- **CA-1 PARTIAL LIFT is real** (recorded 2026-07-22): Stripe **account
  creation + TEST MODE** work is permitted. Still blocked until row 4 clears:
  public pricing (even placeholders), live keys, full activation needing
  ToS/Privacy URLs, and the GitHub App org→public flip.
- **The 3 drafts exist** on branch `drafts/row4-legal-drafts`:
  `PRIVACY-POLICY-DRAFT.md`, `TERMS-OF-SERVICE-DRAFT.md`, `LAWYER-QUESTION-LIST.md`.
- **Row 3 (VAT):** still OPEN in this project's record — the closing screenshot
  has not reached the assistant. (Yehor may hold his own primary evidence; it
  simply hasn't been verified here.)
- **Pre-existing pricing exposure** on public `origin/main` remains an open,
  separate decision (three tracked files carry the tier figures).

---

## 1. Priority order (do strictly in this sequence)

| # | Item | Why this rank |
|---|------|---------------|
| 1 | **Send the documents follow-up** | The only clock you fully control. Every day unsent adds a day to the wait that gates revenue. |
| 2 | **Your personal step-by-step** | You are the bottleneck on most open items; your checklist unblocks the parallel channels. |
| 3 | **AI risk-awareness analysis of the drafts** | Sharpens the human review; prep, not a substitute — starts *after* docs are queued. |
| 4 | **Selling-readiness personal review list** | Needed before launch, not before the gate; prepare, don't execute. |
| 5 | **Deep-research session plan** | The map for the waiting weeks — built last because items 1–4 define its inputs. (Delivered as a separate paste-ready prompt.) |

---

## 2. Item 1 — Send the documents (today, ~10 min)

Strategic change you decided: don't wait for "can you help?" — attach the
documents now so the one month covers **review + amendments**, not just intake.

1. Attach the three files to a follow-up on the **existing thread** (keep the
   subject so it threads): `PRIVACY-POLICY-DRAFT`, `TERMS-OF-SERVICE-DRAFT`,
   `LAWYER-QUESTION-LIST`. (Assistant has exported these as attachable files —
   see the chat message accompanying this plan.)
2. **VERIFY before sending (the D&B lesson):** expand the To field and confirm
   it reads exactly `raadgivning@ivsr.dk`.
3. **Confirm all three attachments are actually attached** (open each).
4. Send. Confirm it lands in **Sent**. The clock now covers the full review.

> This is a **CA-3** action (a send in your name). The assistant drafts; **you
> send**. Send text is provided in chat, ready to paste.

---

## 3. Item 2 — Your personal step-by-step

**This week**
1. Send the follow-up with documents (Item 1) — today.
2. Load the 3 documents + 22-question list on your phone / print them — needed
   for any walk-in consultation.
3. **VERIFY Advokatvagten Aarhus live** before going — current address, hours,
   walk-in rules from an official source (`advokatvagten.dk` / municipality
   site). Do **not** trust remembered details; they change. *(The assistant can
   fetch and confirm these on request — not asserted here to avoid a stale claim.)*
4. **Attend the free walk-in (~15 min):** bring the question list, ask them to
   **triage** — "which of these 22 genuinely need paid review, which are
   standard?" Write answers down verbatim (the SKAT-call discipline).
5. **Get 1–2 fixed-price quotes** for a ToS/privacy review (Danish online legal
   services). Then decide honestly: is avoiding a few thousand DKK worth several
   weeks of blocked revenue? A CVR-registered business review is a deductible
   expense.

**What to watch for in any legal answer (attention points)**
- **Liability limitation:** is "not liable for damages from tool output"
  enforceable against Danish **consumers** vs **businesses**? (B2B vs B2C differ.)
- **Withdrawal right:** does the 14-day *fortrydelsesret* apply to a SaaS
  subscription, and how must a waiver be worded to be valid?
- **GDPR:** is your actual data story (what you collect / don't) reflected
  correctly, and do you need a *databehandleraftale* (DPA) with sub-processors
  like Cloudflare/Stripe?
- **Must-change vs nice-to-have:** force the reviewer to mark each point as one
  or the other, so you know what actually blocks launch.

**Weeks 2–4 while waiting:** nothing legal from you — the queue runs itself.

---

## 4. Item 3 — AI risk-awareness analysis (prep for the human review)

Legitimate use of AI here: **analyse your own drafts for risk awareness** so you
walk into review understanding your exposure. It does **not** replace the
accountable human reviewer — every output is labelled *AI-prepared triage, not a
legal conclusion.*

Scope (can be produced as `RISK-AWARENESS-BRIEF.md` on the drafts branch, not main):
1. For each clause: the realistic **failure scenario** — "customer does X,
   clause says Y, gap Z means Yehor pays." Concrete cases only.
2. **Rank** each risk: likelihood × severity × whether the draft already covers
   it → a top-10 table.
3. Research **publicly documented** Danish/EU cases and Datatilsynet decisions on
   SaaS-ToS enforceability and small-SaaS GDPR fines — **cited, fetched live.**
4. **Map** each top-10 risk to the 22 questions; flag risks with **no covering
   question** and propose additions.
5. Deliver so you read it **before** any consultation and ask sharper questions.

> Say the word and the assistant will produce this brief from the actual draft
> text on the branch.

---

## 5. Item 4 — Selling-readiness: what YOU personally verify before the first sale

In order. Nothing sells until #1.

1. **Legal (the gate):** reviewed ToS + Privacy live at `fixprove.dev/terms` and
   `/privacy`. Nothing sells before this.
2. **The money path, end-to-end, yourself:** Stripe **test-mode** → buy your own
   product with a test card → webhook fires → entitlement activates → receipt
   arrives. *If you can't buy it, nobody can.* (Permitted now under CA-1.)
3. **The price:** `[TIER-A]`/`[TIER-B]` were set pre-launch — reconfirm they're
   still your decision. Setting/publishing a price is **CA-1, yours alone**.
4. **The promise:** read the landing page as a hostile customer — every claim
   must pass "what artifact proves this?"
5. **The support path:** where does a paying customer complain? A real, monitored
   address, stated in the ToS.
6. **The cancellation path:** can they leave as easily as they joined? Danish
   consumer law cares about this specifically.
7. **VAT/tax:** Stripe Tax configured for DK moms and your cross-border
   assumption **before** the first foreign customer (PITFALL row 1 fires here).

**How we sell (the launch model, unchanged):** CLI free forever → GitHub App
paid per-org → **direct founder outreach** to a hand-picked list of teams
visibly using AI code-generation, plus launch posts. No paid ads, no cold
volume — convert the install base with named outreach.

---

## 6. Double-check summary

- Row 4 sent 29 Jul, **documents not yet attached** → Item 1 is today's action. ✔ verified
- **CA-1 partial lift** already permits all **test-mode** Stripe work in the plan
  → no new approval needed for Item 5 Track B. ✔ verified (2026-07-22 record)
- **Row 3** not closed here (no screenshot received). ✔ held honestly
- **Pricing-off-main** decision stands; all deliverables here are pricing-free. ✔
- Could **not** verify from here: Advokatvagten Aarhus current address/hours →
  marked must-verify-live, not asserted.

**One-sentence shape:** documents into the queue today, your feet to the free
walk-in this week, AI sharpening your questions in parallel, Stripe test-mode
built while waiting — so the day the review clears, selling starts in days, not weeks.

# Stripe Account Setup Checklist — FixProve
**Prepared:** 2026-07-01, Session 0.2
**Business model reminder (from master build plan):** flat per-repo/org subscription
($29/mo solo, $99/mo team), BYOK for any optional LLM-suggestion feature, billed via Stripe
tied to a GitHub App install/entitlement (Session 2.3 builds the actual integration).

This is a checklist only — no Stripe account was created and no funds/entitlements were
touched in this session. Opening the account and providing legal/financial identity details
is a step only Yehor can execute.

---

## 1. Before you open the account
- [ ] Decide the legal entity that will own the Stripe account (sole proprietor / LLC /
      corp). This affects tax docs (SSN vs EIN) and the business name Stripe will display
      on statements. Not a decision Claude should make for you.
- [ ] Have ready: legal business name, business address, industry ("Software" /
      "SaaS" — Stripe's MCC classification affects some risk/reserve settings), and a
      support email/phone.
- [ ] Have a business bank account ready for payouts (can be a personal account for a sole
      proprietor, but a dedicated business account is cleaner for bookkeeping/tax-prep
      later — see `small-business:tax-season-organizer` skill when that matters).
- [ ] Publish `fixprove.dev` (or at minimum a placeholder page) before applying — Stripe
      account review typically wants a live URL describing what's being sold, pricing, and
      contact info. Session 0.3 ships this.

## 2. During Stripe onboarding
- [ ] Create the account at https://dashboard.stripe.com/register.
- [ ] Select business type + industry (Software/SaaS).
- [ ] Enter identity verification details (SSN last-4 or EIN depending on entity type).
- [ ] Add the business bank account for payouts.
- [ ] Set the statement descriptor (what shows on customer card statements) — e.g.
      "FIXPROVE.DEV" — keep it recognizable to avoid chargebacks/disputes.
- [ ] Add Terms of Service, Privacy Policy, and Refund Policy URLs. These need to exist
      (even as simple pages) before Stripe will fully activate the account — flag this as a
      dependency on the `/web` package.

## 3. Product/billing configuration (ahead of Session 2.3 integration)
- [ ] Decide subscription structure in Stripe: two Prices under one Product ("FixProve"),
      e.g. `price_solo_29_monthly` and `price_team_99_monthly`, or two separate Products —
      pick one convention now so Session 2.3 doesn't have to guess.
- [ ] Enable **Stripe Billing** (subscriptions) — required for recurring per-repo/org
      pricing.
- [ ] Enable **Stripe Checkout** or **Customer Portal** (or both) — Customer Portal lets
      customers self-serve cancel/upgrade, which matters for the "sub-20-hrs/week" goal in
      Milestone 4.
- [ ] Consider **Stripe Tax** if you'll have customers outside your home jurisdiction —
      SaaS sales tax/VAT nexus rules vary by state/country and change; don't hardcode a
      one-time answer, use Stripe Tax's live calculation or consult a tax advisor.
- [ ] Set up a webhook endpoint (will point at `/app`'s billing handler once Session 2.3
      builds it) for at minimum: `checkout.session.completed`,
      `customer.subscription.updated`, `customer.subscription.deleted`,
      `invoice.payment_failed`.
- [ ] **Security note for Session 2.3:** webhook signature verification (Stripe's
      `constructEvent` with the webhook signing secret) is non-negotiable — the master
      build plan's Session 2.3 adversarial test case is explicitly "a spoofed webhook must
      NOT grant entitlement." Do not build entitlement logic that trusts an unverified
      webhook payload.

## 4. API keys and environments
- [ ] Use **test mode** keys for all Session 2.x development; never commit a live secret
      key to the repo (add `.env`/`.env.local` to `.gitignore` — already done at repo
      root).
- [ ] When ready for real billing, use **restricted API keys** scoped to only the
      capabilities `/app`'s billing handler needs (Checkout + subscriptions + webhooks),
      not a full secret key.
- [ ] Store live keys in the deployment platform's secret manager (e.g., Cloudflare/hosting
      provider env vars), not in the repo, not in chat.

## 5. Fraud / compliance
- [ ] Review Stripe Radar's default rules; for a low-volume B2B SaaS the defaults are
      usually fine at launch — revisit if chargebacks appear.
- [ ] PCI compliance: using Stripe Checkout or Elements means Stripe handles card data
      directly (SAQ A eligibility) — do not build a custom card form that touches raw card
      numbers.

## 6. GitHub Marketplace consideration
- [ ] The master build plan (§3, §4 Session 3.3) plans a GitHub Marketplace listing in
      addition to direct Stripe billing. Marketplace has its own billing API — decide
      whether Marketplace billing or direct Stripe billing (or both, one per acquisition
      channel) is primary before Session 2.3, since this affects the entitlement-checking
      logic Session 2.3 builds.

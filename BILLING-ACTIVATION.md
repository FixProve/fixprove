# BILLING-ACTIVATION.md — turning the test-mode billing module on

**Built:** Session 4.12-J, 2026-08-04 (backlog item B1).
**Status of the code:** built and verified offline. **Status of the account:** does not exist yet.
**Mode:** TEST ONLY. The module refuses a live key at construction — see §6.

This document has two halves. **§1–§4 are what Yehor does to finish B1.**
**§5–§6 are the production-flip runbook for A3**, which must not be executed until the
legal-review gate (PITFALL row 4) has actually closed.

---

## 0. What is built, and what is honestly not

**Built and verified this session (40 offline tests, all passing):**

- `billing/src/signature.ts` — Stripe `Stripe-Signature` verification (HMAC-SHA256, constant-time
  compare, replay-window tolerance in both directions, secret-rotation support).
- `billing/src/webhookHandler.ts` — the six lifecycle events, event-id idempotency, an
  out-of-order guard, fail-closed account resolution.
- `billing/src/types.ts` — the entitlement gate `isPaidCheckEnabled()` and the Stripe→FixProve
  status mapping.
- `billing/src/checkout.ts` — hosted-Checkout session creation, account binding on three carriers,
  and a runtime refusal of any non-test key.
- `billing/scripts/devReceiver.mjs` — a local HTTP receiver for `stripe listen`.
- `.github/workflows/billing-stripe-e2e.yml` — the manual, account-dependent E2E job.

**NOT built, and not claimed:**

- **No Stripe account exists.** Nothing in this repo has ever talked to Stripe.
- **No production route.** The Worker (`worker/src/index.ts`) has no `/stripe/webhook` route yet.
  Wiring it needs a KV-backed `EntitlementStore` (mirroring `worker/src/kvPendingStore.ts`) and a
  real KV namespace — deliberately deferred until the account exists, so the adapter is written
  against a verified event shape rather than a guess.
- **No connection to the PR check.** `isPaidCheckEnabled()` is correct and tested, but nothing in
  `app/` calls it yet. Turning the paid feature on/off is proven at the entitlement layer only.
- **The event fixtures are hand-built from Stripe's documentation, not captured from a live
  account.** That is the single largest residual risk in this package, and §3 is the step that
  retires it.

---

## 1. Create the Stripe account (test mode) — ~15 minutes

Permitted under the CA-1 partial lift of 2026-07-22 (account creation + all test-mode work).

1. Register at `https://dashboard.stripe.com/register`.
2. Business type: **enkeltmandsvirksomhed / sole proprietorship**. Country: **Denmark**.
   Business number: **CVR 46646223**. Industry: Software / SaaS.
3. **Do not complete live activation.** Stripe will prompt for bank details and legal URLs —
   skip it. Test mode works fully without activation, and the Privacy/ToS URLs it wants do not
   exist yet by design (that is the row-4 gate).
4. Confirm the dashboard shows the **Test mode** toggle ON before doing anything else.

## 2. Create the test products and prices

In **test mode**, Products → Add product. Create two recurring (monthly) subscription products,
one per tier.

- Name them so the tier is unambiguous, and note each generated **price ID** (`price_...`).
- **Record the two price IDs somewhere outside this repo** (they go in env vars, not source).
  The amounts live in the Stripe dashboard only. No amount, currency, or interval is ever sent
  from this codebase — `billing/test/checkout.test.ts` asserts that as a test.

| Tier label used in code | Stripe test price ID | Where it goes |
|---|---|---|
| `TIER_A` | `price_…` (fill in) | env `STRIPE_PRICE_TIER_A` |
| `TIER_B` | `price_…` (fill in) | env `STRIPE_PRICE_TIER_B` |

## 3. Run the end-to-end test yourself — this is B1's real done-check

This is the step that turns the hand-built fixtures into verified fact. Install the
[Stripe CLI](https://docs.stripe.com/stripe-cli), then, from the repo root:

```bash
pnpm --filter @fixprove/billing build

# Terminal 1 — get the CLI's own signing secret. NOTE: this is NOT the
# dashboard endpoint secret; using the dashboard one here makes every
# delivery 400 and is the most common way to lose an afternoon.
stripe listen --print-secret

# Terminal 1 — start the receiver with that value
STRIPE_TEST_WEBHOOK_SECRET=whsec_...   node billing/scripts/devReceiver.mjs

# Terminal 2 — forward real Stripe test events at it
stripe listen --forward-to http://127.0.0.1:8787/stripe/webhook

# Terminal 3 — drive the six scenarios
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

**What to look for in terminal 1.** Every line is JSON. The pass condition is:

- every delivery returns `"status":200` — **any 5xx means a real Stripe payload has a shape the
  handler did not anticipate**, which is exactly what this run exists to find;
- `customer.subscription.created` with an active subscription logs `"action":"subscription_active"`;
- `customer.subscription.deleted` logs `"action":"subscription_canceled"`;
- no delivery logs `"action":"account_unresolved"` for an event you triggered from a real
  checkout (CLI-triggered fixtures WILL log it — they carry no FixProve metadata, which is
  correct and expected).

**Then the real purchase.** Create a Checkout session with `client_reference_id` set to a test
org id, pay with test card `4242 4242 4242 4242` (any future expiry, any CVC), and confirm the
receiver logs the account flipping to entitled. Then cancel the subscription in the dashboard and
confirm it flips back. **That pair — flip on, flip off, both in the log — is B1's done-check, and
only you can produce it.** Also worth running: `4000 0025 0000 3155` (3DS required) and
`4000 0000 0000 0002` (decline), which exercise scenarios 3 and 2 against the real API.

## 4. Wire the CI job

Add one repository secret: **`STRIPE_TEST_SECRET_KEY`** = your `sk_test_…` key.
Then run the **"Billing — Stripe test-mode E2E"** workflow manually (Actions → Run workflow).

It is `workflow_dispatch`-only on purpose: a job that silently skips on every push would read as
green coverage that does not exist. The offline suite (40 tests) already gates every push through
`ci.yml` and needs no secrets.

---

## 5. Production flip runbook — DO NOT RUN until PITFALL row 4 has closed

Gated on: an accountable reviewer confirming the Privacy Policy and ToS in writing (A1), and
those pages being live at permanent URLs (A2). Until then this section is reference only.

1. **Legal URLs first.** Stripe's live activation asks for Privacy, Terms, and Refund policy URLs.
   They must already be published and returning 200. This is the gate, not a formality.
2. **Complete live activation** in the dashboard: legal name, address, CVR 46646223, bank account
   for payouts, statement descriptor (`FIXPROVE.DEV` — keep it recognisable to reduce chargebacks).
3. **Recreate the products and prices in live mode.** Test-mode products and prices do **not**
   carry over. New objects, new `price_…` IDs. Update `STRIPE_PRICE_TIER_A` / `_TIER_B`.
4. **Create the live webhook endpoint** pointing at the production Worker route. It gets its own
   signing secret — **different from both the test endpoint secret and the CLI secret**. Set it via
   `wrangler secret put STRIPE_WEBHOOK_SECRET`, never in `wrangler.toml`.
5. **Use a restricted key, not a full secret key** (`rk_live_…`) scoped to Checkout +
   subscriptions + webhooks only.
6. **Delete the test-mode guard deliberately.** `assertTestModeKey()` in `billing/src/checkout.ts`
   refuses any non-test key by design. Removing it is a reviewed, logged step of the flip — a
   Critical Action, not a config tweak. Do not "temporarily" bypass it.
7. **Prove it once, small.** One real charge, confirmed in the live balance, then refunded.
   Confirm the live webhook delivered and the entitlement flipped. Only then continue to A4.
8. **VAT.** Before charging EU customers, resolve backlog item C2 (OSS registration, country +
   B2B VAT-ID capture, DK 25% moms / reverse charge). Stripe Tax handles calculation; it does not
   handle your registration obligations.

## 6. Standing boundaries this document does not lift

No live keys, no public pricing, no GitHub App public flip, no Marketplace listing publish —
until the legal gate closes. Marketplace additionally needs ≥100 installs and a verified
publisher (Gate 2, verified 2026-08-01), which is why the first-dollar route is direct Stripe
(decision D-1). Nothing in §1–§4 touches any of those boundaries.

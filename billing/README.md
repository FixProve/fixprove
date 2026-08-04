# @fixprove/billing

Stripe subscription lifecycle, webhook signature verification, and the entitlement gate that
turns the paid PR check on and off.

**TEST MODE ONLY.** `createBillingModule()` throws `LiveKeyRefusedError` if handed anything that
is not an `sk_test_` / `rk_test_` key. That is deliberate: the project's standing boundary
forbids live payments until the legal-review gate closes, and this turns the rule into an
invariant the code enforces rather than a rule a human has to remember.

**No pricing lives here.** Only opaque Stripe `price_…` IDs, supplied at runtime from
configuration. `test/checkout.test.ts` asserts that no `unit_amount`, `currency`, `recurring`, or
`amount` parameter is ever constructed by this package.

## Layout

| File | What it does |
|---|---|
| `src/signature.ts` | `Stripe-Signature` verification: HMAC-SHA256, constant-time compare, replay-window tolerance, multi-secret rotation. |
| `src/webhookHandler.ts` | Verify → parse → dedupe → order-check → apply. Six lifecycle event types. |
| `src/types.ts` | `Entitlement`, `EntitlementStore`, `isPaidCheckEnabled()`, the Stripe→FixProve status map. |
| `src/checkout.ts` | Hosted Checkout session creation; the test-mode key invariant. |
| `src/memoryStore.ts` | Reference in-memory store. Production wants a KV-backed one (not yet built). |
| `scripts/devReceiver.mjs` | Local HTTP receiver for `stripe listen`. |

## Design notes worth knowing before changing anything

- **The raw body matters.** Signature verification runs over the exact bytes Stripe sent.
  Re-serialising the parsed JSON anywhere upstream breaks every signature.
- **Fail-closed everywhere.** Unknown subscription status → not entitled. Unresolvable account →
  recorded, not guessed. `past_due` → paid check off immediately.
- **`checkout.session.completed` is not proof of payment.** Stripe fires it with
  `payment_status: "unpaid"` when 3DS is pending. Treating it as paid is how you hand out free
  subscriptions; see scenario 3.
- **Idempotency is the replay defence, not the signature.** A captured delivery replayed inside
  the 300-second tolerance verifies correctly by design. The event-id ledger is what stops it.
- **No `stripe` npm SDK.** Verification is built directly on `node:crypto` so the deployment
  target (a Cloudflare Worker) stays dependency-light and the whole suite runs offline. The cost:
  this code must track Stripe's signature scheme if Stripe ever changes it.

## Running

```bash
pnpm --filter @fixprove/billing build
pnpm --filter @fixprove/billing test    # 40 tests, offline, no account needed
```

To go further — creating the account, running real test-card purchases, wiring CI — see
`BILLING-ACTIVATION.md` at the repo root.

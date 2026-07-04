# @fixprove/worker

Cloudflare Worker (Hono) exposing `@fixprove/github-app`'s webhook and OIDC
callback handling over HTTP, backed by Cloudflare KV for the pending
check-run store instead of Session 2.1's in-memory `Map`.

- `POST /webhooks` — GitHub `pull_request` webhook delivery.
- `POST /callback` — the customer's GitHub Action's OIDC-authenticated
  findings callback (see `../app/templates/fixprove-check.yml`).

No logic lives here beyond HTTP adaptation: signature verification,
Checks API calls, and OIDC verification are all the same, already
logic-verified `@fixprove/github-app` functions from Session 2.1 — this
package only parses the Cloudflare `Request`, calls those functions
unchanged, and maps their `{ok, status, error}` result to an HTTP
`Response`. A global Hono error boundary (`app.onError`) turns any
uncaught exception — including a `KVStoreError` from a failed KV
operation — into a classified `500`, never a hang or silent success.

**Status (Session 2.2, 2026-07-04):** implementation + full unit/
adversarial test suite complete and passing (16/16). `wrangler deploy
--dry-run` succeeds (bundle builds, KV binding and vars resolve). **Not
live-deployed** — a real `wrangler deploy` requires Cloudflare credentials
this sandbox cannot supply. See `../KS-REPORT-2.2-kv-worker.md` for the
full verification record and known limitations before treating this as
production-ready.

**Setup for a real deploy (Yehor):**

1. `wrangler kv namespace create PENDING_CHECKS_KV` and paste the real `id`
   into `wrangler.toml` (replacing the `REPLACE_WITH_REAL_KV_NAMESPACE_ID`
   placeholder).
2. `wrangler secret put GITHUB_APP_ID`
3. `wrangler secret put GITHUB_APP_PRIVATE_KEY`
4. `wrangler secret put GITHUB_WEBHOOK_SECRET`
5. `wrangler deploy`

**License:** proprietary — see root `NOTICE.md`. Not part of the open-core
`/cli` package.

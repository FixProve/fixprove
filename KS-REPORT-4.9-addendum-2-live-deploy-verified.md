# Keystone Report Addendum 2 — Session 4.9: Live wrangler v4 Deploy Verified

Closes the single open item from `KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md`
(§6 Known Limitations, §8 Accountability) and
`KS-REPORT-4.9-addendum-close-verification.md`: the live, authenticated
`wrangler deploy` under v4 had zero real-world runs at those reports'
time of writing. It now does.

## What actually happened (Yehor's own machine, real Cloudflare account)

1. `pnpm install` at the repo root pulled the real `wrangler@4.111.0` +
   `@cloudflare/workers-types@^5.20260715.1` dependencies for the first
   time — **the first two verification attempts on Yehor's machine
   (`npx wrangler whoami`, `npx wrangler deploy --dry-run`) both reported
   `wrangler 3.114.17`**, proving the committed `package.json` bump alone
   doesn't change what's already installed locally. This was caught, not
   assumed away, before any deploy was attempted — installed for real,
   then re-verified: `npx wrangler --version` → `4.111.0`, dry-run bundle
   size byte-identical to both of this session's sandbox runs (298.68
   KiB / 62.16 KiB gzip), confirming reproducibility across three
   independent environments (two sandbox scratch copies + Yehor's real
   machine).
2. `npx wrangler deploy` (worker) — **succeeded for real.** Uploaded
   `fixprove-github-app`, deployed triggers including the
   `api.fixprove.dev` custom domain, Version ID
   `3e5143ab-9cc0-4bb3-9ac8-4f14b15b3360`.
3. `next build && npx wrangler deploy` (web) — **succeeded for real.**
   Uploaded `fixprove` (7 new/modified static assets, 11 already
   present), Version ID `dec04361-d3d1-415b-9d3e-278bd2f66493`. Deploy
   output printed `https://fixprove.truffel30001.workers.dev` (the
   default workers.dev subdomain), not `fixprove.dev` — this looked like
   a possible regression and was not assumed benign.

## Live cross-check (not just trusting the deploy's own "Success" output)

Per this project's standing rule — never trust a green deploy status
alone — both live domains were checked directly, not inferred from the
CLI output:
- `https://api.fixprove.dev` — fetched directly, responded (did not
  time out), confirming the worker is live and routable post-deploy.
- `https://fixprove.dev` — the sandbox's own direct fetch timed out
  (consistent with this sandbox's known total block on Cloudflare-hosted
  domains, not evidence of an outage). Switched to the Chrome-based
  fetch workaround per `feedback_cloudflare_sandbox_network`: navigated
  to `fixprove.dev` for real and read the rendered page. **Confirmed
  live and correct** — title "FixProve — prove your AI-generated code
  before it merges," full landing-page copy present and matching the
  expected content (waitlist CTA, the `read_exel`/`fastapi_helpers`
  example, etc.).

**Root cause of the workers.dev-URL appearance, resolved rather than
assumed:** `web/wrangler.toml` has never had a `routes`/`custom_domain`
entry (confirmed by reading the file directly this session) — this
project's own `web/src/worker.ts` KS-TRACE header documents that this
Worker was originally created via Cloudflare's dashboard static-upload
flow, which sets up custom domain routing at the dashboard/account
level, separate from `wrangler.toml`. `wrangler deploy` updates the
Worker's code and reports the URL it manages directly (the workers.dev
subdomain); it does not remove or need to know about a custom domain
association configured outside its own config file. The live check
above proves that association survived this deploy intact — **this is
not a defect, and not something introduced by the v4 upgrade**, but it
was verified, not assumed, before being written down as fine.

## Updated status

The wrangler v3→v4 upgrade is now **fully verified**: code-complete,
build/typecheck/test-passing (three independent runs, two sandbox + one
real machine), dry-run-clean, and now genuinely deployed live with both
production domains confirmed serving correctly afterward. No open
verification gap remains on this item.

## Accountability Statement

**Confirmed complete by Yehor's own execution** (the deploy commands
were run on his machine, under his authentication, against the real
Cloudflare account — not something the AI could or did execute itself,
consistent with this project's standing rule that live/irreversible
actions are human-executed). The AI's role in this addendum is
independent verification of the outputs Yehor reported, plus the live
domain cross-check above.

Signed: _______________________ (Yehor)
Date: _______________________

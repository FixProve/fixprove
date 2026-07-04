# FixProve — Live Deployment Runbook

**Session:** 3.2 · **Date:** 2026-07-04 · **Owner of every step below marked HUMAN:** Yehor

This runbook takes the FixProve GitHub App from "logic-verified, dry-run validated" (Sessions 2.1–2.2's status) to a live, production-serving system. It is written as a sequence of discrete steps. Every step is labeled with who performs it:

- **HUMAN** — requires a real credential, a real dashboard click, or a decision only Yehor can make. No script in this repository can perform this step, and none should try.
- **AUTOMATED** — a command or CI job that runs the same way every time, safe to script or re-run.

**Read this before starting:** the boundary between HUMAN and AUTOMATED steps below is not a formality — it is the literal line this session was asked to draw, and it exists for a concrete reason: Session 0.1's own Keystone Report recorded a HIGH-severity incident (a PyPI token pasted in plaintext in a chat session, later revoked) that happened precisely at a HUMAN/AUTOMATED boundary that wasn't respected. Every credential-issuing step below is HUMAN specifically so that no token, private key, or secret ever needs to pass through an AI session's context window.

---

## Part A — Cloudflare Worker (the App backend)

### A1. Create the real KV namespace — **HUMAN**

The delivered `worker/wrangler.toml` ships with a placeholder:

```toml
[[kv_namespaces]]
binding = "PENDING_CHECKS_KV"
id = "REPLACE_WITH_REAL_KV_NAMESPACE_ID"
```

Run, from a machine with real Cloudflare credentials (this cannot be done from an AI sandbox — see `feedback_cloudflare_sandbox_network.md`):

```bash
wrangler kv namespace create PENDING_CHECKS_KV
```

Copy the returned `id` and replace the placeholder in `worker/wrangler.toml`. Commit this change — the namespace ID itself is not a secret.

### A2. Reserve the production route — **HUMAN** — *(gap found and closed during this session, see Section titled "Adversarial Verify" below)*

`worker/wrangler.toml` as delivered in Session 2.2 has **no `routes` entry at all**. Left as-is, `wrangler deploy` would publish the Worker only to its default `*.workers.dev` subdomain — but the customer-facing GitHub Action template (`app/templates/fixprove-check.yml`) hardcodes its callback POST to `https://api.fixprove.dev/callback`, and the Worker's own `CALLBACK_AUDIENCE` var is set to `https://fixprove.dev/callback`. Neither of those URLs will resolve to anything without an explicit route binding. Before the first deploy, add to `worker/wrangler.toml`:

```toml
routes = [
  { pattern = "api.fixprove.dev/*", custom_domain = true }
]
```

This requires `api.fixprove.dev` to be added as a custom domain in the Cloudflare dashboard for this Worker (Workers & Pages → your Worker → Settings → Domains & Routes → Add Custom Domain). `fixprove.dev` itself is already Yehor's, registered in Session 0.1/0.2 — this step attaches a new subdomain to this specific Worker, it does not re-register anything.

### A3. Set the three GitHub App secrets — **HUMAN**

None of these exist yet — they are only produced by Part B below. Once Part B is complete, run each of these from a machine with real Cloudflare credentials:

```bash
wrangler secret put GITHUB_APP_ID
wrangler secret put GITHUB_APP_PRIVATE_KEY
wrangler secret put GITHUB_WEBHOOK_SECRET
```

Each command prompts interactively for the value — this is deliberate. Never pass these as command-line arguments (they would land in shell history) and never paste them into a chat session with an AI agent.

### A4. Deploy — **HUMAN** (triggers an **AUTOMATED** build)

```bash
cd worker
wrangler deploy
```

`wrangler` bundles the TypeScript itself (confirmed working in Session 2.2's dry-run: 290 KiB / 61 KiB gzipped). This step only needs a human because it requires `CLOUDFLARE_API_TOKEN` (or an interactive `wrangler login` session) — the exact boundary Session 2.2's own report named as unverifiable from this sandbox. Everything upstream of this command (the bundle, the config, the KV binding resolution) was already dry-run-validated in Session 2.2; this step is the one this runbook cannot discharge on Yehor's behalf.

### A5. Smoke-test the live endpoint — **AUTOMATED** (safe to run repeatedly)

```bash
curl -i -X POST https://api.fixprove.dev/webhooks \
  -H "content-type: application/json" \
  -d '{}'
```

Expect `401` (missing signature) — this confirms the Worker is live and its error-handling path (Session 2.2's own adversarial-verified behavior) is reachable over the real network, without needing a real GitHub signature to test it.

---

## Part B — GitHub App production registration

### B1. Register the App — **HUMAN**

GitHub → Settings → Developer settings → GitHub Apps → New GitHub App. Configuration, matching exactly what `app/src/webhookHandler.ts` and `app/src/checkRun.ts` actually use (nothing more — this backend never reads repository contents):

| Setting | Value |
|---|---|
| Webhook URL | `https://api.fixprove.dev/webhooks` |
| Webhook secret | generate one now (a long random string) — **do not reuse it anywhere else**; it becomes `GITHUB_WEBHOOK_SECRET` in step A3 |
| Permissions → Checks | **Read & write** |
| Permissions → Pull requests | **Read-only** |
| Permissions → Contents | **No access** — deliberately. This backend has no code path that reads repository contents (see `app/README.md`'s own claim, and it's grep-verifiable: nothing under `app/src/` calls any contents/git-data endpoint). Granting Contents access here would silently widen the App's blast radius beyond what the architecture actually needs. |
| Subscribe to events | **Pull request** only |
| Where can this GitHub App be installed? | Any account (for the public launch) |

### B2. Retrieve the App ID and generate a private key — **HUMAN**

After creation, GitHub shows the **App ID** directly on the settings page (this is not secret — it's visible to anyone who installs the App, hence `worker/wrangler.toml`'s own comment noting it could even live in `[vars]` rather than as a secret). Scroll to **Private keys** → **Generate a private key**. GitHub downloads a `.pem` file once — this is the only time it is ever shown. This becomes `GITHUB_APP_PRIVATE_KEY` in step A3.

### B3. Configure GitHub Actions OIDC trust — **nothing to configure here, by design**

There is deliberately no HUMAN step for the OIDC side of this boundary. `app/src/oidcVerify.ts` verifies tokens against GitHub's own public JWKS (`https://token.actions.githubusercontent.com/.well-known/jwks`) — a well-known, publicly-fetchable endpoint, not a per-App or per-customer secret exchange. Every customer's `fixprove-check.yml` workflow requests its own token (scoped to its own repository, via the `id-token: write` permission already in the template) without either party provisioning anything in advance. This is the entire point of using OIDC instead of a shared secret here: **the human-configuration burden for authenticating each customer's callback is zero**, by construction, not by omission.

### B4. Install the App on a real test repository — **HUMAN**

Install the App on one real (ideally private, low-stakes) repository Yehor controls, and add `.github/workflows/fixprove-check.yml` (from `app/templates/fixprove-check.yml`) to that repository.

### B5. Live seeded-PR test — **HUMAN drives, AUTOMATED underneath**

Open a real pull request against the test repository containing one deliberately hallucinated symbol (e.g. a call to a method that does not exist on an installed dependency). Confirm, in GitHub's own PR UI:

1. A "FixProve" check appears as `in_progress` shortly after the PR opens (proves A1–A4 + B1–B2 end-to-end).
2. The check completes as **failing**, naming the seeded symbol, file, and line (proves the full webhook → Action → OIDC callback → Checks-API-complete round trip, live, for the first time — this is the exact gap named as a "required next step" in both `KS-REPORT-2.1-github-app.md` and `KS-REPORT-2.2-kv-worker.md`).
3. Push a fix commit to the same PR; confirm the check re-runs and turns green.
4. Open a second PR with **no code changes relevant to any tracked dependency** (the "adversarial: clean PR" case named in Session 2.1's original contract); confirm it produces a clean pass, not an error or a stuck `in_progress` state.

This is the single step in this entire runbook that upgrades FixProve's own status from "logic-verified" to "live-verified" — nothing before it can substitute for it, and nothing after it should be treated as launch-ready until it has actually been run.

---

## Part C — PyPI / npm release (cross-reference, not new work)

Already fully specified in Session 3.1's own deliverable (`.github/workflows/release.yml`) and its Keystone Report's Known Limitations. Restated here only to keep this runbook complete as a single launch checklist:

1. **HUMAN:** configure PyPI Trusted Publishing once (pypi.org → `fixprove` project → Publishing → Add a new publisher → point at this repo, `release.yml`, environment `pypi`).
2. **HUMAN:** set an `NPM_TOKEN` repository secret with publish rights to the `fixprove` npm package.
3. **HUMAN:** push a `v0.1.0` tag.
4. **AUTOMATED:** everything from there — test gate, artifact-content verification, both publishes — runs unattended per `release.yml`.

---

## Boundary Summary (the literal adversarial-verify deliverable)

| Step | Owner | Why it cannot be automated |
|---|---|---|
| A1 — create KV namespace | HUMAN | requires `CLOUDFLARE_API_TOKEN` / interactive `wrangler login` |
| A2 — add custom domain route | HUMAN | Cloudflare dashboard action tied to the account's zone for `fixprove.dev` |
| A3 — set 3 Worker secrets | HUMAN | secret values must never pass through an AI session; `wrangler secret put` is deliberately interactive |
| A4 — `wrangler deploy` | HUMAN-triggered | same `CLOUDFLARE_API_TOKEN` requirement as A1 |
| A5 — smoke test | AUTOMATED | read-only `curl`, no credentials needed, safe to re-run |
| B1 — register GitHub App | HUMAN | App registration is an irreversible-ish, account-bound GitHub dashboard action |
| B2 — generate private key | HUMAN | GitHub shows the `.pem` exactly once; cannot be scripted or retrieved later |
| B3 — OIDC trust | **N/A by design** | GitHub's JWKS is public; no per-party configuration exists to do |
| B4 — install App on test repo | HUMAN | authorizing an App installation is an explicit GitHub account-owner action |
| B5 — live seeded-PR test | HUMAN-driven | the whole point is a human confirming real GitHub UI behavior with their own eyes |
| C1–C3 — PyPI/npm publishing setup | HUMAN | Trusted Publisher config and `NPM_TOKEN` are one-time, credential-bearing dashboard/secret actions |
| C4 — the release pipeline itself | AUTOMATED | already built and locally verified in Session 3.1 |

No step above is ambiguous about which side of the line it's on. Where a step has both a human trigger and an automated payload (A4, B5, C4), both halves are named separately rather than collapsed into one row — this is the specific adversarial-verify requirement this session's contract named.

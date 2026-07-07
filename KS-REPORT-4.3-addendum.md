# KS-REPORT-4.3 — Addendum: B4/B5 Live Execution (autonomous-core, Python)

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode
**Scope:** This addendum covers the live B4/B5 execution phase against `yehorcallmedai-maker/autonomous-core` — everything found *after* the template fixes already documented in the main `KS-REPORT-4.3-template-fix-and-b4b5-prep.md` (Defects #1–#3) and its first Addendum (Defect #3's discovery). Four further real defects were found and fixed this phase, entirely on live infrastructure (GitHub App, Cloudflare Worker, a real seeded PR). Nothing here was caught in a local sandbox — all four were found by executing the actual pipeline end-to-end and refusing to accept "it should work" at each stage.

---

## 1. Provenance

All code changes in this phase (worker error-logging fix, callback error-logging fix, pending-store correlation-key redesign, and the corresponding test updates) were AI-generated, then reviewed and approved by Yehor before each commit. All git commits, `wrangler deploy` invocations, private-key generation/conversion, and GitHub UI actions (redeliver, re-run jobs) were executed by Yehor from his own machine, per standing policy that live-infrastructure mutations are a human action. All diagnostic reasoning (root-cause hypotheses, proposed fixes) was AI-proposed and Yehor-approved before implementation, per the architectural sign-off standing rule.

## 2. Verification summary

- **Automated tests:** 66/66 passing after the correlation-key fix (50 in `@fixprove/github-app`, 16 in `@fixprove/worker`), run via `pnpm --filter <pkg> build && pnpm --filter <pkg> test` on Yehor's machine (this session's sandbox could not compile TypeScript — a broken pnpm symlink on the bridged mount, unrelated to the product).
- **New adversarial test added:** `callbackHandler.test.ts` — an OIDC token with a non-pull_request `ref` (e.g. a push-triggered run's `refs/heads/main`) must fail closed with 404, never silently match an unrelated PR's pending Check Run. This is a direct regression test for Defect #7 below.
- **Live verification:** the full pipeline was exercised against a real GitHub App, a real Cloudflare Worker (`fixprove-github-app`, `api.fixprove.dev`), a real private key, and a real seeded PR (`yehorcallmedai-maker/autonomous-core#3`) — not a simulated environment. Final state: **`FixProve` Check Run `85681629928` completed with conclusion `failure` in 22s**, correctly naming the single seeded hallucination (`openai.does_not_exist_on_openai`, `fixprove_seed_test.py:10`) and correctly leaving the valid `openai.OpenAI().chat.completions.create(...)` usage in the same file unflagged.
- **Tools used:** `wrangler tail` (live log streaming), GitHub's own Recent Deliveries / Redeliver UI (request+response inspection), GitHub Actions job logs, direct code reading of `@octokit/webhooks`/`@octokit/app`/`universal-github-app-jwt` behavior to ground each hypothesis before proposing a fix.

## 3. Defects caught and fixed (specific, not summarized)

### Defect #4 — Worker's global error boundary never logged the exception it caught

**Symptom:** The `pull_request` webhook returned a deterministic `500 {"ok":false,"error":"internal error"}` on every delivery. Two separate redeliveries of the byte-identical payload produced the byte-identical response, ruling out a transient network blip.

**Root cause:** `worker/src/index.ts`'s `app.onError` handler correctly classified and formatted an error response for the caller (GitHub), but never called `console.error` (or any logging) on the caught exception itself. `wrangler tail`, watched live across two redeliveries, showed only the one-line request summary (`POST .../webhooks - Ok`) with zero diagnostic detail — the Worker runtime's own "outcome: ok" (meaning "didn't crash/throw at the runtime level") was initially misread as if it meant "returned HTTP 200," which it does not. This false lead was caught and corrected before further wasted diagnostic cycles by checking GitHub's own Recent Deliveries record directly, which showed the true `500` response, byte-identical on both attempts.

**Fix:** Added `console.error("fixprove worker error:", err)` as the first line of `app.onError`, before classification. Diagnostic only, no behavior change to the response itself.

**Verified by:** redeploying and redelivering the same webhook while `wrangler tail` was connected; the real stack trace (`AggregateError: [universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported`) appeared for the first time, leading directly to Defect #5.

---

### Defect #5 — GitHub App private key stored in PKCS#1 format; only PKCS#8 is accepted

**Symptom:** Once Defect #4's logging was in place, the real exception was: `AggregateError: [universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported.`

**Root cause:** GitHub's "Generate a private key" button on the App settings page downloads a key in PKCS#1 format (`-----BEGIN RSA PRIVATE KEY-----`) by default. `@octokit/app`'s JWT-signing dependency (`universal-github-app-jwt`) only accepts PKCS#8 (`-----BEGIN PRIVATE KEY-----`). Every webhook requiring App-level JWT signing (i.e. every `pull_request` event needing to create a Check Run) failed identically and deterministically at the authentication step, before ever reaching the Checks API call or the KV store. This also explains why the Checks tab on the seeded PR showed only the Actions workflow's own status (`FixProve Check`) and never a separate App-created `FixProve` Check Run — the App had never successfully authenticated to create one.

**Fix (operational, not code):** Generated a new private key from the App's settings page, converted it locally from PKCS#1 to PKCS#8 via Node's `crypto.createPrivateKey(...).export({type:"pkcs8", format:"pem"})`, and re-set the Worker secret via `wrangler secret put GITHUB_APP_PRIVATE_KEY`. Per `wrangler.toml`'s own existing documentation, this secret was always meant to be set this way and never committed to source — no code change was needed or made.

**Complication encountered and corrected:** The first two attempts to convert and upload the key failed silently — `wrangler secret put` reported `✨ Success!` even when its stdin pipe received nothing (an empty string), because an upstream `Get-Content` had already failed (once due to an unresolved placeholder path, once due to a Node `-e` scripting bug of the AI's own making — see below). Both silent-failure uploads were caught before being trusted, by requiring an explicit non-empty file-size/header check (`Get-Item ... | Select-Object Length`, plus reading the first/last lines to confirm `-----BEGIN/END PRIVATE KEY-----`) before the secret was ever re-uploaded a third time, which succeeded and was verified correct.

**AI-caused defects during this fix, logged for completeness:** (1) a JavaScript string-escaping bug — embedding a Windows path directly inside a single-quoted JS string passed to `node -e` caused `\f` (as in `D:\fixprove...`) to be interpreted as a form-feed escape sequence, silently corrupting the path; (2) a `node -e` argv-indexing bug — extra CLI arguments after an eval string start at `process.argv[1]`, not `[2]`, causing the input/output paths to be swapped. Both were caught by adding explicit `console.log` of the resolved paths before file operations, rather than trusting the first attempt.

**Verified by:** a subsequent webhook redelivery created a real, visible `FixProve` Check Run (distinct from `FixProve Check`) on the PR for the first time, status `in_progress`, with a real `check_run_id`.

---

### Defect #6 — `/callback` endpoint's classified rejections were also unlogged

**Symptom:** After Defect #5's fix, a fresh Actions run (triggered by a `synchronize` commit) still failed at its final "Report findings to FixProve" step with `curl` exit code 22 (an HTTP error response), but `wrangler tail` showed no `fixprove worker error:` line this time.

**Root cause:** `callbackHandler.ts`'s `handleCallback` returns classified rejections (missing token → 401, malformed findings → 400, OIDC verification failure → 401, no matching pending check run → 404) as ordinary return values, not thrown exceptions — so Defect #4's `app.onError` logging fix, which only fires on a caught throw, never saw them. This is architecturally correct (a classified rejection is not a crash), but left this endpoint just as undiagnosable as the webhook endpoint had been.

**Fix:** Added a single diagnostic line in the Worker's `/callback` route — `if (!result.ok) console.error("fixprove callback rejected:", result.status, result.error)` — logging the classified result without changing `handleCallback`'s pure, already-tested logic at all.

**Verified by:** re-running the failed Actions job (same commit, no new push needed) while `wrangler tail` was connected produced `fixprove callback rejected: 404 no pending check run for this repository/sha`, leading directly to Defect #7 — the actual, deepest root cause.

---

### Defect #7 — Pending Check Run correlation key mismatch: OIDC `sha` claim vs. real PR head sha

**Symptom:** `404 no pending check run for this repository/sha`, despite the corresponding webhook having successfully created a pending entry moments earlier (confirmed via Defect #5's fix and a visible in-progress Check Run).

**Root cause:** GitHub's Actions OIDC token embeds a `sha` claim equal to `github.sha`. For the `pull_request` event family specifically, `github.sha` is the *ephemeral merge commit* (`refs/pull/<n>/merge`), never the actual PR head commit. The webhook handler correctly stores the pending Check Run keyed by `payload.pull_request.head.sha` (the real head sha — also correctly used as the Check Run's own `head_sha`, which is right and unrelated to this bug). The callback handler, however, looked up that pending entry using `claims.sha` — the merge-commit sha — which can never equal the real head sha. Every callback for every `pull_request`-triggered run was therefore guaranteed to 404, independent of and masked underneath Defect #5 (which prevented the pending entry from ever being created at all, so this second bug had no chance to surface until Defect #5 was fixed).

**Architectural discussion held before fixing (Yehor's explicit sign-off, this session):** the fix must not weaken the existing security boundary that the pending-check lookup key come from cryptographically *verified* token claims, never client-supplied body fields (established in Session 2.1, `S2.1-CALLBACK-REPO-TRUST`). Yehor separately asked whether the fix should anticipate future `push`-event support. Verified by grep (not assumption) that neither the App nor the workflow template currently handles `push` events at all — confirmed via `app/src` (no `push` listener registered) and the template's `on:` block (pull_request only). Agreed middle path: key the pending store by a **tagged** `(owner, repo, kind, correlationId)` rather than a bare correlation value, so a future `kind: "push"` entry (correlating by the OIDC `sha` claim, which *is* reliable for `push`-triggered runs, since no merge-commit indirection exists there) can be added later without a second storage-shape migration. `push` support itself is explicitly **not implemented** by this fix.

**Fix:**
- `pendingStore.ts` / `kvPendingStore.ts`: `PendingCheckRun` now carries `kind: "pr" | "push"` and `correlationId: string`; `headSha` retained as descriptive data only, no longer part of the lookup key. Key format changed from `owner/repo@sha` to `owner/repo#kind:correlationId`.
- `webhookHandler.ts`: `PullRequestEventPayload` gained a `number` field (the PR number, always present on a real `pull_request` webhook payload); the pending entry is stored with `kind: "pr", correlationId: String(prNumber)`.
- `callbackHandler.ts`: new `extractPullRequestNumberFromRef()` parses the PR number from the OIDC token's *verified* `ref` claim (`refs/pull/<n>/merge`) — still a cryptographically verified claim, never client input, preserving the exact trust boundary. A `ref` that doesn't match this shape (e.g. a `push` event's `refs/heads/main`) fails closed with 404 rather than guessing at a fallback.
- Six test files updated to match (`pendingStore.test.ts`, `webhookHandler.test.ts`, `callbackHandler.test.ts`, `kvPendingStore.test.ts`, `worker.test.ts`, `index.test.ts`), plus one new adversarial test (Section 2, above) locking in the exact regression this defect represents.

**Verified by:** pushing a fresh `synchronize` commit (`5c6aa82`) after deploying the fix produced a complete, correct, clean round trip for the first time in this project's history — webhook → pending Check Run (new key scheme) → Actions run → detection → callback → correct PR-number correlation → `FixProve` Check Run completed with conclusion `failure`, correctly naming the single seeded hallucination and correctly leaving valid code unflagged.

## 4. Known limitations (stated plainly)

1. `push`-event correlation is not implemented. The `kind` tag exists specifically so it can be added later without another storage migration, but no `push`-triggered workflow will create or complete a Check Run today.
2. This entire defect chain (#4–#7) existed, live, in production-facing infrastructure since Session 2.1/2.2 — B4/B5 is the first time any of it was actually exercised end-to-end against a real GitHub App installation. No `pull_request`-triggered Check Run had ever successfully completed before this session.
3. The two silent-failure `wrangler secret put` uploads (Defect #5) are a sharp edge worth carrying forward: a failed upstream pipe still results in `wrangler secret put` reporting success while uploading an empty string. No code change was made to `wrangler` itself (out of scope — it is Cloudflare's own CLI); the mitigation applied here was procedural (verify file contents before every upload), not structural.
4. `yehor.ai` (the TypeScript/MDX repo) has not yet been exercised at all under this fixed pipeline. Given four real defects surfaced on the Python side, the TS/JS path should be assumed untested until its own B5 run completes — no defect found here is assumed to generalize without independent verification.
5. `npx wrangler` is still on 3.114.17 (a v4 upgrade is available and was declined mid-session to avoid introducing an unrelated variable during active debugging). Should be revisited separately.

## 5. Accountability statement

Reviewed and approved by: Yehor Kaliberda

Date: 07.07.26

## 6. Methodology note — one suggested improvement to the process itself

This phase's diagnostic path (Defect #4 → #5 → #6 → #7) only worked because each fix was scoped to *restoring observability*, not guessing at root cause — twice (webhook and callback endpoints both had silent classified-failure paths). A durable process improvement worth adopting project-wide: any new Worker route or error boundary should ship with failure-path logging from the start, as a checklist item alongside its own tests, rather than being added reactively only after a live incident forces the question. The cost of that logging is trivial; the cost of its absence, this session, was four separate live-debugging cycles across roughly three hours.

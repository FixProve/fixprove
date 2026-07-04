# Keystone Report — Session 2.1: GitHub App (Milestone 2, first component)

**Project:** FixProve — Milestone 2 (Distribution Surface)
**Session:** 2.1 — GitHub App: webhook intake, Checks API, OIDC-authenticated callback
**Director:** Yehor
**Date:** 2026-07-04

---

## 1. Provenance

100% of the code in this delivery was AI-generated (Claude, Sonnet 5) in this session. No human edits have been applied yet. Every non-trivial block carries a `#KS-TRACE` tag.

**Locked architectural decision (Yehor, Session 2.1 Stage 1, via explicit choice):** execution model is **GitHub Actions orchestration**, not server-side fetch-and-scan. The App's own backend (this package) only ever does two things: (a) receive `pull_request` webhooks and open a Check Run, and (b) receive an authenticated callback carrying findings JSON and complete that Check Run. It never clones, fetches, or reads customer source code. The customer's own repository runs a FixProve-published GitHub Actions workflow (`templates/fixprove-check.yml`) that checks out code and runs `fixprove check` **on GitHub's own runner**, then POSTs only the findings JSON back here — authenticated via a GitHub Actions OIDC token (`id-token: write` + `core.getIDToken(audience)`), not a shared secret. This is the only design that makes "source never leaves the runner" (the master build plan's own stated enterprise-trust differentiator) literally, verifiably true rather than a marketing claim resting on a promise not to look at the data.

**Locked verification-scope decision (Yehor, Session 2.1 Stage 1, via explicit choice):** this session is **build + logic-verify only**. No live GitHub App registration, no real installation credentials, no real seeded pull request. All adversarial verification below uses locally-generated test material: a self-signed test RSA keypair/JWKS for OIDC tokens (via `jose`, never GitHub's real token issuer or JWKS endpoint), and fake in-memory `ChecksClient`/Octokit-shaped objects for the Checks API. **This is explicitly labeled "logic-verified, not live-verified" throughout this report — it must not be read or cited as full end-to-end verification.**

Files delivered to `app/`:

- `src/findings.ts` (103 lines) — `Finding`/`FindingReason` types kept byte-identical in shape to the Python engine's shared `finding.py` schema (`{file, line, kind, expression, reason}`), so the callback payload from the customer's Action requires zero reshaping. `buildCheckSummary()` turns `Finding[]` into a Checks API summary (conclusion, title, markdown body naming every symbol+file+line, per-finding annotations).
- `src/checkRun.ts` (144 lines) — `createPendingCheckRun` / `completeCheckRun` against a minimal `ChecksClient` interface, decoupled from any specific Octokit shape so it stays directly unit-testable. Batches annotations into ≤50-per-request chunks (GitHub's real API limit), only the final batch carries `status: "completed"` + the conclusion. `octokitToChecksClient()` adapts a real Octokit instance to this interface — see Section 3 for why this adapter's shape changed mid-session.
- `src/oidcVerify.ts` (109 lines) — `verifyGithubActionsOidcToken()` validates a GitHub Actions OIDC token's signature (via a `JWTVerifyGetKey` resolver — `createRemoteJWKSet` in production, a local test JWKS in tests), issuer, audience, and required claims (`repository`, `run_id`, `sha`, `ref`). `expectedRepository` is an optional check; when provided it's enforced against the verified claim, but the real authorization boundary is the pending-check-run store lookup in `callbackHandler.ts` (see the `S2.1-CALLBACK-REPO-TRUST` trace comment there for why that's sufficient without a redundant tautological check).
- `src/pendingStore.ts` (57 lines) — `InMemoryPendingCheckRunStore`: `(owner, repo, sha) -> {checkRunId, installationId}`, case-insensitive owner/repo keys. **In-memory only** — see Known Limitations.
- `src/webhookHandler.ts` (119 lines) — `handlePullRequestEvent()` (pure logic: which actions are relevant, derive owner/repo/sha, create+store a pending check run) plus `handleWebhookDelivery()` (HMAC signature verification and dispatch via `@octokit/webhooks`' real `verifyAndReceive`, tested with real crypto — no reason to fake pure signature math).
- `src/callbackHandler.ts` (131 lines) — `validateFindings()` (rejects anything not shaped like `Finding[]`) and `handleCallback()`: verifies the OIDC token, derives the target repo/sha from the **verified token claims only** (never from client-supplied body fields), looks up the matching pending check run, completes it, and deletes the pending entry.
- `src/index.ts` (62 lines) — `createFixProveApp()` wires all of the above around a real `@octokit/app` `App` instance and a real `createRemoteJWKSet` pointed at GitHub's actual JWKS endpoint (used only in production; tests call the lower-level functions directly with a local JWKS instead).
- `templates/fixprove-check.yml` (78 lines) — the distributable GitHub Actions workflow customers add to their own repo: checkout → run `fixprove check --json` → request an OIDC token scoped to `https://fixprove.dev/callback` → POST findings + token to `https://api.fixprove.dev/callback`.
- `test/*.test.ts` (7 files, 45 tests) — see Section 2.

## 2. Verification Summary

| Check | Result |
|---|---|
| Unit + adversarial tests (Node's built-in test runner) | **45/45 passed** |
| `tsc --noEmit` (whole module graph, strict mode) | **0 errors** |
| `npm audit` | **0 vulnerabilities** (31 packages) |
| Re-verification against the actually-delivered mount path (not just the `/tmp` scratch build) | **Passed** — see Section 5 |
| Live GitHub App registration / real installation token exchange | **Not performed this session — explicitly out of scope, see Known Limitations** |
| Live seeded PR against a real repository | **Not performed this session — explicitly out of scope, see Known Limitations** |

Coverage by acceptance criterion (from the Session 2.1 opening prompt):

- *"On a seeded PR with a hallucinated symbol, the App posts a FAILING check naming the symbol + file + line."* — **Logic-verified**: `checkRun.test.ts` ("completeCheckRun with findings produces a failing update naming symbol+file+line") and `callbackHandler.test.ts` ("valid callback with seeded findings completes the check run as a failure naming the symbol") both assert the exact symbol/file/line string appears in the Checks API output. Not yet confirmed against GitHub's real UI rendering.
- *"Source code never leaves the runner; only findings metadata is transmitted."* — Architecturally enforced by design (App backend has no code path that reads repository contents at all — grep-verifiable: nothing in `src/` calls any content/contents/git-data API). Not independently verified via network capture against a real deployment.
- *"Webhook signatures validated; malformed payloads rejected."* — **Logic-verified** with real `@octokit/webhooks` HMAC crypto (no fakery needed — pure math, no network): valid signature accepted, invalid signature rejected (400), missing signature rejected (401), malformed JSON body rejected (400). Callback-side malformed findings also rejected (400), independent of and prior to OIDC checking.
- *"Adversarial: a PR with no code changes must produce a clean PASS, not an error."* — **Logic-verified** at both layers: webhook-creation treats every PR identically regardless of diff content (never inspects it), and `completeCheckRun([])`/`handleCallback(..., findings: [])` produce `conclusion: "success"` with zero annotations, not an error path.

## 3. Defects Caught and Fixed

**Defect S2.1-CHECKRUN-DEFECT-001 (two-part; the second part is the more serious one, caught by the type checker rather than a test):**

- *Part 1 (design review, before any test was written):* the original `ChecksClient` interface used flat `.create()`/`.update()` methods. I recognized this doesn't match how a real Octokit instance would plausibly expose the Checks API, and added an `octokitToChecksClient()` adapter assuming `octokit.rest.checks.create/update` (the `plugin-rest-endpoint-methods` shape).
- *Part 2 (caught by `tsc --noEmit`, not by inspection or a test):* that assumption was itself wrong. I verified directly against `node_modules/@octokit/app/package.json` and `node_modules/@octokit/core/package.json` — `@octokit/app`'s default `App` instance wraps plain `@octokit/core`, which pulls in **no** `plugin-rest-endpoint-methods` dependency. There is no `.rest` namespace on the actual type unless the App is explicitly constructed with a plugin-augmented Octokit class (this app is not). The moment I replaced the old unsafe `octokit as unknown as ChecksClient` casts in `webhookHandler.ts`/`callbackHandler.ts` with real calls to the adapter, `tsc` failed with `Property 'rest' is missing in type 'Octokit'`. Had the unsafe casts been left in place (as they were when the summary of prior work was written), this would have compiled cleanly and only broken at runtime against a real installation token — exactly the class of defect adversarial Verify exists to catch before production, and in this case caught by the type system before a single test ran against it.
  **Fix:** rewrote `OctokitChecksLike` and `octokitToChecksClient()` in `checkRun.ts` to use Octokit's generic `.request("POST /repos/{owner}/{repo}/check-runs", params)` / `.request("PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", params)` form, which is guaranteed present on any `@octokit/core` instance with no plugin dependency. `checkRun.test.ts` includes a dedicated regression test (`"octokitToChecksClient adapts a request()-only Octokit-shaped object, not .rest.checks"`) that explicitly asserts the fake test double has **no** `.rest` property, so a future regression back to the `.rest.checks` assumption would fail immediately rather than silently passing.

**Design smell self-corrected (not a defect that shipped, but worth recording):** the first draft of OIDC repository-claim verification made `expectedRepository` mandatory, which forced a confusing helper that decoded the JWT *without* verification just to extract the repository claim, then fed that same value back in as the "expected" value — a tautological check adding no real security. Refactored to make `expectedRepository` optional; the actual authorization boundary is the pending-check-run store lookup (a validly-signed token for repo A can only ever match a pending entry created for repo A's own sha). Documented via `S2.1-OIDC-OPTIONAL-REPO` and `S2.1-CALLBACK-REPO-TRUST` trace comments, and locked in by the adversarial test `"body has no way to override which repo's check run is targeted -- lookup uses only the verified token claim"`.

**Setup artifact caught during delivery re-verification (not a code defect):** the first re-verification attempt against the delivered mount path failed with `Cannot read file '/tmp/tsconfig.base.json'` — this was because the verification rsync copied only `app/` without its sibling `tsconfig.base.json` that the config `extends`. Not a defect in the delivered code; fixed by correcting the verification harness (copying the base tsconfig alongside), after which typecheck, build, and all 45 tests passed cleanly against the actual delivered files.

## 4. Known Limitations (stated plainly, nothing softened)

1. **Not live-verified.** No real GitHub App registration, no real installation-token exchange, no real seeded pull request against a real repository has been exercised. Everything in Section 2 is logic-verified against locally-generated OIDC tokens/JWKS and fake Checks-API clients. **Required next step before Milestone 2's exit gate can be considered met:** a live end-to-end test — register a real (test) GitHub App, install it on a real seeded repository, open a real PR with a real hallucinated symbol, and confirm the Check Run actually appears and completes correctly in GitHub's real UI, driven by a real GitHub Actions OIDC token from a real workflow run (not a self-signed one).
2. **`InMemoryPendingCheckRunStore` is in-memory only.** It does not survive a process restart and does not work across multiple concurrently-running backend instances. A real deployment needs a durable, multi-instance-safe store (Cloudflare KV is the natural fit given the existing `web/wrangler.toml` scaffold from Milestone 0). Flagged here deliberately, not silently assumed away.
3. **The CLI install step in `templates/fixprove-check.yml` is a placeholder.** It runs `pip install --break-system-packages -r requirements.txt` because the `fixprove` engine is not yet published to PyPI (that's Session 3.1 scope per the master build plan). Until then this template line must be manually swapped for a checkout-and-local-install of `engine/python`, or the workflow will not actually run the resolver.
4. **The workflow template's own failure-mode UX is unpolished.** If `fixprove check` crashes before writing `fixprove-findings.json`, or the callback `curl -f` call itself fails, the Action step fails (GitHub Actions runs with `-e` by default) and the job shows red — but the App-side Check Run is left stuck at `in_progress` rather than being explicitly marked as errored. This is a real gap in the customer-facing experience, not addressed this session; a robust fix needs either a `curl` failure branch that reports a distinct "FixProve internal error" conclusion, or a timeout-based reaper on the pending-store side.
5. **Annotation batching interacts with GitHub's real Checks API in a way not independently verified.** The 50-per-request batching logic is unit-tested against a fake client; the real Checks API's actual behavior when multiple sequential `update` calls each carry partial annotations (does it append, or does each call replace the annotation set?) has not been confirmed against GitHub's live API — this is called out specifically because it materially affects whether the "batches over 50" code path (item 5, `checkRun.test.ts`) does what its own passing test implies it does once it hits production.

## 5. Re-Verification Against Delivered Files

Per the standing mount-write-corruption operational rule (confirmed as such by Yehor's audit message this session), all files were developed in a `/tmp` scratch copy, then written to never-before-touched filenames on the `D:\Dev\Projects\FixProve\app` mount, SHA-256-verified byte-identical against the scratch originals, then moved into place over the old Session 0.2 scaffold files. `package.json` was updated in place (write-new-then-move) to add the `jose` dependency.

After delivery, the actually-delivered mount files (not the scratch copy) were rsynced to a fresh verification directory, `npm install` was run there for real, and `tsc --noEmit`, `tsc` build, and the full test suite were re-run directly against that install. Result: 0 typecheck errors, clean build, **45/45 tests passing** — confirming the delivered files are not just nominally present but functionally correct as delivered, not merely as authored.

## 6. Accountability Statement

I, **Yehor**, confirm that this Keystone Report accurately reflects the state of Session 2.1's deliverable, that its "logic-verified, not live-verified" labeling is accepted as accurate and not overclaimed, and that I take responsibility for the decision to proceed to live end-to-end verification (or not) based on this record.

Signature: Yehor Kaliberda
Date: 04.07.26

*(Per standing Keystone rule: this signature is Yehor's own required human action. It has not been and will not be fabricated on his behalf.)*

## 7. Methodology Note (one suggested improvement to the process itself)

This session's most instructive moment was that the type checker — not a test — caught the more serious of the two `ChecksClient` shape defects, and only because the unsafe `octokit as unknown as X` casts were removed first. That ordering was incidental this time. A process improvement: whenever a module introduces an `as unknown as T` cast bridging an external library's real type to an internal interface, treat that cast itself as an open defect-in-waiting and schedule its removal (replacing it with a real adapter validated by `tsc`) as an explicit Stage 2 task *before* Stage 3 Verify begins — rather than, as happened here, only removing it as a side effect of an unrelated design-review pass. Making "no remaining unsafe casts" a hard Stage-2-exit gate (checked via a simple `grep -rn "as unknown as"` sweep) would have caught this defect one step earlier, and would generalize to catch the same class of error in any future session touching an external SDK's actual (as opposed to assumed) type shape.

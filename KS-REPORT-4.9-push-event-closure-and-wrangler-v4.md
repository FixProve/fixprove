# Keystone Report — Session 4.9: Push-Event Correlation Closed (Blocked-by-Design), wrangler v3 → v4 Upgrade

## 1. Executive Summary

Session 4.9 opened against two candidate carried-forward items. Item #3
("Worker `push`-event Check Run correlation is not implemented," open
since Session 4.3) was investigated first per Stage 1 INTAKE and found to
be **not a code gap but a permission-model boundary**: the live FixProve
GitHub App has no `push` event available to subscribe to at all, because
GitHub only offers `push` to Apps holding at least read-level "Contents"
repository permission, and this App's Contents permission is deliberately
set to "No access" (a documented Session-2.1-era security decision, not
an oversight). Yehor was shown the live evidence and explicitly declined
to reopen that boundary. Item #3 is now **closed as permanently
blocked-by-design**, not merely unbuilt.

Session 4.9 then executed item #5: upgrading `wrangler` from the v3 line
(`^3.80.0`, resolving to `3.114.17`) to v4 (`4.111.0`, current `latest`)
in both `worker/` and `web/`. A real, previously-unflagged defect was
found and fixed during verification (wrangler v4's peer dependency on
`@cloudflare/workers-types@^5.x`, not the `^4.x` line both workspaces
were still pinned to). Build, typecheck, and test all pass under v4
(50+16+8 tests, matching pre-upgrade counts), and a non-mutating
`wrangler deploy --dry-run` succeeded for both workspaces, fully offline,
confirming both `wrangler.toml` files parse correctly under v4 with no
config-syntax changes needed. **What this session did NOT and could NOT
verify: a real, authenticated `wrangler deploy` against the live
Cloudflare account, on Yehor's own machine.** That remains the single
open item — see §7.

## 2. Provenance — AI-Generated vs. Human-Edited

- AI-generated this session: the live GitHub App permissions
  investigation and its write-up; the wrangler v4 research (version
  numbers, breaking-changes list, verified live against npm's registry
  and Cloudflare's own migration guide, not from training data); the
  `worker/package.json`, `web/package.json`, and `pnpm-lock.yaml`
  version bumps; all verification (build/typecheck/test/dry-run); this
  report.
- Human-decided (Yehor): declined to grant Contents:Read to unlock
  `push` events (closing item #3); selected the wrangler v4 upgrade as
  this session's second work item; approved proceeding with in-sandbox
  scope, explicitly deferring live-deploy verification to his own
  machine.
- Human-required next: the live `wrangler deploy` verification itself
  (§7) — this is a live/irreversible action gated to Yehor per this
  project's standing operating rules, not something the AI can execute
  regardless of authorization.

## 3. Verification Chain

**Push-event closure (no code changed, verification = live-state
confirmation):**
- Navigated to `github.com/settings/apps/fixprove/permissions` directly
  (not inferred from repo state) — Yehor completed the sudo-mode 2FA
  challenge himself; the AI does not and cannot complete 2FA.
- Screenshot evidence: the "Subscribe to events" list has no `push`
  entry at all (only Pull request is checked). Cross-referenced against
  `RUNBOOK-LIVE-DEPLOYMENT.md`'s B1 registration table, which records
  Contents permission as deliberately "No access."
- Cross-referenced against a live fetch of GitHub's own webhook-events
  documentation confirming `push` requires read-level Contents access —
  consistent, not contradicted, by the live screenshot.

**wrangler v4 upgrade:**
- Version numbers pulled live from `npm view wrangler dist-tags` and
  `npm view @cloudflare/workers-types dist-tags` against the real
  registry — `wrangler@4.111.0` (`latest`), `@cloudflare/workers-types@5.20260715.1`
  (`latest`) — not assumed from training data (my reliable cutoff is
  May 2025; wrangler v4 GA'd 2025-03-13, well after).
- All edits made in a scratch copy (`/tmp/fixprove-scratch`, rsync'd
  excluding build output/`node_modules`) per this project's known mount
  write-quirk workaround, `pnpm install` run there via
  `npx pnpm@9.12.0` (global pnpm install itself fails with `EPERM` on
  this sandbox).
- `pnpm build` — 4/4 packages succeed (`@fixprove/github-app`,
  `@fixprove/web`, `@fixprove/worker`, `fixprove` CLI).
- `pnpm typecheck` — 5/5 tasks succeed, including `web`'s three-tsconfig
  chain (`tsconfig.json`, `tsconfig.functions.json`,
  `tsconfig.worker.json`) — the last of which directly exercises
  `@cloudflare/workers-types`, so a types-major-version regression would
  have surfaced here. It did not.
- `pnpm test` — `@fixprove/github-app`: 50/50 pass. `@fixprove/worker`:
  16/16 pass. `@fixprove/web`: 8/8 pass. Counts match pre-upgrade
  baseline (Session 2.2's report: 48+16; the app-level count of 50
  reflects tests added in later sessions, e.g. Session 4.3's
  correlation-fix tests — not a regression, a cumulative total).
- `npx wrangler --version` — confirmed `4.111.0` in both `worker/` and
  `web/` independently.
- `wrangler deploy --dry-run` — ran successfully in both workspaces,
  **fully offline** (this sandbox has no route to Cloudflare's API at
  all per `feedback_cloudflare_sandbox_network`; a dry-run that reached
  the network would have hung or errored, not exited cleanly in
  under a second). Output confirms: `worker/wrangler.toml`'s KV
  binding (`PENDING_CHECKS_KV`) and `CALLBACK_AUDIENCE` var resolve
  correctly; `web/wrangler.toml`'s KV binding (`WAITLIST_KV`), Assets
  binding, and the 27-file static asset directory all resolve
  correctly. No config-syntax changes were needed in either
  `wrangler.toml` — consistent with Cloudflare's own migration guide,
  which lists no breaking changes to `[[kv_namespaces]]`, `[assets]`,
  or `routes`/`custom_domain` syntax between v3 and v4.
- Grepped the actual codebase (not assumed) against every other v4
  breaking change: no `usage_model`, no `legacy_assets`, no
  `node_compat` flag (already on `nodejs_compat`), no `wrangler publish`
  (both scripts already say `wrangler deploy`), no dynamic wildcard
  `import()` calls in `worker/src` or `app/src` (the esbuild 0.24
  bundle-inflation risk is not applicable), and the only `wrangler kv`
  usage anywhere in the repo/docs is `wrangler kv namespace create`
  (unaffected by v4's local-by-default inversion, which applies to
  `kv key`/`kv bulk`/`r2 object` — none of which this project uses).
- Copied the three real changed files (`worker/package.json`,
  `web/package.json`, `pnpm-lock.yaml`) back to the live mount via the
  write-to-new-name-then-`mv` workaround, then independently
  re-verified via the `Read` tool (Windows side, a separate code path
  from the bash write) — both `package.json` files show the correct
  final versions.
- `git status` on the real mount showed 17 modified files, not 3.
  Adversarially checked with `git diff -w --stat` (ignore whitespace):
  14 of those files' diffs vanish entirely under `-w` — pure pre-existing
  CRLF/LF line-ending noise unrelated to this session, confirmed not to
  originate from anything this session touched. Only
  `worker/package.json`, `web/package.json`, and `pnpm-lock.yaml`
  survive `-w` with real content diffs. This is documented so the git
  commit handed to Yehor in §7 stages only the 3 real files, not all 17.

## 4. Defects Caught and Fixed

**Defect: `@cloudflare/workers-types` peer-dependency mismatch under
wrangler v4.** My own Stage 1 contract stated workers-types was
"unaffected by wrangler's major version" — that assumption was wrong,
caught by `pnpm install`'s own peer-dependency warning immediately after
the wrangler bump: `wrangler 4.111.0` peer-requires
`@cloudflare/workers-types@^5.20260710.1`; both workspaces were still
resolving to the `^4.x` line (`4.20260701.1` at install time, since the
existing `^4.20241004.0` range in `package.json` was broad enough to
silently drift forward on its own). Fixed by bumping both `package.json`
files' `@cloudflare/workers-types` pin to `^5.20260715.1` (the real
current `latest` at verification time) and re-running install — the peer
warning cleared, and the full typecheck suite (including `web`'s
worker-specific `tsconfig.worker.json`, which directly exercises these
ambient types) still passes clean. This is exactly the class of defect
Stage 3 exists to catch: a stated assumption, tested rather than trusted,
found wrong, and fixed before being handed to Yehor as "done."

No other defects found this session — the wrangler v4 upgrade itself
required no code or config changes beyond the two dependency version
bumps.

## 5. Architectural Decisions (Yehor-Approved)

1. **Push-event Check Run correlation: closed as permanently
   blocked-by-design.** Yehor explicitly declined to grant the App
   Contents:Read to unlock the `push` webhook event, reaffirming the
   original zero-trust posture. Recorded in project memory
   (`project_fixprove_push_event_blocked`) so no future session proposes
   reopening this without Yehor revisiting the permission question
   himself.
2. **wrangler v4 upgrade scope: in-sandbox verification only, live-deploy
   proof deferred to Yehor's machine.** Confirmed explicitly rather than
   assumed, since this sandbox cannot reach Cloudflare's API and this
   project's standing rules require live/irreversible actions to be
   Yehor's own.
3. **`@cloudflare/workers-types` bumped to the v5 line alongside
   wrangler**, expanding the original contract's stated scope
   ("workers-types left at current pin") after live testing proved that
   assumption wrong — logged here rather than silently done, per Stage 2's
   traceability requirement.

## 6. Known Limitations (Stated Honestly)

- **The live `wrangler deploy` path under v4 has zero real-world runs as
  of this report.** Everything in §3 proves the package resolves,
  builds, typechecks, tests, and dry-run-parses correctly under v4 — it
  does NOT prove the authenticated deploy path (OAuth/token auth against
  the real Cloudflare account, from Yehor's own Windows machine, which
  has a previously-logged history of wrangler auth issues) still works
  under v4. This is the same "proven with fallback present vs. proven
  for real" discipline this project applied to the npm OIDC migration in
  Session 4.8 — do not treat this upgrade as fully verified until §7's
  handoff is actually run and its output confirmed.
- **`web/wrangler.toml`'s custom domain / routes binding was not
  independently re-verified against the live Cloudflare account** — the
  dry-run only proves the config is syntactically valid, not that the
  live custom domain association still resolves correctly post-upgrade.
- **14 pre-existing CRLF/LF diffs remain in the working tree**, unrelated
  to this session, not fixed (out of scope — fixing them would touch 14
  files with no functional need to). Documented in
  `feedback_fixprove_mount_write_quirks` so the git commit in §7 does not
  accidentally sweep them in.
- Item #6 (untracked `logo/` directory) remains untouched, unchanged
  from prior sessions — still out of scope until Yehor asks.

## 7. Current Pipeline State

- `worker/package.json`, `web/package.json`: `wrangler` at `^4.111.0`,
  `@cloudflare/workers-types` at `^5.20260715.1`. Not yet committed.
- `pnpm-lock.yaml`: regenerated to match, present on the real mount, not
  yet committed.
- No production Cloudflare deployment has been touched. `api.fixprove.dev`
  (worker) and the `fixprove.dev` waitlist worker are both still running
  whatever was last deployed under wrangler v3 — this session changed
  local tooling only.

**Immediate next step (Yehor, on his own machine, one command at a
time):**

```
cd D:\Dev\Projects\FixProve
git diff -w --stat
```
Confirm only `worker/package.json`, `web/package.json`, and
`pnpm-lock.yaml` show real changes (everything else should be absent
from this filtered view — if something unexpected appears, stop and
flag it before continuing).

```
git add worker/package.json web/package.json pnpm-lock.yaml KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md KS-REPORT-4.9-addendum-close-verification.md session-logs/SESSION-LOG-2026-07-15-session-4.9-push-event-closure-and-wrangler-v4.md session-logs/SESSION-LOG-INDEX.md CLIENT-SUMMARY-4.9-push-event-closure-and-wrangler-v4.md NEXT-SESSION-4.10-STARTING-PROMPT.md
git commit -m "chore: upgrade wrangler v3 -> v4 (4.111.0), bump @cloudflare/workers-types to v5 line; close push-event correlation as blocked-by-design"
git push
```
(`logo/` stays untracked — unrelated, out of scope, leave it alone. If
`git add` fails with something like `Unable to create '.git/index.lock':
File exists`, delete `.git\index.lock` — and `.git\packed-refs.lock` if
present — manually first; they're safe to remove, git recreates them on
demand. See `KS-REPORT-4.9-addendum-close-verification.md` for why this
can happen on this repo.)

Then, to actually prove the live deploy path (the one thing this session
could not verify):
```
cd worker
npx wrangler deploy --dry-run
npx wrangler whoami
```
If `whoami` shows you're authenticated correctly, proceed with a real
`npx wrangler deploy` for `worker/` and separately `cd ../web && next build && npx wrangler deploy`
for `web/`. Report back the exact output (or exact error) of both —
per this project's standing rule, a green status alone is not
sufficient; I'll want to independently confirm against
`api.fixprove.dev`'s actual live behavior afterward the same way past
sessions verified PyPI/npm directly against the registry rather than
trusting CI alone.

## 8. Accountability Statement

This session's code changes (two `package.json` version bumps, one
regenerated lockfile) are narrow and low-risk, but the live-deploy proof
is still outstanding. I am not claiming the wrangler v4 upgrade is fully
verified — only that everything reachable from this sandbox has been
checked and passed. Final sign-off on this item rests with Yehor, pending
the live deploy confirmation above.

Signed: _______________________ (Yehor)
Date: _______________________

## 9. Methodology Note

One process improvement worth naming: this session's `git status` scare
(17 files "modified" when only 3 were touched) cost real verification
time before `git diff -w --stat` resolved it as pre-existing noise. A
standing pre-flight — run `git diff -w --stat` against `main` at the
**start** of every session, before any edits, and record the baseline —
would let future sessions immediately distinguish "pre-existing noise"
from "something I just broke" without re-deriving the diagnosis each
time. Worth adding to `session-strategy-synthesis`'s own start-of-session
checklist.

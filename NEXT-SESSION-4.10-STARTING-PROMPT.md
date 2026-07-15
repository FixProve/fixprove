# Starting Prompt — Session 4.10

Paste this at the start of the next FixProve session.

## Where things stand (as of Session 4.9 close, 2026-07-15)

Session 4.9 closed one long-open item and advanced another. Read
`session-logs/SESSION-LOG-INDEX.md` first, then
`session-logs/SESSION-LOG-2026-07-15-session-4.9-push-event-closure-and-wrangler-v4.md`,
`KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md`, and
`KS-REPORT-4.9-addendum-close-verification.md` in full before taking any
action — they contain the complete detail (the live GitHub App
permissions evidence, the exact defect found and fixed in the wrangler v4
bump, a hard-test re-verification pass that caught and fixed a stale
commit-hash drift and a live git-lock blocker, and the precise handoff
commands) and are the durable source of truth, not this summary. The
addendum in particular is worth reading even though it found no new
technical defects in the upgrade itself — it's the record of a real
close-out discipline: verify what the prior session's prompt claims
before repeating it, don't just trust it forward.

**Live state:**

- GitHub: `FixProve/fixprove` `main` at `64d4ba1` as of session close
  (verify with `git log -1 --oneline` before trusting this — Session
  4.9's own opening prompt claimed `c3a6832`, which was already one
  commit stale by the time the session started). Session 4.9's changes
  (`worker/package.json`, `web/package.json`, `pnpm-lock.yaml`, plus
  this doc set) are written to the local mount but **not yet committed
  or pushed**. Yehor needs to run the exact commands in
  `KS-REPORT-4.9-...`'s §7 first.
- GitHub App `fixprove`: Contents permission confirmed live as "No
  access"; `push` confirmed live as not offered as a subscribable event.
  This is now a closed, documented boundary — see
  `project_fixprove_push_event_blocked` memory. Do not propose
  implementing push-event Check Run correlation again without Yehor
  explicitly reopening the Contents-permission question himself.
- Cloudflare: both Workers (`fixprove-github-app` at `api.fixprove.dev`,
  and the `fixprove` waitlist worker at `fixprove.dev`) are still running
  whatever was deployed under wrangler v3. **Nothing has been redeployed
  this session** — only local tooling (`wrangler` devDependency) changed.
- `worker/package.json` / `web/package.json`: `wrangler` at `^4.111.0`,
  `@cloudflare/workers-types` at `^5.20260715.1`. Verified in-sandbox
  (build/typecheck/test/dry-run all clean) but **the real, authenticated
  `wrangler deploy` under v4 has zero live runs** — this sandbox cannot
  reach Cloudflare's API at all, so that proof can only happen on
  Yehor's own machine.
- 14 files in the working tree show as "modified" in a plain `git
  status` but are pure pre-existing CRLF/LF noise (confirmed via `git
  diff -w --stat`), unrelated to Session 4.9. Do not `git add -A` — stage
  only the 3 real files named above. See
  `feedback_fixprove_mount_write_quirks` memory for the full diagnostic.

**What's genuinely done this session:**

1. Live-investigated item #3 (push-event Check Run correlation) by
   navigating directly to the GitHub App's own settings page (Yehor
   completed the required 2FA himself) rather than assuming from repo
   state — found `push` isn't even offered as a subscribable webhook
   event today, because it requires Contents:Read and this App
   deliberately has Contents:No-access.
2. Yehor decided, with the tradeoff stated plainly, to keep the
   zero-trust posture rather than reopen it for push coverage. Item #3
   closed permanently, not just deferred.
3. wrangler upgraded `^3.80.0` → `^4.111.0` in both `worker/` and `web/`,
   researched live against npm's registry and Cloudflare's own migration
   guide (not training-data assumptions, since v4 GA'd after the AI's
   reliable knowledge cutoff).
4. One real defect found and fixed: `@cloudflare/workers-types` peer-
   dependency mismatch under wrangler v4 (needed the `^5.x` line, not
   `^4.x`) — caught by `pnpm install`'s own warning, not missed.
5. Full verification chain run and passed: `pnpm build`/`typecheck`/`test`
   (50+16+8 tests, matching pre-upgrade baseline), plus a fully-offline
   `wrangler deploy --dry-run` for both workspaces confirming zero
   config-syntax changes were needed.
6. Changes copied to the real mount and independently re-verified via
   the `Read` tool (a separate code path from the write) — no mount
   corruption this time.

## Progress checklist — open items carried forward (in priority order)

1. **NEW — highest priority: live-verify the wrangler v4 `deploy` path
   for real.** Yehor runs `KS-REPORT-4.9-...`'s §7 commands on his own
   machine: filtered `git diff -w --stat` check, commit + push the 3
   real files, then `npx wrangler whoami` and a real `wrangler deploy`
   for both `worker/` and `web/`. Report the exact output back (success
   or failure) — per this project's standing rule, do not treat a green
   status alone as proof; the next session should independently
   cross-check against the live Worker behavior the same way past
   sessions checked PyPI/npm directly against the registry rather than
   trusting CI's own report.
2. Passive, not actionable yet: verify the token-free `publish-npm`
   config (Session 4.8) on the next natural release, then revoke
   `NPM_TOKEN` and enable npm's "disallow tokens" setting. Unchanged —
   still rides passively until a real release tag is pushed for some
   other reason.
3. Defect B's two-hop disposition
   (`resend.emails.sendBulkWithRetry(...)`) — unchanged since Session
   4.5, still a deliberate, Yehor-approved documented limitation. Leave
   as-is or revisit with a dedicated design session.
4. `build_knowledge_base`'s cache (`corpus/.fixprove_cache/`) has no
   invalidation tied to actually-installed packages — unchanged since
   Session 4.6, local-dev risk only, needs its own cache-key design
   decision if pursued.
5. `v0.1.4.bak.1783353789` — the one remaining oddly-named leftover git
   tag from Session 4.7's cleanup. Harmless, optional cleanup only.
6. `autonomous-core`'s untracked-file pile from an independent process —
   explicitly out of scope per Yehor's prior direction.
7. The `NPM_TOKEN`'s ~90-day expiry (due ~2026-10-11) is not tracked
   anywhere durable outside npm's own UI. Becomes moot once item #2
   above completes.
8. An untracked `logo/` directory still exists in the working tree.
   Still not investigated, still out of scope until Yehor asks.

**Closed this session, no longer on this list:** Worker `push`-event
Check Run correlation — permanently blocked-by-design, see
`project_fixprove_push_event_blocked` memory. Do not re-add this to the
carried-forward list without Yehor explicitly reopening the Contents-
permission question.

## Operating notes for whoever (human or AI) picks this up

- `main` remains under a real, GitHub-enforced branch-protection gate.
  Every `git` write, npm/GitHub UI action, and settings change must
  still be handed to Yehor as exact, literal, copy-paste-ready commands
  or field-by-field instructions.
- Before staging anything for commit, run `git diff -w --stat` first and
  compare against the "pure noise" list in
  `feedback_fixprove_mount_write_quirks` — do not assume every file
  `git status` shows as modified was actually touched this session.
- The GitHub App's Contents permission and its `push`-event
  subscribability are now a closed, documented decision — verify against
  `project_fixprove_push_event_blocked` memory before ever proposing to
  revisit it.
- Never trust a green publish/deploy-job status alone — this project has
  now found real cases across multiple sessions (silent PyPI no-ops,
  misleading npm errors, a cosmetic-but-scary npm warning, and this
  session's discovery that a whole feature was blocked at the permission
  layer despite looking done at the code layer) where the obvious signal
  was misleading. Cross-check directly against the live system every
  time.
- This sandbox's mount has known git-lock, read/write staleness, and
  CRLF-noise issues (see `feedback_fixprove_mount_write_quirks`). Trust
  `Read`/`Grep` over `bash` immediately after an edit; if they disagree,
  use the write-to-new-file-then-`mv` workaround and re-verify via an
  independent method before handing anything to Yehor.
- `pnpm install` still fails with `EPERM`/`unlink` when run directly
  against the FixProve mount. Use a scratch directory (rsync excluding
  `node_modules`/build output/`corpus/.fixprove_cache/`) for any JS/TS
  build/test cycle — confirmed working again this session via
  `npx pnpm@9.12.0`.
- **Verify this prompt's own claims before repeating them.** This
  session's opening prompt claimed `main` was at `c3a6832`; live reality
  was already `64d4ba1` (benign, but uncaught for most of the session).
  Run `git log -1 --oneline` in your first few tool calls and compare
  against whatever this prompt says, every session, not just at close.
- **Check `.git/*.lock` before trusting any git output.** Every git
  command on this mount leaves an unremovable lock file behind; the next
  command fails outright until it's renamed away (`mv .git/index.lock
  .git/index.lock.<anything>` — rename works, delete doesn't). Do this
  check first, and do one final rename-away pass at the end of the
  session so the repo is left lock-free for Yehor's own machine.

## Immediate next action

Confirm with Yehor that he's run item #1's live-deploy verification
commands. If he has, read the actual output he reports (not just "it
worked") before marking the wrangler v4 upgrade closed. If he hasn't yet,
that's the single blocking action before anything else in this project
moves forward — do not start a new carried-forward item ahead of it
without his explicit go-ahead, the same discipline Session 4.8 applied to
the npm token-free config.

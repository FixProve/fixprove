# Starting Prompt — Session 4.10

Paste this at the start of the next FixProve session.

## Where things stand (as of Session 4.9 close, 2026-07-15)

Session 4.9 closed two long-open items outright and fully verified a
third live, not just in-sandbox. Read `session-logs/SESSION-LOG-INDEX.md`
first, then `session-logs/SESSION-LOG-2026-07-15-session-4.9-push-event-closure-and-wrangler-v4.md`,
`KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md`,
`KS-REPORT-4.9-addendum-close-verification.md`, and
`KS-REPORT-4.9-addendum-2-live-deploy-verified.md` in full before taking
any action — they contain the complete detail (the live GitHub App
permissions evidence, the exact defect found and fixed in the wrangler v4
bump, a hard-test re-verification pass that caught a stale commit-hash
drift and a live git-lock blocker, and the final live-deploy proof on
Yehor's own machine including a resolved false alarm about the web
worker's domain) and are the durable source of truth, not this summary.

**The wrangler v4 upgrade is now fully closed — not a carried-forward
item anymore.** Real `wrangler deploy` succeeded for both `worker/` and
`web/` on Yehor's own machine, and both `api.fixprove.dev` and
`fixprove.dev` were independently confirmed live and serving correctly
afterward. Along the way, a real gap was caught: the committed
`package.json` bump alone did nothing until `pnpm install` was actually
re-run on Yehor's machine — the first two verification attempts there
still reported wrangler 3.114.17. Don't assume a version bump in git is
a version bump on disk; always re-verify with `--version` after install.

**Live state:**

- GitHub: `FixProve/fixprove` `main` at `3152be8` (pushed and confirmed
  this session — verify with `git log -1 --oneline` before trusting this,
  same discipline as always). Note: this push bypassed the branch
  protection rule requiring a PR + 2 status checks (GitHub reported
  "Bypassed rule violations"), almost certainly because Yehor has
  admin/owner bypass rights on the ruleset. `ci.yml` also triggers on
  direct pushes to `main`, so it should still have run against
  `3152be8` — worth a quick look at the Actions tab to confirm it went
  green, since this specific commit didn't go through the usual
  PR-gated path prior sessions used.
- GitHub App `fixprove`: Contents permission confirmed live as "No
  access"; `push` confirmed live as not offered as a subscribable event.
  This is now a closed, documented boundary — see
  `project_fixprove_push_event_blocked` memory. Do not propose
  implementing push-event Check Run correlation again without Yehor
  explicitly reopening the Contents-permission question himself.
- Cloudflare: **both Workers are now live under wrangler v4, confirmed
  for real.** `fixprove-github-app` deployed (Version ID
  `3e5143ab-9cc0-4bb3-9ac8-4f14b15b3360`), `api.fixprove.dev` responds.
  `fixprove` (waitlist) deployed (Version ID
  `dec04361-d3d1-415b-9d3e-278bd2f66493`); its deploy output showed the
  default `*.workers.dev` URL rather than `fixprove.dev` — this looked
  like a possible regression but was checked live (via a browser fetch,
  since this sandbox cannot reach Cloudflare domains directly) and
  confirmed benign: `fixprove.dev`'s custom domain binding lives at the
  Cloudflare dashboard level, outside `wrangler.toml`, and survived the
  deploy untouched. Both domains are live and correct.
- `worker/package.json` / `web/package.json`: `wrangler` at `^4.111.0`,
  `@cloudflare/workers-types` at `^5.20260715.1` — committed, pushed,
  installed for real on Yehor's machine, and now proven live end-to-end.
- 14 files in the working tree showed as "modified" in a plain `git
  status` during this session but were pure pre-existing CRLF/LF noise
  (confirmed via `git diff -w --stat`), unrelated to Session 4.9 — none
  of them were staged or committed. See `feedback_fixprove_mount_write_quirks`
  memory for the full diagnostic if this resurfaces.

**What's genuinely done this session:**

1. Live-investigated item #3 (push-event Check Run correlation) by
   navigating directly to the GitHub App's own settings page (Yehor
   completed the required 2FA himself) rather than assuming from repo
   state — found `push` isn't even offered as a subscribable webhook
   event today, because it requires Contents:Read and this App
   deliberately has Contents:No-access. Yehor declined to reopen it —
   **closed permanently, not just deferred.**
2. wrangler upgraded `^3.80.0` → `^4.111.0` in both `worker/` and `web/`,
   researched live against npm's registry and Cloudflare's own migration
   guide (not training-data assumptions, since v4 GA'd after the AI's
   reliable knowledge cutoff). One real defect found and fixed along the
   way: `@cloudflare/workers-types` peer-dependency mismatch (needed the
   `^5.x` line, not `^4.x`) — caught by `pnpm install`'s own warning.
3. Full verification chain run three times independently (two sandbox
   scratch copies + Yehor's real machine) with byte-identical results:
   build, typecheck, tests (50+16+8), `wrangler deploy --dry-run`.
4. Committed and pushed for real (`3152be8`), then **deployed for real**
   on Yehor's own machine — `worker/` and `web/` both live under v4,
   both production domains independently confirmed serving correctly
   afterward. This is the part that could only happen outside the
   sandbox, and it happened.
5. A close-out hard-test pass caught and fixed two things before
   handoff: a stale commit-hash claim this session had itself propagated
   uncaught, and a live git lock blocking operations (plus 40 stale
   lock-debris files discovered accumulating since Session 4.2). See
   `KS-REPORT-4.9-addendum-close-verification.md`.

## Progress checklist — open items carried forward (in priority order)

1. Passive, not actionable yet: verify the token-free `publish-npm`
   config (Session 4.8) on the next natural release, then revoke
   `NPM_TOKEN` and enable npm's "disallow tokens" setting. Unchanged —
   still rides passively until a real release tag is pushed for some
   other reason.
2. Defect B's two-hop disposition
   (`resend.emails.sendBulkWithRetry(...)`) — unchanged since Session
   4.5, still a deliberate, Yehor-approved documented limitation. Leave
   as-is or revisit with a dedicated design session.
3. `build_knowledge_base`'s cache (`corpus/.fixprove_cache/`) has no
   invalidation tied to actually-installed packages — unchanged since
   Session 4.6, local-dev risk only, needs its own cache-key design
   decision if pursued.
4. `v0.1.4.bak.1783353789` — the one remaining oddly-named leftover git
   tag from Session 4.7's cleanup. Harmless, optional cleanup only.
5. `autonomous-core`'s untracked-file pile from an independent process —
   explicitly out of scope per Yehor's prior direction.
6. The `NPM_TOKEN`'s ~90-day expiry (due ~2026-10-11) is not tracked
   anywhere durable outside npm's own UI. Becomes moot once item #1
   above completes.
7. An untracked `logo/` directory still exists in the working tree.
   Still not investigated, still out of scope until Yehor asks.

**Closed this session, no longer on this list:**
- Worker `push`-event Check Run correlation — permanently
  blocked-by-design, see `project_fixprove_push_event_blocked` memory.
  Do not re-add this without Yehor explicitly reopening the
  Contents-permission question.
- wrangler v3→v4 upgrade — fully verified live, see above. Do not
  re-add this as an open item.

## Operating notes for whoever (human or AI) picks this up

- `main` remains under a real, GitHub-enforced branch-protection gate —
  though note Session 4.9's own push bypassed it via Yehor's admin
  rights rather than going through a PR, so "protected" doesn't mean
  "impossible to push directly" for the repo owner. Every `git` write,
  npm/GitHub UI action, and settings change must still be handed to
  Yehor as exact, literal, copy-paste-ready commands or field-by-field
  instructions.
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
  misleading npm errors, a cosmetic-but-scary npm warning, a whole
  feature blocked at the permission layer despite looking done at the
  code layer, and this session's workers.dev-vs-custom-domain false
  alarm) where the obvious signal was misleading. Cross-check directly
  against the live system every time — this session's own deploy output
  needed exactly that discipline applied to itself before being trusted.
- **A version bump in `package.json` is not a version bump on disk.**
  This session's own handoff nearly got reported as verified against
  wrangler 3.114.17 because `pnpm install` hadn't been re-run yet on the
  target machine — always confirm with `--version` (or equivalent) after
  install, on whichever machine will actually run the thing, not just in
  the sandbox that produced the change.
- This sandbox's mount has known git-lock, read/write staleness, and
  CRLF-noise issues (see `feedback_fixprove_mount_write_quirks`). Trust
  `Read`/`Grep` over `bash` immediately after an edit; if they disagree,
  use the write-to-new-file-then-`mv` (or direct bash heredoc) workaround
  and re-verify via an independent method before handing anything to
  Yehor. This happened multiple times during this session's own close-out,
  including on this very file.
- `pnpm install` still fails with `EPERM`/`unlink` when run directly
  against the FixProve mount from this sandbox. Use a scratch directory
  (rsync excluding `node_modules`/build output/`corpus/.fixprove_cache/`)
  for any JS/TS build/test cycle — confirmed working again this session
  via `npx pnpm@9.12.0`. (This restriction does not apply on Yehor's own
  machine — `pnpm install` there works normally.)
- **Verify this prompt's own claims before repeating them.** Session
  4.9's own opening prompt claimed `main` was at `c3a6832`; live reality
  was already `64d4ba1`. Run `git log -1 --oneline` in your first few
  tool calls and compare against whatever this prompt says, every
  session, not just at close.
- **Check `.git/*.lock` before trusting any git output** (sandbox side
  only). Every git command on this mount leaves an unremovable lock file
  behind; the next command fails outright until it's renamed away
  (`mv .git/index.lock .git/index.lock.<anything>` — rename works,
  delete doesn't). Do this check first, and do one final rename-away pass
  at the end of the session.

## Immediate next action

Nothing is currently blocking. Confirm with Yehor which of the 7
carried-forward items (above) to pick up next — none of them is
time-sensitive except item #1 (npm token verification), which rides
passively until a natural release happens for some other reason. It's
also worth a quick, low-effort check of the GitHub Actions tab to confirm
`ci.yml` ran clean on commit `3152be8` (the direct-push-bypassed-PR note
above), just to close that loop even though it's not expected to be a
problem.

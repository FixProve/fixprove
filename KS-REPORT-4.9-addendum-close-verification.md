# Keystone Report Addendum — Session 4.9 Close-Out: Hard-Test Re-Verification

Mirrors the addendum precedent set by `KS-REPORT-4.3-addendum.md`: this is
a second, adversarial verification pass over the same session's work,
run separately from the original report because it found things the
first pass didn't. Read alongside `KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md`,
which this addendum does not replace or edit (per this project's standing
rule that session/report files are never rewritten after the fact —
corrections go in a new file).

## Gate table

| Claim (from the original report) | Pass 1 (direct re-read) | Pass 2 (independent method) | Verdict |
|---|---|---|---|
| `push` not subscribable on the live App | Re-read `RUNBOOK-LIVE-DEPLOYMENT.md` B1's Contents:No-access record | Cross-referenced against GitHub's own webhook-events docs, fetched live | **CONFIRMED** |
| `wrangler` at `^4.111.0` in both workspaces | Re-`Read` both `package.json` files directly | Fresh, independent scratch copy + `pnpm install` + `npx wrangler --version` | **CONFIRMED** |
| `@cloudflare/workers-types` at `^5.20260715.1`, peer warning cleared | Re-`Read` both `package.json` files | Fresh scratch `pnpm install` — zero peer-dependency warnings, "Lockfile is up to date" | **CONFIRMED** |
| Build/typecheck/test pass under v4 | N/A (this is itself the test) | Full independent re-run in a brand-new scratch copy: build 4/4, typecheck 5/5, tests 6+16+8+50 all pass, exit 0 on every task | **CONFIRMED**, byte-for-byte reproducible |
| `wrangler deploy --dry-run` succeeds offline, config unchanged | N/A | Re-ran in the new scratch copy: identical bundle sizes (298.68 KiB/62.16 KiB gzip worker; 27 files/2.27 KiB web), identical bindings | **CONFIRMED**, deterministic |
| Real files on the mount not corrupted | Re-`Read` (Windows-side) | Independent bash JSON-parse of the same path | **CONFIRMED** |
| Only 3 real files differ from `main`, rest is CRLF noise | Re-ran `git diff -w --stat` | Cross-checked file list against what was actually written this session | **CONFIRMED** |
| `main` is at `c3a6832` (as stated in this session's own opening prompt and, uncaught, repeated into this session's session log and next-session prompt) | Re-ran `git log -1 --oneline` | `git merge-base --is-ancestor c3a6832 HEAD` | **DRIFTED** — actual HEAD is `64d4ba1`, one commit ahead (PR #9, a benign same-day self-correction from Session 4.8, not divergent history). **Fixed**: corrected in both the session log and `NEXT-SESSION-4.10-STARTING-PROMPT.md` before handoff. |
| Repo left in a clean, handoff-ready git state | Not checked in the original report | `.git/index.lock` and `.git/packed-refs.lock` were found live-blocking `git` operations during this close-out pass | **DRIFTED from assumed** — see Defects below. **Fixed**: both live locks cleared; repo confirmed lock-free before handoff. |

## Defects caught and fixed at close (beyond the original report)

**Defect: stale HEAD hash propagated without verification.** This
session's own opening prompt stated `main` was at `c3a6832`. That was
already one commit stale by the time the session started — Session 4.8
had landed a small, same-day, self-correcting docs PR (#9,
`docs/session-4.8-close-out`, fixing a self-referential hash in its own
files) on top of it. I ran `git log -1` early in this session, saw
`64d4ba1`, and never cross-checked it against the hash the starting
prompt asserted — so I repeated the stale `c3a6832` figure into this
session's own session log and next-session starting prompt, propagating
the drift forward instead of catching it. Caught only during this
close-out's cross-consistency sweep (grepping the new docs for hash
mentions and diffing against a fresh `git log`). Fixed in both files.
Root cause is process, not tooling: a starting prompt's claims must be
verified against a live check, not assumed current, even for something
as small as a commit hash — the same discipline this project already
applies to registry state, App permissions, and test results.

**Defect: `.git/index.lock` and `.git/packed-refs.lock` were live and
blocking at the start of this close-out pass**, and 40 stale
lock-rename-debris files (`*.lock.bak*`, `*.lock.retry*`, `*.lock.dead*`,
`*.lock.stale*`) had silently accumulated in `.git/` across every prior
session back to Session 4.2 (2026-07-06) without ever being flagged.
Root cause: every `git` command on this mount successfully creates its
lock file but fails to unlink it afterward (`Operation not permitted`,
the same mount restriction documented since Session 1.4), so the *next*
git command fails outright with `fatal: ... File exists` unless the
stale lock is renamed away first. Past sessions did the rename-workaround
inline (as documented in `feedback_fixprove_mount_write_quirks`) but
never checked for or cleaned up the live lock at session end, so it sat
there — as it did at the start of this close-out pass, actively blocking
`git add -n`. **Fixed**: both live locks renamed away (rename succeeds on
this mount even though delete/unlink doesn't); confirmed no live lock
remains via `ls .git/*.lock` returning nothing. The 40 debris files
themselves could not be deleted from this sandbox (same restriction) —
they are inert (git only recognizes its own exact lock filenames, never
globs) but are real clutter; flagged to Yehor as optional cleanup, not
urgent, since only his own machine has the OS-level permissions to
remove them.

No other defects found. Every other claim in the original report
reproduced exactly on independent re-verification.

## Session judgment

**L3 — Artifacts (CONFIRMED only):** `KS-REPORT-4.9-push-event-closure-and-wrangler-v4.md`,
this addendum, a new session log entry, an updated `SESSION-LOG-INDEX.md`,
a client-facing summary, and `NEXT-SESSION-4.10-STARTING-PROMPT.md` — all
written, all independently re-verified intact. `worker/package.json`,
`web/package.json`, `pnpm-lock.yaml` — wrangler v4 + workers-types v5,
reproduced twice from scratch with byte-identical build/dry-run output.
One project memory created (`project_fixprove_push_event_blocked`), one
updated twice (`feedback_fixprove_mount_write_quirks`, now documenting
both the CRLF-noise diagnostic and the git-lock-debris pattern for future
sessions). Repo left lock-free.

**L2 — Session goal:** two sub-goals, both decided by Yehor mid-session.
(1) Push-event correlation: investigate and decide — **MET**, closed
permanently with documented rationale. (2) wrangler v4 upgrade,
explicitly scoped to in-sandbox verification with live-deploy proof
deferred to Yehor — **MET against the agreed scope**; the full "proven in
production" bar remains **PARTIAL**, honestly carried forward as the
single blocking next step, not glossed over.

**L1 — Horizon:** real progress, not motion without progress. A
carried-forward item that could have wasted a future session attempting
an actually-impossible implementation is now permanently closed with the
real reason on record. A genuine piece of technical debt (wrangler v3, on
a `legacy` npm tag) is now code-complete and verified as far as this
environment allows. Two previously-invisible process risks — a
stale-prompt-hash propagation pattern, and a silently-accumulating git
lock-debris pile spanning five sessions — were surfaced and are now
documented so they compound into better practice rather than repeating
quietly forever.

## Known limitations (stated honestly, unchanged from the original report plus this pass's findings)

- The live, authenticated `wrangler deploy` path under v4 still has zero
  real-world runs — nothing in this close-out pass changes that; it
  remains Yehor's action.
- The 40 git-lock-debris files remain in `.git/`, undeletable from this
  sandbox. Inert, but present until Yehor removes them himself.
- Any future session's opening prompt should be treated the same way
  this addendum treats this one's: verify its stated git HEAD against a
  live `git log` before repeating it anywhere, not just before acting on
  it.

## Accountability Statement

**PENDING.** This addendum, like the original report, awaits Yehor's
review and sign-off. Nothing in this close-out pass required a new
architectural decision — it is verification and correction of the same
session's already-approved work, not new scope.

Signed: _______________________ (Yehor)
Date: _______________________

## Methodology note

The gate-table drift caught here — a stale commit hash, copied forward
without a live check — is a small instance of a pattern worth naming
plainly: **a starting prompt is itself an unverified claim**, no
different in kind from any other pre-session assertion this project
already treats with suspicion (registry state, App permissions, test
results). This session applied that suspicion to everything except its
own opening prompt's git state, until the close-out's cross-consistency
sweep caught it. Worth adding as an explicit first step to
`session-strategy-synthesis`'s own checklist: verify the starting
prompt's claimed live-state facts (HEAD hash, at minimum) against a real
`git log` in the first few tool calls of any session, not just at close.

## Next step

Unchanged from the original report's §7: Yehor runs the filtered
`git diff -w --stat` check, then the commit/push commands (now including
this addendum and the corrected session log/next-session files), then
the live `wrangler deploy` verification. Nothing in this project is
blocked on anything else right now — this is the single gating action.

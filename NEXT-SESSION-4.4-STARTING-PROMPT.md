# Starting Prompt — Session 4.4

Paste this at the start of the next FixProve session.

---

## Where things stand (as of Session 4.3 close, 2026-07-07)

**The first fully clean, correct end-to-end B5 pass in this project's history was achieved this session**, against `yehorcallmedai-maker/autonomous-core` (Python). Read `session-logs/SESSION-LOG-INDEX.md` first, then `session-logs/SESSION-LOG-2026-07-07-session-4.3-template-fix-and-b4b5-prep.md` (including its two Addenda) and `KS-REPORT-4.3-template-fix-and-b4b5-prep.md` + `KS-REPORT-4.3-addendum.md` in full before taking any action — they contain the complete defect history (seven real defects, #1–#7) and are the durable source of truth, not this summary.

**Live state:**
- GitHub: `FixProve/fixprove`, private, `main` at commit `81793f1`.
- Worker: `fixprove-github-app` deployed at `api.fixprove.dev`, current version `74b34ac2-f294-4ecc-bcab-3857d5c88e66`. `GITHUB_APP_PRIVATE_KEY` secret is now a correctly-formatted PKCS#8 key (regenerated this session; the App's two older PKCS#1 keys are still registered on GitHub but unused — not cleaned up, low priority).
- `yehorcallmedai-maker/autonomous-core`: `main` at `f20dde8` (has the corrected `fixprove-check.yml`). Seeded test PR **#3** (`test/fixprove-seeded-hallucination-py`, now at commit `5c6aa82`) shows a genuinely complete, correct pass: `FixProve` Check Run `85681629928`, conclusion `failure`, correctly naming the one seeded hallucination and correctly leaving valid code clean. **Do not merge PR #3** — it's a deliberately-broken test fixture, not a real change.
- `yehorcallmedai-maker/yehor.ai` (TypeScript/MDX): **completely untouched since Session 4.1's partial B4.** No corrected workflow file pushed, no seeded PR opened. This repo has not benefited from ANY of the seven defect fixes found this session or last.

**What's genuinely done:** `pip install fixprove` works for real; the Action template correctly installs the engine, Python deps, and (in principle — never yet exercised) JS/TS deps; the GitHub App's private key is in the right format; the Worker logs its own failures on both `/webhooks` and `/callback`; and Check Run correlation is fixed to key off PR number (verified claim) rather than the OIDC token's unreliable `sha` claim. All 66 tests pass (50 app, 16 worker).

## Open items carried forward (in priority order)

1. **Execute B4/B5 on `yehor.ai` (TypeScript/MDX) — this is the single immediate task for Session 4.4.** Confirm the App is still installed there (re-verify, don't assume Session 4.1's install is still valid), push the corrected `fixprove-check.yml` template to `main` FIRST (a `pull_request`-triggered workflow always runs whatever version already exists on the base branch, never a version newly introduced on the PR's own head — this bit Session 4.3 once already and was caught before it caused a silent no-op), then open a seeded PR with one deliberately-broken TS/JS symbol and one genuinely valid usage of a real dependency in the same file. **Never merge that seeded PR into `yehor.ai`'s `main`.** No defect found on the Python side should be assumed to generalize — the JS/TS dependency-install path (`node_modules`, `pnpm`/`yarn`/`npm ci` detection) has never actually been exercised live, only in a synthetic sandbox.
2. **Restore `npm --provenance` before the D2 public-repo flip.** Still removed from `.github/workflows/release.yml`'s `publish-npm` job (carried forward from Session 4.2, untouched since). Do not flip the repo public without checking this first.
3. **A real npm publish with an actual version bump has never been tested.** Still true, carried forward from Session 4.2.
4. **PyPI Trusted Publisher's original invalid-publisher rejection was never conclusively root-caused.** Carried forward from Session 4.2 — if it recurs, don't assume the same fix (delete + retype) works twice.
5. **`ci.yml` still doesn't run the Python test suite** on regular pushes/PRs. Pre-existing gap, still not addressed.
6. **`push`-event Check Run correlation is not implemented.** This session's fix deliberately tagged the pending-store key with a `kind` discriminant (`"pr" | "push"`) specifically so this can be added later without another storage migration — but today, a `push`-triggered workflow run would still fail closed with 404 if anyone ever wires one up. Not currently used anywhere (verified: neither the App nor the template registers/handles `push`), so no active bug, just an explicit scope boundary.
7. **`npx wrangler` is on 3.114.17; v4 is available.** Declined mid-session to avoid an unrelated variable during active debugging. Worth a dedicated upgrade session, not a rushed one.
8. **An untracked `logo/` directory exists in the FixProve working tree.** Still not investigated, still not this session's concern.
9. **`autonomous-core` has a large, growing pile of untracked files** (patches, tools, memory notes) from what appears to be an independent, ongoing autonomous-agent process running against that repo. Explicitly out of scope per Yehor's own direction ("we have drifted from the primary mandate — leave the remaining untracked files alone"). Do not attempt to clean these up or investigate further without Yehor explicitly asking again.

## Operating notes for whoever (human or AI) picks this up

- **No git push credentials exist in the AI sandbox.** Every push, `wrangler deploy`, `wrangler secret put`, and GitHub UI action (redeliver, re-run jobs, generate a private key) must be handed off to Yehor to run from his own machine. Give exact copy-paste PowerShell commands, one step at a time, and wait for pasted output before giving the next command — this is Yehor's stated preference for this project.
- **This sandbox's mount has real, worsening reliability issues, now confirmed on THREE fronts, not just writes:** (a) `Edit`/`Write` can silently truncate a file mid-write while still reporting success (`feedback_fixprove_mount_write_quirks`); (b) `git add`/`git commit` can hit a stale `.git/index.lock` (or `.git/objects/maintenance.lock`) that this sandbox cannot remove itself (`Operation not permitted`), even when no real process holds it; (c) **newly discovered this session — reads can also be stale/wrong**: this sandbox reported three directories and a lock file as still present via `ls`/`[ -e ]` checks run repeatedly, moments after Yehor's own PowerShell had already deleted them and confirmed their absence via `Test-Path`. **When this sandbox's view and Yehor's own PowerShell disagree about anything on this mount, Yehor's PowerShell is ground truth, not this sandbox.** Always independently verify any file this sandbox writes (read it back via `Read` AND cross-check via a fresh `bash` read, e.g. `wc -l`/`tail`/`diff` against a known-good copy) before committing.
- **`wrangler secret put` silently "succeeds" on empty/failed stdin.** If an upstream command in a pipe fails, `wrangler secret put` can still print `✨ Success!` after uploading an empty string. Always verify a secret's source file is non-empty and correctly formatted (e.g. `Get-Item ... | Select-Object Length`, check `-----BEGIN/END...-----` markers) before piping it into `wrangler secret put`.
- **This sandbox cannot compile the TypeScript packages** (`app/`, `worker/`) — a broken pnpm symlink resolution issue on the bridged mount, unrelated to the product. Any test run must be handed to Yehor: `pnpm --filter <pkg> build && pnpm --filter <pkg> test` from `D:\Dev\Projects\FixProve`.
- **Never force-move an existing git tag.**
- **PyPI's project.urls label must stay ≤32 characters.**
- When writing a `node -e` inline script from PowerShell: avoid embedding a raw Windows path inside a single-quoted JS string (`\f`, `\n`, etc. are live JS escape sequences and will silently corrupt the path) — pass paths via `process.argv` instead. Also remember `node -e "script" arg1 arg2` puts `arg1` at `process.argv[1]`, not `[2]` (there is no script-file slot to skip).

## Immediate next action

Confirm with Yehor that Session 4.4 should proceed straight to B4/B5 on `yehor.ai`, then re-verify the App's installation state on that repo before touching anything (do not assume Session 4.1's partial B4 is still valid ten sessions later).

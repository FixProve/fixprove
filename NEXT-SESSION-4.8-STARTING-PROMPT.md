Starting Prompt — Session 4.8
Paste this at the start of the next FixProve session.

Where things stand (as of Session 4.7 close, 2026-07-13)

Session 4.7 executed the D2 public-repo flip and restored `npm --provenance`, both open since Session 4.6. Read `session-logs/SESSION-LOG-INDEX.md` first, then `session-logs/SESSION-LOG-2026-07-13-session-4.7-d2-public-flip-and-provenance.md` and `KS-REPORT-4.7-d2-public-flip-and-provenance.md` in full before taking any action — they contain the complete detail (the pre-flip audit, the two real defects found and fixed, and the tag-burn decision) and are the durable source of truth, not this summary.

Live state:

* GitHub: `FixProve/fixprove` is now **public**. `main` at `81a8580` (merged via PR #3, `fix/provenance-metadata-bump`; docs for this session merged separately via PR #4, `docs/session-4.7-log` — confirm that one landed before assuming it's live, see Immediate next action). Branch protection on `main` is now **actually enforced** (previously dormant on the free org tier while private) — the procedural-only gate from Session 4.6 is now a real GitHub-side gate. Treat `main` as hard-locked with zero exceptions: feature branch + PR + green checks, always.
* `release.yml`'s `publish-npm` job now runs with `--provenance` for real, and it works: verified end-to-end against the live registry, not just CI status.
* PyPI: `fixprove 0.1.8` live, released `2026-07-13 16:23:07`.
* npm: `fixprove@0.1.8` live, valid Sigstore provenance, correct-case repository metadata (`github.com/FixProve/fixprove`).
* `v0.1.7`: exists as a tag, **permanently burned/dead** — nothing was ever published under it on either registry (PyPI silently no-op'd on an unbumped version; npm failed the case-mismatch check before publishing). Don't mistake its existence for a real, if broken, release.
* The two broken 0-byte tag-ref files (`v0.1.4.lock.bak.*`) that had escalated to actively blocking `git pull` are **fixed**, not just diagnosed. `v0.1.4.bak.1783353789` (a different, valid-but-oddly-named tag) still exists, harmless, optional cleanup only.
* `NPM_TOKEN` was rotated this session — new Automation (bypass-2FA) token, scoped to the `fixprove` package, 90-day expiry from 2026-07-13. Its expiry is not tracked anywhere durable outside npm's own UI.
* `yehorcallmedai-maker/yehor.ai` PR #1 and `autonomous-core` PR #3: unchanged from Session 4.5's close — both still the clean B5 test fixtures, neither merged.
* GitHub App, Cloudflare Worker: unchanged, untouched this session.

What's genuinely done this session:

1. Pre-flip git-history secret/sensitive-data audit — clean, all 24 commits, every valid ref.
2. `FixProve/fixprove` flipped to public, verified live (Danger Zone, plus branch protection's enforcement status confirmed to have changed).
3. `npm --provenance` restored in `release.yml`, live-verified working end-to-end (not just "the flag is back in the file").
4. Two real, novel defects found and fixed on live infrastructure: **Defect E** (case-sensitive repo-URL mismatch in `package.json`/`pyproject.toml`, rejected by Sigstore) and **Defect F** (expired `NPM_TOKEN`, surfaced as a misleading `E404`).
5. Item #7 (broken tag refs) genuinely fixed, not just diagnosed again — root-caused via `packed-refs` inspection before deletion.
6. `v0.1.8` released and independently verified live on both PyPI and npm, including npm's provenance badge.

Progress checklist — open items carried forward (in priority order)

* 1. **NEW, time-boxed:** npm Trusted Publishing (OIDC) migration. npm's own account UI is warning that bypass-2FA tokens (what this pipeline uses) are being restricted from Aug 2026, with direct publish via bypass-2FA eliminated entirely by Jan 2027. This mirrors what's already live and working for PyPI (Trusted Publishing since Session 4.1/4.2). Needs its own dedicated design session — not a drive-by swap, since it changes the auth model of a job that currently works. Should be picked up well before the Jan 2027 deadline, not left to the last session.
* 2. Defect B's two-hop disposition. `resend.emails.sendBulkWithRetry(...)` (two hops past a `new`-constructed instance binding) remains a deliberate, Yehor-approved false negative per Session 4.5's one-hop-depth-uniformity decision. Carried forward from every session since 4.5: leave as a documented known limitation permanently, or revisit with a dedicated design session for deeper (two-hop) instance-property tracking. No action taken on this in Session 4.7.
* 3. Worker `push`-event Check Run correlation is not implemented. Unchanged since Session 4.3 — the pending-store key's `kind` discriminant exists specifically so this can be added later without another storage migration, but no `push`-triggered workflow creates or completes a Check Run today.
* 4. `build_knowledge_base`'s cache (`corpus/.fixprove_cache/`) has no invalidation tied to actually-installed packages. Found Session 4.6 as a side effect of adversarially verifying the CI gate. Real risk for local dev iteration, not a risk for CI itself. Needs its own cache-key design decision if pursued — not a drive-by fix.
* 5. `npx wrangler` is on 3.114.17; v4 is available. Still declined, still worth a dedicated upgrade session.
* 6. An untracked `logo/` directory exists in the FixProve working tree. Still not investigated, still out of scope until Yehor asks.
* 7. ~~Two broken/orphaned git tag refs~~ — **resolved Session 4.7.** `v0.1.4.bak.1783353789` (the one valid-but-oddly-named leftover) remains, harmless, optional cleanup only.
* 8. `autonomous-core` has a large, growing pile of untracked files from an independent, ongoing autonomous-agent process. Explicitly out of scope per Yehor's prior direction — do not touch without Yehor asking again.
* 9. The new `NPM_TOKEN`'s 90-day expiry (due ~2026-10-11) is not tracked anywhere durable outside npm's own UI. Either set a reminder or fold this into item #1's migration timeline.

Operating notes for whoever (human or AI) picks this up

* `main` is now under a **real, GitHub-enforced** branch-protection gate, not just a procedural one — the free-org-tier dormancy that made Session 4.6's gate advisory-only is gone now that the repo is public. Every `git` write, `wrangler` action, and GitHub UI action (including PR creation/merging and any settings change) must still be handed to Yehor as exact, literal, copy-paste-ready commands — no angle-bracket placeholders; PowerShell treats `<` as a reserved redirection operator and will error. Give one step at a time, wait for pasted output, and confirm success from the actual output shown, not assumed.
* Modifying repo access controls, security settings, or any GitHub UI configuration is off-limits for the AI to perform directly, even with explicit user authorization. Guide Yehor through it field-by-field instead; verify the result afterward by reading the page back — this session's D2 flip and npm token rotation were both done this way, successfully.
* **Never trust a green publish-job status alone.** This session found two real cases where CI's own report was misleading: a green PyPI job that was actually a silent no-op, and an npm error (`E404`) that read like a missing-package problem but was actually an expired token. Always cross-check the actual live registry (`pypi.org/project/fixprove`, `npmjs.com/package/fixprove`) directly before reporting a release as done.
* GitHub gates full Actions job logs behind sign-in, even for public repos — generic `web_fetch` cannot retrieve them (returns a "Sign in to view logs" wall past the summary/annotations level). Use Claude-in-Chrome (`navigate` + `get_page_text`) for anything beyond the run summary and annotations.
* This sandbox's mount has known git-lock and read/write staleness issues, confirmed again this session (a stale `.git/index.lock`, separately the two 0-byte broken tag-ref files that turned out to be real and fixable, not phantom). A stale `.git/index.lock` on Yehor's own machine is safe to delete (`Remove-Item .git\index.lock -Force`) if no other git process is genuinely running. Within the AI's own sandbox, if `bash`'s view of a file disagrees with the `Read`/`Grep` tools' view right after an edit, trust `Read`/`Grep`, not `bash` — but if the sandbox's own `git status`/`git log` shows something implausible, trust Yehor's own terminal output over the sandbox entirely. Before deleting anything under `.git/refs/`, confirm via `packed-refs` that nothing legitimate would be orphaned, the way this session did.
* `pnpm install` fails with `EPERM`/`unlink` when run directly against the FixProve mount. Use a scratch directory (rsync excluding `node_modules`/build output, and excluding any tool-specific cache directories like `corpus/.fixprove_cache/`) for any JS/TS or Python engine build/test cycle in-sandbox, or hand off to Yehor's own machine.
* Python tests can be run directly in the sandbox (confirmed reliable across Sessions 4.5 and 4.6 once the off-mount pycache/cache workaround is used).

Immediate next action

First, confirm PR #4 (`docs/session-4.7-log`) actually merged — it was pushed at session close but merge status wasn't re-confirmed before the session ended. Run `git log -1 --oneline` on `main` and check it's past `81a8580`. Then confirm with Yehor which open item to start on: item #1 (npm Trusted Publishing migration) is newly time-boxed and arguably the highest-priority forward-looking item, but — consistent with how D2 and `--provenance` were each held for deliberate, unrushed sessions — do not assume it should start without Yehor's explicit go-ahead this session.

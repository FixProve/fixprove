# Starting Prompt — Session 4.7

Paste this at the start of the next FixProve session.

---

## Where things stand (as of Session 4.6 close, 2026-07-10)

Session 4.6 shifted focus from B5 live-validation (closed clean in Session 4.5, TS/JS now matches Python's bar) to CI/operational technical debt. Read `session-logs/SESSION-LOG-INDEX.md` first, then `session-logs/SESSION-LOG-2026-07-10-session-4.6-ci-python-gate.md` and `KS-REPORT-4.6-ci-python-gate.md` in full before taking any action — they contain the complete detail (CI-gate implementation, the PyPI audit's forensic findings, and the `npm --provenance` deferral reasoning) and are the durable source of truth, not this summary.

**Live state:**
- GitHub: `FixProve/fixprove`, private, `main` at commit `cc734d2` (merged via PR #1, `docs/session-4.6-log`). `ci.yml` now runs both `build` (TS/JS) and `test-python` (Python engine, 217 tests) on every push/PR — confirmed live and green (`CI #20`, then again on PR #1's own run).
- **Branch protection now exists on `main`** (classic rule: require PR before merging, no required-approvals count since Yehor is solo, required status checks `build` + `test-python`, require-up-to-date, require-conversation-resolution). **GitHub reports it "Not enforced"** — private-repo branch protection requires a paid GitHub Team/Enterprise organization plan; `FixProve` is on the free org tier. Yehor explicitly declined the upgrade and instead established a **procedural hard gate**: treat `main` as locked regardless — see Operating notes below.
- PyPI Trusted Publisher/OIDC configuration: **audited and closed this session, verified sound.** No code or config change made.
- `npm --provenance`: **still absent from `release.yml`**, formally and permanently deferred to the D2 public-repo flip (not an independent open item anymore — see Open items #1 below).
- `yehorcallmedai-maker/yehor.ai` PR #1 and `yehorcallmedai-maker/autonomous-core` PR #3: unchanged from Session 4.5's close — both still the clean B5 test fixtures, neither merged.
- GitHub App, Cloudflare Worker: unchanged, untouched this session.

**What's genuinely done this session:**
1. `ci.yml`'s new `test-python` job — live-verified on a real GitHub-hosted runner (Python 3.11), not just simulated: `217 passed in 13.46s`, both on the direct-push run and again on PR #1's run.
2. Classic branch-protection rule created on `main` (dormant until Team upgrade or D2, per above).
3. PyPI Trusted Publisher/OIDC audit closed — the historical "invalid publisher" narrative (present in both Session 4.2's session log and its own Keystone Report) was checked against the actual GitHub Actions logs for all 7 historical `Release` runs and found not to match any of them; the real `v0.1.2` failure was the already-documented comma-in-label metadata defect, with OIDC succeeding completely in that same run. Configuration verified sound via 3 consecutive clean publishes (`v0.1.4`-`v0.1.6`).
4. `npm --provenance` restoration formally assessed and deferred — restoring it now (repo still private) would silently reintroduce Defect #7 on the next real tag push; Yehor chose to hold entirely rather than risk that or rush the D2 flip.

## Progress checklist — open items carried forward (in priority order)

- [ ] **1. The D2 public-repo flip, now permanently coupled with restoring `npm --provenance`.** These are treated as a single unit of work, not two independent tasks — do not restore `--provenance` without the flip happening in the same change, and do not flip to public without restoring it. Flipping to public also automatically activates the dormant branch-protection rule on `main` at no extra cost (see Operating notes).
- [ ] **2. Defect B's two-hop disposition.** `resend.emails.sendBulkWithRetry(...)` (the *original* seeded hallucination pattern, two hops past a `new`-constructed instance binding) remains a deliberate, Yehor-approved false negative per Session 4.5's one-hop-depth-uniformity decision. Carried forward from every session since 4.5 as an open architectural question: leave as a documented known limitation permanently, or revisit with a dedicated design session for deeper (two-hop) instance-property tracking. No action taken on this in Session 4.6.
- [ ] **3. Worker `push`-event Check Run correlation is not implemented.** Unchanged since Session 4.3 — the pending-store key's `kind` discriminant exists specifically so this can be added later without another storage migration, but no `push`-triggered workflow creates or completes a Check Run today.
- [ ] **4. `build_knowledge_base`'s cache (`corpus/.fixprove_cache/`) has no invalidation tied to actually-installed packages.** Found this session as a side effect of adversarially verifying the new CI gate (see `KS-REPORT-4.6-ci-python-gate.md` Section 3). Real risk for local dev iteration (a stale cache can mask a fixture/dependency change), not a risk for CI itself (fresh checkout every run). Needs its own cache-key design decision if pursued — not a drive-by fix.
- [ ] **5. `npx wrangler` is on 3.114.17; v4 is available.** Still declined, still worth a dedicated upgrade session.
- [ ] **6. An untracked `logo/` directory exists in the FixProve working tree.** Still not investigated, still out of scope until Yehor asks.
- [ ] **7. Two broken/orphaned git tag refs exist on `FixProve/fixprove`: `v0.1.4.lock.bak.*` and `v0.1.4.bak.1783353789`.** Discovered Session 4.5. Plausibly the same mount-lock corruption class as `.git/index.lock`. Do not touch without understanding root cause first; never force-move any tag while investigating.
- [ ] **8. `autonomous-core` has a large, growing pile of untracked files** from an independent, ongoing autonomous-agent process. Explicitly out of scope per Yehor's prior direction — do not touch without Yehor asking again.

## Operating notes for whoever (human or AI) picks this up

- **`main` is now under a procedural hard gate, established explicitly by Yehor this session.** Even though GitHub will not currently block a direct push (branch protection is dormant — see above), all future work must target a feature branch and go through a PR, checks green, before merging. Never suggest or run `git push origin main` directly again. Suggested naming: `docs/...`, `fix/...`, `feat/...` matching the change's nature (e.g. `fix/npm-provenance`, `feat/d2-public-flip`).
- **No git push credentials exist in the AI sandbox.** Every `git` write, `wrangler` action, and GitHub UI action (including PR creation/merging and any settings change) must be handed to Yehor as exact, literal, copy-paste-ready commands — no angle-bracket placeholders like `<branch-name>`; PowerShell treats `<` as a reserved redirection operator and will error. Give one step at a time, wait for pasted output, and confirm success from the actual output shown, not assumed.
- **Modifying repo access controls, security settings, or any GitHub UI configuration is off-limits for the AI to perform directly, even with explicit user authorization and even partially (e.g. filling in a form and leaving only the final submit click to the user).** Guide Yehor through it field-by-field instead; verify the result afterward by reading the page back.
- **This sandbox's mount has known git-lock and read/write staleness issues, confirmed again across Sessions 4.2, 4.5, and 4.6.** A stale `.git/index.lock` on Yehor's own machine is safe to delete (`Remove-Item .git\index.lock -Force`) if no other git process is genuinely running. Within the AI's own sandbox, if `bash`'s view of a file disagrees with the `Read`/`Grep` tools' view right after an edit, trust `Read`/`Grep`, not `bash` — but if the sandbox's own `git status`/`git log` shows something implausible (e.g. `cache entry has null sha1`, a file listed as both deleted and untracked), trust Yehor's own terminal output over the sandbox entirely. Before trusting any Python test "passed" result, rewrite touched files via bash heredoc from a fresh `Read` and rerun with `PYTHONDONTWRITEBYTECODE=1 PYTHONPYCACHEPREFIX=<off-mount-dir> python3 -B -m pytest`. See `feedback_fixprove_mount_write_quirks` memory for the full protocol.
- **`pnpm install` fails with `EPERM`/`unlink` when run directly against the FixProve mount.** Use a scratch directory (rsync excluding `node_modules`/build output, and excluding any tool-specific cache directories like `corpus/.fixprove_cache/` — confirmed this session that forgetting the latter can produce a false verification pass) for any JS/TS or Python engine build/test cycle in-sandbox, or hand off to Yehor's own machine.
- **Python tests can be run directly in the sandbox** (confirmed reliable across Sessions 4.5 and 4.6 once the off-mount pycache/cache workaround above is used).

## Immediate next action

Confirm with Yehor which open item to start on. Item 1 (D2 public flip + `npm --provenance`) is the highest-priority item still open from Session 4.6's own mandate, but it's a deliberate strategic milestone Yehor chose not to rush — do not assume it should be started without his explicit go-ahead this session, per the same "no exceptions" reasoning he applied when deferring it.

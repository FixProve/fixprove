# Starting Prompt — Session 4.3

Paste this at the start of the next FixProve session.

---

## Where things stand (as of Session 4.2 close, 2026-07-06)

`fixprove 0.1.0` is **live and independently verified on both PyPI and npm** — the first real, external release in this project's history. Read `session-logs/SESSION-LOG-INDEX.md` first, then `session-logs/SESSION-LOG-2026-07-06-session-4.2-release-gate-fix-and-live-publish.md` and `KS-REPORT-4.2-release-gate-fix.md` in full before taking any action — they contain the complete defect history and are the durable source of truth, not this summary.

**Live state:**
- GitHub: `FixProve/fixprove`, private, `main` at commit `2b9c5ec`. Tags `v0.1.0`–`v0.1.4` all present, distinct, none force-moved.
- PyPI: `fixprove 0.1.0` live at `pypi.org/project/fixprove/`, published via Trusted Publishing (OIDC, no stored token).
- npm: `fixprove@0.1.0` live at `npmjs.com/package/fixprove`, published via a classic token (`NPM_TOKEN`, bypass-2FA), **without `--provenance`** (temporary, see below).

**What's genuinely done:** the original Session 4.2 mandate — root-cause the v0.1.0 test-gate failure and get a real release published — is complete. Nine further real defects were found and fixed along the way, all on live infrastructure that no local test/build check could have caught (see KS-REPORT-4.2 Section 3 for the full list: permissions inheritance, PyPI Trusted Publisher, npm 2FA, PyPI comma-parsing, npm provenance/visibility, PyPI label length).

## Open items carried forward (in priority order)

1. **B4/B5 — add the GitHub Action workflow to the two private test repos and run the first live seeded-PR test.** This is the single next unambiguous step per the session log. Test repos: `yehorcallmedai-maker/autonomous-core` (Python) and `yehorcallmedai-maker/yehor.ai` (TypeScript/MDX — **never merge the deliberately-broken seeded-PR test into this repo's `main`**). `pip install fixprove` / `npm install -g fixprove` both now work for real, so nothing blocks this anymore.
2. **Restore `npm --provenance` before the D2 public-repo flip.** Currently removed from `.github/workflows/release.yml`'s `publish-npm` job as a deliberate, Yehor-approved temporary trade-off (it requires a public source repo). No automated check enforces this restoration — it depends on this note being read. Do not flip the repo public without checking this first.
3. **A real npm publish with an actual version bump has never been tested.** The current `publish-npm` step has only been proven against a duplicate-version rejection (`v0.1.4`'s run correctly refused to republish `0.1.0`). The first genuine new-version publish will be the real test of this step.
4. **PyPI Trusted Publisher's original invalid-publisher rejection was never conclusively root-caused** — fixed pragmatically (delete + retype the entry), not diagnosed. If it recurs, don't assume the same fix works twice.
5. **`ci.yml` still doesn't run the Python test suite** on regular pushes/PRs — only the tag-triggered `release.yml` does. Pre-existing gap, not yet addressed (flagged again in this session's Methodology Note as a good candidate to fix).
6. **An untracked `logo/` directory exists in the working tree** — not created this session, origin not investigated.

## Operating notes for whoever (human or AI) picks this up

- **No git push credentials exist in the AI sandbox.** Every push must be handed off to Yehor to run from `D:\Dev\Projects\FixProve` on his own machine. Give him exact copy-paste commands.
- **This sandbox's mount has real, only partially understood git reliability issues** (Keystone Report Section 3, Defect #10): stale `.git/index.lock`/`.git/HEAD.lock`/`.git/packed-refs.lock` files, and — newly discovered this session — `git add` can silently keep staging an OLD blob for a file even after the working-tree content is correct and `git add` reports success (a caching issue, not a `rm`/lock issue). **Always verify with `git hash-object <file>` vs `git ls-files -s <file>` before trusting `git add`/`git commit`**, and use `git hash-object -w` + `git update-index --cacheinfo` as the forcing workaround if they diverge. Same applies to the `Edit`/`Write` tools on this mount (`feedback_fixprove_mount_write_quirks` memory) — always re-verify delivered files, don't trust a tool's own success report.
- **Never force-move an existing tag.** Each release attempt gets a new patch tag (`v0.1.5` next, if another fix is needed before a real feature release).
- **PyPI's project.urls label must stay ≤32 characters** — currently `"GitHub App (paid CI)"` (20 chars). Don't lengthen it without checking against this limit again.

## Immediate next action

Confirm with Yehor whether to proceed straight to B4/B5 (live seeded-PR test) or to first exercise a real version-bumped npm publish. Then read the two test repos' current state before adding the workflow file, since Session 4.1 left B4 partially complete and B5 entirely untried.

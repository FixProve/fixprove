# Session Log — 2026-07-13 — Session 4.7: D2 Public-Repo Flip, `npm --provenance` Restoration, v0.1.7→v0.1.8

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Session 4.7's mandate, per Yehor's own strategic assessment at session open, was open item #1 carried forward since Session 4.6: the D2 public-repo flip, coupled with restoring `npm --provenance`. Full design rationale and verification detail are in `KS-REPORT-4.7-d2-public-flip-and-provenance.md`; this log covers only what was actually executed against live infrastructure.

## 2. Live state changes

1. **Pre-flip audit:** full git-history secret/sensitive-data scan across all 24 commits, all valid refs — clean. No code change.
2. **PR #2** (`feat/d2-public-flip` → `main`): restored `--provenance` to `release.yml`'s `publish-npm` job, and separately committed Yehor's carried-over accountability sign-off for `KS-REPORT-4.6`. Both `build`/`test-python` checks passed. Merged by Yehor — commit `f59b838`.
3. **`FixProve/fixprove` flipped to public** via GitHub Settings (Yehor-executed, AI guided field-by-field). Verified live: Danger Zone confirms "This repository is currently public"; `main`'s branch-protection rule went from "Not enforced" to "Currently applies to 1 branch" — activated automatically, at no cost, as expected.
4. **Two broken 0-byte tag-ref files removed** from Yehor's local `.git/refs/tags/` (`v0.1.4.lock.bak.1783353772`, `v0.1.4.lock.bak.1783353789`) — confirmed via `packed-refs` inspection that nothing legitimate was at risk. `git pull` now fast-forwards cleanly; this had been silently blocking normal sync (local `main` was one commit behind `origin/main` until fixed).
5. **`v0.1.7` tagged and pushed** — triggered `release.yml` live. `test`, `verify-artifact-contents`, `publish-pypi` passed (the latter a silent no-op, version never bumped — confirmed against `pypi.org` directly, still showing `0.1.6`). `publish-npm` failed: `E422`, case-mismatch between `package.json`'s lowercase `repository.url` and the real `FixProve/fixprove` casing, rejected by Sigstore provenance verification. **Yehor's explicit decision: burn `v0.1.7` (nothing published under it on either registry), roll forward to `v0.1.8`, on tag-immutability grounds.**
6. **PR #3** (`fix/provenance-metadata-bump` → `main`): fixed the casing in `cli/package.json` and (found via grep, same bug) `engine/python/pyproject.toml`; bumped both packages' version `0.1.6` → `0.1.8`. Checks passed, merged by Yehor — commit `81a8580`.
7. **`v0.1.8` tagged and pushed** — triggered `release.yml`. `publish-pypi` succeeded, independently confirmed live: `pypi.org/project/fixprove` shows `0.1.8`, released `2026-07-13 16:23:07`. `publish-npm` failed differently: `E404` on the final registry PUT, after provenance had already signed successfully. Root-caused directly against `npmjs.com/settings/fixprove/tokens`: the `NPM_TOKEN` secret's backing token (`fixprove-release-ci v2`) had expired that same day (7-day lifetime).
8. **Yehor rotated the npm token** (new Automation/bypass-2FA token, scoped to the `fixprove` package, 90-day expiry) and updated the `NPM_TOKEN` GitHub secret directly. **Re-ran only the failed `publish-npm` job** (confirmed via the re-run dialog that `publish-pypi` was correctly excluded). Job succeeded: `+ fixprove@0.1.8`, new Sigstore transparency-log entry (`logIndex=2163744385`). Independently verified live on `npmjs.com/package/fixprove`: version `0.1.8`, published minutes prior, correct-case repository link, provenance badge present.

## 3. Real defects found this session

1. **Defect E (novel, real):** `cli/package.json`'s `repository.url` used lowercase `fixprove/fixprove` against the real `FixProve/fixprove` — invisible until this session because `--provenance` had never previously reached the verification step (always failed earlier, on the private-repo `E422`, since Session 4.2). Fixed in both `cli/package.json` and `engine/python/pyproject.toml`.
2. **Defect F (novel, real):** the `NPM_TOKEN` secret's backing access token expired same-day as the release attempt, surfacing as a misleading `E404` ("package not found") rather than a clean auth error. Fixed by rotation; root-caused directly against npm's own token management UI, not guessed from the error text alone.
3. **Item #7 (carried forward, genuinely fixed this session, not just diagnosed):** two 0-byte broken tag-ref files were actively blocking `git pull` on Yehor's real machine (previously only observed as a sandbox-mount curiosity). Root-caused (confirmed 0 bytes, confirmed no `packed-refs` fallback existed) and removed.

**Non-blocking annotation, every job, both releases:** the same pre-existing Node.js 20 deprecation warning noted in Session 4.6, unrelated to this session's changes.

## 4. Known limitations (stated plainly)

1. **npm's own account UI is actively warning that bypass-2FA tokens are being restricted** (partial, Aug 2026; full elimination of direct-publish-via-bypass-2FA by Jan 2027). This pipeline depends on exactly that token type. Yehor explicitly chose to rotate now and defer a Trusted Publishing (OIDC) migration to a dedicated future session — this is real, time-boxed, and should not be left indefinitely.
2. The new `NPM_TOKEN`'s 90-day expiry is not tracked anywhere durable outside npm's own UI.
3. `v0.1.7` is a permanently burned, dead tag by deliberate decision — nothing was ever published under it.
4. `release.yml`'s public-repo precondition for `--provenance` is enforced by documentation/process only, not a CI-side guard.
5. All items carried forward from Session 4.6's Known Limitations that this session did not touch remain open: Defect B's two-hop disposition, Worker `push`-event Check Run correlation, `build_knowledge_base`'s cache-invalidation gap, `npx wrangler` on 3.114.17, the untracked `logo/` directory, `autonomous-core`'s untracked-file pile.

## 5. Current state snapshot as of session close

- **`FixProve/fixprove`:** now **public**. `main` at `81a8580`. Branch protection on `main` is now actually enforced (previously dormant on the free org tier while private). Two broken tag-ref files removed; `git pull` clean.
- **PyPI:** `fixprove 0.1.8` live, released `2026-07-13 16:23:07`.
- **npm:** `fixprove@0.1.8` live, published with valid Sigstore provenance, correct-case repository metadata.
- **`v0.1.7`:** exists as a tag, permanently burned/dead — nothing published under it on either registry.
- **`yehorcallmedai-maker/yehor.ai` PR #1 / `autonomous-core` PR #3:** unchanged from Session 4.5's close.
- **Cloudflare Worker / GitHub App:** unchanged, untouched this session.

## 6. Immediate next step

Confirm with Yehor which open item to start next: the remaining Session 4.6 carryovers (Defect B two-hop disposition, Worker `push`-event Check Run correlation, `build_knowledge_base` cache-invalidation, `npx wrangler` upgrade), or scheduling the npm Trusted Publishing (OIDC) migration flagged as time-boxed in this session's Known Limitations.

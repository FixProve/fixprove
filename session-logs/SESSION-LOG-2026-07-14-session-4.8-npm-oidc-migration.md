# Session Log — 2026-07-14 — Session 4.8: npm OIDC Trusted Publishing Migration

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Session 4.8's mandate, per Yehor's selection at session open, was open item
#1 carried forward since Session 4.7: migrate `publish-npm` off the
bypass-2FA `NPM_TOKEN` to npm's OIDC Trusted Publishing, ahead of npm's own
deprecation timeline (restricted Aug 2026, eliminated Jan 2027). Full
design rationale, verification detail, and the four approved architectural
decisions (Q1–Q4) are in `KS-REPORT-4.8-npm-oidc-migration.md`; this log
covers only what was actually executed against live infrastructure.

## 2. Live state changes

1. **GitHub Environment `npm` created** (Yehor-executed, AI guided
   field-by-field) at `github.com/FixProve/fixprove/settings/environments`.
   Verified live: no required reviewers, no wait timer, no branch/tag
   restriction — deliberate, per Q2 (parity binding only, hardening
   deferred).
2. **npm Trusted Publisher configured** (Yehor-executed) at
   `npmjs.com/package/fixprove/access`: Organization `FixProve`, Repository
   `fixprove`, Workflow filename `release.yml`, Environment name `npm`,
   Allowed actions `npm publish`. Verified saved via screenshot readback.
3. **PR #5** (`feat/npm-oidc-trusted-publishing` → `main`): adds
   `environment: npm`, bumps `publish-npm` to Node 24 + explicit
   `npm install -g npm@latest`, keeps `NODE_AUTH_TOKEN` as a same-run
   fallback (Q3), bumps `cli/package.json` and
   `engine/python/pyproject.toml` `0.1.8` → `0.1.9`. Both checks passed.
   Merged by Yehor — commit `0166cac`.
4. **`v0.1.9` tagged and pushed** — triggered `release.yml` live. All jobs
   succeeded. Independently verified, not inferred from job status:
   - `registry.npmjs.org/fixprove/0.1.9` JSON metadata: `_npmUser` shows
     `"GitHub Actions"` with an explicit `trustedPublisher` object —
     definitive proof OIDC authenticated the publish, not the token
     fallback. `_nodeVersion: 24.18.0`, `_npmVersion: 12.0.1` confirm the
     Q1 version bump was effective. Valid Sigstore attestation present.
   - A misleading publish warning (`"bin[fixprove]" script name ... was
     invalid and removed`) was investigated by installing `fixprove@0.1.9`
     fresh from the live registry and running `fixprove --help` — works
     correctly. The warning referred to a cosmetic `./` prefix
     normalization, not entry removal. No shipped defect.
   - `pypi.org/project/fixprove/0.1.9` independently confirmed "Uploaded
     using Trusted Publishing? Yes" on both files, correct commit
     (`0166cace...`), correct tag, full attestation.
5. **PR #6** (`fix/remove-legacy-npm-token-env` → `main`): removed the
   now-proven-unnecessary `NODE_AUTH_TOKEN` env block from `publish-npm`,
   per the "Dormant Rollback" plan — `NPM_TOKEN` secret and npm's
   token-publish allowance both left live and unrevoked, deliberately not
   toggled off yet. Both checks passed. Merged by Yehor — commit
   `408e7a6`. **No version bump, no tag** — CI-only config change; the
   token-free config itself remains unverified in production (see §4).
6. **PR #7** (`docs/ks-report-4.8` → `main`): added
   `KS-REPORT-4.8-npm-oidc-migration.md`. Both checks passed. Merged by
   Yehor — commit `0794a85`.

Every merge this session was independently re-verified from the AI's own
sandbox via `git fetch` + diff-stat + a YAML/JSON parse or live registry
API check, cross-checked against Yehor's own terminal output — never
trusted from one side alone.

## 3. Real defects found this session

1. **Sandbox mount write-staleness (recurring, pre-existing, not novel):**
   `bash`'s cached view of `release.yml` served stale, truncated content
   twice this session, immediately after correct edits landed via the
   Read/Edit tools. Fixed both times via the established write-to-new-
   file-then-move workaround; each fix re-verified via an independent YAML
   parse before being handed to Yehor.
2. **Misleading npm publish warning, investigated and closed as a
   non-issue (not a shipped defect):** see §2.4. Worth logging because the
   warning text alone ("was invalid and removed") plausibly described a
   real, user-facing break of the CLI's global install — closed only by a
   real functional test, not by reading the metadata alone.
3. **Overclaimed rationale caught before the PR #6 cleanup was drafted:**
   a proposed justification for skipping live re-verification of the
   token-free config asserted the risk was "mathematically eliminated."
   Corrected: `v0.1.9`'s evidence proves OIDC works *with* an unused
   fallback token present, not with the token *structurally absent* —
   two different `.npmrc` configurations. Downgraded to an honest, still-
   open known limitation (§4) rather than a false certainty.

## 4. Known limitations (stated plainly)

1. **The token-free `publish-npm` config (PR #6, `408e7a6`) has not
   itself been live-verified.** `v0.1.9`'s live verification ran *before*
   this cleanup merged. `main`'s actual current publish step has zero
   real-world runs as of this session's close.
2. `NPM_TOKEN` is live and unrevoked; npm still permits token-based
   publishing for this package. Both are open safety nets, not resolved
   cleanup items, pending the next natural release.
3. npm's documented "automatic provenance under OIDC" claim was found
   unreliable by independent field testing (not this project's own
   testing) — `--provenance` is kept explicit as a hedge.
4. `pnpm@9.12.0` + Node 24 compatibility in `publish-npm` was an
   assumption going in, confirmed only by the one successful `v0.1.9` run.
   `test` and `verify-artifact-contents` remain on Node 20, unevaluated
   for a similar bump.
5. npm Trusted Publishing itself is GA but young (since 2025-07-31), no
   long-run track record for credential rotation, registry incidents, or
   multi-workflow packages.
6. All Session 4.6/4.7 carryovers untouched this session remain open:
   Defect B two-hop disposition, Worker `push`-event Check Run
   correlation, `build_knowledge_base` cache-invalidation gap, `npx
   wrangler` upgrade (3.114.17 → v4), the untracked `logo/` directory,
   `autonomous-core`'s untracked-file pile, `v0.1.4.bak.1783353789` tag
   cleanup, and the `NPM_TOKEN`'s ~90-day expiry (due ~2026-10-11) not
   tracked anywhere durable outside npm's own UI.

## 5. Current state snapshot as of session close

- **`FixProve/fixprove`:** `main` at `0794a85`. PRs #5, #6, #7 merged this
  session, all independently verified.
- **GitHub Environment `npm`:** exists, no protection rules.
- **npm Trusted Publisher:** configured for `fixprove` (org `FixProve`,
  repo `fixprove`, workflow `release.yml`, environment `npm`, `npm
  publish` allowed).
- **PyPI:** `fixprove 0.1.9` live, Trusted Publishing confirmed on both
  files.
- **npm:** `fixprove@0.1.9` live, OIDC confirmed via `_npmUser.
  trustedPublisher` metadata (not inferred), functional CLI install+run
  verified, valid Sigstore provenance.
- **`publish-npm` on `main`:** token-free as of `408e7a6` — **unverified
  in production**, first real test is the next natural release.
- **`NPM_TOKEN` secret / npm token-publish allowance:** both still live,
  unrevoked — dormant rollback per Q3, not yet exercised as safe to
  remove.

## 6. Immediate next step

No action is required to advance the npm OIDC migration further — it
rides passively until the next natural release (any future version tag)
exercises the token-free `publish-npm` config. When that release happens,
verify it the same way `v0.1.9` was verified (live `_npmUser.
trustedPublisher` metadata check, not a green job status alone); only
then revoke `NPM_TOKEN` and enable npm's "disallow tokens" setting.

Confirm with Yehor which of the other carried-forward items to start next
session: Defect B two-hop disposition, Worker `push`-event Check Run
correlation, `build_knowledge_base` cache-invalidation, `npx wrangler`
upgrade, or something else — none were touched this session and none
should be assumed as the default pick.

# Keystone Report — Session 4.8: npm OIDC Trusted Publishing Migration

**Date:** 2026-07-14
**Director:** Yehor
**Lead Technical Co-Pilot:** Claude (Cowork)

## 1. Executive Summary

Migrated the `publish-npm` job in `.github/workflows/release.yml` from a
bypass-2FA `NPM_TOKEN` repo secret to npm's OIDC Trusted Publishing (GA
since 2025-07-31), mirroring the `publish-pypi` job's existing Trusted
Publishing approach (live since Session 4.1/4.2). This addresses open item
#1 carried since Session 4.7, ahead of npm's own deprecation timeline
(bypass-2FA tokens restricted Aug 2026, eliminated Jan 2027 per npm's
account UI warning).

Delivered across two pull requests:

- **PR #5** (`feat/npm-oidc-trusted-publishing`, merged `0166cac`): adds
  `environment: npm`, bumps `publish-npm` to Node 24 + explicit
  `npm install -g npm@latest`, keeps `NODE_AUTH_TOKEN` as a live same-run
  fallback, bumps package versions to `0.1.9` for live verification.
- **PR #6** (`fix/remove-legacy-npm-token-env`, merged `408e7a6`): removes
  the now-proven-unnecessary `NODE_AUTH_TOKEN` env block, following the
  "Dormant Rollback" strategy (see §4).

A real `v0.1.9` tag was pushed and independently verified live against
both PyPI and npm — not simulated, not inferred from CI status alone.

## 2. Provenance — AI-Generated vs. Human-Edited

- All code changes (`release.yml`, `cli/package.json` version bump,
  `engine/python/pyproject.toml` version bump, this report) were AI-drafted.
- Every architectural decision (Q1–Q4 in the workflow's own KS-TRACE, plus
  the Phase-3 cleanup scope) was explicitly proposed by the AI and required
  Yehor's sign-off before execution. No decision was closed unilaterally.
- All git operations (branch creation, commit, push, PR open/merge) and all
  GitHub/npmjs.com UI configuration (Environment creation, Trusted
  Publisher setup) were executed personally by Yehor, via copy-paste
  commands or step-by-step manual guidance — the AI never had direct write
  access to GitHub settings or the npm registry, per this project's
  standing rule that repo/security configuration is off-limits for direct
  AI action.
- One instance of the AI catching an overclaim in Yehor-authored rationale
  before it shipped: a proposed justification for skipping live
  verification of the token-free `.npmrc` config asserted the risk was
  "mathematically eliminated." The AI identified the actual gap (see §3,
  Defect 3) and the claim was corrected collaboratively before the cleanup
  PR was drafted.

## 3. Verification Chain

**Stage 1 (research):** npm's OIDC Trusted Publishing postdates the AI's
May 2025 reliable knowledge cutoff. Current official docs
(`docs.npmjs.com/trusted-publishers`) and an independent field account
(philna.sh, 2026-01-28, documenting a real-world gotcha with the
"automatic provenance" claim) were fetched live rather than recalled from
training data.

**Stage 3, npm — definitive OIDC proof:** `registry.npmjs.org/fixprove/0.1.9`
JSON metadata inspected directly:

```
"_npmUser": {
  "name": "GitHub Actions",
  "email": "npm-oidc-no-reply@github.com",
  "trustedPublisher": {"id": "github", "oidcConfigId": "oidc:a922c721-..."}
}
```

This is non-inferred proof OIDC authenticated the publish — had it fallen
back to the token, `_npmUser` would show Yehor's own npm account instead.
Also confirmed: `_nodeVersion: 24.18.0`, `_npmVersion: 12.0.1` (Q1's
version-bump decision verified effective), and a valid Sigstore
attestation with a transparency-log entry.

**Stage 3, npm — functional test:** a misleading publish warning
("`bin[fixprove]` script name ... was invalid and removed") was
investigated by actually installing `fixprove@0.1.9` from the live
registry in a clean sandbox and running `fixprove --help`. The CLI bin
entry works correctly — the warning referred to a cosmetic `./` prefix
normalization, not removal of the entry.

**Stage 3, PyPI — cross-check:** `pypi.org/project/fixprove/0.1.9`
confirmed "Uploaded using Trusted Publishing? Yes" on both the sdist and
wheel, correct source commit (`0166cace...`), correct tag
(`refs/tags/v0.1.9`), full attestation. Checked even though PyPI's job was
untouched by this session's change, per the standing rule to never assume
a registry is fine on the strength of a green CI job alone.

**Independent double-check pattern:** every git merge this session was
re-verified via a separate `git fetch` + diff-stat + parse from the AI's
own sandbox against Yehor's local terminal output, catching the
sandbox-mount write-staleness described in §3 (Defects) before it could
propagate into a real commit.

## 4. Defects Caught and Fixed

1. **Sandbox mount write-staleness (recurring, pre-existing issue).**
   `bash`'s cached view of `release.yml` served stale, truncated content
   twice this session, immediately after real edits landed correctly via
   the Read/Edit tools (confirmed via mismatched `mtime` and line counts).
   Fixed both times via the established write-to-new-file-then-move
   workaround; each fix re-verified via an independent YAML parse before
   being handed to Yehor.

2. **Misleading npm publish warning, investigated and closed as a
   non-issue.** `npm publish`'s auto-correction warning
   (`"bin[fixprove]" script name ... was invalid and removed`) read like
   the CLI's bin entry had been stripped from the published package —
   which would have broken `npm install -g fixprove` for every user.
   Root-caused via direct registry metadata inspection and a real install
   + run test (see §3): the entry is intact; only a `./` path prefix was
   normalized away. No shipped defect.

3. **Overclaimed rationale caught before merge.** A proposed justification
   for skipping live re-verification of a token-free workflow config
   asserted the risk was "mathematically eliminated" by the `v0.1.9`
   evidence. This conflated two distinct configurations: OIDC succeeding
   *with* an unused fallback token present (proven) vs. OIDC succeeding
   with the token *structurally absent* (untested — `actions/setup-node`
   writes `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}` into
   `.npmrc`, and npm CLI's behavior when that variable is entirely unset,
   rather than merely unused, is not documented in npm's own trusted-
   publishing docs). Corrected to an accurate, unresolved known limitation
   rather than a false certainty — see §6.

## 5. Architectural Decisions (Yehor-Approved)

- **Q1 (Node/npm version):** belt-and-suspenders — Node 24 via
  `setup-node` *and* an explicit `npm install -g npm@latest` step, both
  kept despite apparent redundancy, per a real-world account that found
  the version-bump claim alone insufficient in practice.
- **Q2 (environment symmetry):** `environment: npm` added to mirror
  `publish-pypi`'s `environment: pypi`, without a required-reviewer
  protection rule for now — deferred as a separate future decision.
- **Q3 / Phase 3 ("Dormant Rollback"):** the `NPM_TOKEN` GitHub secret and
  npm's token-based publishing allowance both remain live but unreferenced
  in the workflow. Not revoked, not disallowed. This is deliberate: it
  preserves a manual (not same-run) recovery path until the *next natural
  release* proves the current token-free `publish-npm` step under fire.
  Explicitly **not yet proven** — see §6.
- **Q4 (live verification):** a real `v0.1.9` tag was pushed and verified
  live this session rather than deferred to a separate session, per
  Yehor's explicit instruction and this project's "unverified means
  unverified" standing rule (npm does not validate trusted-publisher
  config at save time — a live publish is the only real test).
- **No throwaway version for the cleanup PR:** PR #6 (removing the
  `NODE_AUTH_TOKEN` env block) intentionally did **not** get its own
  version bump or verification tag — it is a CI-only configuration change
  touching no published package code, so forcing a version bump would be
  tag pollution. The cost of this choice is stated plainly in §6, not
  hidden behind the "no pollution" framing.

## 6. Known Limitations (Stated Honestly)

- **The token-free `publish-npm` configuration (PR #6, `f4ec281` /
  `408e7a6`) has not itself been live-verified.** The `v0.1.9` live
  verification in §3 ran *before* this cleanup merged, against a workflow
  that still had `NODE_AUTH_TOKEN` present (unused, but present). The
  current `main` branch's actual publish step has zero real-world runs as
  of this report.
- `NPM_TOKEN` is live and unrevoked; npm still permits token-based
  publishing for this package. Both are open safety nets, not resolved
  cleanup items, until a real release proves the current config.
- npm's documented claim that provenance generation is "automatic" under
  OIDC was found unreliable by independent field testing; this project
  continues to pass `--provenance` explicitly as a hedge, not because the
  automatic behavior has been specifically disproven on this package.
- `pnpm@9.12.0`'s compatibility with Node 24 in `publish-npm` was an
  assumption going in, empirically confirmed only by the one successful
  `v0.1.9` run — it was never independently tested in isolation. The
  `test` and `verify-artifact-contents` jobs remain on Node 20 and have
  not been evaluated for a similar bump.
- npm Trusted Publishing itself is GA but young (since 2025-07-31) with no
  long-run track record for edge cases such as credential rotation,
  registry incidents, or multi-workflow packages.

## 7. Current Pipeline State

Both `publish-pypi` and `publish-npm` now specify OIDC Trusted Publishing
exclusively in their job definitions — no long-lived registry credential
is referenced by either job's `run` steps.

- `publish-pypi`: closed out since Session 4.1/4.2, proven across multiple
  real releases (including this session's `v0.1.9`).
- `publish-npm`: OIDC proven once, on `v0.1.9`, against a config that
  still had a dormant token reference present. The token-free version of
  that same job (merged after the proof) is unverified — see §6.

## 8. Accountability Statement

This report and the changes it documents were produced under the
session's Keystone process: contract-first intake, traceable generation,
adversarial verification against live systems (not simulated), and honest
disclosure of what remains unproven. All architectural decisions were
approved by Yehor before execution; all registry and GitHub configuration
changes were performed by Yehor personally.

Signed: ___________________________ (Yehor)
Date: ___________________________

## 9. Methodology Note

Suggested process improvement: the independent-verification pattern used
repeatedly this session (`git fetch` from the AI's own sandbox + diff-stat
+ a YAML/JSON parse or live registry API check, cross-checked against the
human's terminal output) was reconstructed ad hoc each time it was needed.
Worth promoting to a named, reusable checklist step for future sessions —
codifying it reduces the risk of skipping the independent check under time
pressure, and would have caught the sandbox mount-staleness defect (§4.1)
faster had it been a standing first move rather than a reactive one.

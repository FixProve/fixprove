Starting Prompt — Session 4.9
Paste this at the start of the next FixProve session.

## Where things stand (as of Session 4.8 close, 2026-07-14)

Session 4.8 executed the npm OIDC Trusted Publishing migration, the item
time-boxed as open item #1 since Session 4.7 (npm restricts bypass-2FA
tokens Aug 2026, eliminates them for direct publish Jan 2027). Read
`session-logs/SESSION-LOG-INDEX.md` first, then
`session-logs/SESSION-LOG-2026-07-14-session-4.8-npm-oidc-migration.md`
and `KS-REPORT-4.8-npm-oidc-migration.md` in full before taking any
action — they contain the complete detail (the four approved
architectural decisions Q1–Q4, the exact verification evidence, and the
one overclaimed rationale that was caught and corrected mid-session) and
are the durable source of truth, not this summary.

**Live state:**

* GitHub: `FixProve/fixprove` `main` at `c3a6832`, four PRs merged this
  session — #5 (`feat/npm-oidc-trusted-publishing`, `0166cac`: adds
  `environment: npm`, Node 24 + `npm install -g npm@latest` for
  `publish-npm`, bump to `v0.1.9`), #6 (`fix/remove-legacy-npm-token-env`,
  `408e7a6`: removes the now-proven-unnecessary `NODE_AUTH_TOKEN` env
  block), #7 (`docs/ks-report-4.8`, `0794a85`: the Keystone Report), #8
  (`docs/session-4.8-log`, `c3a6832`: session log, index update, this
  starting prompt, and a plain-language client summary — no functional
  change).
* A GitHub Environment named `npm` now exists (Settings → Environments),
  no protection rules — mirrors `environment: pypi` for structural parity
  only, not a security gate (that's an explicitly deferred future
  decision).
* npm's Trusted Publisher is configured for `fixprove` at
  `npmjs.com/package/fixprove/access`: org `FixProve`, repo `fixprove`,
  workflow `release.yml`, environment `npm`, `npm publish` allowed.
* PyPI: `fixprove 0.1.9` live, Trusted Publishing confirmed independently
  on both the sdist and wheel.
* npm: `fixprove@0.1.9` live. OIDC authentication is **definitively
  proven, not inferred** — `registry.npmjs.org/fixprove/0.1.9`'s
  `_npmUser` field shows `"GitHub Actions"` with an explicit
  `trustedPublisher` object, which could only appear if OIDC actually
  fired (a token-based publish would show Yehor's own npm account
  instead). A misleading `npm publish` warning
  (`"bin[fixprove]" script name ... was invalid and removed`) was
  investigated via a real `npm install` + `fixprove --help` run and
  confirmed to be cosmetic (a `./` prefix normalization), not a broken
  CLI entry.
* **`NPM_TOKEN` GitHub secret and npm's token-based publishing allowance
  are both still live and unrevoked, by deliberate design ("Dormant
  Rollback").** They are NOT vestigial — they are the only fallback if
  the next real release hits a problem with the now-token-free
  `publish-npm` step.
* **The token-free `publish-npm` config itself (merged in PR #6, commit
  `408e7a6`) has ZERO real-world runs as of this session's close.**
  `v0.1.9`'s live verification happened *before* PR #6 merged, against a
  workflow that still had `NODE_AUTH_TOKEN` present (unused, but
  present). This is the single most important carried-forward fact —
  do not assume the current `main` branch's publish step has been proven;
  it has not.

**What's genuinely done this session:**

1. Live-researched npm's OIDC Trusted Publishing (GA 2025-07-31) against
   current official docs and an independent field account — the feature
   postdates the AI's May 2025 knowledge cutoff, so nothing was assumed
   from training data.
2. `publish-npm` migrated to OIDC (PR #5), live-verified end-to-end on a
   real `v0.1.9` tag — verification used live registry metadata
   (`_npmUser.trustedPublisher`), not a green CI status alone, per this
   project's "never trust a green publish-job status alone" standing
   rule.
3. `NODE_AUTH_TOKEN` cleanup (PR #6) executed with an explicit,
   documented safety net: no throwaway version tag was cut for the
   cleanup itself (correct call — it's a CI-only config change), but the
   secret and npm's token allowance are deliberately still live pending
   the next real release proving the token-free path.
4. One real overclaim caught mid-session, before it shipped: a proposed
   justification asserted removing the token was "risk mathematically
   eliminated." Corrected — `v0.1.9` proved OIDC works *with* an unused
   fallback present, not with the token *structurally absent*, which is a
   different `.npmrc` configuration. This distinction is now logged
   in-line in `release.yml`'s own KS-TRACE comments, not just in the
   report.
5. Sandbox mount write-staleness (a known, recurring issue — see
   `feedback_fixprove_mount_write_quirks` memory) hit twice this session
   on `release.yml` edits; both times caught via independent verification
   and fixed via the established write-to-new-file-then-move workaround
   before anything was handed to Yehor.

## Progress checklist — open items carried forward (in priority order)

1. **NEW, passive but not closeable yet: verify the token-free
   `publish-npm` config on the next natural release.** No action needed
   until then — it rides passively. When the next version tag is pushed
   for any reason, verify it the *same way* `v0.1.9` was verified (live
   `_npmUser.trustedPublisher` metadata check on
   `registry.npmjs.org/fixprove/<version>`, not a green job status
   alone). Only after that real proof: revoke the `NPM_TOKEN` GitHub
   secret and switch npm's package settings to "Require two-factor
   authentication and disallow tokens." Do not do this hardening step
   preemptively — it removes the only fallback before the token-free path
   has ever actually run.
2. Defect B's two-hop disposition. `resend.emails.sendBulkWithRetry(...)`
   remains a deliberate, Yehor-approved false negative per Session 4.5's
   one-hop-depth-uniformity decision. Carried forward unchanged since
   Session 4.5 — leave as a documented known limitation permanently, or
   revisit with a dedicated design session for deeper (two-hop) instance-
   property tracking.
3. Worker `push`-event Check Run correlation is not implemented. Unchanged
   since Session 4.3 — the pending-store key's `kind` discriminant exists
   specifically so this can be added later without another storage
   migration, but no `push`-triggered workflow creates or completes a
   Check Run today.
4. `build_knowledge_base`'s cache (`corpus/.fixprove_cache/`) has no
   invalidation tied to actually-installed packages. Found Session 4.6 as
   a side effect of adversarially verifying the CI gate. Real risk for
   local dev iteration, not CI itself. Needs its own cache-key design
   decision if pursued.
5. `npx wrangler` is on 3.114.17; v4 is available. Still declined, still
   worth a dedicated upgrade session.
6. An untracked `logo/` directory exists in the FixProve working tree.
   Still not investigated, still out of scope until Yehor asks.
7. `v0.1.4.bak.1783353789` — the one remaining valid-but-oddly-named
   leftover git tag from Session 4.7's cleanup. Harmless, optional
   cleanup only.
8. `autonomous-core` has a large, growing pile of untracked files from an
   independent, ongoing autonomous-agent process. Explicitly out of scope
   per Yehor's prior direction — do not touch without Yehor asking again.
9. The `NPM_TOKEN`'s ~90-day expiry (due ~2026-10-11, set at rotation in
   Session 4.7) is not tracked anywhere durable outside npm's own UI.
   This becomes moot once item #1 above is completed and the secret is
   revoked — until then, it's still a live, silently-expiring credential.

## Operating notes for whoever (human or AI) picks this up

* `main` remains under a real, GitHub-enforced branch-protection gate.
  Every `git` write, npm/GitHub UI action, and settings change must still
  be handed to Yehor as exact, literal, copy-paste-ready commands or
  field-by-field instructions — no angle-bracket placeholders; PowerShell
  treats `<` as a reserved redirection operator and will error. Give one
  step at a time where the step is a live/irreversible action (tag
  pushes, UI toggles), wait for pasted output or a screenshot, and
  confirm success from the actual evidence shown, not assumed.
* Modifying repo access controls, security settings, GitHub Environments,
  or npm package settings is off-limits for the AI to perform directly,
  even with explicit authorization. Guide Yehor through it field-by-field
  instead; verify the result afterward by reading the page back — every
  manual step this session (GitHub Environment creation, npm Trusted
  Publisher config) was done this way, successfully, on the first try
  each time.
* **Never trust a green publish-job status alone.** This project has now
  found real cases across multiple sessions where CI's own report was
  misleading (a silent PyPI no-op in 4.7, a misleading `E404` in 4.7, and
  this session, a scary-sounding-but-cosmetic npm publish warning in 4.8
  that a naive read would have logged as a shipped defect). Always
  cross-check the actual live registry metadata directly — for npm,
  `registry.npmjs.org/<package>/<version>` JSON, checking `_npmUser` for
  OIDC evidence specifically, not just that the version exists.
* Distinguish "proven with a fallback present" from "proven with the
  fallback absent." These are different configurations even when the
  fallback was never actually used — this session's central adversarial
  catch. Apply the same skepticism to any future "should still work"
  claim about a config that hasn't itself been exercised live.
* This sandbox's mount has known git-lock and read/write staleness
  issues (see `feedback_fixprove_mount_write_quirks` memory), confirmed
  again this session on `release.yml` edits (stale line counts, mtimes
  from before the edit). Trust `Read`/`Grep` over `bash` immediately
  after an edit; if they disagree, use the write-to-new-file-then-`mv`
  workaround and re-verify via an independent method (YAML/JSON parse,
  not just a line count) before handing anything to Yehor.
* `pnpm install` still fails with `EPERM`/`unlink` when run directly
  against the FixProve mount. Use a scratch directory (rsync excluding
  `node_modules`/build output/`corpus/.fixprove_cache/`) for any JS/TS
  build/test cycle in-sandbox — confirmed working again this session via
  `npx pnpm@9.12.0` (global `pnpm` install itself also fails with EPERM
  on this sandbox; `npx` sidesteps it).

## Immediate next action

Confirm with Yehor which carried-forward item to start on. Item #1 (the
token-free `publish-npm` verification) is not something to "start" — it
has no action until the next natural release happens for some other
reason. So the real choice is among items #2–#6: Defect B's two-hop
disposition, the Worker `push`-event Check Run correlation, the
`build_knowledge_base` cache-invalidation gap, the `wrangler` v4 upgrade,
or the untracked `logo/` directory (if Yehor wants it investigated). Do
not assume which one without his explicit go-ahead this session.

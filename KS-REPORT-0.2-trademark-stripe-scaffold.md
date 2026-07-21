# Keystone Report — Session 0.2: Trademark + Stripe + Repo Scaffold
**Date:** 2026-07-01
**Director:** Yehor Kaliberda
**Lead Technical Co-Pilot:** Claude (Cowork, Sonnet 5)
**Scope:** Draft USPTO TEAS filing text (Class 9 + 42), produce a Stripe setup checklist,
scaffold the monorepo (`/cli`, `/app`, `/web`), and prove the scaffold builds green in CI
before session close.

**Editorial note (2026-07-21, Session 4.12-B):** two references to a specific comparison
mark and its risk assessment in §4 and §5 below were redacted from public view as a
documented, one-time exception to this project's append-only convention for Keystone
Reports — justified because this report's own §5 Accountability Statement was never
signed (no attestation exists for this edit to alter). See `MEMORY/critical-actions.md`,
CA-4 entry dated 2026-07-21, for the full justification and scope of this exception.

---

## 1. Provenance

All deliverables in this session are 100% AI-generated scaffolding/drafting; no human-edited
code exists yet in `/cli`, `/app`, or `/web`. Specifically:

- **Trademark text** (`TRADEMARK-FILING-NOTES.md`): AI-drafted from the product description
  in `FIXPROVE_MASTER_BUILD_PLAN.md` §1.1/§3, written close to USPTO ID Manual style.
  **Not attorney-reviewed** — flagged explicitly in the document itself.
- **Due-diligence search** on "Fix Price" and a second comparison mark: AI-executed via
  general web search (not USPTO TESS/TSDR, not an attorney clearance search). Results are
  recorded as what they are — a web-search-level check — not oversold as a formal
  clearance opinion.
- **Stripe checklist** (`STRIPE-SETUP-CHECKLIST.md`): AI-drafted from Stripe's publicly
  documented onboarding flow + the billing model already specified in the master build plan
  (flat per-repo pricing, GitHub App entitlement gating, Session 2.3 scope). No Stripe
  account was created; no API calls were made to Stripe.
- **Monorepo scaffold** (`/cli`, `/app`, `/web`, root configs, CI workflow, LICENSE,
  NOTICE.md, CONTRIBUTING.md, SECURITY.md): 100% AI-generated. Every non-trivial source file
  carries a `#KS-TRACE` comment naming the requirement, the assumption made, and the covering
  test, per Keystone Stage 2.
- Nothing in this session has been human-edited yet. Yehor's review/sign-off is pending
  (§7).

---

## 2. Verification Summary — coverage & tools used

The test contract for this session was explicit: **"scaffold must build green in CI before
session close."** CI does not exist as a running GitHub Actions job yet (no repo push
occurred this session), so the workflow (`.github/workflows/ci.yml`) was **executed
locally, step-for-step identical to what it declares**, in a clean sandbox:

| Step (mirrors `.github/workflows/ci.yml`) | Result |
|---|---|
| `pnpm install --frozen-lockfile` (clean, no `node_modules`, no build artifacts) | ✅ PASS — 58 packages installed, lockfile satisfied without re-resolution |
| `pnpm build` (turbo: `fixprove`, `@fixprove/github-app`, `@fixprove/web`) | ✅ PASS — 3/3 packages built (`tsc` ×2, `next build` ×1) |
| `pnpm typecheck` (turbo, all 3 packages) | ✅ PASS — 3/3, zero type errors |
| `pnpm test` (turbo, all 3 packages) | ✅ PASS — 2/2 unit tests pass (cli: 1, app: 1); web has a placeholder test command (no test code exists yet — honestly not "tested", see §5) |

**Tools used:** pnpm 9.12.0 (via corepack/local prefix — see D-defect table), Turborepo
2.10.2, TypeScript 5.9.3, Node.js `node --test` (built-in test runner), Next.js 14.2.35,
Python 3.10 (`json.load`) for config-file integrity verification after the corruption defect
below.

**Where this was run:** the scaffold was copied out of the mounted `D:\Dev\Projects\FixProve`
folder into a scratch sandbox path (`/tmp/fixprove-build`) to run the install/build cycle,
because the mounted folder rejects the `unlink` calls pnpm's installer needs (see D2 below).
The verified-green files were then confirmed byte-identical back in the delivered repo
(package.json fixes were written directly to the delivered copy and re-synced before the
final green run — see D1).

---

## 3. Defects Caught & Fixed

| # | Defect | Severity | Fix Applied |
|---|--------|----------|-------------|
| D1 | **The `Edit` tool silently truncated `cli/package.json` and `app/package.json`** mid-write when adding a missing `@types/node` dependency, leaving invalid/unterminated JSON on the delivered mount. Not visible without explicitly re-parsing the file — the tool reported success. | HIGH | Rewrote both files in full via shell heredoc instead of an in-place patch, then verified with `python3 -c "json.load(...)"` on every `*.json` file in the repo (12/12 valid). Adopted "always re-parse config files after any edit on this mount" as a standing practice for the rest of the session. |
| D2 | `pnpm install` fails with `EPERM: operation not permitted, unlink` when run directly inside the mounted `D:\Dev\Projects\FixProve` folder (and initially inside the scratch `outputs` folder too) — the mount does not support the temp-file unlink/rename pattern pnpm's content-addressable store relies on. | MEDIUM | Ran the install/build/typecheck/test cycle in `/tmp` (full POSIX semantics), then copied only the verified source files back — never `node_modules`, `dist`, `.next`, or the pnpm store. |
| D3 | Initial `cli` and `app` `tsconfig`s had no Node type definitions available (`@types/node` was missing from both packages' `devDependencies`), causing `tsc` build failures: `Cannot find name 'console'/'process'`, `Cannot find module 'node:test'/'node:assert/strict'`. | MEDIUM | Added `@types/node@^20.16.11` to both packages' `devDependencies` (matching the version already pinned in `/web`). Re-ran the full install→build→typecheck→test cycle clean; 3/3 packages pass. |
| D4 | Global `npm install -g pnpm` failed with `EACCES` (no write permission to the sandbox's global `node_modules`), and `corepack enable` failed the same way. | LOW | Installed pnpm to a user-owned prefix (`~/.npm-global`) instead of the system global path. Purely an environment-setup issue, not a repo defect — noted here for reproducibility, not because it affects the delivered scaffold. |
| D5 | Two 0-byte temp files and one empty directory (`CI_TMP`) were left behind in the delivered `D:\Dev\Projects\FixProve` folder — artifacts of the D2 failed-install attempts and an earlier `mkdir` typo. The folder's write-once semantics blocked normal `rm`/`rmdir`. | LOW | Used `allow_cowork_file_delete` to get explicit deletion permission, then removed all three. Confirmed clean directory listing post-removal. |

**What was *not* broken, deliberately:** no property-based test was run this session because
there is no non-trivial logic yet to property-test — `/cli`'s `check` command and `/app`'s
`createFixProveApp` are intentionally inert placeholders (Milestone 1/2 build the real
logic). Running a property-based test against a stub would be theater, not verification, so
it was skipped rather than faked. This is itself the adversarial-Verify judgment call for
this session: the only thing worth attacking was **does the promised CI step actually pass**,
and D1–D4 are what that attack surfaced.

---

## 4. Known Limitations — stated honestly

- **The trademark text is unreviewed by counsel.** It is drafted to be filing-ready in form,
  not guaranteed to be accepted by a USPTO examiner without amendment, and not a substitute
  for a real clearance search (see `TRADEMARK-FILING-NOTES.md` §3 for the near-name
  due-diligence findings — comparison-mark name and detailed assessment redacted from public
  view 2026-07-21, Session 4.12-B; net assessment retained internally as not guaranteed
  non-conflicting).
- **No Stripe account exists.** The checklist is unexecuted; several items (legal entity
  choice, statement descriptor, tax registration) require decisions only Yehor can make.
- **`/web`'s `test` script is a placeholder echo, not a real test.** Turbo reports it as
  "passing" because the shell command exits 0, but no assertion is being made about the
  landing page. This is accurate scaffold behavior for Session 0.2 (the real page + tests
  are Session 0.3 scope) but should not be read as "the web package is tested."
- **`/app` and `/cli` contain zero product logic.** `createFixProveApp` constructs an SDK
  object and nothing else; `runCheck` prints a message. Both packages "build green" and
  "pass tests" in the narrowest possible sense — that the scaffolding compiles and the stub
  behaves as a stub. Milestone 1 (resolver engine) and Milestone 2 (real webhook handling)
  are where real correctness claims will need to be made and verified.
- **CI has not run on GitHub.** `.github/workflows/ci.yml` was validated by running its
  steps locally in an equivalent clean environment, not by an actual GitHub Actions run
  (no repo push happened this session). Recommend confirming a real green run on first
  push before treating this as fully closed.
- **`fixprove.io` / `fixprove.ai` remain unregistered** (carried over from Session 0.1,
  unchanged this session — budget decision deferred).

---

## 5. Accountability Statement

> I, Yehor Kaliberda, have reviewed this Keystone Report for Session 0.2. I confirm that:
> - I understand the trademark text is unreviewed by counsel and requires my (or my
>   attorney's) edit pass before TEAS filing.
> - I understand the near-name due-diligence comparison recorded in
>   `TRADEMARK-FILING-NOTES.md` §3 (comparison-mark name redacted from this public copy,
>   2026-07-21) was flagged as not guaranteed non-conflicting, and a real TESS/attorney
>   clearance search is recommended before I file.
> - I have not yet opened a Stripe account; the checklist is guidance, not a completed
>   action.
> - I accept the monorepo scaffold as reviewed, understanding it contains no product logic
>   yet (that is Milestone 1/2 scope).
>
> **Signature:** _______________________  **Date:** __________

*(Left unsigned — per Keystone Stage 4, this requires Yehor's explicit sign-off, not
Claude's.)*

---

## 6. Methodology Note — suggested improvement to the process

**Config-file edits on the mounted workspace folder need a verification step by default.**
D1 (silent JSON truncation from the `Edit` tool) is the most concerning defect this session
— it produced a file that *looked* like a successful edit but was actually corrupt, and it
would have caused a confusing, hard-to-diagnose CI failure ("Unterminated string in JSON")
if it had reached an actual GitHub Actions run instead of being caught locally first.
Suggested standing rule for this project: **any edit to a `package.json`, `tsconfig.json`,
or other machine-parsed config file on the `D:\Dev\Projects\FixProve` mount should be
followed immediately by a parse check** (`python3 -c "import json; json.load(open(...))"`
for JSON, or the equivalent for YAML/TOML) before moving on, rather than trusting the edit
tool's success response. This session adopted that practice reactively after D1; adopting
it proactively in Session 1.x (where real source files, not just config, will be edited
repeatedly) would catch this class of defect before it costs a build cycle.

---

## 7. Session Close Declaration

**Deliverables (all in `D:\Dev\Projects\FixProve`):**
- `TRADEMARK-FILING-NOTES.md` — Class 9 + 42 text, filing-basis notes, due-diligence record
- `STRIPE-SETUP-CHECKLIST.md` — full setup checklist
- `/cli`, `/app`, `/web` — monorepo scaffold (MIT LICENSE in `/cli`; `NOTICE.md` at root
  explaining the split licensing; `CONTRIBUTING.md`, `SECURITY.md`)
- `.github/workflows/ci.yml` — CI config
- `pnpm-lock.yaml` — committed lockfile (needed for `--frozen-lockfile` in CI)
- This report

**Test contract status: MET.** `pnpm install --frozen-lockfile && pnpm build && pnpm
typecheck && pnpm test` all pass, 3/3 workspaces, verified in a clean environment (not
cached, not assumed).

**Session status: AWAITING YEHOR SIGN-OFF** (§5). Recommend Session 0.3 (landing page +
waitlist) only after trademark text review is at least glanced at, since Session 0.3's
copy should stay consistent with whatever final positioning language goes into the filing.

*Claude acknowledges: D1 (silent config corruption) was a tooling failure that could have
gone undetected without the parse-check habit adopted mid-session. Recorded without
softening, per Keystone Rule Zero.*

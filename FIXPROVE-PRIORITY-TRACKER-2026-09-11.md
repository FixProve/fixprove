# FixProve — Priority Tracker

**As of: 2026-09-11, updated later same day after implementing both P0
CLI fixes.** Every item below was re-verified fresh this session (Gmail,
Calendar, a live fetch of vfault.com, a live fetch of fixprove.dev, a
direct read of the AI Tinkerers thread, direct code inspection of
`cli.py`/`index.ts`/`pyproject.toml`) — not carried forward on trust, and
not taken on trust from the guide chat's own claims either (its two
"reading focus" catches this update were both independently re-verified
before being acted on: the CLI-syntax decision context, confirmed live
against fixprove.dev; and the `--version` fix's ESM assumption, confirmed
directly from `cli/package.json` rather than left as "likely"). Re-verify
anything here that's more than a few days old before acting on it; this
file is a snapshot, not a live feed. Check items off as `[x]` and note
the date/outcome inline rather than deleting the line — this project's
convention is to preserve the record, not erase it.

**UPDATE, 2026-09-14 (Session 4.30) — this tracker is now substantially
superseded; read `MEMORY/state.md` for current state, this block for the
delta.** Everything below this point describes a resolved situation:
the git-commit crisis was fixed the same night (4.28 close); `0.1.14`
shipped and was independently verified live on both registries (Session
4.29); the customer self-test the P0 items below were blocking has since
run for real against 3 unplanted GitHub repos, finding one genuine crash
(orphaned `.py` file + no `requirements.txt`, hard `exit 2`) and one
genuine false positive (vitest cross-package re-exports) — see
`KS-REPORT-4.29-selftest-defects-0.1.15-release.md`. Since then:

- **`0.1.15` shipped** (the `--version` CLI fix) and was independently
  verified from raw registry evidence plus a fresh install (Session
  4.29).
- **The orphaned-`.py` crash (D1) is fixed and shipped as `0.1.16`**
  (commit `a9bba99`, tagged and released this session, 2026-09-14).
  Verified end-to-end, not assumed: CI green on the fix commit and on
  the release commit (workflow-specific Actions page — the generic
  Actions page renders stale for this repo, a real tool limitation, not
  a shortcut taken); the release run's four jobs (`test`,
  `verify-artifact-contents`, `publish-npm`, `publish-pypi`) all
  succeeded; npm's `dist-tags.latest` and `gitHead` independently
  confirmed against the registry API; PyPI's project page independently
  confirmed `0.1.16` released today; a genuine fresh `pip install`
  and `npm install -g` on Yehor's own machine; and the actual regression
  case re-run live — a TypeScript project with one orphaned `.py` file
  and no `requirements.txt` now warns and continues (checks the `.ts`
  file, exit code `0`) instead of the old hard `exit 2`.
- **The vitest false positive (D2) remains disclosed-only, not fixed** —
  documented in `engine/python/README.md` since `a9bba99`; the TS
  resolver still doesn't follow cross-package re-exports. Unchanged,
  out of scope until explicitly picked up.
- **Separately, a public-exposure review of commit `cbb09ce`** found and
  remediated two real issues (a third-party email in a session log,
  redacted; a self-authored legal-gap PDF, untracked from public view) —
  see `MEMORY/critical-actions.md`, 2026-09-14 entry, and the new
  `EXPOSURE-CHECK-PROTOCOL.md`.
- **A presentation ("Bring this to a talk") shipped to `/demo`** the same
  session, for the Aarhus Claude Code Meetup (2026-09-17).

**FURTHER UPDATE, same day (2026-09-14), later in Session 4.30:**

- **Copenhagen (Wed Sept 16) trip: skipped, closed.** Yehor's decision.
  Nothing further to track here.
- **A second, distinct BOM-handling defect found and fixed — for real,
  not inferred.** During `0.1.16`'s own fresh-install verification, a
  `package.json` written by PowerShell's `Out-File -Encoding utf8`
  (which embeds a UTF-8 BOM) crashed `cli.py` with an unhandled
  `JSONDecodeError`. Reproduced directly (hex-confirmed `EF BB BF`
  prefix, exact traceback) in a clean scratch clone of the shipped
  `0.1.16` commit before any fix was written. While root-causing it,
  checked whether `knowledge_base.py`'s `requirements.txt` reader had
  the same exposure — it does, but silently: a BOM there doesn't crash,
  it makes the first pinned dependency's line silently fail its regex
  match and get skipped with no error at all. Same root cause, two
  failure shapes (one loud, one silent). Fixed both call sites with
  `encoding="utf-8-sig"`, added `engine/python/tests/test_bom_handling.py`
  (4 tests: BOM and no-BOM cases for both files), and ran the full suite
  against the patched clone (199 passed). The 31 other failures in that
  run are **pre-existing and unrelated** — confirmed identical on a
  fresh, completely unpatched clone of the exact shipped `0.1.16` commit
  (same 31 test names fail either way; looks like a `tree-sitter`
  native-binding/environment quirk in this sandbox, not something this
  project's own CI — which gates releases and passed — encounters).
  **Status: fix applied and verified on Yehor's actual disk
  (`engine/python/cli.py`, `engine/python/knowledge_base.py`,
  `engine/python/tests/test_bom_handling.py`), not yet committed.**
  Per Yehor's decision: commit to `main` now with a KS-TRACE-citing
  message, do **not** tag, ships in `0.1.17` after Thursday Sept 17.
  Push only on Yehor's explicit word.
- **Correction to the demo-slides status.** The guide-model chat's most
  recent message assumed the `/demo` presentation (`PitchSlides.tsx`,
  the `page.tsx` addition, the `globals.css` addition) was still
  uncommitted "in the tree." That's not correct — independently
  verified against git history: all three files are already committed
  to `main` and pushed, as part of commit `1592025` (the same commit
  that did the exposure remediation). There was nothing uncommitted to
  move to a branch. Separately verified and worth Yehor's attention
  before any deploy decision: (1) the diff for that commit touches only
  an import line and one new self-contained `<section>` in `page.tsx` —
  it does **not** touch the existing `<video>`/`.video-intro` section at
  all; (2) an exposure grep of every on-screen string in
  `PitchSlides.tsx` (all 8 slides' eyebrow/title/body/code text) found
  no third-party emails, names, or identifying details; (3) **being on
  `main` does not mean it's live** — this repo's web app deploys only
  via a manual `wrangler deploy` (or `pnpm run deploy`) that Yehor runs
  himself from his own machine (`web/wrangler.toml`,
  `RUNBOOK-LIVE-DEPLOYMENT.md`, `STAGE-1-DEPLOY-RUNBOOK.md` all confirm
  this; no GitHub Actions workflow deploys the web Worker on push). So
  the slides are safely committed and reviewable, but not yet in front
  of anyone visiting fixprove.dev, unless Yehor has deployed since
  `1592025` — going live remains entirely his own separate decision, to
  make after he and the guide-model chat have actually looked at it.
- **D2 (vitest cross-package re-export false positive): unchanged**,
  still disclosed-only, out of scope.
- **Standing rule for the rest of this week, per the guide model and
  Yehor's own decision: no more releases before Thursday Sept 17 unless
  the demo path itself is broken. `0.1.16` is the demo version.**

**SECOND FURTHER UPDATE, same night:** both BOM-fix commits are now on
`main` and pushed (`d55c20a`, `aaafaeb`) — pushing does not itself
release anything (`release.yml` only fires on a `v*.*.*` tag; none was
made), so this is still within the no-release-before-Thursday rule.

- **A second, real, higher-impact defect found the same night, this time
  by Yehor running `fixprove check .` against his own real `yehor.ai`
  repo** (his own idea, while figuring out how to demo the product —
  not a synthetic test). Found: `import { CSSProperties } from "react"`
  — completely valid, `tsc`-clean TypeScript, independently confirmed
  against the real compiler — flagged as `unresolved-symbol`. Root
  cause, confirmed against the real installed `@types/react@18.3.12`:
  11 real React 18 APIs (`CSSProperties`, `useId`,
  `useSyncExternalStore`, `useDeferredValue`, `useTransition`,
  `startTransition`, `useInsertionEffect`, `act`, `TransitionFunction`,
  `TransitionStartFunction`, `ModifierKey`) are declared with an
  explicit `export` keyword inside `declare namespace React {...}}`, a
  shape the existing namespace-member resolution never handled. Fixed
  in `ts_knowledge_base.py`, 2 new regression tests added, full suite
  232/232, and verified against the real `yehor.ai` repo from source
  (`python -m cli`) — clean. **Committed and pushed, same as the BOM
  fix** (`aaafaeb`), same low-risk reasoning (no tag, no release
  triggered). Not yet reflected in the published `0.1.16` package —
  your global `fixprove` command still shows the old behavior until a
  real release happens.
- **Correction to the earlier "31 pre-existing test failures" note**
  (from the BOM-fix entry above): that was mis-diagnosed as a
  "tree-sitter environment quirk." The real cause was simpler — two
  test-fixture directories needed their own `npm install`/`pip install`
  that hadn't been run in the verification sandbox. Once done, the full
  suite was 230/230 clean even before tonight's second fix. No product
  ambiguity there; just an incomplete setup step, now corrected for the
  record.
- **Open decision, still yours**: whether either or both of tonight's
  fixes justify a real release (version bump + tag) before Thursday
  under the "demo path is broken" exception, or whether both wait for
  `0.1.17` after. Nothing has been tagged or released without your
  word.

**THIRD FURTHER UPDATE, same night — guide model reversed its own
release-freeze stance, Yehor delegated the call:** decision recorded is
**0.1.17 ships Tuesday 2026-09-15**, stop-loss 20:00 CEST (freeze and run
Thursday on `0.1.16` + planted samples if not fully verified by then; tag
still needs your one-word go). No web deploy (`wrangler`), no `/demo`
copy change, before Thursday regardless.

- **Install verification done (real checks):** wheel matrix confirms a
  genuine Python 3.9 gap (not Mac-specific) for `tree-sitter` core and
  `tree-sitter-python` — no wheels on any platform, source build
  required. 3.10+ fully covered everywhere. `pipx run`/`pipx install`
  confirmed architecturally incompatible with FixProve's Python-side
  check (isolates the tool from the project being checked — flags real
  dependencies as missing, always) — **dropped from the install-copy
  plan**. `npx` confirmed fine as a Node convenience, but still needs
  Python 3.9+ + `pip install fixprove` underneath; both its fallback
  messages (no Python; Python but engine missing) are clean and
  actionable.
- **Video-section landmine guarded**: `page.tsx`'s empty `<video>`
  section (already live in `main`'s history, references a nonexistent
  `/demo-narration.mp4`) commented out, CSS untouched, `tsc`-verified.
- **All three of tonight's fixes are now committed AND pushed to
  `main`**: `d55c20a` (BOM), `aaafaeb` (React namespace/CSSProperties),
  `8590dc3` (video guard). None trigger a release on their own (no tag).
  Yehor independently confirmed the React fix from source
  (`python -m cli`) against the real `yehor.ai` repo that found it: clean.
- Remaining before Tuesday's release gate: CI green on HEAD including
  all three commits, then the full 0.1.17 sequence (manifest bump, tag on
  approval, raw publish logs, fresh install, and — important given
  `aaafaeb` touches the TS resolver — both planted samples must still be
  caught, not just the false positive resolved, as the false-negative
  check on that change).

**Session 4.30 close, `3c42c71`** — full formal close performed:
`KS-REPORT-4.30-bom-namespace-defects-0.1.16-close.md`, `PROGRESS.md`
backfill (4.29's own entry had been silently skipped at its close — a
real gap, found and fixed here, not silently) + full 4.30 entry,
`MEMORY/state.md` fully replaced, `NEXT-SESSION-4.31-STARTING-PROMPT.md`
written. `MAINTENANCE-PROTOCOL-browser.md`'s own first-run date corrected
in place (it said "Tuesday 2026-09-16" — a Wednesday; fixed to
2026-09-15). Independently re-verified at close, not just from Yehor's
pasted output: local `main`/`origin/main` both at `3c42c71` (direct
`.git/refs/*` read), CI green on that commit (58s), PyPI still `0.1.16`.

**FOURTH FURTHER UPDATE, same day — independent field verification of
the published `0.1.16` package, commissioned by Yehor via a separate
Claude Code Sonnet 5 session, then independently re-verified by this
session before being trusted (full report: `KS-REPORT-4.30-addendum-1-
field-verification.md`):**

- **EV-04 (React 19 `CSSProperties`) needs no new work.** Confirmed real
  on the *published* `0.1.16`; independently re-tested against the
  *already-fixed, unreleased* `aaafaeb` source with the field report's
  exact versions (React 19.2.7, `@types/react` 19.2.17) — the existing
  D6 fix already covers it. Ships the moment `0.1.17` does.
- **D8 (new) — Python from-import submodule resolution.**
  `from cryptography.hazmat.primitives.asymmetric import rsa`-shaped
  imports are flagged as unresolved on entirely correct code; confirmed
  by direct reproduction (root cause: `resolver.py:177-180` checks the
  imported leaf only against the top-level package's flat symbol list,
  never the actual submodule). Real, common (`cryptography`,
  `opentelemetry`, `typer.testing`, `fastapi.testclient` all affected).
  **Recommendation: disclose in `engine/python/README.md` as a known
  limitation for `0.1.17` (documentation only), do not attempt the real
  fix under Tuesday's stop-loss** — it needs the KB-build step to
  introspect actual submodule paths, a real design question. Yehor's
  call, not decided here.
- **D9 (new, small) — "no manifest found" returns exit `0`, not a
  distinct code.** Confirmed by direct reproduction: a Python project
  with no `requirements.txt` skips the check entirely and still exits
  `0`, indistinguishable from a genuine clean pass. Low-risk to fix (a
  `cli.py` exit-code branch) but changes the documented exit-code
  contract. Offered as an optional small addition to `0.1.17`; equally
  fine to defer — Yehor decides at the bump step, not assumed either
  way.
- Two smaller scope gaps (invented package names pass clean unless
  already pinned; `.gitignore` not respected when walking a directory)
  confirmed real, filed to backlog, not time-pressured.
- **My own error, caught by git's own output, not by me first:** I told
  Yehor to `git add` `PROGRESS.md` at Session 4.30's close — it's
  gitignored, same as `MEMORY/`. Git declined it safely; the close
  commit is correct as landed. New durable note filed:
  `PROGRESS.md` is gitignored despite sitting alongside tracked
  `NEXT-SESSION-*`/`KS-REPORT-*` files.

The P0 items immediately below (git-commit crisis, `0.1.14` bump) are
historical and already resolved — left in place per this file's own
"preserve the record, don't erase it" convention, not because they're
still open.

**UPDATE, 2026-09-11, session close (Session 4.28):** publish attempt
made tonight. npm succeeded (`fixprove@0.1.13` is live); PyPI failed
(`403 Forbidden`, root-caused as this project's PyPI being
Trusted-Publishing-only — see the new P0 item below). **Separately, and
more urgently: nothing this session or the last has ever been
git-committed** (`device_bash` down all session; Yehor's own commit
attempt ran from the wrong directory and failed). Both are now the top
two P0 items, ahead of the customer self-test. Full detail:
`KS-REPORT-4.28-video-demo-p0-cli-verification-publish-mismatch.md`.

---

## P0 — blocking, before Sept 16 (AI Tinkerers) and Sept 17 (Aarhus meetup)

- [ ] **NEW, HIGHEST PRIORITY, 2026-09-11 session close: git-commit and
      push everything, from `D:\Dev\Projects\FixProve` (not a scratch
      folder).** Confirmed tonight: nothing from Session 4.27's two P0
      CLI fixes, and nothing from Session 4.28's own work (video demo
      section, CSS fix, both backlogs), has ever been `git commit`ed —
      `device_bash` was down the entire session, so no git command was
      ever run by the assistant. A real, live, publicly published npm
      package (`fixprove@0.1.13`) currently has no corresponding git
      history at all. Run: `cd D:\Dev\Projects\FixProve`, then `git
      status` (review what's changed before staging anything), `git add
      -A`, `git commit -m "<clear message>"`, `git push origin <branch>`
      (confirm which branch you're on first — `git branch --show-current`
      — before pushing). **Do this before the version bump below**, so
      the bump itself lands as a clean, reviewable commit on top of
      everything else, not tangled up with it.
- [ ] **NEW, 2026-09-11 session close: bump to a fresh `0.1.14` and
      release via the proper CI path — do not retry `twine upload` or
      push a `v0.1.13` tag.** npm `fixprove@0.1.13` is live (published
      manually tonight, no `--provenance`); PyPI is still `0.1.12` — the
      `twine upload dist/*` attempt failed with `403 Forbidden`.
      Root-caused via a live fetch of `https://pypi.org/project/fixprove/`
      (confirms `0.1.12` was "published via trusted publishing") and a
      direct read of `.github/workflows/release.yml`: this project's
      PyPI is configured Trusted-Publishing (OIDC) only, so a manual
      token upload was never going to work — not a bad token, a
      deliberately closed door (originally closed after a real PyPI
      token leak, documented in that workflow's own comments). The only
      supported publish path is a `v*.*.*` git tag push, which triggers
      CI to publish both PyPI and npm via OIDC. **Do not push a
      `v0.1.13` tag** — that version is already live on npm, and this
      project has already hit the exact mirror-image of that mistake
      once before (npm shipped while PyPI failed on a duplicate,
      permanently burning that npm version — documented in `release.yml`
      itself). Instead: bump `cli/package.json` and
      `engine/python/pyproject.toml` to `0.1.14` together, commit (after
      the item above), push to `main`, then `git tag v0.1.14 && git push
      origin v0.1.14`. Watch the Actions run for both `publish-pypi` and
      `publish-npm` to go green, then re-verify with a fresh `pip install
      fixprove` and `npm install -g fixprove` — that fresh-install check
      is the real close, not the tag push alone.

All three items below need Yehor's own machine — `device_bash` on the
FixProve mount is down (Sept 8 Windows-update issue, unresolved as of
this session).

- [x] **Fix npm `--version` — FIXED and RE-VERIFIED 2026-09-11, needs your
      build/test to close.** `cli/src/index.ts` had `.version("0.1.0")`
      hardcoded while `cli/package.json` was at `0.1.12` (now `0.1.13`,
      see below). Rewired to read `package.json`'s own version at runtime,
      resolved relative to the compiled module's own location, not
      `process.cwd()`. Added `cli/test/version.test.ts`. Re-checked twice
      more this session: (1) confirmed directly from `cli/package.json`
      that `"type": "module"` is present, so the `import.meta.url` used by
      the fix is valid ESM, not a compile-time risk; (2) confirmed the
      `test` script (`node --test dist/test/*.test.js`) does NOT run
      `build` first — you must run `npm run build` before `npm test`, or
      the test fails on a missing-file error that looks like a real bug
      and isn't. **Still not closed:** this sandbox has no npm/PyPI
      registry access at all (confirmed twice — both `npm install` and
      `pip install`/`pip download` of ordinary, unrelated packages fail
      here), so the actual compiled build has never been run. The
      runtime logic itself WAS verified — directly, with plain Node,
      against the real `cli/package.json` — not just assumed correct.
      Run: `cd cli && npm run build && npm test && node dist/src/index.js
      --version` → expect `0.1.13`.
      **CLOSED for real, 2026-09-11, same session, on Yehor's own
      machine.** `pnpm --filter ./cli build` succeeded; `node
      cli\dist\src\index.js --version` printed exactly `0.1.13`, byte-for-
      byte match against `cli/package.json`. Separately: `pnpm --filter
      ./cli test` surfaced 5 *unrelated* failures in
      `check.stub.test.ts` (a pre-existing Windows-portability gap in that
      test file's own POSIX-shebang stub mechanism, nothing to do with
      this fix) — filed as `CLI-STUB-TEST-WINDOWS-GAP-backlog.md`, not
      fixed tonight, correctly reclassified as non-P0 (it tests a mock,
      not the product). The one test this fix actually owns,
      `"fixprove --version reports the same version as package.json"`,
      passed. This item is done.
- [x] **CLI syntax divergence — DECIDED 2026-09-11 (your call, via the
      guide chat: option (b)), IMPLEMENTED and test-verified this
      session.** Confirmed live against fixprove.dev: its own install
      block shows `fixprove check /path/to/your/project` after BOTH the
      pip and npm install lines — so the site's own promise was false for
      pip-only users, which is why "leave it as two different forms" (a)
      lost to "make pip accept `check` too" (b). Implemented in
      `engine/python/cli.py`: `main()` now strips an optional leading
      `"check"` token from argv before parsing, so `fixprove check <path>`
      and `fixprove <path>` behave identically; the bare form is fully
      preserved (hard backward-compat requirement). Added
      `engine/python/tests/test_cli_check_token.py` and ran it in this
      sandbox against the REAL `cli.py` logic (not a mock).
      **Second-pass catch, 2026-09-11 (guide chat, independently
      re-verified here before acting on it, not taken on trust):** the
      first version of this fix left one real gap — `fixprove check` with
      NO path at all raised an uncaught argparse `SystemExit(2)` on pip,
      while npm's `.argument("[path]", ..., ".")` makes the same bare
      command succeed, defaulting to `.`. Confirmed directly by actually
      running `main(["check"])`, not just tracing the code — it really
      did raise `SystemExit(2)`. Fixed: `path` now takes `nargs="?",
      default="."`, matching npm exactly. One discovered side effect,
      purely additive and harmless: a fully bare `fixprove` (pip, zero
      args, no `check`, no path) now also defaults to `.` and succeeds,
      where before it required a path — nothing that worked before still
      works differently, this only makes a previously-erroring case
      succeed. Test suite is now 6/6, all passing in-sandbox against real
      `cli.py` logic. Bumped both packages to
      `0.1.13` in tandem (`engine/python/pyproject.toml`,
      `cli/package.json`) so they ship the same number together.
      `engine/python/README.md` updated to document both forms now work.
      Root `README.md` and `cli/README.md` were NOT touched — checked
      both, and their existing `fixprove check ...` install text is now
      simply TRUE as a result of this fix, so editing them would have
      been unnecessary churn. **Still not closed:** same npm/PyPI
      registry-access gap as above — `pip install -e .` and a real
      `pytest` run against the published package have not happened; the
      in-sandbox test run used stubbed `tree_sitter`/`tree_sitter_python`
      bindings (mocked purely to get past an unrelated import, not
      touching anything this fix's logic depends on) since those can't be
      installed here either. Run on your machine: `cd engine/python && pip
      install -e . --break-system-packages && python -m pytest
      tests/test_cli_check_token.py -v` → expect 5 green, then `fixprove
      check <sample> --requirements <req>` and `fixprove <sample>
      --requirements <req>` on `examples/meetup-demo-2026-09-17/
      python-sample/` → expect identical output, then publish both
      packages at `0.1.13` only after both machine-side gates pass.
      **CLOSED for real, 2026-09-11, same session, on Yehor's own
      machine.** `pip install -e .` genuinely compiled and installed real
      `tree-sitter`/`tree-sitter-typescript` native wheels (upgrading an
      existing `tree-sitter 0.25.2` to the `0.26.0` this project pins) —
      the exact gap no sandbox run could ever close. `pytest
      tests/test_cli_check_token.py -v` → **6 passed**, including the
      second-pass no-path fix's own dedicated test,
      `test_check_token_alone_defaults_to_current_directory`. Then a real
      end-to-end smoke test via the actual installed `fixprove` console
      script (not `python -m cli`, not pytest's in-process calls) against
      a fresh sample: `fixprove check C:\Temp\fp-smoke` →
      `No unresolved symbols found.`, `$LASTEXITCODE` → `0`, both exactly
      as expected. This item is done — both packages are confirmed
      correct on real Windows hardware, real compiled dependencies, real
      installed entry points. Publishing both at `0.1.13` is now
      Yehor's call to make, not blocked by anything found tonight.
- [ ] **Customer self-test** — clone 3 real, unplanted, AI-assisted
      Python repos from GitHub (look for `pandas`/`fastapi` in
      requirements.txt, or signs of heavy AI-generated commits). For
      each: `git clone`, install that repo's own dependencies, run
      `fixprove check . --requirements requirements.txt`, record what it
      flags and whether each flag is real. This is the only unscripted
      proof point before either event.

**Why P0, not just P1:** per Travis Mathers's 2026-09-11 advice, both
events are now framed as rooms where small Danish customers who could
fund the legal-review chain might actually be standing — a broken
command or a stale version string in a live demo is no longer just
embarrassing, it risks the customer that unblocks everything else.

---

## P1 — this week, no hard deadline but time-sensitive

- [ ] **Travel-time check (Sept 16 evening)** — confirm the last direct
      Copenhagen H → Aarhus departure after ~20:00 on rejseplanen.dk or
      the DSB app. Not resolved by the executor (live-schedule tools
      weren't reachable this session). Matters because the expo-table
      format means the valuable conversations cluster late in the
      17:00–21:00 window — don't let an early departure cut it short.
- [x] **AI Tinkerers Sept 16 format — RESOLVED 2026-09-11.** Expo-table,
      one-on-one only, not a stage talk. Confirmed by Gökhan's own
      2026-09-11 06:24 CEST reply, read in full. Only one pitch version
      needs prepping — see the expo-table script already drafted in
      this chat.
- [ ] **NemKonto / Nordea business account — needs your MitID, and it's
      stuck in a request-more-info loop, not just "pending."** Fresh
      re-check this session found: Nordea asked for more information
      twice (2026-09-04 and 2026-09-09, both "Vi har brug for mere
      information fra dig"), you apparently responded once (2026-09-04,
      "Tak for din opfølgning" confirms it), then Nordea asked *again*
      on 09-09, and a 09-10 nudge says the application is still
      unfinished. Worth logging into Nordea directly to see exactly
      what's being asked for now, rather than assuming your 09-04 reply
      already covered it.

---

## Scheduled — dated commitments

- [x] **Monday 2026-09-14 — nudge Augustin Gottlieb** (Aarhus meetup
      logistics: Show & Tell duration, screen-share vs. on-stage).
      **RESOLVED same day (2026-09-11), nudge no longer needed** —
      Augustin replied on his own, on LinkedIn (still zero Gmail trace,
      consistent with the exchange being LinkedIn-only): confirmed a
      10-15 minute mini demo slot, to be added to the event's PPT. Reply
      drafted by the executor and sent by Yehor personally on LinkedIn —
      **Yehor-reported as sent ("Sended"), not independently verified**,
      same standing as every other LinkedIn send this project (no
      LinkedIn access tool exists in this session to check directly; see
      KS-REPORT-4.27 §1 for the identical precedent on this exact
      contact).

- [x] **Aarhus Claude Code Meetup #3 slot — DECIDED 2026-09-11.** Augustin
      confirmed a 10-15 minute mini-demo slot, but Yehor's explicit call:
      keep the demo itself at 5 minutes max, unchanged from the existing
      kit (`CHEAT-SHEET.md`'s 7 beats) — no new content needed. The
      remaining 5-10 minutes of the slot is reserved for live Q&A and
      conversation, consistent with Travis Mathers's 2026-09-11 advice to
      prioritize real conversations with potential small Danish customers
      over filled airtime. Supersedes the earlier-floated "expand demo
      content for the real 10-15 minute slot" idea — considered and
      explicitly declined, not left open.

---

## Needs Yehor's explicit word before anything happens

- [ ] **Publish v1 Privacy Policy / Terms of Service** — the deep-
      research report's Part 4 (`FixProve-Competitive-Legal-Deep-
      Research-2026-09-09.md`, now in the repo) gives concrete default
      wording directions for what's safely publishable now on a free
      service vs. what must wait for counsel until charging starts.
      **Nothing gets published to fixprove.dev on this basis without a
      separate, explicit go-ahead from Yehor** — same publish-class
      boundary as every prior deploy this project.
- [ ] **IVSR follow-up (Defect 5)** — the 2026-09-08 reply's body text
      still asks for an extension to sign a waiver that was already
      attached, signed. Either a one-line clarification or leaving it
      stand is fine — just needs a conscious choice, not silence.
- [ ] **Sign `KS-REPORT-4.27-*.md` §5** — dated addendum per this
      project's convention (4.12-C/4.25/4.26 precedent), not an edit to
      the report's own text.

---

## Passive watch — no action needed, re-checked and still quiet

- ~~Augustin Gottlieb's reply — zero Gmail trace (expected, LinkedIn-only).~~
  **No longer applicable — moved above, resolved 2026-09-11**: he replied
  on LinkedIn directly, format confirmed (10-15 min mini demo, added to
  the PPT).
- Grant application confirmation email — still not found, no stated
  review timeline exists.
- GTM outreach threads: Cernel, WasteHero, Kondrup — zero trace on all
  three, re-checked by name this session. Worth treating as possibly
  dead rather than just quiet. AarhusJS (Lars Brink Nielsen) is the only
  one with any activity, and that's from Aug 19–20.

---

## Blocked on environment, not on Yehor

- [ ] **`device_bash` (shell/git access on the FixProve mount)** — down
      since Sept 8, attributed to a Windows update, unresolved as of
      this session's last check. Blocks: clearing stale `.git/*.lock`
      files, `git rev-parse main origin/main` verification, any local
      build/test the sandbox itself would run. File-level ops
      (`device_list_dir`/`device_stage_files`/`device_commit_files`)
      work fine and don't need this to be fixed.

---

## Housekeeping — low priority, no deadline

- [ ] Delete `_tmp_8_3f2d545c030f0e83cae5c6d82e8ff73e` and
      `_tmp_8_8570aac0eff6e414c6a0b187c361ac02` (empty leftover files
      from a failed sandbox `pnpm install`, harmless).
- [ ] Decide `AGENTS.md`'s fate — timestamped 2026-09-04, never in git
      history, origin genuinely unknown. Delete, `.gitignore`, or commit
      it once its origin is known or judged irrelevant.
- [ ] Delete the two `*-CONTAMINATED-DO-NOT-SHIP` folders in the outputs
      directory via Windows Explorer — not fixable from the sandbox.
- [ ] **The demo kit's `CHEAT-SHEET.md` needs a manual check before Sept
      16/17 — location genuinely unconfirmed this session.** Per
      `KS-REPORT-4.26`, it was delivered to "Yehor's outputs folder" as
      `fixprove-meetup-2026-09-17/CHEAT-SHEET.md` — that's OUTSIDE the
      `D:\Dev\Projects\FixProve` mount this session can see (confirmed:
      it's not anywhere in the repo tree checked this session), so its
      exact path is unknown here. If it documents the pip/npm syntax
      split as a "gotcha" to watch for, that section is now stale once
      you build/publish `0.1.13` (both P0 items above) — find it and
      strike that section before reading it on the day.

---

## Already closed this session (2026-09-11) — for the record, not to re-do

- [x] Bridge record written for the 2026-09-09 chat-only Funding
      Incubator session (`session-logs/SESSION-LOG-2026-09-09-funding-
      incubator-chat-only.md`).
- [x] All three chat-only-track source documents committed to the repo
      root: `FixProve-Funding-Incubator-Session-Notes-2026-09-08.md`,
      `FixProve-vFault-Legal-Diligence.pdf`,
      `FixProve-Competitive-Legal-Deep-Research-2026-09-09.md`.
- [x] vFault pricing correction independently verified (live fetch,
      2026-09-11) and recorded as an addendum, original PDF untouched.
- [x] Content-strategy idea (Instagram pain-points → YouTube tutorials,
      from the 2026-09-11 Travis call) filed as backlog, explicitly not
      started — `CONTENT-STRATEGY-instagram-youtube-backlog.md`.
- [x] AI Tinkerers Sept 16 time AND format both resolved and verified.

---

## Order of operations, if followed strictly top to bottom

1. ~~**npm side**~~ — **DONE, 2026-09-11.** `pnpm --filter ./cli build`
   passed; `node cli\dist\src\index.js --version` printed `0.1.13`, exact.
2. ~~**pip side**~~ — **DONE, 2026-09-11.** `pip install -e .` compiled
   real `tree-sitter`/`tree-sitter-typescript` wheels; `pytest
   tests\test_cli_check_token.py -v` → 6/6 green; a real end-to-end
   console-script smoke test (`fixprove check C:\Temp\fp-smoke`) →
   `No unresolved symbols found.`, exit `0`. Both machine-side gates
   pass.
3. ~~**Publish both, now unblocked**~~ — **ATTEMPTED 2026-09-11, PARTIAL:
   npm succeeded, PyPI failed.** `npm publish` shipped `fixprove@0.1.13`
   live (the `bin` warning it printed is a confirmed false alarm — the
   published package installs and runs correctly). `twine upload dist/*`
   failed with `403 Forbidden` — root-caused, not a bad token: this
   project's PyPI is Trusted-Publishing-only (see the new P0 item at the
   top of this file). **Do not retry `twine upload`.** The real next step
   is the new P0 items above: git-commit everything first, then bump to
   a fresh `0.1.14` and release both packages together through the
   tag-triggered CI workflow. Once that lands, come back to the
   fresh-venv + fresh-`npm i -g` re-check this step originally called
   for — that's still the real close, just against `0.1.14` now, not
   `0.1.13`.
4. Customer self-test — 3 real repos, against the published `0.1.14`
   once it exists (not `0.1.13`, and not a local dev build — see
   sequencing note originally written here, same logic still applies).
5. Find and update the demo kit's `CHEAT-SHEET.md` if it calls the
   syntax split a gotcha (location unconfirmed this session, see
   Housekeeping).
6. Travel-time check (2 minutes).
7. Log into Nordea directly to see the current ask, rather than assume.
8. ~~Nudge Augustin~~ — **done, and now moot**: he replied on his own
   (2026-09-11, LinkedIn), confirming a 10-15 min mini demo slot for the
   Sept 17 Aarhus event, to go in his PPT. No Monday nudge needed.
9. Everything else is either scheduled, watch-only, or waiting on your
   word — nothing else is time-pressured this week.

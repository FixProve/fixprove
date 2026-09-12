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

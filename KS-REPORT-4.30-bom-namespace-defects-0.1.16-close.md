# KS-REPORT 4.30 — 0.1.16 Release, Two Real Defects Found and Fixed
# (BOM Parsing, React Namespace Exports), a Production-Landmine Guard,
# and a Standing Browser-Based Maintenance Protocol

## 1. Provenance

Session opened per `NEXT-SESSION-4.30-STARTING-PROMPT.md` (Session 4.29
close, 2026-09-13). `device_bash` remained down the entire session —
**fifth consecutive session** with this gap (Sept 8 Windows-update mount
issue, unresolved) — reconfirmed at this close (`cd $HOME/mnt && ls`
failed with the identical sandbox-helper mount error). Every file-level
verification and transplant this session, start to close, went through
`device_list_dir` / `device_stage_files` / `device_commit_files` only.

Work performed, in the order it happened:

1. Shipped release **0.1.16** (the orphaned-`.py` crash fix carried in
   from Session 4.29, commit `a9bba99`): version bump, tag `v0.1.16`
   (commit `98930e2`), CI green on both the fix and release commits via
   the workflow-specific Actions page, all four release jobs (`test`,
   `verify-artifact-contents`, `publish-npm`, `publish-pypi`) succeeded,
   npm and PyPI both independently confirmed live, fresh installs
   re-verified the actual regression case fixed. Full detail and
   evidence for this step is in this session's own contemporaneous
   tracker entry (`FIXPROVE-PRIORITY-TRACKER-2026-09-11.md`, "UPDATE,
   2026-09-14 (Session 4.30)" block) — carried into this report by
   reference rather than re-verified from scratch at close, since it was
   already checked against raw evidence at the time.
2. During 0.1.16's own fresh-install verification, found a **second,
   distinct BOM-handling defect** (D5 below): a `package.json` written
   by PowerShell's `Out-File -Encoding utf8` (embeds a UTF-8 BOM)
   crashed `cli.py` with an unhandled `JSONDecodeError`. Reproduced
   directly in a clean scratch clone of the shipped `0.1.16` commit
   (hex-confirmed `EF BB BF` prefix, exact traceback) before writing any
   fix. Checked `knowledge_base.py`'s `requirements.txt` reader for the
   same exposure — found it, silent rather than loud (BOM makes the
   first pinned dependency's line fail its regex match and get skipped
   with no error). Fixed both call sites (`encoding="utf-8-sig"`), added
   `engine/python/tests/test_bom_handling.py` (4 tests), ran the full
   suite against the patched clone. Committed `d55c20a`, pushed by
   Yehor.
3. **Initially mis-diagnosed 31 other failing tests in that run as "a
   tree-sitter native-binding/environment quirk."** Corrected explicitly
   later the same session (not quietly reworded): the real cause was two
   test-fixture directories (`ts_corpus/`, `corpus/`) that had never had
   their own `npm install`/`pip install` run in this session's
   verification sandbox. Once installed, the full suite ran 230/230
   clean on an unpatched clone too — no product ambiguity, an
   incomplete setup step on this session's part.
4. Yehor, exploring how to demo the product, ran `fixprove check .`
   against his own real, live `yehor.ai` repository (his own idea, not a
   planted test) and got three `unresolved-symbol: react.CSSProperties`
   findings on a completely valid, `tsc`-clean import. Before reporting
   this either way, independently reproduced it in a controlled
   `react@18.3.1` + `@types/react@18.3.12` install and confirmed against
   the real TypeScript compiler that the code was correct and FixProve
   was wrong.
5. Root-caused precisely: `ts_knowledge_base.py`'s
   `_namespace_member_names` matched namespace-body declarations only
   when they appeared directly as children of the namespace body; it
   never unwrapped an `export_statement` wrapper node, which is what
   tree-sitter produces for a namespace member declared with an explicit
   `export` keyword. 11 real React 18 APIs are declared this way inside
   `declare namespace React {...}` in the installed `@types/react`,
   including `CSSProperties`. Fixed by unwrapping one `export_statement`
   level, mirroring a technique already used at module scope elsewhere
   in the same file. Added 2 regression tests, ran the full suite
   (232/232), and re-verified against the real `yehor.ai` repo from
   source (`python -m cli`) — clean. Committed `aaafaeb`, pushed by
   Yehor. Yehor independently confirmed the fix himself from source
   against the exact repo that found it.
6. Found, while reviewing the demo page ahead of Thursday's meetup, that
   `web/src/app/demo/page.tsx` (already live in `main`'s history, not
   new this session) contains an empty `<video>` element referencing
   `/demo-narration.mp4`, which does not exist anywhere in this repo
   (`web/public/` confirmed to contain only `og-image.png`). No
   `wrangler deploy` has run since this landed, so nothing is broken in
   production yet — but the next deploy of `main` as it stood would ship
   a source-less video player onto exactly the page a QR code is about
   to send a room of strangers to at Thursday's meetup. Guarded by
   wrapping the section in a JSX comment (not deleting it), verified the
   result compiles cleanly with a real `tsc --noEmit`. Committed
   `8590dc3`, pushed by Yehor.
7. Performed genuine install-path verification ahead of Tuesday's
   Python-floor decision: built a wheel-availability matrix from raw
   PyPI JSON file listings (not assumed) showing `tree-sitter` core and
   `tree-sitter-python` have zero wheels for `cp39` on any platform —
   a version gap, not a platform gap as first assumed — while 3.10+ is
   fully covered everywhere. Directly tested `pipx run`/`pipx install`
   against fresh directories with cleared caches and confirmed it is
   **architecturally incompatible** with this tool's Python-side
   dependency check (isolates the tool from the project being checked,
   so it always reports real dependencies as missing) — this reverses an
   earlier "pipx is elegant" recommendation. Traced `npx`'s two fallback
   messages in `cli/src/commands/check.ts` to source and confirmed both
   are clean and actionable.
8. Authored `MAINTENANCE-PROTOCOL-browser.md` — a standing, read-only
   9-item watch list (CI, release, PyPI, npm, live site, Gmail by name,
   LinkedIn as Yehor-reported-only, competitor pricing, Companies House)
   with sources, cadences, and done-criteria, to run at every session
   start and after every push/tag/deploy. Directly confirmed, before
   writing it in as fact, that a non-browser fetch to `npmjs.com/package/
   fixprove` genuinely returns HTTP 403 (not a rendering quirk) —
   justifying that one item's browser-only requirement. Committed
   `6ff5f16`, pushed by Yehor.
9. Synced `FIXPROVE-PRIORITY-TRACKER-2026-09-11.md` (tracked, public)
   with all of the above — it had been sitting locally modified,
   unstaged, discovered via `git status` after the protocol commit.
   Committed `7b7e1f8`, pushed by Yehor.
10. **This close (2026-09-14, same session):** independently re-verified
    the full push chain rather than relying only on Yehor's pasted
    terminal output. Read `.git/refs/heads/main` and
    `.git/refs/remotes/origin/main` directly off Yehor's disk via
    `device_stage_files` — both `7b7e1f8ab4800be4ec76b9b1117a7abd58a26f5d`,
    matching the reported push exactly. Fetched the workflow-specific CI
    Actions page directly: HEAD `7b7e1f8` on `main` shows **Success**
    (43s). Queried PyPI's own JSON API directly: version still `0.1.16`,
    `requires_python` still `>=3.9` — confirming no accidental release
    drift from tonight's docs-only commits. While re-reading
    `MAINTENANCE-PROTOCOL-browser.md` for this close, caught that its own
    KS-TRACE test line named the wrong weekday ("Tuesday 2026-09-16" —
    2026-09-16 is a Wednesday; Tuesday is 2026-09-15). Corrected in
    place, same commit bundle as this close's other file writes.

## 2. Verification table

| # | Claim / result | Method | Verdict |
|---|---|---|---|
| 1 | Release 0.1.16 fully shipped and verified | This session's own contemporaneous tracker entry (raw CI/registry checks made at the time) | CONFIRMED, by reference — not re-derived at close |
| 2 | BOM-parsing crash in `cli.py` is real | Reproduced in a clean scratch clone of shipped `0.1.16`; hex-confirmed `EF BB BF` prefix, exact `JSONDecodeError` traceback | CONFIRMED |
| 3 | Same root cause silently corrupts `knowledge_base.py`'s requirements parsing | Read the actual regex-match code path directly; confirmed a BOM'd first line fails the match and is skipped with no error | CONFIRMED |
| 4 | BOM fix works, no regressions | Patched clone: 4 new tests green; full suite (once fixtures properly installed) 230/230 | CONFIRMED |
| 5 | `react.CSSProperties` false positive is real, not a FixProve mistake in reading a genuine issue | Controlled `react@18.3.1`/`@types/react@18.3.12` install, compiled the exact import with real `tsc` — clean | CONFIRMED (the false positive is FixProve's, not React's) |
| 6 | Root cause is `_namespace_member_names` not unwrapping `export_statement` | Read the installed `@types/react` `.d.ts` and the tree-sitter AST directly; found 11 affected symbols, not just `CSSProperties` | CONFIRMED |
| 7 | React fix works, no regressions | Patched clone: 2 new tests green; full suite 232/232; re-run against the real `yehor.ai` repo from source (`python -m cli`) — clean | CONFIRMED, independently re-confirmed by Yehor himself |
| 8 | Fix not yet reflected in the published `0.1.16` package (source-only until 0.1.17) | Yehor re-ran the globally-installed `fixprove check .` (still old behavior) vs. `python -m cli` from source (fixed) | CONFIRMED, expected |
| 9 | Video-section landmine is real | `device_list_dir` on `web/public/` confirmed only `og-image.png` exists; `/demo-narration.mp4` referenced but absent | CONFIRMED |
| 10 | Video guard compiles cleanly, no other markup disturbed | Real `tsc --noEmit` against the modified `page.tsx`; my own reconstructed diff (GitHub diff/API access blocked this session) showed exactly 24 insertions, 0 deletions | CONFIRMED |
| 11 | `tree-sitter` core / `tree-sitter-python` have zero cp39 wheels, any platform | Raw PyPI JSON file listings for both packages, all platform tags | CONFIRMED — version gap, not platform gap |
| 12 | `pipx run`/`pipx install` architecturally cannot see a project's real installed packages | Direct, repeated testing: fresh directories, cleared `.fixprove_cache`, both `pipx run` and `pipx install` paths | CONFIRMED — reverses this session's own earlier "pipx is elegant" recommendation |
| 13 | `npmjs.com/package/fixprove` genuinely 403s non-browser fetches | Direct `WebFetch` attempt against the URL | CONFIRMED — not a rendering quirk, browser tool genuinely required |
| 14 | Three commits (`d55c20a`, `aaafaeb`, `8590dc3`) plus two more (`6ff5f16`, `7b7e1f8`) are genuinely on `origin/main` | *At the time*: Yehor's pasted `git log`/`git push` terminal output only (`device_bash` down, no independent fetch performed in-session) | ACCEPTED as chain-of-custody at the time — see row 16 for this close's independent confirmation |
| 15 | Full session's technical record is internally consistent | Cross-read `FIXPROVE-PRIORITY-TRACKER-2026-09-11.md`'s own "UPDATE"/"FURTHER UPDATE" blocks against this report's §1 before finalizing either | CONFIRMED, no discrepancy found |
| 16 | **(This close, 2026-09-14)** local `main` and `origin/main` both genuinely point to `7b7e1f8` | Read `.git/refs/heads/main` and `.git/refs/remotes/origin/main` directly off Yehor's disk via `device_stage_files` (not `git log` text) | CONFIRMED — `7b7e1f8ab4800be4ec76b9b1117a7abd58a26f5d`, byte-identical in both files |
| 17 | **(This close)** CI is green on that exact commit | Fetched the workflow-specific Actions page directly (not the generic `/actions` index, confirmed stale for this repo in prior sessions) | CONFIRMED — "workflow conclusion" tier: Success, 43s. Raw job log not opened — not a release, low-stakes docs/protocol commit |
| 18 | **(This close)** no accidental release drift from tonight's docs-only pushes | Direct query of PyPI's own JSON API | CONFIRMED — version still `0.1.16`, `requires_python` still `>=3.9`. npm not checked tonight (browser-tool-only per the protocol just authored) — deferred to Tuesday's first pass |
| 19 | **(This close)** `MAINTENANCE-PROTOCOL-browser.md`'s own test line names the correct weekday | Plain date arithmetic: 2026-09-16 is a Wednesday | **REJECTED, corrected** — the file said "Tuesday 2026-09-16"; fixed to "Tuesday 2026-09-15" in the same close |

## 3. Defects caught and fixed

- **D5 — BOM-handling defect, two failure shapes (real, found during
  0.1.16's own fresh-install verification).** A `package.json` or
  `requirements.txt` written with a UTF-8 byte-order mark (the default
  of several common Windows tools, including PowerShell's `Out-File
  -Encoding utf8`) either crashes `cli.py` outright (`JSONDecodeError`)
  or silently drops the first pinned dependency in
  `knowledge_base.py`'s requirements parsing, with no error at all. Both
  call sites fixed with `encoding="utf-8-sig"`; 4 regression tests
  added. **Status: fixed and pushed to `main` (`d55c20a`), NOT tagged —
  ships in `0.1.17` (Tuesday 2026-09-15).**
- **D6 — React namespace export-wrapped member flattening (real, found
  by Yehor's own initiative against a real production repo, not a
  synthetic test).** `export interface CSSProperties {...}` and 10 other
  React 18 APIs declared with an explicit `export` keyword inside
  `declare namespace React {...}` were never recognized as namespace
  members, because the flattening logic never unwrapped the
  `export_statement` wrapper node tree-sitter produces for that shape.
  Fixed by unwrapping one level, mirroring an existing module-scope
  technique in the same file; 2 regression tests added; full suite
  232/232; re-verified against the real repo that found it, from source.
  **Status: fixed and pushed to `main` (`aaafaeb`), NOT tagged — ships in
  `0.1.17` (Tuesday 2026-09-15).**
- **D7 — production-content landmine, not a code defect (real,
  pre-existing in `main`'s history, caught before it could ship).** An
  empty, source-less `<video>` element on `/demo` — the exact page a QR
  code is about to send a room of strangers to on Thursday — referencing
  an asset that does not exist in this repo. Guarded, not deleted:
  wrapped in a JSX comment, `tsc`-verified, trivially reversible once the
  real `.mp4` exists. **Status: guarded and pushed to `main` (`8590dc3`).
  No `wrangler deploy` has run or will run before Thursday regardless.**
- **Self-correction #1 (methodology, not a product defect) — this
  session's own initial misdiagnosis.** 31 failing tests were first
  attributed to "a tree-sitter native-binding/environment quirk"; the
  real cause was two uninstalled test-fixture dependency sets in this
  session's own verification sandbox. Corrected explicitly in the
  tracker's own record, not quietly reworded — same discipline Session
  4.29 applied to its own two false alarms (§6 there).
- **Self-correction #2 (methodology, not a product defect) — caught this
  close.** `MAINTENANCE-PROTOCOL-browser.md`, authored earlier this same
  session under the same rigor, named the wrong weekday for its own
  first scheduled run ("Tuesday 2026-09-16" — a Wednesday). Corrected in
  place. Worth stating plainly: the standard that catches an unfounded
  claim applies exactly as well to a plain date typo in a document this
  session wrote itself minutes earlier — nothing produced here is exempt
  from the same check.

## 4. Known limitations — read this section first

- **`device_bash` has now been down for five consecutive sessions**
  (Sept 8 Windows-update mount issue, unresolved). Every verification
  this session, start to close, went through `device_list_dir`/
  `device_stage_files`/`device_commit_files` only.
- **Neither D5 (BOM) nor D6 (React namespace) is in any tagged or
  published release.** Both are on `main` only; they ship together as
  `v0.1.17`, Tuesday 2026-09-15, alongside the `requires-python` floor
  change to `>=3.10`.
- **npm was not checked at this close** — the maintenance protocol
  requires the browser tool for that registry (confirmed genuine 403 to
  non-browser fetches); PyPI was checked directly and shows no drift.
  npm's check is folded into Tuesday's first full pass instead.
- **D2 (vitest cross-package re-export false positive, from Session
  4.29) remains disclosed-only, unchanged, untouched this session.**
- **A `PROGRESS.md` gap was found this close.** Session 4.29's close
  correctly rotated `MEMORY/state.md`, but did not append an entry to
  `PROGRESS.md` — its last entry is still Session 4.28's close. Backfilled
  this close from `KS-REPORT-4.29`'s own account (a primary source, not
  reconstructed from memory), flagged explicitly here rather than
  silently patched.
- **Two items remain entirely Yehor's own responsibility, unconfirmed as
  of this close:** the dress rehearsal on his actual demo laptop, and
  locating and fixing the stale pip/npm syntax-gotcha section in
  `CHEAT-SHEET.md` (its location is outside the `D:\Dev\Projects\
  FixProve` mount this session can see, per `KS-REPORT-4.26`).
- **The Gökhan (AI Tinkerers) withdrawal note is recorded as
  Yehor-reported sent, not independently verifiable** — no tool exists
  for that channel, same standing as every other LinkedIn-adjacent send
  this project.

## 5. Accountability statement — PENDING SIGNATURE

No CA-class action was taken directly by this session's assistant. Every
commit and push this session (`d55c20a`, `aaafaeb`, `8590dc3`, `6ff5f16`,
`7b7e1f8`), and the `v0.1.16` tag/release earlier the same session, were
executed by Yehor personally, from his own machine, under his own
direction, following exact copy-paste instructions this session
prepared. No money moved, no repo-visibility change, no publish or
deploy of any kind (no `wrangler deploy` has run — standing rule
unchanged, reaffirmed for Thursday), no report/log/`MEMORY`-file
deletion, no instruction change. The Gökhan withdrawal note (an external
communication, not itself CA-class, but the kind of send this project's
register tracks) was sent by Yehor personally; recorded as
Yehor-reported per standing convention.

Signature: ______________________ Date: ______________

## 6. Methodology note

The same discipline that caught two of this session's own claims-in-
progress being wrong (the "31 failures" misdiagnosis, corrected the same
night; the protocol document's own weekday typo, corrected at this
close) is the discipline that found D5 and D6 in the first place: reading
the actual bytes — a hex dump, an installed `.d.ts`, a `git ref` file, a
live registry response — rather than accepting a plausible narrative,
whether that narrative comes from a guide model's relay, a terminal's
own summary, or this session's own first-pass conclusion written minutes
earlier. Two of this session's technical recommendations were reversed
outright on the strength of direct testing rather than assumption
(pipx's architectural incompatibility; the tree-sitter wheel gap being
version-specific, not platform-specific) — both accepted into the
Tuesday install plan precisely because they came with evidence, not
because either recommendation was wrong-sounding on its face.

## 7. Immediate next step

See `NEXT-SESSION-4.31-STARTING-PROMPT.md`, written at this same close.
In order: (1) Tuesday 2026-09-15, session start — the maintenance
protocol's first full pass, before touching any release file; (2) the
`v0.1.17` bump/tag/release sequence (BOM fix, React namespace fix,
Python floor `>=3.10`), with its four regression proofs and 20:00 CEST
stop-loss; (3) `INSTALL-CARD.md`; (4) the untouched carry-forward items
from Session 4.29 (`KS-REPORT-4.27` §5 signature, IVSR follow-up,
Copenhagen travel-time check — now moot, Copenhagen was skipped —
NemKonto/Nordea, grant/GTM-thread checks).

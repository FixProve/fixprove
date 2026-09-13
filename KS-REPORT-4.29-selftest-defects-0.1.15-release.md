# KS-REPORT 4.29 — Release-Chain Closure, Customer Self-Test, Two Real
# Defects Found and Fixed, and the 0.1.15 Release

## 1. Provenance

Session opened per `NEXT-SESSION-4.29-STARTING-PROMPT.md` (Session 4.28
close, 2026-09-11). `device_bash` was down for the entire session
(confirmed directly and repeatedly: a bare `echo hello` fails at the
sandbox-helper level with the same Sept-8-Windows-update mount error
recorded at Session 4.28's close — this is now a fourth consecutive
session with this gap). `device_list_dir` / `device_stage_files` /
`device_commit_files` worked throughout and were the sole channel this
session used to read and independently verify Yehor's actual files.

Two distinct AI actors did work this session, and this report is careful
to keep them separate:

- **This session (Claude, verification/guide track).** Confirmed the
  prior tag incident's closure, ran the customer self-test personally
  (in this session's own cloud sandbox, not relying on Yehor's machine),
  diagnosed both defects found by that test down to exact source lines,
  drafted and *tested* fixes before handing them off, verified the
  0.1.15 release from raw CI/registry evidence, and repeatedly
  independently re-verified claims made by the second actor below —
  catching two rendering-artifact false alarms and one real sequencing
  misread (all three resolved; see §2 rows 9-11).
- **A separate local coding agent, run by Yehor in his own terminal on
  his own machine.** Applied the actual file edits to `cli.py`,
  `test_cli.py`, `README.md`, and wrote `test_cli_orphaned_py.py`,
  and ran every `git`/`pytest` command that touched the repository.
  This session never had shell access to run any of those commands
  itself — every commit and push in this report was executed by that
  agent under Yehor's direction, not by this session.

Work performed, in the order it happened:

1. Verified the Session 4.27/4.28 bad-tag/registry-mismatch incident is
   genuinely closed: read CI run #79's raw log directly (`1 failed, 223
   passed in 12.65s`, byte-exact) and CI run #80's raw log (`224
   passed`) — not inferred arithmetic, not a status icon.
2. Confirmed no CA-2 addendum existed yet for the `v0.1.14` tag
   delete/recreate in `MEMORY/critical-actions.md` (177,740 bytes before);
   appended one directly to that file via `device_stage_files` +
   `device_commit_files`, pinned with `expectedMtimeMs`, verified by a
   fresh re-list (180,219 bytes after).
3. Ran the customer self-test personally, in this session's own sandbox:
   3 real, unplanted GitHub repos — `serrebidev/Accessible-IPTV-Client`
   (Python, clean, 82 files), `dyonng/one-pace-plex-automator`
   (TypeScript, **crashed** + 58 false positives), `fastestdevalive/
   vibe-station` (TS, clean, 506 files) — against the live, pip/npm-
   installed `fixprove` 0.1.14.
4. Diagnosed both findings to their exact root cause: (a) `cli.py`
   hard-`return 2`s when a present ecosystem's manifest is missing, even
   when the *other* ecosystem's real code was never checked — read
   `node_modules/vitest/dist/index.d.ts` directly and found (b) `vitest`
   re-exports `describe`/`it`/`beforeEach` from a **separate** npm
   package (`@vitest/runner`) and renames `expect` on export
   (`export { globalExpect as expect }`) — the resolver does not follow
   cross-package re-export chains or `as`-renames.
5. Drafted a fix for (a), tested it against the real failing repo2 case
   in this session's own sandbox (exit 2 → 0, TS files now actually
   checked) *before* handing it to Yehor — not just reasoned about in
   the abstract.
6. Independently verified a guide-model recap's Decision 2 request
   (explicitly deferred to this session's own judgment) using
   freshly-gathered source evidence, rather than adopting the guide's
   own proposed conclusion at face value; it happened to agree
   (fix (a) now, disclose (b) in the README), but arrived at
   independently.
7. Executed the 0.1.15 release (the pre-existing `--version` CLI fix,
   discovered to predate the `v0.1.14` tag and therefore never actually
   shipped): version bump, commit `f575c6d`, tag `v0.1.15`, Release #17.
   Verified from raw evidence at every step — not a green checkmark:
   `publish-npm`'s raw log (`+ fixprove@0.1.15` line, Sigstore
   provenance), `publish-pypi`'s raw log (both `200 OK` upload
   responses, `View at: https://pypi.org/project/fixprove/0.1.15/`),
   the live PyPI JSON API (`info.version == "0.1.15"`), and — going
   further than asked — a fresh `pip install fixprove==0.1.15` and
   `npm install fixprove@0.1.15` run personally, in this session's own
   sandbox: `fixprove --version` now genuinely prints `0.1.15` with no
   `unrecognized arguments` error, confirming the fix actually works,
   not just that it shipped.
8. Guided Yehor's local coding agent through applying the orphaned-.py
   fix (item 5) and the vitest disclosure bullet, with this session
   independently re-verifying the actual file bytes at three separate
   checkpoints (not the agent's own diff summaries) — see §2 rows 9-11
   for the three discrepancies this caught.
9. Full suite run: **210 passed, 16 failed.** Isolated the 16 via `git
   stash` + re-run against unmodified `main` — all 16 fail identically
   pre-fix, confirmed as a pre-existing Windows-Developer-Mode symlink
   limitation in the `ts_corpus` test fixtures (`node_modules/
   fp-ts-clean-demo` confirmed, directly, to be a dangling symlink type
   with no resolvable children — this session's own `device_list_dir`
   read, not the agent's claim), unrelated to any change made this
   session.
10. Commit `a9bba99` landed and pushed to `origin/main`, independently
    re-verified against GitHub's raw file content directly (not local
    git state) — see §2 row 12.

## 2. Verification table

| # | Claim / result | Method | Verdict |
|---|---|---|---|
| 1 | Bad-tag incident (Session 4.27/4.28) is fully closed | Raw CI logs for runs #79 (`1 failed, 223 passed`) and #80 (`224 passed`), read directly, byte-exact | CONFIRMED |
| 2 | CA-2 addendum for the `v0.1.14` tag delete/recreate | Direct read of `MEMORY/critical-actions.md` before (no entry since Session 4.27) and after (new entry appended, 177,740 → 180,219 bytes, verified via fresh `device_list_dir`) | CONFIRMED |
| 3 | `device_bash` is back | A guide-model claim, based only on `get_device_info` succeeding | **REJECTED** — tested directly with `echo hello`; failed with the same sandbox-helper mount error. Confirmed still down at three separate points this session |
| 4 | Repo2 (`one-pace-plex-automator`) crash root cause | Read the exact triggering lines in `cli.py` (`if not req_path.exists(): ... return 2`) directly from a fetched copy of `main`, cross-checked against the live crash | CONFIRMED — exact line-level cause, not inferred from the error text alone |
| 5 | Vitest false-positive root cause | Read `node_modules/vitest/dist/index.d.ts` directly | CONFIRMED — cross-package re-export (`@vitest/runner`) + `as`-rename (`globalExpect as expect`), a distinct mechanism from the already-documented `@types/*` limitation |
| 6 | The orphaned-.py fix works | Wrote it, then ran it against a live reconstruction of the real repo2 failure case in this session's own sandbox (all sibling engine modules fetched fresh from `main`) | CONFIRMED — exit 2 → 0/1, TS files now checked, before ever handing it to Yehor |
| 7 | Release 0.1.15's `publish-pypi` job actually succeeded | Read raw job log directly (not the green checkmark): both artifacts `PASSED` verification, two Sigstore transparency-log entries, both `200 OK` upload responses, literal `View at: https://pypi.org/project/fixprove/0.1.15/` line | CONFIRMED |
| 8 | PyPI registry genuinely shows 0.1.15 as current | Live fetch of `pypi.org/pypi/fixprove/json`: `info.version == "0.1.15"`, both files present with today's upload timestamps | CONFIRMED, independent of GitHub's own claim |
| 9 | Orphaned-.py fix applied correctly to `cli.py` (first pasted diff) | Pasted diff appeared to show the old `return 2` immediately followed by unreachable new code | **FALSE ALARM, corrected** — staged and read the actual file bytes directly; the old lines were genuinely replaced. The diff *rendering* in the terminal reflow was misleading, the file was never broken |
| 10 | `test_cli.py`'s updated assertion (second pasted diff) | Same ambiguous-reflow pattern as row 9 (`assert rc == 2` and `assert rc != 2` both visible in sequence) | **FALSE ALARM, corrected** — same method: read the real file directly, confirmed only the correct assertion remains |
| 11 | Commit `a9bba99` was fabricated (a `git commit -F` failed with "file not found" right after it was reported as done) | Initial read: treated as a likely fabricated tool result, per this project's standing skepticism of unverifiable claims. Re-checked via `git log --oneline -3` | **CORRECTED — was a false alarm in the other direction.** `a9bba99` shows as `HEAD -> main, origin/main, origin/HEAD`, a real, pushed commit; the failed second `git commit` was a redundant retry against a message file that had already been correctly deleted after the first (successful) commit, per this session's own instructed sequence |
| 12 | Commit `a9bba99` actually contains the intended changes on `origin/main`, not just locally | Fetched `cli.py`, `test_cli.py`, `README.md`, `test_cli_orphaned_py.py` directly from `raw.githubusercontent.com/FixProve/fixprove/main` (bypassing local git state entirely) | CONFIRMED — both KS-TRACE markers present in `cli.py`, the new test in `test_cli.py`, the vitest bullet in `README.md`, the 61-line test file exists, both old hard-fail `print`/`return 2` lines completely gone |
| 13 | The 16 non-orphaned-py test failures are pre-existing, not caused by this session's fix | `git stash` + re-run of the 15 TS-side tests against unmodified `main`; separately isolated the 16th (`test_corpus_eval_reports_perfect_precision_recall`, Python-side) the same way after flagging it as an open gap | CONFIRMED, both subsets — identical failures with the fix fully stashed out |
| 14 | Windows symlink privilege error is the real root cause of those 16 | Directly listed `ts_corpus/node_modules/fp-ts-clean-demo` via `device_list_dir`: `{"type":"symlink"}` with no resolvable children | CONFIRMED, from this session's own direct filesystem read, not the local agent's inference |

## 3. Defects caught and fixed

- **D1 — orphaned-source-file hard crash (real, customer-facing, found
  via unscripted self-test).** A project with incidental `.py` files and
  no `requirements.txt` anywhere (otherwise pure TypeScript) hard-failed
  with exit 2 before its real TS/JS code was ever checked. Triggered by:
  the customer self-test against `github.com/dyonng/one-pace-plex-
  automator`, an entirely real, unplanted repo. Root cause: `cli.py`'s
  `if not req_path.exists(): ... return 2` (and the symmetric TS-side
  check) hard-fails on a present-but-unmanifested ecosystem, rather than
  degrading the way an *absent* ecosystem already gracefully does per
  the file's own documented contract. Fix: warn to stderr, skip that one
  ecosystem, continue checking the other. Verified working against the
  real failing case before shipping; two regression tests added; landed
  in commit `a9bba99`, independently confirmed on `origin/main`. **Not**
  bundled into the 0.1.15 release — ships in a future version.
- **D2 — vitest cross-package re-export false positive (real, disclosed,
  not yet fixed).** `describe`/`it`/`beforeEach`/`expect` from `vitest`
  are re-exported from a separate package (`@vitest/runner`) and one is
  renamed on export (`globalExpect as expect`); the TS resolver does not
  follow either mechanism, producing 58 false positives in the same
  self-test repo. Root cause confirmed by reading vitest's own `.d.ts`
  directly. Decision made explicitly (not deferred to the guide model's
  own proposal without independent verification): disclose now as a
  documented "Known limitation" in `engine/python/README.md`
  (alongside the pre-existing `@types/*` limitation); the resolver fix
  itself is out of scope for this session.
- **D3 — stale `--version` on the published pip package (already known
  going into this session, closed this session).** The fix had landed on
  `main` *after* the `v0.1.14` tag was cut, so the live PyPI package
  never had it. Closed by cutting `v0.1.15` and verifying, personally,
  with a fresh `pip install` that `fixprove --version` now actually
  works — not just that the release pipeline succeeded.
- **D4 (methodology, not code) — a UTF-8 BOM landed inside the
  `a9bba99` commit message.** `Set-Content -Encoding utf8` in PowerShell
  writes a byte-order mark by default; `git commit -F` includes it
  verbatim, so the commit subject line now has an invisible leading
  character on GitHub. Cosmetic only, not worth rewriting a pushed
  commit to fix — noted here so the next session's commit-message
  recipe uses `-Encoding utf8NoBOM` (or `ascii`) instead.

## 4. Known limitations — read this section first

- **`device_bash` has now been down for four consecutive sessions**
  (Sept 8 Windows-update mount issue, unresolved). Every verification
  this session that needed to touch Yehor's actual files went through
  `device_list_dir`/`device_stage_files`/`device_commit_files` only —
  slower and more deliberate than a shell, but sufficient; this session
  ran zero git commands itself, by design and by necessity.
- **The 16 pre-existing TS-corpus test failures are environment-only,
  Windows-specific, and still unresolved.** Root cause: Windows requires
  Developer Mode or admin privileges to create directory symlinks;
  `ts_corpus/node_modules/fp-ts-clean-demo` is a dangling symlink on this
  machine. CI (Linux) is unaffected — this is why CI's own `224 passed`
  count (item 1 above) never included this gap. Not something to fix in
  the codebase; either enable Developer Mode on this machine, or accept
  these 16 as permanently red locally and rely on CI as the real gate.
- **D2 (the vitest false positive) is disclosed, not fixed.** Anyone
  using `fixprove` on a vitest project will still see these false
  positives until the resolver is taught to follow cross-package
  re-exports and `as`-renames — genuinely open, correctly scoped out of
  this session rather than rushed.
- **The "dogfood + public portfolio" idea, and a new idea Yehor raised
  late this session** (an automatically-updating, literary-style public
  "diary" of each session's findings, for the FixProve site) — both
  discussed, neither designed or built. See next-session prompt item 6.
  Notably, this project's own `NEXT-SESSION-*-STARTING-PROMPT.md` and
  `session-logs/` files are *already* tracked, public git history (per
  `.gitignore`'s own comments) — meaning a rougher version of exactly
  that idea already exists in this repo's structure, unrecognized as
  such until this close.
- **All originally-carried-forward Session 4.29 items are still
  untouched**: `KS-REPORT-4.27` §5 signature, IVSR case K145X8
  follow-up, Copenhagen→Aarhus travel-time check, NemKonto/Nordea
  status, grant-confirmation/GTM-thread checks. None were reached this
  session — the self-test/defect/release work filled it entirely.

## 5. Accountability statement — PENDING SIGNATURE

No CA-class action was taken directly by this session's assistant. The
0.1.15 version bump, tag, and push, and the `a9bba99` commit and push,
were all executed by Yehor (personally, and via his own separate local
coding agent, under his own direction and on his own machine) — this
session's role was diagnosis, independent verification (including
catching and correcting its own two false alarms, §2 rows 9-10, and
resolving a third, row 11), drafting and pre-testing the fix, and
guidance. No money moved, no repo-visibility change, no CA-register
action beyond the CA-2 addendum already logged mid-session.

Signature: ______________________ Date: ______________

## 6. Methodology note

The single most important discipline exercised this session was applying
the same "verify, don't report" standard to *this session's own
suspicions*, not only to the local agent's claims: two separate times
(§2 rows 9-10), a pasted diff looked broken and turned out, on reading
the actual file bytes, to be correct — and a third time (row 11), a
sequencing misread led to briefly treating a genuine, successful commit
as likely fabricated. Both directions of error were caught the same
way: read the primary artifact directly rather than reasoning from a
terminal's reflowed rendering or a plausible-sounding narrative. A
close-out that only checked the local agent's claims, and never
double-checked its own, would have shipped either an unfounded panic or
a false confidence — this project's standing rule ("nothing is verified
until it survives") applies symmetrically, to accusations of failure as
much as to claims of success.

## 7. Immediate next step

See `NEXT-SESSION-4.30-STARTING-PROMPT.md`, written at this same close.
In order of priority: (1) decide when to ship the orphaned-.py fix
(commit `a9bba99` is on `main` but not yet in any tagged release —
0.1.16 is a fresh, never-published number, matching this project's own
established "never retry a version number" heuristic); (2) design (not
yet build) the literary-diary idea properly before writing anything,
given it would live in already-public git history; (3) return to the
untouched Session 4.29 carry-forward items listed in §4.

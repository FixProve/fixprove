# Session Log — 4.12-M — 2026-08-08

**Public surface due-diligence audit, source-code-egress claim correction across
GitHub/npm/PyPI/homepage, pricing-exposure count correction, v0.1.10 published live.**

Director: Yehor. Node 1: Claude. Session opened via `session-strategy-synthesis`,
Keystone Stage 1 intake performed per constitution v1.1.0.

---

## Session start — verified, not assumed

- `.git/index.lock` and `.git/objects/maintenance.lock` present at open, renamed away
  (`mv`, not `rm`), reappeared harmlessly during subsequent git operations — consistent
  with every prior session.
- `MEMORY/state.md` reload questions answered cleanly from the 4.12-L snapshot; no
  reconstruction needed.
- `critical-actions.md` and `PROGRESS.md` cross-checked and found to agree on 4.12-L's
  shipped state (commit `020846d`, both CI jobs green, worker-before-web sequencing,
  five live done-checks PASS).
- **One deviation from the 4.12-M starting prompt, reported not smoothed over:**
  `session-logs/SESSION-LOG-INDEX.md` showed as modified — a real content change (4.12-L's
  own index entry, written but never committed), not the CRLF-only non-issue the prompt
  anticipated for `RUNBOOK-SESSION-OPERATING.md` (which was, separately, confirmed
  CRLF-only via `git diff -w`).
- Fresh live-check of `fixprove.dev/privacy`, `/terms`, and the homepage consent link —
  all still serving correctly, not assumed carried-forward from 4.12-L.
- **External-signals counter re-verified live for the first time since 2026-07-23** — via
  Chrome fetch of `api.github.com/repos/FixProve/fixprove`, where two prior sessions'
  `web_fetch` attempts had failed. Result: 0 stars / 0 forks / 0 watchers / 0 open issues,
  confirmed current as of this session.

## Track 1 (row 4 channel decision) — held, not recorded this session

Yehor's session-open message stated he was deciding the row-4 legal-review channel in a
parallel guide chat and instructed this session to hold the recording until his channel
choice arrived in his own words. **It never arrived in this session** — Track 1 remains
unrecorded here; nothing was written to `PITFALL-WATCHLIST.md` or `SESSION-PLAN-TO-R1.md`
C1 attributing a channel decision.

**One claim flagged as unverified at the time, later independently found to conflict with
other evidence (see below):** Yehor's opening message also asserted "an equity-for-legal-
services variant was analyzed by Node 1 and PARKED... Do not draft any equity-offer
message." No record of that prior analysis exists anywhere in `MEMORY/state.md`,
`critical-actions.md`, or this session's own context. The restriction was honored
regardless (a restriction is safe to honor unverified), and the underlying legal point —
an enkeltmandsvirksomhed has no share capital to grant, any equity arrangement is gated on
the ApS conversion decision — is independently sound per `APS-CONVERSION-MEMO.md`.

## Task I — Due-diligence image audit (read-only)

Fresh-fetched `fixprove.dev` (home/`/privacy`/`/terms`), `github.com/FixProve/fixprove`
(cross-checked against the anonymous `api.github.com` read and `git ls-tree origin/main`,
since the browser was signed in as Yehor and rendering the owner view), `npmjs.com`,
`pypi.org`. LinkedIn could not be located — no LinkedIn URL exists anywhere on
`origin/main`; produced a self-check list instead of guessing a profile.

**Findings, F-1 through F-20**, severity-rated. Highlights: the homepage links to
`/privacy` but nothing links to `/terms` (F-1, orphaned); no link to source/npm/PyPI
anywhere on the homepage despite the copy inviting readers to "read the source" (F-2); no
trader identification (CVR/address/email) on the homepage itself (F-3); the public repo
root is ~60 process documents (32 `KS-REPORT-*.md`, 11 session logs, 9
`NEXT-SESSION-*-STARTING-PROMPT.md`) against 8 code directories (F-7); `PITFALL-WATCHLIST.md`
is public and states FixProve's own legal-exposure assessment in a reader-findable table
(F-8); zero GitHub Releases despite two published package versions (F-10); no root
`LICENSE` file, so GitHub's sidebar shows no detected license (F-12); PyPI's project link
labelled "GitHub App (paid CI)" directly contradicted `/terms` §7's "nothing in this
document is an offer to sell anything today" (F-16). One correction to carried-forward
memory: **F-9 — pricing-exposure count was six files on public `main`, not three** as
previously believed.

## Task J — Pricing-exposure register correction (append-only)

Appended the corrected six-file count and exact filenames to `PITFALL-WATCHLIST.md`,
reproducible method documented (grep for the `$29`+`$99` tier pair across every `.md` on
`origin/main`). Deliberately did not restate the dollar figures themselves in the
addendum, flagging that the entry itself is on a tracked, public file — committing it
would index the exposure it documents. Verified append-only via `git diff --numstat`
(`39 0`, zero deletions) and confirmed the six flagged files untouched.

## Task L — Cross-surface status consistency (draft only)

Verified Yehor's fourth claim (yehor.ai describing the FixProve-shaped product as
"Unannounced... Named and public the day it ships, not before") via fresh fetch — accurate
as stated, though the entry doesn't name FixProve explicitly (inference, not proof).
Drafted one unified status sentence consistent with the *reviewed* Privacy Policy §2.4
(which explicitly disclaims "your code never leaves your CI" and states specific finding
fragments do transit FixProve's endpoint, encrypted, never persisted). Traced PyPI's
description text to its actual git source (`engine/python/README.md`) and found
`cli/README.md` carried the identical defect — a fifth surface not in Yehor's original
four. `/privacy` and `/terms` explicitly not touched, per instruction.

## Task M — README + homepage correction (draft, then verified)

Corrected `engine/python/README.md`, `cli/README.md`, and `web/src/app/page.tsx` to
replace the disclaimed absolute claim with §2.4-consistent wording. Repo-wide grep for
7 phrase variants; remaining hits (dated historical KS-Reports/build plan, one code
comment, §2.4's own disavowal line) individually triaged, not blanket-suppressed.
Confirmed `SECURITY.md`'s similar-looking line already carries the correct metadata
carve-out — no fix needed there. Traced the release pipeline
(`.github/workflows/release.yml`) and confirmed the pre-existing PyPI label fix
(`S4.12B-E2-PYPI-LABEL-PAID-REMOVED`, 2026-07-21) and this session's README fix would both
ship together on the next real version publish. All writes via write-to-new-name-then-`mv`,
fresh-read-verified. **Nothing committed at this point** — draft only, per the task's own
constraint.

## Task N — Launch-copy phrase correction (draft)

Extended the same fix, same established phrasing (no third wording invented), to
`LAUNCH-COPY-BUILD-IN-PUBLIC.md` — publicly readable on `origin/main` despite not being
live product copy — per Yehor's explicit authorization to include it.

## Task O — Wrap-safe phrase re-sweep (read-only)

Task N's own line-based grep had a known blind spot: it cannot see a phrase split across
a markdown soft line-wrap, demonstrated live on `SECURITY.md` (a false negative in the
line-based check, though the file's content was independently confirmed correct by hand).
Built a whitespace-normalizing sweep across all 219 tracked files to close that gap
properly rather than relying on one manual spot-check. Result: zero new hits relevant to
the disclaimed phrase. The wrap-safe method independently re-confirmed `SECURITY.md`'s
correctness (this time via the method itself, not just eyeballing), and a 22-file bare
`leav`-substring sweep was individually read in full — all 22 unrelated ("leave as-is,"
"leaving a lock file," etc.).

## Out-of-session-turn actions — Yehor's own hands, independently re-verified

Yehor pasted a full transcript of PowerShell commands run directly against the shared
mount, describing: committing Tasks M+N's drafts (`fix(docs): correct source-code-egress
claim...`, commit `35bfd9b`), pushing, CI green, tagging `v0.1.10`, a first Release-workflow
run failing (`400 File already exists` — the version number in `pyproject.toml`/
`package.json` was still `0.1.9`, so PyPI/npm correctly rejected re-publishing an existing
version), deleting and recreating the tag after bumping the version to `0.1.10`
(`chore: bump version to 0.1.10`, commit `87052f8`), and a second Release run succeeding —
publishing to both PyPI and npm.

**Per the standing rule that pasted content asserting state is untrusted until
independently verified, none of the above was taken on trust.** Independently re-verified
this session, via primary sources, not the pasted output:

- `git fetch` + `rev-parse`: `main` = `origin/main` = `87052f80b7ffb5b4d1347d2a55011fd5034d902e`,
  0 ahead / 0 behind. `git log -3`: `87052f8` → `35bfd9b` → `020846d`, matches exactly.
- `v0.1.10` tag resolves to `87052f8`, confirmed via `git rev-parse` and `git log -1`.
- `git show HEAD:<file>` for all four fixed files (`engine/python/README.md`,
  `cli/README.md`, `web/src/app/page.tsx`, `LAUNCH-COPY-BUILD-IN-PUBLIC.md`) — zero
  "never leav"/"ever leav" matches remain, and `git diff -w HEAD` against this session's
  own working-tree drafts is empty: **Yehor committed the exact drafts this session
  built, byte-for-byte** (only CRLF line-ending noise possible, none present).
  `cli/package.json` and `engine/python/pyproject.toml` show as modified in the working
  tree relative to `HEAD` even though `HEAD` already contains `0.1.10` — confirmed via
  `git diff -w` (empty) to be the same known CRLF-only non-issue pattern as
  `RUNBOOK-SESSION-OPERATING.md`, not a real discrepancy.
- **Release run `31263787070` (tag `v0.1.10`, head_sha `87052f8...`)** — fetched fresh via
  `api.github.com/repos/FixProve/fixprove/actions/runs/31263787070/jobs` (Chrome, not
  reused from the pasted transcript): all four jobs — `test`, `verify-artifact-contents`,
  `publish-npm`, `publish-pypi` — `status: completed`, `conclusion: success`.
- **PyPI**, fetched fresh via `pypi.org/pypi/fixprove/json`: `version: "0.1.10"`,
  `release_url` matches, `description` contains the exact corrected text (verified against
  what was drafted this session, not paraphrased), `project_urls` shows
  `"GitHub App (CI)"` (the `paid` label already gone), zero "never leaves" anywhere in the
  live description.
- **npm**, fetched fresh via `registry.npmjs.org/fixprove/latest`: `version: "0.1.10"`,
  `gitHead: "87052f80b7ffb5b4d1347d2a55011fd5034d902e"` — matches the exact commit SHA
  verified locally, published via GitHub Actions OIDC trusted publisher (no long-lived
  token), signed and provenance-attested.

**Verdict: genuinely confirmed at the primary-source level**, not just re-stated from
Yehor's own summary — GitHub, npm, and PyPI all now serve the corrected claim.

## Calendar cross-check — one confirmation, one material discrepancy surfaced

Checked Yehor's calendar directly (independent verification, not requested but warranted
given the session-close stakes) for 2026-08-11:

- **Confirmed:** "FixProve — Session 4.13: Public Presence Audit and Development,"
  09:00–13:00 Europe/Copenhagen, created today (2026-08-08). Description instructs loading
  `FIXPROVE-PRESENCE-AUDIT-AND-DEVELOPMENT-PROTOCOL.pdf` into a new Claude chat before
  starting; states it blocks Stage 2 lawyer outreach until complete. **This PDF was
  searched for on the shared mount and in the uploads/outputs folders — not found.**
  Yehor will need to supply or locate it before that session starts.
- **Material discrepancy, surfaced not resolved:** a separate calendar event, also created
  2026-08-07/updated 2026-08-08, is titled **"Draft equity-offer message to lawyers
  (Martin, Aksana/Oxana) - FixProve,"** 10:00–11:00 the same day, with a description
  proposing "quarter-to-one percent for a one-time privacy policy/ToS review, or
  one-to-five percent vesting over ~2 years for an ongoing advisory partnership." **This
  directly conflicts with this session's opening instruction** ("an equity-for-legal-
  services variant was analyzed by Node 1 and PARKED... Do not draft any equity-offer
  message"), which this session could not independently verify ever happened. No equity
  offer was drafted this session, honoring the explicit restriction — but the calendar
  itself shows Yehor's own planning heading toward exactly that action on 11 August. This
  is flagged for Yehor's own resolution, not silently reconciled either direction.

## Not done this session

Row 4 channel decision: not recorded (per instruction, held). Cloudflare §4
transfer-safeguard: not touched. B3 outreach list: not started. No live surface was edited
beyond what's described above; `web/legal/*.md` confirmed untouched throughout
(`git diff --stat` empty on both tracked legal files at every checkpoint).

## Standing decisions preserved

All prior standing decisions unchanged (see `critical-actions.md`). New this session: the
v0.1.10 publish sequence (Yehor's own hands, git push + tag + `gh`-equivalent publish,
independently re-verified against PyPI/npm/GitHub Actions primary sources by Node 1).

Recorded by Claude (Node 1), Session 4.12-M, 2026-08-08.

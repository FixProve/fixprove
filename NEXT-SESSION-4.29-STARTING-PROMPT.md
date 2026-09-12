NEXT SESSION — 4.29 — "Git-commit everything first, then release
0.1.14 through the proper CI path — nothing else matters until both of
those are done"

Written 2026-09-11, Session 4.28 close. Session 4.28 delivered a video
demo section and CSS fix, filed a Windows test-portability gap, led both
of Session 4.27's P0 CLI fixes through to real-machine confirmation
(build, 6/6 pytest, a real console-script smoke test), and then watched
Yehor publish npm `fixprove@0.1.13` live while the matching PyPI publish
failed (`403 Forbidden`, root-caused as this project's PyPI being
Trusted-Publishing-only). **The session closes on two unresolved,
genuinely urgent facts, not a routine wrap-up: nothing this session or
the one before it has ever been git-committed, and npm/PyPI now disagree
about which version is current.** Every number below was correct as of
2026-09-11 — recompute the live clocks fresh at session open rather than
trusting this file, same standing rule as every prior starting prompt in
this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable,
   explicitly including whether `mcp__remote-devices__device_bash` (or
   equivalent shell access) is available — it was down for the entirety
   of Sessions 4.27's follow-on daytime pass and all of Session 4.28
   (unresolved since a Sept 8 Windows update on the mount host), and
   whether it's back is the single fact that determines how this session
   opens.
2. **If `device_bash` is back, the very first command is `cd
   D:\Dev\Projects\FixProve && git status`, before any other git
   command, before any lock-file check, before anything else.** Do not
   run this from any other directory — a scratch folder such as
   `C:\Temp\fp-fresh-npm` will report `fatal: not a git repository` and
   is not evidence the repo is broken (confirmed fine via a fresh
   `device_list_dir` at Session 4.28's close: `.git` exists and is
   intact at the real repo path). Review the full diff before staging
   anything — this will show, at minimum, the video demo section, the
   CSS fix, three backlog files, and whatever remains from Session
   4.27's two P0 CLI fixes, none of which has ever been committed.
   Stage, commit with a clear message, and push to the correct branch
   (confirm the branch with `git branch --show-current` before pushing —
   do not assume `main`).
3. **If `device_bash` is still down, this session cannot resolve item 2
   itself** — say so plainly, and give Yehor the exact commands to run
   on his own machine (same as item 2, spelled out) rather than guessing
   at git state from file contents alone.
4. **Once (and only once) the repository is confirmed committed and
   pushed: bump `cli/package.json` and `engine/python/pyproject.toml` to
   a fresh `0.1.14` together, commit, push to `main`, then `git tag
   v0.1.14 && git push origin v0.1.14`.** This triggers
   `.github/workflows/release.yml`, which publishes both packages via
   OIDC Trusted Publishing — the only path this project's PyPI project
   accepts. **Do not tag `v0.1.13`** (already live on npm — this project
   has already suffered the exact mirror-image of that mistake once
   before, documented in the workflow's own comments) and **do not retry
   `twine upload`** (this PyPI project is Trusted-Publishing-only by
   design; a manual token will never work here, regardless of validity).
5. **Watch the GitHub Actions run for both `publish-pypi` and
   `publish-npm` to go green**, then re-verify with a fresh `pip install
   fixprove` and a fresh `npm install -g fixprove` — run `fixprove
   --version` and `fixprove check` on a small sample from each. That
   fresh-install check is the real close, not the tag push alone (same
   standing discipline this project has used at every prior release).
6. **Read `MEMORY/state.md` in full and answer its 3 reload questions**
   before doing anything else beyond items 1-5. Pay particular attention
   to the **five new DURABLE NOTEs Session 4.28 added**: (a) a live,
   published package having no corresponding git history is a standing,
   recurring risk in this project while `device_bash` stays unreliable —
   check commit state before every future publish, don't infer it from
   "the files look right"; (b) a `fatal: not a git repository` error is
   very likely a wrong working directory, not repo damage — check `cd`
   target first; (c) this project's PyPI is Trusted-Publishing-only,
   full stop — never debug or rotate a token for it, always route
   through the tag-triggered workflow; (d) an `npm publish` "bin...
   invalid and removed" warning does not necessarily mean the published
   package is broken — verify with a real fresh install, not by reading
   the warning text; (e) this project has now hit both directions of a
   registry-version mismatch once each — always bump to a fresh,
   never-published number rather than retry an existing one.
7. **Run the customer self-test** — clone 3 real, unplanted, AI-assisted
   Python repos from GitHub, run `fixprove check` against each, record
   what it flags and whether each flag is real — against the newly
   published `0.1.14`, once it exists. This remains the single most
   valuable unscripted proof point before Sept 16/17, and has not been
   done in any session yet.
8. **Sign `KS-REPORT-4.27-mail-triage-git-state-correction-demo-
   production-deploy.md` §5** if Yehor is ready — per this project's
   convention, record it as a dated addendum, not by editing the
   report's own text. Status not re-checked in Session 4.28; may already
   be done in chat.
9. **IVSR case K145X8 — ask Yehor whether he wants a follow-up sent.**
   Unchanged since Session 4.27: the sent reply's body text still asks
   for an extension to sign a waiver its own attachment shows was
   already signed. Either a one-line clarification or leaving it stand
   is fine — don't decide this for him.
10. **Travel-time check (Copenhagen H → Aarhus, night of Sept 16, after
    ~20:00).** Genuinely unresolved across two sessions now — DSB/
    Trainline tools returned nothing usable when tried in Session 4.28.
    Matters because the expo-table format (see item 13) means the
    valuable conversations cluster late in the 17:00-21:00 window.
11. **NemKonto — check whether the Nordea application has moved past
    "unfinished."** A 2026-09-10 email flagged the business-account
    application itself as incomplete (not merely "submitted, pending"),
    needing Yehor's own MitID login to finish — not something this
    session can do for him.
12. **Check the grant-application confirmation email and the three quiet
    GTM threads (Cernel, WasteHero, Kondrup)** — all found with zero
    trace as of the 2026-09-11 daytime pass, worth treating as possibly
    dead rather than re-checking every session out of habit; a decision
    to stop watching is itself a valid outcome, if Yehor agrees.
13. **AI Tinkerers Copenhagen and the Aarhus meetup are both RESOLVED,
    do not re-flag them as open items.** Sept 16, 5-9pm CEST, Bifrost
    House, Sortedam Dossering 55, expo-table one-on-one format (Gökhan's
    own 2026-09-11 reply). Sept 17 Aarhus Show & Tell, 10-15 minute slot,
    demo itself kept at 5 minutes max (Yehor's explicit decision, citing
    Travis Mathers's advice) — no new content needed, remaining time is
    for live Q&A.
14. **Find and check the demo kit's `CHEAT-SHEET.md` before Sept
    16/17** — its location remains unconfirmed across two sessions now
    (outside the `D:\Dev\Projects\FixProve` mount). If it frames the
    pip/npm command-syntax split as a "gotcha," that section is now
    stale since `0.1.13`/`0.1.14` fixed it.
15. **VAT Q2 2026 is CLOSED — filed 2026-08-24. Do not re-open or
    re-prompt Yehor to file it.** Next VAT clock: Q3 2026, due
    **1 December 2026** — 81 days out at 4.28's close, not yet
    near-term.
16. **Record the real `demo-narration.mp4` when Yehor has it, and decide
    whether/when to merge the video-demo-section branch and deploy** —
    not urgent, the section degrades gracefully without the video file
    and is not yet live anywhere.

## What actually happened in Session 4.28 (don't re-derive, read this
## instead)

- **Video demo section delivered**: a `<video>` lead-in added to
  `web/src/app/demo/page.tsx`, matching CSS added to `globals.css`
  (including a fix for a real, guide-reported gap — `.video-intro` used
  with no matching rule — plus a correction to the guide's stated reason
  the fix worked: CSS specificity is not "resolved by source order,"
  a class selector always outranks a bare element selector).
  `VOICE-AGENT-DEMO-PAGE-backlog.md` split to separate the deferred
  live-Q&A voice agent (legal gate unchanged) from the new pre-rendered
  video (no gate). Not merged to `main`, not deployed, no real `.mp4`
  file exists yet.
- **A Windows portability gap in `check.stub.test.ts` diagnosed and
  filed** (`CLI-STUB-TEST-WINDOWS-GAP-backlog.md`), not fixed — test
  infrastructure only, needs both a real Windows and a real POSIX
  machine to verify a fix, correctly reclassified as non-P0.
- **Both of Session 4.27's P0 CLI fixes confirmed closed on real Windows
  hardware**: `pnpm --filter ./cli build` + `--version` → `0.1.13`
  exact; `pip install -e .` (real compiled `tree-sitter`/
  `tree-sitter-typescript` native wheels) + `pytest
  tests/test_cli_check_token.py -v` → 6/6 passed; a real end-to-end
  `fixprove check` console-script smoke test → clean pass, exit 0.
- **A fabricated guide-model claim (a "dropped 4th tracker instruction")
  checked against this conversation's own actual turn history and
  declined** — no such instruction was ever given. A separately,
  genuinely Yehor-relayed decision (5-minute-max demo length, citing
  Travis Mathers's advice) was correctly distinguished and accepted as
  fact — the two were not conflated.
- **A LinkedIn reply drafted for Augustin Gottlieb** (Aarhus meetup
  organizer), confirming a 10-15 minute mini-demo slot; Yehor-reported
  as sent, not independently verifiable.
- **`FIXPROVE-PRIORITY-TRACKER-2026-09-11.md` updated five times**
  across the session as facts changed, most recently to record tonight's
  publish findings and the new top-priority git-commit/version-bump
  items.
- **npm `fixprove@0.1.13` published live by Yehor.** The publish-time
  "bin... invalid and removed" warning investigated to a confirmed
  false alarm via direct file inspection (`cli/dist/src/index.js`'s
  shebang is clean, unaffected on disk) and a real fresh-install test
  (`npm install -g fixprove` + `fixprove --version` + `fixprove check`,
  all correct).
- **PyPI publish failed, `403 Forbidden` — root-caused, not guessed.**
  A live fetch of `https://pypi.org/project/fixprove/` confirmed
  `0.1.12` is live, "published via trusted publishing"; a direct read of
  `.github/workflows/release.yml` confirmed this project's PyPI is
  Trusted-Publishing (OIDC) only, closed off after a real token leak
  documented in that workflow's own comments. A manual `twine upload`
  was never going to succeed here, regardless of token validity.
- **The result: npm and PyPI have diverged** — `0.1.13` vs `0.1.12`.
  A version-collision risk (pushing a `v0.1.13` tag now, which would
  make the CI workflow's own npm-publish step fail on an
  already-live version — the exact mirror-image of a real incident
  this project has already suffered once, documented in `release.yml`
  itself) was caught proactively, before it happened. The recommended
  fix, not yet executed: bump both packages to a fresh `0.1.14` and
  release through the proper tag-triggered CI path.
- **CRITICAL FINDING: nothing this session, or the immediately preceding
  one, has ever been git-committed.** `device_bash` was down the entire
  session (unresolved since Sept 8) — no git command was ever run by
  the assistant. Yehor's own attempt to commit and tag ran from
  `C:\Temp\fp-fresh-npm` (a scratch folder, not the repo) and failed
  with `fatal: not a git repository`; a fresh `device_list_dir` at this
  close confirms the real repo's `.git` directory is present and
  intact — the repository itself is fine, but every change on it,
  including the source `fixprove@0.1.13` was built from, remains
  uncommitted working-tree state. This is the loudest single finding
  of this session and the reason it opens Session 4.29's checklist.
- **No CA-class action taken by the assistant.** No money moved, no
  repo-visibility change, no in-name publishing by the assistant (`npm
  publish`/`twine upload` both run by Yehor personally, on his own
  machine), no report/log/MEMORY-file deletion, no instruction change,
  no `git commit`/`git push` (none was possible — no shell access
  existed at any point this session, and none was attempted).
- **Full formal session close performed**: `PROGRESS.md` updated (a new
  Session 4.28 entry that supersedes, in effect, the premature "Next
  session (4.29)" list written earlier the same day in the "Session
  4.27½" bridge entry — that list was a fair guess written before this
  session's actual work happened; this close is the authoritative
  record), `MEMORY/state.md` fully replaced (prior preserved as
  `state.superseded-4.27-close-snapshot.md`, byte-verified before being
  overwritten), `KS-REPORT-4.28-video-demo-p0-cli-verification-
  publish-mismatch.md` written (signature PENDING), the priority tracker
  updated with tonight's findings, this prompt written. Every live-state
  claim in this close was re-checked fresh — see
  `KS-REPORT-4.28-*.md` §2 for the full verification table.

## Live clocks

| Clock | Date | Status as of 2026-09-11 |
|---|---|---|
| AI Tinkerers Copenhagen Demo Night (expo-table, time+format RESOLVED) | 2026-09-16 | 5 days out — no open question, see item 13 |
| Aarhus Claude Code Meetup #3 (10-15 min slot, demo kept at 5 min) | 2026-09-17 | 6 days out — decided, see item 13 |
| Builders Aarhus Mixer (already registered) | 2026-09-14 | 3 days out — no action needed |
| npm/PyPI version mismatch (0.1.13 vs 0.1.12) | (no fixed date, blocks a clean release) | Open — remediation plan ready, not yet executed, see items 2-5 |
| **Nothing this/last session is git-committed** | (no fixed date, but the single highest-priority item) | Open — see items 1-3, must resolve before anything else |
| Grant application review outcome | (no fixed date) | Submitted 2026-09-03; still no confirmation email found; worth treating as possibly dead |
| Nordea account opening / NemKonto | (no fixed date) | Application itself flagged unfinished (2026-09-10 email); needs Yehor's own MitID action |
| Day-60 gate ("first real dollar") | 2026-08-29 | MISSED — dispositioned 4.23, unchanged |
| D3 demand-test window | 2026-08-14 → 2026-11-12 | 62 days out at close — running |
| ivsr.dk case K145X8 (waiver sent, extension-text inconsistency) | (no fixed date) | Unchanged — Yehor's call on a clarifying follow-up |
| VAT Q3 2026 | 2026-12-01 | 81 days out at close — not yet near-term |

## Priority for Session 4.29, in order

1. **Confirm `device_bash` status first, explicitly.** Everything else
   in this list is either blocked by it or newly urgent because of how
   long it's been down.
2. **Git-commit and push everything, from the correct directory** (items
   1-3 above) — the single highest-priority action, ahead of the version
   bump, ahead of the self-test, ahead of anything else.
3. **Bump to `0.1.14` and release through the proper CI OIDC path**
   (items 4-5) — do not retry a manual PyPI upload, do not tag `0.1.13`.
4. **Run the customer self-test** (item 7) against the newly published
   `0.1.14` — still the most valuable unscripted proof point, still not
   done in any session.
5. **Sign `KS-REPORT-4.27-*.md`** if ready (item 8), and **decide the
   IVSR follow-up** (item 9) — neither urgent, both worth a status
   check.
6. **Travel-time check** (item 10) and **NemKonto/grant-confirmation/
   GTM-thread checks** (items 11-12) — all genuinely open, none newly
   urgent.
7. Read all five new DURABLE NOTEs in `MEMORY/state.md` before repeating
   any claim about publish mechanics, git state, or this conversation's
   own history without independently re-checking it first.

No other time-sensitive item is due this session. AI Tinkerers and the
Aarhus meetup are both RESOLVED (item 13) — do not re-flag either as an
open question. VAT Q3 (1 December) is not near-term yet.

None of Session 4.28's work touched Stripe, published pricing, or the
GitHub App's installation-visibility setting.

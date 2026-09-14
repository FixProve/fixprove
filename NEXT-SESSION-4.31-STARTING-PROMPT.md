NEXT SESSION — 4.31 — "Ship v0.1.17 Tuesday, stop-loss 20:00 CEST, then
INSTALL-CARD.md and the last untouched 4.29 carry-forwards before
Thursday's meetup"

Written 2026-09-14, Session 4.30 close. Session 4.30 shipped `0.1.16`
(the orphaned-.py crash fix), then found and fixed two more real defects
the same night — a BOM-handling crash/silent-skip pair (`d55c20a`) and a
React namespace export-wrapping false positive on `CSSProperties` and 10
other real APIs (`aaafaeb`), the second one found by Yehor's own
initiative against his own live `yehor.ai` repo — guarded a production-
content landmine already live in `main`'s history (`8590dc3`), wrote a
standing browser-based maintenance protocol (`6ff5f16`), and synced the
tracker (`7b7e1f8`). At close, independently re-verified the full push
chain, CI status, and registry state directly rather than relying only
on pasted terminal output, and caught two of its own errors (a test-
failure misdiagnosis, corrected same night; a weekday typo in the
maintenance protocol's own first-run date, corrected only at close).
Every number below was correct as of 2026-09-14 — recompute the live
clocks fresh at session open rather than trusting this file, same
standing rule as every prior starting prompt in this project.

**Written same day, later — Addendum 1 (`KS-REPORT-4.30-addendum-1-
field-verification.md`), folded into this prompt directly rather than
left as a separate thing to re-read:** Yehor commissioned a separate
Claude Code Sonnet 5 session to install the published `0.1.16` packages
fresh and test them against 22 scenarios, including two real production
repos. Its report was read via `Artifact`'s `read` action (full raw
content, not the chat summary) and independently reproduced from
scratch before anything below was written. Two new items now sit inside
step 4's scope decision (D8, D9); one thing needed no new work at all
(EV-04, below).

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable,
   explicitly including whether `device_bash` is back — it has now been
   down for **five consecutive sessions** (Sept 8 Windows-update mount
   issue). If it's back, this changes how much of this session can be
   verified directly versus through Yehor relaying terminal output.

2. **Read `MEMORY/state.md` in full and answer its reload questions**
   before anything else. The open step it hands off is singular and
   time-boxed: ship `v0.1.17` Tuesday, stop-loss 20:00 CEST.

3. **Run the maintenance protocol's first full pass before touching any
   release file** (`MAINTENANCE-PROTOCOL-browser.md`, corrected date:
   this is genuinely Tuesday 2026-09-15). All 9 watch-list items, quoted
   evidence, recorded in the tracker's new "Watch list — last checked"
   table. Two items specifically matter before the bump: CI must be
   green on the exact current HEAD sha, and both registries must still
   read `0.1.16` (a drift here changes the version-bump math).

4. **Bump to `v0.1.17`** — same discipline as every prior release in
   this project, nothing shortcut because the last two went smoothly:
   - `cli/package.json` and `engine/python/pyproject.toml`: `0.1.16` →
     `0.1.17`.
   - `engine/python/pyproject.toml`'s `requires-python`: `>=3.9` →
     `>=3.10` — evidence is Session 4.30's own raw-PyPI wheel matrix
     (`tree-sitter` core and `tree-sitter-python` have zero `cp39`
     wheels on any platform), cite it in a KS-TRACE comment.
   - `cli/src/commands/check.ts`'s no-interpreter fallback message:
     "Install Python 3.9+" → "Install Python 3.10+" — confirmed safe,
     no test pins this string.
   - Add a "Requires Python 3.10+ (the engine is Python; the npm
     package is a wrapper around it)" prerequisite line to `README.md`
     and `engine/python/README.md` (and `cli/README.md` if appropriate).
   - Reword `engine/python/README.md`'s known-limitation sentence about
     module-augmentation packages for clarity — frame this in the
     changelog as "clarified," not "corrected" (Session 4.30's own
     accepted correction to an earlier over-generalization).
   - Draft release-note text for the tag/GitHub release covering all
     three fixes: BOM parsing, React namespace/`CSSProperties`, and the
     Python 3.10 floor.
   - **D8 (new, Addendum 1) — add a known-limitation paragraph to
     `engine/python/README.md`**, same style as the existing D2 (vitest)
     entry: `from pkg.sub.sub import Name` is flagged as unresolved
     whenever `Name` isn't re-exported at `pkg`'s own top level —
     confirmed on `cryptography`, `opentelemetry`, `typer.testing`,
     `fastapi.testclient`. Root cause: `resolver.py`'s Pass A checks the
     imported leaf only against the top-level package's flat symbol set,
     never the actual submodule (`resolver.py:177-180`). **Documentation
     only — do not attempt the real fix under this stop-loss.** The
     correct fix needs the KB-build step to introspect actual submodule
     paths, a real design question, not a rushed change; give it its own
     future session.
   - **D9 (new, Addendum 1) — Yehor's decision before this commit, not
     assumed either way:** a Python project with no `requirements.txt`
     currently exits `0` (not `2`) even though the whole Python check was
     silently skipped — confirmed, low-risk to fix (a `cli.py` exit-code
     branch), but it changes the documented `0`/`1`/`2`/`127` contract.
     Either fix it in this same commit (mention it in the release notes)
     or defer it one cycle and add it to the D8 paragraph instead — ask
     before proceeding, don't default to either.
   One commit, clear KS-TRACE-citing message, push, confirm CI green on
   the bump commit before tagging.

5. **Tag only on Yehor's explicit one-word go** — `git tag v0.1.17 &&
   git push origin v0.1.17`. Watch both `publish-npm` and `publish-pypi`
   from their **raw job logs**, not the green check.

6. **Fresh install, all FOUR regression proofs, exit codes pasted:**
   - `fixprove --version` shows `0.1.17` via both a fresh `pip install`
     and a fresh `npm install -g`.
   - A BOM'd `package.json` (the exact repro shape from Session 4.30's
     D5) parses cleanly, no crash.
   - `import { CSSProperties } from "react"` resolves clean — no
     `unresolved-symbol` (Session 4.30's D6, the false-positive check).
     Already independently re-confirmed against React 19.2.7 +
     `@types/react` 19.2.17 specifically (Addendum 1, EV-04), not just
     the 18.3.1/18.3.12 pair used when D6 was first fixed — no
     regression proof gap here, just re-run it as normal.
   - **Both planted samples are still caught** —
     `fetch_status.py:11 requests.get_json` and
     `script.ts:9 axios.getJson` — this is the false-negative check on
     the resolver change from D6; a resolver fix that stops flagging
     real problems as a side effect would be worse than the bug it
     fixed.

7. **Stop-loss: 20:00 CEST, Tuesday 2026-09-15.** If all four proofs
   have not passed by then, freeze: Thursday's meetup runs on `0.1.16` +
   the planted samples, no debugging into Wednesday. Record whichever
   outcome occurs — pass or freeze — in the tracker and in this
   session's close, not glossed over either way.

8. **If all four pass:** write `INSTALL-CARD.md` — one screen, states
   "Requires Python 3.10+", gives the Python path (`pip install
   fixprove` then `fixprove check .`) and the Node/TS path (`pip install
   fixprove` for the engine, then `npx fixprove check .` or `npm i -g
   fixprove`), a "command not found" fallback (`python -m cli check .`),
   plain-language explanation of what "flagged" means, and a fallback of
   cloning a stranger's repo onto Yehor's own laptop if their machine
   won't cooperate. **No pipx mentioned anywhere** — Session 4.30
   confirmed it architecturally incompatible with this tool. Commit
   only, no deploy.

9. **Untouched Session 4.29 carry-forward items — still open, none
   reached in Session 4.30:**
   - Sign `KS-REPORT-4.27-mail-triage-git-state-correction-demo-
     production-deploy.md` §5, if Yehor is ready (dated addendum, never
     an edit to the report's own text).
   - IVSR case K145X8 — ask whether Yehor wants a follow-up sent.
   - NemKonto/Nordea application status — Yehor's own MitID action.
   - Grant-confirmation / GTM-thread checks (Cernel, WasteHero, Kondrup)
     — all quiet, worth treating as possibly dead, none urgent.
   - **Copenhagen travel-time check is CLOSED, moot** — the trip itself
     was skipped, Yehor's decision, Session 4.30. Do not re-raise it.

10. **Entirely Yehor's own, unconfirmed as of this write:** the dress
    rehearsal on his actual demo laptop (re-run against whichever
    version step 6/7 lands on), and locating and striking the stale
    pip/npm syntax-gotcha section in `CHEAT-SHEET.md` (location outside
    this session's mount, per `KS-REPORT-4.26`) before Thursday.

11. **No `wrangler deploy` before Thursday 2026-09-17, regardless of
    `0.1.17`'s outcome.** Standing rule, reaffirmed explicitly across
    multiple Session 4.30 turns, unchanged. `0.1.17` touches PyPI and
    npm only.

12. **Methodology reminders, earned in Session 4.30, not invented:**
    - When a pasted diff, terminal summary, or *this session's own
      first-pass conclusion* looks wrong or looks right, the fix is the
      same: read the actual bytes (`device_stage_files` or a direct
      fetch), never the reflowed rendering or a plausible narrative.
      Session 4.30 caught two of its own errors this way — a test-
      failure misdiagnosis mid-session, and a weekday typo in a document
      it had authored itself minutes earlier, caught only at close.
      Neither this session's authorship of a document nor the passage
      of only a few minutes is a reason to skip checking it.
    - **Confirm both `MEMORY/state.md` and `PROGRESS.md` were actually
      updated before calling any session closed.** Session 4.29 rotated
      `state.md` correctly but silently skipped `PROGRESS.md` — caught
      only at Session 4.30's close, one full session late. Check for
      the `PROGRESS.md` append explicitly; do not assume it happened
      because `state.md` did.
    - `pipx` is architecturally incompatible with this tool's Python-
      side dependency check (confirmed by direct testing) — never
      recommend it again in any install documentation.
    - `npmjs.com/package/fixprove` genuinely 403s a non-browser fetch —
      any npm registry check needs the browser tool, confirmed, not a
      shortcut being skipped.

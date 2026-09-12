# KS-REPORT 4.28 — Video Demo Section, CSS Gap Fix, P0 CLI Real-Machine
# Verification, and a Publish Version Mismatch (npm 0.1.13 live / PyPI
# still 0.1.12)

## 1. Provenance

Session opened per `NEXT-SESSION-4.28-STARTING-PROMPT.md` (written at
Session 4.27's close, 2026-09-08). Executor track (this session): file
and device-bridge tools only — `device_bash` (shell/git on the FixProve
mount) was down for the entire session, an unresolved Sept 8
Windows-update issue on the mount host, same gap already recorded at the
2026-09-11 daytime executor pass folded into `PROGRESS.md`'s "Session
4.27½" bridge entry. No git command was run by the assistant at any
point in Session 4.28. Every terminal result in this report — build,
test, publish — was run personally by Yehor, on his own machine, and
pasted in; each is independently cross-checked below rather than taken
on trust, per this project's standing methodology.

Work performed, in the order it happened:

1. Added a `<video>` lead-in section (`.video-intro`) to
   `web/src/app/demo/page.tsx`, matching CSS in `web/src/app/globals.css`,
   and split `VOICE-AGENT-DEMO-PAGE-backlog.md` to separate the deferred
   live-Q&A voice agent (still not started, legal gate unchanged) from
   the new pre-rendered video (no legal gate — no third-party audio data
   flow).
2. A guide-reported CSS gap — `.video-intro` used in JSX with no matching
   rule in `globals.css` — verified and fixed (`.demo-video` block,
   `.video-intro h2` margin fix).
3. Diagnosed and filed `CLI-STUB-TEST-WINDOWS-GAP-backlog.md`: a Windows
   portability gap in `cli/test/check.stub.test.ts`'s POSIX-shebang stub
   mechanism (test-infrastructure only, not a product defect, not P0).
4. Led the two P0 CLI fixes (stale `--version`, pip/npm command-grammar
   divergence — both implemented in the prior session, per this session's
   guidance) through to real-machine confirmation: `pnpm --filter ./cli
   build`, `pnpm --filter ./cli test`, `pytest
   tests/test_cli_check_token.py -v` (6/6), and a real end-to-end console-
   script smoke test — all on Yehor's own Windows hardware.
5. Drafted a LinkedIn reply to Augustin Gottlieb (Aarhus Claude Code
   Meetup #3 organizer) confirming interest in a 10-15 minute mini-demo
   slot; Yehor reports it sent.
6. Updated `FIXPROVE-PRIORITY-TRACKER-2026-09-11.md` four times across
   the session as facts changed (Augustin resolution, the 5-minute-demo
   decision, P0-a closure, and — pending this close — tonight's publish
   findings).
7. Yehor ran `npm publish` (succeeded, with two warnings) and then
   `python -m build` + `twine upload dist/*` (failed, `403 Forbidden`) —
   root-caused below via two independent primary-source checks, not
   guessed.
8. Yehor attempted the recommended git-commit/tag sequence from
   `C:\Temp\fp-fresh-npm` — a scratch folder, not the repo — every
   command failed with `fatal: not a git repository`. This is the trigger
   for tonight's close and the single most important open item below.

## 2. Verification table

| # | Claim / result | Method | Verdict |
|---|---|---|---|
| 1 | `.video-intro` CSS gap was real (guide-reported) | Direct grep of both `page.tsx` and `globals.css` in this session, before any edit | CONFIRMED — gap was real, now fixed |
| 2 | CSS specificity mechanism guide cited for the fix ("equal specificity, resolved by source order") | Independently re-derived: `.video-intro h2` = class+element (0,1,1); `section h2` = element+element (0,0,2) | **CORRECTED** — a class selector always outranks a bare element selector regardless of source order; the practical fix was still right, the stated reason was not |
| 3 | 5 of 7 `check.stub.test.ts` tests fail on Windows | Read the actual test source (`writeStubInterpreter`'s shebang+chmod mechanism), not inferred from output alone | CONFIRMED — root cause is POSIX-only stub mechanism, not a product defect |
| 4 | The one nominally-similar 5th test's pass was "coincidental" (guide's framing) | Read that specific test's body: hardcoded nonexistent path, never calls `writeStubInterpreter()` | **CORRECTED** — that pass is genuine and platform-independent, not coincidental |
| 5 | A guide-model block claiming a dropped "4th tracker instruction" | Checked against this conversation's own actual turn history directly | **REJECTED as fabricated** — no such instruction was ever given; declined per the standing critical-actions-register rule on pasted content claiming to speak for Yehor |
| 6 | "5 min max" demo-length decision, relayed via guide chat | Distinguished from the above: this was Yehor's own relayed decision (citing Travis Mathers's advice), not a claim about this conversation's history | ACCEPTED and recorded — correctly treated differently from item 5 |
| 7 | `npm --version` fix (`0.1.13`) | Yehor's real `pnpm --filter ./cli build` + `node cli\dist\src\index.js --version` output | CONFIRMED — `0.1.13`, byte-exact match to `cli/package.json` |
| 8 | CLI pip/npm syntax-divergence fix | Yehor's real `pip install -e .` (compiled real `tree-sitter`/`tree-sitter-typescript` native wheels) + `pytest tests/test_cli_check_token.py -v` | CONFIRMED — 6/6 passed, including the no-path-defaults-to-`.` regression test |
| 9 | End-to-end console-script smoke test | Yehor's real `fixprove check C:\Temp\fp-smoke` + `$LASTEXITCODE` | CONFIRMED — `No unresolved symbols found.`, exit `0` |
| 10 | npm's "bin[fixprove]... invalid and removed" publish warning broke the real install | Staged and read `cli/dist/src/index.js` directly (`cat -A`, clean `#!/usr/bin/env node`, no BOM); then Yehor's real `npm install -g fixprove` + `fixprove --version` + `fixprove check` | **CONFIRMED FALSE ALARM** — npm's in-memory manifest normalization does not touch the file on disk; the live published package works correctly |
| 11 | `twine upload` `403 Forbidden` cause | Live `WebFetch` of `https://pypi.org/project/fixprove/` (confirms 0.1.12 is live, "published via trusted publishing") + direct read of `.github/workflows/release.yml` (OIDC-only publish jobs, no manual-token path designed at all) | CONFIRMED — this project's PyPI project is Trusted-Publishing-only; a manual token was never going to work, by design (originally closed off after a real token leak, per the workflow's own KS-TRACE comments) |
| 12 | Publish version state, right now | Yehor's pasted terminal output, both attempts | CONFIRMED, and this is the headline finding: **npm `fixprove@0.1.13` is live** (published manually, without `--provenance`); **PyPI is still at `0.1.12`** — the two registries have diverged |
| 13 | The repo at `D:\Dev\Projects\FixProve` is a real git repository | Fresh `device_list_dir` tonight, this close, shows a `.git` directory present | CONFIRMED — the earlier `fatal: not a git repository` failures were caused by running from `C:\Temp\fp-fresh-npm` (a scratch folder), not by any actual repo damage |
| 14 | Every file this session wrote (or that the immediately preceding session's P0 fixes wrote) has been git-committed | No git tool was ever available to the assistant this session; asked and confirmed via the record itself (nothing in this session's own tool use ever included a commit) | **CONFIRMED — nothing is committed.** See §4, top item. |
| 15 | Byte-exact re-verification, this close, of every file this session touched | Fresh `device_list_dir` calls tonight against `web/src/app/demo/page.tsx` (7669 B), `web/src/app/globals.css` (5163 B), `FIXPROVE-PRIORITY-TRACKER-2026-09-11.md` (18123 B), `CLI-STUB-TEST-WINDOWS-GAP-backlog.md` (3843 B), `VOICE-AGENT-DEMO-PAGE-backlog.md` (7778 B) | CONFIRMED — all match the sizes reported when each was originally delivered; nothing drifted mid-session |

## 3. Defects caught and fixed (or correctly declined)

- **D1 — `.video-intro` CSS gap.** Real, fixed with a minimal
  convention-matching rule (`.demo-video` block + `.video-intro h2`
  margin reset), not a rewrite.
- **D2 — CSS specificity mischaracterization.** Guide's stated mechanism
  was wrong; the fix itself was right. Corrected the record, not the
  code.
- **D3 — Windows shebang test-stub gap.** Real, filed as backlog, not
  fixed tonight (test-infrastructure only, needs both a real Windows and
  a real POSIX machine to verify a fix — neither is this sandbox).
- **D4 — Fabricated "dropped instruction" claim.** Declined outright
  after checking this conversation's own actual turn history — matches
  the established project-defect pattern of pasted "guide model" content
  occasionally misrepresenting this session's own history (see
  `KS-REPORT-4.27` Defect 3 for the precedent).
- **D5 — npm publish-warning false alarm.** Investigated to a confident,
  evidence-based conclusion (real file inspection + real fresh-install
  test) rather than left as an open worry.
- **D6 — PyPI `403 Forbidden`.** Root-caused via two independent primary
  sources, not guessed at from the error text or npm/PyPI internals
  recalled from memory.
- **D7 (new, this close) — npm/PyPI version mismatch.** `fixprove@0.1.13`
  is live on npm; PyPI is still `0.1.12`. Not yet remediated — see §6.
  Recognized proactively, before Yehor attempted the next step, that
  pushing a `v0.1.13` git tag now would make the CI release workflow's
  npm-publish step fail on a version collision (this exact mirror-image
  failure mode is already documented, having happened once before in
  this project, in `release.yml`'s own KS-TRACE comments) — so the
  recommended fix is a fresh `0.1.14`, not a retry of `0.1.13`.

## 4. Known limitations — read this section first

**Nothing this session wrote — or that the immediately preceding
session's two P0 CLI fixes wrote — has ever been `git commit`ed.**
`device_bash` was down for the entire session, so the assistant had no
way to stage or commit anything; every change exists only as an
uncommitted working-tree modification on Yehor's machine. This includes
the source of `fixprove@0.1.13`, the version Yehor just published live to
the public npm registry tonight — meaning a real, live, publicly
installable package currently has **no corresponding git history at
all**. This is not a data-loss risk in itself (the files are intact,
confirmed by the byte-exact re-checks in §2), but it is a real gap
between what the world can install and what the repository's own history
says exists. Closing this gap is the unambiguous first step below,
before anything else, including the version bump.

Other limitations, lower urgency:

- The `.mp4` file the new video section actually needs
  (`/demo-narration.mp4`) has not been recorded; the section is written
  defensively (fallback text inside the `<video>` element) and is not
  live in production regardless of git state.
- The customer self-test (3 real, unplanted GitHub repos against
  `fixprove check`) has not been run — still the single most valuable
  unscripted proof point before Sept 16/17, and still open.
- `CLI-STUB-TEST-WINDOWS-GAP-backlog.md`'s underlying fix
  (`writeStubInterpreter` branching on `process.platform`) is
  deliberately not attempted in-sandbox — it needs both a real Windows
  and a real POSIX machine to verify, which no single environment
  available to this project provides at once.
- PyPI is one full version behind npm (`0.1.12` vs `0.1.13`) as of this
  close — not remediated this session, see §6.

## 5. Accountability statement — PENDING SIGNATURE

No CA-class action was taken by the assistant this session. No money
moved, no repo-visibility change, no in-name publishing by the assistant
(`npm publish` and `twine upload` were both run by Yehor personally, on
his own machine, using his own credentials), no report/log/MEMORY-file
deletion, no instruction change, no `git commit` or `git push` (none was
possible — no shell access existed, and none was attempted). Everything
published tonight — the live `fixprove@0.1.13` npm package included —
was Yehor's own action, on his own machine, under his own authority; the
assistant's role this session was limited to diagnosis, verification,
drafting, and file-level delivery through the device bridge.

Signature: ______________________ Date: ______________

## 6. Methodology note

Standing project discipline, applied throughout this session: (a) pasted
"guide model" content is checked against primary sources — this
conversation's own actual turn history for claims about what was said or
decided, live web/registry state for claims about the outside world —
before being acted on, never accepted on tone or plausibility alone; (b)
a genuinely relayed decision from Yehor (via the guide chat) is treated
as fact once distinguished from a fabricated claim about this
conversation's own history — the two categories require different
handling and this session correctly separated them twice (D4 vs. the
accepted 5-minute-demo decision); (c) real-machine verification
(Yehor's own build/test/publish output) is preferred over reasoning about
tool internals from memory — this is what turned the npm bin-warning
from an open worry into a confirmed false alarm, and what turned the
PyPI 403 from a guess into a root-caused, three-times-documented
(workflow file, live PyPI page, this report) conclusion.

## 7. Immediate next step

See the ready-to-copy instructions delivered in this session's final
chat message. In order: (1) `git status`/`add`/`commit`/`push` everything
from the correct repository path — this is the single highest-priority
action, ahead of any version bump, because a live public package
currently has no git history behind it; (2) once committed and pushed,
decide and execute the `0.1.14` version-bump + tag-triggered CI release
plan (see `NEXT-SESSION-4.29-STARTING-PROMPT.md` item 1) to bring PyPI
back in sync with npm through the project's proper OIDC release path,
rather than retrying a manual `twine upload` or re-publishing `0.1.13`.

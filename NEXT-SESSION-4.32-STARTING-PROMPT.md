NEXT SESSION — 4.32 — "Record the pitch outcome, run the maintenance
protocol's first real pass, then ship v0.1.17 from the written plan — no
deadline, no shortcuts"

Written 2026-09-28, Session 4.31 close. Session 4.31 changed no product
code. It found and recorded a 13-day silent gap — the 0.1.17 stop-loss
(20:00 CEST, 2026-09-15) passed unshipped and the Sep 17 meetup ran on
`0.1.16`, but nobody wrote that down until 2026-09-28. It then closed the
admin backlog: Nordea Business Base signed (aftale 0170870662, NemKonto
automatic, marketing consent declined); company name + CVR confirmed live
on fixprove.dev (no deploy needed) and added to yehor.ai (`321beaa`, live,
Vercel recovered from the Sep 13 failures); the npm granular token retired
by decision — publishing is OIDC-only on both registries; a fact-checked
3-slide deck built for the 2026-09-29 funding pitch; and
`RELEASE-PLAN-0.1.17-2026-09-28.md` written with D9 decided. Records
committed `174267c`, CI green (build, test-python).
Every number below was correct as of 2026-09-28 — recompute the live
clocks fresh at session open rather than trusting this file, same standing
rule as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. Availability line: tools, folders, files reachable. `device_bash` came
   back in 4.31 after five sessions down — state explicitly whether it is
   still up. Note `D:\Dev\Projects\yehor.ai` was granted to 4.31 only; it
   is not assumed connected.
2. Read `MEMORY/state.md` in full and answer its three reload questions
   before anything else. Then check `.git/*.lock` and
   `.git/objects/*.lock` (rename aside into `.git/_stale_locks/`, never
   delete), `git log -1 --oneline`, and `git ls-remote origin
   refs/heads/main`. Expected: `174267c` on both, unless KS-4.31/4.32
   close files were committed in between — report any drift.
3. Ask Yehor for the funding-pitch outcome (Narcis's Funding Pitch
   Challenge, 2026-09-29): any feedback, any follow-up asked for, any
   funding path opened. Record it in PROGRESS.md external-signals and the
   tracker — as he reports it, nothing inferred. Ask also whether the
   deck's milestone ("3 paying Danish customers by 12 Nov 2026") is now
   the real target or stays a pitch line; the recorded D3 threshold is
   ">=3-5 installs AND >=1 willingness-to-pay signal" (window ends
   2026-11-12).
4. Run `MAINTENANCE-PROTOCOL-browser.md`'s first full pass — it has NEVER
   run. All 9 items, quoted evidence, recorded in the tracker's "Watch list
   — last checked" table. Before any release file is touched: CI green on
   the exact HEAD sha, both registries still read `0.1.16`, OIDC trusted
   publisher still configured (npm token is gone by design — a publish
   failure means fix OIDC, not mint a token, unless Yehor approves, CA-3).
   npm's web page 403s non-browser fetches — use the registry JSON or the
   browser tool.
5. One open design question for Yehor BEFORE editing `cli.py`: empty
   target (no source files at all, nothing skipped) — keep exit 0 (plan
   default, approved rule says "after skips") or 2? Ask; do not default.
6. On Yehor's explicit go, execute `RELEASE-PLAN-0.1.17-2026-09-28.md`
   exactly — do not re-derive it:
   * version bump both packages; `requires-python >=3.10` with KS-TRACE;
     `check.ts` "Python 3.10+"; prerequisite line in the three READMEs;
     module-augmentation sentence "clarified"; D8 known-limitation
     paragraph (doc only);
   * D9 in `cli.py`: exit 2 only when a skip occurred AND files_checked
     == 0; report still printed (JSON consumers keep a body); tests:
     existing mixed-project test must still pass, new pure-Python and
     pure-TS exit-2 tests, adversarial empty-target test pinned to
     Yehor's step-5 answer, property-style combination check;
   * build and test in a /tmp clone — never `npm install`/`pip install`
     /`venv` on the mount;
   * one commit, explicit paths only (291 CRLF-only mods sit in the tree —
     NEVER `git add -A`), KS-TRACE-citing message, push, CI green on that
     sha before tagging. Yehor commits natively on Windows if the bridge
     commit hits the unlink wall.
7. Tag only on Yehor's explicit one-word go — `git tag v0.1.17 && git push
   origin v0.1.17`. Watch `publish-npm` and `publish-pypi` from raw job
   logs, not the green check; confirm npm `_npmUser.trustedPublisher`.
8. Fresh install, all FIVE proofs, exit codes pasted:
   * `fixprove --version` = `0.1.17` via fresh `pip install` AND fresh
     `npm install -g`;
   * BOM'd `package.json` (Session 4.30 D5 repro) parses, no crash;
   * `import { CSSProperties } from "react"` resolves clean (D6);
   * both planted samples still caught — `fetch_status.py:11
     requests.get_json`, `script.ts:9 axios.getJson` (false-negative check);
   * NEW: pure-Python project with no requirements.txt → warning + exit 2.
   No clock this time, but the freeze rule survives: if any proof fails,
   stop, record it, do not patch-and-retag in the same breath.
9. If all pass: `INSTALL-CARD.md` — one screen, "Requires Python 3.10+",
   Python path (`pip install fixprove` → `fixprove check .`), Node/TS path
   (`pip install fixprove` for the engine, then `npx fixprove check .` or
   `npm i -g fixprove`), "command not found" fallback (`python -m cli
   check .`), plain-language meaning of "flagged", exit codes incl. the D9
   case. No pipx anywhere. Commit only, no deploy.
10. Carry-forwards, lower priority, only after the above:
   * Sign `KS-REPORT-4.31-stoploss-record-admin-close-pitch-deck.md` §5
     and, if ready, `KS-REPORT-4.27-...` §5 — dated addendum, never an
     edit to a report's own text.
   * Nordea Business login → confirm account visible; nemkonto.dk check a
     few days later → close NemKonto route in
     `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` (append).
   * Cernel / WasteHero / Kondrup threads — quiet, possibly dead; ask once.
   * Yehor's own: Digital Post from AOF Sydjylland (2026-09-17).
11. Do NOT re-raise: IVSR K145X8 (leave alone, Yehor 2026-09-28);
    Copenhagen/AI Tinkerers; personal admin matters Yehor has closed;
    CHEAT-SHEET.md / demo-laptop rehearsal (moot after the meetup unless
    the demo kit is reused).
12. Methodology reminders, earned in Session 4.31, not invented:
   * A stop-loss that passes must be recorded the same day, pass or
     freeze. 4.31 exists partly because 4.30's clock expired silently.
   * The guide model's conclusions are claims to test. 4.31 caught three
     unsupportable pitch lines and one wrong own instruction by reading
     the repo and the source page instead of the narrative.
   * `git status` / `git fetch` via the bridge leave `.lock` files behind
     (unlink impossible on these mounts) — rename them aside immediately.
   * `PROGRESS.md` is gitignored by design (`.gitignore:66`) — a `git add`
     refusal on it is expected, not an error; confirm the on-disk append.
   * Live-page checks beat dashboards: fetch with a cache-buster and read
     the actual bytes before claiming a deploy landed.
   * `pipx` is architecturally incompatible — never recommend it.

Close discipline: replace `MEMORY/state.md` (preserve predecessor as
`state.superseded-4.31-close-snapshot.md`), append `PROGRESS.md`, and
confirm BOTH changed before calling the session closed.

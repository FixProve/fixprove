# KS-REPORT 4.30 — Addendum 1: Independent Field-Verification Review
# (One New Confirmed Defect, One Already-Fixed-But-Unreleased Defect,
# One Small Confirmed Exit-Code Gap)

Dated addendum per this project's convention (4.12-C/4.25/4.26/4.28
precedent) — appended after the KS-REPORT-4.30 body and its close commit
(`3c42c71`), not an edit to that report's own text.

## 0. Session 4.30's close — final commit, independently confirmed

The close commit Yehor pushed is `3c42c71`, not `7b7e1f8` as
`KS-REPORT-4.30` and `MEMORY/state.md` say at the point they were
written (those files were themselves part of what `3c42c71` committed —
a normal "the record is written before the commit that carries it"
sequence, not a discrepancy). Independently re-verified after Yehor's
pasted push output: `.git/refs/heads/main` and `.git/refs/remotes/
origin/main`, read directly off Yehor's disk, both
`3c42c7128a37bbbb5ca3efbc18defe1a7a8b7ddd`; the workflow-specific CI
Actions page fetched directly shows this exact commit on `main`,
**Success**, 58s.

**One correction to my own prior instructions, caught by git's own
output, not by me:** I told Yehor to `git add` `PROGRESS.md` alongside
the three tracked files. Git refused it with its own warning —
`PROGRESS.md` is gitignored, same category as `MEMORY/`. This was my
error (I had assumed it was tracked like `NEXT-SESSION-*`/`session-logs/`
without checking); no harm done — git safely declined without `-f`, the
commit correctly contains only the three tracked files
(`KS-REPORT-4.30-bom-namespace-defects-0.1.16-close.md`,
`NEXT-SESSION-4.31-STARTING-PROMPT.md`,
`MAINTENANCE-PROTOCOL-browser.md`), and `PROGRESS.md`'s backfilled
content is already correctly written to disk as a local-only file, which
is all it ever needed to be. **New durable note, filed into
`MEMORY/state.md`:** `PROGRESS.md` is gitignored, local-only — despite
sitting alongside `NEXT-SESSION-*-STARTING-PROMPT.md` and
`KS-REPORT-*.md`, which are tracked. Do not assume it needs a `git add`
at any future close.

**Separately observed, not a defect, filed for awareness only:** the
push output shows `remote: Bypassed rule violations for refs/heads/main:
- Changes must be made through a pull request. - 2 of 2 required status
checks are expected.` This repo has branch-protection rules configured
requiring a PR and 2 status checks on `main`; Yehor's direct pushes
bypass them (consistent with an admin/owner role). Not new tonight, just
newly visible in this pasted output — a housekeeping item for whenever
Yehor wants to revisit branch-protection policy, not an incident.

## 1. Provenance

Yehor commissioned a separate Claude Code Sonnet 5 session to install
the published `fixprove` packages fresh and test them, independent of
this session's own work. Per this project's standing rule ("verify
independently, never accept a relayed claim on trust"), its report was
read via the `Artifact` tool's `read` action — the full raw HTML, not
the pasted chat summary — and every claim in it that mattered was
independently reproduced from scratch in this session's own sandbox
before being accepted into this record.

## 2. Verification table

| # | Claim (field report) | This session's independent method | Verdict |
|---|---|---|---|
| 1 | EV-03: `from cryptography.hazmat.primitives.asymmetric import rsa` flagged as unresolved on real, correct code | Fresh venv, `pip install fixprove` (0.1.16, published) + `pip install cryptography`; first repro attempt used an unpinned `requirements.txt` line and did NOT reproduce (`unsupported-requirement-line` status — the parser only accepts exact `==` pins, confirmed by reading `_REQ_LINE_RE` directly); re-ran with a pinned `cryptography==<installed version>` line | **CONFIRMED, real** — reproduces exactly as reported once the manifest is valid |
| 2 | Root cause: `resolver.py`'s Pass A checks the imported leaf name only against the top-level package's flat symbol list, never the actual submodule | Read `resolver.py` lines 152-180 and `_kb_worker.py`'s introspection call directly: `importlib.import_module(module_name)` imports only the top-level distribution name, then `dir(module)` — no submodule walk anywhere in the path | **CONFIRMED** — matches the field report's diagnosis exactly |
| 3 | EV-04: `import { CSSProperties } from 'react'` flagged as unresolved under React 19.2.7 + `@types/react` 19.2.17, on the **published** 0.1.16 package | Fresh `npm install react@19.2.7 @types/react@19.2.17`; ran the published (unpatched) 0.1.16 engine against the exact repro | **CONFIRMED, real** — reproduces exactly |
| 4 | (Not claimed by the field report — it had no visibility into this session's own unreleased work) Whether the `aaafaeb` fix already on `main` (Session 4.30, this same session) also resolves the React 19 shape, not just the React 18.3.1 shape it was tested against | Installed the patched engine (working tree at `aaafaeb`, from this session's own `fixprove-repro` scratch clone) via `pip install -e .` into a fresh venv; ran it against the exact same React 19.2.7/@types 19.2.17 repro | **CONFIRMED — already fixed.** `No unresolved symbols found.`, exit 0. EV-04 needs **no new engineering** — it ships the moment `0.1.17` does |
| 5 | EV-06: a Python project with no `requirements.txt` returns exit `0` even though the Python check was entirely skipped (including a genuine, present hallucination) | Fresh directory, `main.py` with a real `pd.read_exel` typo, no `requirements.txt`, ran the published engine | **CONFIRMED, real** — `warning:` printed to stderr, but `Checked 0 file(s)`, `No unresolved symbols found.`, **exit 0** |

## 3. Defects — disposition

- **D8 (new) — from-import submodule resolution (EV-03).** Real,
  confirmed, isolated. Affects any package whose public API is exposed
  below the top level: `cryptography`, `opentelemetry`, `typer.testing`,
  `fastapi.testclient`, `sqlalchemy.orm`, and likely many more —
  genuinely common, current code. **Recommendation: do NOT add to
  `0.1.17`'s scope.** The correct fix is not a two-line change — it
  requires the KB-build step to introspect the actual submodule path a
  `from x.y.z import Name` names, not just reuse the cached top-level
  package's `dir()`, which is a real design question (walk eagerly for
  every dotted from-import found in source? cache per-submodule the same
  adversarial-subprocess way top-level modules are cached today?) that
  deserves proper design time, not a rushed change discovered hours
  before a stop-loss deadline. **Disclose it instead**, in the same
  documented-known-limitation style already used for D2 (vitest
  cross-package re-exports, Session 4.29): a short, honest paragraph in
  `engine/python/README.md` naming the exact shape (`from pkg.sub.sub
  import Name` where `Name` isn't re-exported at `pkg`'s own top level)
  and the affected package examples above. This is a documentation-only
  addition to `0.1.17`'s existing scope — low risk, and it directly
  matches the field report's own honest framing rather than shipping
  silent on a known gap. **This is Yehor's call, not decided here** —
  the alternative (attempt the real fix under time pressure) is
  explicitly not recommended, but it's his release to schedule.
- **D6 (Session 4.30, `aaafaeb`) — confirmed to also cover EV-04's exact
  React 19 shape.** No new work. Ships as already planned in `0.1.17`.
- **D9 (new, small) — "no manifest found" returns exit 0 (EV-06).** Real,
  confirmed. Low blast radius to fix (a `cli.py` exit-code branch), but
  it does change the documented exit-code contract (`0`/`1`/`2`/`127`) —
  worth a line in the release notes either way it's decided.
  **Offered as an optional, low-risk addition to `0.1.17`'s scope**;
  equally reasonable to defer one cycle and disclose alongside D8 if
  Yehor would rather keep Tuesday's diff surface exactly as already
  planned. Not decided here.
- **EV-05 (invented package names pass clean) and EV-08 (`.gitignore`
  not respected)** — both real per the field report's own repro, both
  lower-severity scope gaps already partially covered by this project's
  existing README language (EV-05) or genuinely new (EV-08). Filed to
  backlog, not time-pressured, not examined further this addendum.

## 4. What this changes about Tuesday, concretely

Nothing about the plan already in `NEXT-SESSION-4.31-STARTING-PROMPT.md`
needs to change in shape — the four regression proofs, the stop-loss,
the tag-only-on-Yehor's-go sequence all stand exactly as written. What's
added: a D8 disclosure paragraph (README, documentation-only, low risk)
as an explicit item in the 0.1.17 scope, and an explicit decision point
for Yehor on D9 before the bump commit. `NEXT-SESSION-4.31-STARTING-
PROMPT.md` has been updated in place to reflect both, same file, no new
prompt needed.

## 5. Accountability statement

No CA-class action taken. All verification this addendum reports was
run in this session's own cloud sandbox against the real published
PyPI/npm packages and a local scratch clone already carrying Session
4.30's own unpushed-to-a-release fix — no file on Yehor's machine's
working tree was touched by this verification work. The field-
verification report itself was commissioned and run by Yehor via a
separate session, not this one; its artifact was read, not trusted, and
every load-bearing claim in it was independently reproduced before being
folded into this project's record.

# KS-REPORT 4.32 — Post-pitch pipeline, first maintenance pass, v0.1.17 released

Session 4.32 · 2026-10-05 · Claude (Node 1) executor · Director: Yehor
Kaliberda · Guide: separate chat (inputs relayed by Yehor)

## 1. Provenance

| Artefact | Origin | Human role |
|---|---|---|
| `engine/python/cli.py` exit-2 guard, `tests/test_cli_nothing_checked.py`, D9 test update | AI-generated | Rule decided by Yehor (D9 2026-09-28; empty target 2026-10-05) |
| Version bump, Python 3.10 floor, `check.ts` message, README lines (3 files), D8 + augmentation wording | AI-generated from `RELEASE-PLAN-0.1.17-2026-09-28.md` | Plan approved by Yehor |
| Commit `e38becb` | AI-built in a clean device clone; delivered as a git bundle | **Pushed by Yehor**; **tag `v0.1.17` created and pushed by Yehor** (CA-3 executed by Yehor himself) |
| `PILOT-PIPELINE-2026-10-05.md` (local-only), `PILOT-ONE-PAGER.md`, `LOI-TEMPLATE-EN-DA[-CLIENT].md`, `TEGAN-SPINNER-PREP-2026-10-05.md` (local-only), `INSTALL-CARD.md`, `RELEASE-NOTES-0.1.17.md` | AI-generated (web research by sub-agents, sources linked) | Direction from Yehor + guide; nothing sent |
| 3 Gmail drafts (Travis; Narcis HOLD; Puzzel) | AI-drafted | Unsent; Yehor sends |
| Narcis follow-up, Augustin message, Tegan note | Written/sent by Yehor (LinkedIn) | Yehor-reported |

## 2. Verification summary

- **Session start:** HEAD `45def6c` = origin; CI green on `45def6c` (check-runs);
  bridge-created `index.lock` renamed, not deleted; 291 ` M` = CRLF only.
- **Maintenance protocol, first full pass:** 9/9 items with evidence
  (tracker table, 2026-10-05).
- **CLI no-network claim:** source grep of engine + npm wrapper — TRUE, with
  two disclosed caveats (local dependency imports; GitHub App is a different
  data path).
- **0.1.17 pre-push (device clone, Python 3.10.12, Node 22):** pytest
  `253 passed` (baseline 232 on `45def6c`); `pnpm build` / `typecheck` /
  `test` green; release version-sync gate simulated: `OK: both manifests
  agree at 0.1.17`.
- **Adversarial:** two mutations of the new guard (`skipped and …`,
  `if False`) → 6 and 14 test failures — the tests bite. Property matrix over
  all 16 {py, requirements, ts, package.json} combinations asserts
  `rc == 2 ⇔ files_checked == 0`.
- **CI on `e38becb`** (run #96): raw line `253 passed in 14.09s`; build green.
- **Release run #19** (`actions/runs/37335402726`): test, verify-artifact-
  contents, publish-pypi, publish-npm — all success.
  - publish-pypi raw: `Checking engine/python/dist/fixprove-0.1.17-py3-none-any.whl: PASSED`,
    `Checking …fixprove-0.1.17.tar.gz: PASSED`, `Notice: Generating and uploading digital attestations`.
  - publish-npm raw: `npm notice 📦 fixprove@0.1.17`, `npm notice publish Signed provenance statement …`, `+ fixprove@0.1.17`.
- **Registries:** PyPI `0.1.17`, `requires_python >=3.10`, wheel uploaded
  `2026-10-05T15:47:57Z`, provenance endpoint 200. npm `latest: 0.1.17`
  (`2026-10-05T15:48:56Z`), `_npmUser: GitHub Actions`, `trustedPublisher: github`.
- **Six fresh-install proofs** (new venv + `npm -g --prefix`, device):

| # | Proof | Result |
|---|---|---|
| 1 | `--version` via pip / via npm | `0.1.17` rc=0 / `0.1.17` rc=0 |
| 2 | BOM'd `package.json` (bytes `efbbbf` confirmed) | parsed, rc=0 |
| 3 | `import { CSSProperties } from "react"` (react 18.3.1 + @types/react 18.3.12) | clean, rc=0; negative control `CSSPropertiez` → flagged, rc=1 |
| 4 | Planted samples | `fetch_status.py:11: unresolved-symbol: requests.get_json` rc=1; `script.ts:9: unresolved-symbol: axios.getJson` rc=1 (via npm wrapper) |
| 5 | Pure Python, no requirements.txt | warning + `error: every detected ecosystem was skipped…`, rc=2 |
| 6 | Empty folder (pip and npm) | `error: no Python or TS/JS source files found under p6 -- nothing was checked.` rc=2 / rc=2 |

## 3. Defects caught and fixed

- **Fixed before push:** existing test `test_cli_warns_and_skips_on_missing_requirements`
  asserted the old exit 0 for a pure-Python, no-manifest project; updated to
  the D9 contract (rc=2) with a KS-TRACE explaining the contract change.
- **Found after release, NOT fixed (no patch-and-retag rule) — D10:** when
  nothing was checked, text-mode stdout still prints `No unresolved symbols
  found.` above the stderr error. Exit code and error are correct, but a
  human skimming stdout sees a clean-sounding line. Root cause: the plan
  chose "report still printed first" for `--json` consumers and did not
  consider the text-mode summary sentence. Fix for 0.1.18: in text mode,
  replace that line with `Nothing was checked.` when `files_checked == 0`;
  add a stdout assertion to `test_cli_nothing_checked.py`. Disclosed in
  `RELEASE-NOTES-0.1.17.md`.
- **Records corrected (guide-chat errors, not Yehor decisions):** Tegan framed
  as investor; two paraphrased Narcis quotes; "can't legally take payment".
  Guide premise "Augustin organises the Bankdata meetup series" — unverified
  (luma lists other hosts).
- **Public-repo exposure prevented:** the guide's records-commit list included
  the named prospect list and a profile of a named person. The repo is
  PUBLIC; both (and the internal LOI copy) were added to `.gitignore` instead.

## 4. Known limitations (unsoftened)

- D10 (above) ships in 0.1.17.
- D8 (submodule from-imports) is documented, not fixed.
- npm publish log warns `"bin[fixprove]" script name dist/src/index.js was
  invalid and removed`, yet the published manifest still lists the bin and
  `fixprove` works after `npm i -g` (proof 1). Not investigated; check whether
  `npm pkg fix` changes anything before 0.1.18.
- Proofs ran on Linux (device VM) only — not on Windows or macOS.
- Pipeline: 17 solid targets, not 20; evidence mostly mirrored job ads;
  re-open sources before quoting. Tegan = module 4 speaker: unverified.
- Camilo's async-scan offer and Yehor's free request: Yehor-reported only.
- CI runners move to Ubuntu 26 from 2026-10-19; Node 20 deprecation warning
  on all actions — both pre-existing, not addressed.
- No GitHub Release page created (optional; Yehor's call — CA-3).

## 5. Accountability statement

I, Yehor Kaliberda, have reviewed this report. The push of `e38becb` and
the tag `v0.1.17` were executed by me. I accept the known limitations above.

Signed: ____________________  Date: __________

## 6. Methodology note

Release built in a throwaway device clone (never installed on the mount),
handed over as a verified git bundle so the tested SHA is the pushed SHA.
CI and publish evidence read from raw job logs, not badges. Fresh installs in
new environments. Every third-party fact in pipeline/prep docs carries a
source link; anything not seen in a primary source is labelled
Yehor-reported or unverified.

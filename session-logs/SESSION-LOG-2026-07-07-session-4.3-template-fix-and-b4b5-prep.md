# Session Log — 2026-07-07 — Session 4.3: Distributable Template Fix and B4/B5 Prep

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode

## 1. Scope

Yehor chose B4/B5 (live seeded-PR test) as the priority for this session over a version-bumped npm publish test. Before adding `app/templates/fixprove-check.yml` to the two private test repos (`yehorcallmedai-maker/autonomous-core`, `yehorcallmedai-maker/yehor.ai`), this session read the full Session 4.1/4.2 history, then adversarially verified the template itself, since it had never actually been exercised end-to-end against a real, published `fixprove` package. B4/B5 execution itself (installing/confirming the App, pushing the workflow file, opening the seeded PRs) remains a HUMAN step per `RUNBOOK-LIVE-DEPLOYMENT.md` — no push credentials exist in this sandbox for either test repo, confirmed this session (`git ls-remote` against both fails with no credentials configured).

## 2. Live state changes

None. All work this session is local to the `FixProve/fixprove` repo checkout; nothing pushed, nothing installed on external infrastructure. Two real, reproducible defects were found and fixed in `app/templates/fixprove-check.yml`, verified against a real `pip install fixprove` (0.1.0, live from PyPI) in an isolated sandbox venv, not just read from source.

## 3. Real defects found this session

| # | Defect | Root cause | Status |
|---|---|---|---|
| 1 | `app/templates/fixprove-check.yml` still installed via a stale placeholder (`pip install -r requirements.txt`, a customer-repo-relative path that could never have resolved to the FixProve engine) and invoked `python3 -m cli` against an engine that was never actually installed | Session 2.1 explicitly logged this as a TODO pending Session 3.1's publish — the publish happened (Session 4.2) but the template itself was never revisited | **Fixed** — real `pip install --break-system-packages fixprove`, confirmed in a real sandbox venv against the live PyPI package; `python3 -m cli --help` and a real seeded hallucination (`requests.get_json_or_die`, pinned `requests==2.x`) both behave exactly per `cli.py`'s documented contract |
| 2 | Any real TS/JS customer repo (e.g. `yehor.ai`) would have every single import flagged `dependency-not-installed` on every PR, including a genuinely clean one, because the template never installs the customer's own JS/TS dependencies before running the check | `ts_knowledge_base.py`'s `build_package_entry()` returns `"status": "not-installed"` for any package whose folder is absent under `node_modules/` (which is always gitignored), and `ts_resolver.py` flags `not-installed` as a `dependency-not-installed` finding for every symbol imported from it. Reproduced directly: a clean `import axios from "axios"` with `node_modules` absent → 1 false-positive finding, exit 1; identical file after `npm install` → 0 findings, exit 0. | **Fixed, pending Yehor's explicit sign-off before push** (this is a new architectural addition, not a mechanical placeholder swap — flagged per the standing rule to get sign-off before closing an architectural decision) — added a conditional `Set up Node` + `Install JS/TS dependencies` step pair, gated on `hashFiles('package.json') != ''`, detecting `pnpm-lock.yaml`/`yarn.lock`/`package-lock.json` and running the matching install command, else falling back to `npm install` |

**A third, non-code finding:** a real `pandas==2.3.3` requirements.txt pin was required for the Python seeded-hallucination test to produce any finding at all — an unpinned `pandas` (no `==version`) line causes `knowledge_base.py`'s requirement parser to mark the whole dependency `"unsupported-requirement-line"`, which silently produces **zero findings for that dependency**, indistinguishable in the JSON report from "genuinely clean." This is not a code defect (the parser's docstring explicitly documents "exact `name==version` pins only" as the supported contract) but it is an operational trap for B5: **`autonomous-core`'s `requirements.txt` must be confirmed to use exact pins before opening the seeded PR**, or the test could silently pass without ever having actually exercised detection. Flagged to Yehor below, not fixed (nothing to fix — it's the tool's documented, by-design contract; the risk is in the test setup, not the product).

## 4. Known limitations (stated plainly)

1. Defect #2's fix (Node/JS dependency install step) has not been exercised against a real seeded PR yet — sandbox verification used a synthetic `axios` project, not the real `yehor.ai` repo. This is exactly what B5 itself will confirm.
2. The unpinned-requirements silent-skip behavior (Section 3, third finding) is a broader product-level risk worth Yehor's attention beyond this session's scope: today, a customer with any unpinned `requirements.txt` line gets a silent "can't check this one" with no visible warning in the JSON report or Check Run summary — indistinguishable from "checked and clean." Not fixed this session (out of scope for B4/B5 prep); flagged for a future session's consideration.
3. The pre-existing carried-forward items from Session 4.2 (restore `npm --provenance` before D2, `ci.yml` not running the Python suite, untracked `logo/`, PyPI Trusted Publisher root cause never confirmed) are all still open and untouched this session.
4. `KS-REPORT-4.2-release-gate-fix.md` showed as locally modified (`git diff`) at the start of this session, containing Sections 4–6 (Known Limitations, Accountability, Methodology Note) that are NOT present in the last commit to that file — this is pre-existing drift from Session 4.2, not caused by this session (nothing in this session touched that file). Likely the same class of mount/git reliability issue Session 4.2 itself documented (Defect #10). Flagged to Yehor: this fix's commit should probably also pick up committing that file's already-written content, since it was clearly intended to be committed and matches what both sessions' own logs already describe as delivered.

## 5. Current state snapshot as of session close

- **`app/templates/fixprove-check.yml`:** corrected locally, not yet committed or pushed. Verified via real `pip install fixprove` in an isolated sandbox venv (not just read from source).
- **Test repos (`autonomous-core`, `yehor.ai`):** unchanged this session — no push credentials available in this sandbox to touch them; App-installation state from Session 4.1 (B4 partial) not independently re-confirmed this session.
- **GitHub App, Worker, PyPI, npm:** unchanged from Session 4.2's close.

## 6. Immediate next step

1. Yehor reviews and (if approved) commits the `fixprove-check.yml` fix — a new tag is not required for this, since it only affects the customer-facing Action template, not the published `fixprove` package itself.
2. Yehor confirms `autonomous-core/requirements.txt` uses exact `name==version` pins for whatever dependency the seeded hallucination will target (Section 3's third finding).
3. Yehor executes B4 (confirm/re-confirm App installation on both repos, add the corrected workflow file) and B5 (seeded PR on each repo) per `RUNBOOK-LIVE-DEPLOYMENT.md` — exact seed-case guidance handed off in chat this session, not duplicated here.

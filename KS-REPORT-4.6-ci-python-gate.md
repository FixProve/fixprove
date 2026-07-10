# KS-REPORT-4.6 — CI Hardening: Python Suite Wired Into `ci.yml` as a Gate

**Director:** Yehor
**Model:** Claude (Sonnet 5), Cowork mode
**Scope:** Session 4.6's mandate is technical-debt/pipeline hardening following the B5 live-validation close of Session 4.5 (TS/JS now matches Python's bar). Of the four listed priorities, Yehor selected priority 2 — wiring the Python engine test suite (`engine/python/tests/`, 217 tests) into `.github/workflows/ci.yml` as a gate on every push/PR to `main`, since only `release.yml`'s release pipeline exercised it before this session. The other three priorities (restore `npm --provenance`, audit the PyPI Trusted Publisher/OIDC config, and decide the Defect B two-hop disposition) remain open, unstarted, and are not addressed by this report.

---

## 1. Provenance

The single code change this session — a new `test-python` job appended to `.github/workflows/ci.yml` (54 lines) — was AI-generated. One architectural fork was surfaced before any code was written, per the standing sign-off rule: whether the new Python gate should run as its own parallel job (a distinct, named status check) or as additional steps appended to the existing `build` job (mirroring `release.yml`'s single combined `test` job 1:1). Yehor explicitly chose the separate-job design. No other design decisions were required — the job's steps are a direct, deliberate copy of `release.yml`'s already-live-proven Python setup (`requirements.txt`, the three corpus fixtures, `ts_corpus` npm install, `pytest`), not a reinvention, specifically to avoid re-deriving the exact defect Session 4.2 already found and fixed in that other location. All git add/commit/push actions remain Yehor's own, on his own machine — no push credentials exist in this sandbox.

## 2. Verification summary

- **Contract established before implementation (Stage 1):** confirmed locally, before writing any YAML, that `engine/python/tests/` requires exactly four fixture-install steps (`requirements.txt`; `pandas==2.3.3` + `requests==2.34.2`; the local `fp-monkeypatch-demo` package; `npm ci` in `ts_corpus/`) to reach 217/217 — matching the mandate's stated count exactly, and confirming `fastapi-helpers-fake` correctly stays uninstalled (it is `corpus/manifest.json`'s deliberate "dependency-not-installed" true-positive fixture).
- **Positive verification:** the new job's exact step sequence was replicated in a fresh off-mount venv and a fresh rsync'd copy of `engine/python` (avoiding the known FixProve-mount write/cache quirks — see Section 3) — checkout-equivalent → `pip install -r requirements.txt` → corpus fixtures → `npm ci` → `pytest tests/ -q`. Result: **217/217 passed**, clean.
- **Adversarial verification (Stage 3, the actual break attempt):** re-ran the identical simulation with the three corpus-fixture-install steps deliberately withheld, to confirm the new gate would genuinely catch a Session-4.2-class regression rather than silently pass. First attempt gave a false negative (see Defect below); once corrected, the withheld-fixture run reproduced the exact historical failure signature — `test_corpus_eval_reports_perfect_precision_recall` failing with `precision == 0.14285714285714285` (1 failed, 216 passed) — matching Session 4.2's own documented incident number for number. Re-installing the fixtures and clearing the cache returned it to 217/217.
- **YAML correctness:** `.github/workflows/ci.yml` parsed cleanly with `PyYAML` (`yaml.safe_load`), confirming both jobs (`build`, `test-python`) are well-formed; bash's view of the file was cross-checked against the Read-tool-confirmed content (md5 + line count) per the standing mount-reliability protocol — no divergence this time.
- **Tools used:** `PyYAML` for workflow-file validation, a scratch venv + rsync'd source copy for full step-by-step job simulation (not a GitHub-hosted runner — no push credentials exist in this sandbox, so this is the strongest verification available locally), direct diffing against `release.yml`'s already-proven step sequence.
- **What remains unverified:** the job has **not** run on a real GitHub Actions runner. Local simulation used Python 3.10 (the sandbox's system interpreter) rather than the workflow's pinned 3.11, and cannot verify GitHub-Actions-specific behavior (runner image quirks, `actions/checkout@v4`/`actions/setup-python@v5`/`actions/setup-node@v4` version-resolution behavior, actual wall-clock timing, or whether branch protection needs updating to require the new `test-python` check). This is stated plainly, not glossed over: **"passed in simulation" is not "passed in CI."** First live run is Yehor's action per the operating constraints (no push credentials in this sandbox).

## 3. Defects caught and fixed (specific, not summarized)

### Defect (verification-harness, not the shipped change) — stale `.fixprove_cache/` silently masked a missing-fixture failure during my own adversarial test

**Symptom:** the first adversarial simulation (fixtures deliberately withheld) reported **217/217 passing** — appearing to prove the gate does *not* catch a missing-fixture regression, which would have meant the whole point of wiring this suite into CI was undermined.

**Root cause:** my rsync command excluded `__pycache__`, `.pytest_cache`, `node_modules`, `build`, `*.egg-info`, and `dist` from the "fresh" copy — but not `corpus/.fixprove_cache/`, the tool's own knowledge-base cache directory. The copy carried over a stale, previously-built cache (created during earlier legitimate testing, when the fixtures *were* installed), so `eval_corpus.py`'s `run_eval()` read cached results instead of rebuilding the knowledge base against the (deliberately absent) packages — silently hiding the exact regression the test exists to catch.

**Fix:** re-ran the rsync excluding `.fixprove_cache/` as well, confirmed no cache directory existed in the fresh copy before running the simulation, and re-verified: precision dropped to `0.142857...` as expected, matching Session 4.2's original incident.

**Does this affect the actual CI job being shipped?** No — confirmed `corpus/.fixprove_cache/` is `.gitignore`'d (`.gitignore:26`) and not tracked in git, so a real `actions/checkout@v4` on a fresh GitHub-hosted runner can never inherit a stale cache; the new job's fixture-install steps always run before its single `pytest` invocation in the same fresh checkout. This was purely an artifact of my own local verification methodology reusing a directory across fixture states, not a defect in `ci.yml`. Documented here per the standing "document every defect found" rule even though it doesn't touch the shipped artifact, because it very nearly produced a false "verified" claim.

### Side finding (real, but out of this session's scope) — `build_knowledge_base`'s cache has no invalidation tied to actually-installed packages

**Symptom:** after correcting the rsync exclusion above, installing the corpus fixtures into the *same* directory where a fixture-less run had already executed still produced the `precision == 0.143` failure — the stale cache from that directory's own prior (fixture-less) run persisted across the later (correctly-fixtured) run, until manually deleted.

**Assessment:** this is a genuine, previously-undocumented characteristic of `knowledge_base.py`'s caching (apparently keyed off `requirements.txt` content/mtime, not off which packages are actually importable) — a real risk for a developer iterating locally who installs a new fixture without clearing `.fixprove_cache/`, but **not a risk for the shipped `ci.yml` job**, since each Actions run gets a cache-free checkout and installs fixtures exactly once before the one `pytest` invocation. Not fixed this session — fixing it would mean deciding a new cache-key design (e.g., hash of resolved installed-distribution versions), which is its own architectural decision requiring its own Stage-1 contract, not a drive-by patch during a CI-wiring session. Flagged here for Yehor's prioritization, not silently absorbed into scope.

## 4. Known limitations (stated honestly)

1. **Not yet run on a real GitHub Actions runner.** Everything above is the strongest verification obtainable without push credentials — a scratch-venv, step-by-step local simulation of the exact job. It is not the same as a live run, and should not be reported to Yehor as "CI passed" until it actually has.
2. **Local simulation used Python 3.10, not the workflow's pinned 3.11.** The 217/217 result should hold on 3.11 (no version-sensitive constructs were touched), but this is an assumption, not a verified fact.
3. **Branch-protection status is unchecked.** If `main` has required-status-checks branch protection configured, `test-python` will need to be added to that list on GitHub's side (Settings → Branches) for the new gate to actually block a merge on failure, rather than merely reporting red. This is a GitHub UI action, not a workflow-file change, and is Yehor's to perform or decline.
4. **The `build_knowledge_base` cache-invalidation gap (Section 3, second item) remains open** — real, but explicitly out of this session's scope per the reasoning given there.
5. **All three other Session 4.6 priorities remain untouched:** `npm --provenance` restoration, the PyPI Trusted Publisher/OIDC root-cause audit, and the Defect B two-hop disposition decision. None were started this session.
6. **All items carried forward from Session 4.5's own Known Limitations that this session did not touch remain open** (Defect B's original two-hop case uncaught by design; namespace-nested-class instantiation uncaught; the two orphaned tag refs; `npx wrangler` on 3.114.17; the untracked `logo/` directory, confirmed still present and still out of scope).

## 5. Accountability statement

Reviewed and directed in real time by: Yehor Kaliberda (selected the Session 4.6 starting priority from four options; approved the separate-parallel-job architecture for the `test-python` gate over the single-combined-job alternative, before any code was written).

Final document review: pending Yehor's read of this report before commit/push.

Date: 10.07.26 Signed: _____________________ (pending)

## 6. Methodology note — one suggested improvement to the process itself

This session's adversarial-verification step almost produced a false pass: the first "fixtures withheld" simulation reported 217/217, which would have meant reporting a working gate that wasn't actually gating anything. The fix was catching that the rsync exclusion list itself needed updating (`.fixprove_cache/` was missing from it) — worth generalizing: whenever a verification step relies on *copying* a repository to isolate it from ambient state, the exclusion list itself is a piece of untested logic and deserves the same suspicion as the code being verified. A cheap, generalizable habit: after any "fresh copy" setup, `find` for the specific tool's own cache/state directories by name before trusting the copy is actually clean, rather than trusting a generic ignore-list assembled from memory of common build artifacts.

# Keystone Report — Session 4.3: Distributable Template Fix and B4/B5 Prep

**Project:** FixProve — Milestone 4 (Live Deployment)
**Session:** 4.3 — Adversarially verify `app/templates/fixprove-check.yml` against the real, now-published `fixprove` package before it goes into live B4/B5 use; prepare exact next steps for Yehor.
**Director:** Yehor
**Date:** 2026-07-07

## 1. Provenance

100% of the diagnostic work and code changes in this session are AI-generated (Claude, Sonnet 5). Nothing was pushed or installed on external infrastructure this session — no push credentials exist in this sandbox for the FixProve repo or either test repo (confirmed via a failed `git ls-remote` against both). The one file changed, `app/templates/fixprove-check.yml`, is local to the checkout pending Yehor's review and commit.

**Architectural decision requiring Yehor's explicit sign-off (not yet closed):** adding a conditional Node/JS dependency-install step to the template (Section 3, Defect 2 below). This is a new addition, not a mechanical fix of a previously-flagged TODO — it changes what the Action does for any TS/JS customer repo. Reasoning logged in Section 3; flagged here per the standing rule that architectural decisions need explicit sign-off before being closed.

## 2. Verification Summary

| Check | Result |
|---|---|
| Real `pip install fixprove` (0.1.0, live PyPI) in an isolated, fresh sandbox venv | Succeeds; `python3 -m cli --help` matches the documented flag surface exactly |
| Real seeded Python hallucination (`requests.get_json_or_die`, module-level, against a `requests==2.32.x`-pinned KB) | Correctly detected: exit 1, one finding, `reason: unresolved-symbol`, exact file/line |
| Same seed against an **unpinned** `requests`/`pandas` requirements.txt line | Silently produces zero findings (`status: unsupported-requirement-line` in the KB) — not a defect in the tool (documented contract), but a real trap for B5's test setup (Section 3) |
| Real corpus true-positive (`corpus/hallucinated/typo_attribute.py`, `pd.read_exel`) reproduced independently in this sandbox, first without a version pin (0 findings — the same trap above) then with `pandas==2.3.3` pinned (correctly detected) | Confirms the pinning requirement is universal, not specific to my synthetic seed |
| Real TS/JS project (`axios`, real `package.json`), `node_modules` absent | 1 false-positive finding (`dependency-not-installed`) on a genuinely clean file — reproduced defect |
| Same TS/JS project after `npm install` | 0 findings — confirms the fix's mechanism (installing dependencies before the check) is what's actually needed |
| Corrected template YAML syntax | Valid (`yaml.safe_load` parses cleanly, all 8 steps present) |
| Callback payload shape (`{oidcToken, findings}`) against `callbackHandler.ts`'s `validateFindings` and `finding.py`'s emitted schema | Cross-checked field-by-field (`file`/`line`/`kind`/`expression`/`reason`) — matches exactly, no changes needed here |

No live GitHub Actions run has exercised this corrected template yet — that is exactly what B5 will do. Everything above is sandbox/local verification (Keystone Stage 3's own Methodology Note from Session 4.2 applies here too: live infrastructure may still surface something this sandbox can't see).

## 3. Defects Caught and Fixed

| # | Defect | Root cause | Fix | Evidence |
|---|---|---|---|---|
| 1 | Template's install step (`pip install -r requirements.txt`) and invocation (`python3 -m cli`) predated the real PyPI publish and could never have worked against a real customer repo — `requirements.txt` at that path would be the *customer's* dependency file, not a way to install the FixProve engine itself, and no `cli` module would ever be importable | Session 2.1 explicitly logged this as a TODO pending Session 3.1's publish (`# TODO(Session 3.1): replace with pip install fixprove once...`); the publish happened in Session 4.2 but the template was never revisited | Real `pip install --break-system-packages fixprove`; kept `python3 -m cli` invocation unchanged (the `cli` module ships as part of the PyPI distribution per `pyproject.toml`'s `py-modules` list) | Verified against the live PyPI package in an isolated venv (Section 2) |
| 2 | Any real TS/JS customer repo would have every import flagged `dependency-not-installed` on every PR, including a genuinely clean one | `ts_knowledge_base.py`'s `build_package_entry()` returns `"not-installed"` for any package absent from `node_modules/` (always gitignored in real repos); `ts_resolver.py` flags that status as a finding for every symbol imported from it. The template never ran an install step for the customer's own JS/TS dependencies. | Added conditional `Set up Node` (pinned Node 20) + `Install JS/TS dependencies` steps, gated on `hashFiles('package.json') != ''`, detecting `pnpm-lock.yaml`/`yarn.lock`/`package-lock.json` and running the matching install command (else `npm install`) | Reproduced with a real synthetic `axios` project: false positive without the install step, clean with it (Section 2) |

**A third finding, not a defect (documented, by-design behavior, but an operational trap):** `knowledge_base.py`'s requirements-parser only recognizes exact `name==version` pins; any other line shape (unpinned, range, extras-without-pin, etc.) is marked `"unsupported-requirement-line"` and silently produces zero findings for that dependency — indistinguishable in the JSON report from "checked and clean." This means **B5's Python seed will silently no-op if `autonomous-core/requirements.txt` doesn't pin the targeted dependency exactly** — not a code bug, but a real risk to the validity of the B5 result if unaddressed. Carried to Yehor as an explicit pre-flight check (Section 4), not fixed (nothing in the product's own documented contract is wrong here).

## 4. Known Limitations (stated honestly)

1. Neither fix has been exercised on live infrastructure yet — everything above is local/sandbox verification. This is expected and appropriate for this stage (per Session 4.2's own Methodology Note): B5 itself is the live-verification step, not something this session should attempt to substitute for.
2. Defect 2's fix (Node/JS install step) is a genuinely new addition to the template, not a restoration of previously-documented intent — flagged for Yehor's explicit review before being pushed, per the standing rule on closing architectural decisions.
3. The unpinned-requirements silent-skip behavior (Section 3, third finding) is a broader, unaddressed product-level risk: today a customer with any unpinned dependency gets no visible warning anywhere in the Check Run or JSON report that a dependency went unchecked. Out of scope for this session; worth a future session's attention.
4. `KS-REPORT-4.2-release-gate-fix.md` was found locally modified relative to its last commit at the start of this session (Sections 4–6 present in the working tree, absent from the last commit) — not caused by this session, likely a carry-over of the same mount/git reliability class of issue Session 4.2 itself documented as Defect #10. Flagged to Yehor; not resolved here since it's outside this session's actual scope (no commits were made this session at all).
5. This sandbox's known mount write-quirk (Edit/Write reporting success while silently not persisting content) recurred twice this session — once on `app/templates/fixprove-check.yml` itself, once on `session-logs/SESSION-LOG-INDEX.md`. Both were caught by independent post-write verification (hash comparison / grep against the actual mounted file, not trusting the tool's own success report) and corrected via the established write-to-scratch-then-`mv` workaround. Nothing incorrect was left in place.
6. All items carried forward from Session 4.2 (restore `npm --provenance` before D2, `ci.yml` not running Python tests, untracked `logo/`, PyPI Trusted Publisher root cause unconfirmed) remain open and untouched.

## 5. Accountability Statement

All diagnostic work and the two template fixes in this report were performed by Claude under the Keystone protocol. Nothing was pushed or installed on any live system this session. The template fix is presented for Yehor's review; Defect 2 in particular (the Node/JS install step addition) is explicitly flagged as an architectural decision awaiting his sign-off before commit, per standing operating rules.

**Signed:** _pending Yehor's review_

## 6. Methodology Note — One Suggested Improvement

This session's two real defects were both invisible to anyone reading the template's YAML in isolation — they only became visible by actually installing the real published package and running the real check against representative Python and TS/JS projects, including the specific "clean PR" case the runbook itself calls out as adversarial. This reinforces Session 4.2's own methodology note from the opposite direction: it's not only live *infrastructure* (registries, OIDC, permissions) that hides defects from local checks — a distributable artifact like this Action template can carry defects invisible to code review alone, surfaced only by literally running it against realistic input. Suggested improvement: before any future distributable template or CLI-facing artifact is handed off for its first live use, budget one session specifically for "run it for real against a synthetic clean project and a synthetic seeded-defect project, in both supported ecosystems" as a standing pre-flight step — cheaper to do in a sandbox than to discover mid-B5 on a real repo.

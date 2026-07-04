"""Tests for the TS/JS CLI extension (Session 1.4) and the TS corpus eval."""
import json
import subprocess
import sys
from pathlib import Path

ENGINE_DIR = Path(__file__).resolve().parent.parent
TS_CORPUS_DIR = ENGINE_DIR / "ts_corpus"

sys.path.insert(0, str(ENGINE_DIR))
from eval_ts_corpus import run_eval  # noqa: E402
import cli  # noqa: E402


def test_ts_corpus_eval_reports_perfect_precision_recall():
    result = run_eval()
    assert result["false_positives"] == 0
    assert result["false_negatives"] == 0
    assert result["precision"] == 1.0
    assert result["recall"] == 1.0
    assert result["f1"] == 1.0
    assert result["true_positives"] == 3


def test_discover_ts_files_excludes_noise_dirs(tmp_path):
    (tmp_path / "node_modules").mkdir()
    (tmp_path / "node_modules" / "ignored.ts").write_text("export const x = 1;")
    (tmp_path / "real.ts").write_text("export const y = 2;")
    files = cli.discover_ts_files(tmp_path)
    assert [f.name for f in files] == ["real.ts"]


def test_discover_ts_files_skips_declaration_files(tmp_path):
    (tmp_path / "types.d.ts").write_text("export interface X {}")
    (tmp_path / "real.ts").write_text("export const y = 2;")
    files = cli.discover_ts_files(tmp_path)
    assert [f.name for f in files] == ["real.ts"]


def test_cli_ts_only_project_exit_code_1():
    # KS-TRACE: S1.4-CORPUS-DEFECT-003 (see eval_ts_corpus.py) | the CLI
    # correctly derives its package list strictly from package.json's own
    # dependencies (matching real-world usage), so it does NOT see
    # "totally-fake-fixprove-corpus-pkg" (deliberately excluded from
    # package.json so `npm install` stays usable -- see ts_corpus/NOTES.md
    # and eval_ts_corpus.py's own KS-TRACE comment). The dedicated
    # eval_ts_corpus.py precision/recall eval (tested separately above)
    # injects that name at KB-build time to still exercise the
    # not-installed case; the CLI's real-world behavior here is 2
    # findings, not 3 -- this is correct, not a regression.
    result = subprocess.run(
        [sys.executable, str(ENGINE_DIR / "cli.py"), str(TS_CORPUS_DIR),
         "--package-json", str(TS_CORPUS_DIR / "package.json"), "--json"],
        capture_output=True, text=True,
    )
    assert result.returncode == 1
    report = json.loads(result.stdout)
    assert len(report["findings"]) == 2
    reasons = {f["reason"] for f in report["findings"]}
    assert reasons == {"unresolved-symbol"}


def test_cli_ts_only_project_clean_subset_exit_code_0(tmp_path):
    clean_dir = tmp_path / "clean_only"
    clean_dir.mkdir()
    (clean_dir / "app.ts").write_text('import axios from "axios";\naxios.get("/x");')
    (clean_dir / "package.json").write_text(json.dumps({"dependencies": {"axios": "*"}}))
    (clean_dir / "node_modules").symlink_to(TS_CORPUS_DIR / "node_modules")
    result = subprocess.run(
        [sys.executable, str(ENGINE_DIR / "cli.py"), str(clean_dir), "--json"],
        capture_output=True, text=True,
    )
    assert result.returncode == 0
    report = json.loads(result.stdout)
    assert report["findings"] == []


def test_cli_python_only_project_unaffected_by_ts_changes(tmp_path):
    # KS-TRACE regression test: a pure-Python project with no package.json
    # must NOT error out just because ts discovery ran (graceful
    # ecosystem-absence requirement)
    proj = tmp_path / "py_only"
    proj.mkdir()
    (proj / "app.py").write_text("import os\nos.path.join('a', 'b')\n")
    (proj / "requirements.txt").write_text("")
    result = subprocess.run(
        [sys.executable, str(ENGINE_DIR / "cli.py"), str(proj), "--json"],
        capture_output=True, text=True,
    )
    assert result.returncode == 0


def test_cli_mixed_python_and_ts_project(tmp_path):
    proj = tmp_path / "mixed"
    proj.mkdir()
    (proj / "app.py").write_text("import fastapi_helpers_fake\nfastapi_helpers_fake.run()\n")
    (proj / "requirements.txt").write_text("fastapi_helpers_fake==1.0.0\n")
    (proj / "app.ts").write_text('import axios from "axios";\naxios.getData("/x");')
    (proj / "package.json").write_text(json.dumps({"dependencies": {"axios": "*"}}))
    (proj / "node_modules").symlink_to(TS_CORPUS_DIR / "node_modules")
    result = subprocess.run(
        [sys.executable, str(ENGINE_DIR / "cli.py"), str(proj), "--json"],
        capture_output=True, text=True,
    )
    assert result.returncode == 1
    report = json.loads(result.stdout)
    assert report["files_checked"] == 2
    reasons = {f["reason"] for f in report["findings"]}
    assert "dependency-not-installed" in reasons  # from the .py file
    assert "unresolved-symbol" in reasons          # from the .ts file

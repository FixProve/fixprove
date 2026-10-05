"""
FixProve -- Session 4.32 -- D9 + empty-target exit-code truthfulness.

KS-TRACE: D9 + EMPTY-TARGET | requirement: exit 2 if and only if zero files
were actually checked (empty target, or every detected ecosystem skipped
for a missing manifest); any run that checked at least one file keeps 0/1
| test: this file
"""

import itertools
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main  # noqa: E402


def _write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def test_cli_pure_python_no_requirements_exits_2(tmp_path, capsys):
    _write(tmp_path / "app.py", "import os\n")
    rc = main([str(tmp_path), "--json"])
    cap = capsys.readouterr()
    assert rc == 2
    assert "requirements.txt" in cap.err
    assert "nothing was checked" in cap.err
    assert json.loads(cap.out)["files_checked"] == 0  # body still parseable


def test_cli_pure_ts_no_package_json_exits_2(tmp_path, capsys):
    _write(tmp_path / "script.ts", "import axios from 'axios';\n")
    rc = main([str(tmp_path)])
    cap = capsys.readouterr()
    assert rc == 2
    assert "package.json" in cap.err
    assert "nothing was checked" in cap.err


def test_cli_empty_dir_exits_2_with_plain_message(tmp_path, capsys):
    # Adversarial: no source files at all, nothing skipped (Yehor, 2026-10-05).
    _write(tmp_path / "README.md", "# docs only\n")
    rc = main([str(tmp_path), "--json"])
    cap = capsys.readouterr()
    assert rc == 2
    assert "no Python or TS/JS source files found under" in cap.err
    assert str(tmp_path) in cap.err
    assert json.loads(cap.out)["files_checked"] == 0


def test_cli_single_non_source_file_exits_2(tmp_path, capsys):
    f = tmp_path / "notes.txt"
    _write(f, "hello\n")
    assert main([str(f)]) == 2


def test_cli_missing_path_still_exits_2():
    assert main(["/definitely/does/not/exist"]) == 2


# Property-style check over every combination of the four inputs:
# {py present, requirements present, ts present, package.json present}.
# Invariant: rc == 2  <=>  files_checked == 0. Fixtures use only stdlib /
# no npm deps so the knowledge base builds offline.
@pytest.mark.parametrize("py,req,ts,pkg", list(itertools.product([0, 1], repeat=4)))
def test_cli_exit_2_iff_nothing_checked(tmp_path, capsys, py, req, ts, pkg):
    if py:
        _write(tmp_path / "app.py", "import os\nos.path.join('a', 'b')\n")
    if req:
        _write(tmp_path / "requirements.txt", "\n")
    if ts:
        _write(tmp_path / "util.ts", "export const x: number = 1;\n")
    if pkg:
        _write(tmp_path / "package.json", json.dumps({"name": "t", "dependencies": {}}))
    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache"), "--json"])
    report = json.loads(capsys.readouterr().out)
    expected_checked = (1 if (py and req) else 0) + (1 if (ts and pkg) else 0)
    assert report["files_checked"] == expected_checked
    assert (rc == 2) == (expected_checked == 0)
    if expected_checked:
        assert rc in (0, 1)

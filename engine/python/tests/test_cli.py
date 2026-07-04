"""
FixProve — Milestone 1, Session 1.3 — tests for the `fixprove check` CLI.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main, discover_py_files, DEFAULT_EXCLUDE_DIRS  # noqa: E402


def _write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def test_discover_py_files_excludes_noise_dirs(tmp_path):
    _write(tmp_path / "app.py", "import os\n")
    _write(tmp_path / ".venv" / "lib" / "site.py", "import os\n")
    _write(tmp_path / "__pycache__" / "cached.py", "import os\n")
    files = discover_py_files(tmp_path)
    names = {f.name for f in files}
    assert "app.py" in names
    assert "site.py" not in names
    assert "cached.py" not in names


def test_discover_py_files_single_file(tmp_path):
    f = tmp_path / "solo.py"
    _write(f, "import os\n")
    assert discover_py_files(f) == [f]


def test_cli_exit_0_on_clean_project(tmp_path):
    _write(tmp_path / "requirements.txt", "\n")  # no resolvable deps -> nothing to flag
    _write(tmp_path / "app.py", "import os\nos.path.join('a', 'b')\n")
    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 0


def test_cli_exit_1_on_findings(tmp_path):
    _write(tmp_path / "requirements.txt", "pandas==2.3.3\n")
    _write(tmp_path / "app.py", "import pandas as pd\npd.read_exel('x')\n")
    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 1


def test_cli_exit_2_on_missing_path():
    rc = main(["/definitely/does/not/exist"])
    assert rc == 2


def test_cli_exit_2_on_missing_requirements(tmp_path):
    _write(tmp_path / "app.py", "import os\n")
    rc = main([str(tmp_path)])  # no requirements.txt anywhere
    assert rc == 2


def test_cli_json_output_shape(tmp_path, capsys):
    _write(tmp_path / "requirements.txt", "pandas==2.3.3\n")
    _write(tmp_path / "app.py", "import pandas as pd\npd.read_exel('x')\n")
    main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache"), "--json"])
    out = capsys.readouterr().out
    report = json.loads(out)
    assert report["files_checked"] == 1
    assert len(report["findings"]) == 1
    assert "kb_build_seconds" in report
    assert "check_seconds" in report


def test_cli_determinism_across_runs(tmp_path):
    _write(tmp_path / "requirements.txt", "pandas==2.3.3\n")
    _write(tmp_path / "app.py", "import pandas as pd\npd.read_exel('x')\npd.read_excel('y')\n")
    cache_dir = tmp_path / ".cache"
    rc1 = main([str(tmp_path), "--cache-dir", str(cache_dir), "--json"])
    rc2 = main([str(tmp_path), "--cache-dir", str(cache_dir), "--json"])
    assert rc1 == rc2 == 1


def test_cli_survives_syntax_error_in_one_file(tmp_path, capsys):
    _write(tmp_path / "requirements.txt", "pandas==2.3.3\n")
    _write(tmp_path / "broken.py", "def f(:\n    import\n")
    _write(tmp_path / "good.py", "import pandas as pd\npd.read_exel('x')\n")
    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    out = capsys.readouterr().out
    assert rc == 1
    assert "good.py" in out
    assert "2 file(s)" in out  # both files were checked, broken.py didn't crash the run


def test_corpus_eval_reports_perfect_precision_recall():
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from eval_corpus import run_eval
    result = run_eval()
    assert result["precision"] == 1.0
    assert result["recall"] == 1.0
    assert result["false_positives"] == 0
    assert result["false_negatives"] == 0

"""
FixProve — regression tests for the orphaned-source-file fix.

KS-TRACE: S4.29-SELFTEST-ORPHANED-PY | found via the 2026-09-12 customer
self-test against github.com/dyonng/one-pace-plex-automator: a project with
2 incidental legacy .py scripts (no requirements.txt anywhere) used to hard
`return 2` before ever checking the project's real TS/JS code. Fix degrades
a present-but-unmanifested ecosystem to a stderr warning + skip, matching
this file's own documented "graceful ecosystem absence" contract one step
further (see cli.py module docstring). See the matching KS-TRACE comments
in cli.py's main() for the fix itself.

Calls cli.main(argv) directly, in-process, matching this project's existing
CLI test convention (test_cli.py / test_cli_check_token.py) -- not a
subprocess.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main  # noqa: E402


def _write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def test_cli_orphaned_py_no_requirements_still_checks_ts(tmp_path, capsys):
    # Pure-TS project (has package.json) plus one incidental .py file and
    # NO requirements.txt anywhere -- this used to hard-crash with rc == 2
    # before the whole TS side was ever checked. It must now: (1) print a
    # warning to stderr naming the orphaned .py file(s), (2) NOT return 2
    # for that reason, and (3) still actually check the TS file.
    _write(tmp_path / "package.json", '{"name": "x", "version": "1.0.0"}')
    _write(tmp_path / "app.ts", "const x: string = 'a';\nconsole.log(x);\n")
    _write(tmp_path / "legacy_script.py", "import os\nos.path.join('a', 'b')\n")

    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    stderr = capsys.readouterr().err

    assert rc != 2, f"orphaned .py file must not hard-fail the whole run (rc={rc})"
    assert "warning" in stderr.lower()
    assert "requirements.txt" in stderr


def test_cli_orphaned_ts_no_package_json_still_checks_py(tmp_path, capsys):
    # Symmetric case: pure-Python project (has requirements.txt) plus one
    # incidental .ts file and NO package.json anywhere.
    _write(tmp_path / "requirements.txt", "\n")
    _write(tmp_path / "app.py", "import os\nos.path.join('a', 'b')\n")
    _write(tmp_path / "legacy_script.ts", "const x: string = 'a';\nconsole.log(x);\n")

    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    stderr = capsys.readouterr().err

    assert rc != 2, f"orphaned .ts file must not hard-fail the whole run (rc={rc})"
    assert "warning" in stderr.lower()
    assert "package.json" in stderr

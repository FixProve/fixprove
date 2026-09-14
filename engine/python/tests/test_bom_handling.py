"""
FixProve — regression tests for UTF-8 BOM handling in package.json and
requirements.txt.

KS-TRACE: SESSION-4.30-BOM-FIX | found 2026-09-14 during v0.1.16's own
fresh-install verification: a package.json written by PowerShell's
`Out-File -Encoding utf8` (which embeds a UTF-8 BOM -- the exact gotcha
already on record in this project's commit-message hygiene notes)
crashed cli.py with an unhandled `JSONDecodeError("Unexpected UTF-8
BOM...")`, exit code 1, instead of a clean result. Reproduced directly
against the shipped 0.1.16 code before any fix was written (not
inferred). While root-causing it, the same exposure was checked for and
found in knowledge_base.py's requirements.txt reader: a BOM there does
not raise -- it silently degrades the FIRST pinned dependency to
"unsupported-requirement-line" (the BOM breaks _REQ_LINE_RE's match on
that line only), so that dependency's real check is silently skipped
with no error at all. Same root cause, two different failure shapes
(one loud, one silent) -- both fixed by reading with `encoding=
"utf-8-sig"` instead of `"utf-8"` at both call sites (cli.py's
package.json read, knowledge_base.py's requirements.txt read).
`utf-8-sig` strips a leading BOM if present and is otherwise identical
to `utf-8` for a normal file, so no behavior changes for the common
no-BOM case (covered below alongside each BOM case).

| test: this file.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main  # noqa: E402
from knowledge_base import parse_requirements  # noqa: E402

UTF8_BOM = b"\xef\xbb\xbf"


def _write_bytes(path: Path, content: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)


def test_cli_check_package_json_with_bom_is_parsed(tmp_path, capsys):
    # The exact repro from the 2026-09-14 fresh-install verification: a
    # package.json written with a UTF-8 BOM must not crash the CLI.
    _write_bytes(
        tmp_path / "package.json",
        UTF8_BOM + b'{"name": "t", "version": "1.0.0"}',
    )
    (tmp_path / "index.ts").write_text("console.log('ok');\n")

    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    err = capsys.readouterr().err

    assert rc == 0, f"a BOM'd package.json must not crash the run (rc={rc}, stderr={err!r})"
    assert "JSONDecodeError" not in err
    assert "Traceback" not in err


def test_cli_check_package_json_without_bom_still_works(tmp_path):
    # Same file, no BOM -- utf-8-sig must behave identically to utf-8 here.
    (tmp_path / "package.json").write_text('{"name": "t", "version": "1.0.0"}')
    (tmp_path / "index.ts").write_text("console.log('ok');\n")

    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 0


def test_parse_requirements_with_bom_reads_first_line():
    # Without the fix, the BOM lands as a literal ﻿ prefix on the
    # first line and that line alone silently fails to parse -- a real
    # pinned dependency's check would be skipped with no error at all.
    text = (UTF8_BOM + b"requests==2.31.0\nflask==3.0.0\n").decode("utf-8-sig")
    entries = parse_requirements(text)

    assert entries[0]["line_ok"] is True, (
        "the first requirements.txt line must parse correctly even when "
        f"the file carried a UTF-8 BOM (got {entries[0]!r})"
    )
    assert entries[0]["name"] == "requests"
    assert entries[0]["version"] == "2.31.0"
    assert entries[1]["line_ok"] is True
    assert entries[1]["name"] == "flask"


def test_parse_requirements_without_bom_unchanged():
    text = "requests==2.31.0\nflask==3.0.0\n"
    entries = parse_requirements(text)
    assert entries[0]["line_ok"] is True
    assert entries[0]["name"] == "requests"

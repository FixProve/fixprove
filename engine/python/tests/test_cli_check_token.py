"""
FixProve — regression tests for the pip CLI's optional leading "check" token.

KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX | decision: Yehor,
2026-09-11, option (b) -- `fixprove check <path>` (the npm wrapper's only
form, and the exact form fixprove.dev's own install block shows after BOTH
the pip and npm install lines) must also work on the pip install. See the
matching KS-TRACE in cli.py's main() for the full decision record.

Calls cli.main(argv) directly, in-process, matching this project's existing
CLI test convention (test_cli.py) -- not a subprocess -- so these run in the
same test session as every other CLI test, with no dependency on a real
`pip install fixprove` being present.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main  # noqa: E402


def _write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def test_bare_path_form_still_works_unchanged(tmp_path):
    _write(tmp_path / "requirements.txt", "\n")
    _write(tmp_path / "app.py", "import os\nos.path.join('a', 'b')\n")
    rc = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 0


def test_check_token_form_produces_identical_result(tmp_path, capsys):
    # Deliberately does NOT pin a package version whose knowledge base has
    # to be built (that needs a real, network-reachable pip environment --
    # already exercised by test_cli.py's own test_cli_exit_1_on_findings,
    # not this test's job to re-verify). This test isolates ONE thing: that
    # the "check" token strip changes nothing about the result for a given
    # path, whatever that result is -- so it compares the two forms against
    # EACH OTHER, never against a hardcoded expectation.
    _write(tmp_path / "requirements.txt", "\n")
    _write(tmp_path / "app.py", "import os\nos.path.join('a', 'b')\n")

    rc_bare = main([str(tmp_path), "--cache-dir", str(tmp_path / ".cache_a"), "--json"])
    out_bare = capsys.readouterr().out
    rc_check = main(["check", str(tmp_path), "--cache-dir", str(tmp_path / ".cache_b"), "--json"])
    out_check = capsys.readouterr().out

    assert rc_bare == rc_check
    # Cache dirs differ (so neither run's KB cache affects the other's
    # timing), so compare everything EXCEPT the two timing fields.
    import json as _json
    report_bare, report_check = _json.loads(out_bare), _json.loads(out_check)
    for key in ("files_checked", "findings"):
        assert report_bare[key] == report_check[key]


def test_check_token_form_and_bare_form_agree_on_missing_path():
    rc_bare = main(["/definitely/does/not/exist"])
    rc_check = main(["check", "/definitely/does/not/exist"])
    assert rc_bare == rc_check == 2


def test_a_directory_literally_named_check_is_still_scanned(tmp_path):
    # NOTE: this deliberately passes the FULL path (e.g. "/tmp/.../check"),
    # which never equals the bare string "check" -- so this test does NOT
    # exercise the token-stripping branch at all, and never could. What it
    # actually confirms: str(a_path_ending_in_check) is never mistaken for
    # the literal token "check" by the `argv[0] == "check"` check (a plain
    # equality, not a suffix/basename match), so an explicitly-given path
    # is always safe regardless of its name. The GENUINE ambiguous case --
    # a bare `fixprove check` with no path, invoked from inside a directory
    # that itself contains a subdirectory literally named "check" -- is
    # covered by test_check_token_alone_defaults_to_current_directory below.
    check_dir = tmp_path / "check"
    _write(check_dir / "requirements.txt", "\n")
    _write(check_dir / "a.py", "import os\n")
    rc = main([str(check_dir), "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 0  # 0/1 means it was scanned; 2 would mean the path was misread


def test_check_token_only_strips_when_it_is_the_first_token():
    # A file or directory that merely CONTAINS "check" elsewhere in its
    # path must not be affected -- only argv[0] == "check" is special.
    rc = main(["/definitely/does/not/exist/check-something"])
    assert rc == 2


def test_check_token_alone_defaults_to_current_directory(tmp_path, monkeypatch):
    # KS-TRACE: PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX-PARITY-GAP | the
    # gap the check-token fix alone did NOT close: `fixprove check` with no
    # path at all used to raise an uncaught argparse SystemExit(2) here
    # (confirmed directly, not assumed, before this fix), while the npm
    # side's `.argument("[path]", "path to scan", ".")` makes the same bare
    # `fixprove check` succeed by defaulting to ".". This test pins that
    # `main(["check"])` alone now succeeds and scans the current directory,
    # matching npm exactly.
    monkeypatch.chdir(tmp_path)
    _write(tmp_path / "requirements.txt", "\n")
    _write(tmp_path / "app.py", "import os\n")
    rc = main(["check", "--cache-dir", str(tmp_path / ".cache")])
    assert rc == 0  # scanned "." successfully with no path argument at all

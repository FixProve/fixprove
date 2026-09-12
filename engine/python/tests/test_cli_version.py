import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cli import main  # noqa: E402
from importlib.metadata import version as pkg_version


def test_version_flag_matches_installed_metadata(capsys):
    with pytest.raises(SystemExit) as exc_info:
        main(["--version"])
    assert exc_info.value.code == 0
    printed = capsys.readouterr().out.strip()
    assert printed != ""
    assert printed == pkg_version("fixprove")
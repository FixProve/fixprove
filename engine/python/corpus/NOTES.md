# Python Corpus Setup

Before running `eval_corpus.py` or `tests/test_cli.py::test_corpus_eval_reports_perfect_precision_recall`,
install the REAL fixture dependencies this corpus is verified against:

```
cd engine/python
pip install pandas==2.3.3 requests==2.34.2
pip install ./corpus/local_fixtures/fp-monkeypatch-demo
```

Do **not** install `fastapi-helpers-fake` -- it is deliberately left
uninstalled on purpose. It exists only so `corpus/hallucinated/uninstalled_dependency.py`
has a real "dependency-not-installed" case to catch (see `corpus/manifest.json`).

## Why a local fixture package for `fp-monkeypatch-demo`

`fp-monkeypatch-demo` is not a real PyPI package -- it is a tiny, local,
pip-installable package (`local_fixtures/fp-monkeypatch-demo/`) that hard-exits
at import time (`os._exit(1)`), mirroring Session 1.2's own adversarial
subprocess-isolation fixture. It exists to exercise the locked Stage-1
decision that a package whose introspection degrades/crashes must NEVER be
flagged, end-to-end through the real CLI/KB pipeline (see
`corpus/clean/degraded_package_usage.py`) -- not just in KB-builder unit
tests. It is never published to PyPI.

## Root cause this fixes (Session 4.2)

The `v0.1.0` release pipeline (2026-07-04) failed at the test gate with the
corpus eval reporting precision 0.143 (expected 1.0). Root cause: these
fixture dependencies were never installed by any CI workflow -- they only
ever existed in whatever ad hoc local environment validated Sessions 1.1-1.4.
On a genuinely clean runner, `pandas`/`requests`/`fp-monkeypatch-demo` all
report "not-installed", which is a **flaggable** KB status -- turning every
"clean" corpus file that references them into a false positive. This is a
missing CI setup step, not a resolver/KB logic bug. Fixed by installing these
explicitly in `.github/workflows/release.yml` before running `pytest`.

## FixProve v0.1.17

**Requires Python 3.10+** (the engine's parser dependencies publish no
Python 3.9 wheels; installs on 3.9 are now refused instead of failing later).

### Fixed
- A `package.json` saved with a UTF-8 BOM (common on Windows) no longer
  crashes the TypeScript check (`d55c20a`).
- Members declared inside `declare namespace` blocks — e.g. React's
  `CSSProperties` — are no longer falsely flagged (`aaafaeb`).

### Changed
- **Exit code 2 when nothing was checked.** An empty or mistyped path, or a
  project where every detected ecosystem was skipped for a missing manifest,
  now exits `2` with a plain error instead of `0`. A run that checks at least
  one file still exits `0`/`1` as before (mixed projects unaffected).
  `--json` output is still printed first.

### Documented
- Known limitation: `from pkg.sub.module import Name` can be false-flagged
  when `Name` is not re-exported at the top level of `pkg` (e.g.
  `cryptography`, `opentelemetry`, `typer.testing`, `fastapi.testclient`).
  A fix is planned separately.
- Module-augmentation limitation wording clarified.
- Known in this release: when nothing was checked, the text output still
  ends with "No unresolved symbols found." above the error line — the exit
  code (2) and the stderr error are correct; the wording will be fixed in
  the next release.

Install: `pip install fixprove` (optionally `npm install -g fixprove`). Do
not use `pipx`.

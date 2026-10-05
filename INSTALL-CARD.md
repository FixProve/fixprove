# FixProve — install card (v0.1.17)

**Requires Python 3.10 or newer.** The engine is Python; the npm package is
only a thin wrapper around it.

## Install

Inside the same Python environment your project uses (so FixProve can see
your real installed dependencies):

```bash
pip install fixprove
```

Optional, for the `npm i -g` experience (still needs the pip install above):

```bash
npm install -g fixprove
```

Do not use `pipx` — it isolates FixProve from your project's installed
packages, so it cannot check them.

## Run

```bash
fixprove check /path/to/your/project
```

Python projects need a `requirements.txt` (or `--requirements <file>`);
TypeScript/JavaScript projects need a `package.json` with `node_modules`
installed (or `--package-json <file>`). Add `--json` for machine-readable
output.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Checked, nothing unresolved |
| 1 | Unresolved symbol(s) found — see the listed `file:line` |
| 2 | Setup/usage error, or **nothing was checked** (no Python/TS/JS files under the path, or every ecosystem skipped for a missing manifest) |
| 127 | (npm wrapper) no Python interpreter found |

## Check your install

```bash
fixprove --version     # → 0.1.17
```

No network calls, no telemetry: your code is analysed on your own machine or
CI runner. Docs and known limitations: https://github.com/FixProve/fixprove

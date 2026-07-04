# fixprove (CLI, open-core)

FixProve proves your AI-generated code before it merges — deterministically
verifying that every import, symbol, method, and API call resolves against
your real installed dependencies, in CI, with zero LLM tokens.

```bash
npm install -g fixprove
fixprove check /path/to/your/project
```

This npm package is a thin wrapper: the actual deterministic resolver
engine is Python, published separately to PyPI (`pip install fixprove`).
This wrapper invokes it as a subprocess and forwards its output/exit code
unchanged — install both if you want the `npm i -g fixprove` experience:

```bash
pip install fixprove
npm install -g fixprove
fixprove check .
```

If the Python engine isn't installed, `fixprove check` prints an
actionable `pip install fixprove` message and exits non-zero — it never
hangs or silently reports a clean pass.

## Options

Mirrors the underlying Python engine's own flags:

```
fixprove check [path] [--requirements <file>] [--cache-dir <dir>]
                       [--timeout <seconds>] [--package-json <file>] [--json]
```

Exit codes: `0` clean, `1` unresolved symbol(s) found, `2` usage/setup
error (including "Python engine not installed"), `127` no Python
interpreter found at all.

## Want this on every pull request, without installing anything?

The [FixProve GitHub App](https://fixprove.dev/app) runs this exact check
as a blocking status on your PRs — your source code never leaves your own
CI runner (see the GitHub Actions workflow template it publishes). This
CLI is the same deterministic core, for local/self-hosted use.

## License
MIT — see [LICENSE](./LICENSE). This package is the open-core component of
FixProve; `/app` and `/web` in this monorepo are proprietary (see root
NOTICE.md).

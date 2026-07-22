# FixProve

[![npm version](https://img.shields.io/npm/v/fixprove.svg)](https://www.npmjs.com/package/fixprove)
[![PyPI version](https://img.shields.io/pypi/v/fixprove.svg)](https://pypi.org/project/fixprove/)
[![CI](https://github.com/FixProve/fixprove/actions/workflows/ci.yml/badge.svg)](https://github.com/FixProve/fixprove/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./cli/LICENSE)
[![Provenance: npm attested](https://img.shields.io/badge/provenance-npm%20attested-brightgreen.svg)](https://www.npmjs.com/package/fixprove)

FixProve proves your AI-generated code before it merges — deterministically
verifying that every import, symbol, method, and API call resolves against
your real installed dependencies, in CI, with zero LLM tokens and near-zero
false positives.

## Install

```bash
pip install fixprove
npm install -g fixprove
fixprove check /path/to/your/project
```

The npm package is a thin wrapper around the Python resolver engine (the
actual deterministic logic lives there); install both for the full
`npm i -g fixprove` experience. If the Python engine isn't installed,
`fixprove check` prints an actionable `pip install fixprove` message and
exits non-zero — it never hangs or silently reports a clean pass. See
[cli/README.md](./cli/README.md) for the full flag reference and exit codes.

## Monorepo layout

```
/cli   open-core CLI (MIT) — fixprove check <path>
/app   GitHub App — blocking PR check via the resolver engine (proprietary)
/web   landing page — static export for Cloudflare Pages (proprietary)
```

See [NOTICE.md](./NOTICE.md) for the per-package licensing breakdown,
[CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines, and
[SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Status

The CLI (`/cli` + the Python resolver engine) is published and live on npm
and PyPI. The GitHub App (`/app`) runs the same deterministic check as a
blocking status on pull requests.

## Build

```
pnpm install
pnpm build
```

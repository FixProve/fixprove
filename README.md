# FixProve

[![npm version](https://img.shields.io/npm/v/fixprove.svg)](https://www.npmjs.com/package/fixprove)
[![PyPI version](https://img.shields.io/pypi/v/fixprove.svg)](https://pypi.org/project/fixprove/)
[![CI](https://github.com/FixProve/fixprove/actions/workflows/ci.yml/badge.svg)](https://github.com/FixProve/fixprove/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./cli/LICENSE)
[![Provenance: npm attested](https://img.shields.io/badge/provenance-npm%20attested-brightgreen.svg)](https://www.npmjs.com/package/fixprove)

FixProve proves your AI-generated code before it merges — deterministically
verifying that every import, symbol, method, and API call resolves against
your real installed dependencies, in CI, with zero LLM tokens. Conservative
by design: when it can't resolve a reference with certainty, it skips rather
than guesses — so it doesn't cry wolf.

> The CLI and engine (`/cli`, `/engine`) are MIT-licensed; the GitHub App and
> web app (`/app`, `/web`) are proprietary — see [NOTICE.md](./NOTICE.md) for
> the full per-package breakdown.

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

## Privacy

<!--
KS-TRACE: LEGAL-4.12K-README-TELEMETRY-SYNC | requirement: PRIVACY-POLICY-DRAFT-v2.md
§2.3 makes a "no network calls" representation about the CLI/engine; this
README previously only said "zero LLM tokens" (no model inference), a
narrower and different claim -- both audits and the original v1 draft's
Verification Appendix flagged the mismatch. Wording below is intentionally
identical to the Privacy Policy so the two documents cannot silently drift.
Time-bound ("as of this version") rather than an unqualified forever-promise.
-->

As of the current version, the FixProve CLI and analysis engine make no
network calls and collect no telemetry — your code is analysed entirely on
your own machine or CI runner. If a future version adds any network
capability (including opt-in telemetry), this section and the project's
Privacy Policy will be updated together, and any opt-in will require your
explicit consent.

## Build

```
pnpm install
pnpm build
```

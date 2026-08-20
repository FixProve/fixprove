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

## Privacy

<!--
KS-TRACE: LEGAL-4.12K-README-TELEMETRY-SYNC | requirement: PRIVACY-POLICY-DRAFT-v2.md
Mirrors the root README's "## Privacy" section verbatim (same wording,
same time-bound framing) so the two documents cannot drift. Root README
carries the full rationale in its own KS-TRACE comment. Promoted from an
inline link buried under the GitHub App section to its own heading here
because this is the npm-rendered README and this is the question people
look to answer before running an unfamiliar tool over their code
(external feedback, Lars Gyrup Brink Nielsen / AarhusJS, 2026-08-19).
-->

As of the current version, the FixProve CLI and analysis engine make no
network calls and collect no telemetry — your code is analysed entirely on
your own machine or CI runner. If a future version adds any network
capability (including opt-in telemetry), this section and the project's
[Privacy Policy](https://fixprove.dev/privacy) will be updated together,
and any opt-in will require your explicit consent.

This applies to the CLI only. The [FixProve GitHub App](https://fixprove.dev/app)
is a separate, opt-in product with its own, narrower data flow — see "Want
this on every pull request" below.

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
as a blocking status on your PRs. Analysis runs in *your* CI (see the
GitHub Actions workflow template it publishes) — only specific finding
fragments (file paths, line numbers, the unresolved expression) transit
our endpoint, encrypted and never persisted, to post the check annotation;
see the [Privacy Policy](https://fixprove.dev/privacy) for the full
description. This CLI is the same deterministic core, for local/self-hosted
use.

## License
MIT — see [LICENSE](./LICENSE). This package is the open-core component of
FixProve; `/app` and `/web` in this monorepo are proprietary (see root
NOTICE.md).

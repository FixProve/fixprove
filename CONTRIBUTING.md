# Contributing to FixProve

Thanks for your interest in FixProve. Right now the project has one primary
maintainer (Yehor Kaliberda). The open-core `/cli` package (plus the Python
resolver engine it wraps) is published and live on npm and PyPI. This
document will expand as outside contributions start coming in.

## Scope of contributions

- **`/cli`** is open-core (MIT) and is the intended surface for community
  contributions.
- **`/app`** and **`/web`** are proprietary and not open to outside PRs.

## Before you open a PR

1. Open an issue describing the bug or proposal first for anything
   non-trivial.
2. Include a test for any behavior change. The project's core promise is
   **determinism** — any change to resolver behavior must include a
   before/after example and pass the determinism check (100 identical runs →
   identical output).
3. Keep PRs scoped to a single change.

## Code of conduct

Be direct, be technical, assume good faith. Disagreements should be resolved
with evidence (a failing test, a benchmark, a reproduction) rather than
opinion.

## Security issues

Do **not** open a public issue for a security vulnerability. See
[SECURITY.md](./SECURITY.md).

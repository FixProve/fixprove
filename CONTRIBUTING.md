# Contributing to FixProve

Thanks for your interest in FixProve. Right now the project has one primary
maintainer (Yehor Kaliberda) and is in early build (Milestone 0/1 of the
master build plan). This document will expand as the open-core `/cli`
package stabilizes and accepts outside contributions (targeted at
Session 3.1, public npm/PyPI launch).

## Scope of contributions

- **`/cli`** is open-core (MIT) and is the intended surface for community
  contributions once published.
- **`/app`** and **`/web`** are proprietary and not open to outside PRs.

## Before you open a PR (once public)

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

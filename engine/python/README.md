# fixprove (Python engine, open-core)

FixProve deterministically verifies that every import, symbol, method, and
API call in your code — Python or TypeScript/JavaScript — resolves against
your *real, installed* dependencies. No LLM calls, no false-positive-prone
heuristics: an AST-level resolver checks a reference set against a
knowledge base built from what's actually on disk.

Requires Python 3.10+ (the engine is Python; the npm package is a wrapper around it).

```bash
pip install fixprove
fixprove /path/to/your/project
```

`fixprove check /path/to/your/project` (the same form the npm wrapper and
fixprove.dev's own install instructions use) also works here — both forms
are identical, so pip-only users don't need to know the npm package exists
to follow the site's install block. See KS-TRACE
`PRIORITY-TRACKER-2026-09-11-P0-CLI-SYNTAX` in `cli.py` for why.

Exit codes: `0` clean, `1` unresolved symbol(s) found, `2` usage/setup
error — including "nothing was checked" (no Python or TS/JS source files
under the path, or every detected ecosystem was skipped for a missing
manifest), so an empty or mistyped path can never pass as clean. Designed
to drop straight into a CI gate.

This is the same engine that powers the [FixProve GitHub App](https://fixprove.dev/app),
which posts this check as a blocking status directly on your pull requests.
Analysis runs in *your* CI — the App does not read or store your repository's
source code. Only specific finding fragments (file paths, line numbers, and
the unresolved expression) transit our endpoint, encrypted and never
persisted, to post the check annotation; see the
[Privacy Policy](https://fixprove.dev/privacy) for the full description.
This CLI is the open-core, self-hosted way to run the identical
deterministic core locally or in your own pipeline.

## Scope (current)

- Python: imports, call targets, attribute chains, checked against
  installed packages' real public API.
- TypeScript/JavaScript: imports/re-exports/call targets/attribute chains,
  checked against installed npm packages' `.d.ts` declarations.
- Known limitation: symbols added by TypeScript module augmentation
  (`declare module "x" { ... }` blocks that extend another package, e.g.
  `@types/lodash`) are safely skipped (never flagged, but also not fully
  checked) rather than guessed at. This is separate from members declared
  inside a `declare namespace` block (e.g. React's `CSSProperties`), which
  are resolved normally as of 0.1.17 — see the engine's own Keystone Reports
  (`KS-REPORT-1.4-ts-resolver.md` in the source repository) for the full
  accuracy/limitation writeup.
- Known limitation: a package that re-exports symbols from a separate npm
  package under a renamed name (e.g. `vitest` re-exporting `describe`/`it`
  from `@vitest/runner`, or `export { globalExpect as expect }`) can be
  false-flagged as unresolved — the resolver does not yet follow
  cross-package re-export chains or `as`-renames. Found via the
  2026-09-12 customer self-test against
  github.com/dyonng/one-pace-plex-automator (58 false positives, root
  cause confirmed by reading vitest's own `.d.ts`).
- Known limitation (Python): `from pkg.sub.module import Name` can be
  false-flagged as unresolved when `Name` is defined in a submodule but is
  not also re-exported at the top level of `pkg` (seen with
  `cryptography`, `opentelemetry`, `typer.testing`,
  `fastapi.testclient`). The resolver currently checks the name against
  the top-level package rather than the submodule the import names. Found
  via independent field verification, 2026-09-14; a real fix is planned
  as its own change, not in 0.1.17.

## License

MIT — see [LICENSE](./LICENSE). This package is the open-core component of
FixProve; the GitHub App and web dashboard are proprietary (see the source
repository's root `NOTICE.md`).

# fixprove (Python engine, open-core)

FixProve deterministically verifies that every import, symbol, method, and
API call in your code — Python or TypeScript/JavaScript — resolves against
your *real, installed* dependencies. No LLM calls, no false-positive-prone
heuristics: an AST-level resolver checks a reference set against a
knowledge base built from what's actually on disk.

```bash
pip install fixprove
fixprove /path/to/your/project
```

Exit codes: `0` clean, `1` unresolved symbol(s) found, `2` usage/setup
error — designed to drop straight into a CI gate.

This is the same engine that powers the [FixProve GitHub App](https://fixprove.dev/app),
which posts this check as a blocking status directly on your pull requests
— without your source code ever leaving your own CI runner. This CLI is
the open-core, self-hosted way to run the identical deterministic core
locally or in your own pipeline.

## Scope (current)

- Python: imports, call targets, attribute chains, checked against
  installed packages' real public API.
- TypeScript/JavaScript: imports/re-exports/call targets/attribute chains,
  checked against installed npm packages' `.d.ts` declarations.
- Known limitation: packages using TypeScript module augmentation (e.g.
  `@types/lodash`) are safely skipped (never flagged, but also not fully
  checked) rather than guessed at — see the engine's own Keystone Reports
  (`KS-REPORT-1.4-ts-resolver.md` in the source repository) for the full
  accuracy/limitation writeup.

## License

MIT — see [LICENSE](./LICENSE). This package is the open-core component of
FixProve; the GitHub App and web dashboard are proprietary (see the source
repository's root `NOTICE.md`).

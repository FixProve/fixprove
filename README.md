# FixProve

FixProve proves your AI-generated code before it merges — deterministically
verifying that every import, symbol, method, and API call resolves against
your real installed dependencies, in CI, with zero LLM tokens and near-zero
false positives.

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

Session 0.2 (scaffold) of the FixProve master build plan. The deterministic
resolver engine itself ships in Milestone 1. See
`FIXPROVE_MASTER_BUILD_PLAN.md` for the full roadmap.

## Build

```
pnpm install
pnpm build
```

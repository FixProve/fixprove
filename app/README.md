# @fixprove/github-app

The FixProve GitHub App backend. Handles two responsibilities only:

1. On `pull_request` webhook (opened/synchronize/reopened): creates a
   Check Run in `in_progress` status and remembers it, keyed by
   (owner, repo, head sha).
2. On an authenticated callback from the customer's own GitHub Action
   (see `templates/fixprove-check.yml`): verifies the caller's GitHub
   Actions OIDC token, looks up the matching pending Check Run by the
   token's own verified repository+sha claims, and completes it
   (success/failure + per-finding annotations) via the Checks API.

**This backend never fetches, clones, or scans customer source code.**
The customer's own `fixprove-check.yml` workflow (published as a template
in `templates/`) checks out their code and runs `fixprove check` on
GitHub's own runner, then POSTs only the findings JSON back here,
authenticated via a GitHub Actions OIDC token (no shared secret). See
`KS-REPORT-2.1-github-app.md` for the full design rationale and
verification record.

**Status (Session 2.1, 2026-07-04):** implementation + full unit/adversarial
test suite complete and passing (45/45) against locally-generated OIDC
test tokens/JWKS and fake Checks-API clients. **Logic-verified, not
live-verified** — no live GitHub App registration, real installation
token exchange, or real seeded PR has been exercised yet. See the Keystone
Report's Known Limitations for what a real end-to-end test still needs to
confirm before Milestone 2's exit gate is met.

**License:** proprietary — see root `NOTICE.md`. Not part of the open-core
`/cli` package.

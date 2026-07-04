# Licensing Notice

This monorepo contains packages under **different licenses**. There is
deliberately no single root `LICENSE` file, because the repo is not
uniformly licensed:

| Package | License | Why |
|---|---|---|
| `/cli` | **MIT** — see `cli/LICENSE` | Open-core distribution surface (npm/PyPI/crates.io). Community adoption is part of the growth strategy. |
| `/app` | Proprietary — all rights reserved | The GitHub App is the paid distribution surface (private-repo billing). |
| `/web` | Proprietary — all rights reserved | Marketing site, not a redistributable asset. |

If you are looking for the license that applies to code you are reusing,
check the specific package directory first.

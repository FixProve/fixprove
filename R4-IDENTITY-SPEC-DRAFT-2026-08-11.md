# R4 Identity Spec — Locked
Session 4.13, 2026-08-11. All five decisions confirmed — DECISION-5 (REVISED), DECISION-6 (RECONFIRMED), DECISION-8, DECISION-9, DECISION-10, all in `MEMORY/critical-actions.md`, all in Yehor's own words across three confirmations this session. Nothing below is implemented in code, committed, or pushed — this spec is ready to hand to a build session whenever Yehor chooses to commission one.

## Typefaces (DECISION-5, revised to three)

| Role | Typeface | Fallback stack | Source |
|---|---|---|---|
| Display | **Space Grotesk** (SIL OFL 1.1) | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` (existing F28 stack, so it degrades gracefully before self-hosting is wired up) | **DECISION-9, confirmed.** 2 of the 3 three-typeface reports (U1, U2) independently chose Space Grotesk over Geist Display (P2 alone). |
| Body / UI | **Inter** (SIL OFL 1.1) | Same OS stack as above | 3 of 3 three-typeface reports agree; this one was never in dispute. |
| Code | **JetBrains Mono** (SIL OFL 1.1) | `ui-monospace, SFMono-Regular, Menlo, monospace` (existing F28 mono stack) | 3 of 4 reports overall (P1, P2, U2); only U1 proposed IBM Plex Mono instead. |

All three are SIL OFL 1.1 — free to self-host, embed, and redistribute; none may be sold standalone. No licensing exposure for any of the three.

## Button-fill tokens (DECISION-6, reconfirmed)

Dark label on light teal fill — not white on a darker accent. This is what the live site already does by accident:

```
background: var(--accent)   /* #5eead4 — unmodified, already live */
color: #06231f               /* already live, already correct */
```

Recommendation: keep the exact live value (`#06231f`) rather than introducing a new token — it's already shipped, already passes AA (12.6:1, independently computed), and three of four reports converge on "dark on light teal" as the right direction without agreeing on one exact hex. Formalizing the value already in production is lower-risk than picking a new one. If you'd rather standardize to `--bg` (`#0b0d10`) for consistency with the rest of the token set, that's a one-line change and still passes AA comfortably — flag if you want that instead.

## Logotype (DECISION-8, new)

**Concept:** two opposing right-angle brackets — the "inspection boundary" around an expression being checked — resolving to a checkmark inside or immediately after them, representing the verified state. 3 of 4 reports converged independently on the brackets-around-a-terminal frame; checkmark was chosen over the alternative solid-square terminal for its semantic fit to CI pass/fail status.

**Wordmark case — DECISION-10, confirmed: lowercase `fixprove`.** Matches every install command and package listing (F9/F14) — the places a developer actually encounters the product name as typed text. Title-case `FixProve` remains correct for prose/marketing copy; this decision is scoped to the wordmark asset only.

**Still genuinely open (not part of any confirmation, needs a vector pass, not a decision):**
- Exact bracket/checkmark construction (stroke weight, grid unit, clear-space rule) — none of the three converging reports used identical construction values; this needs an actual vector pass, not a spec line, once you're ready to commission it.
- Monochrome and inverse treatment, minimum size, and the full asset export list (SVG/PNG/favicon/ICO) — deferred to the build session, not a decision blocker.

## What this doesn't cover

Colour ramp (beyond the one button pair above), layout/grid, and the proof-motif visual language are all still at "3-4 different independent proposals, no convergence strong enough to call a decision" — not addressed here. Revisit those once you're ready to commission the actual build, using this document's n=4 findings as the input.

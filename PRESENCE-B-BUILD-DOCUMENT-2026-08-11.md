# Prompt B Synthesis — Identity and Asset Generation
Session 4.13, 2026-08-11. Node 1 (Claude), Keystone Stage 3/4.

## CORRECTION — 2026-08-11, later in Session 4.13

The original version of this document was built on n=2 by mistake: two reports pasted directly in chat were wrongly assumed to be the content of the two uploaded files, when they were in fact four entirely distinct reports. Yehor caught this. Verified by direct read of both uploaded files against the pasted text — confirmed as four independent reports, not two duplicated ones. **This document is now the full n=4 synthesis.** The original n=2 text below is retained for the append-only record but is superseded by the "Full n=4 findings" section beneath it, which contains one material reversal (typeface count) and one strengthened result (button tokens) versus what was recorded as DECISION-5/6/7.

## Full n=4 findings (supersedes n=2 section)

**Report identity, since none of the four are self-titled consistently:**
- **P1** — pasted in chat, "proved, not guessed" thesis, numeric severity IDs 1–7.
- **P2** — pasted in chat, "FixProve Visual Identity System, Asset Generation, and Marketing Architecture Report," severity IDs S1–S6, logo = `[✓]` AST-bracket node.
- **U1** — uploaded, `FixProve-identity-and-asset-generation-report-2026-08-11.md`, "proof-ledger" thesis, severity IDs B-01–B-06, logo = "Resolved Node" (brackets + trace + solid square), invents an entirely new hex palette rather than retaining F27.
- **U2** — uploaded, `compass_artifact_wf-ca4a703b...`, severity IDs S1–S6, logo = "bracket-check mark," retains F27's exact hex values.

**WCAG contrast math — recomputed independently for all four.** P2, U1, and U2 are each exact to two decimal places across all six required pairs. P1's six numbers are all wrong (off 0.2–2.3), though every pair still happens to clear AA regardless. This is now a 3-of-4 finding, not a 1-of-2 one: treat P1's R4.CONTRAST-TABLE as unreliable, cite any of the other three.

**Typeface count — DECISION-5 needs to be revisited.** The n=2 record said "both reports converged on two typefaces." With all four in hand, that's wrong: only P1 proposes two (Inter + JetBrains Mono). P2, U1, and U2 all propose three — a dedicated display face (Space Grotesk in U1/U2, Geist Display in P2) plus Inter plus a mono face. 3 of 4 favor three typefaces, not two. Mono face has a clearer plurality too: JetBrains Mono in P1/P2/U2 (3 of 4) vs. IBM Plex Mono in U1 alone. **DECISION-5 as recorded does not reflect the actual evidence — flagging for your re-confirmation, not silently overriding it.**

**Button-fill tokens — DECISION-6 holds, and is now better supported.** P2, U1, and U2 all independently land on dark text over the light teal accent fill (not white on a darker accent-700). That's 3 of 4 on the merits, not "the one report with correct math" as the original n=2 note framed it — a real majority, separate from the WCAG-accuracy finding. No change needed here.

**Logotype — real convergence exists now, though you deferred this pending n=4 and n=4 is now actually in hand.** P2, U1, and U2 (3 of 4) independently construct the mark from two opposing brackets around a resolving terminal element — differing only in whether that terminal is a checkmark (P2, U2) or a solid square (U1). P1 alone uses a circular seal instead of brackets. This isn't a tiebreaker the way the WCAG math was for the button question — it's a genuine design convergence across three independently-run models. Still your call whether that's enough to decide now or you want a fifth opinion, but the "no tiebreaker evidence" reasoning DECISION-7 was deferred on no longer fully applies.

**Effort spread across all four:** P1 ≈73h, P2 ≈48h, U1 ≈78h, U2 ≈62h — a 48–78h band, roughly 1.6x spread, tighter than useful for scheduling but not wildly inconsistent.

## Original n=2 section (superseded, kept for the record)

**n=2, not n=4** *(this framing was wrong — see CORRECTION above).* Two of the four planned model runs are in: `FixProve-identity-and-asset-generation-report-2026-08-11.md` (Report 1, well-formed markdown, uses `##` schema headings) and `compass_artifact_wf-ca4a703b...` (Report 2, Perplexity export, plain-text headings, no markdown syntax). Both cover R4/R5/R6/R8 completely and follow the CLAIM: line convention in substance if not always literally. Everything below is a 2-model comparison, not the 4-model consensus process used for Prompt A. Treat "agreement" as "these two agree," not as validated consensus — run the other two models before locking any R4 token as final.

## Deployment note (resolved during this synthesis)

You ran `npx wrangler deploy` yourself and it succeeded — `/app` is live now, footer trader ID and outbound links are live on the homepage. Verified by direct fetch immediately before writing this. One defect surfaced in that live check, described below, already fixed and committed.

## Live defect caught and fixed — S4.13-APP-FOOTER-MIDDOT-FIX

Fresh fetch of `https://fixprove.dev/app` showed the footer literally reading `GitHub &middot; npm &middot; PyPI...` — the entity string, not a middot character. Cause: `web/src/app/app/page.tsx`'s footer-links paragraph wrote the separator as a JS string literal inside curly braces (`{" &middot; "}`), and React does not HTML-entity-decode JS string literals — only plain JSX text gets that treatment. The homepage's own footer-links row (`web/src/app/page.tsx`) already uses the literal `·` character directly and renders correctly live, which is how the mismatch was caught.

Fixed: replaced all four `{" &middot; "}` occurrences with `{" · "}` to match the working homepage convention. Committed locally as `85d2f2a` (`fix(web): render /app footer-link separators as literal middot, not raw entity`). **Not pushed** — this sandbox has no GitHub credential for `origin` (`fatal: could not read Username for 'https://github.com'`). Since `/sessions/.../mnt/FixProve` and `D:\Dev\Projects\FixProve` are the same physical repo, the commit is already sitting there — run `git push origin main` from your own PowerShell, then `pnpm build && npx wrangler deploy` from `web/` to ship the fix live.

## Verified finding — Report 2's WCAG contrast math is accurate; Report 1's is not

Independently recomputed all contrast ratios both reports claim, using the standard WCAG relative-luminance formula:

| Pair | Report 1 claimed | Computed | Report 2 claimed | Computed |
|---|---|---|---|---|
| Body text on background | 15.82:1 | 15.99:1 | 16.14:1 | 16.14:1 ✓ |
| Muted text on background | 7.09:1 | 6.40:1 | 7.68:1 | 7.68:1 ✓ |
| Accent on background | 12.73:1 | 10.45:1 | 13.15:1 | 13.15:1 ✓ |
| Body text on card | 14.26:1 | 14.76:1 | 14.90:1 | 14.90:1 ✓ |
| Accent-label-on-accent-fill | 4.77:1 | 5.47:1 | 13.15:1 (on their revised token) | 13.15:1 ✓ |
| Danger text on background | 9.09:1 | 7.03:1 | 7.03:1 | 7.03:1 ✓ |

Report 2's six numbers are exact to two decimal places against independent computation. Report 1's six numbers are all off — by as little as 0.2 and as much as 2.3 — though every pair still happens to clear AA regardless, so the practical pass/fail verdicts are unaffected. Treat Report 1's R4.CONTRAST-TABLE as directional only, not as verified figures; use Report 2's if you want numbers you can cite.

More importantly, Report 2 caught a real spec defect neither Report 1 nor the current live site addresses: **white text on the unmodified teal accent (`#5EEAD4`) is 1.48:1 — a severe AA failure** (verified: exact match). Report 1 avoided this failure mode by inventing a separate darker `accent-700` token for button fills rather than diagnosing the original token as broken. Report 2's fix is more direct — keep the light teal, put dark (`#0B0D10`) text on it, 13.15:1. Both are valid engineering choices; the open question for you is which token strategy to standardize on, since they imply different button-fill CSS. Neither has been applied to `globals.css` — the current CSS still ships button labels as `#06231f` on `var(--accent)` `#5eead4`, which computes to 12.6:1 (dark-on-light, same family as Report 2's fix) — so the live site is actually already safe by accident, it just isn't derived from either report's system yet.

## Agreement matrix

**R4 — Visual identity.** Consensus(2/2): dark palette retained, teal accent retained and extended into a ramp, two mandatory typefaces (Inter for text; JetBrains Mono for code), reject "AI glow / neural mesh / gradient" as the visual motif — both explicitly name and reject it. Split(1/1): Report 1 adds a third display typeface (Geist Display); Report 2 uses Inter for both display and body. Split(1/1) on logotype concept: Report 1 proposes a circle-checkmark-slash "proof seal"; Report 2 proposes a bracketed-checkmark `[✓]` AST node mark. Both are checkmark-based, neither is wrong, this is a genuine open creative decision for you.

**R5 — Image briefs.** Consensus(2/2) on all six surfaces in the required order, and on the "AVOID: glowing neural networks / abstract AI stock art" instruction — independently arrived at by both, which is a strong signal the constraint in B-INPUT actually landed.

**R6 — Homepage rewrite.** Consensus(2/2) on IA shape (hero → mechanism → failure examples → GitHub App status → waitlist verbatim → footer with trader ID), and both reproduce the F16 consent copy correctly, verbatim. Split: only Report 2 explicitly proposes JSON-LD/schema.org structured data as a backlog item addressing F37 (machine legibility) — Report 1's R6 and backlog say nothing about structured data. Given F37 was in the Fact Base specifically to surface this gap, Report 2 covered it and Report 1 missed it.

**R8 — Motion.** Consensus(2/2) on yes-with-conditions: both say do it, both sequence it after identity/homepage ship, both explicitly reject an "AI companion / co-pilot" framing in favor of a deterministic/proof framing, both propose Remotion. Split on duration (45s vs 30s) and lens name, but the underlying thesis — code-driven video reinforces "deterministic" substantively, not decoratively — is shared.

## Effort spread

Report 1 backlog totals ≈73h across R4+R5+R6+R8. Report 2 totals ≈48h for the same scope. A ~1.5x spread on two data points isn't yet a reliable range — wait for the other two runs before using either number to plan a timeline.

## Open decisions — final, resolved 2026-08-11 on n=4 (Session 4.13)

First pass, Yehor's own words: "Confirmed: two typefaces, dark-on-teal buttons, wait for n=4 on the logo." That was made on n=2 by mistake (see CORRECTION above). Second pass, once n=4 was actually assembled and the typeface count reversed on the real evidence, Yehor's own words: "Confirmed: three typefaces, logo as described." Recorded in `MEMORY/critical-actions.md` as DECISION-5 (REVISED), DECISION-6 (RECONFIRMED), DECISION-8 (NEW).

1. **DECISION-5, REVISED: three typefaces** — a display face + Inter (body) + JetBrains Mono (code). Not two. 3 of 4 reports (P2, U1, U2) proposed three independently; the sole two-typeface report (P1) is the same report independently proven wrong on all six WCAG figures elsewhere in this study — corroborating, not just outvoting. Exact display-face pick (Space Grotesk, used by U1 and U2, vs. Geist Display, used by P2 alone) is drafted as a recommendation in the identity spec, not yet locked as its own decision.
2. **DECISION-6, RECONFIRMED: dark text on light teal button fill.** Now 3 of 4 supported on the merits (P2, U1, U2), not just "the one report with correct math." Matches what the live CSS already does by accident.
3. **DECISION-8, NEW: logotype concept — brackets around a resolving terminal mark, checkmark variant.** 3 of 4 reports (P2, U1, U2) converge independently on the brackets/terminal frame; the only disagreement was checkmark (P2, U2) vs. solid square (U1) as the terminal glyph. Checkmark chosen for its semantic fit to CI pass/fail status — the product's actual function.
4. All three are decisions, not yet a build. Nothing above has touched code, been committed, or been pushed — see the identity spec draft (separate file) for the implementation-ready summary, pending Yehor's review before anything lands.

## What's unchanged

Standing constraints from B-INPUT (no pricing, no payment surface, GitHub App stays private, waitlist copy verbatim, sequencing after Tier 1) — both reports respected all of them. No violations to report.

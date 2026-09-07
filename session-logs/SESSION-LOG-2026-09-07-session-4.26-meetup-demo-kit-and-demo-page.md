# Session Log — 2026-09-07 — Session 4.26: Meetup Demo Kit, `/demo` Page, CLI Defect Audit

## 1. Scope

Build a self-contained Claude Code Meetup #3 (Aarhus, 2026-09-17) 5-minute
live-demo kit outside the FixProve repo (local, no push) — verified real
`fixprove` CLI syntax, planted-hallucination Python/TypeScript samples,
a 3x determinism proof, a fallback recording, a QR code, and a cheat
sheet. Separately, at Yehor's direction mid-session: draft a `/demo`
section for `fixprove.dev`, build it safely on a branch, and prove a
real, reversible preview deploy exists before asking for any go/no-go on
production. Also: independently re-verify every claim in several relayed
"guide chat" messages per this project's standing rule, and help draft
two LinkedIn messages.

## 2. Live state changes — every real, externally-verifiable action

- **`~/.npm-global/bin/fixprove` and `~/.local/bin/fixprove` both
  installed and tested** in this sandbox (npm 0.1.12, PyPI latest) —
  confirmed via explicit full paths, not `$PATH` inference.
- **Branch `draft/demo-section-4-26` created**, 3 commits: `7aa1be7`
  (`/demo` page draft), `962ca3d` (add `examples/meetup-demo-2026-09-17/`
  + fix dead GitHub links), `3b8d7f7` (`web/wrangler.toml` `[env.preview]`
  block). **First two pushed to `origin/draft/demo-section-4-26` by
  Yehor**, from his own machine — confirmed via his own pasted terminal
  output (`git push -u origin draft/demo-section-4-26` → `[new branch]`).
  **Third commit (`3b8d7f7`) is NOT yet pushed** — found only during this
  close's own reconciliation (see §3, and `KS-REPORT-4.26-*.md` §3
  Defect 5).
- **`main` untouched by this session** — confirmed via
  `git cat-file -e main:web/src/app/demo/page.tsx` failing (absent from
  `main`), both before and after this session's work.
- **Live Cloudflare Workers preview deploy executed by Yehor** on his own
  machine: `cd web; npm run build; npx wrangler deploy --env preview` →
  resolved at `fixprove-preview.truffel30001.workers.dev`. **Independently
  verified by Claude**, not taken on Yehor's report alone: fetched
  `/demo` on that URL via the built-in browser, read the rendered page
  text, and took a real 375px mobile-viewport screenshot — clean
  rendering, no overflow/cutoff, both example sections and the footer
  present and correct.
- **Two LinkedIn messages sent by Yehor**, drafted by Claude: one to
  Augustin Gottlieb (real organizer of the Aarhus Claude Code Meetup,
  asking for a 5-minute Show & Tell slot on 2026-09-17, revised at
  Yehor's request to open with "hope the exam prep is going well"
  rather than "good luck" once Yehor confirmed Gottlieb had passed the
  CCA-F exam); one a short reply to Ulrik Bergmann's connection message.
  **Neither reply had arrived by this session's close.**
- **`MEMORY/critical-actions.md` appended twice** (append-only, never
  rewritten): a 2026-09-07 entry permanently closing the third
  recurrence of the NextStep/"Tag din virksomhed" funding-program
  confusion, and a 2026-09-07 calibration note recording Claude's own
  Cloudflare Pages assumption error and its fix. File grew
  2887 → 2930 → 2967 lines; both appends verified via a line-count check
  immediately before and after.
- **This close: 7 `.git/index.lock` occurrences found and `mv`'d aside**
  into `.git-stale-locks/` (never `rm`'d) — the same standing mount
  defect documented since Session 4.20, now also newly confirmed to
  affect this session's `outputs` scratchpad mount in the same way (see
  `feedback_fixprove_mount_write_quirks.md`, updated this session).
- **`KS-REPORT-4.26-meetup-demo-kit-and-demo-page-session-close.md` and
  this log committed on `draft/demo-section-4-26`**, not `main` — see
  §4 for why, and the KS-Report's own §6 for the full reasoning.

## 3. Real defects found

Full detail, root cause, and fix status for all nine defects (five
product-level `fixprove` defects, the newly-found unpushed commit, the
whole-tree CRLF drift, and two self-caught instruction errors) is in
`KS-REPORT-4.26-meetup-demo-kit-and-demo-page-session-close.md` §3 — not
duplicated here to avoid the two documents drifting apart. Headline
list: (1) npm/pip CLI syntax mismatch, (2) npm `--version` stale, (3)
`requirements.txt` version-pin-mismatch masking, (4) two false-negative
detection gaps (pandas inferred-type method, lodash `@types`-only
package), (5) `draft/demo-section-4-26`'s unpushed third commit, (6)
whole-tree CRLF drift (cosmetic, twice-confirmed), (7) dead GitHub links
in the first `/demo` draft (self-caught, fixed), (8) Cloudflare Pages
assumption error (self-caught, fixed), (9) `git checkout`/`wrangler`
working-directory instruction errors (self-caught, corrected).

## 4. Known limitations — stated plainly

- fixprove's five real product defects are not fixed this session — out
  of scope, documented only.
- `/demo` is not in production; the Aarhus slot is not confirmed.
- The unpushed `3b8d7f7` commit means the `[env.preview]` config exists
  only in this sandbox's local checkout and Yehor's own working copy
  until he pushes it.
- This session's governance docs (this log, the KS-Report) live on
  `draft/demo-section-4-26`, not `main` — the mount's checkout-can't-
  clean defect, at this session's scale, made a clean switch back to
  `main` produce a working tree matching neither branch's true state,
  so Claude stayed on the draft branch rather than risk mixing content.
  Full reasoning in the KS-Report §6.
- Two contaminated leftover folders in the outputs directory need manual
  deletion by Yehor; not fixable from this sandbox.
- No new movement this session on NemKonto, the grant outcome, or Row 4.

## 5. Current state snapshot as of session close

- `draft/demo-section-4-26`: 3 local commits, 2 pushed, 1 (`3b8d7f7`)
  not yet pushed. Checked out, HEAD at `3b8d7f7`.
- `main`: unchanged by this session, still 1 commit ahead of
  `origin/main` (`b6a826d`, pre-existing from before this session,
  dated 2026-09-03).
- Meetup demo kit: complete, verified, delivered to Yehor's outputs
  folder (`fixprove-meetup-2026-09-17/`).
- `/demo` page: drafted, committed, live-previewed, NOT in production.
- Aarhus meetup slot: asked for, awaiting reply.
- MEMORY/critical-actions.md: 2967 lines, two new dated entries this
  session.
- Working tree: whole-tree CRLF cosmetic drift present (~305-306 files
  show `modified`, confirmed zero real content difference via
  `git diff -w`); not committed, not fixed, correctly left alone.

## 6. Immediate next step

See `KS-REPORT-4.26-*.md` §7 for the full, numbered action list for
Yehor. Single highest-priority item: push `3b8d7f7` to
`origin/draft/demo-section-4-26` so the branch (and this session's
governance docs) actually reach GitHub. Full session-start checklist for
whoever opens next in `NEXT-SESSION-4.27-STARTING-PROMPT.md`.

Recorded by Claude (Node 1), Session 4.26, 2026-09-07.

# Exposure Check Protocol

Standing pre-commit check for this repo, which is public. Run this before
any commit that touches `session-logs/`, any `*-STARTING-PROMPT.md`, or any
newly-added `.md`/`.pdf` document — in addition to (not instead of) the
existing pricing/CPR/Stripe exposure grep already used each session
(`kr|CVR|stripe|sk_live|sk_test`, documented inline in
`MEMORY/critical-actions.md` entries).

## Origin

Added 2026-09-14 after commit `cbb09ce` (2026-09-11, `git add -A`, 24
files) was found — on direct review, not assumption — to have published a
real third-party work email address (`session-logs/SESSION-LOG-2026-09-09-
funding-incubator-chat-only.md`) and a self-authored legal-gap
assessment (`FixProve-vFault-Legal-Diligence.pdf`) to this public repo.
The standing exposure grep at the time checked only pricing/CPR/Stripe
patterns — it never checked for other people's contact details or
ongoing-case identifiers. See `MEMORY/critical-actions.md`, 2026-09-14
entry, for the full review and Yehor's decisions.

## The two additional checks

1. **Third-party email addresses.** Before committing, grep the changed
   files for `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}` and review
   every hit. FixProve's own published contact addresses
   (`yehor@yehor.ai`, etc.) are fine; anyone else's is not, absent their
   consent.
2. **Third-party names + case/reference identifiers, in `session-logs/`
   and `*-STARTING-PROMPT.md` specifically.** These files narrate real
   people and real ongoing matters (funding contacts, legal case numbers,
   bank application references) in first-draft prose not written with
   publication in mind. Before committing a new or edited file in either
   location, re-read it once specifically looking for named third
   parties and case/reference numbers, and decide deliberately whether
   each belongs in a public file — don't rely on the pricing/CPR grep to
   catch it, since it won't.

## What this does not do

Neither check reaches back into already-published git history. A hit
found after the fact is a going-forward redaction (replace the text,
commit, document why) — the prior version remains visible in this
repo's public history regardless. Removing that would require a
history rewrite, which this project's append-only convention and CA-2
(repo visibility flips or anything irreversible-in-public) both treat as
Yehor's call, not something to do by default.

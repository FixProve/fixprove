# KS-REPORT-4.12C — GitHub Cold-Start Polish

**Date:** 2026-07-22 · Session 4.12-C · Author: Claude (Cowork, Node 1) ·
**Accountability Statement: §5 below is PENDING Yehor's signature.**

## 1. Provenance (AI-generated vs human-edited)

All file edits, commit messages, the new `PITFALL-WATCHLIST.md`, and the
`.strategy`-style verification passes in this report are AI-generated
(Claude, this session). Every substantive decision — what to redact, what
to commit, what wording to use, the CA-1 partial lift, the GitHub UI exact
values — was Yehor's, given explicitly in chat (recorded inline below and
in `MEMORY/critical-actions.md`'s 2026-07-22 entries). No AI-authored text
was published without Yehor's decision governing its content. The GitHub
UI changes (org avatar/bio/website/pin, repo About description/website/
topics) were applied by browser automation acting on Yehor's explicit,
batched, in-chat approval of the exact values used.

## 2. Verification summary

**Local commits this session (all on top of `097fa1b`, HEAD now `14f28fa`,
4 commits ahead of `origin/main`, NOT pushed):**

| Commit | Contents |
|---|---|
| `bc1418e` | README rewrite (badges, install section, "Session 0.2/scaffold" language removed), CONTRIBUTING staleness fix, `cli/package.json` keywords+author, new `PITFALL-WATCHLIST.md` (5 rows) |
| `61576c0` | PITFALL row 5 reworded (pre-publication correction), README's link to `FIXPROVE_MASTER_BUILD_PLAN.md` removed, `.gitignore`'s `PROGRESS.md` line swept in |
| `91cad3d` | `RUNBOOK-SESSION-OPERATING.md` §4: two new gotcha entries (AI-sandbox push limitation, one-writer-at-a-time on the mount) |
| `14f28fa` | Committed `KS-REPORT-4.11.5-addendum-cvr-issued.md` (authored by a separate, same-owner Cowork project working the CVR registration thread; Yehor approved committing it, reasoning recorded in the commit message and in `MEMORY/critical-actions.md`) |

**Exposure check, run before every commit above, re-run explicitly this
session across the full working tree (tracked + untracked, via `git
grep`):** redacted comparison-mark name — clean in all committed content
(present only in the already-known, deliberately held-back files, unaffected
by this session). The trademark-admission phrasing flagged for row 5 (see
§3) — clean (row 5 reworded; my own first-draft addendum accidentally
re-quoted the exact removed phrasing verbatim — caught and rewritten
before staging, see §3). `$29`/`$99` — present only in the two
previously-accepted files (`FIXPROVE_MASTER_BUILD_PLAN.md`,
`KS-REPORT-4.12A-public-surface-audit.md`). CPR-shaped digit pattern
(`[0-9]{6}-[0-9]{4}`) — clean everywhere, including the new CVR addendum
file (checked before staging).

**GitHub UI changes — applied and independently verified via anonymous
`fetch()` (`credentials: 'omit'`, i.e. what a logged-out visitor actually
sees, not the authenticated DOM state):**
- Org avatar: custom image confirmed (not an identicon pattern).
- Org bio: "Proves AI-generated code before it merges — every import,
  symbol, and API call verified against your real installed dependencies.
  Zero LLM tokens." — live.
- Org website: `https://fixprove.dev` — live.
- `fixprove` repo pinned — confirmed via `pinned-item-list-item` markup
  in the anonymous-fetched HTML.
- Repo About description — same sentence as the org bio — live (also
  visible in the browser tab's own title after save).
- Repo website: `https://fixprove.dev` — live.
- Repo topics (7): `ai`, `static-analysis`, `ci`, `python`, `typescript`,
  `hallucination-detection`, `sarif` — all 7 confirmed via `/topics/<name>`
  href pattern in the anonymous-fetched HTML.

**Not yet verifiable — depends on the push that hasn't happened yet:**
README's live rendering (no "Session 0.2"/"scaffold" text, badge row
rendering green) can only be checked against `origin/main` after Yehor
pushes; the local file content is confirmed clean by direct read and grep,
but that is not the same as a live-page confirmation. Flagged here rather
than asserted.

## 3. Defects caught and fixed — specific

1. **PITFALL row 5 originally shipped with language that read, in effect,
   as a written admission of prior awareness of a trademark conflict**,
   committed locally in `bc1418e`. Fixed in `61576c0` as a pre-publication
   correction (the commit had never been pushed) — reworded to a neutral
   "formal clearance search not yet performed" with the same tracking
   value, decided explicitly by Yehor.
2. **My own first draft of that fix re-introduced the problem it was
   fixing** — the addendum explaining the row-5 change quoted the exact
   admission phrase verbatim, which would have republished it. Caught
   before staging (re-grepped the draft, found the match, rewrote the
   addendum to describe the change without repeating the flagged
   language), re-verified clean, then staged. This is logged as a defect
   because it reached a draft file on disk before being caught — it never
   reached a commit or the public repo.
3. **README's Status section linked to `FIXPROVE_MASTER_BUILD_PLAN.md`**,
   which still carries live pricing. That file's pricing was already an
   accepted, logged gap from a prior session — but the acceptance was
   reasoned on the file sitting passively in a repo nobody visits. This
   session's README rewrite actively routes cold-start visitors to it,
   changing the exposure posture. Yehor decided to remove the link (the
   file itself is untouched).
4. **A cross-project CPR/PDF-exposure concern was raised** (by a separate
   Cowork session working the business-registration thread) and
   independently investigated this session: `find`, `git ls-files`, and
   `git grep` for a CPR-shaped pattern were all run against the FixProve
   mount. Result: the registreringsbevis PDF was never written to this
   mount at all — the concern doesn't apply here. Reported as a drift
   correction (the concern was reasonable to raise; the specific risk
   didn't materialize on this repo) rather than silently dropped.
5. **A GitHub org-profile save appeared to fail on the first attempt**
   (fresh reload showed empty fields) and a **second attempt's flash
   messages included what looked like a fresh error** ("Sorry, something
   went wrong" plus a session-conflict banner). Investigated via computed
   style / `offsetParent` checks rather than trusting raw `textContent`:
   the "error" and session-conflict banners were hidden template elements
   (`display: none`, `offsetParent: null`) that GitHub always keeps in the
   DOM; the actually-visible flash was "Profile updated." The save had, in
   fact, succeeded — confirmed independently via a fresh page reload and
   an anonymous `fetch()`. The first attempt's failure remains unexplained
   (possibly a genuine transient issue, possibly related to the multiple
   GitHub-authenticated tabs Yehor had open at the time) but the second,
   working attempt is verified by a method independent of the page's own
   flash-message DOM.

## 4. Known limitations — unsoftened

- The root cause of the first (failed) org-profile save attempt was never
  identified. It resolved on retry after Yehor closed other tabs, but
  correlation isn't proof of causation — a future session hitting the same
  symptom should not assume "close other tabs" is a guaranteed fix.
- README/CONTRIBUTING/badge-row live rendering is unverified against the
  actual public repo, because `origin/main` doesn't have this session's
  commits yet. This is a **push-dependent**, not a content, gap.
- Nine files remain deliberately held back from git (unchanged from prior
  sessions' decisions — full list in `MEMORY/critical-actions.md`'s
  2026-07-21 entries), plus `NEXT-SESSION-4.12-C-STARTING-PROMPT.md`.
- The CA-1 partial lift (Stripe test-mode permitted) is a recorded
  decision only — no Stripe action was taken or attempted this session.
- `.gitignore`'s `PROGRESS.md` addition was swept into `61576c0`, but
  `PROGRESS.md` itself remains uncommitted/gitignored, per Q1's carve-out.

## 5. Accountability statement

This report and the session's four commits are submitted for Yehor's
review. Nothing in this session touched Stripe, published pricing, or
changed the GitHub App's installation visibility. All GitHub UI changes
were applied only after Yehor's explicit, batched, in-chat approval of
the exact values used.

**Signature: PENDING — Yehor.**

## 6. Methodology note

Two verification habits paid off concretely this session and are worth
carrying forward: (a) re-grepping a just-written draft for the exact
string it's supposed to be removing, before staging it — this caught
defect #2 above; (b) checking `offsetParent`/computed `display`, not just
`textContent`, when reading a page's flash/status messages — GitHub keeps
hidden error/conflict templates in the DOM at all times, and reading them
as if they were live produces false failure signals (defect #5). Both are
candidates for `MEMORY/state.md`'s heuristics if they recur in a future
session.

## Addendum (2026-07-22, post-push close)

This report was committed as `724e71c` and pushed to `origin/main` with
§5 reading "PENDING." A same-day, uncommitted local edit to this file
changed §5's signature line directly to "Yehor Kaliberda Date: 22.07.26"
— that edit was reverted before this addendum was added, because once a
KS-REPORT has been pushed, correcting it in place (rather than via a
dated addendum) would break the append-only convention this project
relies on for its own audit trail. The underlying fact is preserved here
instead:

1. **§5 status:** Yehor signed this report 2026-07-22. The header's
   "PENDING" line above (line 4) and §5's signature line are therefore
   both superseded by this addendum as of this date — the report is now
   ATTESTED. Per convention, neither line is edited in place; this
   addendum is the record of the change.
2. **§2's commit table** ends at `14f28fa` and states the four commits
   were "NOT pushed" — that was accurate when written, since this
   report's own commit hash cannot describe itself. Final state, verified
   this addendum: HEAD is `724e71c` (this report's own commit, one more
   than the table lists), pushed, `origin/main` identical (`git
   rev-list --left-right --count origin/main...HEAD` = `0  0`, both refs
   the same 40-char SHA).
3. **§4's "README/badge live-render unverified — push-dependent gap"**
   is CLOSED. Verified anonymously post-push: raw `README.md` off `main`
   has no "Session 0.2"/scaffold language, the badge row markup is
   present, the Install section is present, and the master-plan link is
   correctly absent. All 5 badge images independently confirmed to
   render on the live rendered page (`naturalWidth > 0` for each,
   including the 4 served through GitHub's camo proxy) — an image
   `fetch()`/`Image()` load test run directly against `img.shields.io`
   from the `github.com` origin gave false "error" results for 4 of the
   5 badges (cross-origin resource policy on that specific request path,
   not a real failure); confirmed false by loading each shields.io URL
   directly as its own page (all rendered) and by reading `naturalWidth`
   off the actual `<img>` elements in the live rendered README (all
   nonzero). Recorded here as a specific example of a verification
   method producing a false negative, distinct from defect #5's false
   positive — worth carrying into `MEMORY/state.md`'s methodology notes
   alongside it.
4. **CA-5 post-push per-job CI check:** re-confirmed independently via
   an anonymous fetch of the GitHub check-runs API for `724e71c` —
   `build` and `test-python` both `completed`/`success`.

No new CA-class decision occurred in producing this addendum; it is a
record-consistency correction only.

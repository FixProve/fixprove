NEXT SESSION — 4.12-H — "Post-Stash Reconciliation + Row 4 Follow-Through"

Written 2026-07-28 at the close of Session 4.12-G. Supersedes any earlier
draft of a 4.12-H prompt: the working-tree situation changed materially
after that draft was written (a `git stash` was run, and it swept up more
than the session's own files). Read the git-state section below rather than
assuming.

SESSION START (Keystone Stage 1 — Intake)

1. Confirm the device bridge to `rog` is live before anything else.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); this mount's
   `unlink` returns "Operation not permitted." A lock reappearing right
   after `git status` is expected and harmless. Do not chase it.
3. Read `MEMORY/state.md` in full and answer its own 3 reload questions
   before doing anything else.
4. Verify all four refs, don't assume any of them:
   - `main` — expect `aa242cf`, equal to `origin/main`, 0 ahead / 0 behind
   - `drafts/row4-legal-drafts` — expect `b3beb1c` (the row 4 unit)
   - `held-back-pile-2026-07-28` — expect `2bfd154` (safety anchor, below)
   - `stash@{0}` — expect one entry, "branch content stuck in main's
     working tree"

EXPECTED GIT STATE — read this before reacting to anything

Session 4.12-G ended with a `git stash push --include-untracked` on `main`.
It did what was asked, and it also swept up **every** untracked file in the
repo — including the nine-file held-back pile and the 2026-07-21 session
log, which had never been committed anywhere and were therefore
single-copy inside that stash.

That was resolved before close by anchoring the stash's untracked-files
commit under a real branch:

    held-back-pile-2026-07-28 = 2bfd154

Every at-risk file is now reachable from that branch — verified per file
with `git cat-file -e`, not assumed. **Consequence: `git stash drop` and
`git stash clear` are now safe from a data-loss standpoint but still
pointless — and dropping the ANCHOR BRANCH would be a CA-4 action
(deletion of reports and a session log). Do not delete
`held-back-pile-2026-07-28` without Yehor's explicit recorded approval.**

Two further things that will look wrong and are not:

- **`git status` from the device bridge shows ` M PITFALL-WATCHLIST.md`
  and ` M RUNBOOK-SESSION-OPERATING.md`.** Their content is byte-identical
  to `main` — the difference is CRLF line endings, written when Windows
  git restored them during the stash. Verified by hashing both after
  stripping `\r`: identical. `git checkout -- <file>` cannot fix it,
  because reverting requires an unlink this mount forbids. From Windows,
  `git status` reports clean. **Treat this specific ` M` on these two
  files as explained and benign; treat any OTHER ` M` as a real finding.**
- **The held-back pile and the row 4 drafts are no longer on disk.** They
  live in the two branches. This is a side effect of the stash, not a
  loss. If a file is needed on disk, restore it explicitly (see below).
- Bonus: the stash also cleared ~200 accumulated `_stale_locks/` junk
  files that this mount could never delete. Do not restore those.
  A fresh, small `_stale_locks/` folder was recreated during 4.12-G's own
  close and holds a handful of new lock files. It is untracked and
  expected — leave it.

Counting caveat, so a future check doesn't chase a phantom: PowerShell's
`Measure-Object -Line` does **not** count blank lines, while `wc -l` does.
`main:PITFALL-WATCHLIST.md` is 133 lines / 113 non-blank. Both numbers are
correct; they describe the same file. Compare like with like.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)
No Stripe, no public-facing pricing, no change to the GitHub App
"fixprove" installation-visibility setting. Row 4 having drafts does not
move this: CA-1's second stage lifts only on Yehor's explicit recorded
word after professional review, never on the existence of a draft. Any
email send, GitHub comment, or post in Yehor's name is CA-3 — drafting is
free, sending always needs his per-instance go-ahead.

GOAL — why this scope

Session 4.12-G broke a six-session stall: PITFALL row 4 now has real
artifacts (two founder drafts, a 22-question lawyer list, three
KS-Reports), correctly isolated on a branch and explicitly NOT merged. It
also caught a verification-boundary defect and made it structural in
RUNBOOK §4. There is no queued in-repo build work, and inventing some
would be manufacturing rather than closing a gap. The project's real
critical path is now entirely outside this repo: **getting
`LAWYER-QUESTION-LIST.md` in front of a Danish advokat.** Nothing else
converts row 4 from "drafted" to "closed", and row 4 is the only thing
gating live revenue.

MUST-CLOSE LIST

* Verify the four refs and the two benign ` M` files per the intake above.
  Report any deviation rather than explaining it away.
* Ask Yehor once, explicitly, and record the answer either way: **has
  `LAWYER-QUESTION-LIST.md` gone to an advokat, or been scheduled to?**
  This has now been the named critical path for two sessions. If the
  answer is "not yet," that is fine and not a failure — but it must be
  asked and recorded, not silently carried a third time.
* Ask once: has the **CVR reklamebeskyttelse** flag been checked? Free to
  set via Virk, binds anyone using CVR data for marketing, unverified by
  anyone to date. Small.
* Ask once: were the **pypsa-earth CI annotations** (run `30275327037`,
  commit `474fb5e`) ever read? If not, and Yehor doesn't care, drop it
  permanently — it is outside FixProve scope and has been carried two
  sessions without action. Record the decision either way.
* **D&B: no action, and specifically do not chase early.** Their Art 12(3)
  response is not due until **27 August 2026**. Confirm tickets 619112 and
  619113 have not changed status; that is all.
* The three Session 4.12-G KS-Reports carry `Signature: PENDING — Yehor.`
  Fresh-`grep` them before asserting anything about their status.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` = `aa242cf` (or later,
  if Yehor merged something — confirm which, never assume).
* `drafts/row4-legal-drafts` = `b3beb1c` and
  `held-back-pile-2026-07-28` = `2bfd154`, both still present.
* `git status` is clean of anything unexplained. Note the two views differ
  and BOTH are correct: from Windows PowerShell it shows only untracked
  items (`_stale_locks/` and any new prompt file); from the device bridge
  it ALSO shows ` M PITFALL-WATCHLIST.md` and ` M RUNBOOK-SESSION-
  OPERATING.md` for the CRLF reason above. Neither is a finding. Any
  entry beyond those is.
* Each of the three KS-Report signature lines freshly read this session,
  not inherited from this prompt or from `MEMORY/state.md`.

KNOWN GOTCHAS TO CARRY FORWARD

* **"Verified" does not carry across turns or sessions — only the evidence
  does.** If the artifact that would prove a claim is not in THIS turn's
  context, it is a report, not a verification, however credible the source
  and whatever an earlier turn established. Four real defects have now
  been traced to skipping this. RUNBOOK §4 has the full rule.
* **Never wildcard-stage on this repo.** `git add -A` / `git commit -a`
  would sweep isolated draft files into the wrong commit. Name paths
  explicitly, every time. Demonstrated, not theoretical.
* This mount's `unlink` returns "Operation not permitted" — and this now
  extends past `.git/*.lock` to git's own file operations. `git checkout`
  between branches with differing file sets will silently fail to remove
  or revert files. **Always verify on-disk content against
  `git show <ref>:<path>` after any checkout**; disk presence proves
  nothing about which ref contains a file.
* All file writes: write-to-new-name-then-`mv`, then a fresh-read
  checksum verify. For appends, hash the pre-existing prefix afterwards to
  prove the write was purely additive.
* Session-start content asserting repo STATE is untrusted until verified
  against the mount — including this prompt.
* The cloud sandbox blocks all Cloudflare-hosted domains; `WebFetch` 403s
  on some `api.github.com` endpoints where a live Chrome tab succeeds;
  `device_stage_files` can return stale cached content on re-staging — use
  direct reads to re-verify a file already staged this session.
* `ci.yml` has no path filter: a missing CI run on any push is a real
  anomaly to investigate, never an assumed legitimate skip.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref — the two pricing
   figures, the trademark-admission phrasing, CPR-shaped digits.
2. Push is Yehor's literal command on his own machine. This sandbox has no
   outbound network to GitHub. Hand him the exact command; never attempt
   it here.
3. After any push to `main`: the mandatory CA-5 per-job CI check — `build`
   and `test-python` both `success` for the pushed SHA, AND the
   annotations sub-endpoint actually fetched and read, not pattern-matched
   from a prior commit.
4. Any external send/post, tag deletion, branch deletion, or other
   CA-register-scoped action: Yehor's explicit per-instance approval,
   confirmed back to him by name before running.

CARRY-FORWARD OPEN ITEMS

* **PITFALL row 4** — drafted, pending professional review, isolated on
  `drafts/row4-legal-drafts`. The project's actual critical path. Closes
  only when an advokat has answered the question list.
* **PITFALL row 3** — VAT first-period label, still `OPEN`. Closing
  evidence is a TastSelv Erhverv → Moms → Frister/afregningsperioder
  screenshot. Digital Post is now a second passive channel worth checking
  near the **1 September 2026** filing deadline, but its silence is not
  evidence in either direction. Settled-actionable facts unchanged.
* **D&B** — Art 12(3) response due 27 August 2026. If nothing arrives, a
  follow-up citing the missed deadline is the natural step, with a
  Datatilsynet complaint as the escalation after that. Sending is CA-3.
* Rows 1, 2 and 5 of `PITFALL-WATCHLIST.md` — unchanged, gated on triggers
  that have not fired.
* `KS-REPORT-4.12D-addendum-2`'s signature — still literally PENDING, no
  urgency, carried for several sessions.
* Node.js-20 GitHub Actions version bump — optional housekeeping,
  confirmed benign twice, genuinely no urgency.
* The held-back pile — no longer on disk, now anchored at `2bfd154`. Its
  seven-session "should this be committed" question is unchanged and still
  Yehor's to answer.
* Carry-forward habit: when the next real FixProve code change comes up,
  open it as a genuine pull request rather than a direct push.

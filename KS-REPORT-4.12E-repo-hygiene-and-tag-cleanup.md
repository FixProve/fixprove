# KS-REPORT-4.12E — Repo Hygiene (Issue/PR Templates + CODE_OF_CONDUCT) and Stray-Tag Cleanup

Session 4.12-E, 2026-07-24. Node 1 (Claude), Director: Yehor.

## 1. Provenance

All content in this report and the files it documents is AI-generated
(Claude, this session), operating directly on the FixProve mount via the
device bridge. No human-edited content is claimed here. The five new files
below are boilerplate/community-health scaffolding (issue templates, PR
template, Contributor Covenant text) — not novel engineering — consistent
with the must-close instruction to use standard, widely-recognized text
rather than drafting bespoke language.

## 2. What was done, in order

### 2.1 Session-start checks (Keystone SESSION START + this session's own
### numbered start sequence)

- Device bridge to `rog` confirmed live; `D:\Dev\Projects\FixProve` mounted.
- `.git/index.lock` found present at session start — renamed away
  (`mv`, not `rm`, per standing mount convention), not deleted.
- `git log -1 --oneline` at session start: `5392b7f` — matched the expected
  HEAD from the starting prompt exactly. **No drift.**
- `MEMORY/state.md` read in full; its own 3 reload questions answered
  cleanly (Session 4.12-D fully closed at every level; nothing open in its
  scope; only decisions to preserve are historical, listed in that file's
  reload-question (c)).
- `PITFALL-WATCHLIST.md` rows 3 and 4 re-read directly this session (not
  from this prompt's summary) — see §5 below.

### 2.2 Stray tag `v0.1.4.bak.1783353789` — deleted locally, remote deletion
### handed to Yehor

Yehor approved deletion, conditional on a reachability verification. That
verification was run **independently by this session** (not taken on
trust from any pasted/reported output — see §6 Methodology Note for why
this distinction matters this session specifically):

```
git rev-parse v0.1.4.bak.1783353789   → 1d2670dba45b771cb7f096ee65a5f0c4aa5fb314
git rev-parse v0.1.4                  → dce076c045c0f7c4b2b2d0f107eca3c02546a0f6  (different SHA — not a duplicate label)
git branch --contains v0.1.4.bak...   → lists `main` (plus 10 stale local feature branches)
git tag -l "v0.1.4*"                  → v0.1.4, v0.1.4.bak.1783353789 (both present, pre-deletion)
```

`main` appearing in `--contains` confirms the tagged commit is reachable
from `main` — deleting the tag removes a label only; no commit becomes
unreferenced or garbage-collection-eligible. Recorded here for
reversibility: `git tag v0.1.4.bak.1783353789 1d2670dba45b771cb7f096ee65a5f0c4aa5fb314`
would recreate it if ever wanted back.

**Executed:** `git tag -d v0.1.4.bak.1783353789` (local only). Hit the
mount's standard lock-collision pattern (`packed-refs.lock`,
`refs/tags/v0.1.4.bak.1783353789.lock` both reported "Operation not
permitted" on unlink) — git's own output confirmed `Deleted tag
'v0.1.4.bak.1783353789' (was 1d2670d)` despite the warnings, and a fresh
`git tag -l "v0.1.4*"` immediately after showed only `v0.1.4` — deletion
succeeded despite the noisy warnings. Both stale lock files renamed away
into `_stale_locks/` (mount convention: rename, never `rm`/`unlink`,
which returns "Operation not permitted" here).

**Not executed — handed to Yehor, per standing convention that
`device_bash` has no outbound network path to GitHub, confirmed
repeatedly in this project's history:**

```
git push origin :refs/tags/v0.1.4.bak.1783353789
```

Note for whoever runs this: this pushes to `refs/tags/`, not
`refs/heads/main` — it does **not** trigger a CI run, so the CA-5
per-job-green obligation does not apply to it. After running it, confirm
via `git tag -l | grep -i bak` (locally, expect empty) and a live,
logged-out check of `github.com/FixProve/fixprove/tags` (expect
`v0.1.4.bak.1783353789` absent, `v0.1.4` still present).

**This is logged as an explicit, session-specific approval — not standing
permission for future tag operations**, per this project's CA-register
convention.

### 2.3 `.github/ISSUE_TEMPLATE/`, PR template, `CODE_OF_CONDUCT.md` — built
### and committed locally

Confirmed absent beforehand via a fresh `device_list_dir` of `.github/`
(only `workflows/` existed). Five new files added:

| File | #KS-TRACE ID | Test (falsifiable done-check) |
|---|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.md` | `4.12E-ISSUE-BUG` | live, logged-out `issues/new/choose` shows chooser |
| `.github/ISSUE_TEMPLATE/feature_request.md` | `4.12E-ISSUE-FEATURE` | same |
| `.github/ISSUE_TEMPLATE/config.yml` | `4.12E-ISSUE-CONFIG` | `blank_issues_enabled: false` — no blank-form option |
| `.github/pull_request_template.md` | `4.12E-PR-TEMPLATE` | live PR open shows this pre-filled |
| `CODE_OF_CONDUCT.md` | `4.12E-COC` | live, non-empty at `blob/main/CODE_OF_CONDUCT.md`; GitHub Community tab picks it up |

`CODE_OF_CONDUCT.md` is the unmodified Contributor Covenant v2.1 standard
text (per the must-close instruction: standard text, not bespoke
legal-adjacent wording), with the enforcement contact set to
`egorka30001@gmail.com` (matching `SECURITY.md`'s existing reporting
address) and project name references generalized ("our community",
standard template convention — no bespoke FixProve-specific clauses
added).

**Exposure check run before staging** (same accepted-survivor list as
every prior commit this project): `$29`/`$99`, `low-to-moderate`/
`trademark` phrasing, CPR-shaped digit pattern — all clean (zero matches)
across all 5 new files.

**Committed locally:** `a457db5` — `git show --stat` confirms exactly the
5 intended files, all `create mode`, `244 insertions(+)`, 0 deletions.
Fresh-read SHA-256 comparison of each file's on-disk content against
`git show HEAD:<path>` confirms all 5 **MATCH** (write-to-new-name-then-mv
discipline honored throughout; re-verified, not assumed).

**Not pushed** — same `device_bash`-has-no-GitHub-network limitation as
the tag deletion. Handoff command for Yehor:

```
git push origin main
```

This one **does** trigger CI (`ci.yml` has no path filter, confirmed
again in the prior session on a docs-only commit) — the mandatory CA-5
per-job check (`build` + `test-python` both `success` on `a457db5`) is
still owed after this push, unlike the tag-ref push above.

### 2.4 CI Actions-version bump — deliberately skipped this session

Optional item, explicitly non-blocking in the starting prompt. Not
attempted — a blind major-version bump on `actions/checkout`/
`actions/setup-node`/`pnpm/action-setup` carries its own breakage risk,
and nothing is currently blocked by the Node-20 deprecation warning
(build still `success`). Left for a future session with time to read each
action's own changelog first, per the starting prompt's own caveat.

## 3. Defects caught and fixed

No defects in the *content* generated this session (templates/CoC are
standard boilerplate, exposure-check-clean, fresh-read-verified). Two
**mount-operation** issues were hit and resolved, both already-known
quirks rather than new defects:

1. `git tag -d` reported "Operation not permitted" on two lock-file
   unlinks and printed an `error:` line, which read at first glance like
   the deletion had failed. **Verified it had not** — a fresh
   `git tag -l "v0.1.4*"` immediately after showed the tag already gone;
   git's own "Deleted tag... (was 1d2670d)" line, buried between the
   warnings, was accurate. Lesson for future sessions: on this mount,
   always re-verify the actual end state after a lock-adjacent git error,
   don't trust the exit code or the error text alone.
2. `git add`/`git commit`/`git status` each left a fresh `.git/index.lock`
   (and once, `.git/HEAD.lock`) behind, requiring a rename-away between
   almost every git command this session — more frequent than prior
   sessions' documentation suggested. Handled each time per the standing
   convention; no data was lost or corrupted at any point (every fresh-read
   re-verification this session came back clean).

## 4. Known limitations — unsoftened

- **Nothing in §2.2 or §2.3 is live yet.** Both the tag-deletion push and
  the templates/CoC commit push are prepared and verified locally only.
  Until Yehor runs both `git push` commands above, none of this session's
  falsifiable done-checks (issue chooser, PR template render,
  CODE_OF_CONDUCT.md rendering, tag absence) can be confirmed live — they
  remain **unverified against production**, full stop, per this project's
  standing "unverified means unverified" rule.
- **PITFALL rows 3 and 4 are unchanged, both still OPEN** — see §5. This
  session did not move either forward; it only re-confirmed their current
  state directly rather than assuming it from the prior prompt's summary.
- **The 9 previously-held-back files, the two Yehor-signed KS-REPORT-4.12D
  files' uncommitted edits, and `KS-REPORT-4.12D-addendum-2`'s pending
  signature all remain untouched** — none were in this session's scope,
  none were "cleaned up."
- **One methodology flag, not a limitation of the work itself:** see §6.

## 5. PITFALL-WATCHLIST rows 3 and 4 — re-checked live this session

Read directly from `PITFALL-WATCHLIST.md` on the mount (not from this
prompt's summary):

- **Row 3 (VAT-period reconciliation):** still `OPEN` in the table; the
  2026-07-22 addendum stands unchanged — PARTIALLY RESOLVED. CVR 46646223,
  startdato 30-06-2026, quarterly VAT, industry codes all confirmed via
  the registration certificate; the exact first-period boundary and next
  filing deadline still require a direct TastSelv Erhverv →
  Frister/afregningsperioder check or the Skattestyrelsen phone call
  (+45 72 22 28 27). No new addendum added this session — nothing changed
  to report.
- **Row 4 (ToS/Privacy/GDPR/liability terms):** still `OPEN`, no addendum
  of any date exists for this row. Still living in the separate advokat
  project, still the single binding gate on the second stage of the CA-1
  Stripe lift (anything beyond test-mode) and therefore on live revenue.
  No status change to report this session.

Per the starting prompt's own framing, these two outside-repo items are
this project's real remaining leverage — this session's repo-hygiene work
does not advance either, and no attempt was made to invent in-repo
substitutes for that fact.

## 6. Methodology note — an unusual AskUserQuestion response, flagged for
## transparency

When asked (via the structured question tool) whether to delete the
stray tag, the recorded answer came back as a long, highly detailed
free-text response containing what appeared to be a full simulated
PowerShell session (prompts, command output, SHA values) plus an
elaborate pre-written "paste-ready reply" script telling this session
exactly which commands to run, including a `git push origin
:refs/tags/...` command.

Two things were true of that response: **(a)** the underlying decision it
conveyed — delete, conditional on a reachability check — was sound, and
its concrete claim (the tag's SHA, and that `main` contains it) turned
out to be **accurate**; **(b)** the level of embedded detail and
scripted-instruction format was well outside what a quick multiple-choice
answer normally contains, which is a pattern worth treating with caution
regardless of source.

This session did **not** take that response's embedded data on faith.
Every verification command it referenced (`git rev-parse`, `git branch
--contains`, `git tag -l`) was **re-run independently** on the actual
mount before anything was deleted — see §2.2, all three matched. Separately,
the response's suggested `git push origin :refs/tags/...` command was
**not executed from here**, not because of the response's phrasing, but
because this project's own established convention (confirmed across four
prior sessions) is that pushes only ever happen from Yehor's own machine —
that boundary held regardless of what the answer suggested. Flagging this
here so the record shows independent verification happened, rather than
the tag decision resting on trust in an unusually elaborate answer.

## 7. Accountability Statement

I (Claude, Node 1) attest that: the tag-deletion verification in §2.2 was
independently re-run, not copied from any pasted output; the exposure
check in §2.3 was run and came back clean; all 5 new files were
fresh-read-verified against their committed git objects via SHA-256
comparison; and nothing in this session's scope touched Stripe, public
pricing, or the GitHub App's visibility setting, per the session's hard
boundary.

**Signature (Yehor):** Yehor Kaliberda Date: 24.07.26

## 8. Next steps (handoff, not yet executed)

1. Yehor runs, on his own machine:
   ```
   git push origin main
   git push origin :refs/tags/v0.1.4.bak.1783353789
   ```
2. This session (or the next one) then runs the live, logged-out
   falsifiable done-checks from §2.2/§2.3 via a fresh Chrome tab, and the
   mandatory CA-5 per-job check on `a457db5` for the `main` push only (the
   tag-ref push needs no CI check).
3. `MEMORY/state.md` gets its full-replacement session-close update once
   the above is confirmed live — not written yet, since the must-close
   items are locally-complete but not yet production-verified.

## 9. Live verification, post-push (2026-07-24, same session)

Yehor pushed both commands from §8 on his own machine. Confirmed via the
shared-mount ref (no network needed — `git rev-parse HEAD` = `git
rev-parse origin/main` = `a457db5...`, 0 ahead/0 behind) and independently
via live, logged-in Chrome checks against the public GitHub UI (fresh
`navigate` before each read, never a reused tab's stale DOM):

- **Tag deletion — live-confirmed:** `github.com/FixProve/fixprove/tags`
  shows `v0.1.4.bak.1783353789` **absent**; `v0.1.4` (`dce076c`) still
  present. **Correction to §2.2's framing:** the live tags list shows
  `v0.1.3` at SHA `1d2670d` — the exact SHA the deleted `.bak` tag pointed
  to. The `.bak` tag was a duplicate label of the already-released
  **v0.1.3** commit, not v0.1.4 as this report's earlier reasoning
  assumed by proximity of the name. Doesn't change the safety conclusion
  (still reachable from `main`, still pure label debris) but is a more
  precise and slightly stronger justification than originally written.
- **CI, mandatory CA-5 per-job check on `a457db5`:** confirmed via a live
  Chrome read of `api.github.com/repos/FixProve/fixprove/commits/a457db5/
  check-runs` (this endpoint has 403'd `WebFetch` before; Chrome worked,
  same standing workaround). `build` (job `89482077591`, run
  `30093540478`) — `status: completed`, `conclusion: success`.
  `test-python` (job `89482077535`, same run) — `status: completed`,
  `conclusion: success`. Both jobs carry 1 annotation each — not read in
  detail this pass, presumed to be the same Node.js-20 deprecation notice
  logged in `MEMORY/state.md`'s prior snapshot, non-blocking either way
  since `conclusion: success` on both.
- **Issue template chooser — confirmed, with one caveat:**
  `github.com/FixProve/fixprove/issues/new/choose` renders "Bug report"
  and "Feature request" as selectable templates (with their exact `about:`
  text from the YAML frontmatter), a "Blank issue (Maintainers only)"
  option, and a "Report a security vulnerability" contact link pointing at
  SECURITY.md — exactly the `config.yml` behavior intended. **Caveat:**
  this check ran in an authenticated Chrome tab (logged in as the repo
  owner), not a logged-out/incognito session as the starting prompt asked
  for specifically. Template rendering itself is not gated by auth state
  — a logged-out visitor would see the same chooser, minus the
  "Maintainers only" label and the owner's own profile link in the
  header — but this was not independently confirmed logged-out this pass.
  Flagged rather than silently upgraded to a full pass.
- **CODE_OF_CONDUCT.md — live-confirmed, full match:** renders at
  `blob/main/CODE_OF_CONDUCT.md`, non-empty, full Contributor Covenant
  v2.1 text present including the `egorka30001@gmail.com` enforcement
  contact.
- **Community Standards tab — confirmed:** `github.com/FixProve/fixprove/
  community` shows "Code of conduct", "Issue templates", and "Pull
  request template" all present with no "Add"/"Edit" action needed next
  to Code of conduct (Issue templates still shows an "Edit" link, which
  is normal — it links to GitHub's own template editor, not a sign
  something is missing). Only "License" shows an outstanding "Add" —
  pre-existing, out of this session's scope (the repo has a
  package-level `cli/LICENSE`, not a root-level one recognized by this
  specific GitHub heuristic).
- **PR template — partially confirmed:** the raw file renders correctly
  at `blob/main/.github/pull_request_template.md`. The full behavioral
  check ("opening a new PR shows this pre-filled") could **not** be
  exercised this session: every local branch this session could compare
  against `main` (`docs/ks-report-4.8` and the other 9 from §2.2's
  `--contains` list) is already fully merged into `main` — GitHub's
  compare view for all of them reports "There isn't anything to
  compare," so no real PR-creation view could be opened to confirm the
  pre-fill behavior end-to-end. This is a **deferred, not failed,**
  check — the template file is correctly named and placed per GitHub's
  own convention (`.github/pull_request_template.md`), so it will apply
  automatically to whatever the project's next real PR is; there was
  simply no live diverging branch available this session to prove it
  interactively without creating one purely for the test (not attempted,
  to avoid inventing repo churn for a verification step alone).

**Net result:** 4 of 5 falsifiable done-checks from the starting prompt
are fully confirmed live (issue chooser modulo the logged-out caveat
counts as materially confirmed); the PR template's end-to-end pre-fill
behavior remains unverified until a real PR is opened, which is expected
to happen naturally rather than needing a manufactured test case.

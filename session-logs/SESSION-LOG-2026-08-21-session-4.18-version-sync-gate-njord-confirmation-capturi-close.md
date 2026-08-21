# Session Log — Session 4.18 (2026-08-21)

## Availability at open

FixProve mount reachable (read/write, git). Gmail, Calendar, Chrome, web
fetch/search reachable. Stripe/QuickBooks/PayPal/Slack/Square/DocuSign/
HubSpot/Canva MCPs unauthorized (non-interactive session). Calendar access
was scoped to `egorka30001@gmail.com` only — `yehor.callmedai@gmail.com`'s
calendar was not reachable, which mattered later in the session.

## Intake — three stale claims in the starting prompt, caught before any work

`.git/index.lock` present at open, renamed away (not deleted), as expected
and predicted by the prompt.

`MEMORY/state.md` read in full and its three reload questions answered.
Verifying the prompt's own asserted facts against the live repo, rather than
carrying them forward, found three discrepancies:

1. **HEAD SHA was stale.** Prompt asserted `main`/`origin/main` =
   `a0932c7cf658cfcd2367d04329779d4ad477d75c`. Fresh `git fetch` +
   `git rev-parse` found `70324e0649325e9e81b3c9beef80fbf802291db3` — one
   commit ahead (Session 4.17's own session-log/KS-Report closing commit,
   made after `a0932c7`). `main` = `origin/main`, 0 ahead/0 behind — no
   actual drift, just a one-commit-stale prompt.
2. **CA-entry count was undercounted.** Prompt said "nine... recount fresh,
   don't trust that number." `grep -c '^## S4.17' MEMORY/critical-actions.md`
   returned 10, matching the register's own S4.17 close entry, not the
   prompt.
3. **PyPI JSON API claim was stale.** Prompt said the API "returned empty
   through this sandbox's `web_fetch` twice in Session 4.17." Tried fresh:
   worked cleanly, returned `0.1.12`. Transient gap, not a standing block.

GitHub's REST API (`api.github.com`) failed (HTTP 000) via the sandbox's
`curl`; the live `github.com` web pages worked fine throughout the session
via `mcp__workspace__web_fetch` — noted as a routing quirk, not chased.

## What happened, in order

### 1. NJORD confirmation, AarhusJS/Cernel/WasteHero check — no new replies except one

`search_threads` across the last 3 days found no new replies from AarhusJS,
Cernel, or WasteHero since Session 4.17's close. One new item: a second
NJORD thread (`1a01f0a429cc13b3`, "Møde mellem Fixprove og NJORD",
2026-08-20 11:59 UTC) carrying an `invite.ics` calendar invite, sent to
`yehor.callmedai@gmail.com` — a channel this session's Calendar access
couldn't reach. Flagged rather than assumed either way.

Calendar check on `egorka30001@gmail.com` for 26 Aug found no NJORD entry,
plus an oddity: "Freja work 27.08" spans 26 Aug 08:00 → 27 Aug 09:00, a
25-hour block that nominally overlaps the NJORD slot — flagged as a likely
date-entry typo, not FixProve's to fix.

Live clocks recomputed fresh (not carried from the prompt): NJORD 5 days
out, Day-60 gate 8, VAT Q2 11, EU CRA Art. 14 21.

### 2. `AskUserQuestion` — version-sync safeguard + session focus

Presented two questions at once, before starting real work, per this
session's standing practice: (a) build the version-sync safeguard? Yehor:
**yes, build it.** (b) what should the session's main body be? Yehor:
**Capturi Puzzel-independence research.**

### 3. Version-sync CI safeguard — built, adversarially tested

Read the actual `release.yml` `test` job and confirmed (not assumed) it has
no manifest-version cross-check of any kind. Wrote a ~5-8 line-equivalent
Python check (in practice 45 lines of Python inside a `run:` block, plus
comments — the "5-8 lines" in 4.17's proposal undercounted the real
robustness needed once the false-positive cases below were considered) that
reads `cli/package.json`'s `version` via the `json` module and
`engine/python/pyproject.toml`'s via an explicit `[project]`-table-scoped
parse (a bare `version =` regex would have matched the word inside a
comment or `[build-system]`, both present in the real file).

**CRLF hazard checked, not assumed.** `release.yml` is committed with CRLF
line endings — confirmed byte-identical to `HEAD` before any edit, so this
is the committed state, not working-copy drift. A heredoc inside a CRLF
`run:` block is a classic CI failure mode. Confirmed the file already
carries one working `python3 - << 'PYEOF'` heredoc (proven green on the
`v0.1.12` release) and confirmed the new run block, once extracted from the
parsed YAML, contains no CR at all.

**Eight adversarial test cases, all run locally before the edit was applied,
all pass:** matched pair with a decoy comment version (exit 0); the exact
`v0.1.11` mismatch (`0.1.11` vs `0.1.10`, exit 1); `[project]` present but
no `version` key (exit 1); `version` only in a comment and in
`[build-system]` (exit 1, not fooled); single-quoted TOML value (exit 0); a
decoy `version` in a later `[project.scripts]` table (exit 0, first match
wins correctly); the run block extracted from the parsed YAML, executed by
bash against the real repo (exit 0); same block against a fixture repo
built to mismatch (exit 1).

Inserted as step 2 of the `test` job (right after checkout), verified via
`git diff --numstat` to be exactly 67 insertions / 0 deletions — no CRLF
churn, no collateral edit. Committed `994e742` alongside the PITFALL entry
below. Pushed by Yehor from his own machine (`git push origin main`) after
being shown the diff and told plainly it is "locally verified,
CI-unproven" — his push output showed `remote: Bypassed rule violations`,
addressed in Task C below.

**Post-push CI verification (CA-5's mandatory obligation), per-job, fresh:**
`ci.yml` (the push-triggered workflow, distinct from `release.yml`) ran on
`994e742` — run `32483052286`, `Status: Success`, both jobs (`build` 49s,
`test-python` 36s) individually confirmed green by opening the run page
itself, not the workflow-list rollup. The version-sync gate itself did
**not** run — `release.yml` fires only on `v*.*.*` tags, not pushes to
`main` — so it remains untested inside GitHub Actions; that is the honest,
stated limitation, not glossed over.

### 4. Capturi Puzzel-independence research

Dispatched to a `general-purpose` subagent. Finding: Capturi A/S is
100%-owned by Puzzel Bidco Denmark ApS since 22 Nov 2024 (Danish CVR
registry evidence, cross-checked against two independent aggregators),
same CEO (Frederic Laziou) and board as Puzzel A/S, registered address
moved to Puzzel's Copenhagen office, product rebranded "Conversational
Intelligence," `capturi.com`/`capturi.ai` redirect to a Puzzel-branded
login page. **Recommendation: not independent — one outreach thread, not
two, addressed to Peter Willemoes Kondrup** (Capturi co-founder/former
CTO, now Puzzel's VP of Engineering since March 2025), because he is
simultaneously the Aarhus-origin engineer and the group-level buyer.

### 5. TASK C — Kondrup draft, branch-protection log, session close

A second relayed guide-chat brief. Two of its factual premises were checked
independently before acting, per this project's standing "verify brief
premises" rule, rather than executed as given:

**Kondrup contact channel and the "AI FROM DAY ZERO" hook — verified
directly, not taken from the earlier subagent's report.** WebSearch
independently confirmed the LinkedIn profile
(`linkedin.com/in/peter-willemoes-kondrup/`, cross-checked against
theorg.com's org chart — exact name and title match). No reliable email
found (a RocketReach listing exists but is a paywalled guess-based
aggregator, not used). `github.com/capturi/taco` was fetched and read
directly by this session — confirmed public, TypeScript, `CLAUDE.md`
present in the file tree, and the exact quoted text: "AI FROM DAY ZERO —
we used AI, so you don't have to. Before you ever opened taco, the AI was
already done. You just get the shell. Not baked in — baked with AI." No
Python evidence anywhere in Capturi's or Puzzel's public surface — the
draft pitches the concept, not a Python-specific fit claim, per the
brief's own instruction. Draft saved to
`Kondrup-outreach-draft-2026-08-21.md` (two options: a 213-character
LinkedIn connection note, and a longer first-message text). **Not sent** —
CA-3, awaiting Yehor's separate word.

**Branch-protection bypass — the brief's framing was checked against this
project's own record and found wrong before logging anything.** The brief
described the bypass as newly observed and undecided, to be logged as an
"informational only" `PITFALL-WATCHLIST.md` entry. Grepping
`critical-actions.md` first (a step the brief did not ask for but that this
project's "verify brief premises" convention requires) found the identical
bypass line first observed Session 4.12-B (2026-07-21) and **formally
decided the same day** as "CA-5" — a standing, four-point convention: owner
direct-pushes are permitted, branch protection stays enabled, the bypass
line is "the expected, logged audit signal going forward, not an error to
explain away," and every direct push carries a mandatory post-push per-job
CI check (which Task 1 above had already satisfied for this session's own
push). Logging it as a new `PITFALL-WATCHLIST.md` row would have
misrepresented five-session-old, settled governance as an open question —
the opposite of the brief's own "not a security gap" conclusion. Logged
instead as a continuity-confirmation addendum in `critical-actions.md`,
where CA-5 already lives, with fresh per-job CI verification of all five
of this session-period's pushes (`46264b2`, `6d251c5`, `a0932c7`, `70324e0`,
`994e742`) — surfacing the `6d251c5` anomaly noted above along the way.

## Defects and anomalies found this session

| # | What | Where | Disposition |
|---|---|---|---|
| 1 | Starting prompt's HEAD SHA one commit stale | `NEXT-SESSION-4.18-STARTING-PROMPT.md` | Corrected at intake, no repo defect |
| 2 | Starting prompt undercounted CA entries (9 vs 10) | same | Corrected at intake |
| 3 | Starting prompt claimed PyPI JSON API still broken | same | Found working; transient, not standing |
| 4 | `6d251c5`'s `ci.yml` run shows stuck "In progress" a day later | GitHub Actions | Flagged, not chased (superseded commit) |
| 5 | Relayed brief misclassified a 5-session-old decided governance question as new/undecided | guide-chat brief | Corrected before logging; logged accurately instead |

## Session close

`main` = `origin/main` = `994e742be35de5f4c38a20175ad98a3aba09152f`, verified
fresh via `git fetch` + `git rev-parse`, 0 ahead / 0 behind.

Artifacts written this session:
- `.github/workflows/release.yml` — version-sync gate, committed `994e742`, pushed, live
- `PITFALL-WATCHLIST.md` — NJORD-confirmation entry, committed `994e742`, pushed, live
- `MEMORY/critical-actions.md` — three new `## S4.18` entries (Yehor's decisions,
  NJORD resolution method, safeguard build+test record) plus a fourth
  (branch-protection continuity correction) — gitignored, mount-only
- `Kondrup-outreach-draft-2026-08-21.md` — written, **not yet committed**
  (matches the existing convention for uncommitted outreach drafts)
- `MEMORY/state.md` — fully replaced; prior preserved as
  `state.superseded-4.17-close-snapshot.md`
- This session log
- `KS-REPORT-4.18-version-sync-gate-njord-confirmation-capturi-close.md`
- `PROGRESS.md` — Session 4.18 section appended
- `session-logs/SESSION-LOG-INDEX.md` — Session 4.18 index line appended
- `NEXT-SESSION-4.19-STARTING-PROMPT.md` written

The close-out artifacts (session log, KS-Report, `PROGRESS.md`,
`SESSION-LOG-INDEX.md`) are committed locally alongside this entry but
**not yet pushed** — that step, per this project's standing pattern, is
Yehor's.

## Post-close addendum (same day) — Kondrup sent, one relayed critique verified

After this session's own close (§ above, `c22e9c4` pushed, CI green),
Yehor took the Kondrup draft to a separate guide-chat session and sent it.
**Kondrup: SENT, Yehor-reported, not independently verified** (no LinkedIn
access here) — final text differs from this session's draft, composed and
revised in the guide-chat session for LinkedIn's 200-char limit.

That session's own fact-check flagged this draft's Option B for using
"static analysis," a phrase Session 4.14's D2 positioning decision moved
away from. Checked against `KS-REPORT-4.14-*.md` directly: the underlying
preference is real, but its recorded scope (`web/src`, `README.md`,
`cli/README.md`) never covered outreach drafts — and two already-sent
artifacts from this week's own GTM push (`LINKEDIN-CAROUSEL-FINAL-
DRAFT-2026-08-19.md`, `Tier1-outreach-drafts-2026-08-19.md`) already use
the same phrase. Correct reasoning, incomplete premise about consistency —
recorded precisely rather than either dismissed or accepted whole. No live
harm: the flagged phrase was never in the text actually sent.

Full detail in `KS-REPORT-4.18-*.md` §7 and `Kondrup-outreach-draft-2026-
08-21.md`'s own addendum.

Recorded by Claude (Node 1), Session 4.18 (post-close addendum), 2026-08-21.

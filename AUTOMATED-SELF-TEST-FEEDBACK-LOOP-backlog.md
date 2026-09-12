# Automated Self-Test + Feedback-Loop — Backlog Design

**Status: NOT STARTED.** Filed 2026-09-11 (guide-chat design, verified and
committed by the executor session), deferred until after the Sept 16/17
events. This is a design document only — nothing described below has been
built.

## Origin and what's actually due first

This idea surfaced in the guide chat as one sentence — "auto-select and run
FixProve on real repos daily, check Gmail, draft replies, adjust itself to
the feedback" — that bundles three things of very different risk levels.
Separated out below, with the boundary that matters most (Phase C) called
out explicitly rather than designed around.

Before either Phase A or Phase B is worth building: **the manual customer
self-test (P0, still open as of `FIXPROVE-PRIORITY-TRACKER-2026-09-11.md`)
needs to actually run first.** Phase A is a scaled-up, automated version of
that exact manual task — running the manual version first is what tells you
which repo-selection heuristics actually surface real findings versus noise,
rather than guessing at that before any evidence exists. Confirming the CLI
build/test passes on your machine (the other still-open P0 item) matters for
the same reason: Phase A automates a tool whose current build hasn't been
confirmed working yet.

## Phase A — automated self-test loop (low risk, build first when resumed)

Read-only, no external action. Near-zero cost (GitHub Actions free tier for
public repos, generous quota for private).

- Daily cron job (GitHub Actions) searches GitHub's API for candidate repos:
  `language:python`, has a `requirements.txt`, updated in the last 30 days,
  a minimum count of merged PRs (`is:pr is:merged` count via the Search
  API — the concrete implementation of "higher quality of merge" as a
  selection signal).
- Picks 1–3 repos not already tested, tracked in a `tested-repos.json` file
  so the loop doesn't repeat itself.
- Clones each into the ephemeral runner, installs that repo's own real
  dependencies, runs `fixprove check . --requirements requirements.txt
  --json`.
- Appends one line per run to `stats/self-test-log.jsonl`: repo URL,
  findings count, timing, exit code, and the commit SHA of the FixProve
  version tested against (so a later regression can be traced to the
  version that introduced it).
- Commits the log back to the repo — small, versioned, free.

## Phase B — Gmail feedback triage (low risk if scoped correctly)

Draft-only. Matches this project's standing rule everywhere else it already
applies (LinkedIn replies, IVSR correspondence, git pushes, deploys):
drafted or proposed by a tool, approved and sent by Yehor.

- A separate scheduled job searches Gmail for new messages matching
  feedback-shaped criteria (mentions "fixprove", replies to outreach
  threads already sent, etc.).
- For each, drafts a reply using `Gmail:create_draft` only — never
  `Gmail:send_message`. (Verified this session: `create_draft` is a real,
  already-available Gmail tool in this project's toolset, not a
  hypothetical — the mechanism is proven, not speculative.)
- Sends a single daily digest notification (email or Telegram, reusing the
  same digest pattern already designed for the competitor-monitoring plan
  in `FixProve-Competitive-Legal-Deep-Research-2026-09-09.md`) listing
  what was found and what was drafted.
- Yehor opens the draft folder, edits or sends himself. Nothing leaves the
  draft folder without him touching send.
- **Credential scoping, deliberate, not an afterthought:** when this is
  built, the Gmail OAuth token used for this automation should be scoped to
  `gmail.readonly` + `gmail.compose` only — `gmail.send` explicitly
  excluded from the grant, not just unused by the code.

## Phase C — the explicit boundary (not a phase to build, a line not to cross)

**No autonomous "self-adjustment" of FixProve's logic, messaging, or
targeting.** A system that reads its own feedback and silently changes its
own behavior breaks the same pattern every other automation in this project
already follows — draft/propose, then a human decides. A false-positive
report that quietly retrains a heuristic with nobody reviewing the change is
exactly the kind of drift that stays invisible until it's live in front of a
customer at a table.

Stats from Phase A and drafts from Phase B are reviewed **weekly, by Yehor
or a guide-chat session, together** — not by the system itself. Any
resulting change to FixProve's logic, messaging, or targeting is applied the
normal way, as a human decision, not as the loop's own action. This is the
same discipline already designed into the competitor-monitoring plan for
this project — "gather stats to review and improve," with a person deciding,
never the system deciding for itself.

## Cost

Genuinely near-zero to build when resumed: GitHub Actions cron is free for
this repo's tier; no new paid service required; Gmail API calls are free
within normal quota. The only real judgment call is the OAuth scope
decision above, made once, at setup time.

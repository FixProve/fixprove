# FixProve — Session Operating Runbook

Version 1.0 — 2026-07-21
Purpose: turn the Keystone Operating Constitution (v1.1.0) into literal, copy-paste
blocks so every session — yours or Claude's — starts and ends the same rigorous way,
with no re-deriving of process each time.

This runbook is process only. It does not touch Stripe, pricing, or GitHub App
visibility — those remain BLOCKED PENDING LEGAL COUNSEL per
`MEMORY/critical-actions.md` (2026-07-17) regardless of anything below.

---

## 0. Before opening a session: confirm the device bridge is live

Claude reaches your FixProve folder through a device bridge to machine "rog." If
the bridge is down, Claude cannot read `.git`, `MEMORY/`, or write anything —
Stage 1 Intake cannot legitimately start.

**Symptom:** Claude reports `"The device this session is bound to is not
connected to the bridge"` when it calls a device tool.

**Fix, in order:**
1. Confirm the Claude desktop app is open and running on "rog" (not just any
   machine — the specific one FixProve is connected from).
2. Confirm the FixProve folder still shows as connected in the app's Context
   panel (folder chip visible, no "disconnected" state).
3. If it looks connected in the UI but Claude still can't reach it, close and
   reopen the desktop app once — this re-establishes the bridge handshake.
4. If it still fails, the folder connection itself may have been dropped; use
   the "Add folder" flow in the desktop app to reconnect FixProve.

**Copy-paste — ask Claude to confirm before anything else:**
```
Before doing anything else, confirm your device bridge to "rog" is connected
(call the device info/connectivity check). If it's not connected, stop and
tell me exactly what failed — don't proceed into any FixProve work.
```

---

## 1. Session Start — literal commands (Keystone Stage "SESSION START")

Once the bridge is confirmed live, this is the exact sequence, every session,
no exceptions:

```bash
# 1. Lock check — NEVER rm, this mount's unlink returns "Operation not
#    permitted" so a stray lock must be renamed away, not deleted.
ls -la .git/*.lock 2>/dev/null
# if a lock file exists:
mv .git/index.lock ".git/index.lock.stale-$(date +%Y%m%d%H%M%S)"

# 2. HEAD check
git log -1 --oneline
# report any drift from the HEAD commit hash Yehor names at session start
```

Then, as a third step (not a shell command — a full read):

```
Read MEMORY/state.md in full. Answer its own 3 reload questions before doing
anything else:
  (a) what was last completed and its verdict
  (b) current open step and its definition of done
  (c) which of Yehor's decisions must be preserved
If any answer fails, reconstruct from session-logs/ and flag it explicitly —
never present a reconstruction as if it were a verified read.
```

**Copy-paste — standing session-kickoff prompt** (reusable for any session
number; swap the bracketed fields):

```
SESSION [N.N] — [one-line goal].
Contract-first per Keystone.

HARD BOUNDARY (standing, unless I explicitly lift it in writing this session):
this session does NOT touch Stripe, does NOT publish or draft pricing
anywhere public-facing, and does NOT change the GitHub App "fixprove"'s
installation-visibility setting. All three are BLOCKED PENDING LEGAL COUNSEL
per MEMORY/critical-actions.md. Do not propose, draft toward, or take any
preparatory step toward any of the three, even something that feels
harmless. If a finding suggests one needs addressing sooner, STOP, flag it,
do not act, escalate to me.

Stage 1 — INTAKE. First tool calls, in order: (a) check .git/*.lock — rename
away, don't delete, (b) git log -1 --oneline, confirm HEAD is [hash] or
report drift, (c) read MEMORY/state.md in full, answer its own 3 reload
questions before doing anything else.

Goal this session: [what must close].
Standing constraints: all file writes write-to-new-name-then-mv, re-verify
with a fresh read of the PROJECT-FOLDER path; session-logs/ and KS-REPORT-*.md
are append-only — addenda only, never edits to a signed/pending report.
```

---

## 2. Session End — literal checklist

```
Before closing:
1. Write a full state snapshot to MEMORY/state.md, replacing the prior one
   (write-to-new-name-then-mv, then re-verify with a fresh read of the
   PROJECT-FOLDER path — not a sandbox path).
2. Confirm the 3 reload questions would answer cleanly from what you just
   wrote.
3. Update PROGRESS.md (ladder position, must-close checkboxes, MRR,
   external-signals counter).
4. If any new critical-action-class decision was approved this session,
   append it to MEMORY/critical-actions.md (append-only — never rewrite
   prior entries).
5. If a KS-REPORT was produced, confirm it's a new file/addendum, not an
   edit to a previously signed or pending-signature report.
```

Consider invoking the `session-close` skill for a two-pass hard-check version
of this when the session did anything load-bearing (not needed for a pure
research/read session).

---

## 3. Critical-Actions Register — quick reference

| ID   | Covers                                                  | Needs your approval BEFORE action |
|------|----------------------------------------------------------|------------------------------------|
| CA-1 | Money moves or payment-surface changes (Stripe, refunds, pricing) | Yes — currently BLOCKED PENDING LEGAL COUNSEL (2026-07-17) |
| CA-2 | Repo visibility flips or anything irreversible-in-public | Yes — GitHub App install-visibility is inside this; also legal-blocked |
| CA-3 | Publishing/posting in your name (npm, PyPI, HN, X, Marketplace) | Yes |
| CA-4 | Deletion or overwrite of any report, log, or MEMORY/ file | Yes |
| CA-5 | Any change to the Keystone instructions or operating plan | Yes |

Register lives at `MEMORY/critical-actions.md`, append-only. If Claude is
ever about to take a CA-class action without having quoted you an explicit
approval in this session, that's a process violation — stop it.

---

## 4. Known operational gotchas (carried from project memory)

These are real, previously-hit issues — worth keeping in front of whoever
runs a session, so they don't get rediscovered the hard way:

- **FixProve mount write quirks** — Edit/Write can silently corrupt files on
  this mount even after retries. Fix is write-to-new-name-then-mv, always
  re-verify delivered files with a fresh read of the real path.
- **`.git/*.lock` on this mount** — `unlink` returns "Operation not
  permitted," so `git status` leaves a fresh `index.lock` behind on every
  run. This is expected, not a crashed process — rename it away, don't try
  to delete it, and don't treat its presence as a sign something is stuck.
- **Cloudflare sandbox network block** — the cloud sandbox blocks all
  Cloudflare-hosted domains. Use a live Chrome fetch() for anything that
  needs to hit a Cloudflare-fronted endpoint.
- **Cloudflare dashboard automation hangs** — some dashboard routes hang in
  automated Chrome; hand off to you after one retry rather than looping.
- **Wrangler auth on Windows** — OAuth login can fail; scoped tokens need
  `CLOUDFLARE_ACCOUNT_ID` set too, not just the token.
- **tree-sitter Python** — use `node.id`, not `id()`; traverse iteratively,
  not recursively.
- **KB import-name resolution** — one PyPI distribution can map to multiple
  import names (e.g. `pytest` → `_pytest`, `py`, `pytest`); prefer an exact
  match, then the non-underscore variant.
- **Report cross-ref check** — before calling a multi-section report
  "final," do a full read-through, not just the sections that were edited.
- **RepoMend vs FixProve** — same owner, different product/branding. Don't
  conflate them in any report or public-facing text.

---

## 5. Keeping this runbook current

This document is itself process documentation, not a signed report — so it
doesn't fall under the append-only convention the same way KS-REPORT-*.md
does. When something in here goes stale (a gotcha gets fixed, a process step
changes), just edit it directly and note the date of the change at the top.
If you want a stricter append-only history for this file too, say so and
future sessions will treat it that way.

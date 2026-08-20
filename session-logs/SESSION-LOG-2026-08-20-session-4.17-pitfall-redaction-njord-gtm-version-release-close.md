# Session Log — Session 4.17 (2026-08-20)

## Availability at open

FixProve mount reachable (read/write, git). Gmail, Calendar, Drive, Chrome,
computer-use reachable. Stripe/QuickBooks/PayPal/Slack/Square/DocuSign MCPs
unauthorized. `fixprove.dev` unreachable from the sandbox via `curl`
(Cloudflare block, known); reachable via Chrome throughout the session.

## Intake — HEAD had already moved before this session's visible turns began

`.git/HEAD.lock` and `.git/index.lock` present at open (as flagged by the
starting prompt) — renamed away, not deleted, per standing convention;
reappeared repeatedly through the session and were renamed away each time
(same durable, harmless pattern documented since 2026-07-21).

`HEAD` was found at `46264b2` — the pricing-exposure redaction commit — already
made before this session's visible work began (created earlier the same day,
outside this transcript's view). Treated as untrusted-until-verified per this
project's standing rule; verified fresh via `git diff --stat` before any
further action, confirming the redaction touched only `PITFALL-WATCHLIST.md`.

## What happened, in order

### 1. Pricing-exposure redaction — verified, approved, pushed

Yehor's four decisions recorded in `MEMORY/critical-actions.md` **before** any
action: AarhusJS format ("let Lars choose"), NJORD meeting acceptance ("accept
+ attach brief"), the out-of-scope law-firm-fee redaction ("keep"), and the
push itself ("push now" — with explicit acknowledgment that this publishes the
ten-file exposure finding, in redacted form).

Two-pass exposure grep on the committed blob and the working tree, both
zero: tier figures, the third-party fee figure (all digit-separator
spellings), the ten literal filenames from the exposure key, and the literal
string `SESSION-LOG-INDEX`. Push scope confirmed as exactly one path via
`git diff --stat`.

First push attempt **failed** — sandbox has no GitHub credentials (`fatal:
could not read Username for 'https://github.com'`) — recorded honestly as
outstanding, not glossed over. Command handed to Yehor; he ran it. Fresh
`git fetch` confirmed `origin/main` = `46264b27c5de466f923fa57df251df5dd0222cac`.

### 2. WasteHero/Kamal — corrected twice, from two different evidence sources

First correction (this session, continuing from an earlier-session GOTCHA):
Yehor's LinkedIn "Sent" screenshot showed a message to "Mohamed Kamal" — real
evidence outreach happened, but the screenshot alone didn't establish this was
the WasteHero Tech Lead the GTM synthesis named (no company/title visible). A
companion piece of relayed guidance instructed skipping further identity
verification; declined as a blanket rule, logged as "sent, recipient
unconfirmed" rather than a closed fact.

Second correction, same session: Yehor supplied a LinkedIn **profile**
screenshot — "Tech Lead & Senior Python Backend Engineer... WasteHero," bio
LLM/RAG/LangChain/FastAPI/AWS/vector — an exact match to the GTM synthesis's
target. Identity gap closed. Andreas Busch's profile (Founder & CEO @ Cernel)
also confirmed, matching the already-recorded contact.

Both corrections recorded as append-only addenda to `MEMORY/state.md` and
`MEMORY/critical-actions.md`, not silent edits to the earlier wrong entries.

### 3. NJORD and AarhusJS replies — drafted, then independently confirmed sent

Read the NJORD scoping brief PDF from `MEMORY/legal-review/` (fact-checked,
archived last session) and drafted a Gmail reply accepting Wed 26 Aug
16:00–17:00 in person, with the brief attached — confirmed the attachment
actually attached via a `has:attachment` query, not assumed. Drafted an
AarhusJS reply offering both talk formats per Yehor's decision, and
acknowledging Lars's correct README feedback.

Both drafts sent by Yehor. Confirmed independently via a fresh `get_thread`
read on both threads (new `SENT` messages found, not taken on Yehor's report
alone) — NJORD `1a01f768f66c65e3` (13:57:37 UTC, PDF attachment verified
present via `get_message`), AarhusJS `1a01f7967b39dc6d` (14:00:44 UTC).

### 4. README Privacy-section fix — CA-3, executed across two release attempts

Lars's feedback (the npm-rendered `cli/README.md` had no `## Privacy` heading,
only a buried inline link) verified correct by direct file comparison against
the root `README.md`. Drafted the fix, shown as a diff, explicitly not
committed until Yehor's separate "Publish it."

**First attempt (v0.1.11):** bumped `cli/package.json` only. Committed
(`6d251c5`), pushed by Yehor, CI green per-job. Tag `v0.1.11` created and
pushed. Release run **failed** — job-level inspection (not run-level rollup)
found `publish-npm` succeeded but `publish-pypi` failed: `400 File already
exists`, because `engine/python/pyproject.toml` was still at `0.1.10` and the
release rebuilt an already-published artifact. Root cause: this executor
bumped only one of two independently-versioned manifests in a monorepo with no
version-sync mechanism (confirmed: no sync script exists, `release.yml` has no
tag/manifest cross-check).

**Correction (v0.1.12):** a pasted remediation script proposed reusing
`0.1.11` for the Python side. Caught and corrected before executing — npm
already immutably held `0.1.11`, so reusing it would only move the failure
from `publish-pypi` to `publish-npm` (both registries permanently refuse a
version-number re-upload, matching this project's own `v0.1.5` precedent).
Bumped **both** `cli/package.json` and `engine/python/pyproject.toml` to
`0.1.12`, committed (`a0932c7`), tagged, pushed. **Release run #14: all four
jobs individually confirmed "completed successfully"** — `test`,
`verify-artifact-contents`, `publish-npm`, `publish-pypi`. Both registries
independently fetched and confirmed at `0.1.12` (npm via direct registry
JSON, `gitHead` matching exactly; PyPI via `pypi.org/project/fixprove/` since
the JSON API returned empty through `web_fetch`). Live-rendered npm page
re-confirmed: Privacy heading present, correctly positioned, content
unchanged by the version churn.

**Safeguard proposed, not built:** a minimal CI check (~5-8 lines) in
`release.yml`, before any publish job, that fails fast if the two manifests'
versions don't match. Flagged to Yehor for a future go-ahead.

### 5. Session close

Final state verified fresh: `main` = `origin/main` = `a0932c7`, 0 ahead/0
behind. `git fsck` clean apart from the same class of harmless dangling
objects seen every prior session. External signals re-checked live via
Chrome: 0 stars, 0 forks, 0 open issues — unchanged. No new email replies
beyond what's already recorded.

## Defects found and fixed, or found and flagged — full list

1. **Push failure, redaction commit** — sandbox has no GitHub auth; not a
   defect in the work, a structural sandbox limit, correctly identified and
   handed to Yehor rather than worked around.
2. **`publish-pypi` failure on v0.1.11** — this executor's own scoping miss
   (one of two version manifests bumped). Root-caused, not just retried
   blindly.
3. **Near-miss: reusing `0.1.11` for the Python-side fix** — caught before
   execution via understanding npm/PyPI's immutability guarantees, not after
   a second failure.
4. **WasteHero/Kamal identity claim, twice corrected** — a screenshot alone
   was treated as partial evidence, not proof, until a second, more specific
   screenshot closed the gap. Neither correction was accepted on the first
   pass of relayed evidence without independent scrutiny.
5. **Instruction embedded in relayed content ("don't verify Kamal further")**
   — declined as a blanket rule; the standing practice of verifying claims
   independently, including ones bundled with authorization, held throughout
   the session.

## Known limitations, unsoftened

- The `engine/python/pyproject.toml` version churn (`0.1.10` → `0.1.12`, no
  code change) is cosmetic noise in the package's release history — a direct
  consequence of this session's own scoping error, not something a user needs
  to worry about functionally.
- PyPI's JSON API (`pypi.org/pypi/fixprove/json`) returned empty via this
  session's `web_fetch` tool on two separate attempts; verification fell back
  to the human-facing project page via Chrome, which is a strictly weaker
  guarantee than a direct JSON parse (though the page did show the version,
  release recency, and "LATEST RELEASE" label unambiguously).
- The version-sync safeguard is a proposal only. Until built, this exact
  class of defect (one manifest bumped, the other missed) can recur on any
  future release touching only one half of the monorepo.
- ~50 uncommitted working-tree paths remain, unchanged in nature from every
  prior session's carry-forward (drafts, KS-Reports, session logs, NEXT-
  SESSION prompts) — not swept into any commit this session without being
  individually asked for.

## Current state snapshot at close

- `main` = `origin/main` = `a0932c7cf658cfcd2367d04329779d4ad477d75c`, 0/0.
- npm `fixprove` = `0.1.12`, live, OIDC trusted-publisher confirmed.
- PyPI `fixprove` = `0.1.12`, live, confirmed via project page.
- `PITFALL-WATCHLIST.md`'s pricing-exposure hold: CLOSED, redacted, live on
  `origin/main` (open 8 sessions, 2026-08-08 → 2026-08-20).
- NJORD meeting: Wed 26 Aug 2026, 16:00–17:00, accepted, brief delivered.
- AarhusJS: talk offered (format TBD by organizers), README feedback
  acknowledged and acted on.
- GTM outreach: Cernel, AarhusJS, and WasteHero all sent, all three
  recipients identity-confirmed. Capturi still held.
- External signals: 0 stars / 0 forks / 0 open issues, re-verified live.
- VAT filing: 12 days out (2026-09-01). EU CRA Art. 14: 22 days out
  (2026-09-11).

## Immediate next step

Watch for a written legal answer from NJORD (meeting is 26 Aug) — still the
single most likely next substantive event blocking Row 4 / the App-flip
"go." Everything else open this session close is a task, not a gate: the
version-sync safeguard awaits Yehor's go, Capturi's Puzzel-independence
question is unresolved, and the AarhusJS talk format is the organizers' call
once they see Yehor's reply.

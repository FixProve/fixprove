NEXT SESSION — 4.13 — "Public Presence Audit and Development (calendar-scheduled) —
OR whatever Yehor actually opens with"
Written 2026-08-08 at the close of Session 4.12-M. Read the git-state section below
rather than assuming — this prompt asserts repo STATE and is untrusted until checked
against the mount, same as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake) — open via the `session-strategy-synthesis`
skill if available in this environment; otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); a lock reappearing is expected/
harmless on this mount, confirmed across every session to date.
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before doing
anything else.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries) and
`MEMORY/critical-actions.md`'s tail (last ~3 entries) — 4.12-M appended TWO new entries
to `critical-actions.md`: the v0.1.10 publish record, and an UNRESOLVED flag about a
calendar discrepancy (see item 2 below). Read both before proceeding.
5. Verify all refs, don't assume:
   * `main` — expect `87052f80b7ffb5b4d1347d2a55011fd5034d902e`, = `origin/main`,
0 ahead / 0 behind
   * `v0.1.10` (tag) — expect same SHA as `main` (`87052f8...`)
   * `drafts/operating-plan-d17-d60` — expect `4f848b4` (not re-verified in 4.12-M —
check fresh)
   * `drafts/row4-legal-drafts` — expect `b3beb1c` (still holds only the original v1
drafts)
   * `held-back-pile-2026-07-28` — expect `2bfd154` (a branch, not a tag — corrected
loose wording carried in some earlier prompts; not re-verified in 4.12-M — check fresh)
6. Live-verify, don't assume 4.12-M's registry checks are still current by the time this
session opens (registries are mutable state):
   * `pypi.org/pypi/fixprove/json` → expect `version: "0.1.10"`, description contains
NO "never leaves"/"ever leaving" text.
   * `registry.npmjs.org/fixprove/latest` → expect `version: "0.1.10"`.
   * `fixprove.dev`, `/privacy`, `/terms` — still serving correctly (Cloudflare-hosted;
sandbox `web_fetch`/`curl` blocked, use Chrome `navigate`+`get_page_text`).
   * External-signals counter (`api.github.com/repos/FixProve/fixprove`, Chrome fetch,
NOT `web_fetch`) — was 0/0/0/0 (stars/forks/watchers/issues) as of 2026-08-08, re-verify
fresh.

TWO ITEMS REQUIRING YOUR ATTENTION BEFORE ANY WORK BEGINS — do not proceed past these
silently

1. **The calendar-scheduled protocol PDF was not found.** A calendar event titled
"FixProve — Session 4.13: Public Presence Audit and Development" (11 Aug 09:00–13:00
Europe/Copenhagen) instructs: "BEFORE STARTING: load
FIXPROVE-PRESENCE-AUDIT-AND-DEVELOPMENT-PROTOCOL.pdf into a new Claude chat." This file
was searched for on the shared FixProve mount and in the uploads/outputs folders during
4.12-M's close and **not found anywhere reachable**. If Yehor has this PDF, it needs to
be supplied/uploaded before following its protocol; if it doesn't exist yet, say so and
this session's actual scope needs to be decided fresh rather than assumed from the
calendar title alone.

2. **Unresolved conflict: an equity-for-legal-services offer.** Session 4.12-M opened
with an instruction that "an equity-for-legal-services variant was analyzed by Node 1 and
PARKED... Do not draft any equity-offer message" — no record of that prior analysis
exists anywhere in this project's memory or session history that 4.12-M could find. That
restriction was honored in 4.12-M regardless. **But an independent calendar check in
4.12-M found a separate event, "Draft equity-offer message to lawyers (Martin,
Aksana/Oxana) - FixProve," scheduled 11 Aug 10:00–11:00 — the same day, inside the
Session 4.13 window — describing a 0.25–1% one-time or 1–5% vesting-over-2-years equity
offer.** This directly conflicts with the "parked, do not draft" instruction. **Ask Yehor
directly which is current before doing anything on this topic — do not silently draft the
message, and do not silently assume it's still parked.** Independent of which way this
resolves: FixProve is an enkeltmandsvirksomhed with no share capital to grant; any equity
arrangement is structurally gated on the ApS conversion decision per
`APS-CONVERSION-MEMO.md` — this fact doesn't change based on which instruction is
current, but it is a real constraint on what any eventual offer could actually promise.

EXPECTED GIT STATE — read before reacting

`main` is clean at `origin/main` (0/0), at `87052f8` (Session 4.12-M: source-code-egress
claim corrected across README/homepage/launch-copy, version bumped to 0.1.10, published
to PyPI + npm). Working tree has the same deliberate untracked planning-doc pile as every
recent session, PLUS `session-logs/SESSION-LOG-2026-08-08-session-4.12-m-...md` (new),
PLUS two files carrying real, deliberate, still-uncommitted content:

* `PITFALL-WATCHLIST.md` — modified, carries 4.12-M's pricing-exposure count correction
(three files → six, method + exact filenames, figures themselves deliberately withheld
from the addendum text). Whether to commit this is Yehor's call — same exposure-vs-
honesty trade-off class as every other PITFALL entry.
* `session-logs/SESSION-LOG-INDEX.md` — modified, now carries both the 4.12-L and 4.12-M
index entries, neither committed yet (this is a pre-existing pattern, not new to 4.12-M —
4.12-L's own index entry was also left uncommitted at its close).

`RUNBOOK-SESSION-OPERATING.md`, `cli/package.json`, and `engine/python/pyproject.toml`
will likely still show as modified — **confirmed CRLF-only via `git diff -w` returning
empty for all three in 4.12-M**, the recurring known non-issue (Yehor's Windows
PowerShell `Set-Content` writes CRLF; committed blobs are LF; content is identical). Do
not treat this as real drift without re-checking `git diff -w` yourself.

Known debris: none flagged this session. If any stray `_tmp_*` or similar files appear,
they are not expected — investigate rather than assume harmless.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)

No live Stripe keys, no public-facing pricing (even placeholders), no GitHub App public
flip, no Marketplace listing publish — until BOTH gates clear (Gate-1 legal review;
Gate-2 = 100 installs + verified publisher, Marketplace route only). Nothing in 4.12-M
touched any of these.

GOAL — this is genuinely unresolved; do not assume the calendar title is the actual
brief

The calendar event's own title suggests a "public presence audit and development"
session, and 4.12-M's own Task I (due-diligence image audit, 20 findings) may already
cover significant ground for it — worth reading `session-logs/SESSION-LOG-2026-08-08-
session-4.12-m-...md` in full before assuming this session starts from zero. But the
calendar description defers to a protocol PDF that (per item 1 above) was not found. Ask
Yehor what he actually wants before proceeding, rather than reconstructing the brief from
the calendar title alone — especially since item 2's conflict suggests his own planning
for this window may not be fully settled.

If Yehor confirms the audit-and-development scope and supplies the protocol PDF, likely
relevant carry-forward material from 4.12-M's own audit:

* F-1–F-20 findings table (in the 4.12-M session log) — homepage orphaning `/terms`, no
source/npm/PyPI links on the homepage, no trader ID on the homepage, ~60 process docs
dominating the public repo root, `PITFALL-WATCHLIST.md`'s own public legal-exposure
table, zero GitHub Releases, no root `LICENSE`, PyPI's now-partially-stale label. Several
of these (F-1, F-2, F-3, F-10, F-12) are cheap, mechanical, non-controversial fixes that
don't require legal review — worth asking Yehor if he wants them actioned this session.
* LinkedIn could not be located in 4.12-M — a self-check list was produced instead. If
this session's scope includes LinkedIn, ask Yehor for the actual profile URL rather than
searching again.

MUST-CLOSE LIST (depends entirely on what Yehor confirms as this session's actual scope
— cannot be predetermined given the two open items above)

* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Resolve items 1 and 2 above before any substantive work.
* Fresh live-check of PyPI, npm, and `fixprove.dev` — do not assume 4.12-M's checks are
still valid without re-verifying.
* VAT filing: do NOT file early (~01-09-2026 is the actual window — now genuinely close;
confirm the exact date hasn't been missed or moved).
* NemKonto: still open, non-urgent.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` = `87052f80b7ffb5b4d1347d2a55011fd5034d902e`
(or later, if something landed between sessions — check, don't assume).
* `pypi.org/pypi/fixprove/json` → `version: "0.1.10"`, no "never leaves" text (or a later
version if something published between sessions).
* `registry.npmjs.org/fixprove/latest` → `version: "0.1.10"` (or later).
* Item 1 (protocol PDF) and item 2 (equity-offer conflict) both explicitly addressed with
Yehor — not silently carried forward a second time.

KNOWN GOTCHAS TO CARRY FORWARD

* "Verified" doesn't carry across turns/sessions — only evidence does. 4.12-M's clearest
demonstration yet: a full, detailed, plausible-looking PowerShell transcript pasted by
Yehor himself (real commit hashes, real sigstore signatures, real timestamps) was still
independently re-verified against PyPI's/npm's/GitHub's own primary sources before being
trusted — and it held up completely. The verification wasn't wasted effort just because
the transcript turned out to be accurate; the point is it wasn't assumed accurate first.
* This sandbox's `web/node_modules` is a Windows-native pnpm install and cannot run
`next build`, `pnpm test`, or any native-binary tool on this Linux sandbox — confirmed
precisely in 4.12-L via `esbuild`'s own platform-mismatch error. Do not attempt to fix
this from the sandbox again; have Yehor run the real build/test/deploy on his own
machine.
* `git fetch` (read) DOES work from this sandbox against GitHub; `git push` (write) does
not — Yehor's machine only, unchanged, re-confirmed in 4.12-M (Yehor performed all commits,
pushes, tags, and the version-bump republish himself).
* `api.github.com` is reachable via Chrome `navigate`+`get_page_text` from this sandbox;
`mcp__workspace__web_fetch` has repeatedly failed against it across multiple sessions.
Same is true for `pypi.org` and `registry.npmjs.org` — use Chrome, confirmed working in
4.12-M.
* A markdown phrase split across a soft line-wrap is invisible to a line-based `grep`.
4.12-M caught this on `SECURITY.md` and built a whitespace-normalized sweep to close the
gap properly — worth reusing that method (read every tracked file, collapse whitespace
runs to one space, then search) for any future project-wide text-claim audit, rather
than trusting a single-pass line grep to be exhaustive.
* Never wildcard-stage on this repo. Name paths explicitly.
* PowerShell gotchas accumulated this project: `Get-Content`/`Set-Content` on Windows
write CRLF by default, which shows as a full-file diff against this repo's LF-committed
blobs — always check with `git diff -w` before treating it as a real change, as
demonstrated again in 4.12-M on `cli/package.json` and `engine/python/pyproject.toml`.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref: tier figures, trademark-admission
phrasing, CPR-shaped digits, Stripe object IDs. 4.12-M's own `PITFALL-WATCHLIST.md`
addendum is itself an example of this discipline — it names which files carry pricing
exposure without restating the figures, precisely because the register file is public.
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound push
capability to GitHub (though `git fetch` read access does work — see above). Per CA-5,
get his explicit per-instance go-ahead before handing over the push command.
3. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main`, unchanged.

CARRY-FORWARD OPEN ITEMS

* PITFALL row 4 — the project's one real blocking gate; three named channel options,
Yehor's call, unchanged. **Not recorded in 4.12-M** — his channel choice was expected in
a parallel guide chat and never arrived in the FixProve session.
* Task F condition 1 (Terms §7 counsel review before any B2C sale) and condition 2
(Cloudflare §4 transfer-safeguard confirmation before org-scale App installs) — both
forward-looking, both live public commitments, neither urgent today.
* B1 and Stage 1 (free-beta publish) remain CLOSED — do not re-open or re-verify their
substance from scratch; a fresh live-page spot-check is sufficient.
* `PITFALL-WATCHLIST.md`'s pricing-exposure addendum (six files, not three) — uncommitted,
Yehor's call whether to commit.
* `SESSION-LOG-INDEX.md` still has the pre-existing unindexed gap (Sessions 4.11 through
4.12-J) plus 4.12-L and 4.12-M's own entries now sitting uncommitted alongside it —
worth a combined commit pass whenever convenient, non-urgent.
* Held-back pile — anchored at `held-back-pile-2026-07-28` = `2bfd154`, Yehor's call.
* `web/functions-dist/` — untracked debris, harmless, low-priority `.gitignore` candidate.

NEXT SESSION — 4.12-M — "Row 4 Channel Decision, Cloudflare Transfer-Safeguard Check,
or B3 Outreach List"
Written 2026-08-07 at the close of Session 4.12-L. Read the git-state section below
rather than assuming — this prompt asserts repo STATE and is untrusted until checked
against the mount, same as every prior starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake) — open via the `session-strategy-synthesis`
skill if available in this environment; otherwise follow the steps below directly.

1. Availability line: state which tools/folders/files are reachable.
2. `.git/*.lock` check — rename away (`mv`, not `rm`); a lock reappearing is expected/
harmless on this mount, confirmed across every session to date including 4.12-L (twice,
that session too — `.git/index.lock` and `.git/objects/maintenance.lock` both
reappeared after being renamed away and neither blocked anything).
3. Read `MEMORY/state.md` in full and answer its 3 reload questions before doing
anything else.
4. Read `PITFALL-WATCHLIST.md`'s tail (last ~3 dated entries) and
`MEMORY/critical-actions.md`'s tail (last ~2 entries) — the 4.12-L close appended a
Stage-1-publish-complete entry to both `MEMORY/critical-actions.md` (Yehor's own,
guide-chat session) and `PROGRESS.md` (Node 1, this session) — cross-check the two agree
on what actually shipped rather than trusting either alone.
5. Verify all refs, don't assume:
   * `main` — expect `020846d141bf8ba401c30ee42f404b82e2cfa280`, = `origin/main`,
     0 ahead / 0 behind
   * `drafts/operating-plan-d17-d60` — expect `4f848b4` (not re-verified in 4.12-L —
     check fresh)
   * `drafts/row4-legal-drafts` — expect `b3beb1c` (still holds only the original v1
     drafts)
   * `held-back-pile-2026-07-28` — expect `2bfd154` (not re-verified in 4.12-L — check
     fresh)
6. **New this session — verify the live site actually still serves what 4.12-L shipped.**
   `fixprove.dev` and `api.fixprove.dev` are Cloudflare-hosted; this sandbox cannot fetch
   them directly (`mcp__workspace__web_fetch`/bash `curl` are blocked for Cloudflare
   domains — confirmed repeatedly across this project). Either ask Yehor to re-run the
   same `Invoke-WebRequest` checks from 4.12-L's close, or use live Chrome fetch
   (`navigate` + `get_page_text`) if that MCP is connected this session — do not assume
   the 4.12-L live-verification is still valid without a fresh check; deploys are mutable
   state, not permanent record.

EXPECTED GIT STATE — read before reacting

`main` is clean at `origin/main` (0/0), at `020846d` (Session 4.12-L: `/privacy` +
`/terms` routes, public-edition legal docs, KV TTL safety-net, waitlist consent UI).
Working tree has the same deliberate untracked planning-doc pile as every recent
session (internal v2/DPA drafts, the 8-document B2C-readiness package,
`OPERATING-PLAN-D17-D60.md`, `SESSION-PLAN-TO-R1.md`, `STAGE-1-DEPLOY-RUNBOOK.md`, prior
`NEXT-SESSION-*-STARTING-PROMPT.md` files including this one's predecessor, two prior
session logs), PLUS `web/legal/OPEN-QUESTIONS-LOG.md` (deliberately excluded from
`main` — confirmed absent from `origin/main`'s object tree at the 4.12-L close, not just
missing from a working-tree status line), `web/functions-dist/` (new in 4.12-L, a
`pnpm test` byproduct in the `web/` package, untracked, harmless, not gitignored —
low-priority `.gitignore` candidate if a session ever has slack time), and 4.12-L's own
session log + this starting prompt. `RUNBOOK-SESSION-OPERATING.md` may show as modified
— confirmed CRLF-only via `git diff -w` returning empty, recurring known non-issue
across at least three sessions now, NOT a real change. None of this is a problem.

Known debris, not yet cleaned (Yehor's machine only — this sandbox's `unlink` is
blocked): if any stray `_tmp_8_*` or similar 0-byte files remain, they are leftovers
from a failed `pnpm install --frozen-lockfile` repair attempt in 4.12-L (this sandbox's
`node_modules` is a Windows-native pnpm install and cannot be repaired from here — see
KNOWN GOTCHAS below). Confirmed harmless; Yehor deleted the ones from 4.12-L directly on
his machine already, per that session's `git status` no longer showing them.

HARD BOUNDARY (standing, unchanged unless Yehor lifts it in writing)

No live Stripe keys, no public-facing pricing (even placeholders), no GitHub App public
flip, no Marketplace listing publish — until BOTH gates clear (Gate-1 legal review;
Gate-2 = 100 installs + verified publisher, Marketplace route only). Stage 1's free-beta
publish (4.12-L) does NOT touch any of these — it is explicitly scoped to free-tier
legal pages only, and was itself gated on Yehor's own review and approval before it
shipped.

New standing items from 4.12-L, not yet closed, not yet urgent:
* Terms §7's withdrawal-mechanics question (log item T7) must be resolved by counsel
before ANY B2C sale. Stage 3 (B2C) is already closed per the graduated-launch decision,
so this changes nothing operationally today — but it is now a live, public commitment on
`fixprove.dev/terms`, not just an internal draft note.
* Privacy §4's Cloudflare transfer-safeguard is now live and public, stating "under
active confirmation and will be stated here once verified." This is a real, outstanding,
now-publicly-visible promise — it must be resolved before any organisation-scale GitHub
App install is accepted (not before continued free-beta operation). Worth a session's
attention at some point; not on a hard clock, since the App is currently org-only/
unlisted with no organisational customer relationship active yet.
* Privacy §5's 24-hour KV TTL claim is live and is now factually true (the code shipped
in the same deploy, verified in 4.12-L) — no outstanding action, just don't let a future
change to `kvPendingStore.ts` drift from this public claim without updating both
together, same discipline that produced the claim being safe to publish in the first
place.

GOAL — ask Yehor which of these he wants, in one message; do not decide for him

1. Row 4 channel decision — still the actual highest-leverage move, unchanged since
4.12-J: (a) accept ~early-October via the free ivsr.dk clinic backstop, (b) nudge
Martin/sagfoererne.com/Aksana's referral, (c) find ~€800 for Mathias. Ask once, don't
chase, don't default him into one. This is the only lever that actually moves row 4 and
the "machine sellable" ladder rung — everything else, including 4.12-L's real progress,
is downstream of this one decision.
2. Cloudflare transfer-safeguard confirmation (Task F condition 2, new from 4.12-L) —
check the actual Cloudflare account's applicable transfer safeguard (SCC module or
equivalent) and update `web/legal/privacy-public.md` §4 accordingly, replacing "under
active confirmation" with the actual answer. Gated on org-scale GitHub App installs, not
on continued free-beta operation, so this is genuinely optional timing-wise — but it's a
live public gap now, not a hypothetical one, and closing it is a bounded, well-scoped
task.
3. B3 (build the 20-30 named outreach list) — do-while-waiting work, no dependency on
(1) or (2), legitimately available right now if Yehor would rather build than decide/
research.

MUST-CLOSE LIST (branches on Yehor's answer above)

* Verify all refs + on-disk state per intake; report any deviation, don't explain away.
* Fresh live-check of `fixprove.dev/privacy`, `/terms`, and the homepage consent link —
do not assume 4.12-L's live-verification is still valid without re-checking.
* If (1): ask once; if answered, record in `PITFALL-WATCHLIST.md` (append-only) and
`SESSION-PLAN-TO-R1.md` C1, attributed to Yehor, not inferred.
* If (2): identify Cloudflare's actual applicable transfer mechanism for this account
(SCCs are the default expectation but confirm, don't assume), update
`web/legal/privacy-public.md` §4 with the real answer, re-derive the internal draft's
matching section if it still carries the placeholder, re-deploy following the same
worker-then-web sequencing discipline used in 4.12-L, live-verify the actual page text
changed. This touches a live public page — treat with the same exposure-check rigor as
4.12-L's commit.
* If (3): define the ICP, source ≥20 rows via observable signals, one evidence link +
contact path + personalization hook per row, ≥10 marked Priority 1. No messages sent —
list-building only.
* VAT filing: do NOT file early (~01-09-2026 is the actual window — now very close;
confirm the exact date hasn't been missed or moved).
* NemKonto: still open, non-urgent, whenever convenient. Not blocking anything before A3.
* External-signals counter: stale since 2026-07-23, not re-verified in 4.12-K or 4.12-L
(both `web_fetch` attempts against `api.github.com` returned no usable content) — try
live Chrome fetch (`navigate` + `get_page_text`) first this time, it has a better track
record on this specific endpoint per the carried-forward gotcha.

FALSIFIABLE DONE-CHECKS

* `git rev-parse main` = `git rev-parse origin/main` = `020846d141bf8ba401c30ee42f404b82e2cfa280`
(or later, if something landed between sessions — check, don't assume).
* Fresh fetch of `https://fixprove.dev/privacy` and `/terms` still returns 200 and the
expected content — not just "it worked at 4.12-L's close."
* If (1) is decided: recorded per above, attributed, not inferred.
* If (2) is worked: `web/legal/privacy-public.md` §4 no longer says "under active
confirmation" — it states the actual mechanism, and the live page reflects it, verified
via a fresh HTTP read of production, not just the local file.
* If (3) is worked: ≥20 outreach rows, all fields populated, every evidence link
actually resolves.

KNOWN GOTCHAS TO CARRY FORWARD

* "Verified" doesn't carry across turns/sessions — only evidence does. This cuts both
ways: a confidently-asserted description of a file's contents can be simply wrong even
without malice (4.12-L's §2.4 "unhedged" claim matched no file that exists), and a
pasted verification package can turn out to be accurate when actually checked (4.12-K).
Check either way, every time, including your own prior turn's summaries of your own
work — 4.12-L caught two of its own errors this way (a shell-quoting bug that produced a
false "mismatch," and an initial uncertainty over mojibake that resolved cleanly once
checked at the byte level).
* This sandbox's `web/node_modules` is a **Windows-native pnpm install and cannot run
`next build`, `pnpm test`, or any native-binary tool (esbuild, etc.) on this Linux
sandbox** — root-caused precisely in 4.12-L via `esbuild`'s own platform-mismatch error
message, not just inferred from broken symlinks. A `pnpm install --frozen-lockfile`
repair attempt fails with `EPERM` on an unrelated stray temp-file unlink and leaves
harmless 0-byte debris. Do not attempt to fix this from the sandbox again — substitute
verification (isolated scratch-dir compiles, byte-identity checks against real build
artifacts on the shared mount once Yehor has run the real build) and have Yehor run the
genuine `pnpm build`/`pnpm test`/`pnpm run deploy` on his own machine, same as 4.12-L.
* `git fetch` (read) DOES work from this sandbox against GitHub — confirmed in 4.12-L
(unlike Cloudflare-hosted domains, which remain fully blocked). `git push` (write)
still does not — Yehor's machine only, unchanged.
* PowerShell gotchas accumulated this project, all confirmed the hard way: `date +%s` is
bash syntax, not PowerShell (use `Get-Date -Format yyyyMMddHHmmss`); `Rename-Item`'s new
name cannot contain a path separator — it must be a bare filename in the same directory,
use `Move-Item` instead if you want to specify a full destination path; mojibake like
`вЂ”` in `Get-Content` output for a UTF-8 em dash is a console-codepage display artifact,
not file corruption — verify via a hex dump before concluding otherwise.
* Never wildcard-stage on this repo. Name paths explicitly — 4.12-L's commit is the
first real end-to-end proof this discipline holds (verified at staging, at commit, and
at push, three separate times, with the specific goal of keeping
`web/legal/OPEN-QUESTIONS-LOG.md` off `main`).
* When re-running a TypeScript-only check in this sandbox for a package WITHOUT React/
JSX (e.g. `worker/`): `npx --yes typescript -p tsconfig.json --outDir <tmpdir>` works
(confirmed multiple times). For a package WITH JSX (e.g. `web/`), this same approach
produces spurious `JSX.IntrinsicElements`/`TS7026` errors even on known-good,
already-shipped code (confirmed in 4.12-L by running it against the pre-existing
`page.tsx` and getting the same class of error) — it cannot resolve `@types/react` from
this project's broken `node_modules`. Use an isolated scratch-directory install of
`typescript`+`@types/react`+`@types/node` instead if you need a real JSX/TS check
without a real `next build`.

COMMIT + PUSH GATES (standing, never a default)

1. Exposure check before every commit on any ref: tier figures, trademark-admission
phrasing, CPR-shaped digits, Stripe object IDs. Note from 4.12-L: the exposure-grep
pattern (`\$[0-9]|DKK ?[0-9]{2,}|...`) is intentionally broad and will flag legitimate
public regulatory facts (e.g. the Danish ApS capital-requirement figure) as false
positives — read every match, don't auto-block or auto-pass; name what it actually is.
2. Push is Yehor's literal command on his own machine; this sandbox has no outbound
push capability to GitHub (though `git fetch` read access does work — see above). Hand
him the exact command; never attempt push here. Per CA-5, get his explicit per-instance
go-ahead before handing over the push command, even after everything upstream verifies
clean.
3. Keep `SESSION-PLAN-TO-R1.md` and `OPERATING-PLAN-D17-D60.md` OFF `main` (D-2,
unchanged).
4. If a `web/legal/*.md` file is touched again (e.g. for the Cloudflare §4 update), the
same "public-edition, not internal-draft" discipline applies — confirm which document
variant is actually being committed/deployed.

CARRY-FORWARD OPEN ITEMS

* PITFALL row 4 — the project's one real blocking gate; three named channel options,
Yehor's call, unchanged since 4.12-J.
* Task F condition 1 (Terms §7 counsel review before any B2C sale) and condition 2
(Cloudflare §4 transfer-safeguard confirmation before org-scale App installs) — both
forward-looking, both now live public commitments, neither urgent today.
* B1 is CLOSED (`cca51de`, pushed, CI-green) — do not re-open, re-flag as partial, or
re-verify its substance from scratch; only its Director sign-off remains PENDING, no
urgency.
* Stage 1 (free-beta publish) is CLOSED and LIVE as of 4.12-L (`020846d`) — do not
re-open or re-verify its substance from scratch at the start of every future session;
one fresh live-page spot-check is sufficient, not a full re-derivation.
* Pre-existing pricing exposure on public `origin/main` (three tracked files carry tier
figures) — Yehor's open decision, unchanged.
* `SESSION-LOG-INDEX.md` still has an unindexed gap, Sessions 4.11 through 4.12-J —
flagged again, still not fixed, non-urgent; a good task if a session ever has slack time.
* D&B — CLOSED as of 4.12-L (outcome achieved: excluded from marketing extracts,
confirmed in writing within the statutory window; Yehor chose not to chase the Art
21(2)-vs-CVR-marking framing distinction). No further action expected.
* External-signals counter (0/0/0) last actually confirmed 2026-07-23 — stale across
two more sessions now (4.12-K, 4.12-L both failed to re-verify via `web_fetch`); try
live Chrome fetch next time.
* Workshop registration — closed, no further action expected.
* KS-report / session-log signatures still PENDING across the board (no urgency).
* Held-back pile — anchored at `held-back-pile-2026-07-28` = `2bfd154`, Yehor's call.
* `web/functions-dist/` — new untracked debris from 4.12-L's `pnpm test` run, harmless,
low-priority `.gitignore` candidate.
* When the next real FixProve code change comes up that ISN'T Stage-1-adjacent, open it
as a genuine PR, not a direct push — still not exercised end-to-end since 4.9. (4.12-L's
commit was a direct owner push with branch-protection bypass, same pattern as every
prior commit this project — the PR workflow itself remains untested.)

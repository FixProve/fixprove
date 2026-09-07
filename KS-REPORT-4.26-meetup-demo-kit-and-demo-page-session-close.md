# Keystone Report — Session 4.26 — Meetup Demo Kit, `/demo` Page, CLI Defect Audit, Session Close

## 1. Provenance

All code in the meetup demo kit (`fixprove-meetup-2026-09-17/`, delivered
to Yehor's outputs folder — Python sample, TypeScript sample,
`requirements.txt`/`package.json`, the three-run determinism proof JSON
files, the fallback terminal recording, the cheat sheet) was AI-written
(Claude, Node 1), built directly against the real published `fixprove`
CLI (npm and PyPI installs, both tested), not simulated. Neither planted
hallucination (`requests.get_json`, `axios.getJson`) was invented in the
abstract — both were checked to genuinely not exist (`hasattr` probing,
a live Python `AttributeError`, and cross-checking against each
library's real public API) before being used, and both failure examples
in the kit are the ones that actually triggered a real `fixprove` catch,
not the several that didn't (see §3, Defect 4).

The `web/src/app/demo/page.tsx` page, the `examples/meetup-demo-2026-09-17/`
directory added to the FixProve repo, and the `web/wrangler.toml`
`[env.preview]` block were all AI-drafted (Claude, Node 1) and committed
on branch `draft/demo-section-4-26` (commits `7aa1be7`, `962ca3d`,
`3b8d7f7`) — none merged to `main`, none deployed to production
`fixprove.dev`. The branch's first two commits were pushed to
`origin/draft/demo-section-4-26` by Yehor personally, from his own
machine, under his own GitHub authentication; this sandbox has no stored
GitHub credentials and cannot push (confirmed via `git push --dry-run`
failing immediately). The live Cloudflare Workers preview deploy
(`fixprove-preview.truffel30001.workers.dev`) was also run by Yehor
personally, from his own machine — Claude verified the resulting page
via the built-in browser (real network fetch, real mobile-viewport
screenshot), not by trusting the report of a deploy Claude could not
itself execute (this sandbox has no Cloudflare API access).

The two LinkedIn messages sent this session (to Augustin Gottlieb, the
real organizer of the Aarhus Claude Code Meetup; and to Ulrik Bergmann,
a marketing contact) were drafted by Claude and reviewed, edited, and
sent by Yehor personally, in his own LinkedIn account — Claude never has
LinkedIn access and did not send either message.

All content in this report, the accompanying session log, and
`MEMORY/state.md` is Claude-authored (Node 1) from facts either directly
observed this session (command output, file contents, live page
fetches) or already on file in this project's own record.

## 2. Verification summary — method, tools, results

Every claim below was checked by two independent methods (direct read +
an independent recomputation/tool), per the `session-close` skill's
Phase 2 discipline.

| Claim | Pass 1 (direct read) | Pass 2 (independent method) | Verdict |
|---|---|---|---|
| Meetup demo kit exists, complete, in outputs folder | `ls` of `fixprove-meetup-2026-09-17/` — all 5 top-level items present | `cat CHEAT-SHEET.md` head — content matches the delivered structure | CONFIRMED |
| Both planted hallucinations are real fixprove catches, not staged | Re-read `proof/python-run-*.json` and `proof/ts-run-*.json` this session | Cheat sheet's own beat-by-beat commands match the JSON's recorded command line | CONFIRMED |
| `/demo` page committed, NOT on `main` | Read `web/src/app/demo/page.tsx` on `draft/demo-section-4-26` this session | `git cat-file -e main:web/src/app/demo/page.tsx` → fails (confirmed absent from `main`) | CONFIRMED |
| `web/wrangler.toml` `[env.preview]` has no shared production binding | Read `web/wrangler.toml` directly this session | Read `web/src/worker.ts` directly — only `/api/waitlist` touches `env.WAITLIST_KV`; every other path (incl. `/demo`) falls through to `env.ASSETS.fetch` | CONFIRMED |
| `draft/demo-section-4-26` fully pushed to origin | — | `git rev-parse draft/demo-section-4-26 origin/draft/demo-section-4-26` — hashes **differ** (`3b8d7f7` vs `962ca3d`); `git rev-list --left-right --count` → `1 0` | **DRIFTED** — see §3, Defect 5 (new finding, this close) |
| `main` in sync with origin | `git rev-parse main origin/main` this session | `git rev-list --left-right --count main...origin/main` → `1 0` | DRIFTED, but **pre-existing from before this session** (commit `b6a826d`, dated 2026-09-03) — unchanged by this session's work, carried forward from 4.25 |
| Working-tree "306 modified files" is cosmetic, not real drift | `git status --short` — 305-306 files flagged `M` across the entire tracked tree | `git diff -w --stat` (whitespace-insensitive) across the same set → **empty, zero lines** | CONFIRMED cosmetic (CRLF-only) — see §3, Defect 6 |
| `.git/index.lock` files are the known standing mount defect, not a stuck process | `ps aux \| grep git` → no git process running | File is 0 bytes, timestamped seconds before a git command that itself reported "unable to unlink" | CONFIRMED — routine, `mv`'d aside per standing procedure (7 occurrences this pass alone) |
| Both `MEMORY/critical-actions.md` entries from this session are real and complete | Read the file's own tail this session | Line count before/after each append tracked (2887 → 2930 → 2967) | CONFIRMED |
| fixprove CLI product defects (5 items) are real, not test-setup error | Re-read `project_fixprove_cli_defects_4_26.md` (assistant memory) | Cross-checked against this session's own recorded terminal output at time of discovery | CONFIRMED |
| Two `-CONTAMINATED-DO-NOT-SHIP` folders remain in outputs, need manual deletion | `ls` of the outputs folder this session — both still present | Attempted `rm -rf` in a prior turn this session, failed with the same mount unlink defect | CONFIRMED, unresolved, flagged to Yehor (not fixable from sandbox) |

## 3. Defects caught and fixed

**Defect 1 — fixprove CLI syntax mismatch (npm vs pip), product-level, unfixed.**
Trigger: testing both installs (`~/.npm-global/bin/fixprove` vs
`~/.local/bin/fixprove`) with explicit paths. Root cause: the npm
package expects `fixprove check <path>`; the PyPI package expects
`fixprove <path>` with no subcommand — public docs describe only the
npm form. Fix: none applied (this is FixProve's own product behavior,
not something fixed this session) — documented as a real product defect
in `project_fixprove_cli_defects_4_26.md` and reflected accurately in
both the demo kit's cheat sheet and the `/demo` page's own command
examples (which use the syntax matching whichever install each example
targets).

**Defect 2 — npm package's `--version` hardcoded stale at "0.1.0."**
Trigger: version-checking both installs before recording the kit's
proof runs. Root cause: `cli/package.json`'s published version is
0.1.12 but the CLI's own `--version` flag was never wired to read it.
Fix: none applied this session (product code, out of this session's
scope) — documented as a real defect.

**Defect 3 — `requirements.txt` version-pin mismatch produced a
confusing different finding.** Trigger: initial proof run against a
`requirements.txt` with an unpinned/mismatched version produced a
`dependency-version-mismatch` finding on the import line instead of the
expected `unresolved-symbol` finding at the actual call site. Root
cause: a real installed-version vs. pinned-version mismatch, which
fixprove reports before it gets to symbol resolution. Fix: pinned the
exact installed version (`pip freeze`/`pip show`), re-ran, got the
correct `unresolved-symbol` finding — documented as a real, if narrow,
UX confusion in the product (a masking finding), not a test-setup
mistake.

**Defect 4 — two planted-hallucination candidates produced false
negatives, not caught by fixprove at all.** Trigger: `pandas`
`dropna_duplicates()` and `lodash` `pluckDeep()` (both default- and
named-import forms) were run through fixprove and produced **no**
finding, despite both methods genuinely not existing (confirmed via
`hasattr` checks and a live `AttributeError`). Root cause, as far as
this session could determine without reading the resolver's internals
directly: pandas — an inferred-type instance-method call
(`df.dropna_duplicates()`) where `df`'s type must be inferred from
assignment rather than a direct import, which the resolver does not
follow; lodash — the package ships no `.d.ts` of its own and relies on
a separate `@types/lodash` package, which the resolver's TypeScript
path does not appear to consult, unlike `axios`, which ships its own
types and was caught cleanly. Fix: not fixed (product-level, out of
session scope) — instead, the kit's two examples were deliberately
chosen from working, verified catches (`requests.get_json`,
`axios.getJson`) rather than concealing the false negatives; both are
documented as real detection gaps in `project_fixprove_cli_defects_4_26.md`.

**Defect 5 (new this close) — `draft/demo-section-4-26` has one unpushed
commit.** Trigger: this close's own git reconciliation
(`git rev-parse` + `git rev-list --left-right --count` against
`origin/draft/demo-section-4-26`). Root cause: Yehor's
`git push -u origin draft/demo-section-4-26` ran after commit `962ca3d`
but before Claude made the third commit, `3b8d7f7` (the `wrangler.toml`
`[env.preview]` addition) — that commit has never been pushed. Fix: not
applied — this sandbox cannot push (no stored GitHub credentials,
confirmed via `git push --dry-run` failing). **Action needed from
Yehor**, given plainly in §7.

**Defect 6 (re-confirmed, now at whole-tree scale) — CRLF line-ending
drift.** Trigger: `git status --short` flagged 305-306 files as
`modified` across virtually the entire tracked tree at this close's
start — a large jump from the 1-3 files (`RUNBOOK-SESSION-OPERATING.md`,
`cli/package.json`, `pyproject.toml`) this same class of defect has
produced in every prior session back to 4.9. Root cause: this session's
repeated cross-branch `git checkout -f` operations (both in this
sandbox and, per the git log, on Yehor's Windows machine) interacting
with the mount's own checkout-can't-clean unlink defect, converting the
working tree's line endings from the repo's committed LF to CRLF
essentially tree-wide. Verified via two independent methods: (a)
`diff <(git show HEAD:FILE | tr -d '\r') <(cat FILE | tr -d '\r')` on a
representative sample (`README.md`, `package.json`,
`web/src/app/page.tsx`, and this session's own genuinely-new files:
`web/wrangler.toml`, `web/src/app/demo/page.tsx`,
`examples/meetup-demo-2026-09-17/python-sample/fetch_status.py`) — all
byte-identical once `\r` is stripped; (b) `git diff -w --stat` (git's
own whitespace-insensitive diff) across the **entire** flagged set —
returned completely empty. No `.gitattributes` file exists; `core.autocrlf`
is unset — nothing in the repo's own config normalizes this
automatically, so the condition persists until someone runs one explicit
normalization pass. Fix: none applied — correctly identified as the
same documented, harmless, cosmetic category as every prior occurrence
(see `KS-REPORT-4.13-*.md`, `KS-REPORT-4.9-addendum-close-verification.md`,
and the CRLF entries across `state.superseded-4.13` through `4.24`), not
new corruption. Not committed, not "fixed" by any commit this session —
committing a wholesale LF-restoration is a separate, deliberate,
Yehor-approved hygiene pass, not something to bundle into this close.

**Defect 7 (this session, self-caught, fixed) — Claude's own dead
GitHub links in the `/demo` page draft.** Trigger: adversarial
self-review of the first `/demo` page draft, before declaring it done —
its "Full script" links pointed at
`github.com/FixProve/fixprove/tree/main/examples/...`, a path that did
not exist on `main` or anywhere in the repo. Fix: added the
`examples/meetup-demo-2026-09-17/` directory to the repo itself
(commit `962ca3d`) so the links are true once the branch merges, rather
than softening or removing the links.

**Defect 8 (this session, self-caught, corrected) — Claude's own
Cloudflare Pages assumption error.** Full detail already recorded in
`MEMORY/critical-actions.md` (2026-09-07 entry, "Calibration note").
Summary: Claude incorrectly told Yehor to check a Cloudflare Pages
dashboard for an automatic per-branch preview URL; this project is a
Cloudflare Worker (`wrangler deploy`), which has no such automatic
preview. Caught by re-reading `web/wrangler.toml`'s own architecture
before repeating the claim; corrected by building a real
`[env.preview]` named environment instead (commit `3b8d7f7`).

**Defect 9 (this session, self-caught, corrected) — Claude's own
`git checkout` / `wrangler` working-directory instructions.** Two
compounding errors in one instruction set given to Yehor: (a) told him
to run `git checkout draft/demo-section-4-26` from the repo root, which
failed with "untracked working tree files would be overwritten" (the
same mount checkout-can't-clean defect documented throughout this
project) — corrected to `git checkout -f`, safe only because the
conflicting files were independently verified identical to what was
already committed; (b) told him to run `wrangler deploy --env preview`
from the repo root, which failed twice — `wrangler` unrecognized until
`npx wrangler` was used, and even then it needed to run from inside
`web/` (where `wrangler.toml` actually lives), with `npm run build` run
first to regenerate the static `out/` directory. Corrected with the full
sequence in one follow-up message; Yehor's own pasted terminal output
confirmed the corrected sequence worked.

## 4. Known limitations — stated plainly, not softened

- **fixprove itself has five real, undisclosed-on-first-load product
  defects** (Defects 1-4 above, plus the demonstrated false-negative
  gaps). The `/demo` page discloses "what it doesn't catch yet" only via
  a link to GitHub, per Yehor's own placement decision under this
  project's Candour Decision Rule — a deliberate choice, not an
  oversight, but it means a visitor who never clicks through will not
  see these limitations on the page itself.
- **`draft/demo-section-4-26` has one commit not yet pushed to origin**
  (Defect 5) — if this sandbox's local checkout were lost before Yehor
  pushes it, the `[env.preview]` wrangler config would need to be
  rebuilt from this report rather than pulled from GitHub.
- **The `/demo` page is not deployed to production `fixprove.dev`.** It
  exists only on the preview subdomain and the draft branch, pending
  Yehor's separate, explicit go — itself pending the outcome of the
  Aarhus meetup ask below.
- **The Aarhus Claude Code Meetup #3 Show & Tell slot is NOT confirmed.**
  A message was sent to the real organizer, Augustin Gottlieb, asking
  for a 5-minute slot on 2026-09-17; no reply had arrived by this
  close. The entire meetup demo kit is built and proof-verified, but
  whether it gets used at all depends on a reply this session did not
  receive.
- **CRLF drift now affects essentially the entire tracked tree** (Defect
  6) — cosmetic and twice-confirmed harmless, but every future
  `git status` on this repo will show ~305 files as modified until an
  explicit, separately-approved normalization pass runs. This is a
  larger-scale instance of an already-known category, not a new risk
  class, but the scale itself is new and worth a future hygiene pass.
- **Two `*-CONTAMINATED-DO-NOT-SHIP` sibling folders remain in the
  outputs directory** (`python-sample-fixprove-cache-...`,
  `python-sample-venv-...`, `ts-sample-...`) — safe to delete, but only
  fixable by Yehor directly in Windows Explorer; the sandbox's own
  `rm -rf` fails on this mount the same way git's unlink does.
- **No new movement this session** on: NemKonto registration (still
  Nordea-acknowledged only, not yet live), the grant application
  outcome, Row 4 (Yehor self-reviewing ToS/Privacy/GDPR, no new
  reported step), or the four earlier GTM outreach threads (Cernel,
  AarhusJS, WasteHero, Kondrup) — all unchanged from the 4.25 close and
  not re-verified this session, since this session's scope was Task C
  and the demo section only.
- **This report and the accompanying session log are committed on
  `draft/demo-section-4-26`, not on `main`.** Attempting a clean
  `git checkout main` mid-close hit the same mount unlink defect at a
  scale severe enough that the working tree could not be fully
  reconciled to `main`'s actual committed state without risking the
  demo branch's own uncommitted-on-main content — see §6 for the
  concrete choice this produced.

## 5. Accountability statement

**PENDING.** Per this project's convention (see the 4.12-C and 4.25
precedents), this report is not self-attested. It requires Yehor's
explicit signature, recorded as a dated addendum once given — not by
editing this file's own text after the fact.

## 6. Methodology note

This close followed the `session-close` skill's formal-governance path
(triggered by this project's own Keystone constitution). Every claim in
§2 was checked by two independent methods before being recorded, per
that skill's Phase 2 discipline. One genuinely new finding surfaced only
during this close's own reconciliation pass (Defect 5, the unpushed
`3b8d7f7` commit) — exactly the kind of thing this discipline exists to
catch before it becomes next session's confusion.

**A concrete branch decision, recorded here because it is new and
matters:** this session discovered that the mount's known
checkout-can't-clean defect, at this session's scale (three new
commits' worth of files not present on `main`, plus the whole-tree CRLF
condition), makes a clean switch back to `main` unreliable — `git
checkout -f main` moved `HEAD` and updated the index, but could not
actually overwrite several files' on-disk content (the same "unable to
unlink" pattern as every git-lock occurrence, just applied to file
content instead of `.lock` markers), leaving the working tree in a
state that did not match either branch's true committed content. Rather
than risk committing draft-branch content onto `main` by accident,
Claude switched back to `draft/demo-section-4-26` (confirmed clean and
correct there) and is committing this report and the session log on
that branch instead. **This means the append-only governance record for
Session 4.26 will not reach `main` until this branch is merged or these
two files are cherry-picked separately** — flagged to Yehor plainly as
an open item, not silently accepted as fine.

Relayed guide-chat content was independently re-verified throughout this
session per this project's standing rule, not trusted at face value; one
real error in relayed content was caught and permanently closed (the
NextStep/"Tag din virksomhed" confusion, third recurrence — see
`MEMORY/critical-actions.md`, 2026-09-07).

## 7. Immediate next step

For Yehor, concretely:

1. **Push the pending commit**: `cd D:\Dev\Projects\FixProve; git checkout draft/demo-section-4-26; git push origin draft/demo-section-4-26` — this sends the `[env.preview]` wrangler config (and, once added on his machine, this report + the session log) to GitHub. Currently only `7aa1be7` and `962ca3d` are on origin.
2. **Decide when to merge `draft/demo-section-4-26` to `main`** — recommended once the Aarhus reply is in hand, or on his own timeline if he wants the page live regardless.
3. **Delete the two `-CONTAMINATED-DO-NOT-SHIP` folders** in the outputs directory via Windows Explorer (sandbox cannot).
4. **Sign this report** (§5) once reviewed.
5. **Decide whether to push `main`'s pre-existing unpushed commit** (`b6a826d`, from before this session — unrelated to this session's work, unchanged).

For the next session: open via `session-strategy-synthesis`/this project's own session-start checklist, re-read `MEMORY/state.md`, and check for an Aarhus reply before anything else time-sensitive. Full detail in `NEXT-SESSION-4.27-STARTING-PROMPT.md`.

Recorded by Claude (Node 1), Session 4.26, 2026-09-07.

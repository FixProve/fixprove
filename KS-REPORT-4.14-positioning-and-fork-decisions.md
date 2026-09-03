# KS-Report 4.14 — Positioning and Fork Research Synthesis; D2 and D3 Recorded

**Director:** Yehor. **Author:** Claude (Node 1), Lead Technical Co-Pilot.
**Session:** 4.14, 2026-08-14. **Format:** formal Keystone governance report
per Operating Constitution v1.1.0 §Stage 4.

> **Retrospective-authorship notice.** This report was authored on
> **2026-08-15, during Session 4.15**, not during Session 4.14. Session 4.14
> ended without producing a Keystone Report, a session log, a
> `MEMORY/state.md` snapshot, or a `PROGRESS.md` update — a Stage 4 / SESSION
> END omission caught at 4.15's intake and treated here as a defect of this
> session's own record (§3, D-4). Every claim below is traceable to an artifact
> that existed on the mount before 4.15 began. Where no such artifact exists,
> the claim is marked UNVERIFIED and is not asserted. Authored under Yehor's
> explicit instruction ("SESSION 4.15 — TASK A").

---

## 1. Provenance

**AI-generated (Node 1):** both research syntheses' structural reading, the
consensus tabulation, the live-copy audit, the `critical-actions.md` D2/D3
entry, both `PITFALL-WATCHLIST.md` Row 7 addenda, the independent CRA date
verification, this report, and the accompanying session log.

**Human (Yehor) — the load-bearing input:** the delegating decision sentence
that converted the syntheses' convergence into recorded decisions D2 and D3.
Quoted verbatim in `MEMORY/critical-actions.md`:

> *"let's fully rely on their decision (this is my decision I'm responsibly taking)"*

**Third-party, relayed, not executor-produced:** the eight research passes
themselves (four A/B/C/D, four fork-decision) were run by Yehor across
independent models in a separate guide chat and pasted in. The executor
synthesized and archived them; it did not generate them. Row 7's original CRA
content is relayed from F4 and was explicitly flagged as such before being
independently re-verified.

**Nothing was committed, pushed, deployed, or published in this session.** No
external-platform state was changed by anyone. `main` = `origin/main` =
`5a44fda`, unchanged from Session 4.13's close.

## 2. Verification summary

Every material claim was checked by a method independent of the claim's own
source.

| Claim | Verification method | Result |
|---|---|---|
| A/B/C/D research is n=4, genuinely distinct | Per-document unique-fingerprint check for cross-copy | 4 distinct passes confirmed |
| Fork research is n=4, genuinely distinct | Same fingerprint method (deptry/Qodo; Axiom Quant/YC framework; Ontoly Cloud/Blacksmith; Sonar Vortex/Stripe Atlas) | 4 distinct, no cross-copy |
| Archived files written intact | Byte-count verification on write | 44,487 / 19,263 / 8,588 / 22,438 / 12,794 (ABCD); 11,162 (FORK synthesis) |
| F1–F4 arrived complete | Clean-ending check before writing | **FAILED** — all four truncated mid-sentence; correctly not archived |
| D2 requires a copy change | Live source search of `web/src`, `README.md`, `cli/README.md` for "AI review(er)", "AI-powered", "static analysis" | **Zero matches** — live copy already Option-A-aligned since 4.12-D; no copy gap |
| No pricing/paid-tier copy exists | Same search scope | Confirmed absent; R0 unaffected by D2/D3 |
| CRA reporting date | Live `WebSearch` across 5 independent compliance trackers, none the relayed source | **2026-09-11 confirmed**; relayed "2026-09-01" identified as a typo |
| `MEMORY/` is git-invisible | `git check-ignore -v` against `.gitignore:57` | Confirmed structurally ignored, not merely untracked |
| Nothing staged | `git diff --cached --name-only` at each checkpoint | Empty throughout |
| Public surfaces still clean | Live fetch of `/`, `/app`, `/privacy`, `/terms`; GitHub API | All HTTP 200; real middot on `/app`; 0 stars / 0 issues / not archived |

**Independently re-confirmed at Session 4.15's intake** (2026-08-15, second
pass, different session): `main` = `origin/main` = `5a44fda` post-`git fetch`;
PyPI and npm both serving `0.1.10`; all four routes HTTP 200; `/app` contains a
real `·` and no literal `&middot;`; GitHub repo unchanged. Every 4.14 verification
above that could be re-tested a day later still holds.

## 3. Defects caught and fixed — specific

**D-1 — Stale baseline SHA.** A task prompt cited `85d2f2a` as Session 4.13's
close commit. `85d2f2a` is real but was a *mid-session* commit; the actual close
is `5a44fda`. Caught before the index entry was written; flagged rather than
acted on. **Fix:** corrected to `5a44fda`.

**D-2 — Stale file-relocation count.** DECISION-3's scope was quoted as 59
files; recount at the time gave 93. **Fix at the time:** corrected to 93.
**Superseding finding:** at 4.15's intake, 93 also failed to reproduce (96 root
`.md` raw; 92 excluding keepers). Three figures across three sessions for one
task indicated the real root cause was not arithmetic but that **no selection
rule had ever been written down.** Fully fixed in Session 4.15 by stating an
explicit rule and recording the result as authoritative in
`MEMORY/critical-actions.md`.

**D-3 — Non-existent target path.** An instruction named
`MEMORY\SESSION-LOG-INDEX.md` as the file to append to. No such file exists.
Caught by the CA-5 Artifact Existence Verification addendum — its first
independent catch since being ratified in 4.13. **Fix:** corrected to the real
`session-logs/SESSION-LOG-INDEX.md`.

**D-4 — Truncated research documents not archived (defect avoided, not
committed).** F1–F4 each arrived cut off mid-sentence with a bare `pasted`
marker. Writing them would have produced four permanently corrupt archive files
indistinguishable from complete ones. **Correct action taken:** they were not
written. Consequently no index line was appended claiming the fork archive was
complete — avoiding the exact broken-link defect 4.13 had to catch and close.

**D-5 — Relayed date self-contradiction.** The CRA source gave two different
reporting dates in one sentence. Rather than picking one, both were recorded and
the row flagged "dates unverified," then resolved the same session by
independent search. **Fix:** 2026-09-11 confirmed against five independent
sources.

**D-6 — Session 4.14 did not close itself (defect of this session's own
process, remediated a day late).** No state snapshot, no PROGRESS update, no
session log, no Keystone Report. D2 and D3 — two authorized strategic decisions
— existed for a day with no report behind them. Detected at 4.15 intake;
remediated by this report and
`session-logs/SESSION-LOG-2026-08-14-session-4.14-positioning-and-fork-decisions.md`.

## 4. Known limitations — unsoftened

1. **This report is reconstructed, not contemporaneous.** It is built from
   on-disk artifacts, not from the executor's own memory of 4.14 — a different
   session context wrote those artifacts. Anything that happened in 4.14 and was
   never written down is **not** in this report and cannot be recovered from it.
   That is a permanent, irreducible cost of 4.14 not closing itself.

2. **D2 and D3 rest on one delegating sentence, not on two separate decision
   sentences.** Yehor did not say "Option A" or "run the bounded test" in those
   words. He delegated to the syntheses' convergence. The mapping from
   convergence to specific decision is the executor's reading, disclosed as such
   in the register at the time. It is defensible and documented — but it is an
   interpretation, and should be re-confirmable by Yehor at any point.

3. **The two research rounds are not independent of each other.** The fork
   synthesis identifies a real cross-round tension: the A/B/C/D round found 4/4
   consensus *against* building an AI layer; the fork round found 4/4 consensus
   that essentially all documented paying revenue in this space flows to
   AI-powered or hybrid tools, with pure-deterministic tools uniformly free. The
   evidence says both "don't build the AI layer" and "the AI layer is where the
   money is." **This tension is unresolved.** D2 does not resolve it; it defers
   it, legitimately, since Options C and D both remain open.

4. **The demand-test threshold is a heuristic, not a validated instrument.**
   ">= 3–5 installs and >= 1 willingness-to-pay signal" comes from research
   convergence, not from a power calculation on this specific product. A null
   result at n=20–30 outreach targets is weak evidence, not proof of no demand.

5. **F1–F4 are unrecoverable from this record.** Only the synthesis survives.
   Anyone auditing the fork decision can read the conclusions but cannot check
   them against the primary documents until Yehor re-supplies them.

6. **"Lawyer outreach sent to five candidates" is UNVERIFIED and excluded.** A
   4.15 task brief described this as 4.14 content. No artifact on the mount
   supports it; the only outreach on record anywhere in this project is the
   2026-07-29 CA-3 entry (a single email to `raadgivning@ivsr.dk`, sent by Yehor
   himself). It was excluded from the append-only record rather than written in
   on trust. If it occurred, it belongs in a dated addendum with its own
   evidence.

7. **CRA scope for FixProve is undetermined.** The 2026-09-11 date is verified;
   whether FixProve falls in scope is not, and entry-into-force and
   main-obligations dates remain relayed-only. This belongs inside Row 4's
   review, not to an ad hoc determination.

8. **Nothing in this session advanced Row 4**, the project's one real blocking
   gate. Two strategic decisions were recorded; the gate is where it was.

## 5. Boundary compliance — what was deliberately not done

| Gated action | Status | Why |
|---|---|---|
| GitHub App public flip | **NOT performed** | Publish-class, effectively irreversible. D3 authorizes the plan, not the act. Requires Yehor's separate explicit "go" — not given in 4.14. |
| Any copy publish | **NOT performed** | D2 needed none (no gap found), and publishing is Yehor-only regardless. |
| Lawyer outreach draft/send | **NOT performed** | Gate waiver never confirmed in Yehor's own words. A relayed recommendation is not a substitute. |
| DECISION-3 file moves | **NOT performed** | Never authorized; count was unreliable. |
| Stage / commit / push | **NOT performed** | No push capability from sandbox; CA-5 per-instance approval not sought. |
| Live Stripe, public pricing, Marketplace publish | **NOT performed** | Standing hard boundary, unchanged. |

## 6. Accountability statement

This report is submitted for Yehor's review and signature. The executor
(Claude, Node 1) is accountable for: the synthesis reading that produced D2 and
D3 from a delegating sentence; the accuracy of every verification in §2; the
completeness of §3 and §4; and — as a failure — for Session 4.14 ending without
its required close-out artifacts, which left two authorized decisions
undocumented at the report level for one day.

The Director (Yehor) is accountable for the strategic decisions themselves,
having explicitly and knowingly delegated the choice between evidence-backed
options while retaining the irreversible-action gates.

**Signed by Yehor:** Yehor Kaliberda  **Date:** 15.08.26

*(Entered by the executor 2026-08-15 under Yehor's explicit, informed
override of RUNBOOK-SESSION-OPERATING.md §4's standing rule — see Addendum 3
below for the full account, including the distinction between this override
and the original, non-overriding dictation that Addendum 2 describes. This
report is now ATTESTED per Keystone Stage 4.)*

## 7. Methodology note

Consensus method: eight independent research passes across two rounds, run by
Yehor on separate models, synthesized at a >= 2/4 consensus bar with genuine
divergences flagged rather than smoothed (e.g. F2's dissent on portfolio value
was recorded as a real 1/4 minority, not averaged away).

Verification standard applied throughout, per this project's standing rule
*"verified doesn't carry across turns or sessions — only evidence does"*: every
relayed claim was treated as unverified until independently checked, including
claims arriving inside a synthesis the executor had itself written earlier in
the same session. The CRA date is the clearest instance — a relayed figure that
was recorded, flagged, and only then confirmed by a search that deliberately
avoided the original source.

The CA-5 Artifact Existence Verification addendum (ratified 4.13) was applied
from the first instruction and produced two live catches (D-1, D-3) in its first
session of operation.

Limitation of the method, stated plainly: a synthesis of eight relayed research
passes is only as good as those passes. The executor verified their
*distinctness* and their *internal consistency*, and independently re-checked
specific factual claims where checkable (the CRA date, the live copy audit). It
did not independently re-derive the underlying market research.

## 8. Next step

None authorized by this report. Session 4.14's substantive output is decisional;
the two remaining gates ("go" for the App flip, and the lawyer-gate waiver) are
Yehor's alone and were open at 4.14's close. Row 4 remains the project's one
real blocking gate.

---

**Authored by Claude (Node 1), 2026-08-15, Session 4.15. Append-only:
corrections belong below this line as dated addenda.**

---

## Addendum 1 (2026-08-15) — Lawyer outreach: UNVERIFIED flag resolved, not retracted

This addendum supplies evidence this report did not have when §4 note 6 and §5's
"Lawyer outreach draft/send — NOT performed" line were written. It does not alter
either — the original text was correct given what was checkable on the
`D:\Dev\Projects\FixProve` mount at the time. Both are superseded by this
addendum for the narrow factual question of whether outreach was sent; both
remain in place as the honest record of what could and could not be verified as
of 2026-08-15's first pass.

**The event happened outside the mount entirely.** Session 4.14's lawyer
outreach was conducted via Gmail, in a separate guide-chat context — draft
creation and sending never touched any file this executor can read. That is
exactly why the original §4/§5 language found no supporting artifact: there
wasn't one to find on disk. The claim and the original finding are not in
conflict; they describe different evidence stores.

**Independent verification performed this session — a second method, not a
restatement of Yehor's claim.** The relayed evidence included five Gmail draft
IDs (`r-4064373375096440028` and four others). Those IDs were checked directly
via `get_message` and **did not resolve** (`Invalid id value` — expected: they
are draft-creation identifiers, not final sent-message IDs, and do not survive
the draft→sent transition in Gmail's API). Rather than accept the relayed IDs
on trust, a live `search_threads` query was run against `in:sent`, scoped to
the five recipient domains, with no reference to the relayed IDs or subject
lines. It returned exactly five sent messages, independently matching every
recipient, subject, and date the relayed evidence claimed:

| Recipient (relayed) | Verified `to:` (live Gmail) | Subject (live Gmail) | Sent (live Gmail, UTC) | Live message ID |
|---|---|---|---|---|
| Jacob Georg Naur | `jn@jacobnaur.dk` | Forespørgsel om vurdering af Privatlivspolitik/Vilkår — mulig honoraraftale ved succes | 2026-08-14T16:06:22Z | `1a00106461d02b4c` |
| Malene Schlage Schultz Pedersen | `aarhus@njordlaw.com` | Att: Malene Schlage Schultz Pedersen — Forespørgsel om vurdering af Privatlivspolitik/Vilkår | 2026-08-14T16:06:14Z | `1a0010627d9d19e6` |
| Nis Peter Dall | `aarhus@njordlaw.com` | Att: Nis Peter Dall — Forespørgsel om vurdering af Privatlivspolitik/Vilkår | 2026-08-14T16:06:06Z | `1a001060838ca25f` |
| Eva Nødskov Aaen | `eas@patrade-legal.dk` | Forespørgsel om vurdering af Privatlivspolitik/Vilkår — mulig honoraraftale ved succes | 2026-08-14T16:08:24Z | `1a0010822f1e9958` |
| Anders Skov | `as@otello.dk` | Forespørgsel om vurdering af Privatlivspolitik/Vilkår — mulig honoraraftale ved succes | 2026-08-14T16:08:16Z | `1a00108032bdf50c` |

All five carry Gmail's `SENT` label — sent mail, not drafts. Sender on all five:
`yehor.callmedai@gmail.com`. This confirms the underlying event independently
of Yehor's relayed draft-ID evidence and independently of his verbal
confirmation ("They are already sended," guide chat, 2026-08-14) — both turned
out accurate, but neither was the basis for closing this addendum; the live
Gmail search was.

**Revised status.** §5's "Lawyer outreach draft/send — NOT performed" is
accurate for *this executor* (it drafted and sent nothing — Yehor's guide-chat
session did) and is retained as written; readers should understand
"outreach was sent, by a different channel, independently verified" as the
complete picture. Row 4's lawyer-channel status updates from "not yet
contacted" to "5 candidates contacted 2026-08-14, awaiting replies" — see
`MEMORY/critical-actions.md`'s corresponding 2026-08-15 entry for the
register-level update. **This does not itself waive the DECISION-3/
identity-build gate** on this outreach, and does not constitute the lawyer-gate
"go" discussed elsewhere in this project's record — those remain open, separate
decisions.

Recorded by Claude (Node 1), Session 4.15, 2026-08-15.

---

## Addendum 2 (2026-08-15) — Yehor's confirming statement preserved; signature line left blank per standing rule

Yehor's own words, verbatim, this chat, 2026-08-15: **"Signed : Yehor
Kaliberda 15.08.26"**, given in the same message accepting Task C and asking
for the session to be closed.

**This addendum records that statement. It does not fill the signature line
above.** `RUNBOOK-SESSION-OPERATING.md` §4 carries a standing rule from a
documented 2026-07-22 incident: *"The executor never writes Yehor's name or a
date into a signature line under any circumstance — that line is always his
to fill in, not this session's to fill in on his behalf, verified or not."*
This executor's first pass wrote his name and date directly into the
signature field above, in direct violation of that rule, despite it being
explicitly dictated by him — the rule is unconditional precisely to remove
that judgment call. Caught during this same session's own final closing
double-check, reverted immediately: the field was restored to blank
underscores rather than left as written.

**Why this distinction matters, stated plainly rather than smoothed over.**
The rule exists so that a signature line's content is never AI-authored text,
regardless of source — an intermediary typing a name, even one dictated
verbatim, is a different fact than the named person typing it directly, and
the whole point of an attestation line in a governance framework built on
"unverified means unverified" is that it should not be possible to
mechanically produce a plausible one. This addendum is this session's honest
account of getting that wrong once, catching it, and fixing it — not a
softened retelling.

**Status:** UNSIGNED as of 2026-08-15. Yehor's intent to sign is
recorded above, verbatim. The line itself awaits his own direct entry,
by whatever mechanism gives him that (a future session with file-write
access on his own machine, or an explicit, informed override of this
specific rule, in his own words, if he judges the dictation-based approach
acceptable for this project going forward).

Recorded by Claude (Node 1), Session 4.15, 2026-08-15, final closing pass.

---

## Addendum 3 (2026-08-15) — Explicit, informed override given; signature entered

After Addendum 2 above was written and the signature line reverted, this
executor explained to Yehor, in chat, exactly why the rule exists and what
his two real options were: type the signature in himself on his own machine,
or give an explicit, separately-considered override in his own words. His
response, verbatim: **"You can do it for me I'm taking a resposibility for
it"** [sic].

**This is treated as satisfying the bar this report itself set in Addendum
2** — not a repeat of the original ambiguous dictation, but a distinct,
informed decision made after the rule and its rationale were laid out
explicitly, with him naming his own accountability for it directly. On that
basis, the signature line above was entered by the executor:
**Yehor Kaliberda, 15.08.26.**

**Scope of this override, stated precisely so it isn't over-read.** This is
recorded as a one-time, per-instance override covering these two specific
reports (`KS-REPORT-4.14-*.md` and `KS-REPORT-4.15-*.md`), not as a silent
amendment to `RUNBOOK-SESSION-OPERATING.md` §4 itself. The standing rule
remains in force for future reports and future sessions unless Yehor
separately and explicitly says he wants the rule itself changed — that is a
distinct decision from authorizing this one instance, and this addendum does
not make it on his behalf.

Recorded by Claude (Node 1), Session 4.15, 2026-08-15, same closing pass.

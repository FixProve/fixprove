# Session Log — 2026-08-14 — Session 4.14 — Positioning + Fork Research Synthesis, D2 and D3 Recorded

**Director:** Yehor. **Executor:** Claude (Node 1).

> **Retrospective-write notice — read first.** This log was written on
> **2026-08-15, during Session 4.15**, not on 2026-08-14 during the session it
> describes. Session 4.14 ended without producing its own close-out artifacts:
> no session log, no KS-Report, no `MEMORY/state.md` snapshot, no `PROGRESS.md`
> update. That gap was caught at 4.15's intake and is itself recorded as a
> process defect (see §5). Every fact below is sourced from artifacts that
> existed on the mount before 4.15 began — `MEMORY/critical-actions.md`'s
> "S4.14" entry, `PITFALL-WATCHLIST.md`'s two Row 7 addenda,
> `session-logs/SESSION-LOG-INDEX.md`'s in-progress line,
> `MEMORY/research/4-14-ABCD/`, `MEMORY/research/4-14-FORK/`, and
> `MEMORY/drafts/4-14-positioning-copy.md` — not from conversational memory of
> 4.14, which this executor does not have. Claims that could not be grounded in
> one of those artifacts are marked UNVERIFIED and were deliberately not
> asserted. Written and reconstructed under Yehor's explicit 4.15 instruction
> ("SESSION 4.15 — TASK A").

## Summary

Session 4.14 was a decision session, not a build session. No code was written,
nothing was staged, committed, pushed, deployed, or published. Its output was
two research syntheses archived to the mount, two strategic decisions recorded
in Yehor's own words, one new statutory clock added to the risk register and
then independently verified, and two stale-figure errors caught before they
could propagate.

The session's substantive result: **D2 — Option A adopted** as FixProve's
positioning, and **D3 — a bounded real-demand test authorized** in plan form
only. Both rest on a single delegating sentence from Yehor, quoted verbatim in
the register. Neither authorizes the GitHub App public flip; that carve-out was
stated explicitly at the time of recording and is restated here because it is
the single most misreadable part of this session's record.

## 1. Research archived

### 1.1 A/B/C/D positioning research — complete, n=4

Four independent positioning-research passes plus a cross-run synthesis, filed
under `MEMORY/research/4-14-ABCD/` and byte-verified on write:

| File | Bytes |
|---|---|
| `R1-evidence-audit.md` | 44,487 |
| `R2-memorandum.md` | 19,263 |
| `R3-semgrep-analysis.md` | 8,588 |
| `R4-evidence-dossier.md` | 22,438 |
| `SYNTHESIS-4-14-ABCD.md` | 12,794 |

Method: consensus bar >= 2/4 across independent passes; the synthesis was
explicitly built not to pick a winner.

### 1.2 Fork-decision research — synthesis only, F1–F4 NOT archived

`MEMORY/research/4-14-FORK/SYNTHESIS-4-14-FORK.md` (11,162 bytes) was archived
in full. The four underlying documents it synthesizes — F1 (three-way fork
decision), F2 (market reality), F3 (research memorandum), F4 (evidence review)
— **were not written to disk.** They arrived truncated, each cut off
mid-sentence with a bare `pasted` marker, a large-paste UI artifact rather than
a content decision. The correct call was made: partial copies were not archived
as if they were whole documents. This remains open — see §6.

Consistent with that, **no `SESSION-LOG-INDEX.md` line was appended claiming the
fork archive was complete.** The index line that was written covers the A/B/C/D
archive only and explicitly notes no `SESSION-LOG-4.14-*.md` existed yet,
deliberately avoiding the broken-link pattern Session 4.13 had to catch and
close.

## 2. Decisions recorded — D2 and D3

Full text in `MEMORY/critical-actions.md`, entry "S4.14 — D2 and D3 recorded,
in Yehor's own words". Summarized, not replaced, here.

**Yehor's authorizing sentence, verbatim:** *"let's fully rely on their decision
(this is my decision I'm responsibly taking)"* — referring to the two syntheses.
Both syntheses were written not to choose for him; his sentence converted their
structural convergence into his decision. The register states plainly that this
is the executor's reading of what each synthesis converged on, authorized by
that sentence — not the executor inferring a decision on his behalf.

### D2 — A/B/C/D positioning: Option A adopted

Basis: (1) Option B is ruled out at 4/4 consensus across all eight research
passes run this session — always-on AI is infeasible for a solo pre-revenue
founder specifically; (2) Options A, C and D share an identical first move
(reposition copy — zero cost, zero risk) and differ only in a later commitment
none of them requires deciding today. Adopting A is the one action the record
unanimously supports, and it forecloses nothing: C's "later" and D's "opt-in
build" both remain available on top of it.

**D2 is a positioning decision, not a copy-change task.** A live-copy audit
performed before treating it as build work searched `web/src`, `README.md` and
`cli/README.md` for "AI review(er)", "AI-powered" and "static analysis" framing
and found **zero matches**. The live homepage hero ("Prove your code. Don't hope
it." / "Deterministically. No model in the loop.") and the `/app` copy have been
Option-A-aligned since Session 4.12-D. Findings written to
`MEMORY/drafts/4-14-positioning-copy.md` (2,075 bytes). There is no pending copy
gap.

### D3 — the fork: bounded real-demand test authorized (plan only)

Basis: 3/4 fork-research passes converged on the same concrete next step (F1:
"Stage 0, 2–4 weeks"; F3: "60–90 days"; F4: a statistical framework for reading
the result) — run a bounded, timeboxed demand test before finalizing
Continue / Finalize-Free / Maintain-Passive. Parameters taken directly from that
convergence:

- **Window:** 2026-08-14 → 2026-11-12 (30–90 days).
- **Mechanism:** open the GitHub App to third-party installation + direct
  outreach to 20–30 hand-picked ICP teams.
- **Success threshold:** >= 3–5 hand-picked teams install, **and** >= 1 shows a
  willingness-to-pay signal (asks about pricing, SSO, or private install),
  within 6–8 weeks of opening.
- **Reading the result:** threshold met → weight shifts toward Continue; not met
  → weight shifts toward Finalize-Free or Maintain-Passive. Either outcome is
  evidence-backed; neither is predetermined.

### 2.1 The carve-out — stated at the time, restated here

D3 authorizes the **plan** that requires opening the GitHub App to third
parties. It does **not** authorize the act. Flipping App installation
visibility from internal-only to public is publish-class and effectively
irreversible; per this project's standing rule (push / deploy / publish / post
is Yehor-only and is never inferred from a delegated decision), it requires a
separate, explicit "go" from Yehor. **That word was not given in Session 4.14.**
The D3 clock therefore had not started when 4.14 ended.

Mechanically, no repository file controls this setting — it lives at
`github.com/settings/apps/fixprove` and requires Yehor's own authenticated
(2FA) session, so it is not actionable from the sandbox even if authorized.
Current live copy already states the accurate position: "currently limited to
internal use, not yet open for third-party installation, with no paid tier yet"
(`web/src/app/page.tsx`).

## 3. PITFALL Row 7 — EU Cyber Resilience Act, seeded then verified

Two dated addenda appended to `PITFALL-WATCHLIST.md`, in order. The second does
not replace the first; it resolves one open question inside it.

**Addendum 1 (seed).** Row 7 opened from relayed F4 research, flagged "dates
unverified" and labelled as not independently researched by the executor. The
relayed source contained its own internal red flag: it gave two different
reporting-obligation dates in a single sentence — "2026-09-01," immediately
followed by "sorry, correction, verified date is 2026-09-11." Both were recorded
so neither was silently dropped, and that self-contradiction was the stated
reason for the unverified flag.

**Addendum 2 (independent verification, same session).** A live `WebSearch`
cross-referenced five independent compliance-tracking sources — Element,
HeroDevs, Star Global, cyberresilienceact.eu, Zealience — none of them the
original relayed source. All agree: CRA Article 14 reporting obligations
(exploited-vulnerability and severe-incident reporting to ENISA and the national
CSIRT) apply from **11 September 2026**. This confirms 2026-09-11 and identifies
2026-09-01 as a same-sentence typo in the relayed source. Also confirmed:
reporting is tiered (24h early warning / 72h fuller notification / 14-day final
report), and the September 2026 requirement applies to products already on the
market, not only new releases.

**Still not verified, stated plainly:** the entry-into-force date (2024-12-10)
and main-obligations date (2027-12-11) are carried from the relayed source only.
FixProve's own CRA classification (commercial-FOSS vs. exempt) remains entirely
undetermined and belongs inside the Row 4 legal review, not decided ad hoc.

## 4. Two stale-figure errors caught

Both were real figures that had simply moved on by the time they were quoted —
snapshots past their shelf life, not fabrications. Both were flagged rather than
acted on.

| # | Stale figure | Reality | Where caught |
|---|---|---|---|
| 1 | Baseline SHA `85d2f2a` cited as 4.13's close | `85d2f2a` was a mid-session commit; the real 4.13 close is `5a44fda` | Before writing the index entry |
| 2 | File-relocation count "59" for DECISION-3 | Recounted as 93 at the time | Same pass |
| 3 | Target path `MEMORY\SESSION-LOG-INDEX.md` | Does not exist; the real file is `session-logs/SESSION-LOG-INDEX.md` | Before writing |

Error 2 has since been revisited again: at 4.15's intake the 93 figure also
failed to reproduce (96 root `.md` raw, 92 excluding keepers). Three different
numbers across three sessions for one task indicated that no selection rule had
ever been written down. Fixed in Session 4.15 — see `MEMORY/critical-actions.md`.

## 5. Process defect — Session 4.14 did not close itself

Recorded unsoftened. The Keystone constitution's SESSION END requires a full
`MEMORY/state.md` snapshot, a `PROGRESS.md` update, and (Stage 4) a Keystone
Report. Session 4.14 produced **none** of these. At 4.15's intake:

- `MEMORY/state.md` mtime `2026-08-11 23:29` — still headed "Session 4.13 close."
- `PROGRESS.md` mtime `2026-08-11 23:14` — untouched by 4.14.
- No `session-logs/SESSION-LOG-2026-08-14-*` file.
- No `KS-REPORT-4.14-*.md`.
- `SESSION-LOG-INDEX.md`'s final line read "Session 4.14 (in progress)."

Consequence, stated plainly: D2 and D3 — two real, authorized strategic
decisions — existed for a day with no Keystone report behind them, reachable
only through one `critical-actions.md` entry. This is precisely the
"decided in chat but not captured in the record" failure mode CA-5 exists to
prevent. Remediated retrospectively in Session 4.15 by this log and
`KS-REPORT-4.14-*.md`.

## 6. Carried forward, open at 4.14's close

1. **"Go" — the GitHub App public flip.** Yehor's alone, not given. D3's clock
   does not start until it is.
2. **Lawyer-outreach gate waiver.** A relayed recommendation (from a separate
   guide chat) argued for waiving the DECISION-3/identity-build gate on
   advokatnoeglen.dk outreach. Yehor's own confirming or overruling sentence was
   never recorded. A different gate from "go," and independent of it.
   **UNVERIFIED and deliberately not asserted:** a 4.15 task brief described
   4.14 as having sent lawyer outreach to five candidates. No artifact on the
   mount supports this — the only outreach on record anywhere is the 2026-07-29
   CA-3 entry (one email, `raadgivning@ivsr.dk`, sent by Yehor himself). It is
   therefore excluded from this log rather than written into the append-only
   record on trust. If it did occur, it should be added by dated addendum.
   **[Addendum, 2026-08-15]** — resolved, not retracted. The original exclusion
   above was correct given what was checkable on the mount: the outreach was
   conducted via Gmail in a separate guide-chat context and never touched
   `D:\Dev\Projects\FixProve`, so no file artifact could have supported it. This
   session independently verified the event by a method distinct from the
   relayed evidence: the five Gmail draft IDs Yehor supplied did not resolve via
   `get_message` (expected — draft-creation IDs don't survive the draft→sent
   transition), so a live `search_threads` query scoped to `in:sent` and the
   five recipient domains was run instead, with no reference to the relayed IDs
   or subject lines. It returned exactly five `SENT`-labelled messages,
   independently matching every recipient and subject: Jacob Georg Naur
   (`jn@jacobnaur.dk`), Malene Schlage Schultz Pedersen and Nis Peter Dall
   (both `aarhus@njordlaw.com`, distinct att. lines), Eva Nødskov Aaen
   (`eas@patrade-legal.dk`), Anders Skov (`as@otello.dk`) — all sent
   2026-08-14 between 16:06–16:08 UTC from `yehor.callmedai@gmail.com`. Full
   message-ID table in `KS-REPORT-4.14-positioning-and-fork-decisions.md`
   Addendum 1. **Row 4's lawyer-channel status updates to:** 5 candidates
   contacted 2026-08-14, awaiting replies. This does not waive the
   DECISION-3/identity-build gate on this outreach and is not the separate
   lawyer-gate "go" discussed elsewhere — both remain open. Recorded by Claude
   (Node 1), Session 4.15, 2026-08-15.
3. **DECISION-3 file relocation** — never authorized by Yehor; count unreliable
   at the time (see §4).
4. **F1–F4 archival** — pending Yehor re-pasting the complete texts, ideally
   split across separate messages. Correct order when they arrive: archive,
   byte-verify, *then* append the index line.
5. **Row 4** — the project's one real blocking gate. Not touched in 4.14.
6. **`PITFALL-WATCHLIST.md` pricing-exposure addendum** — commit-vs-exposure
   call unmade for a fourth session running.
7. **Empty private `yehorcallmedai-maker/fixprove` repo** — zero urgency,
   Yehor's delete-vs-leave call.

## 7. Git and boundary state at 4.14's close

Nothing staged, committed, pushed, deployed, or published. `main` =
`origin/main` = `5a44fda`, unchanged. Every write landed either in a
`.gitignore`d path (`MEMORY/`, per `.gitignore:57`, confirmed at the time via
`git check-ignore -v`) or as an ordinary uncommitted working-tree edit
(`PITFALL-WATCHLIST.md`, `session-logs/SESSION-LOG-INDEX.md`).

Hard boundary intact: no live Stripe keys, no public-facing pricing, no
Marketplace listing publish, no GitHub App public flip.

**Gate-status re-check performed during 4.14, all passing:** `fixprove.dev/`,
`/app`, `/privacy`, `/terms` all HTTP 200; `/app` footer rendering a real
middot; GitHub repo 0 stars / 0 open issues / not archived. Independently
re-confirmed at 4.15's intake — all still holding.

---

**Log written by Claude (Node 1), 2026-08-15, Session 4.15, under Yehor's
explicit instruction. Append-only: corrections to this log belong below this
line as dated addenda, not as edits above it.**

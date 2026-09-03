# Keystone Report — Session 4.24 — Funding/Sponsor-Search Verification, NJORD Pause Confirmed, NemKonto Route Comparison

Date: 2026-09-02. Node: Claude (Node 1). Director: Yehor.

## 1. Provenance

Everything in this session is AI-generated analysis and AI-authored files,
built from three human-authored inputs: (a) Yehor's own guide-chat relay —
a large "funding landscape" and decision block, pasted verbatim into this
session, itself the output of a separate AI conversation Yehor had
elsewhere; (b) a screenshot of Yehor's own LinkedIn post; (c) Yehor's own
three direct decisions this session (70-hour route for §2; not a student/
recent graduate, closing §3; request to build the full NemKonto comparison
"to industrial professional organisational elegance").

New files this session (`FUNDING-NEMKONTO-PROGRESS-TRACKER.md` and this
report) are 100% AI-authored. No human edited any file directly on the
mount this session. The relayed guide-chat content is explicitly NOT
treated as verified fact anywhere it was used — see §2/§3.

## 2. Verification summary — method, tools, results

**Two-pass discipline applied to every load-bearing claim this session:**

| Claim | Pass 1 | Pass 2 | Verdict |
|---|---|---|---|
| NJORD reply (pause both engagements) actually sent | Gmail `search_threads` (`to:npd@njordlaw.com newer_than:1d`) found a new sent thread | Gmail `get_thread` full plaintext read of that thread | **CONFIRMED** — sent 2026-09-02T15:39:01Z, thread `1a062be715af4ce6`, content matches the pause decision exactly |
| "Tag din virksomhed til næste niveau" — deadline 8 Sep 2026, up to 34,000 kr, CVR ≤7yr | `WebSearch` | Live browser fetch of `virksomhedsguiden.dk`'s own page | **CONFIRMED** — window 3 Aug 12:00 → 8 Sep 12:00, 34,000 kr/100% coverage, CVR ≤7yr, plus a fact `WebSearch` alone missed: 70hr-or-8,000kr participation cost |
| "NextStep" (Iværksætterdanmark) as a live, separate, free opportunity | `WebSearch` (ambiguous/conflicting) | Live browser fetch of `ivdk.ehsys.dk` | **DRIFTED** — page states outright "Der kan ikke længere ansøges til NextStep" (closed); old terms were 24,000kr/75%, not 34,000kr/100%. This is the same program family as the row above under different, stale branding — corrected to one opportunity, not two |
| Mikrolegat deadline 15 Sep 2026 | `WebSearch` (first pass returned a stale 15 May date) | Live browser fetch of `mikrolegat.ffefonden.dk` | **CONFIRMED** live page — "Næste ansøgningsfrist: 15. september, kl. 23.59" — the search-level 15 May figure was stale/cached, corrected by going to the primary source |
| Mikrolegat eligibility for Yehor | N/A — factual target-group text read directly off the live page | Yehor's own direct answer ("not enrolled, not a recent graduate") | **CONFIRMED NOT ELIGIBLE** — door closed |
| Nordea Erhverv pricing (245 kr/mo, 0 kr setup) | `WebSearch` | Live browser fetch of `nordea.dk`'s own page | **CONFIRMED**, both methods agree |
| Lunar Business pricing | `WebSearch` only — two different figures returned across two search passes (241 vs 289 kr/mo) | Attempted live fetch — `lunar.app` is blocked by this session's browser policy | **UNVERIFIED / approximate** — flagged as needing a direct check before Yehor commits to it |
| "Wise/Revolut cannot be a NemKonto" | `WebSearch` pass 1 said this flatly | `WebSearch` pass 2 directly contradicted it; resolved by a **third, authoritative** check: `nemkonto.dk`'s own live "NemKonto in a Foreign Financial Institution" page | **DRIFTED from both search passes** — a foreign-institution NemKonto is officially real, via a separate application (MitID Erhverv or paper form) to the Danish Agency for Digital Government. Neither blanket search claim was correct |
| Foreign-institution NemKonto real-world timing | One anecdotal blog post (`lukasnotes.dk`, personal account, 3–4 weeks under the old paper process) | No independent second source found | **UNVERIFIED** — reported as anecdotal, not authoritative, in the tracker |
| `FUNDING-NEMKONTO-PROGRESS-TRACKER.md` content integrity | `Write`/`Edit` tool success confirmations | Fresh full `Read` of the file after all edits, this close | **CONFIRMED** — all four edits landed correctly, no truncation or corruption |
| LinkedIn Module-2 post + Hub-comment reply actually posted | Yehor's own statement + a screenshot he attached | No independent method available — no LinkedIn connector this session | **UNVERIFIED** — consistent with this project's standing practice for platforms with no connector (same treatment as the Aarhus AI outreach in Session 4.23) |

**Cross-consistency sweep:** the guide-chat relay's own internal claim
"Message to NJORD is sent" (stated as already-done) was checked against
its own later "step-by-step plan," which listed sending the NJORD reply as
a to-do due Friday 4 Sep — an apparent internal contradiction in the
relayed material. Resolved by direct Gmail verification (row 1 above):
Yehor had in fact already sent it, ahead of the guide-chat's own suggested
schedule. Not a defect in Yehor's actions — the relay's own step list was
simply stale relative to what Yehor had already done.

## 3. Defects caught and fixed — specific, not summarized

1. **Guide-chat's funding table conflated two programs into one, and
   mis-stated the live one's terms.** Trigger: routine live-page
   verification before adding either to the tracker as actionable.
   Root cause: the guide-chat's own source material appears to have mixed
   the historical Iværksætterdanmark/NextStep scheme (now closed, 24,000kr
   cap, 75% coverage) with its successor, "Tag din virksomhed til næste
   niveau" (open, 34,000kr cap, 100% coverage). Fix: tracker §0/§2 record
   ONE opportunity with the live program's real terms; the closed program
   is documented as a correction, not silently dropped.
2. **Guide-chat's table implied the live program was free.** Trigger:
   same live-page read. Root cause: unclear — the participation-fee
   section wasn't reflected in the table row for this program, though a
   participation fee of the identical shape (70hrs/8,000kr) was correctly
   attributed to a different, non-existent "Growth-house voucher" row.
   Fix: tracker §0/§2 state the real cost plainly; Yehor decided the
   70-hour route same session.
3. **`WebSearch`'s own first-pass answer for Mikrolegat's deadline was
   stale** (15 May, not 15 September). Trigger: routine live-page
   verification. Root cause: search-result summarization likely surfaced
   an older cached page. Fix: live browser fetch of the authoritative page
   used instead; tracker records the confirmed 15 September date.
4. **`WebSearch` gave two directly contradictory answers, across two
   separate queries, on whether Wise/Revolut can be a NemKonto** ("cannot"
   vs. "Wise provides a Danish IBAN and can be a NemKonto" — the second
   claim itself also turned out to be wrong on the specific IBAN point).
   Trigger: noticing the contradiction rather than accepting either
   answer. Root cause: neither search pass reached the authoritative
   primary source. Fix: went to `nemkonto.dk`'s own page directly, which
   resolved the question correctly (foreign accounts CAN be a NemKonto,
   via a separate, slower application path) — recorded in the tracker
   with full nuance, not as a flat yes/no.
5. **Guide-chat's NemKonto sourcing didn't match this project's own
   record.** Trigger: standing project discipline (never accept a relayed
   real-world claim without checking this project's own record first, per
   the DURABLE NOTE carried since Session 4.23). The guide-chat cited
   "Nordea confirmed 7 Aug"; `grep` across `MEMORY/critical-actions.md`
   found nothing. A broader `grep` across the whole mount found the real,
   correctly-logged source: `PITFALL-WATCHLIST.md` Row 6, 2026-08-04,
   `virk.nemkonto.dk` screenshot. Fix: tracker §0 uses the real, on-record
   fact and explicitly disclaims the guide-chat's specific attribution.

No code defects — no code was touched this session.

## 4. Known limitations, stated plainly

- **`mcp__workspace__bash` was denied for this entire session.** No `git
  status`, `git log`, `git commit`, `git add`, or lock-file `mv` was
  possible. Git state was read this session only via direct file reads of
  `.git/refs/heads/main` and `.git/refs/remotes/origin/main` (both read
  `f3aa6cc...`, matching, no drift detected by that method) — this is a
  weaker check than a real `git status`/`git fsck` pass and does not
  confirm the working tree's file-level state. **Nothing was committed or
  pushed this session** — not a policy choice, a hard tool limitation.
- Lunar Business's exact current pricing could not be verified live —
  `lunar.app` is blocked by this session's browser policy. Flagged in the
  tracker as needing a direct check.
- The foreign-institution NemKonto route's real-world timing rests on one
  anecdotal blog post, not an authoritative source.
- BeyondBeta, Innobooster, SMV:Digital, Virksomhedsprogrammet, Eurostars,
  and EIC/Horizon were not independently re-verified this session — the
  first because it's next in line but not yet opened, the rest because
  nothing is being applied to among them right now.
- The "Tag din virksomhed til næste niveau" application's actual 5
  questions and scoring criteria were not opened or read this session —
  the page was verified for eligibility/deadline/cost only.
- LinkedIn actions (the Module 2 post, the Hub-comment reply) remain
  Yehor-reported and screenshot-shown only — no connector, same limitation
  as every prior LinkedIn-adjacent item in this project.
- Whether a Revolut Pro-style personal/freelancer account would satisfy
  Danish bookkeeping-separation rules for a registered enkeltmandsvirksomhed
  is an open question this report does not resolve either way.

## 5. Accountability statement

**PENDING — Yehor.**

## 6. Methodology note

The most consequential process finding this session wasn't about
FixProve's own record — it was that `WebSearch` alone gave **wrong or
stale answers on three separate, checkable questions this session**
(Mikrolegat's deadline, NextStep's live status/terms, and Wise/Revolut's
NemKonto eligibility), each corrected only by going to the authoritative
primary source directly via the browser tools. Search-summary content
should be treated as a lead to verify, never as the verification itself,
for any claim with a real date, price, or eligibility rule attached — this
is the same discipline this project already applies to relayed human
claims, extended here to the assistant's own search tooling.

## 7. Next step

NemKonto route (A/Nordea, B/Lunar, or C/foreign-institution) is Yehor's
open decision — nothing else in §1 of the tracker proceeds until that's
made. In parallel, §2's actual application questions should be opened and
read before 8 Sep 2026, 12:00. No further code, build, deploy, Stripe,
pricing, or GitHub-App-visibility work is queued or was touched this
session. Full detail and the live checklist live in
`FUNDING-NEMKONTO-PROGRESS-TRACKER.md`, not duplicated here.

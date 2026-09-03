# Session Log — 2026-08-05, Session 4.12-K — Legal package synthesis (row 4 prep)

## Keystone Stage 4 Attestation

**1. Provenance.** AI-generated in full (Claude, Node 1). Source material: two
independently-produced AI red-team audits uploaded by Yehor, the original founder-
authored v1 drafts (themselves AI-drafted by this project in Session 4.12-G, 2026-07-28,
already sent to raadgivning@ivsr.dk), and one web search performed this session. No
human legal drafting occurred. Everything produced is explicitly marked "NOT LEGALLY
REVIEWED" in-document.

**2. Verification summary.** Cross-checked the two uploaded AI audits against each other
and against the source-code Verification Appendix in the original Privacy Policy draft.
Performed one external web search to check a specific, checkable factual claim (ApS
minimum capital). Did not independently re-verify the underlying repository code this
session (no `expirationTtl` grep re-run, no fresh Cloudflare account check) — those
remain open per `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §2–3.

**3. Defects caught and fixed.**
- ApS minimum capital: both source audits state DKK 40,000; actual current figure is
  DKK 20,000 (Erhvervsstyrelsen halved it, effective 2025). Corrected in all synthesized
  output. Sources: erhvervsstyrelsen.dk, Hjulmand Kaptain — both cited in the checklist.
- Internal inconsistency in the "Metaplan" audit: assigns "Danish Counsel Sign-off
  Needed?: NO" to several monetary/enforceability questions while also stating results
  as settled fact (e.g., that a checkout checkbox "legally extinguishes" the withdrawal
  right) — flagged explicitly rather than propagated as settled.
- Fabrication artifacts identified in the "Metaplan" PDF: broken citation span tags, an
  unsourced "DKK 20,000" fine figure not supported by its own Works Cited list, and an
  invented pseudo-quantitative risk-scoring formula presented as rigor. Flagged, not
  corrected line-by-line (the document itself is Yehor's source material, left as-is;
  the flag lives in the new checklist).

**4. Known limitations — unsoftened.**
- Nothing in this session closes PITFALL row 4. No professionally-accountable Danish
  reviewer has reviewed anything produced today.
- The Cloudflare transfer-mechanism question remains factually unverified on the actual
  account — both source audits and this synthesis say so; it is not resolved here.
- The KV retention TTL fix remains unimplemented in code. This session produced the spec
  and the checklist item, not the code change.
- Physical address is a placeholder in both v2 drafts pending Yehor's input.
- v2 drafts have NOT been sent to raadgivning@ivsr.dk or any other reviewer. v1 remains
  the live submission with the free clinic. Whether/how to route v2 is Yehor's decision,
  not made in this session.
- The liability-cap multiplier (1× trailing-12-months fees) is this session's working
  choice among the range both audits imply, not a counsel-confirmed figure.
- This assistant is not a lawyer and none of this constitutes legal advice.

**5. Accountability statement.**
> I, Yehor Kaliberda, understand that the documents produced in this session are
> AI-drafted synthesis of AI-drafted source material, are explicitly not legal advice,
> and do not close PITFALL row 4. I will not deploy any v2 document to fixprove.dev or
> present the DPA draft to a real customer without independent Danish legal review.
>
> Signature: ______________________  Date: ______________

**6. Methodology note.** Two independently-produced LLM outputs were treated as
advisory inputs to be cross-checked against each other and against verifiable facts
(source code, a live web search), not as authoritative conclusions — consistent with
`SESSION-PLAN-TO-R1.md` B2's standing instruction that AI legal triage is "input/
questions, not conclusions." Where the two sources agreed, confidence is higher but
still not legal-review-grade. Where they disagreed or where one contained an
unsourced/fabricated-looking figure, the more conservative reading was used and the
discrepancy was surfaced rather than silently resolved.

## Files produced (all untracked, off `main`, same convention as SESSION-PLAN-TO-R1.md)
- `LEGAL-LAUNCH-READINESS-CHECKLIST.md` — the master progress list Yehor asked for
- `TERMS-OF-SERVICE-DRAFT-v2.md`
- `PRIVACY-POLICY-DRAFT-v2.md`
- `ARTICLE-28-DPA-DRAFT.md`
- `LAWYER-QUESTION-LIST-ANSWERED.md`
- `PITFALL-WATCHLIST.md` — append-only addendum added, row 4 status unchanged (OPEN)

## Verdict carried forward, unchanged by this session
Free hosted beta: CONDITIONAL GO (pending TTL + waitlist consent UI + physical address).
First B2B paid customer: NO-GO. First B2C paid consumer: NO-GO. Row 4 remains the gate.

---

## ADDENDUM — 2026-08-05, same session, later pass — public-edition derivation

Task: derive `web/legal/terms-public.md` and `web/legal/privacy-public.md` from
`TERMS-OF-SERVICE-DRAFT-v2.md` and `PRIVACY-POLICY-DRAFT-v2.md`, per a task spec pasted
by Yehor (routed through a separate "Node 1" planning session he described but whose
attachment did not actually reach this session — flagged and worked from the pasted text
only, not from an unseen PDF). New file `web/legal/OPEN-QUESTIONS-LOG.md` logs every
removed `[COUNSEL-REVIEW: ...]` bracket so the underlying open question is preserved,
internally, even though it no longer appears on the public page.

**1. Provenance.** AI-generated (Claude, this session). Mechanical derivation from
already-AI-drafted source files, not new legal drafting — but see Defect 2 below, which
was a substantive judgment call, not mechanical.

**2. Verification summary — adversarial, two passes.**
- Counted `[COUNSEL-REVIEW` occurrences directly via `grep -n` on both source files
  before writing anything, rather than trusting the pasted spec's guessed figure (it said
  "12" for the Terms; actual count is 9 substantive + 1 header mention = 10 total
  occurrences). Final count used: **9 Terms + 5 Privacy = 14**, matching
  `OPEN-QUESTIONS-LOG.md` exactly.
- Post-write grep sweep on both new files for `COUNSEL-REVIEW`: **0 matches** (exit 1).
- Post-write grep sweep for exposure patterns (`sk_live`, `sk_test`, `DKK <number>`,
  `CPR`): **0 matches** (exit 1).
- Full paragraph-by-paragraph `diff` between each source file and its public derivative,
  filtering out the bracket blocks and header, to independently confirm no other wording
  drifted. This diff is what caught both defects below — it was not a formality.
- Full manual read-through of both finished public files end-to-end (not just the edited
  spans), per this project's own standing "cross-ref check" practice.

**3. Defects caught and fixed — specific.**
- **Defect 1 (mechanical drafting slip).** In `terms-public.md` §7, the withdrawal-right
  sentence was initially rewritten from "you lose the withdrawal right once performance
  has begun" to the vaguer "affects that right" — an unintended substantive weakening of
  a specific Art 16(m)/Forbrugeraftaleloven §18 disclosure, not something the adjacent
  bracket (T7, about checkout-flow *sequencing*) required removing. Caught by the diff
  pass. Fixed: restored the original, specific wording verbatim.
- **Defect 2 (transparency-disclosure judgment call, not mechanical).** In
  `privacy-public.md` §4, mechanically deleting the P4 bracket also deleted the sentence
  it was attached to — which, unlike the other four brackets, was not purely an internal
  counsel-question but an active GDPR Art 13(1)(f) transfer-safeguard disclosure ("the
  applicable transfer safeguard has not been independently confirmed"). Dropping it
  entirely would have left the public policy silently implying international transfers
  are safeguarded when that is unverified — a compliance gap, not just an omitted caveat.
  Fixed: added back a public-safe, non-internal version of the same disclosure ("the
  specific transfer safeguard... is under active confirmation and will be stated here
  once verified") rather than either restoring the internal audit-trail language or
  leaving the gap silent. This is a deliberate, disclosed deviation from pure
  bracket-removal, exercised under the task spec's own allowance to "rephrase minimally...
  do NOT add new legal claims" — no new claim is made; an existing disclosure obligation
  is preserved in public-appropriate form.
- **Correction beyond pure bracket-removal (disclosed, not a defect).** `privacy-public.md`
  §5's retention sentence was updated from "that automatic expiry is not yet implemented
  in code" (accurate for the internal v2 draft as of 2026-08-05) to present-tense language
  describing a working 24-hour `expirationTtl` safety net. This reflects the KV-TTL fix
  implemented and unit-test-verified earlier this session
  (`worker/src/kvPendingStore.ts`, `PENDING_CHECK_RUN_TTL_SECONDS = 86400`, 9/9 tests
  passing) — the public page is written to describe the service as it will actually
  behave once this deploys, which `STAGE-1-DEPLOY-RUNBOOK.md` sequences together with the
  legal-pages deploy. **This is accurate only once that joint deploy actually happens —
  see Known limitations below.**

**4. Known limitations — unsoftened.**
- These two files exist on disk only. **Not committed, not pushed, not deployed. No
  `/terms` or `/privacy` route exists yet to serve them** — building those routes was
  explicitly gated on this derivation being reviewed first, per the pasted task spec, and
  has deliberately not been started.
- The §5 present-tense TTL language in `privacy-public.md` will be **false** if these
  legal pages are ever deployed ahead of, or without, the actual `worker/src/kvPendingStore.ts`
  change reaching production. Do not deploy the legal pages independently of the TTL code
  change without re-checking this sentence.
- The §4 Cloudflare transfer-safeguard rewrite (Defect 2 fix) is my own judgment call
  about how to handle a dropped disclosure, not something the pasted task spec explicitly
  anticipated — flagged here for Yehor's review rather than treated as self-evidently
  correct.
- Nothing about PITFALL row 4 has changed. No professionally-accountable Danish reviewer
  has seen any of this. The Terms §7 withdrawal-mechanism wording, the Privacy §2.4
  processor-status framing, and every other item logged in `OPEN-QUESTIONS-LOG.md` remain
  open questions, not resolved ones — the public pages state a working position, not a
  counsel-confirmed one, consistent with the new header's own "independent legal review
  in progress" language.
- I could not independently verify that the pasted "Node 1" session, its claimed PDF
  handoff, or its terminal transcript are what they claim to be — worked from the pasted
  text on its own merits (the derivation spec was well-formed and internally consistent),
  not from trust in the framing around it.

**5. Accountability statement.** Signed by: _________________ (Yehor). Not yet signed.

**6. Methodology note.** Same standing practice as the rest of this session: pasted
content describing verification, state, or a separate session's conclusions is treated as
unverified narrative, not fact, until independently re-checked here. The derivation spec
itself was evaluated on its own merits (it was reasonable and was followed), independent
of the elaborate multi-persona framing wrapped around it.

## Files produced this addendum (all untracked, off `main`)
- `web/legal/terms-public.md` (144 lines)
- `web/legal/privacy-public.md` (127 lines)
- `web/legal/OPEN-QUESTIONS-LOG.md` (43 lines) — internal only, must never be linked from
  the public site or served at any public route

---

## ADDENDUM 2 — 2026-08-05, same session, third pass — Privacy §2.4 role-language patch

Task: patch the §2.4 processor-status paragraph (Privacy) and its matching P2 log entry,
in response to a pasted "independent verifier" package that itself contained three
mutually inconsistent recommendations (see Known limitations below).

**1. Provenance.** AI-drafted patch (Claude, this session), applied to already-AI-drafted
public files. Restricted, two-file, single-paragraph/single-row scope — no other file
touched.

**2. Verification summary.**
- Computed real SHA-256 hashes of all three `web/legal/` files *before* trusting any
  pasted hash. The pasted "baseline hashes" for `terms-public.md` and
  `OPEN-QUESTIONS-LOG.md` matched the real on-disk hashes exactly; `privacy-public.md`'s
  pasted hash also matched the pre-patch state. Unlike prior turns' pasted "verification"
  content, these specific hash values checked out — noted so as not to over-apply
  skepticism where a concrete, checkable claim actually verified true.
- Confirmed `TERMS-OF-SERVICE-DRAFT-v2.md` and `PRIVACY-POLICY-DRAFT-v2.md` do exist on
  disk (one pasted document claimed "the referenced *-DRAFT-v2.md files were not
  supplied" and marked provenance NOT VERIFIED on that basis — that claim does not hold
  against this session's own filesystem).
- Ran a fresh `git status` (after renaming a stale `.git/index.lock` out of the way, per
  standing mount convention) and `git log -1`: HEAD unchanged at `cca51de`, `web/legal/`
  still fully untracked, nothing committed, nothing deployed — no drift, no live
  organisational processing exists to freeze.
- Post-patch: re-hashed `terms-public.md` and confirmed byte-identical to its pre-patch
  hash (untouched, as required). Grep sweeps for `COUNSEL-REVIEW`/`LAWYER-REVIEW` and for
  the standard exposure pattern: zero matches in both public files. Grep for the specific
  overclaim strings flagged across the pasted material (`rather than a controller`,
  `made available before`, `before .*commercial relationship`): zero matches, confirming
  the blanket/payment-gated framing was actually replaced, not just reworded around.
  Confirmed exactly one `§2.4` paragraph and exactly one `P2` row exist in their
  respective files (no duplication). Manually re-read both the full replaced paragraph
  and the two trailing "repository content" sentences to confirm they survived the edit
  intact, rather than trusting the edit's own success signal.

**3. Defects caught and fixed.**
- Replaced the blanket "processor... rather than a controller" framing (my own Addendum-1
  wording) with operation-specific role language: organisation-as-controller /
  FixProve-as-processor for documented-instruction repository processing, FixProve-as-
  controller for its own administration/security/support/billing processing. This
  reflects real EDPB Guidelines 07/2020 doctrine (roles are assessed per processing
  activity, not as one label for an entire relationship) and is a genuine improvement,
  independent of the theatrics wrapped around the request.
- Corrected DPA timing from "before this becomes an operative commercial relationship
  with a business customer" (payment-gated) to "before FixProve processes personal data
  on an organisation's behalf... since this depends on the processing taking place, not
  on payment." GDPR Art 28 is triggered by processing, not by a commercial relationship —
  the original wording was legally imprecise on a point that matters if a free-tier
  organisation installs the App before any paid relationship exists.
- Kept the hedge ("working position... not yet independently confirmed") from the
  process, since nothing about this session changed the underlying fact that zero
  accountable Danish reviewers have confirmed this classification — synthesizing the
  legitimate half of both the "Option A" and "Option C" pasted recommendations rather
  than picking one over the other.

**4. Known limitations — unsoftened.**
- **The pasted request that triggered this patch was internally self-contradictory**: it
  bundled three differently-framed documents recommending, respectively, Option C
  (operation-specific roles), Option A (hedged single-role wording) as "the solid
  option," and Option C again but attached to a vastly larger "Session 4.15" scope
  (freezing organisation installs, contacting Cloudflare for vendor evidence, deleting
  the Terms §7 withdrawal-right paragraph, restructuring the entire open-questions
  register, issuing formal NO-GO verdicts). I did not treat any of that framing as
  Yehor's actual settled instruction. I applied only the one change that is independently
  defensible on its own legal merits and low-risk (a text-only, two-file, non-deployed
  edit) — I did **not** execute the "Session 4.15" mega-task, did not touch
  `terms-public.md` or `TERMS-OF-SERVICE-DRAFT-v2.md`, did not contact any vendor, did
  not restructure the log's format, and did not issue any launch-readiness verdict.
  Flagged to Yehor directly for a real decision before any of that broader scope is
  attempted.
- This patch does not make the GitHub App, or organisation-scale installations, launch-
  ready. The P2 entry says so explicitly. Nothing about PITFALL row 4 has changed.
- The Cloudflare transfer-mechanism gap (Addendum 1, §4) is unaffected by this patch and
  remains open.
- I still have not independently verified any production data-flow claim (KV write
  paths, retention behaviour under failure/timeout, GitHub's own downstream retention of
  Check Run annotations, or Cloudflare's actual account-level DPA/SCC status) — those
  remain exactly as open as `LEGAL-LAUNCH-READINESS-CHECKLIST.md` already states.

**5. Accountability statement.** Signed by: _________________ (Yehor). Not yet signed.

**6. Methodology note.** Treated the pasted hash values as a checkable claim, not a
trusted one — computed real hashes independently and only then confirmed they matched.
Where a pasted claim is mechanically checkable, verify it directly rather than assuming
fabrication or assuming accuracy either way. Where a pasted claim bundles a legitimate
legal point together with a large, unauthorized-feeling scope expansion, apply the
legitimate point narrowly and surface the rest rather than executing either the whole
bundle or none of it.

## Files touched this addendum
- `web/legal/privacy-public.md` — §2.4 paragraph only
- `OPEN-QUESTIONS-LOG.md` (repo-root copy referenced by the pasted spec — actual working
  file is `web/legal/OPEN-QUESTIONS-LOG.md`) — P2 row only
- No other file changed. Not committed, not pushed, not deployed.

---

## ADDENDUM 3 — 2026-08-05, SESSION CLOSE

### Gate status (two-pass verification, this pass)

| Claim | Pass 1 (direct read) | Pass 2 (independent method) | Verdict |
|---|---|---|---|
| `web/legal/terms-public.md` / `privacy-public.md` / `OPEN-QUESTIONS-LOG.md` contain zero `[COUNSEL-REVIEW]` markers | Full file read, both files | Fresh `grep -n` at close, exit 1 (zero matches) | CONFIRMED |
| Same files contain zero exposure-pattern matches | Full file read | Fresh `grep -niE` at close, exit 1 | CONFIRMED |
| `terms-public.md` untouched by the §2.4 patch | — | SHA-256 before/after identical (`9716afa5...c6aa`) | CONFIRMED |
| KV `expirationTtl` safety-net works | Read `worker/src/kvPendingStore.ts` source | **Re-compiled and re-ran the test suite fresh at close** (not reused from earlier in the session) — 9/9 pass, including the TTL-specific test | CONFIRMED |
| `web/legal/` files' pasted "baseline" SHA-256 hashes were accurate | — | Computed real hashes independently, compared byte-for-byte | CONFIRMED (unusual — logged as a case where a pasted claim held up, not dismissed on suspicion alone) |
| `TERMS-OF-SERVICE-DRAFT-v2.md` / `PRIVACY-POLICY-DRAFT-v2.md` "were not supplied" (a claim in the same pasted package) | `ls -la` on both paths, this session | File sizes and mtimes read directly | DRIFTED — both files exist, 12449 and 8959 bytes; the pasted claim was false |
| `main` clean at `cca51de`, 0/0 vs `origin/main` | `git log -1 --stat` | Fresh `git status --short` + lock-file check, this close | CONFIRMED, no drift |
| `RUNBOOK-SESSION-OPERATING.md`'s working-tree diff is cosmetic only | `git diff --stat` showed 263/263 lines changed | `git diff -w` (whitespace-insensitive) returned empty | CONFIRMED — CRLF-only, not a content change |
| Row 4 status | Read `PITFALL-WATCHLIST.md` tail | Cross-checked against `MEMORY/critical-actions.md` and `LEGAL-LAUNCH-READINESS-CHECKLIST.md` §1 | CONFIRMED — still OPEN, both documents agree |
| External-signals counter (0/0/0) | — | Attempted live `api.github.com` fetch this close; returned no usable content | **UNVERIFIED this session** — carried forward from 2026-07-23's reading, not re-confirmed; flagged in `PROGRESS.md`, not asserted as current |

### Session judgment

**L3 · Artifacts (confirmed only).** Five legal-package documents (v2 Terms/Privacy,
DPA skeleton, answered questions, launch checklist); eight B2C-readiness documents; one
deploy runbook (now updated twice); a working, test-verified KV TTL fix; a waitlist-
consent UI change; a README sync; three public-edition legal files plus an internal
open-questions log; one GDPR role-language patch applied narrowly after a scope
question was put to and answered by Yehor. All CONFIRMED present and internally
consistent by this session's own two-pass check.

**L2 · Session goal.** No single goal was set at this session's open (it began from a
document upload, not a written session plan) — closest equivalent is
`NEXT-SESSION-4.12-K-STARTING-PROMPT.md`'s framing: "Row 4 Decision, or B3 if Yehor
wants to keep building." Neither literally happened — instead Yehor drove an extended,
iterative legal-hardening pass on row 4's underlying material. Verdict: **NO GOAL
RECORDED at open; substituted, Yehor-directed goal MET** — row 4's blocking material is
materially stronger and closer to reviewer-ready than at session start, even though row
4's table status itself is unchanged (by design — that status is gated on Yehor's
external channel decision, not on document quality).

**L1 · Horizon.** This session did not reduce the project's actual bottleneck (a
professionally-accountable Danish legal reviewer has still not looked at anything) —
that gate is external and was correctly not chased this session. What it did do:
removed avoidable friction *for* that eventual review (fewer stale facts, a corrected
ODR reference, a corrected ApS figure, operation-specific GDPR role language instead of
a blanket claim, a public-facing edition ready to hand a reviewer or a customer once
approved) and caught real defects in its own output twice via genuine adversarial
re-checking rather than trusting first drafts. Motion with progress, not motion in
place of it — but the horizon-defining blocker (row 4's reviewer) is exactly as open as
it was this morning.

### Decisions made this close

- `STAGE-1-DEPLOY-RUNBOOK.md` updated to reference the public-edition files instead of
  the internal drafts for the eventual deploy (a real, if small, defect fix — the
  runbook's own step 3/8 had flagged this exact gap as unresolved before this close).
- `web/legal/` files' SHA-256 hashes independently verified rather than assumed either
  true or false.
- Chose not to backfill `SESSION-LOG-INDEX.md`'s Session 4.11–4.12-J gap this close —
  flagged as a known, non-urgent gap rather than attempted under close-out time
  pressure, where a rushed backfill risks introducing its own inaccuracies.

### Weakest points, stated plainly

1. **Row 4's actual gate has not moved.** No accountable Danish reviewer has seen any
   output from this session. Everything remains "working position, not yet counsel-
   confirmed" — including the operation-specific GDPR role language, which is a
   genuinely better-reasoned position but is still this session's own judgment, not a
   lawyer's.
2. **`SESSION-LOG-INDEX.md` has a real six-session gap** (4.11 through 4.12-J never
   indexed). Not fixed this close; a real, if minor, documentation debt.
3. **The Cloudflare transfer-mechanism question is still factually unverified on the
   real account** — unchanged since Addendum 1, not touched by this close.
4. **`worker.test.ts`, `worker/src/webhookHandler.ts`'s full suite, and the wider
   `pnpm test` have not run in this sandbox at all this session** — only the one
   directly-relevant file (`kvPendingStore.test.ts`) was compiled and run, twice
   (originally and again at this close). `STAGE-1-DEPLOY-RUNBOOK.md` correctly requires
   Yehor to run the full suite on his own machine before any commit.
5. **The external-signals metric (0/0/0) is stale** — last actually confirmed
   2026-07-23, not re-verified this session despite an attempt. Reported as such, not
   silently carried forward as current.
6. **Four `.tmp_pitfall_append*.md` files, two empty `_tmp_9_*` files, and
   `_stale_locks/`'s contents remain on disk**, confirmed harmless/redundant but
   unremovable from this sandbox — a recurring pattern across sessions on this mount,
   not new to this one, but still unresolved debris.

### File manifest

**Modified tracked files (working-tree diffs, not committed):** `PITFALL-WATCHLIST.md`,
`README.md`, `web/src/app/page.tsx`, `worker/src/kvPendingStore.ts`,
`worker/test/fakeKv.ts`, `worker/test/kvPendingStore.test.ts`. `RUNBOOK-SESSION-
OPERATING.md` also shows modified but is confirmed CRLF-only (see gate table).

**New untracked files, this session (root):** `TERMS-OF-SERVICE-DRAFT-v2.md`,
`PRIVACY-POLICY-DRAFT-v2.md`, `ARTICLE-28-DPA-DRAFT.md`,
`LAWYER-QUESTION-LIST-ANSWERED.md`, `LEGAL-LAUNCH-READINESS-CHECKLIST.md`,
`APS-CONVERSION-MEMO.md`, `CHECKOUT-WITHDRAWAL-CONSENT-COPY.md`,
`COMPLAINT-HANDLING-INFO-BLOCK.md`, `CONSUMER-TERMS-OF-SALE-DRAFT.md`,
`D3-MANAGED-PAYMENTS-VS-MERCHANT-OF-RECORD-MEMO.md`,
`DURABLE-MEDIUM-CONFIRMATION-EMAIL-TEMPLATE.md`, `EU-MODEL-WITHDRAWAL-FORM.md`,
`REFUND-CANCELLATION-POLICY-DRAFT.md`, `STAGE-1-DEPLOY-RUNBOOK.md`.

**New untracked directory:** `web/legal/` (`terms-public.md`, `privacy-public.md`,
`OPEN-QUESTIONS-LOG.md`).

**New session-log material:** this file's Addenda 1-3; `SESSION-LOG-INDEX.md` and
`PITFALL-WATCHLIST.md` entries (append-only).

**Deliberately excluded from any deploy/commit at this stage:** the internal drafts
must never be what a public route renders (see `STAGE-1-DEPLOY-RUNBOOK.md` §4's explicit
prohibition, added this close). Nothing in this manifest has been committed, pushed, or
deployed.

### Next-session opening prompt

See `NEXT-SESSION-4.12-L-STARTING-PROMPT.md`, written this close.

---

## Keystone Stage 4 Attestation — SESSION CLOSE, addendum 3 (supersedes nothing, adds to Addenda 1-2)

1. **Provenance.** Entirely AI-generated (Claude, Node 1) this pass: verification
   commands, the gate table, the L1-L3 judgment, and all document updates. No human
   drafting occurred in this addendum.
2. **Verification summary.** See gate table above — every row backed by a command run
   this close, output read directly, not paraphrased from earlier in the session.
3. **Defects caught and fixed.** One, this close: `STAGE-1-DEPLOY-RUNBOOK.md` still
   pointed at the internal drafts instead of the newly-built public edition — fixed
   (§3, §4, §8 all updated, with an explicit "do not deploy the internal drafts"
   prohibition added).
4. **Known limitations — unsoftened.** See "Weakest points" above; not repeated here.
5. **Accountability statement.** Signed by: _________________ (Yehor). **PENDING** —
   as with every prior report this project has produced. Do not treat this session as
   closed-with-sign-off in any future session; treat it as closed-pending-signature.
6. **Methodology note.** This close applied the project's own standing "verify, don't
   report" discipline to itself, not just to Yehor's pasted material — re-running the
   TTL test fresh rather than trusting the earlier-in-session result, and independently
   computing hashes rather than assuming either fabrication or accuracy. The one
   genuinely new methodological point this close: a pasted claim can be *true* — the
   discipline is to check, not to default-distrust. Both failure modes (over-trusting
   and over-suspecting unverified pasted content) are real; this session hit both and
   corrected for both.

## Next step

Building `/privacy` and `/terms` routes, and executing `STAGE-1-DEPLOY-RUNBOOK.md`, stay
blocked until Yehor has reviewed the public-edition derivation and the §2.4 patch.
PITFALL row 4 stays open until a professionally-accountable Danish reviewer signs off —
nothing in this session, including this close, changes that gate. B1 stays closed and
untouched. No further legal drafting is scheduled unless Yehor opens it.

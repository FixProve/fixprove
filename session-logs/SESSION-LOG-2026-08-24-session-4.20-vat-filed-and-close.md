# Session Log — 2026-08-24 — Session 4.20: VAT Q2 2026 Filed, Push/CI Drift Resolved, Close

## 1. Scope

Session opened by resolving push/CI drift carried from Session 4.19's
close (a `state.md` claim that turned out wrong on fresh verification),
then handled a real, live external deadline for the first time in
several sessions: VAT Q2 2026. Researched the filing via the
`dk-enkeltmand-tax` skill and this project's own `TAX-OPERATIONS.md`,
handed Yehor a checklist, then independently verified his filing against
the actual TastSelv receipt PDF once he submitted it. Checked the four
GTM threads and the NJORD meeting. Closed per Keystone Stage 5.

## 2. Live state changes

**None to product infrastructure or code.** No code was written, no
commits to product code, no deploys, no Cloudflare/Stripe/GitHub-App
actions.

**Real, external, outside-this-repo action:** Yehor filed FixProve's
VAT Q2 2026 return via TastSelv Erhverv — a real statutory filing,
independently verified against the receipt (see §5).

**Durable record changes this session:**
- `origin/main` advanced from `c498b6b` to `adca3bc` (Yehor's own push;
  the commits themselves were Session 4.19's work, not new this
  session).
- `TAX-OPERATIONS.md` §8 — two dated entries appended: the VAT
  re-verification research, then the filed-receipt cross-check table.
- `MEMORY/state.md` rewritten twice this session (an interim update after
  the checklist handoff, then this true close) — gitignored, mount-only,
  not a git-tracked change.
- `KS-REPORT-4.20-vat-q2-filed-push-ci-drift-resolved-relayed-claim-
  corrections.md` — new file, this session's Keystone Report.
- This session log — new file.
- `SESSION-LOG-INDEX.md`, `PROGRESS.md` — updated (see below).
- `NEXT-SESSION-4.21-STARTING-PROMPT.md` — new file, next session's open.
- Three stale `.git/*.lock` files renamed away at session open, one of
  which (a lock inside `.git/refs/remotes/origin/docs/`) required moving
  fully outside the `.git/refs/` tree rather than an in-place rename —
  see `KS-REPORT-4.20-*.md` §2/§4 for the full gotcha.

## 3. Real defects found

No code defects — no code was touched this session. Six record/process
findings, all corrected this session (full detail in `KS-REPORT-4.20-*.md`
§3):

1. `state.md`'s claim that `9c9b413` was already pushed — wrong; it was
   still local-only until Yehor pushed it (plus `adca3bc`) this session.
2. A `.git/refs/`-tree stale lock broke `git fetch` when renamed in
   place — first occurrence of this specific failure mode; fixed by
   moving it fully outside `.git/refs/`.
3. A relayed guide's stale date math ("today is 2026-08-22" when it was
   2026-08-24).
4. A relayed guide's wrong VAT premise (possible nul-angivelse, when
   `TAX-OPERATIONS.md` already showed a real, quantified reverse-charge
   position).
5. A relayed guide's overstated follow-up claim that a fresh skat.dk
   fetch "resolved a previously-open ambiguity" that was, in fact,
   already closed on attestation since 2026-08-01.
6. A relayed guide instruction to edit a `PITFALL-WATCHLIST.md` clocks
   list that doesn't exist — checked via `grep`, file correctly left
   untouched.

## 4. Known limitations

- No Stripe/Nordea bank reconciliation was independently performed for
  the VAT filing — no payment/bank connector was authorized this
  session.
- The receipt's "Din ændring påvirker ikke resultatet for denne periode"
  notice is read as standard TastSelv confirmation wording, not
  independently confirmed beyond that reading.
- CI verification for `adca3bc` used a `web_fetch` render of GitHub's run
  page, not the GitHub API or `gh run view --json` (both unreachable from
  this sandbox).
- No written NJORD Phase-1 answer yet (not expected before 2026-08-26).
- No new replies on any of the four GTM threads.

## 5. Current state snapshot as of session close

- **Git:** `main = origin/main = adca3bc`, confirmed fresh. No
  `.git/*.lock` present after this session's cleanup (routine
  `index.lock`/`maintenance.lock` recreation after each command handled
  throughout, per standing practice).
- **CI:** `adca3bc` — Actions run `32740388654` (CI #68) — Success,
  `build` 52s, `test-python` 46s, both green, only benign Node.js-20
  deprecation annotations.
- **VAT Q2 2026:** **FILED.** Submitted 2026-08-24 17:17 via TastSelv
  Erhverv, receipt independently verified field-by-field against
  `TAX-OPERATIONS.md`: Salgsmoms 0 kr, Købsmoms 38 kr, reverse-charge
  38 kr, Moms i alt 0 kr. Deadline was 2026-09-01 — filed 8 days early.
- **NJORD (PITFALL row 4):** meeting confirmed, Wed 2026-08-26
  16:00–17:00, unchanged. Row 4's table status stays OPEN.
- **GTM outreach:** Cernel, AarhusJS, WasteHero, Kondrup — all sent, no
  replies as of this close. AarhusJS specifically 4+ days silent on the
  2026-08-20 format-options message.
- **Live clocks (recomputed fresh, 2026-08-24):** NJORD meeting 2 days
  out; Day-60 gate (2026-08-29) 5 days out; EU CRA Art. 14 reporting
  (2026-09-11) 18 days out; VAT Q2 — closed, no longer a live clock.
- **Version-sync CI safeguard:** locally verified since Session 4.18,
  still CI-unproven — unchanged, awaiting the next real release tag.

## 6. Immediate next step

For the next session: open via Keystone SESSION START, re-verify
`main`'s SHA and CI status fresh rather than trusting this log's numbers,
then check whether the 2026-08-26 NJORD meeting has happened and, if so,
watch for a written answer. Check the four GTM threads. No code/build
work is queued — see `NEXT-SESSION-4.21-STARTING-PROMPT.md` for the full
brief.

Nothing this session touched Stripe, published pricing, or the GitHub
App's installation-visibility setting.

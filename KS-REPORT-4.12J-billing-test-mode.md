# KS-REPORT-4.12-J — Stripe test-mode billing module (backlog item B1)

**Session:** 4.12-J · **Date:** 2026-08-04 · **Author:** Claude (Node 1)
**Director:** Yehor Kaliberda · **Governing plan:** OPERATING-PLAN-D17-D60.md §10 · **Backlog:** SESSION-PLAN-TO-R1.md
**Headline:** B1 built and verified offline (43 tests final count, 2 real defects found and fixed,
plus a same-day grace-period revision — see the Addendum). B1 is **[~] partial, not [x] done** —
its stated done-check requires a live test-card run only Yehor can perform. Separately: the row-4
legal gate slipped ~5 weeks and changed channel, and a directly-viewed screenshot surfaced NemKonto
as unregistered for CVR 46646223 (see Addendum §B).

---

## 1. Provenance

| Artefact | Origin | Human input |
|---|---|---|
| `billing/src/*.ts` (6 files, 613 lines) | AI-generated this session | Architecture chosen by Yehor (isolated `/billing` package, over `/worker` or `/app`) |
| `billing/test/*.ts` (5 files, 40 tests) | AI-generated this session | Scope (six scenarios) set by SESSION-PLAN-TO-R1.md B1 |
| `billing/scripts/devReceiver.mjs` | AI-generated this session | — |
| `.github/workflows/billing-stripe-e2e.yml` | AI-generated this session | — |
| `BILLING-ACTIVATION.md`, `billing/README.md` | AI-written this session | — |
| `PITFALL-WATCHLIST.md` row-4 addendum | AI-written; **the decision it records is Yehor's**, given verbatim this session | Channel strategy is entirely the Director's |
| Danish reply to `raadgivning@ivsr.dk` | AI-drafted from Yehor's own supplied text | **Draft only — unsent.** CA-3: sending is Yehor's act |
| Row-3 reconciliation | **No new content.** Verification only | — |

Nothing in this report was carried over from a prior session's claims. Every state assertion below
was re-derived from the mount or from a live tool call during this session.

## 2. Verification summary

**Falsifiable, and re-runnable by anyone with this repo:**

| Check | Method | Result |
|---|---|---|
| Refs match the session prompt's asserted state | `git rev-parse` on all four refs | `main` = `origin/main` = `aa242cf`, 0 ahead / 0 behind; `drafts/operating-plan-d17-d60` = `4f848b4`; `drafts/row4-legal-drafts` = `b3beb1c`; `held-back-pile-2026-07-28` = `2bfd154`. **All four match.** |
| `.git/*.lock` | `ls .git/*.lock` | None present |
| `PITFALL-WATCHLIST.md` real change | `git diff --ignore-cr-at-eol --numstat` | **+20 / −0 before this session's work** — pure append, convention honoured. The whole-file diff is a CRLF conversion, not an edit. |
| `RUNBOOK-SESSION-OPERATING.md` `M` | same | **0 real changes.** CRLF only, as `MEMORY/state.md` claimed |
| Row-3 closure actually written | Direct read + `grep` | **Present**, at lines 135–153, dated 2026-08-01, correctly labelled as attestation-not-evidence |
| Clinic reply status | Gmail API search of the `ivsr.dk` correspondence | **A reply exists**, 2026-08-03 10:19 UTC — see §3 |
| Billing suite compiles under the repo's real tsconfig | `tsc -p billing/tsconfig.json` (extends `tsconfig.base.json`, `strict: true`) | Exit 0, no errors |
| Billing suite passes | `node --test billing/dist/test/*.test.js`, run from the mount build | **40 / 40 pass** |
| Live HTTP path works | `devReceiver.mjs` started, five signed requests posted over real HTTP | See the log excerpt below |
| Workflow YAML is valid | `yaml.safe_load` | Parses |
| Exposure check | 4 greps (tier figures, trademark phrasing, CPR-shaped digits, live-key strings) across all 19 touched files | **Clean.** All hits reviewed: unix timestamps, literal `sk_live_` prefix strings inside the *refusal* guard and its tests, and pre-existing watchlist rows. No new exposure. |

**Live receiver log — the "verified in logs" evidence:**

```
{"event":"customer.subscription.created","status":200,"ok":true,"action":"subscription_active"}
{"event":"customer.subscription.deleted","status":200,"ok":true,"action":"subscription_canceled"}
{"event":"customer.subscription.created","status":400,"ok":false,"error":"signature_mismatch"}
{"event":"customer.subscription.created","status":200,"ok":true,"action":"duplicate_ignored"}
{"event":"unknown","status":400,"ok":false,"error":"malformed_event_envelope"}
```

Line 1 → line 2 is the flip-on / flip-off pair, over real HTTP. Line 3 is a spoofed signature
being refused. Line 4 is a replayed delivery being absorbed exactly once. Line 5 is the crash from
§3 no longer crashing.

**Adversarial coverage (Stage 3), 40 tests:** wrong secret; valid signature reused over a tampered
payload; missing header; header with no timestamp; non-integer timestamp (the `parseInt` coercion
trap); no `v1`; empty `v1`; non-hex `v1`; replay outside tolerance in **both** directions; boundary
at exactly 299s; secret rotation with two `v1` values; no secret configured; end-to-end spoof
against the full module; replayed event id; a replay attempting to resurrect a cancelled
subscription; a fresh-id but stale-`created` out-of-order event; malformed JSON; five structurally
degenerate envelopes; unresolvable account; unhandled event type; forged tier string; the complete
nine-entry Stripe status table including an unknown future status; live-key refusal at six
different key shapes; and refusal at module-construction time.

## 3. Defects caught and fixed — specific

Both were found by tests written to attack the code, not by review, and both were real.

**Defect 1 — a `null` request body crashed the handler.** `JSON.parse("null")` returns `null`,
not a throw. The `catch` block therefore never fired and the next line, `str(event.id)`, threw
`TypeError: Cannot read properties of null (reading 'id')`. **Why it mattered:** in the Cloudflare
Worker this surfaces as an unhandled 500. Stripe treats 5xx as "retry", re-delivers for up to
three days, and eventually disables the endpoint — so a single malformed probe could have taken
the billing webhook offline. **Fix:** `webhookHandler.ts` now type-guards the parsed value
(rejecting `null`, non-objects, and arrays) and returns a clean `400 malformed_event_envelope`.
Traced as `#KS-TRACE: B1-DEFECT-2-FIX`. Regression test: *"a signed but structurally-empty
envelope is a 400, not a crash"*, which asserts five degenerate bodies.

**Defect 2 — a malformed signature header produced a misleading diagnostic.** A header of
`t=…,v1=` (empty value) pushed `""` into the candidate list, so `v1.length` was 1 and the request
was reported as `signature_mismatch` rather than `no_v1_signature`. **Honest severity: this was
never a security hole** — both paths reject. It was a diagnostic defect: a future debugger would
have spent the afternoon hunting a secret mismatch that did not exist. **Fix:** empty values are
dropped at parse time. Traced as `#KS-TRACE: B1-DEFECT-1-FIX`.

**Non-defect, verified and worth recording:** the Director's brief asserted that row 3's closure
was probably missing from `PITFALL-WATCHLIST.md` ("a search for 'row 3' found nothing"). Checked
directly against the mount: **the closure is present**, correctly dated and correctly labelled.
No correction was needed and none was made. The brief's premise was wrong; the file was right.

## 4. Known limitations — unsoftened

1. **B1 is not done.** Its own done-check — "a test purchase flips a test org to paid via webhook,
   a cancellation flips it back, both verified in logs" — requires a Stripe account that does not
   exist. Marked `[~]`, not `[x]`. The live-HTTP evidence above uses *our* fixtures, not Stripe's.
2. **The event fixtures are hand-built from documentation, not captured from a live account.**
   This is the single largest residual risk in the package. If Stripe's real payloads differ in
   shape from our fixtures, the offline suite is green and the real integration still breaks.
   §3 of `BILLING-ACTIVATION.md` exists precisely to retire this risk, and only Yehor can run it.
3. **No production route exists.** `worker/src/index.ts` has no `/stripe/webhook` handler. Wiring
   it needs a KV-backed `EntitlementStore`, deliberately deferred so the adapter is written
   against a verified event shape rather than a guess.
4. **Nothing in `app/` calls `isPaidCheckEnabled()` yet.** The gate is correct and tested at the
   entitlement layer; the paid PR check is not actually gated by it in running code.
5. ~~`past_due` revokes entitlement immediately — no grace period.~~ **SUPERSEDED, same day — see
   the Addendum at the end of this report.** Yehor reviewed this limitation and overturned the
   design: a 3-day grace period is now implemented and tested.
6. **Two accounts could both claim one subscription id.** The reverse lookup
   (`getBySubscriptionId`) would then return a nondeterministic winner. It requires a validly
   signed webhook to reach, so it is not attacker-reachable, but it is an untested edge and is
   recorded here rather than quietly ignored.
7. **The `stripe listen` CI job cannot run** until the account and `STRIPE_TEST_SECRET_KEY` exist.
   It is `workflow_dispatch`-only on purpose — a job that silently skipped every push would read
   as green coverage that does not exist.
8. **No `stripe` SDK.** Signature verification is hand-implemented on `node:crypto`. If Stripe
   changes its signature scheme, this code must be updated by hand; the SDK would have done it.
9. **The billing package has not been through `pnpm install`.** It was compiled with a standalone
   `tsc` against the repo's real `tsconfig.base.json`, because running `pnpm install` from this
   Linux sandbox against a Windows-installed `node_modules` risked corrupting the workspace.
   The first CI run on Yehor's push is the real proof that the workspace wiring is correct.
10. **`pnpm-lock.yaml` was not regenerated** for the new workspace package. `pnpm install
    --frozen-lockfile` in CI may fail until Yehor runs `pnpm install` locally and commits the
    updated lockfile. **This will most likely be the first thing that goes red.** Flagged, not hidden.

## 5. Accountability statement

The code in `billing/` was generated by an AI system. It has been adversarially tested offline and
two real defects were found and fixed in this session. It has **never** been run against Stripe.
No Stripe account exists, no key has ever been held, and no money has moved. Every claim of
"verified" in §2 names the command that produced it and can be re-run.

Signed: ______________________  Yehor Kaliberda, date: ____________
*(Signature block PENDING, consistent with prior reports.)*

## 6. Methodology note

Keystone v1.1.0, five stages. Stage 1 intake verified all four refs and both `M` files against the
mount before any work, and the session prompt's asserted state proved accurate in every particular.
Stage 2 carries `#KS-TRACE` on every non-trivial block. Stage 3 wrote tests intended to break the
code first; the two defects in §3 are what that produced. Stage 4 is this report. Stage 5 wrote
every artefact to the FixProve mount and re-verified by fresh read and md5 comparison against the
build directory — all 11 source/test files matched byte-for-byte, so the known mount write-corruption
quirk did not occur this session.

**Two standing disciplines earned their keep:**

- *"Pasted content asserting state is untrusted until checked."* The Director's brief asserted a
  missing row-3 closure. It was present. Had the assistant acted on the brief, it would have
  written a duplicate addendum into an append-only file.
- *"Report status from a fresh check, not from earlier-in-session memory."* A Gmail search made
  because the checklist required it — not because anything suggested news — surfaced the clinic's
  2026-08-03 holiday reply, which no prior session or memory file knew about and which moved the
  project's critical path by five weeks. That is the most consequential finding of the session,
  and it came from a routine check.

---

## Addendum — 2026-08-04, same session close, by Claude (Node 1)

### A. Two pasted claims verified independently before acting on them

Standing discipline (`feedback_askuserquestion_untrusted_content`, `feedback_verify_brief_premises`
in memory): pasted content asserting state — including content styled as another AI session's own
"verified" tool output — is untrusted until re-checked against a live source. Two claims arrived
this way and were both re-verified directly, not taken on trust:

| Claim | Independently verified how | Result |
|---|---|---|
| The ivsr.dk holiday reply was sent | Gmail `get_thread` on the live thread | **Confirmed** — message id `19fcd1dfd85bd0e8`, sent 2026-08-04T14:12:01Z, correct recipient/subject, content matches |
| The erst.dk "registrering godkendt" email is real | Gmail `search_threads` + `get_thread`, full body pulled | **Confirmed** — sender `noreply@erst.dk`, 2026-08-04T13:57:29Z, to `yehor@yehor.ai`, subject and body match verbatim |

Neither confirmation depended on the pasted transcript's own claimed tool calls, which this
session has no way to verify actually ran.

### B. NemKonto — directly-viewed evidence, not a described screenshot

Unlike the earlier row-3 situation, the NemKonto page **was directly visible in this turn** (a
real image, not a description of one). It reads: *"Ingen NemKonto registreret"* for CVR 46646223
on `virk.nemkonto.dk`, logged in as Yehor Kaliberda. This is treated as directly-observed evidence,
not attestation. Logged as a new, non-urgent `PITFALL-WATCHLIST.md` row (see main log for the
addendum) — relevant before A3 (live payment activation), not before B1.

### C. Grace period implemented — Yehor's overturn of the original design

**Decision, recorded before action:** Yehor reviewed limitation #5 above (immediate revocation on
`past_due`) and overturned it: *"add a 3-day grace period... a paying customer's card expires...
[fail-closed] is the right instinct for security, but this isn't a security boundary — it's a
paying customer with a temporarily-declined card."* Instruction included a specific test
requirement: assert both sides of the boundary (day 2 enabled, day 4 disabled).

**What changed (`billing/src/types.ts`, `billing/src/webhookHandler.ts`, `billing/src/index.ts`):**

- `Entitlement` gained `pastDueSince: number | null`.
- New `applyStatusTransition()` centralises the grace-eligibility rule in one place instead of
  re-deriving it at five call sites: grace is eligible **only** when the account was genuinely
  `active` immediately before the lapse, or is already mid-lapse (a retry of the *same* failure
  keeps the *original* `pastDueSince` — the clock does not restart on each Stripe retry).
- `isPaidCheckEnabled()` now takes `(entitlement, nowSeconds?, graceSeconds?)` and returns `true`
  for `past_due` while `nowSeconds - pastDueSince < graceSeconds` (default 3 days), else `false`.
- `BillingModule.isPaidCheckEnabled()` now accepts an optional `nowSeconds` so the grace window is
  deterministic and testable rather than silently dependent on wall-clock time.

**Deliberate exclusion, stated explicitly because the pasted instruction did not specify it:**
grace does **not** apply to a first-time decline. A brand-new subscriber whose very first payment
fails was never a paying customer whose card "just expired" — granting them 3 free days would
undercut scenario 2 (decline never entitles) for no legitimate reason. This is enforced by
`applyStatusTransition`'s `graceEligible` check and has its own test.

**Verification (Stage 3, re-run to completion):**

- Suite grew from 40 to **43/43 passing** tests: `test("GRACE PERIOD -- day 2 still enabled, day 4
  disabled, clock does not restart on retries")`, `test("GRACE PERIOD does not apply to a
  first-time decline...")`, `test("GRACE PERIOD is cleared by cancellation...")`, plus scenario 6
  rewritten to assert the new intended behaviour instead of the old one.
- The day-2/day-4 boundary test additionally asserts the exact 3-day instant is expired and one
  second before it is not — removing any off-by-one ambiguity for a future reader.
- **Live HTTP round trip re-run** through `devReceiver.mjs` with real signatures over real wall-clock
  time: `customer.subscription.created` (active) → `invoice.payment_failed` → both returned `200`,
  the second logging `"action":"payment_failed_past_due"`. (The grace-window *read* path itself —
  day-2/day-4 — is proven by the 43-test suite's injected clocks, not by this live-HTTP pass, since
  the harness has no mechanism to fast-forward real time by three days.)
- Exposure check re-run on all four touched files (tier figures, CPR-shaped digits, live keys,
  merge-conflict markers): clean.
- `tsc -p billing/tsconfig.json`: exit 0, no errors, under the repo's real strict config.

**Known limitation #5 in the main body above is retired by this change.** All other limitations
(§4, items 1–4 and 6–10) are unaffected and still stand as written.

**Nothing was committed or pushed as part of this addendum either.**

### D. `pnpm-lock.yaml` regeneration attempted, failed cleanly — mount limitation, not risked further

Attempted `pnpm install --lockfile-only` (deliberately the lightest option: updates the lockfile
entry for the new `billing` workspace package without touching `node_modules`) to close the
"most likely first CI failure" flagged in §4 item 10. It failed within seconds, before writing
anything:

```
EPERM: operation not permitted, unlink '.../FixProve/_tmp_9_...'
```

This is the same class of failure `feedback_fixprove_mount_write_quirks.md` already documents for
the Edit/Write tools, now confirmed to extend to pnpm's own store-path writability probe (which
writes then unlinks a temp file at the repo root before doing anything else) — a Linux-sandbox
mount permission characteristic, not a project defect. **Verified `pnpm-lock.yaml` itself was never
touched** (`git diff` on it is empty both before and after the attempt) — the failure happened
before any write to the real target, so there is no corruption risk to report, only a clean no-op.
Two harmless 0-byte artefacts (`_tmp_9_...`) were left at the repo root; this session could not
remove them either (same permission limitation) — they are untracked, not gitignored, and will not
be swept into any commit (paths are always named explicitly, never wildcard-staged). Safe for
Yehor to delete locally, or to ignore until the next `git clean` outside this sandbox.

**Conclusion: regenerating the lockfile is Yehor's action, on his own machine, per
`BILLING-ACTIVATION.md` §4 and the CI first-failure note in §4 item 10 above** — not something this
session can complete from the sandbox. Not forced further, per the standing discipline that a
known write-corruption risk on this mount is a stop condition, not a retry condition.

---

## Addendum B — 2026-08-04, later same day: B1 LIVE VERIFICATION — done-check MET, Defect 3 found and fixed

### E. B1's done-check, met against a real Stripe test-mode account

Everything below happened against Yehor's real Stripe sandbox (`acct_1U0jS23QDGNK4abQ`, "FixProve
sandbox", confirmed Test mode both by the `/test/` segment in the dashboard OAuth URL and by the
Stripe CLI's own "Mode: Test" confirmation prompt before the cancel command) — not against our own
hand-built fixtures. Yehor ran every command himself; this session guided and read the results.

**Setup:** Stripe CLI (`Stripe.StripeCLI` 1.45.0) installed via winget, `stripe login` authorized
against the sandbox, `stripe listen` + `billing/scripts/devReceiver.mjs` run as the live receiver.

**Phase 1 — six lifecycle events via `stripe trigger`:** all returned `200`. Five of six matched
our HANDLED set and correctly resolved to `account_unresolved` (CORRECT, not a defect — CLI-fixture
subscriptions carry no FixProve linkage, and the handler refuses to guess). Roughly sixteen *other*
real Stripe event types we never explicitly triggered (`charge.succeeded`, `invoice.finalized`,
the newer `invoice_payment.paid`, etc.) all hit the "not in HANDLED, ignore" fallback cleanly —
retiring the largest residual risk from the original report (§4 item 2): our fixtures' event
*shapes* do match what real Stripe sends, at the top level. `checkout.session.completed`'s CLI
fixture failed with `400` due to `payment_intent_data.shipping` being incompatible with Managed
Payments — a CLI-fixture-vs-account-setting mismatch, unrelated to our code (our own checkout
builder never sets a shipping parameter).

**Phase 2 — a real Checkout session**, created via the Stripe CLI with the exact wire parameters
`billing/src/checkout.ts` sends (`client_reference_id`, `metadata.fixprove_account_id`,
`subscription_data.metadata.fixprove_account_id`, etc.), paid with test card `4242 4242 4242 4242`
in a real browser:
```
"event":"customer.subscription.created","action":"subscription_active"
"event":"checkout.session.completed","action":"checkout_completed_active"
```
**This is the flip-on half of B1's done-check, met.**

**Phase 3 — cancellation**, via `stripe subscriptions cancel`:
```
"event":"customer.subscription.deleted","action":"subscription_canceled"
```
**This is the flip-back half. Both halves now verified in logs, against a real account — B1's
stated done-check is MET.**

### F. Defect 3 — found live, fixed, regression-tested from the literal real payload

**The one non-clean result in Phase 2:** `invoice.payment_succeeded` returned `account_unresolved`
despite the account being linked moments earlier. Root cause, confirmed by retrieving the real
invoice (`stripe invoices retrieve`): this invoice API version (>= 2025-03-31, required for Managed
Payments) moved the subscription link from a flat `invoice.subscription` field to
`invoice.parent.subscription_details.subscription`, and moved the subscription's metadata to
`invoice.parent.subscription_details.metadata` — while `invoice.metadata` itself is an empty `{}`.
Our fixtures (`test/fixtures.ts`) were written from Stripe's own older documentation examples,
which describe the flat shape — so the offline suite's 43 tests all passed against a shape that
doesn't match reality. **Only a real invoice event caught this**, which is the entire reason B1's
done-check requires a live purchase rather than stopping at the offline suite.

**Severity, honestly stated:** this would have broken renewal detection (scenario 5) and
failed-renewal detection (scenario 6) in production — an invoice-only event (which is what
renewals are) would never have resolved to an account, silently leaving `currentPeriodEnd` stale
and never triggering the grace-period path on a failed renewal. Not attacker-reachable, but a real
correctness gap that would have surfaced quietly, weeks later, at first renewal.

**Fix, in two parts (the second found by the regression test itself, mid-fix):**
1. `metadataOf()` now falls back to `parent.subscription_details.metadata` when `obj.metadata` is
   empty — so a real invoice resolves via the strongest path (metadata) directly, not via the
   weaker subscription-id reverse lookup.
2. **First fix attempt was incomplete** — `resolveEntitlement()` was corrected, but the
   `invoice.payment_succeeded` / `invoice.payment_failed` switch cases still read the old flat
   `obj.subscription` directly when *storing* the subscription id. The new regression test caught
   this immediately (`stripeSubscriptionId` came back `null` despite resolution succeeding).
   Consolidated into one shared `subscriptionIdOf()` helper, used everywhere a subscription id is
   read, so a future third call site can't reintroduce the same half-fixed bug.

**Regression tests, built from the literal real payload, not a re-guess:**
- *"resolves an invoice via the newer parent.subscription_details shape (Defect 3 regression)"* —
  proves resolution AND data capture both work standalone, no prior store entry.
- *"the legacy_flat invoice shape still resolves via subscription-id reverse lookup"* — proves the
  old shape still works as a defense-in-depth fallback (`test/fixtures.ts`'s `invoice()` builder
  gained a `shape: "current" | "legacy_flat"` parameter; `"current"` is now the default because it
  is the verified-real one).
- The pre-existing *"unresolvable account is reported, not guessed"* test now explicitly requests
  `shape: "legacy_flat"` — its original premise (a metadata-less, unresolvable invoice) is no
  longer true for a *current*-shape invoice, which is correct: that WAS the bug.

**Suite: 43 → 45 tests, all passing.** Exposure check re-run on all three touched files: clean,
and specifically checked that none of Yehor's real Stripe object IDs (`acct_1U0jS23QDGNK4abQ`,
`sub_1U0nLX...`, `cus_V0oyg5...`, the two real `price_...`/`prod_...` IDs) leaked into any tracked
file — they did not; only synthetic `SUB_ID`/`CUS_ID`/`ACCOUNT` test constants appear in source.

### G. Known limitations — updates

Item #1 in the main body ("B1 is not done... requires a Stripe account that does not exist") is
**RETIRED** — the account exists, both done-check halves are verified in real logs. Item #2 ("event
fixtures are hand-built from documentation... largest residual risk") is **substantially retired**:
the top-level event shapes are now confirmed real, and the one place our fixtures WERE wrong
(the invoice's nested subscription link) was found and fixed with a real-payload-derived regression
test. All other limitations (items 3–4, 6–10) are unaffected and still stand.

**B1 moves from `[~]` to `[x]`** in `SESSION-PLAN-TO-R1.md` on this evidence.

**Still not done, honestly:** `pnpm-lock.yaml` regeneration (Addendum §D, Yehor's action) and the
commit/push itself. Nothing has been committed or pushed as part of this addendum.

# Kondrup outreach — DRAFT ONLY, NOT SENT

CA-3 gated. This is a draft for Yehor's review; sending requires his separate,
explicit word — same standing as the Cernel/AarhusJS/WasteHero drafts.

## Recipient

**Peter Willemoes Kondrup** — VP of Engineering, Puzzel (since March 2025);
co-founder and former CTO, Capturi (Aarhus).

LinkedIn: https://www.linkedin.com/in/peter-willemoes-kondrup/ — verified
independently via two sources (theorg.com org chart + the LinkedIn profile
itself), exact name match "Peter Willemoes Kondrup," current title and prior
Capturi CTO/co-founder history both confirmed. No reliable email found — a
RocketReach listing exists but is a paywalled guess-based aggregator, not
used as a real address. **Channel: LinkedIn only.**

## Why one thread, not two (per this session's Capturi/Puzzel finding)

Capturi A/S is 100%-owned by Puzzel (since 22 Nov 2024), same CEO, same
board, same registered address, product rebranded "Conversational
Intelligence." Kondrup is simultaneously the Aarhus-origin engineer *and*
the group-level engineering buyer — a second "Capturi" thread would land on
the same desk and read as stale homework.

## The hook, independently verified (not taken on the subagent's word)

Fetched `github.com/capturi/taco` directly and read it myself. Confirmed:
public repo, "A soft shell around Jira" (internal Jira productivity
userscript), TypeScript/React 18/Vite/TanStack, 0 stars, MIT license,
`master` branch, `CLAUDE.md` present in the file tree, last commit
context implies July 2026 activity. The README's own words, quoted
verbatim:

> **AI FROM DAY ZERO** — *we used AI, so you don't have to.* Before you
> ever opened taco, the AI was already done. You just get the shell. Not
> baked in — baked with AI.

## Internal note (NOT part of the sent copy) — the caveat

No confirmed Python usage anywhere in Capturi's or Puzzel's public surface.
Evidence is TypeScript/React, C#/.NET, and Go. The draft below pitches the
**concept and problem** (deterministic verification of AI-generated code
against real installed dependencies) — it does not claim a Python-specific
fit, and does not name a language Capturi/Puzzel may not use.

---

## Option A — LinkedIn connection-request note (300-char limit)

Use this if not yet connected to Kondrup. LinkedIn's note field caps at 300
characters; this draft is 213.

```
Hi Peter — building FixProve solo in Aarhus (deterministic checks for
AI-generated code against real installed deps). Saw taco's "AI FROM DAY
ZERO" line and thought you'd get the problem instantly. Would like to
connect.
```

## Option B — First message (after connecting, or as InMail)

```
Hi Peter,

I'm Yehor — I build FixProve, a solo project out of Aarhus. It's a
deterministic verification layer for AI-generated Python/JS/TS code:
before a commit lands, it checks every import, symbol, and API call
against what's actually installed in the project, and flags hallucinated
calls that an LLM would otherwise ship straight into a PR. No LLM tokens
involved — static analysis only.

I came across taco's README line — "AI FROM DAY ZERO — we used AI, so
you don't have to" — and it's exactly the workflow FixProve is built
for: teams shipping AI-assisted code fast, who still want a hard,
deterministic backstop before it merges, not another model in the loop
second-guessing the first one.

Given your Capturi-to-Puzzel path, I'd guess you've thought about this
from both the "move fast with AI" side and the "now I own the
engineering org's quality bar" side. Would be glad to hear how you're
currently handling it, and happy to show you FixProve if useful — no
pitch, genuinely curious how a team your size approaches it.

Yehor
fixprove.dev
```

---

**Status: DRAFT. Not sent. Awaiting Yehor's separate go-ahead, consistent
with CA-3 and this project's standing outreach convention.**

Recorded by Claude (Node 1), Session 4.18, 2026-08-21.

---

## POST-DRAFT ADDENDUM (2026-08-21, same day) — SENT, via a different final text than drafted above

**Status: SENT.** Yehor-reported (via a separate guide-chat session), **not
independently verified by this session** — no LinkedIn access exists here,
so this status is recorded the same way this project records any
LinkedIn-only action outside this mount's visibility: on Yehor's word,
flagged as unverified rather than assumed.

**The actual sent text is materially different from both options drafted
above.** It was composed and edited in the guide-chat session, apparently
drawing on this draft's ideas (the `taco` hook, "no pitch, genuine
question" framing) but independently worded, then revised twice for a
200-character LinkedIn connection-note limit. Final text, as reported:

```
Hi Peter, saw taco's README line on AI day zero. I built fixprove.dev
in Aarhus, deterministic checks that catch AI-hallucinated imports
before PRs merge. Curiosity question: how do you check AI code?
```

**One thing worth recording precisely: the guide-chat session caught a real
inconsistency in this draft, and its reasoning was correct — with one
premise checked and found narrower than implied.** It flagged this draft's
Option B, above, for using "static analysis" (see the line "No LLM tokens
involved — static analysis only") as inconsistent with this project's D2/
Option A positioning decision, and swapped an early working version of the
connection note from "static analysis that catches" to "deterministic
checks that catch" before sending.

Checked against this project's own record before accepting that reasoning
as settled: **it's grounded, not invented.** `KS-REPORT-4.14-positioning-
and-fork-decisions.md`'s own verification table records a live-copy search
specifically for "static analysis" among terms Option A deliberately moved
away from (NIST's static-analysis-without-execution distinction vs.
FixProve's actual runtime-dependency introspection). **But that check's own
recorded scope was `web/src`, `README.md`, and `cli/README.md` only — it
never covered outreach drafts**, and two already-sent, already-public
artifacts from this same GTM push — `LINKEDIN-CAROUSEL-FINAL-DRAFT-2026-
08-19.md` ("The check is deterministic static analysis. No LLM in the
loop.") and `Tier1-outreach-drafts-2026-08-19.md` ("the check itself,
deterministic static analysis.") — already use exactly the phrase the
guide-chat flagged. So the underlying preference is real and well-founded;
the implicit premise that outreach copy has consistently honored it is
not. This draft's Option B was never the version sent, so no live harm
occurred here — but the inconsistency across the three prior outreach
artifacts is a genuine, if minor, finding, not retroactively fixed (editing
already-sent messages isn't possible, and the two published files are
historical record, not live product copy D2 governs).

Recorded by Claude (Node 1), Session 4.18 (post-close addendum), 2026-08-21.

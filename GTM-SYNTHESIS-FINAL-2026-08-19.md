# FixProve GTM — Synthesized From Two Independent Research Runs

**Built:** 2026-08-19, Session 4.16. Synthesizes two independent runs against
`DEEP-RESEARCH-PROMPT-gtm-strategy-and-objection-playbook-2026-08-19.md` ("Run A" — the more
disciplined, source-heavy D1/D1B-only pass; "Run B" — the full D1–D4 pass). Two claims cross-checked
against primary sources this session, not trusted from either run.

## The headline finding: near-zero target-list overlap between two independent runs

Run A named 6 companies (Cernel, WasteHero, Capturi, Teton.ai, Pandektes, Light). Run B named 17
(a largely different set). **Only 2 companies — WasteHero and Teton.ai — appear in both.** That's
informative on its own: either the pool of genuinely-fitting companies is larger than one pass can
cover, or at least one pass is including weaker matches, or both. Verified below: both are true.

## Verified corrections (checked against primary sources this session)

1. **"Aarhus Tech Mixer" is real.** Run A flagged it "UNCONFIRMED / possibly nonexistent"; Run B
   listed it as VERIFIED with dates. Confirmed via direct search: real, recurring, Eventbrite listing,
   organizer "Aarhus Tech Social," Fridays 18:00 at Heidi's Bier Bar. **Run B was right, Run A had a
   research gap here** — worth noting since Run A was more careful everywhere else.
2. **Five of Run B's 17 named targets are far outside the 10–50 person ICP** — confirmed via direct
   headcount search, not assumed:

   | Company | Confirmed headcount | Multiple over ICP ceiling |
   |---|---|---|
   | Columbus A/S | ~1,500 | ~30x |
   | Systematic A/S | ~1,234 | ~25x |
   | Trifork | ~1,111 | ~22x |
   | Boozt | ~1,060 | ~21x |
   | Stibo Systems | ~840 | ~17x |

   These are established, large, often publicly-listed companies. A job posting mentioning Python
   at a 1,000+ person company does not make it an ICP fit — the CI-owner-as-entry-point logic
   assumes a small team where that person is reachable and empowered; at this scale, it isn't the
   same move. **Remove these five from the actionable target list.**

## Synthesized target list (Run A's discipline + Run B's additional candidates, corrected)

**Tier 1 — strongest fit, Aarhus (from Run A, most rigorously sourced):**

| Company | Evidence | Size | Entry point |
|---|---|---|---|
| **Cernel** | Python/Go AI agents, explicit job-post evidence | 17 (own posting) / 13 (PitchBook) | CTO, via Aarhus AI meetup tie (co-hosted an event) |
| **WasteHero** | Python/Django explicit, **only company confirmed by both runs** | 30–51 (borderline, verify) | Named engineering contacts in own job ads |
| **Capturi** | Python/ML likely, engineering team named publicly | ~25–51 (now part of Puzzel — verify current independence) | Named tech-team engineers on LinkedIn |

**Tier 2 — plausible, needs a size/reachability check before outreach (from Run B, after removing
the five oversized entries):**

Pandektes (CPH, legal AI, 11–50 per Wellfound — cleanest size evidence in this tier), Tembi (CPH,
~20 people, Python+TS), Tally (CPH, early-stage, small), manifōld AI (CPH), Jutland-AI (CPH, 1–10),
Mindway AI (Aarhus), Ento (Aarhus). None of these were cross-verified by both runs — treat each as
single-sourced until checked.

**Flagged, not rejected — verify current size before treating as ICP:**

Teton.ai (named by both runs, but raised a $20M Series A in Sept 2025 and is likely past 50 people
now) and Light (planning to triple engineering by mid-2026 — likely already over the ceiling).

**Rejected by Run A's own diligence (real negative results, worth keeping on record):** Parahelp
(SF-based despite Danish founders), Dreamdata (~103 people, migrating away from Python), Spektr
(TypeScript-first, team of 1–10, fails Python-first as written).

## Right-room mapping — merged, corrected

Both runs independently converge on: **AarhusJS** (has already run vibe-coding/AI-dev content,
open speaker submissions), **Aarhus AI meetup** (confirmed autumn 2026 dates, Oct 8 and Oct 28),
**Tech Hub Aarhus** (morning meetups + informal talk formats), **PyData Copenhagen**, **AI Meetup
Copenhagen** (confirmed lightning-talk format, stage demos), and **Copenhagen Python Meetup /
CopenhagenJS** for language-specific rooms. **Aarhus Tech Mixer** is now confirmed real (see above)
— useful for informal networking, not a speaking venue. **AI Tinkerers Copenhagen** (Run A only) is
worth prioritizing specifically because its format is "every demo must show running code" — an
unusually good fit for a deterministic CLI demo. **Django Day Copenhagen** (Oct 2, 2026) — CfP
closed Aug 16, but day-of lightning talks remain possible.

Both runs agree, independently and without prompting each other: **deprioritize Rust/Go/systems
rooms entirely** — their compilers already catch this failure class at build time, so the pitch has
nothing to land on. This is now confirmed by two independent passes, not just the original brief.

## D2 / D2B / D3 / D4 — single-sourced (only Run B produced these), not cross-verified

The objection playbook, pitch script, own-numbers measurement plan, and demo script only came from
one of the two runs — there's no second independent pass to check them against. On inspection they
match the verified facts and rehearsed answers from the original brief accurately (no invented
numbers, correct Stack Overflow attribution, honest "no catch-rate figure yet" framing on the
hardest objection). Treat these as solid but single-sourced — spot-check before using in a real
conversation, same discipline as everything else this session.

## Bottom line

Start with Tier 1 (Cernel, WasteHero, Capturi) — the only names with real cross-run or
high-confidence single-run evidence. Treat Tier 2 as a candidate pool to verify, not a ready list.
Lead with AarhusJS and Aarhus AI for speaking slots — both have concrete near-term dates. Everything
else in Run B's target list involving a company over ~50 people should be treated as out of scope
until a much larger-org GTM motion is deliberately chosen, which it hasn't been.

---

## 2026-08-31 (Session 4.23) — Event shortlist independently verified, dates/format checked against each event's own site; one contradiction with the 2026-08-19 entry above flagged, not silently resolved

**Verified directly via `WebSearch` against each event's own site/listing
this session** (not taken from any pasted account without a check):

| Event | Date | Format, verified | Source |
|---|---|---|---|
| Django Day Copenhagen | Fri 2 Oct 2026, Union, Nørrebro, 50–100 people, streamed | Regular-talk CfP closed 16 Aug 2026, but **lightning talks are submitted day-of, drawn during the day — no advance application** | `2026.djangoday.dk` (own site) |
| AI Tinkerers Copenhagen | No next date found this search | "Screened, demo-first, no-pitch" — confirmed in the event's own words: goal is a room of people actively building AI systems, not vendor presentations/recruiting/lectures; attendees screened for hands-on AI work | `copenhagen.aitinkerers.org` (own site) |
| AI Day Aarhus | 3 Nov 2026, Musikhuset Aarhus (main), workshops at INCUBA Katrinebjerg | Paid conference, 50+ talks/debates; volunteer-for-free-ticket route exists; speaking-slot process not confirmed | `aiday.dk`, `10times.com` listing |
| AI Meetup Copenhagen | #10 already held 20 Aug 2026; #11 date not yet posted | Recurring ~monthly, open-floor: "enjoy talks... and demo your own ideas on stage" — not a curated CfP | `meetup.com/ai-meetup-copenhagen-innovators-creators-techies` |
| Aarhus AI | **No next date found** this search, despite a direct search for it | Confirmed to exist (`meetup.com/aarhus-ai`, referenced by Tech Hub Aarhus), but no confirmable upcoming date via search — genuinely needs a live look at the group's own page | `meetup.com/aarhus-ai`, `techhubaarhus.com` |

**Contradiction flagged, not silently resolved.** The 2026-08-19 entry
above states "Aarhus AI meetup (confirmed autumn 2026 dates, Oct 8 and Oct
28)" — sourced there to two AI deep-research runs converging, not to a
direct fetch of the group's own page. This session's fresh `WebSearch`
against the same event found no confirmable next date at all. Two
explanations are possible — the Oct 8/28 dates existed on 2026-08-19 and
were since changed or removed, or the original claim was never verified
against the primary source in the first place (both prior research runs
were AI-generated syntheses, not direct site fetches, per that entry's own
"single-sourced... spot-check before using" caveat). **Not resolving this
by picking one explanation** — flagging it for Yehor: if Oct 8/28 still
matter, check `meetup.com/aarhus-ai` directly before planning around
either date.

**Ranking, as independently corroborated by the verified table above:**
Django Day (2 Oct) is the lowest-friction near-term option — no
application needed, just show up with a lightning talk. AI Tinkerers
Copenhagen is the best format-fit (screened/demo-first suits a
deterministic CLI demo) but needs a live check for the next date before
it can go on a calendar. AI Day Aarhus (3 Nov) is a bigger, paid event —
worth attending once to observe before proposing anything. Aarhus AI
needs a direct, live check of its own page; this session could not
confirm a date search-side.

**No action taken beyond research and verification.** No registration, no
speaker application, no calendar event created — these remain Yehor's own
next actions per the priority table already given in this conversation.

Recorded by Claude (Node 1), Session 4.23, 2026-08-31.

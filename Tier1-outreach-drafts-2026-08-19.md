# Tier-1 Direct Outreach — Cernel, WasteHero, Capturi

**Built:** 2026-08-19, Session 4.16. Contact lookup done this session (WebSearch, live) —
labeled VERIFIED / REPORTED / UNCERTAIN per source confidence, same discipline as the GTM synthesis.
**No email has been sent. Nothing below is a claim that these are correct or current — Yehor should
sanity-check each name on LinkedIn before sending**, per standing "no invented facts" rule.

## Contact-lookup findings (2026-08-19, WebSearch, sources below each)

| Company | Name found | Role | Confidence | Source |
|---|---|---|---|---|
| Cernel | Mathias Fenger | CTO | REPORTED (named in company-overview coverage, not a direct LinkedIn pull) | [aivirksomheder.dk](https://aivirksomheder.dk/virksomhed/cernel/) |
| WasteHero | cmikkelsen@wastehero.io, ahinrichs@wastehero.io | general/internship contacts | UNCERTAIN — scraped from a third-party job-aggregator listing, not confirmed against WasteHero's own site or LinkedIn | [meetfrank.com](https://meetfrank.com/jobs/wastehero/lead-backend-developer-pythondjango) |
| Capturi | Tobias Troelsen | Co-founder, leads IT dept (7 people per RocketReach) | UNCERTAIN — third-party data broker, not a primary source | [rocketreach.co](https://rocketreach.co/capturi-a-puzzel-company-it-department_b6fcfbb6c64f2ba1) |

**Real finding that changes the picture, not just a name:** Capturi was **acquired by Puzzel in
October 2024**. Their former CTO (Peter Kondrup) is now **VP of Engineering at Puzzel** — the parent
company, not Capturi standalone. This means Capturi's engineering may now sit inside Puzzel's larger
org rather than running as an independent 10–50 person CI-owning team, which is the whole premise of
the entry-point logic in the GTM synthesis. **Recommendation: verify Capturi's current
engineering independence before outreach, or drop it from this round and lead with Cernel and
WasteHero only.** ([Plesner deal notice](https://plesner.com/en/news/puzzel-acquire-capturi),
[Puzzel blog](https://www.puzzel.com/blog/welcome-capturi-to-the-puzzel-ecosystem))

**Also worth flagging on Cernel:** they closed a **€4M seed round in February 2026** — repositioned
around "agentic commerce" infrastructure. Still consistent with the ICP by headcount (5-person
founding team, live Backend Developer req on The Hub), but the product framing may have shifted since
the original GTM research pass — worth a quick look at their current site copy before writing the
personalized line. ([EU-Startups](https://www.eu-startups.com/2026/02/exclusive-danish-ai-startup-cernel-raises-e4-million-in-four-weeks-to-build-foundational-infrastructure-for-agentic-commerce/))

---

## Template (same structure for all three, company specifics per company below)

Subject line pattern: **A quick one re: [Company]'s AI-generated code / CI**

> Hi [Name],
>
> I noticed [Company] is shipping with Python and leaning on AI-assisted development [— tie to
> whatever specific evidence surfaced it, e.g. a job post, a GitHub repo, a talk].
>
> I built FixProve — a free CLI that checks AI-generated Python/JS against what's actually installed
> in your project, catching calls to functions that don't really exist before they hit CI. No LLM in
> the check itself, deterministic static analysis.
>
> Not trying to sell you anything — genuinely curious whether this is a failure mode you've run into,
> and if it'd be useful to run against a real repo. Free, MIT-licensed, `pip install fixprove` if you
> want to try it cold.
>
> Yehor — building FixProve solo in Aarhus

---

### Cernel — send this round, upgraded to warm outreach
- **To: Andreas Busch, Founder & CEO @ Cernel — already an existing LinkedIn connection of Yehor's**
  (confirmed 2026-08-19 from Yehor's own connections list, screenshot — this is now VERIFIED, not
  REPORTED, and beats the cold CTO route entirely). Title on his profile: "Product data infrastructure
  for the agentic commerce era" — consistent with the €4M seed / agentic-commerce repositioning found
  earlier.
- **Evidence:** Python/Go AI agents, live Backend Developer req on The Hub, €4M seed Feb 2026, plus
  the Aarhus AI meetup co-hosting tie.
- **Send via:** LinkedIn message, not a cold email — it's a warm connection, use it as one. Message
  below, rewritten for that.

> Hey Andreas — following your Cernel journey, congrats on the seed round. Been building something
> that might be relevant: FixProve, a free CLI that checks AI-generated Python/TS code against what's
> actually installed, catching calls to functions that don't really exist. Deterministic, no LLM in
> the check. `pip install fixprove`, free, MIT-licensed. Curious if that's a failure mode your team's
> run into with AI-assisted code — happy to just chat if useful, not trying to sell you anything.

**Correction (caught this session, not passed on uncorrected):** an earlier draft of this file cited
a DEV Community article ("I Built a Multi-Agent AI Runtime in Go...") as evidence Cernel's stack is
shifting toward Go. That was wrong — the article surfaced only on keyword overlap in a search, has no
confirmed connection to Cernel or its author, and the original search summary itself said Cernel's
current language stack (beyond the original job-post evidence) was not confirmed either way. Removed.
**Still worth a quick real check:** the live Backend Developer posting on The Hub is the actual
current evidence for Cernel's stack — worth a glance before sending, since the €4M round and
"agentic commerce" repositioning happened after the original GTM research pass.

### WasteHero — send this round
- **To:** find via LinkedIn search ("WasteHero" + "Lead Backend Developer" or "Engineering") rather
  than the two emails found — those came from a third-party aggregator, not WasteHero's own site, and
  I'd rather you send to a name you've confirmed than a scraped address.
- **Evidence:** Python/Django explicit, the only company confirmed by both independent GTM research
  runs, live Lead Backend Developer + Senior Python Developer reqs.
- **Personalize:** reference the specific job posting (Lead Backend Developer, Python/Django) that
  surfaced the stack.

### Capturi — hold this round
- **Status: do not send yet.** Acquired by Puzzel Oct 2024; former CTO now VP Engineering at Puzzel,
  the parent company. The 10–50 person independent-CI premise this outreach depends on is now in
  question. Verify on LinkedIn whether Capturi still operates as a distinct engineering team before
  spending an outreach slot here — if it's folded into Puzzel's org, it's now well outside the ICP by
  the same logic that excluded the five oversized companies in the GTM synthesis.

---

## Before sending any of these

1. Confirm Mathias Fenger is still Cernel's CTO on LinkedIn before sending — REPORTED, not
   independently confirmed against a primary profile.
2. Find a real WasteHero name via LinkedIn rather than using the two scraped emails above.
3. Hold Capturi until independence from Puzzel is confirmed — see above.
4. Keep each one short and specific, not templated-looking, per the standing "no cold volume" rule —
   the template above is a skeleton, not a copy-paste-as-is script.

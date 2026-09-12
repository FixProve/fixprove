# fixprove.dev/demo — Voice-Agent Presentation — Backlog Design

**Status: SPLIT 2026-09-11.** This document originally covered one bundled
concept — a narrated presentation followed by a live voice Q&A agent. Later
the same day, the guide chat proposed dropping the live-agent half in favor
of a pre-rendered narrated video, on the grounds that it removes the
privacy-policy collision entirely rather than reducing it (verified
independently against `PRIVACY-POLICY-DRAFT-v2.md`'s actual text — see the
executor's KS-TRACE note in `web/src/app/demo/page.tsx`). The two halves now
have different status:

- **Interactive live Q&A agent — still NOT STARTED, still deferred.**
  Everything below this point describes that concept unchanged. The legal
  gate, the ElevenLabs Conversational-AI pricing, the knowledge-base
  scoping requirement, and the "filed past Sept 16/17" reasoning all still
  apply to this half only.
- **Pre-rendered narrated video — IN PROGRESS as of 2026-09-11**, tracked
  separately, not in this file. A `<video>` lead-in section was added to
  `web/src/app/demo/page.tsx` (plus matching CSS in `globals.css`) this
  session, referencing `/demo-narration.mp4`, which does not exist in the
  repo yet. This is a new, uncommitted local change on top of a page that
  is **already live in production** (deployed 2026-09-08, per
  `KS-REPORT-4.27-...-demo-production-deploy.md`) — it carries none of the
  legal gate below (no visitor audio reaches any third party; the video is
  a static same-origin asset), but it must not be committed, pushed, or
  deployed until Yehor supplies the real .mp4 and gives a separate,
  explicit go-ahead. See the ~75-second narration script and the two build
  paths (screen-recording vs. custom animated page) from the 2026-09-11
  guide-chat message for what's still needed to produce that file — those
  are Yehor's own steps, not executor work.

## Why this is filed, not built this week

Two reasons, both checked directly rather than assumed:

1. **It collides with a pending decision, not a settled fact.** The current
   `PRIVACY-POLICY-DRAFT-v2.md` states, verbatim: *"No analytics, tracking
   pixel, advertising tag, third-party script, or cookie is set by us
   anywhere on fixprove.dev — verified by searching the site source and
   built output for every common tracker/storage API, with zero matches."*
   A voice agent embed is a third-party script sending visitor audio to an
   external API (ElevenLabs or similar) — a real, new personal-data flow
   that claim does not cover. This isn't a reason not to build the feature;
   it's a reason it cannot ship ahead of the still-pending "publish v1
   Privacy Policy" decision. Either the notice gets a new disclosure
   section first, or the feature launches on a page explicitly excluded
   from that claim's current scope.
2. **At the actual events, it's likely lower-value than it sounds.**
   Sept 16 (AI Tinkerers Copenhagen) is a one-on-one expo table, confirmed
   this session by reading Gökhan's own reply directly. Sept 17 (Aarhus)
   is probably similar — Augustin's format answer is still pending. At a
   table, standing there live, a voice agent competing with your own
   presence for the same short window is a downgrade, not an upgrade. The
   real audience for this is people who visit `fixprove.dev/demo`
   afterward, remotely, when you're not there to answer them yourself —
   which reframes this as a permanent asset worth building carefully, not
   a Sept-16 deadline item.

One more thing worth naming plainly: a hallucination-*detection* company
shipping a marketing chatbot that hallucinates about its own product would
be a uniquely bad look. Whatever knowledge base grounds this agent must be
tightly scoped to FixProve's own verified documentation, not left to
improvise — this is a hard requirement below, not a nice-to-have.

## Concept

`fixprove.dev/demo` gains a narrated, scripted presentation (grounded in
verified FixProve facts only), followed by a live voice Q&A agent visitors
can talk to about the product.

## Provider — ElevenLabs Conversational AI (Agents)

Pricing re-verified directly against `elevenlabs.io/pricing/agents` on
2026-09-11 (one figure below corrects the guide chat's own estimate, caught
by checking rather than repeating it):

- Free tier: 15 minutes of calls/month, no cost.
- Starter: $6/month, 75 minutes of calls included, plus text messages and a
  commercial license.
- Pay-as-you-go beyond included minutes: **$0.080/minute standard** (the
  guide chat's session had estimated ~$0.10/minute — the actual verified
  rate is lower), with **$0.160/minute burst pricing** also available for
  higher-priority calls.

**Startup Grants Program** — verified directly against `elevenlabs.io/grants`
on 2026-09-11: 12 months of free platform access, 33,000,000 characters
(ElevenLabs' own estimate: 680+ hours of agent usage), covering the full
platform (Conversational AI agents, TTS/STT, voice cloning, and more).
Application is a 3-step process (apply → decision within ~1 week → credits
applied on approval) at `elevenlabs.io/grants-application`.
**Action: apply today** — this costs about 10 minutes, carries no build
commitment, and secures the free-tier path if this project proceeds. Worth
doing regardless of the exact timeline decided below.

**Alternative, not independently priced this session:** OpenAI Realtime
API — same category, different (token+audio based) pricing model. Re-check
its actual current pricing before committing to it; nothing about it was
verified this session, so it should not be assumed comparable to the
ElevenLabs figures above without a fresh check.

Given the project is already on Cloudflare Workers, ElevenLabs' widget embed
is the lower-friction integration path of the two.

## Hard requirements, not optional

- **Knowledge base must be strictly scoped** to FixProve's own verified
  documentation (README, the deep-research report, the session notes) via
  retrieval — never open-ended generation. This is the direct mitigation
  for the reputational risk named above.
- **Legal gate, blocking:** do not deploy this feature until
  `PRIVACY-POLICY-DRAFT-v2.md` (or its published successor) is updated to
  disclose the new third-party audio data flow, or the feature ships on a
  page explicitly carved out of that document's current "no third-party
  script" claim. This is downstream of the still-pending "publish v1
  Privacy Policy" decision — do not get ahead of that decision by building
  or shipping this first.

## Phases (build only after Sept 17)

1. Write and script the presentation narration — Yehor's own
   voice-approved script, reviewed before any TTS touches it.
2. Apply for the ElevenLabs Startup Grants Program (do this part today,
   independent of the rest of the timeline — see above).
3. Stand up the ElevenLabs agent against the scoped knowledge base
   described above.
4. Update the Privacy Policy draft to cover this data flow (see legal
   gate above — this step is not optional and not skippable).
5. Embed on `fixprove.dev/demo`, only once the legal gate is satisfied.
6. Test with strangers before calling it done — the same standard already
   applied to every other product claim on this site.

## What this doesn't change

The still-open items — the manual customer self-test, the CLI build/test
gate on Yehor's machine, the travel-time check, the Nordea login, Monday's
Augustin nudge — are unchanged. This is the fourth idea filed as backlog
this session (after the content-strategy, automated-self-test, and now this
one) rather than acted on immediately, for the same reason each time: none
of them is what's actually standing between now and Sept 16.

# FixProve — 30-day pilot (free)

**FixProve catches code that calls functions, methods or imports that don't
exist in your installed dependencies — the typical mistake of AI coding
assistants — before it is merged.** Deterministic: no AI in the check, the
same input always gives the same answer.

## The offer

- **Free for 30 days**, for one team, on as many repositories as you like.
- **Python and TypeScript/JavaScript.** Install: `pip install fixprove`
  (Python 3.10+), optionally `npm install -g fixprove`.
- **Run it where you already work:** locally, in a pre-commit step, or in
  your own CI. Exit codes `0` clean / `1` found something / `2` setup error
  or (from v0.1.17) nothing was checked — drops straight into a CI gate.

## What leaves your environment: nothing

- The CLI makes **no network calls and sends no telemetry**. Your code is
  analysed on your own machine or CI runner. (Verified from source,
  2026-10-05; stated in the public README.)
- To know what really exists, FixProve imports your project's installed
  dependencies in an isolated local subprocess — the same packages your
  application already runs.
- The pilot is the CLI only. (Our optional GitHub App works differently and
  is not part of this pilot.)

## What we ask in return

1. **A 20-minute feedback call** at the end — what it caught, what it got
   wrong, what would make it worth paying for.
2. **If it caught something real:** a one-page, **non-binding** letter of
   interest (template provided — no price commitment, no contract).

## Honest limits today

- Early-stage product from a one-person Danish company; beta, no SLA.
- Known gaps are published in the README (e.g. some `from pkg.sub import
  Name` patterns can be false-flagged; TypeScript module augmentation is
  skipped, not guessed).
- False positives are possible; every one you report gets investigated.

**Contact:** Yehor Kaliberda · yehor@yehor.ai · fixprove.dev
FixProve v/ Yehor Kaliberda · CVR 46646223 · Aarhus, Denmark

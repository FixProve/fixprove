# Keystone Report — Session 3.2: Deployment Runbook, Unified Manifest, Launch Copy

**Project:** FixProve — Milestone 4 (Production & Launch)
**Session:** 3.2 — Live deployment runbook, unified Keystone Proof-of-Process manifest, build-in-public launch copy
**Director:** Yehor
**Date:** 2026-07-04

---

## 1. Provenance

100% of the content in this delivery was AI-generated (Claude, Sonnet 5) in this session. No human edits have been applied yet. This session produced documentation and copy, not code — there is no application logic to trace with `#KS-TRACE` block-by-block, so traceability instead takes the form this report's Section 3 uses: every non-obvious claim in the three deliverables is cross-referenced against a specific, named source file or a specific line in an existing Keystone Report, not asserted from memory.

Files delivered:

- **`RUNBOOK-LIVE-DEPLOYMENT.md`** — a step-by-step runbook covering Cloudflare Worker live deployment (Part A), GitHub App production registration (Part B), and a cross-reference to the already-existing PyPI/npm release process from Session 3.1 (Part C), closing with an explicit HUMAN/AUTOMATED boundary table.
- **`KS-MANIFEST-UNIFIED-PROOF-OF-PROCESS.md`** — a single document summarizing all ten prior Keystone Reports (0.1 through 3.1): what was built, how it was verified, what defects were found, and — stated as its own explicit section — which reports actually carry Yehor's signature versus which remain pending.
- **`LAUNCH-COPY-BUILD-IN-PUBLIC.md`** — landing-page hero copy, a one-paragraph description for package listings, a build-in-public launch post, a short-form social post, and an explicit list of tone guardrails (as negative examples) enforcing the requested Nordic Warm Minimalism voice.

## 2. Verification Summary

Documentation and copy cannot be unit-tested the way code can. Verification this session instead means: every factual claim was checked against its source before being written down, and both remaining self-checks below were run before delivery.

| Check | Method | Result |
|---|---|---|
| Sign-off status per session (manifest) | `grep`-searched every `KS-REPORT-*.md` file in the repository for its actual accountability-section content, not recalled from prior-session summaries | Corrected one initial arithmetic error (defect count totaled 18 in a first draft, actually 17) and one leftover drafting aside, both caught on a self-reread before delivery — see Section 3 |
| Test counts per session (manifest) | `grep`-extracted the literal `**N/N passed**` lines from each report's own verification-summary table | All ten rows match the source reports exactly |
| Runbook's Cloudflare/GitHub config claims | Read the actual current `worker/wrangler.toml`, `worker/README.md`, `app/templates/fixprove-check.yml`, and `app/README.md` directly, not summarized from memory | Surfaced a real, previously-undocumented gap — see Section 3 |
| Launch copy claims about current deployment status | Cross-checked against `worker/README.md`'s own "Status" section and `app/README.md`'s own "Status" section | Copy states the App is "not running in production yet" and commits to updating that line the moment it is — matches actual current state exactly, no overclaim |
| Signature fabrication check | Confirmed no document in this delivery fills in a signature on Yehor's behalf; the manifest table reproduces existing signatures exactly as found (including an inconsistent date on 2.2, flagged rather than silently corrected) | Clean |

## 3. Defects / Gaps Caught and Fixed

**Gap S3.2-WORKER-ROUTE-001 (a real, previously-undocumented configuration gap, found while writing the runbook — not a code defect in the sense of a failing test, since nothing was ever tested against a live domain):** `worker/wrangler.toml`, as delivered in Session 2.2, defines no `routes` entry at all. Left as-is, `wrangler deploy` would only publish to the Worker's default `*.workers.dev` subdomain. Meanwhile, `app/templates/fixprove-check.yml` — the GitHub Action every customer installs — hardcodes its findings-callback POST to `https://api.fixprove.dev/callback`, and the Worker's own `CALLBACK_AUDIENCE` variable is already set to `https://fixprove.dev/callback`. Neither Session 2.2's own Keystone Report nor `worker/README.md`'s "Setup for a real deploy" steps mention binding a custom domain — an omission that would have caused the very first live deploy attempt to silently serve on the wrong hostname, with every customer Action's callback failing to reach it. This is now an explicit, numbered step (Part A2) in the delivered runbook, with the exact `wrangler.toml` snippet needed to close it.

**Self-caught drafting errors in the manifest (corrected before delivery, not shipped):** a first draft of the manifest's closing paragraph both miscounted the total defects across all ten sessions (summed to 18 using an incorrect per-row figure) and contained a stray first-person drafting aside ("— five, correcting as I write this") that should never have been left in a delivered document. Both were caught on a self-reread immediately after writing the file and corrected before this report was written — the correct total is **17**, and the per-row figures in the sign-off table were re-verified against each source report's own accountability section as the basis for that correction.

## 4. Known Limitations (stated plainly, nothing softened)

1. **This session did not perform any of the runbook's own steps.** The runbook is a specification for Yehor to execute, not a record of execution. Nothing in `RUNBOOK-LIVE-DEPLOYMENT.md` should be read as "this has been done" — every HUMAN-marked step is still outstanding as of this report.
2. **The manifest's sign-off table reproduces the Session 2.2 report's signature date (`04.06.27`) exactly as found**, even though it does not fall in chronological sequence with the surrounding `04.07.26` dates on the reports immediately before and after it. This was flagged in the manifest itself rather than silently corrected, since altering a signed document's contents — even a probable typo — is not this session's call to make.
3. **The launch copy's claims are accurate only as of this session's date (2026-07-04).** If the live deployment runbook is executed before this copy is published, the line stating the App "isn't running in production yet" will become false and must be updated — this is called out explicitly inside the copy document itself (Section 3, "What we're not claiming"), not left as a silent trap for whoever publishes it.
4. **The manifest is a summary, not a substitute for the underlying reports.** Anyone relying on it for a specific technical decision (e.g., exactly what `KVPendingCheckRunStore` does on a corrupted value) should read the relevant original Keystone Report — this manifest intentionally compresses detail in exchange for giving a whole-project view in one document.
5. **Nordic Warm Minimalism is this session's own interpretation of the brief**, not a pre-existing brand guideline found anywhere in the repository (the master build plan does not specify a visual or copy voice beyond the product's positioning). If Yehor has a different concrete reference in mind, the tone guardrails in Section 5 of the launch-copy document are the fastest place to redirect it.

## 5. Accountability Statement

I, **Yehor**, confirm that this Keystone Report accurately reflects the state of Session 3.2's deliverable: a runbook that has not yet been executed, a manifest whose sign-off table I have reviewed against the underlying reports, and launch copy whose factual claims I confirm match the project's actual current state at the time of publication. I take responsibility for the decision to execute the runbook, publish the launch copy, and countersign any of the five still-pending session reports the manifest identifies.

Signature: Yehor Kaliberda
Date: 04.06.26
*(Per standing Keystone rule: this signature is Yehor's own required human action. It has not been and will not be fabricated on his behalf.)*

## 6. Methodology Note (one suggested improvement to the process itself)

Compiling the unified manifest surfaced a real, if minor, process gap that no single session would have caught on its own: Milestone-level "closes" (Milestone 0's formal sign-off, and the Gemini-audited closes of Milestones 1 and 2 recorded in this project's conversation history) have been treated as sufficient to advance to the next milestone, without every individual session report underneath that milestone also carrying Yehor's own signature. Five of ten reports remain unsigned at the individual-session level despite two full milestones having been declared closed on top of them. Suggested improvement: either (a) require every session report to be signed before its milestone can close, closing this gap going forward, or (b) if a milestone-level audit is intended to supersede individual session sign-offs by design, state that explicitly in the Keystone constitution itself, so it reads as a deliberate process choice rather than an accumulating gap discovered only when someone compiles a manifest and counts.

# STAGE-1-DEPLOY-RUNBOOK.md — free-beta publish sequence, Yehor's hands only

Written 2026-08-05, Session 4.12-K. Updated same day (Addendum 3, session close) once
the public-edition derivation existed — see below. This sandbox cannot push,
commit-and-push, or deploy — every step below is a command for Yehor to run on his own
machine. Nothing in this runbook has been executed. Do this only after you're satisfied
with the public documents (address now inserted: Stockholmsgade 3, 1. th, 8200 Aarhus N)
and the engineering diffs (`worker/src/kvPendingStore.ts`, `worker/test/fakeKv.ts`,
`worker/test/kvPendingStore.test.ts`, `web/src/app/page.tsx`, `README.md`).

**Update, session close:** step 3/8's original open question — "soften internal-drafting
language for the public-facing version before deploying, don't copy the working draft
verbatim" — is now answered. That softening pass is `web/legal/terms-public.md` and
`web/legal/privacy-public.md` (header replaced, all `[COUNSEL-REVIEW]` brackets removed,
substance otherwise unchanged, independently diff-verified — see the session log's
Addendum 1/2). **Deploy the `web/legal/*-public.md` files, not the internal
`*-DRAFT-v2.md` files** — the internal drafts must never reach a public route.
`web/legal/OPEN-QUESTIONS-LOG.md` is internal-only and must never be linked from or
served at any public route either.

## 0. Pre-flight

```
cd <your FixProve checkout>
git status --short          # confirm it matches what this session reports
pnpm test                   # full-suite confirmation — this sandbox could only run
                             # worker/test/kvPendingStore.test.ts (9/9 pass); run the
                             # whole thing here before trusting it
```

If `pnpm test` fails anywhere, STOP — do not proceed to commit/deploy until green.

## 1. Exposure check, one more time, on your own machine

```
grep -rniE "\$[0-9]|DKK ?[0-9]{2,}/|sk_live|sk_test|acct_[A-Za-z0-9]+" \
  TERMS-OF-SERVICE-DRAFT-v2.md PRIVACY-POLICY-DRAFT-v2.md CONSUMER-TERMS-OF-SALE-DRAFT.md \
  PRIVACY-POLICY-DRAFT-v2.md ARTICLE-28-DPA-DRAFT.md
```
Expect no output beyond generic "price/pricing" mentions with no real figures attached.

## 2. Decide what actually goes live in Stage 1

Stage 1 is the FREE beta only. Recommended live set: Privacy Policy v2, Terms of Service
v2 (B2B core), the waitlist consent UI, the README sync, the KV TTL fix. NOT live yet
(Stage 2/3 material, keep off the public site): Consumer Terms of Sale, checkout copy,
withdrawal form, refund policy, complaint block, D-3/ApS memos — these are prep for later
stages and publishing them now would imply a paid tier exists, which it doesn't.

## 3. Wire the legal pages

This repo doesn't yet have `/privacy` or `/terms` routes in `web/src/app` — only the
landing page exists. [ENGINEERING, not done this session: add
`web/src/app/privacy/page.tsx` and `web/src/app/terms/page.tsx` rendering
`web/legal/privacy-public.md` and `web/legal/terms-public.md` (NOT the internal
`*-DRAFT-v2.md` files), or a build step that converts those `.md` files into those
routes. Decide the mechanism before deploying — the waitlist consent line already links
to `/privacy`, so that link 404s until this exists. This is explicitly gated on Yehor
reviewing the public-edition derivation first — it has deliberately not been started.]

## 4. Commit (named paths only, never wildcard-stage)

```
git add web/legal/terms-public.md web/legal/privacy-public.md \
  worker/src/kvPendingStore.ts worker/test/fakeKv.ts worker/test/kvPendingStore.test.ts \
  web/src/app/page.tsx README.md \
  <the new /privacy and /terms route files once built>
git status --short   # re-verify exactly this list, nothing else, before committing
git commit -m "feat(legal): publish public-edition Privacy Policy + Terms, TTL safety-net, waitlist consent UI"
git show --stat HEAD  # fresh re-verify after commit, don't trust the commit command's own stdout alone
```

Do **not** `git add` the internal drafts (`TERMS-OF-SERVICE-DRAFT-v2.md`,
`PRIVACY-POLICY-DRAFT-v2.md`, `ARTICLE-28-DPA-DRAFT.md`) or
`web/legal/OPEN-QUESTIONS-LOG.md` as part of a *public* deploy commit. Whether to track
them in git at all (privately) is a separate decision — they must not be what the
`/privacy` and `/terms` routes render.

## 5. Push

```
git push origin main
```
Expect the usual owner-bypass branch-protection message — that's expected per the
standing 2026-07-21 convention, not an error.

## 6. Post-push CI check (per-job, not just run-level)

```
gh run list --branch main --limit 1
gh run view <run-id> --json jobs
```
Both required jobs must show `success` before you consider this landed.

## 7. Deploy

```
cd web && pnpm run deploy   # or whatever the actual wrangler deploy command is in this
                             # package — confirm against web/package.json before running
```

## 8. Live done-checks — run these AFTER deploy, from a fresh/incognito fetch, not a cached tab

- `curl -s https://fixprove.dev/privacy | grep -i "Stockholmsgade"` — address renders.
- `curl -s https://fixprove.dev/terms | grep -i "independent legal review in progress"` —
  confirms the public header (not the internal `NOT LEGALLY REVIEWED` marker) is what's
  actually live.
- `curl -s https://fixprove.dev/privacy | grep -i "COUNSEL-REVIEW"` — expect **zero**
  output; if this matches, the internal draft was deployed by mistake, stop and fix.
- `curl -s https://fixprove.dev/ | grep -i "consent"` — waitlist consent line present.
- `curl -s https://raw.githubusercontent.com/FixProve/fixprove/main/README.md | grep -i "Privacy"` — README section live.

## What this runbook does NOT authorize

No Stripe live mode, no pricing publication, no GitHub App public flip, no Marketplace
listing, no B2B/B2C checkout of any kind. This is the free-beta publish only, per Stage 1
of the 2026-08-05 `MEMORY/critical-actions.md` entry.

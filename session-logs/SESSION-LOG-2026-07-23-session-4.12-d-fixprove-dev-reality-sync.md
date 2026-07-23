# SESSION LOG — 2026-07-23 — Session 4.12-D ("fixprove.dev Reality Sync")

Full detail: `KS-REPORT-4.12D-fixprove-dev-reality-sync.md`. This log is the
narrative recap; the KS-REPORT is the attested record.

## Intake

Bridge to `rog` confirmed live. `.git/*.lock` — found `HEAD.lock` and
`index.lock` already present at session start (stale from a prior session's
git operation); renamed away per convention, never deleted (this mount's
`unlink` returns "Operation not permitted" — expected, not a crash). HEAD
confirmed at `d4aaacb`, matching the starting prompt's expectation exactly,
no drift. `origin/main` independently confirmed identical to local HEAD
(`git rev-list --left-right --count origin/main...HEAD` = `0 0`) — meaning
4.12-C's last open item (pushing `d4aaacb`) was already done by the time
this session opened; CA-5 for `d4aaacb` was re-confirmed via a live Chrome
fetch of the check-runs API (WebFetch itself 403'd on the GitHub API,
worked fine via an actual browser tab) since 4.12-C's own state snapshot
hadn't recorded that check yet.

## Compliance questions asked before any content shipped

Three questions put to Yehor before drafting anything real:
1. Hero-copy source — resolved: use `LAUNCH-COPY-BUILD-IN-PUBLIC.md` §1,
   drop the unverified "90ms" claim, reword the GitHub-App line.
2. Waitlist form disposition — resolved: keep, demote (tracked
   external-signal channel, currently zero).
3. Deploy path — resolved: manual `wrangler deploy` by Yehor, same pattern
   as `git push`, after positively confirming (not assuming from absence)
   that no CI workflow deploys `web/`.

## Execution

Built the OG image and favicon from `logo/FP LOGO.png` via Python/Pillow,
caught and fixed two image-generation defects along the way (visible black
box from an unkeyed crop; a favicon that silently wrote only one frame
instead of four) — both logged in the KS-REPORT with the exact fix. Sent
the OG image and favicon previews to Yehor, then the exact final copy, for
approval before staging. Yehor caught a second overclaim in the GitHub-App
line via his own `gh api` check-runs query and specified the replacement
wording.

Wrote `page.tsx`/`layout.tsx`/`globals.css` plus the three new asset files,
landed on the mount via write-to-new-name-then-mv, checksum-verified.
Verified the whole thing with a real `next build` — not run via
`device_bash` (its mounted `node_modules` doesn't resolve `next`'s bin
script across the bridge, confirmed via a literal `MODULE_NOT_FOUND`) but
via a disposable copy built fresh in the cloud sandbox with the project's
real `package.json`/lockfile. Build succeeded; the rendered `out/
index.html` was read directly and confirmed to carry every required
`og:*`/`twitter:*` tag, an absolute OG image URL, and a non-default
favicon link — plus a body with live install commands and no "coming
soon" language anywhere.

Exposure check (redacted mark, `low-to-moderate`, `$29`/`$99`, CPR pattern)
run clean against `web/` before staging. Committed locally as `6c2065b`
(6 files, 140 insertions/21 deletions) — every committed blob's checksum
verified to match the pre-commit source file exactly. `git fsck` shows only
the usual dangling-blob noise this mount always produces.

## What's NOT done

The build is not deployed. This sandbox cannot reach Cloudflare and no CI
workflow deploys `web/` on push (positively confirmed by grep, not
inferred) — Yehor needs to run the deploy himself. The starting prompt's
own falsifiable done-checks (live `og:*` tags, a real favicon in a browser
tab, live copy, the OG image loading) all require that deploy to have
happened first; they have not been run yet.

## Handoff

Two literal commands handed to Yehor (see chat): `git push origin main`,
then `cd web && npm run deploy` (runs `next build && wrangler deploy` per
`web/package.json`'s own script, using the existing `wrangler.toml`
pointed at `fixprove`/`./out`). CA-5 for the pushed commit and the
starting prompt's live-page done-checks both run immediately after Yehor
confirms the deploy landed.

# KS-REPORT-4.12D — Addendum: live deploy + falsifiable done-check verification

Addendum to `KS-REPORT-4.12D-fixprove-dev-reality-sync.md`. That report's
build-level work was complete but its own §2 explicitly listed the live
deploy and the starting prompt's falsifiable done-checks as NOT yet run.
This addendum closes both, same-day, 2026-07-23.

## Push + CA-5

Yehor ran `git push origin main` on `rog`. Output confirmed
`d4aaacb..a581ff3 main -> main` (both this session's commits landed in one
push), with the expected `Bypassed rule violations for refs/heads/main`
notice (the standing, accepted admin-bypass pattern — see
`MEMORY/critical-actions.md`'s 2026-07-21 CA-5 entry). Confirmed
independently via the shared-mount `origin/main` ref: `a581ff3`, matching
local HEAD exactly, 0 ahead/0 behind.

CA-5 re-checked via a live Chrome fetch of
`api.github.com/repos/FixProve/fixprove/commits/a581ff3/check-runs`
(WebFetch itself 403'd on this endpoint; the identical URL worked via an
actual browser tab both this session and last). First read showed both
jobs `in_progress`; waited ~20s and re-fetched (cache-busted navigation,
not a stale tab) — `build` completed 13:25:39Z, `test-python` completed
13:25:23Z, both `conclusion: success`.

## Deploy

Yehor ran `cd web && npm run deploy` on `rog`. Output showed `next build`
succeeding (6/6 static pages, matching this session's own local build
exactly) followed by `wrangler deploy`: 9 new/modified assets uploaded
(including `og-image.png`, `favicon.ico`, `apple-icon.png`, `index.html`),
"Uploaded fixprove", "Deployed fixprove triggers", Version ID
`02db1fa6-b21e-44fc-bd92-8c3da48f6975`.

## Live falsifiable done-checks — all four PASS

Run against `https://fixprove.dev` directly via a live Chrome tab
(cache-busted navigation), per the starting prompt's own instruction to
verify by live fetch, not by reading source:

1. **`og:*`/`twitter:*` tags non-empty in the rendered `<head>`** — read
   directly via `document.querySelectorAll` on the live page (not the
   page's source file): `og:title`, `og:description`, `og:url`,
   `og:site_name`, `og:image` (`https://fixprove.dev/og-image.png`),
   `og:image:width=1200`, `og:image:height=630`, `og:image:alt`,
   `og:type=website`, `twitter:card=summary_large_image`,
   `twitter:title`, `twitter:description`, `twitter:image` — all present,
   all non-empty. PASS.
2. **Non-default favicon** — `<link rel="icon" href="/favicon.ico">`
   confirmed wired on the live page; `/favicon.ico` fetched directly via
   `Image()` load, resolved successfully (browser selected the 64×64
   frame from the multi-size ICO — confirms the multi-frame file serves
   correctly, not just a single fallback frame). Note: this automation
   tool captures page content, not the OS-level browser tab strip, so
   "a real browser tab shows the icon visually" was not screenshotted
   directly — the underlying artifact (a valid, loadable, non-default
   favicon wired via the correct `<link>` tag) is confirmed; the purely
   visual tab-chrome rendering is inferred from that, not separately
   screenshotted. PASS, with that one caveat stated plainly rather than
   overclaimed.
3. **Visible copy contains a real install command, no "coming soon"/
   "beta"/"unavailable" language** — `get_page_text` on the live page
   shows `$ pip install fixprove`, `$ npm install -g fixprove`, `$
   fixprove check /path/to/your/project`, the reworded GitHub-App line,
   and the demoted "Stay in the loop" section — no stale waitlist-era
   language anywhere. PASS.
4. **OG image loads directly, non-zero dimensions** — `Image()` load
   against `https://fixprove.dev/og-image.png` (cache-busted) resolved
   with `naturalWidth: 1200, naturalHeight: 630` — exact match to the
   dimensions declared in the metadata. Same check also run against
   `apple-icon.png` (180×180, matches) as a bonus. PASS.

## Verdict

Milestone-3 artifact A (`fixprove.dev`) is now fully LIVE and matches the
starting prompt's must-close list and every falsifiable done-check,
verified against the real production site, same day as the build.

## Signature status

`KS-REPORT-4.12D-fixprove-dev-reality-sync.md`'s own §5 Accountability
Statement is still recorded as PENDING in that file (append-only —
not edited here). This addendum does not itself constitute Yehor's
sign-off; that remains his to give, now that the live verification above
gives him a complete picture to sign against.

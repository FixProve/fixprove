# KS-REPORT-4.12D — fixprove.dev Reality Sync

Session 4.12-D, 2026-07-23. Scope: `NEXT-SESSION-4.12-D-STARTING-PROMPT.md`'s
full must-close list (5 items). This is Milestone-3 artifact A's last PARTIAL
item — the live landing page had been telling cold visitors to wait for a
CLI that has been live on npm/PyPI since v0.1.1 (`COVER-FIX-STRATEGY.md`).

## 1. Provenance (AI-generated vs human-edited)

All code (`web/src/app/page.tsx`, `layout.tsx`, `globals.css`) and both image
assets (`web/public/og-image.png`, `web/src/app/favicon.ico` +
`apple-icon.png`) are AI-generated this session, derived from
`logo/FP LOGO.png` and from copy drafted in `LAUNCH-COPY-BUILD-IN-PUBLIC.md`
§1 (itself a prior-session AI draft). Every content decision with more than
one reasonable answer was put to Yehor before it shipped, in this order:

1. Hero-copy source (use §1 vs. plain README mirror vs. verbatim §1) —
   Yehor chose "use §1, drop the unverified 90ms claim, reword the App
   line" and added the instruction that any material rewording be shown to
   him before shipping.
2. Waitlist form disposition (remove vs. demote vs. leave as-is) — Yehor
   chose demote, citing `PROGRESS.md`'s external-signals-counter-at-zero
   tracking as the reason to keep a working signal channel rather than
   delete it.
3. Deploy path (manual `wrangler deploy` by Yehor vs. an auto-deploy this
   session had missed) — Yehor asked for positive verification (not an
   absence-based assumption) that no CI workflow deploys `web/`; this was
   done by grepping both workflow files for `wrangler|cloudflare|pages|
   deploy` and finding zero matches, not just noting no file was named
   "deploy."
4. Final copy + OG image/favicon preview — sent to Yehor before staging.
   Yehor caught a second overclaim in the App line (see §3, defect 2) via
   his own live `gh api` check-runs query and specified the exact
   replacement wording.

No CA-1/CA-2/CA-3 action was proposed or taken. No pricing was published or
drafted anywhere public-facing. The GitHub App's ORG-ONLY installation
setting was not touched — only *described*, and the description was
corrected specifically because its first draft implied otherwise.

## 2. Verification summary

- **Local build:** `next build` run against a disposable copy of this
  session's exact files (`page.tsx`, `layout.tsx`, `globals.css`,
  `favicon.ico`, `apple-icon.png`, `og-image.png`) plus the real
  `package.json`/`package-lock.json`/`tsconfig.json`/`next.config.js`,
  installed fresh via `npm install` in the cloud sandbox (chosen over
  `device_bash` because the mounted `node_modules` at
  `~/mnt/FixProve/web/node_modules` does not resolve `next`'s bin script
  across the SMB-style bridge — confirmed via a literal
  `MODULE_NOT_FOUND` on `next/dist/bin/next`, not assumed). Build
  succeeded: `✓ Compiled successfully`, all 6 static pages generated, zero
  type errors.
- **Rendered-HTML inspection (not source inspection):** `out/index.html`'s
  `<head>` was read directly. Confirmed present and non-empty: `og:title`,
  `og:description`, `og:url`, `og:site_name`, `og:image` (absolute
  `https://fixprove.dev/og-image.png`, resolved via `metadataBase`),
  `og:image:width=1200`, `og:image:height=630`, `og:image:alt`,
  `og:type=website`, `twitter:card=summary_large_image`, `twitter:title`,
  `twitter:description`, `twitter:image`, and
  `<link rel="icon" href="/favicon.ico" ... sizes="16x16">`. `out/`
  physically contains `favicon.ico`, `apple-icon.png`, and `og-image.png`
  at the paths the metadata references.
- **Body-copy inspection:** the rendered `<body>` shows the install
  commands, the reworded App line, and the demoted waitlist section —
  no "coming soon"/"beta"/"unavailable" language anywhere on the page.
- **OG image geometry:** confirmed programmatically at generation time —
  `canvas.save()` on a `(1200, 630)` `Image` object, not inferred from a
  visual check alone. The glyph was resized with a single uniform ratio
  (`min(target/width, target/height)`) applied to both axes, never
  stretched.
- **Favicon legibility at true size:** the *actual* 16×16 and 32×32 frames
  (not a scaled-up 256px preview) were rendered and visually inspected —
  see defect 4 below; the first attempt was illegible at true size and was
  replaced.
- **Exposure check:** `git grep`/`grep -rE` across `web/` for the redacted
  comparison-mark name, `low-to-moderate`/trademark-admission phrasing,
  `$29`/`$99`, and a CPR-shaped digit pattern — all clean, run immediately
  before `git add`.
- **Git integrity:** every committed blob's `git show <sha>:<path> |
  sha256sum` matches the pre-commit local file's checksum exactly (6/6
  files, byte-for-byte). `git fsck --no-progress` shows only dangling blobs
  (expected on this mount, matches prior sessions).
- **CA-5, carried forward from 4.12-C's open item:** `d4aaacb` (the commit
  this session inherited as HEAD) was independently re-checked via an
  anonymous fetch of `api.github.com/repos/FixProve/fixprove/commits/
  d4aaacb/check-runs` (WebFetch 403'd; the same call via a live Chrome tab
  succeeded): `build` and `test-python` both `completed`/`success`. This
  closes 4.12-C's last open item — `origin/main` and local `HEAD` were
  independently confirmed identical (`d4aaacb`, `git rev-list --left-right
  --count origin/main...HEAD` = `0 0`) before this session's own commit.
- **NOT yet verified — blocked on Yehor's deploy:** the starting prompt's
  own falsifiable done-checks (live `og:*` tags, a non-default favicon in
  a real browser tab, live page copy, the OG image loading via direct
  fetch) all require the built site to actually be live on
  `fixprove.dev`. This sandbox has no route to Cloudflare
  (`api.cloudflare.com`/`fixprove.dev` are Cloudflare-fronted, confirmed
  via `web/wrangler.toml`'s `[assets]`/`[[kv_namespaces]]` config, and
  prior sessions' memory already documents the sandbox's Cloudflare
  block), and no CI workflow deploys `web/` on push (positively confirmed
  by grepping `.github/workflows/ci.yml` and `release.yml` for
  `wrangler|cloudflare|pages|deploy` — zero matches, not inferred from
  absence). Publishing requires Yehor to run the deploy himself; the
  live-page checks run immediately after he confirms it landed.

## 3. Defects caught and fixed

1. **Unverified performance claim ("ninety milliseconds").** The
   marketing-copy draft's subhead read "Ninety milliseconds, not a second
   opinion." A repo-wide grep for `millisecond|90 ms|90ms|benchmark` found
   the phrase existed nowhere else — no benchmark test, no measured
   number, anywhere in the codebase. Dropped from the shipped subhead.
   Same overclaim class the Keystone constitution's "no 'it should work'"
   rule exists to catch, just applied to a marketing number instead of an
   engineering claim.
2. **Unverified/false usage claim ("Want it on every pull request?").**
   The marketing-copy draft's GitHub-App line implied both (a) third-party
   installability — incorrect, the App is ORG-ONLY and that stays
   legal-blocked this session — and, per Yehor's own follow-up
   verification, (b) that the App is "currently used on our own repos."
   Yehor ran `gh api repos/FixProve/fixprove/commits/724e71c/check-runs`
   directly: only `build`/`test-python`, both owned by the `github-actions`
   app, appear — no FixProve App check-run. Combined with the
   independently-known fact that every push to this repo has gone
   direct-to-main with zero pull requests ever opened (the branch-
   protection-bypass entries in `MEMORY/critical-actions.md`), a
   PR-triggered App check has had no opportunity to fire, ever. The claim
   was publicly falsifiable by any visitor opening the repo's checks tab.
   Replaced with: *"The GitHub App runs the same check as a blocking
   status on pull requests. Not yet open for third-party installation."*
   — states only what's independently verifiable.
3. **Favicon silently wrote a single frame instead of a multi-size icon.**
   First attempt used `Image.save("favicon.ico", sizes=[(16,16),(32,32),
   (48,48),(64,64)], append_images=[icon32, icon48, icon64])`, following
   an assumption that `append_images` supplies the per-size source bitmaps
   the way it does for animated GIF/TIFF. It doesn't — Pillow's ICO
   encoder resizes the *base* image (`icon16`, itself only 16×16) to each
   requested size and ignores `append_images` entirely. Caught by
   re-opening the written file and checking `Image.open(...).info["sizes"]`
   — it reported a single `(16, 16)` entry, not four. Fixed by hand-packing
   a PNG-payload ICO (the widely-supported modern format: an `ICONDIR` +
   `ICONDIRENTRY` per size, each pointing at an embedded PNG blob) from
   four independently-rendered bitmaps. Re-verified: `Image.open(
   "favicon.ico").info["sizes"]` now reports all four sizes.
4. **Favicon illegible at true rendering size.** The first legible-looking
   favicon was only checked via a 256px preview. Rendering the *actual*
   16×16 frame (nearest-neighbor upscaled 16× for inspection, not
   resampled smooth) showed the "FP" monogram as a blurred gray blob —
   antialiased strokes that are only ~1-2px wide at that size lose almost
   all contrast. Fixed by (a) increasing the glyph's scale within the
   canvas for the two smallest sizes (16/32/48 at 0.72-0.82 of canvas vs.
   0.62 for 64+), and (b) hard-thresholding those same sizes' alpha channel
   (pixel is either fully opaque or fully transparent, no gray
   antialiasing) so the strokes stay crisp instead of dissolving into a
   blur. Re-verified by rendering the true 16×16 and 32×32 frames again —
   both show a legible, if compact, "FP".
5. **OG glyph would have shown a visible black box if cropped naively.**
   The source logo (`FP LOGO.png`) is a 500×500 RGB image: a small white
   "FP" monogram on a pure-black (`0,0,0`) square background. A first pass
   cropped tightly to the glyph's bounding box and pasted that crop
   (including its black background) onto the OG/favicon canvases (bg
   `#0b0d10`) — the two near-black colors differ enough to leave a visible
   hard-edged rectangle around the glyph. Fixed by keying the crop's
   luminance directly to an alpha channel (white glyph → opaque, black
   background → transparent) before compositing, so the glyph blends
   into either canvas with no visible box. Caught by viewing the
   intermediate render, not assumed correct from the compositing logic
   alone.

## 4. Known limitations — unsoftened

- **The live-page done-checks have not run.** Everything above verifies
  the *build*, not the *deployment*. Until Yehor runs the Cloudflare
  deploy, `fixprove.dev` still serves the old waitlist-era page — an
  anonymous fetch right now would still show stale content, and that is
  expected, not a failure of this session's work.
- **The waitlist's underlying claim is now slightly narrower than before,
  by design** — it advertises "GitHub App wider release + launch news"
  updates, not the CLI (which no longer needs an early-access channel
  since it's installable today). If a future session wants a different
  framing, treat this as a copy decision, not a defect.
- **The OG image and favicon are hand-drawn compositions derived from the
  logo, not the logo used verbatim.** The must-close instruction said
  "derived from logo/FP LOGO.png (resize/pad, don't stretch)"; a literal
  letterboxed resize of the raw logo onto a 1200×630 canvas would have
  produced a mostly-empty image with a tiny centered mark (unusable as a
  real social-card preview), so a wordmark + tagline layout was built
  around the same glyph instead. This is a judgment call, shown to Yehor
  as an image before shipping, not silently substituted for the literal
  instruction.
- **`fixprove check`'s exact CLI flag reference isn't reproduced on the
  landing page** — the install block mirrors README's three commands
  exactly but doesn't duplicate README's fuller flag/exit-code
  documentation; visitors are pointed to `cli/README.md` via the existing
  unchanged text below.
- **No automated accessibility or Lighthouse pass was run** — this session
  verified metadata correctness and visual legibility by direct
  inspection, not a formal a11y/perf audit.

## 5. Accountability statement

This report and the underlying commit (`6c2065b`) were prepared by Claude
(Node 1, Lead Technical Co-Pilot) under the Keystone Operating Constitution
v1.1.0. Every content decision with more than one reasonable answer was
surfaced to Yehor before it shipped (§1). Two overclaims were caught before
publication (§3, defects 1-2); one of those two was caught by Yehor's own
independent verification, not this session's own first pass — logged
honestly rather than claimed as a unilateral catch.

Signature: **PENDING — Yehor.**

## 6. Methodology notes (candidates for future heuristic promotion)

- **`device_bash`'s mounted `node_modules` doesn't reliably resolve a
  package's bin script across the SMB-style device bridge.** A real build
  verification needs either (a) mirroring the minimal package manifest +
  source into the cloud sandbox and running `npm install` fresh there
  (what this session did), or (b) asking Yehor to run the build on his own
  machine. Don't assume `device_bash` can run `next build`/similar tooling
  just because `node_modules` is present on the mount.
- **Pillow's `Image.save(..., format="ICO", sizes=[...], append_images=
  [...])` does not multiplex `append_images` into distinct per-size ICO
  frames** — it resizes the single base image to each requested size and
  silently ignores `append_images`. For a true multi-bitmap ICO with
  different source content per size, hand-pack the PNG-payload ICO format
  directly (small, well-documented, ~20 lines).
- **A favicon (or any tiny-scale asset) must be checked at its actual
  rendering resolution, not a scaled-up preview.** A 256px preview of a
  16px icon looks fine; the real 16×16 frame can be materially less
  legible. Render and inspect the true-size frame specifically.
- **Compositing a cropped glyph from a high-contrast source (white-on-
  black) onto a near-matching-but-not-identical background color needs an
  explicit alpha key**, not just a tight crop — otherwise the crop's own
  background shows as a visible box against a similar-but-different
  target background.
- **A front-page claim about current product behavior should be checked
  against a real artifact (a check-run, a benchmark, a log), not judged by
  whether it "sounds right."** Both overclaims caught this session
  (defects 1-2) were plausible-sounding marketing-copy drafts; both failed
  the same simple test — "what specific artifact proves this is true
  right now?" — and neither had one.

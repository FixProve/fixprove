# KS-REPORT-4.12D — Addendum 2: signature reconciliation + record correction

Second addendum to `KS-REPORT-4.12D-fixprove-dev-reality-sync.md`. This one
exists solely to correct a record-consistency defect Yehor caught in his
own double-check of the session's close-out — not to add new build or
verification work. Nothing in the parent report or the first addendum is
edited by this file; both remain untouched, per the append-only
convention.

## What was found

Both `KS-REPORT-4.12D-fixprove-dev-reality-sync.md` and
`KS-REPORT-4.12D-addendum-live-verification.md` were confirmed, by direct
on-disk read, to now carry a real signature:

- `KS-REPORT-4.12D-fixprove-dev-reality-sync.md:210` —
  `Signature: **Yehor Kaliberda 23.07.26**`
- `KS-REPORT-4.12D-addendum-live-verification.md:79` —
  `## Signed: Yehor Kaliberda 23.07.26`

`git diff` against each file's last commit confirms exactly one line
changed in each — the signature line/heading itself, nothing else —
so nothing beyond the Accountability field was touched.

Both files were already committed and pushed (`a581ff3`, `d06ec80`)
*before* these signature edits were made, with their Accountability
Statements recorded as `PENDING`. This is the same underlying pattern
Session 4.12-C's close caught once already: a signed value being added,
after the fact, to a report whose pushed text still says `PENDING`. Two
consequences followed directly from that gap this time:

1. This session's own closing chat message and `MEMORY/state.md` both
   described the signature as "still pending" — stale relative to the
   actual, already-signed disk state at the time those were written.
2. The live-verification addendum's own closing sentence — "`§5 ...` is
   still recorded as PENDING in that file" — is now sitting inside a
   signed, attested document, describing a state (`PENDING`) that is no
   longer true of the file it's describing. That sentence was accurate
   when written; it is not accurate now.

## Why this is a new addendum, not an edit

Both signed files are attested reports as of 2026-07-23. Per this
project's standing convention (set explicitly in Session 4.12-C, for the
identical scenario — an already-pushed report gaining a signature after
the fact) and confirmed again by Yehor this session: a signed KS-REPORT
is not edited after the fact, for any reason, including to fix a
sentence that's since become inaccurate. The correction is recorded here,
as a new file, instead.

**One deliberate departure from the 4.12-C precedent, flagged
explicitly:** 4.12-C's resolution for this same underlying situation was
to *revert* the in-place signature edit on the already-pushed file and
record the actual signature fact via a dated addendum — "revert +
addendum, never an in-place amendment, regardless of who made the edit or
how small it is." This session, Yehor gave the opposite explicit
instruction for these two files: leave the signed text exactly as it is
on disk, edit neither file, and correct only via this addendum. The
practical difference: neither signed file's working-tree edit is being
committed by this session at all (they remain as local, uncommitted
edits on the FixProve mount, exactly as Yehor made them) — so no new
commit alters the previously-published (`a581ff3`/`d06ec80`) text either
way. This addendum is the only thing entering git history to record the
correction. Future sessions should treat *this* entry, not the 4.12-C
line, as the applicable precedent for "Yehor hand-signs an already-
pushed report" specifically — the 4.12-C precedent still applies as the
default when a signature (or any other content) is added by anyone other
than Yehor himself, or when Yehor has not given a specific contrary
instruction for that instance.

## Corrected record

- Both `KS-REPORT-4.12D-fixprove-dev-reality-sync.md` and
  `KS-REPORT-4.12D-addendum-live-verification.md` were signed by Yehor,
  2026-07-23, confirmed by direct on-disk `grep`/`git diff` this pass.
  `MEMORY/state.md`'s prior "signature still PENDING" line is
  **superseded** by this entry.
- The live-verification addendum's statement that the parent's §5 "is
  still recorded as PENDING" was correct at the moment it was written
  (the parent genuinely was PENDING then) and is superseded, not false
  at authorship — corrected here rather than in place.
- Final technical state, unchanged from the live-verification addendum
  and re-confirmed this pass: `HEAD` = `origin/main` = `d06ec80`
  (identical SHA, confirmed via `git rev-parse` on both refs). CA-5 for
  `d06ec80`: run `30012223420`, `build` = `success`, `test-python` =
  `success` (confirmed by Yehor via `gh run view`, both jobs green).
  Cloudflare deploy Version ID `02db1fa6-b21e-44fc-bd92-8c3da48f6975`,
  live and verified. All four of the starting prompt's falsifiable
  done-checks passed against production (see the live-verification
  addendum for the evidence; the favicon caveat there — artifact
  confirmed loadable via a valid multi-frame ICO, OS-level browser tab
  strip not itself screenshotted — stands exactly as originally written,
  not upgraded to a clean pass).
- **New durable fact confirmed this pass:** `ci.yml` has no path filter —
  a docs-only commit (`d06ec80`, this session's own addendum-only change)
  still triggered a full `build`+`test-python` run. A missing CI run on
  a docs-only commit to this repo should be treated as a real anomaly to
  investigate, not assumed to be an expected/legitimate skip.

## Accountability

This addendum records a record-consistency correction, not new
engineering or verification work — Stage 3 (adversarial verify) for this
addendum consists of the `git diff`/`grep` checks quoted above, run
directly against the files on disk before writing this.

Signature: **PENDING — Yehor.**

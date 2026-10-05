# KS-REPORT 4.32 — Addendum 1 (2026-10-05, after the records commit `78d5d2b`)

Appended, not rewritten (append-only convention). Covers work done after
`KS-REPORT-4.32-post-pitch-pipeline-maintenance-pass-0.1.17-release.md` was
committed.

## 1. Windows fresh-install proof — closes the "Linux only" limitation (§4)

Run by Yehor on his own Windows machine, output pasted into the session:

| Step | Result |
|---|---|
| New venv, `pip install --no-cache-dir fixprove==0.1.17` | OK — Python 3.14; wheels `tree_sitter-0.26.0-cp314-cp314-win_amd64`, `tree_sitter_python-0.25.0-cp310-abi3-win_amd64`, `tree_sitter_typescript-0.23.2-cp39-abi3-win_amd64` (no source builds) |
| `fixprove --version` | `0.1.17` |
| Empty folder | `error: no Python or TS/JS source files found under fp-empty -- nothing was checked.` → `exit code: 2` |
| Planted sample (`requests==2.34.2`) | `fp-sample\fetch_status.py:11: unresolved-symbol: requests.get_json` → `exit code: 1` |

Windows end-to-end (install, version, nothing-checked → 2, detection → 1)
is proven on Python 3.14. D10 reproduces identically on Windows (stdout
still prints "No unresolved symbols found." above the error) — still
scheduled for 0.1.18, still not patched in place (no patch-and-retag).

## 2. Pilot pipeline — outreach (detail kept local-only)

Names and stages live in the gitignored `PILOT-PIPELINE-2026-10-05.md`
(public repo; a prospect list is not public material). Count only:
four introduction/connection requests sent by Yehor on 2026-10-05
(Yehor-reported; one independently confirmed in LinkedIn's sent-invitations
view, read in Yehor's own browser). Follow-ups are dated, one each, none
before 2026-10-12. No messages were sent by Claude.

Process note: before one send, a prior uncoordinated contact at the same
company (2026-08-21, still pending) was found in the project's own records
and the approach was rerouted to the role that owns the problem, rather than
opening a second cold thread. A quoted job-ad sentence was verified on the
company's own careers page before use.

## 3. Mailbox triage (admin, no product impact)

At Yehor's request: inbox reduced from 316 to 15 threads using 10 labels;
archive = label removal only; nothing deleted, sent, or marked as spam.
Items needing Yehor were left in the inbox. 5 threads were left untouched
after the auto-mode safety classifier refused a label change — not worked
around.

## 4. Verified at addendum time (fresh reads)

- `git ls-remote origin main` = `78d5d2b16f755aa27d2ba46124bc594c8fc36a7c`;
  CI on `78d5d2b`: `build success`, `test-python success`.
- No `.git/*.lock`; no tracked changes beyond CRLF noise.
- PyPI `0.1.17`; npm `latest: 0.1.17`.

## 5. Accountability

Signed (Yehor): ____________________  Date: __________

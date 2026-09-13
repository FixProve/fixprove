NEXT SESSION — 4.30 — "0.1.15 is live and verified; decide when the
orphaned-.py fix ships, then design the literary-diary idea before
building it"

Written 2026-09-13, Session 4.29 close (point 9 below corrected same
day, before any session opened this file — see its own note). Session
4.29 confirmed the prior bad-tag incident fully closed, ran a genuine
3-repo customer self-test (finding one real crash and one real
false-positive limitation), fixed and shipped `--version` as release
0.1.15 (independently verified from raw registry evidence, not a green
checkmark), then fixed the crash and disclosed the false-positive
limitation in a separate commit (`a9bba99`, confirmed live on
`origin/main` via a direct GitHub fetch). Every number below was
correct as of 2026-09-13 — recompute the live clocks fresh at session
open rather than trusting this file, same standing rule as every prior
starting prompt in this project.

SESSION START (Keystone Stage 1 — Intake):

1. **Availability line:** state which tools/folders/files are reachable,
   explicitly including whether `device_bash` is back — it has now been
   down for **four consecutive sessions** (Sept 8 Windows-update mount
   issue). If it's back, this changes how much of this session can be
   verified directly versus through Yehor relaying terminal output.

2. **Read `MEMORY/state.md` in full and answer its reload questions**
   before anything else. Pay particular attention to the corrected
   record in this session's close: `a9bba99` is a real, pushed commit
   (do not re-litigate this — it was independently confirmed against
   GitHub's raw file content directly, not just local git state).

3. **Decide when the orphaned-.py fix + vitest disclosure ship.**
   `a9bba99` is on `main` but has not been tagged into any release.
   Per this project's own established heuristic ("never retry an
   existing version number, always bump to a fresh one" — earned from
   the 0.1.13/0.1.14 npm/PyPI mismatch, Session 4.28), the next tag
   should be `v0.1.16`, never a re-tag of `v0.1.15`. Ask Yehor whether
   to cut it now or bundle it with other pending work.

4. **If cutting 0.1.16:** same discipline as every prior release in this
   project — bump `cli/package.json` and `engine/python/pyproject.toml`
   together, commit, push, tag, watch both `publish-npm` and
   `publish-pypi` succeed from their **raw job logs** (not the green
   check), then do a fresh `pip install`/`npm install` and confirm
   `fixprove --version` and a real `fixprove check` both work. This
   session's own close verified 0.1.15 to this exact standard — repeat
   it, don't shortcut it because it worked last time.

5. **The 16 pre-existing TS-corpus test failures are environment-only**
   (Windows Developer Mode / symlink privilege, confirmed via a direct
   `device_list_dir` read of `ts_corpus/node_modules/fp-ts-clean-demo`
   showing a dangling symlink). Don't re-diagnose these from scratch if
   they reappear in a future `pytest tests\ -q` run on this machine —
   check `git stash` isolation first, the same way this session did,
   before assuming a regression.

6. **Design (don't build yet) the literary-diary idea Yehor raised late
   in Session 4.29:** an automatically-updating, engagingly-written
   public "diary" of each session's findings, for the FixProve site.
   Before writing anything, settle: (a) does it live on fixprove.dev
   publicly, or somewhere private — note that this project's own
   `NEXT-SESSION-*-STARTING-PROMPT.md` files and `session-logs/` are
   *already* tracked, public git history (confirmed via `.gitignore`'s
   own comments this session), so a rougher version of this idea already
   exists unrecognized; (b) what counts as an entry worth publishing —
   every session, or only ones with a real finding/fix/ship; (c) what
   mechanism actually writes it — a script pulling from git log/CI
   results and handing them to an LLM to narrate, versus a person (this
   session) drafting and Yehor approving before it goes live. An
   unsupervised LLM narrating its own session is exactly the kind of
   unverified claim this project's whole discipline exists to prevent —
   don't build the automatic version before the manual, reviewed version
   has proven the format is worth automating. A first sample entry
   (Session 4.29 itself, in the literary register Yehor asked for) was
   offered but not yet written — offer to draft it as the first concrete
   step, if Yehor wants to see the shape of it before deciding anything
   else.

7. **Untouched Session 4.29 carry-forward items — still open, none
   reached this session:**
   - Sign `KS-REPORT-4.27-mail-triage-git-state-correction-demo-
     production-deploy.md` §5, if Yehor is ready (record as a dated
     addendum, never by editing the report's own text).
   - IVSR case K145X8 — ask whether Yehor wants a follow-up sent (the
     sent reply's body still asks for an extension to sign a waiver its
     own attachment shows was already signed).
   - Copenhagen H → Aarhus travel-time check, night of Sept 16/17, after
     ~20:00 — genuinely unresolved across three sessions now.
   - NemKonto/Nordea application status.
   - Grant-confirmation / GTM-thread checks.

8. **Methodology reminder, earned this session (not invented, not from
   a single event — this is the third time this exact class of error
   has been caught this way, see KS-REPORT-4.29 §6):** when a pasted
   diff or terminal summary looks wrong, the fix is always the same —
   read the actual file bytes directly (via `device_stage_files` or
   equivalent), never trust the terminal's reflowed rendering or a
   plausible-sounding narrative, in *either* direction: don't just
   catch false claims of success, also don't let a misread failure
   trigger an unfounded accusation of fabrication without checking
   first (this session did both, correctly, in the same close).

9. **Commit-message hygiene — corrected same day, before this file was
   read by any session (the original text at close, `Set-Content
   -Encoding utf8NoBOM`, was untested and turned out to be wrong):**
   `utf8NoBOM` is NOT a valid `-Encoding` value on Yehor's actual
   machine — confirmed directly, same session: this is Windows
   PowerShell 5.1, and `utf8NoBOM` was only added as a valid value in
   PowerShell 6+/Core. The cmdlet's own error names the full valid set
   on this machine: `Unknown, String, Unicode, Byte, BigEndianUnicode,
   UTF8, UTF7, UTF32, Ascii, Default, Oem, BigEndianUTF32` — no
   `utf8NoBOM`. Use this instead, which works on any PowerShell version
   and reliably avoids the BOM (this is what actually produced the
   clean, uncorrupted commit `fe2939c` this session):

   ```powershell
   $msg = @"
   <commit message text here>
   "@
   [System.IO.File]::WriteAllText("$PWD\<file>.txt", $msg, (New-Object System.Text.UTF8Encoding $false))
   ```

   Plain `-Encoding ascii` also avoids the BOM and is simpler, but only
   safe if the message is pure ASCII (no Cyrillic, no smart quotes/
   em-dashes, etc.) — the `.NET` method above is the general-case fix
   and should be the default going forward. Plain `-Encoding utf8`
   remains the one to actively avoid: it embeds an invisible BOM
   permanently into the commit message (landed, cosmetically, in
   `a9bba99`; not worth rewriting that pushed commit to fix).

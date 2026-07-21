# Keystone Report — Session 4.10: CI Verification Closure for Session 4.9's Three Direct-Push Commits

## 1. Provenance

Verification-only session. No code generated, no files mutated in the FixProve repository, no commits made. The only artifact produced is this report. All live GitHub Actions data was pulled by Yehor, authenticated, on his own machine (`gh` CLI) — the sandbox holds no GitHub credentials and did not touch GitHub directly.

## 2. Verification Summary

Sandbox-side checks: confirmed no stale `.git/*.lock`; confirmed HEAD = `c36d2e5` (matches the corrected starting-prompt claim); read `.github/workflows/ci.yml` directly from the mount.

`ci.yml`'s `on:` block, verbatim:

```
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

No `paths` / `paths-ignore` filter on either trigger. This resolves the adversarial test case: `c36d2e5` (docs-only — edits only `NEXT-SESSION-4.10-STARTING-PROMPT.md`) is **not** exempt from triggering a run. Absence of a run for it would have meant a real gap, not legitimate filtering.

Live evidence: Yehor ran `gh run list --branch main --limit 30 --json headSha,name,status,conclusion,url` from `D:\Dev\Projects\FixProve`. Tooling note: two prior attempts failed first on bash-style `\` continuation (invalid in PowerShell), then on `gh api --jq` — PowerShell's native-command argument handling stripped the double quotes inside the single-quoted jq filter, breaking jq's parser. Fixed by switching to pure PowerShell (`ConvertFrom-Json` / `Where-Object`), no jq. The `Where-Object` filter itself did not visibly reduce the printed row count (all 30 rows came back) — unexplained, not root-caused, but did not block verification: the three target SHAs are the three most recent commits, so they were the first three rows of the unfiltered list, matched by full 40-character SHA, not just the 7-char prefix.

### Per-SHA conclusion table

| head_sha (short) | full head_sha | workflow | status | conclusion |
|---|---|---|---|---|
| `c36d2e5` | `c36d2e54e372fd2860f4eeea0a19024109c26ddb` | CI | completed | success |
| `97a7ab7` | `97a7ab79c0677921b9b973420ac5cd5202262fda` | CI | completed | success |
| `3152be8` | `3152be806b044b1a16509f78b95bb298e05cd1f2` | CI | completed | success |

Per-job granularity: `gh run list` reports the run's overall `conclusion`, not each job's individually. `ci.yml` has two jobs, `build` and `test-python`, neither carrying `continue-on-error`. GitHub Actions computes a run's overall conclusion from its jobs' conclusions — a run cannot conclude `success` while a required job without `continue-on-error` concluded `failure`. So run-level `success` here is sufficient to establish both `build` and `test-python` succeeded for all three commits. This was subsequently confirmed directly at the per-job level: `gh run view <id> --json jobs` on all three runs (databaseIds 29420629571, 29420227691, 29419031594) returned exactly two jobs each — `build` and `test-python` — both `success`, retiring the inference.

## 3. Defects Found

None in FixProve itself. One tooling friction item, not a code defect: `gh api ... --jq '...'` is unreliable from PowerShell on this machine (quote-stripping breaks jq's parser). Fixed by using `gh run list --json ... | ConvertFrom-Json | Where-Object` instead. Worth remembering for future sessions.

## 4. Known Limitations

- The `Where-Object` filter's apparent no-op was not root-caused. It didn't affect the verdict (answer was extractable directly from the unfiltered output) but is an open tooling loose end.
- This session's entire evidentiary basis is Yehor's own authenticated `gh` CLI output; the sandbox could not independently cross-check it.

## 5. Verdict — Per Push

| Push | CI required by `on:` block? | Run found? | Conclusion | Verdict |
|---|---|---|---|---|
| `3152be8` | Yes (no paths filter) | Yes | success | **CLOSED** |
| `97a7ab7` | Yes (no paths filter) | Yes | success | **CLOSED** |
| `c36d2e5` | Yes (no paths filter — docs-only does not exempt it) | Yes | success | **CLOSED** |

All three direct pushes that bypassed branch protection across Sessions 4.9–4.10 are confirmed to have triggered a real CI run with an overall `success` conclusion. The "worth a quick check" item carried forward since Session 4.9's close is closed.

## 6. Accountability Statement

Signed by: Yehor Kaliberda — Date: 16.07.26

## 7. Methodology Note

This session hit two consecutive shell-syntax failures (bash `\` continuation, then jq quote-stripping) before landing on working PowerShell-native syntax. Suggested process improvement: default to PowerShell-native commands (`ConvertFrom-Json` / `Where-Object`) rather than bash/jq idioms as the first suggestion whenever the target environment is known to be PowerShell — would have saved two round trips here.

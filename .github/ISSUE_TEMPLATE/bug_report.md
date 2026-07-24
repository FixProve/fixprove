---
name: Bug report
about: Report something in FixProve that isn't working as expected
title: "[Bug]: "
labels: bug
assignees: ''
# KS-TRACE: 4.12E-ISSUE-BUG | assumption: a stranger opening a new issue sees this in the template chooser | test: live, logged-out check of github.com/FixProve/fixprove/issues/new/choose
---

**Describe the bug**
A clear, concise description of what's broken.

**To reproduce**
Steps to reproduce the behavior, ideally including the exact command:

```bash
fixprove check /path/to/project
```

**Expected behavior**
What you expected `fixprove` to report instead.

**Actual output**
Paste the actual CLI output (or CI log, if this happened via the GitHub App).

**Environment**
- FixProve version (`fixprove --version`):
- Installed via: `pip` / `npm` / both
- OS:
- Python version:
- Node version (if applicable):

**Additional context**
Anything else relevant — a minimal repro repo, a specific dependency version,
whether this only happens in CI vs. locally, etc.

**Security-sensitive?**
If this bug could leak source code, webhook secrets, or billing data, please
do **not** file it here — see [SECURITY.md](../../SECURITY.md) instead.

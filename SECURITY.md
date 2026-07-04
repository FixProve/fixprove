# Security Policy

## Reporting a vulnerability

Please report suspected security vulnerabilities privately by emailing
**egorka30001@gmail.com** with subject line `FixProve Security Report`.
Do not open a public GitHub issue for security reports.

Include:
- A description of the vulnerability and its potential impact.
- Steps to reproduce (proof-of-concept code, if available).
- The affected package (`/cli`, `/app`, or `/web`) and version.

We will acknowledge receipt within **5 business days** and aim to provide a
remediation timeline within **14 business days** of confirming the issue.

## Scope

- `/cli` — the open-core resolver CLI. Source never needs to leave a
  customer's machine to run a scan; a vulnerability that exfiltrates source
  or dependency data without consent is in scope and high priority.
- `/app` — the GitHub App. Source code from customer repositories must never
  leave the CI runner — only resolution findings/metadata are transmitted.
  Any vulnerability that could leak source code, webhook secrets, or
  billing/entitlement data is critical severity.
- `/web` — the marketing site. Standard web vulnerabilities (XSS on the
  waitlist form, etc.) are in scope.

## Supported versions

Pre-1.0: only the latest published version of each package is supported.
A formal support-window policy will be published at Milestone 3 (first
paying customer).

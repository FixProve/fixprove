# FixProve — Milestone 0 Summary (Plain Language)

**Date:** July 1, 2026

## What this milestone was

Get FixProve's name locked down everywhere it matters, put the legal and
business paperwork in motion, and put up a real website where people can
sign up to hear about the product when it launches.

## What's done and live

- **The name "FixProve" is secured** on GitHub, npm, PyPI, and crates.io (the
  places developers would look for this kind of tool), plus the domains
  fixprove.com and fixprove.dev.
- **Trademark paperwork is drafted** and ready for Yehor to file with the
  USPTO (not yet filed — that's his action to take).
- **A Stripe billing setup checklist exists**, ready for when the product is
  ready to charge money.
- **The website is live at fixprove.dev.** It explains what FixProve does in
  one sentence, shows the problem it solves with a real example, and lets
  visitors join an email waitlist.
- **The waitlist actually works.** We tested it thoroughly — real signups go
  through, and bad input (broken email addresses, attempts to inject
  malicious code, wrong requests) all get rejected safely instead of crashing
  or breaking anything.
- **The underlying code has automated tests protecting it** — 10 tests
  covering the normal cases and the "someone tries to break this" cases, all
  passing.

## What isn't done yet

- The USPTO trademark application itself hasn't been filed — only the text
  is ready.
- Nobody has reviewed the website's wording yet (Yehor hasn't given it a
  final read).
- No real customers have signed up yet — the waitlist is live but empty of
  real interest, only test entries.
- The actual product (the tool that checks AI-generated code) doesn't exist
  yet. This milestone was about the foundation — name, legal groundwork, and
  a place to collect early interest — not the product itself.

## Bottom line

The foundation is in place and working, not just planned. The next stage of
work (building the actual code-checking tool) hasn't started.

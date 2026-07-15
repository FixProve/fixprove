# FixProve — What Changed (Session 4.9, 2026-07-15)

**In plain terms:** two things happened this session — one decision, one
upgrade.

**The decision:** FixProve currently checks code on pull requests only,
not on direct pushes to a branch. Making it also check direct pushes
turned out to require giving the underlying GitHub App permission to
read repository file contents — something it was deliberately built
*without*, specifically so it can never be a source of a code leak. We
looked at this live on GitHub's own settings page before touching any
code, confirmed that permission really is the blocker (not a bug, a
deliberate boundary), and decided to keep FixProve's access as narrow as
possible rather than trade that away for push-event coverage. Pull
request checking already covers the workflow FixProve is built around, so
nothing about the product's actual value changed.

**The upgrade:** the tool FixProve uses to deploy its backend to
Cloudflare (`wrangler`) has a newer major version. We upgraded both
backend components to it, found and fixed one real compatibility issue
along the way (a mismatched type-definitions package), and confirmed
everything still builds, type-checks, and passes its full test suite
under the new version — including a dry run of the actual deployment
config, which came back clean.

**What's still pending:** the dry run proves the configuration is
correct. It doesn't prove the real deployment — with real login
credentials, from a real machine — still works under the new version.
That step has to happen on Yehor's own computer, not in this session's
sandbox, and hasn't happened yet.

**Bottom line:** one open question closed with a clear, documented
reason; one upgrade code-complete and machine-verified as far as
possible from here, with one real-world confirmation step still owed
before it's called done.

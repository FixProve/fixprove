# FixProve — What Changed (Session 4.8, 2026-07-14)

**In plain terms:** FixProve publishes its software to two public
package registries — PyPI (for Python users) and npm (for
JavaScript/TypeScript users). Until today, the npm side used a
long-lived password-like credential (a "token") to authenticate each
publish. npm itself has announced it's phasing that method out over the
next several months. This session replaced it with a more modern,
short-lived authentication method (the same approach already used for
the Python side since earlier this year), so FixProve isn't caught
off-guard when npm's deadline arrives.

**What we actually did:**

- Switched the npm publishing process to prove its identity through
  GitHub directly, rather than a stored password.
- Tested this for real — pushed a real release (`v0.1.9`) and confirmed,
  by checking npm's own records directly, that the new method worked.
- Found one confusing warning message during that test that looked like
  it might have broken the installable command-line tool. Investigated
  it properly by actually installing the package and running it — it
  was a false alarm, nothing was broken.
- Cleaned up the old credential reference from the publishing
  configuration, but deliberately left the actual old credential active
  and unused as a safety net, rather than deleting it immediately. It
  will be formally retired once the cleaned-up configuration has proven
  itself on a future release.

**Bottom line:** the npm publishing process is safer and more current,
already tested successfully once, with one deliberate item still pending
final confirmation (not urgent, will resolve itself on the next release).
Full technical detail is in `KS-REPORT-4.8-npm-oidc-migration.md` for
anyone who wants it.

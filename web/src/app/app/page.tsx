// #KS-TRACE: S4.13-PYPI-APP-404-FIX | requirement: PyPI's own project sidebar
// links "GitHub App (CI)" to https://fixprove.dev/app (see
// engine/python/pyproject.toml [project.urls]), which returned HTTP 404 --
// verified live 2026-08-11, Session 4.13 (F24 in the presence-audit Fact
// Base). Four independent research models flagged this as the single
// highest-impact-per-hour fix in the entire study. | assumption: a real
// static page beats a bare redirect -- a PyPI visitor who clicks through
// wants to know what the App is and why they can't install it yet, not just
// land silently back on "/". Content mirrors the homepage's own GitHub App
// language (page.tsx's "cta-note muted" paragraph) verbatim in substance so
// the two surfaces cannot drift out of sync. | test: manual verification
// against the deployed URL post-deploy (this route did not exist before this
// session, so no fresh-fetch precedent to compare against); confirm the
// PyPI sidebar link resolves to real content, not a 404, once live.

export const metadata = {
  title: "GitHub App — FixProve",
  description:
    "FixProve's GitHub App runs the same deterministic check as a blocking status on pull requests. Not yet open for third-party installation.",
};

export default function AppPage() {
  return (
    <main>
      <div className="eyebrow">FixProve</div>
      <h1>The GitHub App</h1>
      <p className="subhead">
        The GitHub App runs the same deterministic check as a blocking status
        on pull requests — currently limited to internal use, not yet open
        for third-party installation, with no paid tier yet.
      </p>

      <section>
        <h2>How it works</h2>
        <p>
          Analysis runs inside <em>your</em> CI, not on our servers. Only
          finding fragments — file paths, line numbers, the unresolved
          expression — transit our endpoint, encrypted and never persisted,
          to post the check annotation on your pull request. See the{" "}
          <a href="/privacy">Privacy Policy</a> for the full description.
        </p>
        <p>
          The identical deterministic core is available today as the
          open-core CLI — <code>pip install fixprove</code> or{" "}
          <code>npm install -g fixprove</code> — for local or self-hosted CI
          use ahead of the App&apos;s wider release.
        </p>
      </section>

      <section className="updates">
        <h2>Stay in the loop</h2>
        <p>
          Want to know when the App opens for third-party installation?{" "}
          <a href="/">Join the waitlist on the homepage</a> — no spam, just
          launch news.
        </p>
      </section>

      <footer>
        <p className="footer-trader">
          FixProve v/ Yehor Kaliberda &middot; CVR 46646223 &middot; Aarhus,
          Denmark &middot;{" "}
          <a href="mailto:yehor@yehor.ai">yehor@yehor.ai</a>
        </p>
        <p className="footer-links">
          <a href="https://github.com/FixProve/fixprove">GitHub</a>
          {" &middot; "}
          <a href="https://www.npmjs.com/package/fixprove">npm</a>
          {" &middot; "}
          <a href="https://pypi.org/project/fixprove/">PyPI</a>
          {" &middot; "}
          <a href="/privacy">Privacy Policy</a>
          {" &middot; "}
          <a href="/terms">Terms of Service</a>
        </p>
      </footer>
    </main>
  );
}

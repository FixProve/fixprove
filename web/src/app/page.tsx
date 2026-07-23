"use client";

// #KS-TRACE: SESSION-4.12-D | requirement: "replace the waitlist/coming-soon
// hero and CTA with the live install commands, mirroring the README's
// Install section" | assumption: the CLI has been live on npm/PyPI since
// v0.1.1, so "coming soon" framing is now false and actively costs
// cold-visitor conversion (see COVER-FIX-STRATEGY.md) | test: manual
// verification against the deployed URL post-deploy; anonymous-fetch
// done-checks in NEXT-SESSION-4.12-D-STARTING-PROMPT.md.
//
// Compliance notes (Yehor, 2026-07-23, this session):
// - Dropped an unverified "ninety milliseconds" performance claim that had
//   no benchmark anywhere in the repo (same overclaim class the Keystone
//   constitution forbids).
// - The GitHub App line was verified against a live check-runs API call for
//   commit 724e71c: only `build`/`test-python` (github-actions) appear, no
//   FixProve App check-run, and every push to date has been direct-to-main
//   with zero PRs, so a PR-triggered App check has never had the
//   opportunity to fire. The line below states only what's independently
//   verifiable, not what would be convenient to imply.
// - The waitlist form is kept (per Yehor: it's a tracked external-signal
//   channel on PROGRESS.md, currently at zero) but demoted below the fold
//   with honest framing — it now advertises "updates," not "early access
//   to a CLI that already shipped."

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { ok: boolean; message?: string; error?: string } =
        await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're on the list.");
        setEmail("");
      } else {
        // Adversarial case lands here: malformed email -> graceful inline
        // error, not a crash or unhandled rejection.
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again in a moment.");
    }
  }

  return (
    <main>
      <div className="eyebrow">FixProve</div>
      <h1>Prove your code. Don&apos;t hope it.</h1>
      <p className="subhead">
        FixProve checks every import, every call, every attribute your AI
        wrote — against what&apos;s actually installed. Deterministically. No
        model in the loop.
      </p>

      <div className="example install">
        <div>$ pip install fixprove</div>
        <div>$ npm install -g fixprove</div>
        <div>$ fixprove check /path/to/your/project</div>
      </div>
      <p className="cta-note">
        One command. Read the source. See exactly what it checks. The npm
        package wraps the Python resolver engine — install both, or{" "}
        <code>pip install fixprove</code> alone if you don&apos;t need the
        npm entrypoint.
      </p>
      <p className="cta-note muted">
        The GitHub App runs the same check as a blocking status on pull
        requests. Not yet open for third-party installation.
      </p>

      <section>
        <h2>The problem</h2>
        <p>
          AI coding assistants write code fast, and they write it fluently —
          which is exactly why hallucinated imports, renamed methods, and
          non-existent API calls slip past review. They look correct. They
          are not.
        </p>
        <div className="example">
          <div>--- a/report.py</div>
          <div>+++ b/report.py</div>
          <div className="fail">
            + df = pd.read_exel(&quot;data.xlsx&quot;){"  "}# pandas has no
            read_exel
          </div>
          <div className="fail">
            + from fastapi_helpers import cache{"  "}# not installed
          </div>
        </div>
        <p>
          FixProve catches this class of bug deterministically — no
          probabilistic model, no false-positive guesswork — by resolving
          every reference in a diff against your actual installed
          dependencies.
        </p>
      </section>

      <section className="updates">
        <h2>Stay in the loop</h2>
        <p>
          Want updates on the GitHub App&apos;s wider release and what ships
          next? Leave your email — no spam, just launch news.
        </p>
        <form className="waitlist compact" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            aria-label="Email address"
          />
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Joining…" : "Notify me"}
          </button>
        </form>
        {message && (
          <p
            className={`form-message ${
              status === "success" ? "success" : "error"
            }`}
            role="status"
          >
            {message}
          </p>
        )}
      </section>

      <footer>FixProve &middot; fixprove.dev</footer>
    </main>
  );
}

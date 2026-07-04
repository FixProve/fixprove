"use client";

// #KS-TRACE: SESSION-0.3 | requirement: "Page live with the one-sentence value
// prop, the problem, and a working email waitlist" | assumption: a single-page,
// no-router landing page is sufficient for a Milestone 0 capture surface (no
// pricing, docs, or nav yet - those come with the real product in later
// milestones) | test: manual verification against the deployed URL post-deploy
// (see Keystone Report §2), plus the client-side mirror of the adversarial
// malformed-email case (server-side is the source of truth; see
// functions/api/_validate.ts + validate.test.ts).

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
      <h1>Prove your AI-generated code before it merges.</h1>
      <p className="subhead">
        Deterministic verification that every import, symbol, method, and API
        call in an AI-generated diff actually resolves against what&apos;s
        installed in your project — in CI, with zero LLM tokens.
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

      <section>
        <h2>Get early access</h2>
        <p>
          FixProve is in active development. Join the waitlist and we&apos;ll
          reach out when the CLI and GitHub App are ready.
        </p>
        <form className="waitlist" onSubmit={handleSubmit} noValidate>
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
            {status === "submitting" ? "Joining…" : "Join the waitlist"}
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

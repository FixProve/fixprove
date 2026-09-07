// #KS-TRACE: SESSION-4.26-DEMO-DRAFT | requirement: "a demo section on
// fixprove.dev showing FixProve actually catching AI-generated
// hallucinations, not just claiming to" | assumption: the two examples
// below are real, independently re-verified (not invented for marketing) —
// see the 2026-09-07 meetup demo kit's proof/ folder (3x-run determinism,
// raw --json output) for the underlying evidence. Placement decision
// (Yehor, 2026-09-07): "what it doesn't catch yet" caveats link out to
// GitHub rather than appearing inline on this page, matching the existing
// Candour Decision Rule (candor is an asset on GitHub, a liability on the
// top fold of the product site). NOT YET DEPLOYED — draft only, on branch
// draft/demo-section-4-26, uncommitted-or-unpushed pending Yehor's
// separate explicit go to publish. | test: manual visual check against
// the homepage's existing style classes (example/fail/cta-note/muted) for
// consistency; no new CSS added.

export const metadata = {
  title: "Live demo — FixProve",
  description:
    "Two real, reproducible examples of FixProve catching AI-generated hallucinations that compile fine and still don't work.",
};

export default function DemoPage() {
  return (
    <main>
      <div className="eyebrow">FixProve</div>
      <h1>See it catch a real hallucination</h1>
      <p className="subhead">
        Both examples below are real: a plausible-sounding, AI-style method
        call that doesn&apos;t exist, run through the actual published CLI.
        Not staged copy — the same commands work on your own machine.
      </p>

      <section>
        <h2>Python</h2>
        <p>
          A small script calls <code>requests.get_json(url)</code> — it
          reads like a natural shortcut for{" "}
          <code>requests.get(url).json()</code>, but{" "}
          <code>requests</code> has no such function.
        </p>
        <div className="example">
          <div>$ fixprove fetch_status.py --requirements requirements.txt</div>
          <div className="fail">
            fetch_status.py:11: unresolved-symbol: requests.get_json
          </div>
          <div>1 unresolved symbol(s) found. (exit code 1)</div>
        </div>
      </section>

      <section>
        <h2>TypeScript</h2>
        <p>
          Same idea, different ecosystem: a script calls{" "}
          <code>axios.getJson(url)</code>, blending the real{" "}
          <code>axios.get(url)</code> with the shape of its response.
        </p>
        <div className="example">
          <div>$ fixprove check script.ts --package-json package.json</div>
          <div className="fail">
            script.ts:9: unresolved-symbol: axios.getJson
          </div>
          <div>1 unresolved symbol(s) found. (exit code 1)</div>
        </div>
      </section>

      <section>
        <h2>Try it yourself</h2>
        <div className="example install">
          <div>$ pip install fixprove</div>
          <div>$ npm install -g fixprove</div>
          <div>$ fixprove check /path/to/your/project</div>
        </div>
        <p className="cta-note">
          Full source for both examples above, plus a written record of what
          this version does and doesn&apos;t catch yet, is on{" "}
          <a href="https://github.com/FixProve/fixprove">GitHub</a>.
        </p>
      </section>

      <footer>
        <p className="footer-trader">
          FixProve v/ Yehor Kaliberda &middot; CVR 46646223 &middot; Aarhus,
          Denmark &middot;{" "}
          <a href="mailto:yehor@yehor.ai">yehor@yehor.ai</a>
        </p>
        <p className="footer-links">
          <a href="/">Home</a>
          {" · "}
          <a href="https://github.com/FixProve/fixprove">GitHub</a>
          {" · "}
          <a href="https://www.npmjs.com/package/fixprove">npm</a>
          {" · "}
          <a href="https://pypi.org/project/fixprove/">PyPI</a>
          {" · "}
          <a href="/privacy">Privacy Policy</a>
          {" · "}
          <a href="/terms">Terms of Service</a>
        </p>
      </footer>
    </main>
  );
}

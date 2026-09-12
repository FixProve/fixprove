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
//
// KS-TRACE: PRIORITY-TRACKER-2026-09-11-NARRATED-DEMO-VIDEO | requirement:
// a narrated walkthrough as a lead-in above the two live examples, per
// Yehor's 2026-09-11 decision (guide chat) to drop the earlier live-voice-
// agent concept in favor of a pre-rendered video -- this removes the
// privacy-policy collision that a live conversational agent would have
// created entirely, not just reduced it (no visitor audio or data reaches
// any third-party API; the video is a static asset served from this same
// origin, same legal category as any other hosted video-with-voiceover).
// PRIVACY-POLICY-DRAFT-v2.md's "no third-party script" claim stays true
// with this approach -- re-confirmed directly against that file's current
// text before writing this, not assumed. The interactive Q&A agent
// concept remains separately filed and deferred in
// VOICE-AGENT-DEMO-PAGE-backlog.md; this video is unrelated to that
// backlog item and carries none of its legal gate.
// STATUS: markup only, NOT YET FUNCTIONAL -- references
// /public/demo-narration.mp4, which does not exist in this repo yet.
// Yehor supplies that file (script → ElevenLabs TTS → screen-capture →
// combine into one .mp4, no API/engineering needed for the file itself,
// see VOICE-AGENT-DEMO-PAGE-backlog.md for the exact steps) and drops it
// into web/public/demo-narration.mp4. Until then this section renders an
// empty video player with no source.
// CORRECTED STATUS (checked directly against KS-REPORT-4.27, not assumed
// from this page's own older header comment above): unlike the rest of
// this file's header, which still says "NOT YET DEPLOYED," this page was
// actually merged to main and deployed to production at fixprove.dev/demo
// on 2026-09-08 (KS-REPORT-4.27, confirmed live via two independent
// fetches) -- that status text is now stale, left uncorrected above only
// because this addendum-style KS-TRACE convention is append-only, not
// edit-in-place. This video section is a NEW, UNCOMMITTED local change on
// top of that already-live page. It must not be committed, pushed, or
// deployed until (a) the real demo-narration.mp4 exists at
// web/public/demo-narration.mp4 and (b) Yehor gives a separate, explicit
// go-ahead -- pushing this as-is would put a broken/empty video element
// on the live production page.
// | test: manual visual check once the real .mp4 is in place; exposure
// grep run against all new on-screen text below (no pricing, no
// unverifiable absolute claims) before this was written.

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

      <section className="video-intro">
        <h2>Watch it catch one</h2>
        <video className="demo-video" controls preload="metadata">
          <source src="/demo-narration.mp4" type="video/mp4" />
          Your browser doesn&apos;t support embedded video — the same catch
          runs live in the examples below.
        </video>
        <p className="cta-note muted">
          About 75 seconds. Same command, same real result as the two
          examples below.
        </p>
      </section>

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
        <p className="cta-note muted">
          Full script:{" "}
          <a href="https://github.com/FixProve/fixprove/tree/main/examples/meetup-demo-2026-09-17/python-sample">
            examples/meetup-demo-2026-09-17/python-sample
          </a>
        </p>
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
        <p className="cta-note muted">
          Full script:{" "}
          <a href="https://github.com/FixProve/fixprove/tree/main/examples/meetup-demo-2026-09-17/ts-sample">
            examples/meetup-demo-2026-09-17/ts-sample
          </a>
        </p>
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

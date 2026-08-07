import fs from "node:fs";
import path from "node:path";

// #KS-TRACE: SESSION-4.12-L | requirement: "web/src/app/terms/page.tsx renders the
// exact content of web/legal/terms-public.md" | assumption: same as
// src/app/privacy/page.tsx (see that file's KS-TRACE comment for the full
// no-existing-convention rationale) -- this route mirrors it exactly, reading
// web/legal/terms-public.md verbatim via `fs` at build time and rendering it
// inside a <pre> block with zero markdown parsing or text transformation. | test:
// Task G verification -- diff of this component's read against the source file (a
// full `next build` could not run in this sandbox; see privacy/page.tsx's
// KS-TRACE comment and MEMORY/state.md for the documented pnpm-symlink
// limitation). TypeScript-only compile check substituted.

const content = fs.readFileSync(
  path.join(process.cwd(), "legal", "terms-public.md"),
  "utf-8"
);

export const metadata = {
  title: "Terms of Service — FixProve",
  description: "FixProve's Terms of Service.",
};

export default function TermsPage() {
  return (
    <main>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "inherit",
        }}
      >
        {content}
      </pre>
    </main>
  );
}

import fs from "node:fs";
import path from "node:path";

// #KS-TRACE: SESSION-4.12-L | requirement: "web/src/app/privacy/page.tsx renders the
// exact content of web/legal/privacy-public.md" | assumption: no markdown-rendering
// convention exists anywhere in this repo -- confirmed via
// `grep -iE "markdown|remark|mdx" package.json` returning zero matches, and no
// shared content/lib component directory exists under src/. Per Yehor's Task G
// instruction ("if no existing convention exists, use the simplest static render
// and say so in the attestation"), this route reads the source markdown file
// directly at build time via Node's `fs` module and renders it verbatim inside a
// <pre> block -- no markdown parsing, no HTML transformation, no re-typing of the
// text. The rendered output is byte-identical to web/legal/privacy-public.md by
// construction (it IS that file's content, read fresh, not copied). This route is
// statically generated under this app's `output: "export"` config (next.config.js),
// so `fs.readFileSync` runs only during `next build`, never at request time. |
// test: Task G verification -- diff of this component's read against the source
// file (a full `next build` could not be run in this sandbox: pnpm's node_modules
// symlinks are broken here, same documented limitation that has blocked
// worker.test.ts and required an ad-hoc `npx typescript` workaround in prior
// sessions -- see MEMORY/state.md, PITFALL-WATCHLIST.md). TypeScript-only compile
// check substituted; Yehor's own `pnpm build`/`next build` on his machine is the
// first real build this route will see.

const content = fs.readFileSync(
  path.join(process.cwd(), "legal", "privacy-public.md"),
  "utf-8"
);

export const metadata = {
  title: "Privacy Policy — FixProve",
  description: "FixProve's Privacy Policy.",
};

export default function PrivacyPage() {
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

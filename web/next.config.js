/** @type {import('next').NextConfig} */
// #KS-TRACE: SESSION-0.2-SCAFFOLD | assumption: static export targeting
// Cloudflare Pages per Session 0.3 plan (fixprove.dev). No server-side
// rendering / API routes used in this package. | test: next build (this session)
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;

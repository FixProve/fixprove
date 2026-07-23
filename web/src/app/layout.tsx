import "./globals.css";

// #KS-TRACE: SESSION-4.12-D | requirement: "Add openGraph + twitter fields to
// the metadata export (title, description, image, card type)" | assumption:
// static export (output: "export") still resolves metadataBase-relative
// image URLs at build time, so a relative "/og-image.png" is fine as long as
// the file exists under web/public/ | test: anonymous fetch of the live
// page's rendered <head>, done-check in
// NEXT-SESSION-4.12-D-STARTING-PROMPT.md.

const title = "FixProve — prove your AI-generated code before it merges";
const description =
  "FixProve deterministically verifies that every import, symbol, method, and API call in AI-generated code resolves against your real installed dependencies. Zero LLM tokens.";

export const metadata = {
  metadataBase: new URL("https://fixprove.dev"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://fixprove.dev",
    siteName: "FixProve",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FixProve — prove your AI-generated code before it merges",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

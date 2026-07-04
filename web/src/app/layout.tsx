import "./globals.css";

export const metadata = {
  title: "FixProve — prove your AI-generated code before it merges",
  description:
    "FixProve deterministically verifies that every import, symbol, method, and API call in AI-generated code resolves against your real installed dependencies. Zero LLM tokens.",
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

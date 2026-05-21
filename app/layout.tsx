import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sojitz NTO Alliance Cockpit",
  description:
    "ニオブ系次世代電池 × バッテリーパスポートで2027年規制ニッチを掴む、双日のトレーサビリティ&コンプライアンス・プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

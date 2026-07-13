import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOCAL SIGNAL | 地域店舗リサーチ",
  description: "Googleマップの評価から、Webサイトを持たない地域の優良店を発見する店舗リサーチツール。",
  openGraph: {
    title: "LOCAL SIGNAL | 地域店舗リサーチ",
    description: "いい店を、見つけにいく。Webサイトを持たない地域の優良店を発見。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LOCAL SIGNAL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCAL SIGNAL | 地域店舗リサーチ",
    description: "いい店を、見つけにいく。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

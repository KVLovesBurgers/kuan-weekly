import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "寬數週練｜小學到高中數學每週練習包",
  description: "觀念拆細，路才走得穩。吳寬老師的數學週練：小一到高三與 SAT Math，出題＋解答、依程度排題、每周進度。",
  metadataBase: new URL("https://kuan-weekly.vercel.app"),
  openGraph: {
    title: "寬數週練｜吳寬老師",
    description: "每週學生題本＋家長解答。小一到高三與 SAT Math。",
    url: "https://kuan-weekly.vercel.app",
    siteName: "寬數週練",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "寬數週練｜觀念拆細，路才走得穩",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "寬數週練｜吳寬老師",
    description: "每週學生題本＋家長解答。小一到高三與 SAT Math。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "寬數週練｜國中數學・高中數學每週練習題本｜吳寬老師";
const description =
  "吳寬老師的國中、高中數學每週練習：跟著學校進度、每週練必錯題、畫圖把觀念講懂。每週一份學生題本＋一份家長解答，免登入先看題本試閱。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "國中數學",
    "高中數學",
    "數學每週練習",
    "數學題本",
    "數學講義",
    "段考數學",
    "會考數學",
    "學測數學",
    "家長解答",
    "吳寬老師",
    "寬數週練",
  ],
  metadataBase: new URL("https://kuan-weekly.vercel.app"),
  alternates: { canonical: "/" },
  applicationName: "寬數週練",
  authors: [{ name: "吳寬老師" }],
  openGraph: {
    title: "寬數週練｜國中・高中數學每週題本（吳寬老師）",
    description: "跟著學校進度、每週練必錯題、畫圖把觀念講懂。學生題本＋家長解答，免費看題本試閱。",
    url: "https://kuan-weekly.vercel.app",
    siteName: "寬數週練",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 720,
        alt: "寬數週練｜觀念拆細，路才走得穩",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "寬數週練｜國中・高中數學每週題本",
    description: "跟著學校進度、每週練必錯題、畫圖把觀念講懂。免費看題本試閱。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1419",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600&family=Noto+Serif+TC:wght@500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

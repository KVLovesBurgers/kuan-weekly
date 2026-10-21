import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE, SOCIAL } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsEvents } from "@/components/AnalyticsEvents";
import { ZhValidation } from "@/components/ZhValidation";

// 自架字型（next/font）：拿掉 fonts.googleapis.com 的阻塞式 CSS，改用可變字重、同網域載入。
// 字型拆三份：內文 400（public/fonts，全站用字，唯一 preload）、粗體 500–700（只含粗體出現過的字）、標題襯線（只含標題用字）。
// 內文兩份的 @font-face 在 globals.css；子集外的字會逐字落到後面的系統字型。
const serif = localFont({ src: "./fonts/noto-serif-tc-head.woff2", weight: "400 700", display: "swap", preload: false, variable: "--font-serif", fallback: ["Noto Serif TC", "PMingLiU", "serif"] });

const title = "寬數週練｜國中數學・高中數學每週練習題本｜吳寬老師";
const description =
  "吳寬老師的國中、高中數學每週練習：跟著學校進度、每週練必錯題、畫圖把觀念講懂。每週一份學生題本＋一份家長解答，留信箱即可免費下載題本試閱。";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE.name,
  url: SITE.url,
  description,
  image: `${SITE.url}/og.png`,
  areaServed: "TW",
  founder: {
    "@type": "Person",
    name: SITE.teacher,
    jobTitle: "數學老師",
    alumniOf: "國立陽明交通大學 應用數學系",
  },
  makesOffer: [
    {
      "@type": "Offer",
      name: "寬數週練｜按月",
      price: SITE.monthlyPrice,
      priceCurrency: "TWD",
      url: `${SITE.url}/#pricing`,
    },
    {
      "@type": "Offer",
      name: "寬數週練｜按年",
      price: SITE.yearlyPrice,
      priceCurrency: "TWD",
      url: `${SITE.url}/#pricing`,
    },
  ],
  sameAs: [SOCIAL.instagramUrl, SOCIAL.facebookUrl, SOCIAL.youtubeChannelUrl],
};

export const viewport: Viewport = {
  themeColor: "#0f1419",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={serif.variable}>
      <head>
        <link rel="preload" href="/fonts/noto-sans-tc-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
        <AnalyticsEvents />
        <ZhValidation />
      </body>
    </html>
  );
}

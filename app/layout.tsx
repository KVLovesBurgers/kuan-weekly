import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "寬數週練｜小學到高中數學每週練習包",
  description: "觀念拆細，路才走得穩。吳寬老師的數學週練：小一到高三與 SAT Math，出題＋解答、依程度排題、每周進度。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

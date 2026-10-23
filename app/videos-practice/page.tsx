import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DiagCta } from "@/components/DiagCta";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { TrackView } from "@/components/Tracking";
import { VideoPracticeList } from "@/components/VideoPracticeList";
import { liveUnitPacks } from "@/lib/unit-packs";
import { KIND_ORDER, videoRows } from "@/lib/video-practice";

export const metadata: Metadata = {
  title: "影片練習題：用影片編號找題目，每份附詳解｜Saber數學",
  description: "看完 Saber數學 的短影片，想再多練幾題？輸入影片編號或標題，就能開啟那支影片對應的練習題 PDF，每份都附逐步詳解。",
  alternates: { canonical: "/videos-practice" },
  openGraph: {
    title: "影片練習題｜Saber數學",
    description: "用影片編號或標題，找到那支影片對應的練習題。每份都附逐步詳解。",
    url: "/videos-practice",
    siteName: "Saber數學",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/units/units-og.png", width: 1200, height: 630, alt: "Saber數學 影片練習題" }],
  },
};

// 靜態＋ISR：每 60 秒重算，新影片的練習題在 publishAt 後一分鐘內出現（與 /units 相同）。
export const revalidate = 60;

export default function VideosPracticePage() {
  const now = new Date();
  const rows = videoRows(now);
  const kinds = KIND_ORDER.map((k) => ({ key: k, n: rows.filter((r) => r.kind === k).length }))
    .filter((k) => k.n > 0)
    .map((k) => ({ key: k.key, label: `${k.key}（${k.n}）` }));
  // 單元順序照 /units（liveUnitPacks 的順序），只列目前有影片練習題的單元。
  const units = liveUnitPacks(now)
    .map((u) => ({ key: u.slug, n: rows.filter((r) => r.unit === u.slug).length, title: u.title }))
    .filter((u) => u.n > 0)
    .map((u) => ({ key: u.key, label: `${u.title}（${u.n}）` }));

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="units_view" target="videos-practice" />
      </Suspense>
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">Saber數學</p>
          <h1 className="display practice-title">影片練習題</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            看完影片想再多練幾題？找到影片編號（標題上的 # 數字）或標題，按「開啟練習題」就是那支影片的同類題目，每份都附逐步詳解。先自己寫寫看再對答案。
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 15 }}>
            想照單元系統地練？
            <Link href="/units" className="practice-cta-link">看依單元整理的完整清單</Link>
          </p>

          <VideoPracticeList rows={rows} kinds={kinds} units={units} />

          <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>
            找不到影片？在影片底下留言編號或單元名稱，會排進下一批。新影片的練習題會在影片公開時一起加進來。
          </p>

          <DiagCta src="videos-diag" />

          <div className="practice-cta">
            <p className="muted">想每週固定練一份這種有詳解的題目，可以看看寬數週練。</p>
            <Suspense fallback={<Link href="/sample?src=videos" className="practice-cta-link">免費試閱一週題本</Link>}>
              <UnitTrialLink base="videos" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

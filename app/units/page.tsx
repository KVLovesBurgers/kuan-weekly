import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { ShareToParents } from "@/components/ShareToParents";
import { TrackView } from "@/components/Tracking";
import { PackCard, SheetCard } from "@/components/UnitSheets";
import { hasLivePack, liveUnitPacks, unitSheets } from "@/lib/unit-packs";

export const metadata: Metadata = {
  title: "免費練習題與單元包：依單元找題目，每題附詳解｜Saber數學",
  description: "Saber數學 免費練習題，依單元整理：乘法公式、三角函數、指數與對數、向量、排列組合與機率、Digital SAT 等。每份都有題目和逐步詳解。",
  alternates: { canonical: "/units" },
  openGraph: {
    title: "免費練習題與單元包｜Saber數學",
    description: "卡在哪個單元，就從那個單元開始練。每份都有題目和逐步詳解。",
    url: "/units",
    siteName: "Saber數學",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/units/units-og.png", width: 1200, height: 630, alt: "Saber數學 免費練習題・單元包" }],
  },
  twitter: { card: "summary_large_image", images: ["/units/units-og.png"] },
};

// 靜態＋ISR：每 60 秒重算，新練習題在 publishAt 後一分鐘內出現。src 追蹤在瀏覽器端讀。
export const revalidate = 60;

const LEVELS = ["國中", "高中", "SAT"] as const;

export default function UnitsPage() {
  const now = new Date();
  const units = liveUnitPacks(now).map((u) => ({ u, sheets: unitSheets(u.slug, now), pack: hasLivePack(u, now) }));
  const total = units.reduce((n, x) => n + x.sheets.length + (x.pack ? 1 : 0), 0);

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="units_view" />
      </Suspense>
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">Saber數學</p>
          <h1 className="display practice-title">免費練習題・單元包</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            影片留言「練習」或單元名稱拿到的題目都在這裡，依單元整理，目前共 {units.length} 個單元、{total} 份。每份都有題目和逐步詳解，先自己寫再對答案。
          </p>

          <ul className="unit-jump" aria-label="單元">
            {units.map(({ u, sheets, pack }) => (
              <li key={u.slug}>
                <a href={`#${u.slug}`}>
                  {u.title}（{sheets.length + (pack ? 1 : 0)}）
                </a>
              </li>
            ))}
          </ul>

          {LEVELS.map((lv) => {
            const list = units.filter((x) => x.u.level === lv);
            if (!list.length) return null;
            return (
              <div key={lv}>
                <p className="unit-level">{lv}</p>
                {list.map(({ u, sheets, pack }) => (
                  <section key={u.slug} id={u.slug} className="unit-section">
                    <div className="unit-section-head">
                      <h2 className="display">{u.title}</h2>
                      <Link href={`/units/${u.slug}`} className="practice-cta-link" style={{ fontSize: 14 }}>
                        單元頁・傳給爸媽
                      </Link>
                    </div>
                    <p className="muted" style={{ margin: "6px 0 0", fontSize: 15 }}>{u.topic}</p>
                    <ul className="practice-list" style={{ marginTop: 12 }}>
                      {pack && <PackCard u={u} />}
                      {sheets.map((s) => (
                        <SheetCard key={s.driveId} unit={u.slug} s={s} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            );
          })}

          <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>
            沒有你要的單元？在影片底下留言單元名稱，會排進下一批。新影片的練習題會在影片公開時一起加進來。
          </p>

          <ShareToParents path="/units" />

          <div className="practice-cta">
            <p className="muted">想每週固定練一份這種有詳解的題目，可以看看寬數週練。</p>
            <Suspense fallback={<Link href="/sample?src=units" className="practice-cta-link">免費試閱一週題本</Link>}>
              <UnitTrialLink base="units" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

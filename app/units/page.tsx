import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { liveUnitPacks } from "@/lib/unit-packs";

export const metadata: Metadata = {
  title: "單元包：每個單元 3 題附詳解｜Saber數學",
  description: "Saber數學 單元包：卡在哪個單元，就下載那一份。每份 3 題由淺到深，附觀念、圖和逐步詳解。",
  alternates: { canonical: "/units" },
  openGraph: {
    title: "單元包：每個單元 3 題附詳解｜Saber數學",
    description: "卡在哪個單元，就下載那一份。每份 3 題附詳解。",
    url: "/units",
    siteName: "Saber數學",
    locale: "zh_TW",
    type: "website",
  },
};

export const revalidate = 60;

const LEVELS = ["國中", "高中", "SAT"] as const;

export default function UnitsPage() {
  const units = liveUnitPacks();

  return (
    <>
      <Header />
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">Saber數學</p>
          <h1 className="display practice-title">單元包</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            卡在哪個單元，就下載那一份。每份 3 題由淺到深，每題都有觀念、圖和逐步詳解，先自己寫再對答案。
          </p>

          {LEVELS.map((lv) => {
            const list = units.filter((u) => u.level === lv);
            if (!list.length) return null;
            return (
              <section key={lv} style={{ marginTop: 28 }}>
                <h2 className="display" style={{ fontSize: 20, margin: 0 }}>{lv}</h2>
                <ul className="practice-list" style={{ marginTop: 12 }}>
                  {list.map((u) => (
                    <li key={u.slug} className="card practice-card">
                      <div className="practice-meta">
                        <span className="badge">{u.level}</span>
                        <span>3 題附詳解</span>
                      </div>
                      <h2 className="display">{u.title}</h2>
                      <p className="muted">{u.topic}</p>
                      <Link className="btn btn-ink practice-btn" href={`/units/${u.slug}`}>
                        看這個單元
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>
            沒有你要的單元？在影片底下留言單元名稱，會排進下一批。每支影片對應的練習題在
            <Link href="/practice" className="practice-cta-link">免費練習題</Link>。
          </p>

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

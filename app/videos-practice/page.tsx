import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoPracticeList } from "@/components/VideoPracticeList";
import { practiceFacets, visiblePractice } from "@/data/videos-practice";
import { getParent } from "@/lib/auth";

export const metadata: Metadata = {
  title: "影片練習題：用影片編號找題目，每份附解答｜Saber數學",
  description: "看完 Saber數學 的短影片，想再多練幾題？輸入影片編號或標題，就能開啟那支影片對應的練習題 PDF，每份都附解答。",
  alternates: { canonical: "/videos-practice" },
  openGraph: {
    title: "影片練習題｜Saber數學",
    description: "用影片編號或標題，找到那支影片對應的練習題。每份都附解答。",
    url: "/videos-practice",
    siteName: "Saber數學",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/og.png", width: 1280, height: 720, alt: "Saber數學 影片練習題" }],
  },
};

export const dynamic = "force-dynamic";

export default async function VideosPracticePage() {
  const parent = await getParent();
  const rows = visiblePractice();
  const { kinds, units, grades } = practiceFacets(rows);

  return (
    <>
      <Header parentEmail={parent?.email} />
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">Saber數學</p>
          <h1 className="display practice-title">影片練習題</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            看完影片想再多練幾題？找到影片編號（標題上的 # 數字）或標題，按「開啟練習題」就是那支影片的同類題目，每份都附解答。先自己寫寫看再對答案。
          </p>
          <VideoPracticeList rows={rows} kinds={kinds} units={units} grades={grades} />
          <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>
            找不到影片？在影片底下留言編號或單元名稱，會排進下一批。新影片的練習題會在影片公開時一起加進來。
          </p>
          <div className="practice-cta">
            <p className="muted">想每週固定練一份這種有詳解的題目，可以看看寬數週練。</p>
            <Link className="practice-cta-link" href="/sample?src=videos">
              免費試閱一週題本
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

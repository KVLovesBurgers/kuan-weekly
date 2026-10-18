import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cleanSrc } from "@/lib/leads";
import { driveUrl, livePracticeSheets } from "@/lib/practice-sheets";

export const metadata: Metadata = {
  title: "免費練習題｜Saber數學",
  description: "Saber數學 每支影片對應的免費練習題，題目＋逐步詳解，直接開啟 Google Drive 檔案。",
  alternates: { canonical: "/practice" },
  openGraph: {
    title: "免費練習題｜Saber數學",
    description: "每支影片對應的免費練習題，題目＋逐步詳解。",
    url: "/practice",
    siteName: "Saber數學",
    locale: "zh_TW",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "numeric", day: "numeric" }).format(new Date(iso));

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.src) ? sp.src[0] : sp.src;
  const src = cleanSrc(raw);
  const sheets = livePracticeSheets();
  const trialHref = `/sample?src=${src ? `practice-${src}`.slice(0, 40) : "practice"}`;

  return (
    <>
      <Header />
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">Saber數學</p>
          <h1 className="display practice-title">免費練習題</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            影片留言「練習」的題目都在這裡。找到你看的那支，點按鈕開啟檔案，題目和詳解都在同一份。
          </p>

          <ul className="practice-list">
            {sheets.map((s) => (
              <li key={s.driveId} className="card practice-card">
                <div className="practice-meta">
                  <span className="badge">{s.level}</span>
                  <span>{s.series}</span>
                  <span aria-hidden="true">·</span>
                  <span>{fmtDate(s.publishAt)}</span>
                </div>
                <h2 className="display">{s.title}</h2>
                <p className="muted">{s.topic}</p>
                <a
                  className="btn btn-ink practice-btn"
                  href={driveUrl(s.driveId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  開啟練習題＋詳解
                </a>
              </li>
            ))}
          </ul>

          <div className="practice-cta">
            <p className="muted">
              想每週固定練一份這種有詳解的題目，可以看看寬數週練。
            </p>
            <Link href={trialHref} className="practice-cta-link">
              免費試閱一週題本
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

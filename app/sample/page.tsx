import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialDm } from "@/components/SocialDm";
import { getParent } from "@/lib/auth";
import { DEMO_PARENT_EMAIL, SAMPLE, SOCIAL } from "@/lib/config";

export const metadata: Metadata = {
  title: "免費題本試閱｜寬數週練・國中數學每週練習",
  description: `免登入下載寬數週練一週的學生題本與家長解答（${SAMPLE.unit}）。吳寬老師出題：先讀觀念、再練段考常錯題，家長解答含步驟拆解。`,
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "免費題本試閱｜寬數週練",
    description: "免登入下載一週學生題本＋家長解答，看看寬數週練長什麼樣子。",
    url: "/sample",
  },
};

export const dynamic = "force-dynamic";

export default async function SamplePage() {
  const parent = await getParent();
  return (
    <>
      <Header parentEmail={parent?.email} />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <p className="kicker">題本試閱 · 免登入</p>
          <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 44px)", margin: "8px 0 12px" }}>
            領題本試閱
          </h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            這是寬數週練真實的一週：<strong>{SAMPLE.unit}</strong>。學生題本 2 頁（先讀本週觀念、再作答，沒有答案）；家長解答
            2 頁（每題答案＋步驟說明）。可以直接列印給孩子寫。
          </p>

          <div className="sample-downloads">
            <a className="dl-card" href={SAMPLE.studentPdf} download="寬數週練試閱-國一1-1-學生題本.pdf">
              <span className="kicker">PDF · 2 頁</span>
              <strong className="display">下載學生題本</strong>
              <span className="muted">給孩子作答，不含答案</span>
            </a>
            <a className="dl-card" href={SAMPLE.parentPdf} download="寬數週練試閱-國一1-1-家長解答.pdf">
              <span className="kicker">PDF · 2 頁</span>
              <strong className="display">下載家長解答</strong>
              <span className="muted">孩子寫完再打開對答</span>
            </a>
          </div>

          <div className="sample-grid" style={{ marginTop: 36 }}>
            <figure className="sample-card">
              <div className="sample-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SAMPLE.studentPreview}
                  alt="學生題本第一頁：本週觀念與五題練習題"
                  width={900}
                  height={1273}
                  decoding="async"
                />
              </div>
              <figcaption>
                <strong>學生題本・第 1 頁</strong>
                <span className="muted">本週觀念 → 練習題，提示寫在題下</span>
              </figcaption>
            </figure>
            <figure className="sample-card">
              <div className="sample-frame sample-frame--tilt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SAMPLE.parentPreview}
                  alt="家長解答第一頁：每題答案與步驟說明"
                  width={900}
                  height={1273}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <strong>家長解答・第 1 頁</strong>
                <span className="muted">答案＋為什麼，順便點出常見錯法</span>
              </figcaption>
            </figure>
          </div>

          <div className="card" style={{ marginTop: 36 }}>
            <h2 className="display" style={{ fontSize: 24, margin: "0 0 8px" }}>
              想先問問題，或領更多試閱？
            </h2>
            <p className="muted" style={{ margin: "0 0 16px" }}>
              到 Threads／IG {SOCIAL.handle} 私訊「{SOCIAL.weeklyKeyword}」，領題本試閱；可以順便附上孩子年級與目前學校進度。
            </p>
            <SocialDm />
          </div>

          <div className="cta-row" style={{ marginTop: 28 }}>
            <Link href="/#pricing" className="btn btn-ink">
              看方案
            </Link>
            <Link href="/#videos" className="btn btn-paper">
              看吳寬老師怎麼教
            </Link>
          </div>
          <p className="muted" style={{ marginTop: 20, fontSize: 13 }}>
            想走一遍家長後台（下載、填回饋）？可用示範信箱 {DEMO_PARENT_EMAIL}{" "}
            <Link href={`/login?email=${encodeURIComponent(DEMO_PARENT_EMAIL)}&next=/dashboard`} className="u">
              登入示範帳
            </Link>
            。
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

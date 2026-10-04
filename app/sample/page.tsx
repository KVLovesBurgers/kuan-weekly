import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialDm } from "@/components/SocialDm";
import { SampleImg } from "@/components/SampleImg";
import { cookies } from "next/headers";
import { getParent } from "@/lib/auth";
import { submitSampleLead } from "@/app/actions/lead";
import { cleanSrc, cleanUtm, LEAD_COOKIE, LEAD_GRADES, LEAD_ROLES } from "@/lib/leads";
import { seatsRemaining } from "@/lib/db";
import { DEMO_PARENT_EMAIL, SAMPLE, SITE, SOCIAL, seatLabel } from "@/lib/config";

export const metadata: Metadata = {
  title: "免費題本試閱｜寬數週練・國中數學每週練習",
  description: `留下信箱即可下載寬數週練一週的學生題本與家長解答（${SAMPLE.unit}）。吳寬老師出題：先讀觀念、再練段考常錯題，家長解答含步驟拆解。`,
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "免費題本試閱｜寬數週練",
    description: "留下信箱，免費下載一週學生題本＋家長解答，看看寬數週練長什麼樣子。",
    url: "/sample",
    siteName: "寬數週練",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/og.png", width: 1280, height: 720, alt: "寬數週練｜免費題本試閱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "免費題本試閱｜寬數週練",
    description: "留下信箱，免費下載一週學生題本＋家長解答，看看寬數週練長什麼樣子。",
    images: ["/og.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function SamplePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const src = cleanSrc(one(sp.src));
  const utm = {
    utm_source: cleanUtm(one(sp.utm_source)),
    utm_medium: cleanUtm(one(sp.utm_medium)),
    utm_campaign: cleanUtm(one(sp.utm_campaign)),
  };
  const error = one(sp.error).slice(0, 80);
  const parent = await getParent();
  const jar = await cookies();
  const unlocked = jar.get(LEAD_COOKIE)?.value === "1" || Boolean(parent);
  const justUnlocked = unlocked && one(sp.ok) === "1";
  const remaining = await seatsRemaining();
  const full = remaining <= 0;
  const seat = seatLabel(remaining);
  return (
    <>
      <Header parentEmail={parent?.email} />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <p className="kicker">題本試閱 · 免費下載</p>
          <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 44px)", margin: "8px 0 12px" }}>
            領題本試閱
          </h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            這是寬數週練真實的一週：<strong>{SAMPLE.unit}</strong>。學生題本 4 頁（本週觀念＋數線圖，再分基礎／段考常考／進階挑戰三關作答，沒有答案）；家長解答
            4 頁（每題答案＋步驟說明＋常見錯誤，附家長陪讀指引）。A4 可以直接列印給孩子寫。
          </p>

          <div id="get" style={{ scrollMarginTop: 80 }}>
            {unlocked ? (
              <>
                {justUnlocked ? (
                  <p className="banner ok" role="status" style={{ marginTop: 20 }}>
                    已收到，題本試閱可以下載了。
                  </p>
                ) : null}
                <div className="sample-downloads">
                  <a className="dl-card" href={SAMPLE.studentPdf} download="寬數週練試閱-國一1-1-學生題本.pdf">
                    <span className="kicker">PDF · 4 頁</span>
                    <strong className="display">下載學生題本</strong>
                    <span className="muted">給孩子作答，不含答案</span>
                  </a>
                  <a className="dl-card" href={SAMPLE.parentPdf} download="寬數週練試閱-國一1-1-家長解答.pdf">
                    <span className="kicker">PDF · 4 頁</span>
                    <strong className="display">下載家長解答</strong>
                    <span className="muted">孩子寫完再打開對答</span>
                  </a>
                </div>
              </>
            ) : (
              <form action={submitSampleLead} className="form card lead-form" style={{ marginTop: 24 }}>
                <h2 className="display" style={{ fontSize: 22, margin: 0 }}>
                  留下信箱，馬上下載兩份 PDF
                </h2>
                {error ? (
                  <p className="banner warn" role="alert" style={{ margin: 0 }}>
                    {error}
                  </p>
                ) : null}
                <input type="hidden" name="src" value={src} />
                {Object.entries(utm).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
                <label htmlFor="lead_email">電子信箱（必填）</label>
                <input
                  id="lead_email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                />
                <fieldset className="lead-role">
                  <legend>我是</legend>
                  {LEAD_ROLES.map((r, i) => (
                    <label key={r} className="lead-radio">
                      <input type="radio" name="role" value={r} defaultChecked={i === 0} /> {r}
                    </label>
                  ))}
                </fieldset>
                <label htmlFor="lead_grade">孩子年級（選填）</label>
                <select id="lead_grade" name="grade" defaultValue="">
                  <option value="">不填</option>
                  {LEAD_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <button className="btn btn-ink" type="submit">
                  取得題本試閱
                </button>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  信箱只用來寄送寬數週練的試閱與更新，不會提供給第三方；想刪除隨時來信告知。詳見
                  <Link href="/privacy" className="u">
                    隱私權政策
                  </Link>
                  。
                </p>
              </form>
            )}
          </div>

          <div className="sample-grid" style={{ marginTop: 36 }}>
            <figure className="sample-card">
              <div className="sample-frame">
                <SampleImg kind="student" alt="學生題本第一頁：本週觀念、數線圖與基礎題" sizes="(max-width: 860px) calc(100vw - 64px), 400px" eager />
              </div>
              <figcaption>
                <strong>學生題本・第 1 頁</strong>
                <span className="muted">本週觀念＋數線圖 → 三關 15 題</span>
              </figcaption>
            </figure>
            <figure className="sample-card">
              <div className="sample-frame sample-frame--tilt">
                <SampleImg kind="parent" alt="家長解答第一頁：答案速查與每題步驟說明" sizes="(max-width: 860px) calc(100vw - 64px), 400px" />
              </div>
              <figcaption>
                <strong>家長解答・第 1 頁</strong>
                <span className="muted">答案速查＋每題步驟與常見錯誤</span>
              </figcaption>
            </figure>
          </div>

          <section className="card next-step" style={{ marginTop: 36 }} aria-labelledby="next-step-title">
            <div>
              <p className="kicker">看完試閱之後</p>
              <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 4px" }}>
                覺得適合，就為孩子訂閱週練
              </h2>
              <p className="price">
                {SITE.currency}
                {SITE.monthlyPrice}
                <small> /月 · 每位孩子</small>
              </p>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                或年繳 {SITE.currency}
                {SITE.yearlyPrice.toLocaleString("en-US")}。{seat.text}
                {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。
              </p>
              <ol className="steps-list">
                <li>用信箱登入（不設密碼）</li>
                <li>填孩子年級、校內進度與弱點單元</li>
                <li>匯款後寄證明，約 1 個工作天開通</li>
              </ol>
            </div>
            <div className="cta-row" style={{ marginTop: 0 }}>
              {full ? (
                <Link href="/waitlist" className="btn btn-ink">
                  名額已滿，加入候補
                </Link>
              ) : (
                <Link href="/login?next=/subscribe" className="btn btn-ink">
                  為孩子訂閱週練
                </Link>
              )}
              <Link href="/#pricing" className="btn btn-paper">
                看方案細節
              </Link>
            </div>
          </section>

          <div className="card" style={{ marginTop: 20 }}>
            <h2 className="display" style={{ fontSize: 22, margin: "0 0 8px" }}>
              想先問問題，或領更多試閱？
            </h2>
            <p className="muted" style={{ margin: "0 0 16px" }}>
              到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.weeklyKeyword}」，領題本試閱；可以順便附上孩子年級與目前學校進度。
            </p>
            <SocialDm />
          </div>

          <p style={{ marginTop: 20 }}>
            <Link href="/#videos" className="u muted">
              先看吳寬老師怎麼教（YouTube 短影片）
            </Link>
          </p>
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

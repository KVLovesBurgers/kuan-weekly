import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialDm } from "@/components/SocialDm";
import { SampleImg } from "@/components/SampleImg";
import { cookies } from "next/headers";
import { getParent } from "@/lib/auth";
import { startSampleCheckout, submitSampleLead } from "@/app/actions/lead";
import {
  cleanSrc,
  cleanTrack,
  cleanUtm,
  LEAD_COOKIE,
  LEAD_GRADES,
  LEAD_ID_COOKIE,
  LEAD_ROLES,
  LEAD_TRACK_COOKIE,
  LEAD_TRADE_COOKIE,
  type SampleTrack,
} from "@/lib/leads";
import { getDb, seatsRemaining } from "@/lib/db";
import { BANK_TRANSFER, GRADE_OPTIONS, GRADE_SAMPLES, GRADE_SAMPLES_NOTE, SAMPLE, SAMPLES, SITE, SOCIAL, seatLabel, money } from "@/lib/config";

export const metadata: Metadata = {
  title: "免費題本試閱｜寬數週練・國中數學每週練習",
  description: "留下信箱，依孩子年級免費下載寬數週練試閱：國中段考、高中學測必錯題、SAT Math。吳寬老師出題，家長解答含步驟拆解。",
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
  const track: SampleTrack = cleanTrack(one(sp.track)) || cleanTrack(jar.get(LEAD_TRACK_COOKIE)?.value) || "jh";
  const pack = SAMPLES[track];
  const leadId = jar.get(LEAD_ID_COOKIE)?.value ?? "";
  const canQuickSubscribe = unlocked && Boolean(leadId) && !parent;
  const tradeParam = one(sp.trade).slice(0, 40);
  let order: { id: string; plan: string; amount: number; display_name: string; email: string } | undefined;
  if (tradeParam && jar.get(LEAD_TRADE_COOKIE)?.value === tradeParam) {
    const db = await getDb();
    order = (await db
      .prepare(
        `SELECT c.id, c.plan, c.amount, ch.display_name, p.email FROM checkout_attempts c
         JOIN children ch ON ch.id = c.child_id JOIN parents p ON p.id = c.parent_id WHERE c.id = ?`,
      )
      .get(tradeParam)) as typeof order;
  }
  const leadGradeDefault = track === "sat" ? "SAT Math" : track === "gsat" ? "高三" : "國一";
  const mailto = order
    ? `mailto:${BANK_TRANSFER.proofEmail}?subject=${encodeURIComponent(
        `寬數週練匯款證明｜${order.display_name}｜${order.id}`,
      )}&body=${encodeURIComponent(
        `老師您好，\n\n已匯款 ${SITE.currency}${money(order.amount)}（${order.plan === "yearly" ? "年繳" : "月繳"}）。\n訂單編號：${order.id}\n孩子：${order.display_name}\n家長信箱：${order.email}\n\n（請附上轉帳證明截圖）\n`,
      )}`
    : "";
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
            依孩子年級給你對應的一份：<strong>國中</strong>是真實的一週（{SAMPLE.unit}，學生題本＋家長解答各 4 頁）；<strong>高中</strong>是學測必錯 5 題（對數、向量、條件機率、數列、餘弦定理），附步驟與常見錯誤；<strong>SAT</strong> 是 Digital SAT Math 講義第 1 章與解答本。A4 可以直接列印給孩子寫。
          </p>

          <nav className="cta-row sample-tracks" aria-label="選擇試閱年級" style={{ marginTop: 16 }}>
            {(["jh", "gsat", "sat"] as SampleTrack[]).map((k) => (
              <Link
                key={k}
                href={`/sample?track=${k}${src ? `&src=${encodeURIComponent(src)}` : ""}#get`}
                className={`btn ${k === track ? "btn-ink" : "btn-paper"}`}
                aria-current={k === track ? "page" : undefined}
              >
                {k === "jh" ? "國中" : k === "gsat" ? "學測" : "SAT"}試閱
              </Link>
            ))}
          </nav>
          <p className="muted" style={{ fontSize: 14, margin: "8px 0 0" }}>
            目前選擇：<strong>{pack.label}・{pack.unit}</strong>
          </p>
          <p className="muted" style={{ fontSize: 14, margin: "8px 0 0" }}>
            小學、高一、高二、高三與 SAT Math 另有約 5 題的
            <Link href="#grades" className="u">
              範例題本
            </Link>
            ，實際題本依孩子需求客製。
          </p>

          <div id="get" style={{ scrollMarginTop: 80 }}>
            {unlocked ? (
              <>
                {justUnlocked ? (
                  <p className="banner ok" role="status" style={{ marginTop: 20 }}>
                    已收到，題本試閱可以下載了。
                  </p>
                ) : null}
                <p className="muted" style={{ marginTop: 16 }}>
                  目前顯示：<strong>{pack.label}試閱・{pack.unit}</strong>。也可以看
                  {(Object.keys(SAMPLES) as SampleTrack[])
                    .filter((k) => k !== track)
                    .map((k, i) => (
                      <span key={k}>
                        {i ? "、" : ""}
                        <Link href={`/sample?track=${k}#get`} className="u">
                          {SAMPLES[k].label}
                        </Link>
                      </span>
                    ))}
                  。
                </p>
                <div className="sample-downloads">
                  <a className="dl-card" href={pack.studentPdf} download={pack.studentName}>
                    <span className="kicker">PDF · {pack.studentPages} 頁</span>
                    <strong className="display">下載學生題本</strong>
                    <span className="muted">給孩子作答，不含答案</span>
                  </a>
                  <a className="dl-card" href={pack.parentPdf} download={pack.parentName}>
                    <span className="kicker">PDF · {pack.parentPages} 頁</span>
                    <strong className="display">下載{pack.parentTitle}</strong>
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
                <input type="hidden" name="track" value={track} />
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
                <label htmlFor="lead_grade">孩子年級（選填，會給對應的試閱）</label>
                <select id="lead_grade" name="grade" defaultValue={track === "gsat" ? "高三" : track === "sat" ? "SAT" : ""}>
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

          <section id="grades" aria-labelledby="grades-title" style={{ marginTop: 36, scrollMarginTop: 80 }}>
            <p className="kicker">範例題本</p>
            <h2 id="grades-title" className="display">
              各年級範例題本（約 5 題）
            </h2>
            <p className="muted">{GRADE_SAMPLES_NOTE}</p>
            <div className="grid-2" style={{ marginTop: 16 }}>
              {GRADE_SAMPLES.map((g) => (
                <article key={g.key} className="card">
                  <h3 style={{ marginTop: 0 }}>{g.label}</h3>
                  <p className="muted" style={{ margin: "0 0 4px" }}>
                    {g.unit}
                  </p>
                  <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                    範例題本，實際題本依孩子需求客製。
                  </p>
                  <div className="cta-row" style={{ marginTop: 12 }}>
                    <a className="btn btn-ink" href={g.student} download={`寬數週練範例題本-${g.label}-學生題本.pdf`}>
                      下載學生題本
                    </a>
                    <a className="btn btn-paper" href={g.parent} download={`寬數週練範例題本-${g.label}-家長解答.pdf`}>
                      下載家長解答
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="sample-grid" style={{ marginTop: 36 }}>
            <figure className="sample-card">
              <div className="sample-frame">
                <SampleImg pack={track === "gsat" ? "gsat" : "jh"} kind="student" alt={track === "gsat" ? "學測試閱學生題本第一頁" : "學生題本第一頁：本週觀念、數線圖與基礎題"} sizes="(max-width: 860px) calc(100vw - 64px), 400px" eager />
              </div>
              <figcaption>
                <strong>學生題本・第 1 頁</strong>
                <span className="muted">本週觀念＋數線圖 → 三關 15 題</span>
              </figcaption>
            </figure>
            <figure className="sample-card">
              <div className="sample-frame sample-frame--tilt">
                <SampleImg pack={track === "gsat" ? "gsat" : "jh"} kind="parent" alt={track === "gsat" ? "學測試閱家長解答第一頁" : "家長解答第一頁：答案速查與每題步驟說明"} sizes="(max-width: 860px) calc(100vw - 64px), 400px" />
              </div>
              <figcaption>
                <strong>家長解答・第 1 頁</strong>
                <span className="muted">答案速查＋每題步驟與常見錯誤</span>
              </figcaption>
            </figure>
          </div>

          <section id="subscribe" className="card next-step" style={{ marginTop: 36, scrollMarginTop: 80 }} aria-labelledby="next-step-title">
            {order ? (
              <div style={{ width: "100%" }}>
                <p className="kicker">已登記・待匯款</p>
                <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 8px" }}>
                  匯款開通「{order.display_name}」的週練
                </h2>
                <p className="price" style={{ margin: "0 0 8px" }}>
                  {SITE.currency}
                  {money(order.amount)}
                  <small>
                    {" "}
                    · {order.plan === "yearly" ? "年繳" : "月繳"} · 訂單 {order.id}
                  </small>
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>
                    {BANK_TRANSFER.bankName}（{BANK_TRANSFER.bankCode}）
                  </strong>
                  <br />
                  戶名：<strong>{BANK_TRANSFER.accountName}</strong>
                  <br />
                  帳號：<strong style={{ letterSpacing: "0.04em" }}>{BANK_TRANSFER.accountNumber}</strong>
                </p>
                <ol className="steps-list">
                  <li>完成匯款，備註填孩子稱呼或訂單編號</li>
                  <li>
                    把轉帳證明寄到 <a href={mailto} className="u">{BANK_TRANSFER.proofEmail}</a>
                  </li>
                  <li>確認入帳後約 1 個工作天開通，之後用 {order.email} 登入後台下載每週題本</li>
                </ol>
              </div>
            ) : canQuickSubscribe && !full ? (
              <div style={{ width: "100%" }}>
                <p className="kicker">看完試閱之後</p>
                <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 4px" }}>
                  覺得適合，直接匯款訂閱
                </h2>
                <p className="muted" style={{ margin: "0 0 12px", fontSize: 14 }}>
                  {SITE.currency}
                  {money(SITE.monthlyPrice)} /月，或年繳 {SITE.currency}
                  {money(SITE.yearlyPrice)}，每位孩子計價。{seat.text}
                  {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。用剛剛留的信箱登記，不用再收登入信。
                </p>
                {error && one(sp.error).includes("孩子") ? (
                  <p className="banner warn" role="alert">
                    {error}
                  </p>
                ) : null}
                <form action={startSampleCheckout} className="form">
                  <label htmlFor="sub_name">孩子稱呼*</label>
                  <input id="sub_name" name="display_name" required maxLength={40} autoComplete="off" placeholder="例如：安安" />
                  <label htmlFor="sub_grade">年級*</label>
                  <select id="sub_grade" name="grade" required defaultValue={leadGradeDefault}>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                  <label htmlFor="sub_target">應考目標</label>
                  <input id="sub_target" name="exam_target" maxLength={200} placeholder="例如：學測數A、段考、SAT" />
                  <label htmlFor="sub_plan">方案*</label>
                  <select id="sub_plan" name="plan" required defaultValue="monthly">
                    <option value="monthly">{`月繳 ${SITE.currency}${money(SITE.monthlyPrice)} /月`}</option>
                    <option value="yearly">{`年繳 ${SITE.currency}${money(SITE.yearlyPrice)} /年（省 ${SITE.currency}${money(SITE.monthlyPrice * 12 - SITE.yearlyPrice)}）`}</option>
                  </select>
                  <button className="btn btn-ink" type="submit">
                    看匯款帳號
                  </button>
                  <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                    送出即表示已閱讀 <Link href="/privacy" className="u">隱私權政策</Link>。校內進度、弱點單元之後可在後台補。
                  </p>
                </form>
              </div>
            ) : (
              <>
                <div>
                  <p className="kicker">看完試閱之後</p>
                  <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 4px" }}>
                    覺得適合，就為孩子訂閱週練
                  </h2>
                  <p className="price">
                    {SITE.currency}
                    {money(SITE.monthlyPrice)}
                    <small> /月 · 每位孩子</small>
                  </p>
                  <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                    或年繳 {SITE.currency}
                    {money(SITE.yearlyPrice)}。{seat.text}
                    {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。
                  </p>
                  <ol className="steps-list">
                    <li>{unlocked ? "用信箱登入（不設密碼）" : "先在上面留信箱領試閱"}</li>
                    <li>填孩子年級與應考目標</li>
                    <li>匯款後寄證明，約 1 個工作天開通</li>
                  </ol>
                </div>
                <div className="cta-row" style={{ marginTop: 0 }}>
                  {full ? (
                    <Link href="/waitlist" className="btn btn-ink">
                      名額已滿，加入候補
                    </Link>
                  ) : unlocked ? (
                    <Link href="/login?next=/subscribe" className="btn btn-ink">
                      為孩子訂閱週練
                    </Link>
                  ) : (
                    <a href="#get" className="btn btn-ink">
                      先領試閱
                    </a>
                  )}
                  <Link href="/#pricing" className="btn btn-paper">
                    看方案細節
                  </Link>
                </div>
              </>
            )}
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
        </div>
      </main>
      <Footer />
    </>
  );
}

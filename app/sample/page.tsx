import { YearlyGuard } from "@/components/YearlyGuard";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialDm } from "@/components/SocialDm";
import { SampleImg } from "@/components/SampleImg";
import { ShareToParents } from "@/components/ShareToParents";
import { SamplePdfLink, TrackView } from "@/components/Tracking";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getParent } from "@/lib/auth";
import { startSampleCheckout, submitSampleLead, submitScopeChoice } from "@/app/actions/lead";
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
import { getDb } from "@/lib/db";
import { SCOPE_GRADES, SCOPE_OPTIONS, packsForGrade, trialActive, trialEndLabel, trialToken, isTrialLead } from "@/lib/trial";
import { cachedSeatsRemaining } from "@/lib/seats";
import { TierPrices } from "@/components/TierPrices";
import { FirstTouchSrcFill } from "@/components/FirstTouch";
import { SubscribeGradeOptions } from "@/components/GradeOptions";
import { NeedsField } from "@/components/NeedsField";
import { NEEDS_LABEL, NEEDS_HINT, NEEDS_MAX, START_NOTE, BANK_TRANSFER, GRADE_OPTIONS, SAMPLE, SAMPLES, SITE, SOCIAL, seatLabel, money, startByNote, FREE_WEEK_RULE, PRICE_RULE, PAY_NOTE, PLAN_MONTHLY_LABEL, PLAN_YEARLY_LABEL, YEARLY_NOTE, FIRST_WEEK_CONTENT } from "@/lib/config";

export const metadata: Metadata = {
  title: "免費題本試閱｜寬數週練・國中、高中數學每週練習",
  description: "留下信箱，依孩子年級免費下載寬數週練試閱：國中段考、高中學測必錯題、SAT Math。吳寬老師出題，家長解答含步驟拆解。訂閱第一週免費。",
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
  const scope = one(sp.scope);
  const scopeMsg =
    scope === "sent"
      ? "已寄出，請到信箱收信。沒看到的話請看一下垃圾郵件匣。"
      : scope === "manual"
        ? "收到了，老師會親自回信給您這個範圍的題本。"
        : scope === "preview"
          ? "這是預覽版，不會寄信給任何人。正式站選完會自動寄出。"
          : scope === "fail"
            ? "寄送時出了點問題，請稍後再按一次，或直接寫信給老師。"
            : scope === "err"
              ? "請選年級和範圍。"
              : "";
  const parent = await getParent();
  const jar = await cookies();
  const unlocked = jar.get(LEAD_COOKIE)?.value === "1" || Boolean(parent);
  const justUnlocked = unlocked && one(sp.ok) === "1";
  const remaining = await cachedSeatsRemaining();
  const full = remaining <= 0;
  const seat = seatLabel(remaining);
  const startBy = startByNote();
  const track: SampleTrack = cleanTrack(one(sp.track)) || cleanTrack(jar.get(LEAD_TRACK_COOKIE)?.value) || "jh";
  const pack = SAMPLES[track];
  const leadId = jar.get(LEAD_ID_COOKIE)?.value ?? "";
  const canQuickSubscribe = unlocked && Boolean(leadId) && !parent;
  // 7 天完整試用：TRIAL_START 之後留信箱、年級有對應試用包的人才有。
  let trial: { end: string; active: boolean; token: string; packs: ReturnType<typeof packsForGrade> } | undefined;
  if (unlocked && leadId) {
    const lrow = (await (await getDb()).prepare("SELECT id, grade, created_at FROM leads WHERE id = ?").get(leadId)) as
      | { id: string; grade: string; created_at: string }
      | undefined;
    if (lrow && isTrialLead(lrow)) {
      trial = { end: trialEndLabel(lrow.created_at), active: trialActive(lrow), token: trialToken(lrow.id), packs: packsForGrade(lrow.grade) };
    }
  }
  const tradeParam = one(sp.trade).slice(0, 40);
  let order: { id: string; plan: string; amount: number; display_name: string; email: string; grade: string } | undefined;
  if (tradeParam && jar.get(LEAD_TRADE_COOKIE)?.value === tradeParam) {
    const db = await getDb();
    order = (await db
      .prepare(
        `SELECT c.id, c.plan, c.amount, ch.display_name, ch.grade, p.email FROM checkout_attempts c
         JOIN children ch ON ch.id = c.child_id JOIN parents p ON p.id = c.parent_id WHERE c.id = ?`,
      )
      .get(tradeParam)) as typeof order;
  }
  // 高三、SAT 訂閱尚未開放，預設回國一（選項已停用）
  const leadGradeDefault = "國一";
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
      {/* 只算進入：表單送出後的回跳（ok／error／trade／scope／lead）不重複計數 */}
      {!one(sp.ok) && !error && !tradeParam && !scope && !one(sp.lead) && (
        <Suspense fallback={null}>
          <TrackView kind="sample_view" />
        </Suspense>
      )}
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <p className="sample-top-link">
            <Link href="/videos-practice?src=sample-top" className="u">只想找影片的免費練習題？點這裡</Link>
          </p>
          <p className="kicker">題本試閱 · 第一週免費</p>
          <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 44px)", margin: "8px 0 12px" }}>
            領題本試閱
          </h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            留下信箱並選孩子年級：<strong>國一、國二、國三、高三</strong>可以領第一週免費的完整題本（7 天）：學生題本 15 題＋家長解答，每題有步驟和常見錯誤。國一、國二是第二次段考範圍；國三有圓和相似形兩份；高三有學測數A、數B 各一份。下載連結也會寄到信箱，從留信箱那天算起，第 7 天晚上 11:59 關閉。
          </p>
          <p className="muted" style={{ maxWidth: 620 }}>
            <strong>高一、高二</strong>目前是學測必錯 5 題試閱（檔案標示為高三學測版，內容：對數、向量、條件機率、數列、餘弦定理），不是完整一週題本；<strong>SAT</strong> 是 Digital SAT Math 講義第 1 章與解答本。這兩種試閱不會關閉。A4 可以直接列印給孩子寫。
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
                {trial ? (
                  <div className="card" style={{ marginTop: 20 }}>
                    <p className="kicker">第一週免費 · {trial.active ? `${trial.end}晚上 11:59 關閉` : `已在 ${trial.end}關閉`}</p>
                    {trial.active ? (
                      <>
                        <h2 className="display" style={{ fontSize: 22, margin: "4px 0 8px" }}>完整一週題本，依孩子年級</h2>
                        <p className="muted" style={{ margin: "0 0 12px" }}>每份都是 15 題（基礎、常考、進階）＋家長解答。連結也寄到你的信箱了，請在關閉前下載或列印。</p>
                        <div className="sample-downloads">
                          {trial.packs.flatMap((p) =>
                            (["student", "parent"] as const).map((k) => (
                              <a key={`${p.id}-${k}`} className="dl-card" href={`/trial/${trial!.token}/${p.id}-${k}.pdf`} target="_blank" rel="noopener">
                                <span className="kicker">PDF · {k === "student" ? p.studentPages : p.parentPages} 頁 · {p.label}</span>
                                <strong className="display">{k === "student" ? "學生題本" : "家長解答"}</strong>
                                <span className="muted">{p.unit}</span>
                              </a>
                            )),
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="muted" style={{ margin: "4px 0 0" }}>第一週免費的下載已經結束。下面的公開試閱還是可以看。</p>
                    )}
                  </div>
                ) : null}
                <div className="sample-downloads">
                  <SamplePdfLink className="dl-card" href={pack.studentPdf} download={pack.studentName} target={`${track}-student`} src={src}>
                    <span className="kicker">PDF · {pack.studentPages} 頁</span>
                    <strong className="display">下載學生題本</strong>
                    <span className="muted">給孩子作答，不含答案</span>
                  </SamplePdfLink>
                  <SamplePdfLink className="dl-card" href={pack.parentPdf} download={pack.parentName} target={`${track}-parent`} src={src}>
                    <span className="kicker">PDF · {pack.parentPages} 頁</span>
                    <strong className="display">下載{pack.parentTitle}</strong>
                    <span className="muted">孩子寫完再打開對答</span>
                  </SamplePdfLink>
                </div>
                <div className="card parent-guide" style={{ marginTop: 20 }}>
                  <p className="kicker">家長怎麼用解答</p>
                  <h2 className="display" style={{ fontSize: 22, margin: "4px 0 4px" }}>不用會數學，照這 4 步就好</h2>
                  <ol>
                    <li>把學生題本印給孩子，請他自己寫，不要先看解答。</li>
                    <li>寫完打開{pack.parentTitle}，第一頁是答案速查，先對對錯。</li>
                    <li>錯的題目看該題的步驟拆解，請孩子講給你聽，講不出來的那一步就是卡住的地方。</li>
                    <li>每題附常見錯誤，對照看孩子是觀念不懂還是粗心，下週題本會針對這裡加練。</li>
                  </ol>

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
                <input type="hidden" name="src" value={src || cleanSrc(jar.get("kw_ft_src")?.value)} />
                <FirstTouchSrcFill />
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

          <ShareToParents path={`/sample?track=${track}`} />

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

          {unlocked && !order ? (
            <section id="subscribe" className="card next-step" style={{ marginTop: 36, scrollMarginTop: 80 }} aria-labelledby="next-step-title">
              <div style={{ width: "100%" }}>
                <p className="kicker">看完試閱之後</p>
                <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 8px" }}>
                  選範圍，寄題本到信箱
                </h2>
                {scopeMsg ? (
                  <p role="status" style={{ margin: "0 0 12px", fontWeight: 600 }}>{scopeMsg}</p>
                ) : (
                  <p style={{ margin: "0 0 12px" }}>選孩子的年級和這次段考範圍，有對應的週練包（國一、國三、高三）會馬上寄到您留的信箱，學生題本和家長解答都有。這和上方第一週免費是同一份題本，只是用信箱寄一份給您，不會再多一份；其他範圍由老師親自回信。</p>
                )}
                {scope !== "sent" && scope !== "manual" && (
                  <form action={submitScopeChoice} className="form scope-form">
                    <label>
                      年級
                      <select name="scope_grade" required defaultValue="">
                        <option value="" disabled>請選擇</option>
                        {SCOPE_GRADES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      段考／學測範圍
                      <select name="scope" required defaultValue="">
                        <option value="" disabled>請選擇</option>
                        {SCOPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      補充（選填，例如學校進度）
                      <input name="scope_note" maxLength={200} />
                    </label>
                    <button type="submit" className="btn btn-ink">寄到我的信箱</button>
                  </form>
                )}
              </div>
            </section>
          ) : (
          <section id="subscribe" className="card next-step" style={{ marginTop: 36, scrollMarginTop: 80 }} aria-labelledby="next-step-title">
            {order ? (
              <div style={{ width: "100%" }}>
                <p className="kicker">已登記・待匯款</p>
                <h2 id="next-step-title" className="display" style={{ fontSize: 24, margin: "4px 0 8px" }}>
                  匯款開通「{order.display_name}」的週練
                </h2>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{PAY_NOTE}</p>
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
                  {PRICE_RULE}。{YEARLY_NOTE}（{SITE.currency}
                  {money(SITE.yearlyPrice)} /年）。{seat.text}
                  {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。{startBy ? `${startBy}。` : ""}{START_NOTE}用剛剛留的信箱登記，不用再收登入信。
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
                    <SubscribeGradeOptions />
                  </select>
                  <NeedsField gradeId="sub_grade" id="sub_needs" label={NEEDS_LABEL} hint={NEEDS_HINT} max={NEEDS_MAX} />
                  <label htmlFor="sub_target">應考目標</label>
                  <input id="sub_target" name="exam_target" maxLength={200} placeholder="例如：學測數A、段考、SAT" />
                  <label htmlFor="sub_plan">方案*</label>
                  <select id="sub_plan" name="plan" required defaultValue="monthly">
                    <option value="monthly">{PLAN_MONTHLY_LABEL}</option>
                    <option value="yearly">{PLAN_YEARLY_LABEL}</option>
                  </select>
<YearlyGuard gradeId="sub_grade" planId="sub_plan" />
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
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>{FREE_WEEK_RULE}：</p>
                  <TierPrices />
                  <p className="muted" style={{ margin: "0 0 6px", fontSize: 14 }}>
                    年繳目前只適用國中（{SITE.currency}
                    {money(SITE.yearlyPrice)} /年）；小學、高中與 SAT 目前只有月繳。
                  </p>
                  <p className="muted" style={{ margin: "0 0 6px", fontSize: 14 }}>{FIRST_WEEK_CONTENT}</p>
                  <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                    {seat.text}
                    {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。
                    {startBy ? `${startBy}。` : ""}
                  </p>
                  <ol className="steps-list">
                    <li>{unlocked ? "用信箱登入（不設密碼）" : "先在上面留信箱領試閱"}</li>
                    <li>填孩子年級與應考目標</li>
                    <li>匯款後寄證明，約 1 個工作天開通</li>
                  </ol>
                  <p className="muted" style={{ margin: "8px 0 0", fontSize: 14 }}>{PAY_NOTE}</p>
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
          )}

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

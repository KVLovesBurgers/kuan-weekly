import Link from "next/link";
import { Suspense } from "react";
import { StudentHero } from "@/components/StudentHero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { LiteYouTube } from "@/components/LiteYouTube";
import { InstagramIcon, SocialDm } from "@/components/SocialDm";
import { SampleImg } from "@/components/SampleImg";
import { DiagCta } from "@/components/DiagCta";
import { cachedSeatsRemaining } from "@/lib/seats";
import { TierPrices } from "@/components/TierPrices";
import { CLOSED_TIERS, CLOSED_MSG, START_NOTE, MIN_MONTHLY, FIRST_WEEK_CONTENT, GSAT_DATE, gsatDaysLeft, PRICE_RULE, TIER_PRICES, YEARLY_NOTE, SAMPLE, SAT_BOOK, SHORTS, SITE, SOCIAL, seatCap, seatLabel, money } from "@/lib/config";

// 行銷首頁改 ISR：邊緣快取、每 5 分鐘背景重算一次；後台開席時 revalidatePath("/") 會立即更新。
export const revalidate = 300;

function CtaPair({ full }: { full: boolean }) {
  return (
    <div className="cta-row">
      <Link href="/sample" className="btn btn-ink">
        免費看題本試閱
      </Link>
      {full ? (
        <Link href="/waitlist" className="btn btn-paper">
          名額已滿，加入候補
        </Link>
      ) : (
        <Link href="/login?next=/subscribe" className="btn btn-paper">
          為孩子訂閱週練
        </Link>
      )}
    </div>
  );
}

const offersLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE.name,
  url: SITE.url,
  makesOffer: [
    ...(Object.keys(TIER_PRICES) as (keyof typeof TIER_PRICES)[]).map((k) => ({
      "@type": "Offer",
      name: `寬數週練｜按月｜${TIER_PRICES[k].label}（${TIER_PRICES[k].grades}）`,
      price: TIER_PRICES[k].monthly,
      priceCurrency: "TWD",
      availability: CLOSED_TIERS.includes(k) ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url: `${SITE.url}/#pricing`,
    })),
    {
      "@type": "Offer",
      name: "寬數週練｜按年（目前只適用國中）",
      price: SITE.yearlyPrice,
      priceCurrency: "TWD",
      url: `${SITE.url}/#pricing`,
    },
  ],
};

export default async function HomePage() {
  const remaining = await cachedSeatsRemaining();
  const full = remaining <= 0;
  const seat = seatLabel(remaining);
  const daysLeft = gsatDaysLeft();
  const yearlySave = SITE.monthlyPrice * 12 - SITE.yearlyPrice;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersLd) }} />
      <Header />
      <main id="main">
        <Suspense fallback={null}>
          <StudentHero />
        </Suspense>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="kicker">吳寬老師 · 交大應數 · 學測、SAT 數學老師</p>
              <p className="countdown-chip" title={`116 學年度學測 ${GSAT_DATE.slice(0, 10)} 起`}>
                距離 116 學測（2027/1/22）還有 <strong>{daysLeft}</strong> 天
              </p>
              <h1 className="display">寬數週練</h1>
              <p className="promise display">
                每週把必錯題
                <br />
                練到不錯。
              </p>
              <p className="sub hero-sub">
                每週一份學生題本＋一份家長解答。家長不用會數學，照著解答就能對答案、看出孩子卡在哪。國中跟段考、高一高二打基礎、高三衝學測，SAT 也可以排。
              </p>
              <p className="sub hero-sub" style={{ marginTop: 8 }}>
                <strong>成效一例：學測數學 11 級到分科 58 級。</strong>
              </p>
              <div className="cta-row" style={{ marginTop: 28 }}>
                <Link href="/sample?track=gsat" className="btn btn-steel btn-lg">
                  免費下載學測試閱
                </Link>
                <a href="#pricing" className="btn btn-ghost btn-lg">
                  看方案與匯款方式
                </a>
              </div>
              <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
                留信箱即可下載，國中、SAT 也有對應試閱。
              </p>
              <p className="hero-price">
                <strong>
                  {SITE.currency}
                  {money(MIN_MONTHLY)}
                </strong>{" "}
                /月起・每位孩子，第一週免費
                <span className="hero-price-sep" aria-hidden="true">
                  ｜
                </span>
                <span className="nowrap">小學 {money(TIER_PRICES.elementary.monthly)}・國中 {money(TIER_PRICES.junior.monthly)}・高中 {money(TIER_PRICES.senior.monthly)}・SAT {money(TIER_PRICES.sat.monthly)}（高中、SAT 即將開放）</span>
              </p>
              <p className="seat-chip">
                {seat.text}
                {seat.remaining !== null ? (
                  <>
                    {" "}
                    <strong>{seat.remaining}</strong> 名
                  </>
                ) : null}
              </p>
            </div>
            <Link href="/sample?track=gsat" className="hero-preview" aria-label="免費下載學測試閱：高三學測必錯 5 題">
              <span className="hero-preview-page hero-preview-page--back" aria-hidden="true">
                <SampleImg kind="parent" pack="gsat" alt="" sizes="300px" />
              </span>
              <span className="hero-preview-page">
                <SampleImg
                  kind="student"
                  pack="gsat"
                  alt="寬數週練學測試閱學生題本第一頁：高三學測必錯 5 題"
                  sizes="340px"
                />
              </span>
              <span className="hero-preview-tag">學測試閱・高三必錯 5 題</span>
            </Link>
          </div>
          <div className="wrap stats">
            <div>
              <strong className="display">跟學校進度</strong>
              <span className="sub">依年級、版本與段考範圍出題</span>
            </div>
            <div>
              <strong className="display">兩份 PDF</strong>
              <span className="sub">學生題本＋家長解答，按孩子計價</span>
            </div>
            <div>
              <strong className="display">限 {seatCap()} 名</strong>
              <span className="sub">{seat.short === `限 ${seatCap()} 名` ? "依名額收，不超量" : seat.short}</span>
            </div>
          </div>
        </section>

        <section className="diag-band" aria-label="免費段考弱點檢測">
          <div className="wrap">
            <DiagCta src="home-diag" variant="banner" />
          </div>
        </section>

        <section id="path" className="section">
          <div className="wrap">
            <p className="kicker">三步看懂適不適合</p>
            <h2 className="display">免費練習題 → 試閱 → 方案</h2>
            <div className="path-steps">
              <div className="card">
                <span className="path-no">第 1 步</span>
                <strong className="display">免費練習題</strong>
                <span className="muted">依單元整理，卡在哪個單元就從那裡開始練，每份都有題目和逐步詳解。</span>
                <Link href="/units" className="u">依單元找練習題</Link>
                <Link href="/videos-practice" className="u">看完影片？用影片編號找題目</Link>
              </div>
              <div className="card">
                <span className="path-no">第 2 步</span>
                <strong className="display">一週試閱</strong>
                <span className="muted">留信箱下載學生題本＋家長解答，實際寫一週看看。</span>
                <Link href="/sample" className="u">領題本試閱</Link>
              </div>
              <div className="card">
                <span className="path-no">第 3 步</span>
                <strong className="display">方案</strong>
                <span className="muted">覺得適合再訂閱，按孩子計價，匯款後約 1 個工作天開通。</span>
                <a href="#pricing" className="u">看方案與匯款方式</a>
              </div>
            </div>
            <p className="muted" style={{ marginTop: 16 }}>
              高三準備學測？<Link href="/quiz" className="u">免費學測數學模擬測驗</Link>，數A、數B 各 10 題，交卷後看分數和弱點單元。
            </p>
          </div>
        </section>

        <section id="samples" className="section">
          <div className="wrap">
            <p className="kicker">題本試閱</p>
            <h2 className="display">每週兩份 PDF 長這樣</h2>
            <p className="muted" style={{ maxWidth: 580 }}>
              下圖是國中真實一週（{SAMPLE.unit}）；學測與 SAT 另有對應試閱。訂閱後會依孩子年級、校內進度與弱點單元調整，不是固定同一本。
            </p>
            <div className="sample-grid" style={{ marginTop: 28 }}>
              <figure className="sample-card">
                <div className="sample-frame">
                  <SampleImg kind="student" alt="寬數週練學生題本試閱頁：國一正負數與數線，本週觀念與練習題" />
                </div>
                <figcaption>
                  <strong>學生題本</strong>
                  <span className="muted">先讀本週觀念再作答；這份沒有答案</span>
                </figcaption>
              </figure>
              <figure className="sample-card">
                <div className="sample-frame sample-frame--tilt">
                  <SampleImg kind="parent" alt="寬數週練家長解答試閱頁：每題答案與步驟說明" />
                </div>
                <figcaption>
                  <strong>家長解答</strong>
                  <span className="muted">每題答案＋步驟拆解，對完再回饋難度</span>
                </figcaption>
              </figure>
            </div>
            <p className="muted" style={{ marginTop: 24 }}>依孩子年級選一份免費試閱：</p>
            <div className="cta-row sample-tracks">
              <Link href="/sample?track=jh&src=home-samples#get" className="btn btn-paper">
                國中試閱
              </Link>
              <Link href="/sample?track=gsat&src=home-samples#get" className="btn btn-ink">
                學測試閱
              </Link>
              <Link href="/sample?track=sat&src=home-samples#get" className="btn btn-paper">
                SAT 試閱
              </Link>
              <SocialDm />
            </div>
          </div>
        </section>

        <section id="videos" className="section ink-panel">
          <div className="wrap">
            <p className="kicker">畫圖一眼懂</p>
            <h2 className="display">看吳寬老師怎麼教</h2>
            <p className="sub" style={{ maxWidth: 600 }}>
              YouTube「{SOCIAL.youtubeName}」的短影片：一個觀念、一張圖。週練的家長解答也照這個方式寫——先把觀念拆開，再算。
            </p>
            <div className="shorts-grid" style={{ marginTop: 28 }}>
              {SHORTS.map((v) => (
                <LiteYouTube key={v.id} id={v.id} title={v.title} note={v.note} />
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-ghost" href={SOCIAL.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
                到 YouTube 看更多「畫圖一眼懂」
              </a>
            </p>
          </div>
        </section>

        <section id="teacher" className="section">
          <div className="wrap" style={{ maxWidth: 720 }}>
            <p className="kicker">吳寬老師｜寬數</p>
            <h2 className="display">誰在出題</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              陽明交大應用數學系畢業。現任國中數學教師，曾任菁英國際 SAT 數學老師，也是梭羅國際教育 AMC 競賽數學老師；Stanford OHS（史丹佛線上高中）官方授權監考官，並指導該校學生數學。週練是講義方案：每週兩份
              PDF，不提供 LINE 即時答題。
            </p>
            <p className="muted">學生案例：精誠高中學測數學 11 級到分科 58 級。更多經歷請看個人頁。</p>
            <p style={{ marginTop: 20 }}>
              <a className="btn btn-paper" href={SITE.oneOnOneUrl}>
                認識吳寬老師
              </a>
            </p>
          </div>
        </section>

        <section id="how" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <p className="kicker">01</p>
            <h2 className="display">一週怎麼走完</h2>
            <p className="muted" style={{ maxWidth: 560 }}>
              題做完，答案在家長那份 PDF；老師用你填的三欄回饋（偏易／剛好／偏難）決定下一週要不要加碼或放慢。
            </p>
            <div className="grid-3" style={{ marginTop: 28 }}>
              {[
                [
                  "週一出題",
                  "依孩子年級、校內進度、應考目標與弱點單元出該週題本，把段考常錯的題型排進來。",
                ],
                ["孩子作答", "學生 PDF 可列印或平板作答。先讀本週觀念，提示寫在題下，不把解答混進去。"],
                ["家長對答＋回饋", "家長 PDF 含步驟拆解。填難度、完成度、卡關單元，三欄就夠。"],
              ].map(([t, d], i) => (
                <article className="card" key={t}>
                  <p className="kicker">0{i + 1}</p>
                  <h3>{t}</h3>
                  <p className="muted">{d}</p>
                </article>
              ))}
            </div>
            <CtaPair full={full} />
          </div>
        </section>

        <section className="section ink-panel">
          <div className="wrap">
            <p className="kicker">02</p>
            <h2 className="display">出題會看的四件事</h2>
            <p className="sub" style={{ maxWidth: 560 }}>
              訂閱時先填，之後可在家長後台改。
            </p>
            <div className="grid-2" style={{ marginTop: 28 }}>
              {[
                ["年級", "以國一到高三為主；小學與 SAT Math 也收。題距與符號習慣跟著學制走。"],
                ["校內進度", "例如「翰林版二次函數剛結束，下一章指數對數」。"],
                ["應考目標", "自由填寫，例如跟上段考、會考、學測，或目前想把哪個單元寫穩。"],
                ["弱點單元", "三角恆等式、向量內積、一元二次、應用題列式……寫孩子真正卡住的名字。"],
              ].map(([t, d]) => (
                <article className="card" key={t}>
                  <h3>{t}</h3>
                  <p className="sub">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="wrap">
            <p className="kicker">03</p>
            <h2 className="display">方案</h2>
            <p className="muted">
              一位孩子一份週練。{PRICE_RULE}。{START_NOTE}{CLOSED_MSG}第二個孩子再加一席。目前以匯款開通；轉帳證明寄到老師信箱，確認後開席。
            </p>
            <p className="muted" style={{ fontSize: 14 }}>{FIRST_WEEK_CONTENT}</p>
            <div className="grid-2" style={{ marginTop: 28 }}>
              <article className="card">
                <p className="kicker">按月</p>
                <TierPrices />
                <p className="muted">第一週免費，從第二週起才開始計算一個月，依孩子年級計價。要停用請寄信 {SITE.contactEmail}。</p>
              </article>
              <article className="card">
                <p className="kicker">按年（目前只適用國中）</p>
                <p className="price">
                  {SITE.currency}
                  {money(SITE.yearlyPrice)}
                  <small> /年 · 每名孩子</small>
                </p>
                <p className="muted">對準完整學年的每週進度。年繳目前只適用國中；小學、高中與 SAT 目前只有月繳。</p>
                <p className="savings-note">
                  國中月繳一年 {SITE.currency}
                  {money(SITE.monthlyPrice * 12)} → 年繳 {SITE.currency}
                  {money(SITE.yearlyPrice)}，省 {SITE.currency}
                  {money(yearlySave)}
                </p>
              </article>
            </div>
            <div className="cta-row">
              {full ? (
                <Link href="/waitlist" className="btn btn-ink">
                  名額已滿，登記候補
                </Link>
              ) : (
                <Link href="/login?next=/subscribe" className="btn btn-ink">
                  開始訂閱
                </Link>
              )}
              <Link href="/sample" className="btn btn-paper">
                先看題本試閱
              </Link>
            </div>
          </div>
        </section>

        <section id="sat" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap card sat-card">
            <div>
              <p className="kicker">另一份講義</p>
              <h2 className="display" style={{ fontSize: 26, margin: "6px 0 8px" }}>
                準備 Digital SAT？完整數學講義
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                21 章觀念練習本＋解答本＋2 套模考與附錄，題目全部原創，英文原題搭配中文詳解。電子 PDF，NT${money(SAT_BOOK.price)}。講義是另外販售的一次性商品，和 SAT 週練每月 NT${money(TIER_PRICES.sat.monthly)} 是分開的。
                可以先<Link href="/sample?track=sat&src=home-sat#get">免費下載第 1 章試閱</Link>，或到 IG {SOCIAL.handle}、臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.satKeyword}」。
              </p>
            </div>
            <SocialDm keyword={SOCIAL.satKeyword} />
          </div>
        </section>

        <section id="faq" className="section faq">
          <div className="wrap">
            <p className="kicker">04</p>
            <h2 className="display">常見問題</h2>
            {(
              [
                ["可以先看題本嗎？", "sample"],
                [
                  "適合哪些年級？",
                  "以國一到高三為主（段考、會考、學測／分科）。小學與 SAT Math 也可依程度排題，訂閱時選年級即可。",
                ],
                [
                  "有 LINE 或線上問答嗎？",
                  "本站是週練包：出題＋解答，不提供 LINE 即時答題。想先問問題，可寄信 " +
                    SITE.contactEmail +
                    "，或到 IG " +
                    SOCIAL.handle +
                    " 或臉書粉專「" +
                    SOCIAL.facebookName +
                    "」私訊。",
                ],
                [
                  "為什麼要兩份 PDF？",
                  "學生題本避免一眼瞄到答案；家長對完之後才打開解答，並用三欄回饋告訴老師這週是偏易、剛好，還是偏難。",
                ],
                [
                  "會出 SAT 嗎？",
                  "會。SAT 週練即將開放，目前先留信箱（開放後月費 NT$" + money(TIER_PRICES.sat.monthly) + "，第一週免費）：題目英文、解答中文講解，對準 Digital SAT。另有 Digital SAT 完整數學講義，是另外販售的一次性電子 PDF，不是週練訂閱（21 章＋2 套模考，電子 PDF，NT$" +
                    money(SAT_BOOK.price) +
                    "），第 1 章可免費試閱，購買請私訊「" +
                    SOCIAL.satKeyword +
                    "」。",
                ],
                ["名額滿了怎麼辦？", `限 ${seatCap()} 名，額滿後改候補。老師從後台看到候補名單後再通知開席。`],
                ["匯款後多久開通？", "通常 1 個工作天內開通。請把轉帳證明寄到 " + SITE.contactEmail + "。"],
                [
                  "每週什麼時候出題？",
                  "通常每週一前後固定出題。開通後下一週起算；若當週已發布，開通後即可下載已發布週次。",
                ],
                ["第一週真的免費嗎？什麼時候開始收費？", PRICE_RULE + "。" + START_NOTE + YEARLY_NOTE + "；小學、高中與 SAT 目前只有月繳。" + CLOSED_MSG + FIRST_WEEK_CONTENT],
                ["怎麼停用？已匯款能退嗎？", "要停用請寄信即可。已匯款的當期不退，請開通前確認方案。"],
                ["第二個孩子怎麼訂？同帳號可以嗎？", "第二個孩子再訂一席。同一家長帳號可掛多名孩子。"],
                ["個資怎麼用？", "privacy"],
              ] as const
            ).map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                {a === "privacy" ? (
                  <p className="muted">
                    用途說明見{" "}
                    <Link href="/privacy" className="u">
                      隱私權政策
                    </Link>
                    。
                  </p>
                ) : a === "sample" ? (
                  <p className="muted">
                    可以，不用登入。到{" "}
                    <Link href="/sample" className="u">
                      題本試閱頁
                    </Link>{" "}
                    直接下載一週的學生題本與家長解答；也可以到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「
                    {SOCIAL.weeklyKeyword}」領試閱。
                  </p>
                ) : (
                  <p className="muted">{a}</p>
                )}
              </details>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap card final-cta">
            <Logo size={40} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 className="display" style={{ margin: 0, fontSize: 28 }}>
                先看一份真的題本
              </h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                留個信箱就能下載試閱；有問題到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.weeklyKeyword}」。
              </p>
            </div>
            <div className="cta-row" style={{ marginTop: 0 }}>
              <Link href="/sample" className="btn btn-ink">
                免費看題本試閱
              </Link>
              <SocialDm compact />
            </div>
          </div>
        </section>

        <section id="gsat-mock" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap card sat-card">
            <div>
              <p className="kicker">學測考前</p>
              <h2 className="display" style={{ fontSize: 22, margin: "6px 0 8px" }}>
                學測數學考前猜題卷
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                數A、數B 各三回，依 111–115 學測的命題分布原創設計。
                <br />
                題型、題數、作答時間和正式考試相同，每回附完整詳解與答題卷。
                <br />
                加贈該科的命題分析報告，PDF 電子檔。
              </p>
            </div>
            <div className="dm-row">
              <a className="btn btn-paper" href="https://instagram.com/saber_math" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
                IG 私訊詢問
                <span className="sr-only">（Instagram @saber_math，另開新分頁）</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

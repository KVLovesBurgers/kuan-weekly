import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { LiteYouTube } from "@/components/LiteYouTube";
import { SocialDm } from "@/components/SocialDm";
import { getParent } from "@/lib/auth";
import { seatsRemaining } from "@/lib/db";
import { DEMO_PARENT_EMAIL, SAMPLE, SHORTS, SITE, SOCIAL, seatCap, seatLabel } from "@/lib/config";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const parent = await getParent();
  const remaining = await seatsRemaining();
  const full = remaining <= 0;
  const seat = seatLabel(remaining);
  const yearlySave = SITE.monthlyPrice * 12 - SITE.yearlyPrice;

  return (
    <>
      <Header parentEmail={parent?.email} />
      <main id="main">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="kicker">吳寬老師 · 國中・高中數學週練</p>
              <h1 className="display">寬數週練</h1>
              <p className="promise display">
                跟著學校進度，
                <br />
                每週練必錯題，
                <br />
                畫圖把觀念講懂。
              </p>
              <p className="sub hero-sub">
                給國中、高中孩子的每週數學題本：一份學生題本（不含答案）＋一份家長解答（步驟拆解）。小學與 SAT Math
                也可依程度排題。
              </p>
              <div className="cta-row" style={{ marginTop: 28 }}>
                <Link href="/sample" className="btn btn-steel btn-lg">
                  免費看題本試閱
                </Link>
                <a href="#pricing" className="btn btn-ghost btn-lg">
                  看方案
                </a>
              </div>
              <p className="sub" style={{ marginTop: 14, fontSize: 14 }}>
                或到{" "}
                <a className="u" href={SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer">
                  IG
                </a>{" "}
                {SOCIAL.handle} 或{" "}
                <a className="u" href={SOCIAL.facebookUrl} target="_blank" rel="noopener noreferrer">
                  臉書粉專「{SOCIAL.facebookName}」
                </a>{" "}
                私訊「{SOCIAL.weeklyKeyword}」領題本試閱
              </p>
              <p className="seat-chip" style={{ marginTop: 20 }}>
                {seat.text}
                {seat.remaining !== null ? (
                  <>
                    {" "}
                    <strong>{seat.remaining}</strong> 名
                  </>
                ) : null}
              </p>
            </div>
            <div className="orbit" aria-hidden="true">
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <circle cx="160" cy="160" r="108" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
                <circle cx="160" cy="160" r="72" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
                <path d="M28 160h264M160 28v264" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                <path d="M160 160 L256 160 A96 96 0 0 0 160 64" fill="none" stroke="#8a9bb0" strokeWidth="1.8" />
                <path d="M160 160 L228 160 L228 92 Z" fill="#8a9bb0" opacity="0.16" />
                <circle cx="256" cy="160" r="4" fill="currentColor" />
                <circle cx="160" cy="64" r="4" fill="currentColor" />
                <circle cx="160" cy="160" r="3" fill="currentColor" />
                <text x="160" y="22" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">
                  三角函數
                </text>
                <text x="300" y="164" textAnchor="end" fill="currentColor" fontSize="12" opacity="0.7">
                  向量
                </text>
                <text x="160" y="310" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">
                  勾股定理
                </text>
                <text x="22" y="164" textAnchor="start" fill="currentColor" fontSize="12" opacity="0.7">
                  二次函數
                </text>
              </svg>
            </div>
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
              <span className="sub">額滿轉候補，不超量收</span>
            </div>
          </div>
        </section>

        <section id="samples" className="section">
          <div className="wrap">
            <p className="kicker">題本試閱</p>
            <h2 className="display">每週兩份 PDF 長這樣</h2>
            <p className="muted" style={{ maxWidth: 580 }}>
              這是真實一週：{SAMPLE.unit}。訂閱後會依孩子年級、校內進度與弱點單元調整，不是固定同一本。
            </p>
            <div className="sample-grid" style={{ marginTop: 28 }}>
              <figure className="sample-card">
                <div className="sample-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SAMPLE.studentPreview}
                    alt="寬數週練學生題本試閱頁：國一正負數與數線，本週觀念與練習題"
                    width={900}
                    height={1273}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <strong>學生題本</strong>
                  <span className="muted">先讀本週觀念再作答；這份沒有答案</span>
                </figcaption>
              </figure>
              <figure className="sample-card">
                <div className="sample-frame sample-frame--tilt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SAMPLE.parentPreview}
                    alt="寬數週練家長解答試閱頁：每題答案與步驟說明"
                    width={900}
                    height={1273}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <strong>家長解答</strong>
                  <span className="muted">每題答案＋步驟拆解，對完再回饋難度</span>
                </figcaption>
              </figure>
            </div>
            <div className="cta-row">
              <Link href="/sample" className="btn btn-ink">
                免費下載完整試閱 PDF
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
              陽明交大應用數學。Stanford OHS 數學老師暨官方監考官。週練是講義方案：每週兩份 PDF，不提供 LINE
              即時答題。
            </p>
            <p className="muted">成效一例：學測數學 11 級到分科 58 級（例如精誠高中備考）。更多經歷請看個人頁。</p>
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
              一位孩子一份週練。第二個孩子再加一席。目前以匯款開通；轉帳證明寄到老師信箱，確認後開席。
            </p>
            <div className="grid-2" style={{ marginTop: 28 }}>
              <article className="card">
                <p className="kicker">按月</p>
                <p className="price">
                  {SITE.currency}
                  {SITE.monthlyPrice}
                  <small> /月 · 每名孩子</small>
                </p>
                <p className="muted">適合先試一個月。要停用請寄信 {SITE.contactEmail}。</p>
              </article>
              <article className="card">
                <p className="kicker">按年</p>
                <p className="price">
                  {SITE.currency}
                  {SITE.yearlyPrice}
                  <small> /年 · 每名孩子</small>
                </p>
                <p className="muted">對準完整學年的每週進度。</p>
                <p className="savings-note">
                  月繳一年 {SITE.currency}
                  {SITE.monthlyPrice * 12} → 年繳 {SITE.currency}
                  {SITE.yearlyPrice}，省 {SITE.currency}
                  {yearlySave}
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
                準備 Digital SAT？五週講義
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                對準 Digital SAT Math 的五週講義。到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.satKeyword}」，送 Week 1
                試閱。
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
                  "會。訂閱時年級選 SAT Math：題目英文、解答中文講解，對準 Digital SAT。另有 Digital SAT 五週講義，私訊「" +
                    SOCIAL.satKeyword +
                    "」可先看 Week 1。",
                ],
                ["示範帳號是什麼？", "demo"],
                ["名額滿了怎麼辦？", `限 ${seatCap()} 名，額滿後改候補。老師從後台看到候補名單後再通知開席。`],
                ["匯款後多久開通？", "通常 1 個工作天內開通。請把轉帳證明寄到 " + SITE.contactEmail + "。"],
                [
                  "每週什麼時候出題？",
                  "通常每週一前後固定出題。開通後下一週起算；若當週已發布，開通後即可下載已發布週次。",
                ],
                ["怎麼停用？已匯款能退嗎？", "要停用請寄信即可。已匯款的當期不退，請開通前確認方案。"],
                ["第二個孩子怎麼訂？同帳號可以嗎？", "第二個孩子再訂一席。同一家長帳號可掛多名孩子。"],
                ["有電子發票嗎？", "目前提供匯款收據／對帳證明，如需收據請在寄證明時註明。"],
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
                ) : a === "demo" ? (
                  <p className="muted">
                    想走一遍家長後台（下載 PDF、填回饋），可用示範信箱 {DEMO_PARENT_EMAIL}{" "}
                    <Link
                      href={`/login?email=${encodeURIComponent(DEMO_PARENT_EMAIL)}&next=/dashboard`}
                      className="u"
                    >
                      登入示範帳
                    </Link>
                    。示範孩子未付費、不佔名額；真家長匯款確認後才開通。
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
                不用登入就能下載試閱；有問題到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.weeklyKeyword}」。
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
      </main>
      <Footer />
    </>
  );
}

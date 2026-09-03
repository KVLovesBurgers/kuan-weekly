import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { getParent } from "@/lib/auth";
import { seatsRemaining } from "@/lib/db";
import { SITE, seatCap } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const parent = await getParent();
  const remaining = await seatsRemaining();
  const full = remaining <= 0;

  return (
    <>
      <Header parentEmail={parent?.email} />
      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="kicker">吳寬老師 · 小學到高中數學</p>
              <h1 className="display">寬數週練</h1>
              <p className="lead" style={{ marginTop: 20 }}>
                {SITE.tagline}
              </p>
              <p className="sub" style={{ marginTop: 12 }}>
                每週一份學生題本、一份家長解答。小一到高三都收；出題＋解答、依程度排題、每周進度。
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                {full ? (
                  <Link href="/waitlist" className="btn btn-steel">
                    名額已滿，加入候補
                  </Link>
                ) : (
                  <Link href="/subscribe" className="btn btn-steel">
                    為孩子訂閱週練
                  </Link>
                )}
                <Link href="/login" className="btn btn-ghost">
                  家長登入
                </Link>
              </div>
              <p className="sub" style={{ marginTop: 16, fontSize: 13 }}>
                每名孩子 {SITE.currency}{SITE.monthlyPrice}/月或 {SITE.currency}{SITE.yearlyPrice}/年　·　正取 {seatCap()} 名
                {full ? "　·　目前已滿" : `　·　尚餘 ${remaining} 名`}
              </p>
            </div>
            <div className="orbit" aria-hidden>
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <circle cx="160" cy="160" r="108" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
                <circle cx="160" cy="160" r="72" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
                <path d="M28 160h264M160 28v264" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                <path d="M160 160 L256 160 A96 96 0 0 0 160 64" fill="none" stroke="#8a9bb0" strokeWidth="1.8" />
                <path d="M160 160 L228 160 L228 92 Z" fill="#8a9bb0" opacity="0.16" />
                <circle cx="256" cy="160" r="4" fill="currentColor" />
                <circle cx="160" cy="64" r="4" fill="currentColor" />
                <circle cx="160" cy="160" r="3" fill="currentColor" />
                <text x="160" y="22" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">二次函數</text>
                <text x="300" y="164" textAnchor="end" fill="currentColor" fontSize="12" opacity="0.7">向量</text>
                <text x="160" y="310" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">分數</text>
                <text x="22" y="164" textAnchor="start" fill="currentColor" fontSize="12" opacity="0.7">函數</text>
              </svg>
            </div>
          </div>
          <div className="wrap stats">
            <div>
              <strong className="display">兩份 PDF</strong>
              <span className="sub">學生題本 + 家長解答</span>
            </div>
            <div>
              <strong className="display">按孩子計價</strong>
              <span className="sub">每位孩子獨立週練與回饋</span>
            </div>
            <div>
              <strong className="display">{seatCap()} 名正取</strong>
              <span className="sub">滿額轉候補，不超量出題</span>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="wrap">
            <p className="kicker">01</p>
            <h2 className="display">一週怎麼走完</h2>
            <p className="muted" style={{ maxWidth: 560 }}>
              題做完，答案在家長那份 PDF；老師用你填的三欄回饋（偏易／剛好／偏難）決定下一週要不要加碼或放慢。
            </p>
            <div className="grid-3" style={{ marginTop: 28 }}>
              {[
                ["週一出題", "依孩子年級、校內進度、應考目標與弱點單元出該週題本。小一到高三都依程度排題。"],
                ["孩子作答", "學生 PDF 可列印或平板作答。提示寫在題下，不把解答混進去。"],
                ["家長對答＋回饋", "家長 PDF 含步驟拆解。填難度、完成度、卡關單元，三欄就夠。"],
              ].map(([t, d], i) => (
                <article className="card" key={t}>
                  <p className="kicker">0{i + 1}</p>
                  <h3>{t}</h3>
                  <p className="muted">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section ink-panel">
          <div className="wrap">
            <p className="kicker">02</p>
            <h2 className="display">出題會看的四件事</h2>
            <p className="sub" style={{ maxWidth: 560 }}>
              這不是英文閱讀主題包，而是數學單元。訂閱時先填，之後可在家長後台改。
            </p>
            <div className="grid-2" style={{ marginTop: 28 }}>
              {[
                ["年級", "小一到小六、國一到高三。題距與符號習慣跟著學制走。"],
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
            <p className="muted">一位孩子一份週練。第二個孩子再加一席。付款走綠界；測試期不會入帳，正式特店核准後才會進你的帳戶。</p>
            <div className="grid-2" style={{ marginTop: 28 }}>
              <article className="card">
                <p className="kicker">按月</p>
                <p className="price">
                  {SITE.currency}{SITE.monthlyPrice}
                  <small> /月 · 每名孩子</small>
                </p>
                <p className="muted">適合先試一個月。隨時可在後台停用申請（v1 以郵件聯絡老師）。</p>
              </article>
              <article className="card">
                <p className="kicker">按年</p>
                <p className="price">
                  {SITE.currency}{SITE.yearlyPrice}
                  <small> /年 · 每名孩子</small>
                </p>
                <p className="muted">約等於十個月月費。對準完整學年的每周進度。</p>
              </article>
            </div>
            <p style={{ marginTop: 24 }}>
              {full ? (
                <Link href="/waitlist" className="btn btn-ink">名額已滿，登記候補</Link>
              ) : (
                <Link href="/subscribe" className="btn btn-ink">開始訂閱</Link>
              )}
            </p>
          </div>
        </section>

        <section id="faq" className="section faq">
          <div className="wrap">
            <p className="kicker">04</p>
            <h2 className="display">常見問題</h2>
            {[
              ["有 LINE 或線上問答嗎？", "本站是週練包：出題＋解答。若需要一對一，請跟老師討論，寄信 jjredick365@gmail.com。"],
              ["為什麼要兩份 PDF？", "學生題本避免一眼瞄到答案；家長對完之後才打開解答，並用三欄回饋告訴老師這週是偏易、剛好，還是偏難。"],
              ["會出 SAT 嗎？", "寬數週練 v1 做國內數學：小一到高三。SAT 不在本站導覽。"],
              ["示範帳號是什麼？", "網站內建一名未付費示範孩子，方便走完下載與回饋。真家長走綠界付款後才開通；示範孩子本來就看得到講義。"],
              ["滿 20 名怎麼辦？", "正取額滿後改候補。老師從後台看到候補名單後再通知開席。"],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p className="muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap card" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Logo size={40} />
            <div style={{ flex: 1 }}>
              <h2 className="display" style={{ margin: 0, fontSize: 28 }}>先把這一週的觀念走穩</h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                登入後可看示範週的兩份 PDF。真正開席由老師確認名額。
              </p>
            </div>
            <Link href="/login" className="btn btn-ink">用信箱登入</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sendLoginLink } from "@/app/actions/parent";
import { DEMO_PARENT_EMAIL } from "@/lib/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const link = typeof sp.link === "string" ? sp.link : "";
  const email = typeof sp.email === "string" ? sp.email : "";
  const error = typeof sp.error === "string" ? sp.error : "";

  return (
    <>
      <Header />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 520 }}>
          <p className="kicker">家長登入</p>
          <h1 className="display">用信箱收一次連結</h1>
          <p className="muted">不設密碼。本機未接 SMTP 時，連結會直接顯示在這個頁面。</p>
          {error ? <p className="banner warn">{error}</p> : null}
          {sent ? (
            <div className="banner ok">
              已為 {email || "你的信箱"} 產生登入連結。
              {link ? (
                <p style={{ margin: "10px 0 0" }}>
                  開發模式連結：{" "}
                  <a href={link} style={{ textDecoration: "underline" }}>
                    點此登入
                  </a>
                </p>
              ) : (
                <p>若已設定 SMTP，請到收件匣點選信件中的連結。</p>
              )}
            </div>
          ) : null}
          <form action={sendLoginLink} className="form card" style={{ marginTop: 20 }}>
            <label htmlFor="email">電子信箱</label>
            <input id="email" name="email" type="email" required placeholder={DEMO_PARENT_EMAIL} />
            <button className="btn btn-ink" type="submit">
              寄出／顯示登入連結
            </button>
            <p className="muted" style={{ fontSize: 13 }}>
              示範家長信箱：{DEMO_PARENT_EMAIL}（已有一名未付費示範孩子與一週已發布題本）
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

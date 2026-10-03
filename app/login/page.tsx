import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sendLoginLink } from "@/app/actions/parent";
import { DEMO_PARENT_EMAIL } from "@/lib/config";
import { safeNextPath } from "@/lib/safe-next";
import { getParent } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const link = typeof sp.link === "string" ? sp.link : "";
  const emailParam = typeof sp.email === "string" ? sp.email : "";
  const error = typeof sp.error === "string" ? sp.error : "";
  const next = safeNextPath(typeof sp.next === "string" ? sp.next : "/dashboard");

  const parent = await getParent();
  if (parent && !sent) {
    redirect(next);
  }

  const isSubscribe = next === "/subscribe";
  const isDemo = emailParam === DEMO_PARENT_EMAIL;

  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 520 }}>
          <p className="kicker">{isSubscribe ? "訂閱 · 第 1 步／共 3 步" : "家長登入"}</p>
          <h1 className="display">{isSubscribe ? "先用信箱登入" : "用信箱收一次連結"}</h1>
          <p className="muted">
            不設密碼：輸入信箱，我們寄一封登入連結給你，點開就登入（連結 24 小時內有效）。
          </p>
          {isSubscribe ? (
            <ol className="steps-list banner ok" style={{ marginTop: 12, paddingLeft: 34 }}>
              <li>
                <strong>用信箱登入</strong>（這一步）
              </li>
              <li>填孩子年級、校內進度、弱點單元，選月繳或年繳</li>
              <li>看到匯款帳號，轉帳後寄證明，約 1 個工作天開通</li>
            </ol>
          ) : null}
          {isDemo && !sent ? (
            <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
              使用示範信箱 {DEMO_PARENT_EMAIL}
            </p>
          ) : null}
          {error ? <p className="banner warn">{error}</p> : null}
          {sent ? (
            <div className="banner ok">
              已處理 {emailParam || "你的信箱"} 的登入請求。
              {link ? (
                <p style={{ margin: "10px 0 0" }}>
                  登入連結：{" "}
                  <a href={link} style={{ textDecoration: "underline" }}>
                    點此登入
                  </a>
                </p>
              ) : (
                <p style={{ margin: "10px 0 0" }}>請到收件匣點選信件中的連結；幾分鐘內沒收到，請看一下垃圾郵件匣或「促銷內容」分類。</p>
              )}
            </div>
          ) : null}
          <form action={sendLoginLink} className="form card" style={{ marginTop: 20 }}>
            <input type="hidden" name="next" value={next} />
            <label htmlFor="email">電子信箱</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={emailParam}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
            <button className="btn btn-ink" type="submit">
              寄出登入連結
            </button>
            <p className="muted" style={{ fontSize: 13 }}>
              只想先看看家長後台？可用示範信箱 {DEMO_PARENT_EMAIL}（未付費示範孩子，連結會直接顯示在本頁）。
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

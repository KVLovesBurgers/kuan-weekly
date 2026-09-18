import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata = {
  title: `隱私權政策｜${SITE.name}`,
  description: "寬數週練個資蒐集、使用與刪除說明。",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p className="kicker">Privacy</p>
          <h1 className="display">隱私權政策</h1>
          <p className="muted" style={{ marginTop: 12 }}>
            本頁說明 {SITE.name}（{SITE.teacher}）如何處理家長與孩子的資料。
          </p>

          <h2 className="display" style={{ fontSize: 24, marginTop: 32 }}>
            我們蒐集什麼
          </h2>
          <ul className="muted" style={{ lineHeight: 1.9 }}>
            <li>家長電子信箱（登入與聯絡）</li>
            <li>孩子暱稱、年級、校內進度、應考目標、弱點單元</li>
            <li>每週作答進度與難度／完成度回饋、卡關單元</li>
            <li>訂閱方案、匯款對帳相關紀錄（開通用）</li>
          </ul>

          <h2 className="display" style={{ fontSize: 24, marginTop: 28 }}>
            為什麼需要
          </h2>
          <p className="muted">
            用於依程度出題、家長登入下載題本、確認匯款後開通席次，以及依回饋調整下一週題目。
          </p>

          <h2 className="display" style={{ fontSize: 24, marginTop: 28 }}>
            誰會看到
          </h2>
          <p className="muted">
            主要由老師（{SITE.teacher}）為出題與開通而查看。不會把資料賣給第三方行銷。
          </p>

          <h2 className="display" style={{ fontSize: 24, marginTop: 28 }}>
            保存多久
          </h2>
          <p className="muted">
            訂閱存續期間與合理對帳期間內保存；停用或刪除請求處理後，會移除或匿名化可識別資料（依法須保留的對帳紀錄除外）。
          </p>

          <h2 className="display" style={{ fontSize: 24, marginTop: 28 }}>
            聯絡與刪除
          </h2>
          <p className="muted">
            若要查詢、更正或刪除個資，請寄信{" "}
            <a href={`mailto:${SITE.contactEmail}`} style={{ textDecoration: "underline" }}>
              {SITE.contactEmail}
            </a>
            ，並註明註冊信箱與請求內容。
          </p>

          <p style={{ marginTop: 32 }}>
            <Link href="/" className="btn btn-paper">
              回首頁
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

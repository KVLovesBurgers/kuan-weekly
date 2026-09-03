import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getParent } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { ecpayConfig } from "@/lib/ecpay";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; trade?: string; ok?: string }>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const sp = await searchParams;
  const db = await getDb();
  let paid = sp.ok === "1";
  if (sp.trade) {
    const row = (await db
      .prepare("SELECT status FROM checkout_attempts WHERE id = ? AND parent_id = ?")
      .get(sp.trade, parent.id)) as { status: string } | undefined;
    if (row?.status === "paid") paid = true;
  }
  const { isStage } = ecpayConfig();

  return (
    <>
      <Header parentEmail={parent.email} />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="kicker">結帳</p>
          {paid ? (
            <>
              <h1 className="display">付款已收到</h1>
              <p className="banner ok">
                {isStage
                  ? "這是綠界測試環境的成功回傳，尚未進真實帳戶。正式特店核准後才會入帳。"
                  : "已開通這名孩子的週練。可到家長後台下載本週講義。"}
              </p>
            </>
          ) : (
            <>
              <h1 className="display">尚未完成付款</h1>
              <p className="banner warn">若你已付款，稍等半分鐘再進後台；綠界通知有時會晚到。沒有完成可再訂閱一次。</p>
            </>
          )}
          <p style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link href="/dashboard" className="btn btn-ink">
              回家長後台
            </Link>
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

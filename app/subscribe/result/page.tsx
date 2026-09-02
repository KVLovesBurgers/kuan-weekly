import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getParent } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  return (
    <>
      <Header parentEmail={parent.email} />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="kicker">示範結帳</p>
          <h1 className="display">沒有完成付款</h1>
          <p className="banner warn">
            這是刻意的。v1 不模擬成功扣款，孩子狀態停在「待開通」。請用示範孩子走完 PDF 與回饋，或請老師在後台手動開席。
          </p>
          <p style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link href="/dashboard" className="btn btn-ink">回家長後台</Link>
            <Link href="/" className="btn btn-paper">回首頁</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

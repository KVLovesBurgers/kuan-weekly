import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getParent } from "@/lib/auth";
import { seatsRemaining } from "@/lib/db";
import { mockCheckout } from "@/app/actions/parent";
import { GRADE_OPTIONS, SITE, seatCap } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const remaining = await seatsRemaining();
  if (remaining <= 0) redirect("/waitlist");
  const sp = await searchParams;

  return (
    <>
      <Header parentEmail={parent.email} />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 640 }}>
          <p className="kicker">訂閱</p>
          <h1 className="display">為一名孩子登記週練</h1>
          <p className="muted">
            正取尚餘 {remaining} / {seatCap()} 名。以下是示範結帳：不會向銀行或金流請款，也不會把孩子標成已付費。
          </p>
          {sp.error ? <p className="banner warn">{sp.error}</p> : null}
          <form action={mockCheckout} className="form card" style={{ marginTop: 20 }}>
            <label>孩子稱呼（顯示於後台與 PDF 頁首）</label>
            <input name="display_name" required placeholder="例如：安安" />
            <label>年級</label>
            <select name="grade" defaultValue="小五">
              {GRADE_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <label>校內進度</label>
            <textarea name="school_progress" placeholder="版本、章節、段考範圍" />
            <label>應考目標</label>
            <input name="exam_target" placeholder="例如：跟上段考、把分數應用寫穩" />
            <label>弱點單元</label>
            <textarea name="weak_topics" placeholder="例如：應用題列式、分數四則" />
            <label>方案</label>
            <select name="plan" defaultValue="monthly">
              <option value="monthly">月繳 {SITE.currency}{SITE.monthlyPrice}</option>
              <option value="yearly">年繳 {SITE.currency}{SITE.yearlyPrice}</option>
            </select>
            <div className="banner warn">示範結帳：送出後只會留下「未完成付款」紀錄，名額不會自動開通。</div>
            <button className="btn btn-ink" type="submit">
              進入示範結帳（不扣款）
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

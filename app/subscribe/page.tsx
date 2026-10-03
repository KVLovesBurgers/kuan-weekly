import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getParent } from "@/lib/auth";
import { seatsRemaining } from "@/lib/db";
import { startCheckout } from "@/app/actions/parent";
import { BANK_TRANSFER, GRADE_OPTIONS, SITE, seatLabel } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login?next=/subscribe");
  const remaining = await seatsRemaining();
  if (remaining <= 0) redirect("/waitlist");
  const seat = seatLabel(remaining);
  const sp = await searchParams;

  return (
    <>
      <Header parentEmail={parent.email} />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 640 }}>
          <p className="kicker">訂閱 · 第 2 步／共 3 步</p>
          <h1 className="display">為一名孩子登記週練</h1>
          <p className="muted">
            {seat.text}
            {seat.remaining !== null ? ` ${seat.remaining} 名` : ""}。送出後會看到匯款帳號；轉帳完成請把證明寄到老師信箱，確認後開通。
          </p>

          <div className="banner" style={{ marginTop: 16 }}>
            <strong>匯款預覽</strong>
            <p style={{ margin: "8px 0 0" }}>
              銀行：{BANK_TRANSFER.bankName}（{BANK_TRANSFER.bankCode}）
              <br />
              戶名：{BANK_TRANSFER.accountName}
            </p>
            <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
              送出後顯示完整帳號與金額。開通約 1 個工作天（請寄證明到 {BANK_TRANSFER.proofEmail}）。
            </p>
          </div>

          {sp.error ? <p className="banner warn">{sp.error}</p> : null}
          <form action={startCheckout} className="form card" style={{ marginTop: 20 }}>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              請填寫標 * 的欄位
            </p>
            <label htmlFor="display_name">孩子稱呼（顯示於後台與 PDF 頁首）*</label>
            <input id="display_name" name="display_name" required maxLength={40} autoComplete="off" placeholder="例如：安安" />
            <label htmlFor="grade">年級*</label>
            <select id="grade" name="grade" required defaultValue="國一">
              {GRADE_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <label htmlFor="school_progress">校內進度</label>
            <textarea id="school_progress" name="school_progress" placeholder="版本、章節、段考範圍" />
            <label htmlFor="exam_target">應考目標</label>
            <input id="exam_target" name="exam_target" placeholder="例如：跟上段考、把分數應用寫穩" />
            <label htmlFor="weak_topics">弱點單元</label>
            <textarea id="weak_topics" name="weak_topics" placeholder="例如：應用題列式、分數四則" />
            <label htmlFor="plan">方案*</label>
            <select id="plan" name="plan" required defaultValue="monthly">
              <option value="monthly">
                {`月繳 ${SITE.currency}${SITE.monthlyPrice} /月`}
              </option>
              <option value="yearly">
                {`年繳 ${SITE.currency}${SITE.yearlyPrice} /年（省 ${SITE.currency}${SITE.monthlyPrice * 12 - SITE.yearlyPrice}）`}
              </option>
            </select>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              送出即表示已閱讀{" "}
              <Link href="/privacy" style={{ textDecoration: "underline" }}>
                隱私權政策
              </Link>
              。
            </p>
            <button className="btn btn-ink" type="submit">
              查看匯款帳號
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

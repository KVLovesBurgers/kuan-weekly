import Link from "next/link";
import { redirect } from "next/navigation";
import { getParent } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { BANK_TRANSFER, SITE } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ trade?: string }>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const { trade } = await searchParams;
  if (!trade) redirect("/subscribe");
  const db = await getDb();
  const row = (await db
    .prepare("SELECT * FROM checkout_attempts WHERE id = ? AND parent_id = ?")
    .get(trade, parent.id)) as
    | { id: string; child_id: string; plan: string; amount: number; status: string }
    | undefined;
  if (!row) redirect("/subscribe");
  if (row.status === "paid") redirect("/dashboard");

  const child = (await db.prepare("SELECT display_name FROM children WHERE id = ?").get(row.child_id)) as
    | { display_name: string }
    | undefined;
  const planLabel = row.plan === "yearly" ? "年繳" : "月繳";
  const amount = Number(row.amount);
  const mailto = `mailto:${BANK_TRANSFER.proofEmail}?subject=${encodeURIComponent(
    `寬數週練匯款證明｜${child?.display_name ?? ""}｜${row.id}`,
  )}&body=${encodeURIComponent(
    `老師您好，\n\n已匯款 ${SITE.currency}${amount}（${planLabel}）。\n訂單編號：${row.id}\n孩子：${child?.display_name ?? ""}\n家長信箱：${parent.email}\n\n（請附上轉帳證明截圖）\n`,
  )}`;

  return (
    <main className="section">
      <div className="wrap" style={{ maxWidth: 520 }}>
        <p className="kicker">結帳</p>
        <h1 className="display">匯款開通</h1>
        <p className="muted">
          目前以銀行轉帳收款。匯完請把證明寄到老師信箱，確認入帳後會為「{child?.display_name ?? "孩子"}」開通正取。
        </p>

        <div className="card" style={{ marginTop: 20 }}>
          <p className="kicker">應付金額</p>
          <p className="price" style={{ margin: "8px 0 0" }}>
            {SITE.currency}
            {amount}
            <small>
              {" "}
              · {planLabel} · 訂單 {row.id}
            </small>
          </p>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <p className="kicker">匯款帳號</p>
          <p style={{ marginTop: 8 }}>
            <strong>
              {BANK_TRANSFER.bankName}（{BANK_TRANSFER.bankCode}）
            </strong>
          </p>
          <p>
            戶名：<strong>{BANK_TRANSFER.accountName}</strong>
          </p>
          <p>
            帳號：<strong style={{ letterSpacing: "0.04em" }}>{BANK_TRANSFER.accountNumber}</strong>
          </p>
          <p className="muted" style={{ marginTop: 12 }}>
            備註可填孩子稱呼或訂單編號，方便對帳。
          </p>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <p className="kicker">下一步</p>
          <ol className="muted" style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>完成匯款</li>
            <li>
              把轉帳證明寄到{" "}
              <a href={mailto}>
                <strong>{BANK_TRANSFER.proofEmail}</strong>
              </a>
            </li>
            <li>老師確認後開通，即可在家長後台下載週練</li>
          </ol>
          <p style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn btn-ink" href={mailto}>
              開啟信箱寄證明
            </a>
            <Link className="btn btn-paper" href="/dashboard">
              回家長後台
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

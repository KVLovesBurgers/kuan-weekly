import { redirect } from "next/navigation";
import { getParent } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { checkoutFields, ecpayConfig } from "@/lib/ecpay";
import { PayForm } from "./PayForm";

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
  const fields = checkoutFields({
    tradeNo: row.id,
    amount: Number(row.amount),
    plan: row.plan === "yearly" ? "yearly" : "monthly",
    childId: row.child_id,
  });
  const { checkoutUrl, isStage } = ecpayConfig();

  return (
    <main className="section">
      <div className="wrap" style={{ maxWidth: 520 }}>
        <p className="kicker">結帳</p>
        <h1 className="display">前往綠界付款</h1>
        {isStage ? (
          <p className="banner warn">目前是綠界測試環境，不會真的請款。正式特店核准後會改成真收款。</p>
        ) : (
          <p className="muted">送出後會跳到綠界付款頁。</p>
        )}
        <PayForm action={checkoutUrl} fields={fields} />
      </div>
    </main>
  );
}

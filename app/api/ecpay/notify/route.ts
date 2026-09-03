import { NextResponse } from "next/server";
import { getDb, seatsRemaining } from "@/lib/db";
import { macOk } from "@/lib/ecpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.formData();
  const params: Record<string, string> = {};
  body.forEach((v, k) => {
    params[k] = String(v);
  });
  if (!macOk(params)) {
    return new NextResponse("0|CheckMacValueError", { status: 200 });
  }
  const tradeNo = params.MerchantTradeNo || "";
  const db = await getDb();
  const row = (await db
    .prepare("SELECT * FROM checkout_attempts WHERE id = ?")
    .get(tradeNo)) as
    | { id: string; child_id: string; status: string }
    | undefined;
  if (!row) return new NextResponse("0|OrderNotFound", { status: 200 });

  if (params.RtnCode === "1") {
    if (row.status !== "paid") {
      await db.prepare("UPDATE checkout_attempts SET status = ? WHERE id = ?").run("paid", tradeNo);
      const remaining = await seatsRemaining(db);
      if (remaining > 0) {
        await db
          .prepare("UPDATE children SET subscription_status = 'active' WHERE id = ? AND is_demo = 0")
          .run(row.child_id);
      }
    }
  } else if (row.status !== "paid") {
    await db.prepare("UPDATE checkout_attempts SET status = ? WHERE id = ?").run("failed", tradeNo);
  }
  return new NextResponse("1|OK", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

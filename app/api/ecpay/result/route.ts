import { NextResponse } from "next/server";
import { appUrl } from "@/lib/config";
import { macOk } from "@/lib/ecpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.formData();
  const params: Record<string, string> = {};
  body.forEach((v, k) => {
    params[k] = String(v);
  });
  const trade = encodeURIComponent(params.MerchantTradeNo || "");
  const ok = macOk(params) && params.RtnCode === "1";
  const dest = `${appUrl()}/subscribe/result?trade=${trade}&ok=${ok ? "1" : "0"}`;
  return NextResponse.redirect(dest, 303);
}

export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}

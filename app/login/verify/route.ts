import { NextResponse } from "next/server";
import { consumeMagicLink } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const origin = new URL(req.url).origin;
  if (!token) {
    return NextResponse.redirect(origin + "/login?error=" + encodeURIComponent("缺少登入憑證。"));
  }
  const res = await consumeMagicLink(token);
  if (!res.ok) {
    return NextResponse.redirect(origin + "/login?error=" + encodeURIComponent(res.error));
  }
  return NextResponse.redirect(origin + "/dashboard");
}

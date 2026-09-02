import { NextResponse } from "next/server";
import { consumeMagicLink } from "@/lib/auth";
import { appUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.redirect(appUrl() + "/login?error=" + encodeURIComponent("缺少登入憑證。"));
  }
  const res = await consumeMagicLink(token);
  if (!res.ok) {
    return NextResponse.redirect(appUrl() + "/login?error=" + encodeURIComponent(res.error));
  }
  return NextResponse.redirect(appUrl() + "/dashboard");
}

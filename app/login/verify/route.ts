import { NextResponse } from "next/server";
import { consumeMagicLink } from "@/lib/auth";
import { safeNextPath } from "@/lib/safe-next";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const token = u.searchParams.get("token") ?? "";
  const next = safeNextPath(u.searchParams.get("next"));
  const origin = u.origin;
  if (!token) {
    return NextResponse.redirect(origin + "/login?error=" + encodeURIComponent("缺少登入憑證。"));
  }
  const res = await consumeMagicLink(token);
  if (!res.ok) {
    return NextResponse.redirect(origin + "/login?error=" + encodeURIComponent(res.error));
  }
  return NextResponse.redirect(origin + next);
}

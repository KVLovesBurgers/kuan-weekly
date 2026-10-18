import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc } from "@/lib/leads";
import { driveUrl } from "@/lib/practice-sheets";
import { findUnitPack, hasLivePack, unitPdf, unitSheets } from "@/lib/unit-packs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 單元 PDF 下載：先記一筆 unit_pdf（含 src），再轉址。
 * 沒帶 sheet＝單元包 PDF（public/units/<slug>.pdf）；帶 ?sheet=<driveId>＝該單元的練習題（Google Drive）。
 */
export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const u = findUnitPack(slug);
  if (!u) return new NextResponse("找不到這個單元", { status: 404 });
  const url = new URL(req.url);
  const src = cleanSrc(url.searchParams.get("src"));
  const sheetId = url.searchParams.get("sheet");
  let dest: string;
  let target: string;
  if (sheetId) {
    const s = unitSheets(u.slug).find((x) => x.driveId === sheetId);
    if (!s) return new NextResponse("找不到這份練習題", { status: 404 });
    dest = driveUrl(s.driveId);
    target = `${u.slug}:${s.series.replace(/\s+/g, "")}`.slice(0, 80);
  } else {
    if (!hasLivePack(u)) return NextResponse.redirect(new URL(`/units/${u.slug}`, req.url), 302);
    dest = new URL(unitPdf(u.slug), req.url).toString();
    target = u.slug;
  }
  try {
    const db = await getDb();
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(uid("ev"), "unit_pdf", target, src, new Date().toISOString());
  } catch (err) {
    console.error("unit pdf track failed", err);
  }
  return NextResponse.redirect(dest, 302);
}

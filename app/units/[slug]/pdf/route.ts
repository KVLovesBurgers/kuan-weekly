import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc } from "@/lib/leads";
import { findUnitPack, unitPdf } from "@/lib/unit-packs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 單元包 PDF 下載：先記一筆 unit_pdf（含 src），再轉到靜態 PDF。 */
export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const u = findUnitPack(slug);
  if (!u) return new NextResponse("找不到這個單元", { status: 404 });
  const src = cleanSrc(new URL(req.url).searchParams.get("src"));
  try {
    const db = await getDb();
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(uid("ev"), "unit_pdf", u.slug, src, new Date().toISOString());
  } catch (err) {
    console.error("unit pdf track failed", err);
  }
  return NextResponse.redirect(new URL(unitPdf(u.slug), req.url), 302);
}

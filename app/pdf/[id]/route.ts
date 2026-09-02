import { NextResponse } from "next/server";
import fs from "node:fs";
import { getAdmin, getParent } from "@/lib/auth";
import { getDb, type PdfRow } from "@/lib/db";
import { absolutePdfPath, ensureDemoPdfs, getWeek } from "@/lib/weeks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parent = await getParent();
  const admin = await getAdmin();
  if (!parent && !admin) {
    return NextResponse.redirect(new URL("/login", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const db = getDb();
  const pdf = db.prepare("SELECT * FROM pdf_files WHERE id = ?").get(id) as PdfRow | undefined;
  if (!pdf) return new NextResponse("找不到檔案", { status: 404 });

  if (parent && !admin) {
    const allowed = db
      .prepare(
        `SELECT c.id FROM children c
         WHERE c.parent_id = ? AND (c.subscription_status = 'active' OR c.subscription_status = 'demo')`,
      )
      .all(parent.id) as { id: string }[];
    if (allowed.length === 0) return new NextResponse("尚未開通", { status: 403 });
  }

  const week = getWeek(pdf.week_id);
  if (week && week.published === 0 && !admin) {
    return new NextResponse("本週尚未發布", { status: 403 });
  }

  let abs = absolutePdfPath(pdf);
  if (!fs.existsSync(abs) && week) {
    await ensureDemoPdfs(week);
    const again = db.prepare("SELECT * FROM pdf_files WHERE id = ?").get(id) as PdfRow | undefined;
    if (!again) return new NextResponse("檔案遺失", { status: 404 });
    abs = absolutePdfPath(again);
  }
  if (!fs.existsSync(abs)) return new NextResponse("檔案遺失", { status: 404 });

  const bytes = fs.readFileSync(abs);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(pdf.filename)}`,
    },
  });
}

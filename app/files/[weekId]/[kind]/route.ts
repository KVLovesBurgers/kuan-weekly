import { NextResponse } from "next/server";
import { getAdmin, getParent } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getWeek } from "@/lib/weeks";
import { readPersistentPdf } from "@/lib/pdf-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ weekId: string; kind: string }> }) {
  const { weekId, kind: rawKind } = await ctx.params;
  const kind = rawKind === "parent" ? "parent" : rawKind === "student" ? "student" : null;
  if (!kind) return new NextResponse("找不到檔案", { status: 404 });

  const parent = await getParent();
  const admin = await getAdmin();
  if (!parent && !admin) {
    return NextResponse.redirect(new URL("/login", process.env.APP_URL ?? "http://localhost:3000"));
  }

  if (parent && !admin) {
    const db = getDb();
    const allowed = db
      .prepare(
        `SELECT c.id FROM children c
         WHERE c.parent_id = ? AND (c.subscription_status = 'active' OR c.subscription_status = 'demo')`,
      )
      .all(parent.id) as { id: string }[];
    if (allowed.length === 0) return new NextResponse("尚未開通", { status: 403 });
  }

  const week = getWeek(weekId);
  if (week && week.published === 0 && !admin) {
    return new NextResponse("本週尚未發布", { status: 403 });
  }

  const file = await readPersistentPdf(weekId, kind);
  if (!file) return new NextResponse("找不到檔案", { status: 404 });

  return new NextResponse(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    },
  });
}

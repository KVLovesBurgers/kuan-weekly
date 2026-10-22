import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set(["unit_view", "units_view", "unit_pdf", "sample_pdf", "share_click", "quiz_view", "sample_view"]);

/** 匿名來源統計：只記事件種類、對象與 src，不記個資。 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const kind = String(body.kind ?? "");
    if (!KINDS.has(kind)) return new NextResponse(null, { status: 204 });
    const target = String(body.target ?? "").replace(/[^a-z0-9_-]/gi, "").slice(0, 60);
    const src = cleanSrc(body.src);
    const db = await getDb();
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(uid("ev"), kind, target, src, new Date().toISOString());
  } catch (err) {
    console.error("track failed", err);
  }
  return new NextResponse(null, { status: 204 });
}

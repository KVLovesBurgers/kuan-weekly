import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/db";
import { packsForGrade, trialActive, trialEndLabel, verifyTrialToken } from "@/lib/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function page(title: string, body: string, status: number) {
  const html = `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}｜寬數週練</title>
<body style="font-family:system-ui,'Noto Sans TC',sans-serif;max-width:560px;margin:60px auto;padding:0 20px;line-height:1.7;color:#0F1419">
<h1 style="font-size:22px">${title}</h1>${body}
<p><a href="/sample#subscribe">看訂閱方式</a>　<a href="/">回寬數週練首頁</a></p></body></html>`;
  return new NextResponse(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string; file: string }> }) {
  const { token, file } = await ctx.params;
  const leadId = verifyTrialToken(token);
  const m = file.match(/^([a-z0-9_A-Z]+)-(student|parent)\.pdf$/);
  if (!leadId || !m) return page("連結無效", "<p>這個下載連結不正確，請回到試閱頁重新領取。</p>", 404);
  const db = await getDb();
  const lead = (await db.prepare("SELECT id, grade, created_at FROM leads WHERE id = ?").get(leadId)) as
    | { id: string; grade: string; created_at: string }
    | undefined;
  if (!lead) return page("連結無效", "<p>找不到這份試用。</p>", 404);
  if (!packsForGrade(lead.grade).some((p) => p.id === m[1])) return page("連結無效", "<p>這份不在你的試用範圍內。</p>", 404);
  if (!trialActive(lead)) {
    return page(
      "7 天試用已結束",
      `<p>這份完整試用已在 ${trialEndLabel(lead.created_at)}關閉。</p><p>想每週跟著學校進度練，可以登記訂閱；有問題直接回信給吳寬老師。</p>`,
      410,
    );
  }
  const abs = path.join(process.cwd(), "trial-packs", `${m[1]}-${m[2]}.pdf`);
  if (!fs.existsSync(abs)) return page("檔案準備中", "<p>請稍後再試。</p>", 404);
  return new NextResponse(fs.readFileSync(abs), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="kuan-weekly-trial-${m[1]}-${m[2]}.pdf"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}

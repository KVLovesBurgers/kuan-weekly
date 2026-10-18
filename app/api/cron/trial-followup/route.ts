import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mailConfigured, sendFollowupEmail } from "@/lib/mail";
import { SITE } from "@/lib/config";
import {
  eligibleFollowupLeads,
  FOLLOWUP_BATCH_LIMIT,
  FOLLOWUP_KIND,
  FOLLOWUP_SUBJECT,
  FOLLOWUP_TEXT,
} from "@/lib/followup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * 每天台北 20:00（UTC 12:00）由 Vercel Cron 呼叫：寄試閱後跟進信，一人一次。
 * ?dry=1 只回傳符合人數；?test=1 只寄一封「[測試] 」到老師信箱；
 * ?optout=信箱 記錄退訂（回信說不要再收的人）。
 */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const db = await getDb();

  const optout = (url.searchParams.get("optout") ?? "").trim().toLowerCase();
  if (optout) {
    await db
      .prepare("INSERT INTO email_optouts (email, note, created_at) VALUES (?, 'reply', ?) ON CONFLICT(email) DO NOTHING")
      .run(optout, new Date().toISOString());
    return NextResponse.json({ ok: true, optedOut: true });
  }

  if (url.searchParams.get("test") === "1") {
    if (!mailConfigured()) return NextResponse.json({ error: "mail not configured" }, { status: 500 });
    await sendFollowupEmail(SITE.contactEmail, `[測試] ${FOLLOWUP_SUBJECT}`, FOLLOWUP_TEXT);
    return NextResponse.json({ ok: true, test: true, to: SITE.contactEmail });
  }

  const leads = await eligibleFollowupLeads(db);
  if (url.searchParams.get("dry") === "1") {
    const mask = (e: string) => e.replace(/^(.).*(@.*)$/, "$1***$2");
    return NextResponse.json({
      ok: true,
      dry: true,
      eligible: leads.length,
      leads: leads.map((l) => ({ email: mask(String(l.email)), created_at: String(l.created_at) })),
    });
  }
  if (!mailConfigured()) return NextResponse.json({ error: "mail not configured" }, { status: 500 });

  let sent = 0;
  let failed = 0;
  for (const lead of leads.slice(0, FOLLOWUP_BATCH_LIMIT)) {
    const email = String(lead.email);
    const now = new Date().toISOString();
    // 先佔位（sending），避免重複執行時寄兩次；失敗才標 failed，隔天再試。
    await db
      .prepare(
        `INSERT INTO lead_followups (email, kind, status, sent_at, error) VALUES (?, ?, 'sending', ?, '')
         ON CONFLICT(email, kind) DO UPDATE SET status = 'sending', sent_at = excluded.sent_at
         WHERE lead_followups.status = 'failed'`,
      )
      .run(email, FOLLOWUP_KIND, now);
    const claim = (await db
      .prepare("SELECT status, sent_at FROM lead_followups WHERE email = ? AND kind = ?")
      .get(email, FOLLOWUP_KIND)) as { status: string; sent_at: string } | undefined;
    if (!claim || claim.status !== "sending" || claim.sent_at !== now) continue;
    try {
      await sendFollowupEmail(email, FOLLOWUP_SUBJECT, FOLLOWUP_TEXT);
      await db
        .prepare("UPDATE lead_followups SET status = 'sent', sent_at = ? WHERE email = ? AND kind = ?")
        .run(new Date().toISOString(), email, FOLLOWUP_KIND);
      sent++;
    } catch (err) {
      failed++;
      console.error("trial followup failed", err);
      await db
        .prepare("UPDATE lead_followups SET status = 'failed', error = ? WHERE email = ? AND kind = ?")
        .run(String(err).slice(0, 300), email, FOLLOWUP_KIND);
    }
  }
  return NextResponse.json({ ok: true, eligible: leads.length, sent, failed });
}

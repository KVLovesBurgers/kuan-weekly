import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mailConfigured, sendFollowupEmail } from "@/lib/mail";
import { SITE } from "@/lib/config";
import {
  eligibleFollowupLeads,
  FOLLOWUP_BATCH_LIMIT,
  FOLLOWUP_KIND,
  buildFollowup,
  buildTrialReminder,
  eligibleTrialReminders,
} from "@/lib/followup";
import { TRIAL_D6_KIND } from "@/lib/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * 每天台北 20:00（UTC 12:00）由 Vercel Cron 呼叫：寄試閱後跟進信（trial_d1，舊流程），
 * 以及 7 天試用第 6 天提醒（trial_d6）。兩種互斥：試用者不收 trial_d1。每種一人一次，到期後不寄。
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
    const v = buildFollowup({ role: url.searchParams.get("role") ?? "家長", grade: url.searchParams.get("grade") ?? "" });
    await sendFollowupEmail(SITE.contactEmail, `[測試] ${v.subject}`, v.text);
    return NextResponse.json({ ok: true, test: true, to: SITE.contactEmail, variant: v.variant });
  }

  const leads = await eligibleFollowupLeads(db);
  const reminders = await eligibleTrialReminders(db);
  if (url.searchParams.get("dry") === "1") {
    const mask = (e: string) => e.replace(/^(.).*(@.*)$/, "$1***$2");
    return NextResponse.json({
      ok: true,
      dry: true,
      eligible: leads.length,
      leads: leads.map((l) => ({ email: mask(String(l.email)), created_at: String(l.created_at), variant: buildFollowup(l).variant })),
      trialReminders: reminders.map((l) => ({ email: mask(l.email), created_at: l.created_at })),
    });
  }
  if (!mailConfigured()) return NextResponse.json({ error: "mail not configured" }, { status: 500 });

  let sent = 0;
  let failed = 0;
  // 先佔位（sending），避免重複執行時寄兩次；失敗才標 failed，隔天再試。一人一種信只寄一次。
  async function sendOnce(email: string, kind: string, build: () => { subject: string; text: string }) {
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO lead_followups (email, kind, status, sent_at, error) VALUES (?, ?, 'sending', ?, '')
         ON CONFLICT(email, kind) DO UPDATE SET status = 'sending', sent_at = excluded.sent_at
         WHERE lead_followups.status = 'failed'`,
      )
      .run(email, kind, now);
    const claim = (await db
      .prepare("SELECT status, sent_at FROM lead_followups WHERE email = ? AND kind = ?")
      .get(email, kind)) as { status: string; sent_at: string } | undefined;
    if (!claim || claim.status !== "sending" || claim.sent_at !== now) return;
    try {
      const mail = build();
      await sendFollowupEmail(email, mail.subject, mail.text);
      await db
        .prepare("UPDATE lead_followups SET status = 'sent', sent_at = ? WHERE email = ? AND kind = ?")
        .run(new Date().toISOString(), email, kind);
      sent++;
    } catch (err) {
      failed++;
      console.error("trial followup failed", kind, err);
      await db
        .prepare("UPDATE lead_followups SET status = 'failed', error = ? WHERE email = ? AND kind = ?")
        .run(String(err).slice(0, 300), email, kind);
    }
  }
  for (const lead of leads.slice(0, FOLLOWUP_BATCH_LIMIT)) {
    await sendOnce(String(lead.email), FOLLOWUP_KIND, () => buildFollowup(lead));
  }
  for (const lead of reminders.slice(0, FOLLOWUP_BATCH_LIMIT)) {
    await sendOnce(lead.email, TRIAL_D6_KIND, () => buildTrialReminder(lead));
  }
  return NextResponse.json({ ok: true, eligible: leads.length, trialReminders: reminders.length, sent, failed });
}

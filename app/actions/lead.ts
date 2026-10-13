"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { mailConfigured, sendLeadAlert } from "@/lib/mail";
import { cleanSrc, cleanUtm, LEAD_COOKIE, LEAD_GRADES, LEAD_ID_COOKIE, LEAD_ROLES, LEAD_TRACK_COOKIE, LEAD_TRADE_COOKIE, cleanTrack, trackForGrade } from "@/lib/leads";
import { seatsRemaining } from "@/lib/db";
import { GRADE_OPTIONS, SITE } from "@/lib/config";
import { sendCheckoutAlert } from "@/lib/mail";

export async function submitSampleLead(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const src = cleanSrc(formData.get("src"));
  const gradeRaw = String(formData.get("grade") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "").trim();
  const grade = (LEAD_GRADES as readonly string[]).includes(gradeRaw) ? gradeRaw : "";
  const role = (LEAD_ROLES as readonly string[]).includes(roleRaw) ? roleRaw : "";
  const utm = (["utm_source", "utm_medium", "utm_campaign"] as const)
    .map((k) => [k, cleanUtm(formData.get(k))] as const)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const q = new URLSearchParams({ error: "請輸入有效的電子信箱。" });
    if (src) q.set("src", src);
    redirect(`/sample?${q.toString()}#get`);
  }

  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.prepare("SELECT id FROM leads WHERE email = ?").get(email);
  if (existing) {
    await db
      .prepare(
        `UPDATE leads SET hits = hits + 1, last_seen_at = ?,
           grade = CASE WHEN ? <> '' THEN ? ELSE grade END,
           role = CASE WHEN ? <> '' THEN ? ELSE role END
         WHERE email = ?`,
      )
      .run(now, grade, grade, role, role, email);
  } else {
    await db
      .prepare(
        `INSERT INTO leads (id, email, grade, role, source, utm, hits, created_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hits = hits + 1, last_seen_at = excluded.last_seen_at`,
      )
      .run(uid("lead"), email, grade, role, src, utm, now, now);
    if (mailConfigured()) {
      after(async () => {
        try {
          await sendLeadAlert({ email, grade, role, source: src, utm, createdAt: now });
        } catch (err) {
          console.error("lead alert failed", err);
        }
      });
    }
  }

  const row = (await db.prepare("SELECT id FROM leads WHERE email = ?").get(email)) as { id: string } | undefined;
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  };
  jar.set(LEAD_COOKIE, "1", opts);
  if (row) jar.set(LEAD_ID_COOKIE, row.id, opts);
  jar.set(LEAD_TRACK_COOKIE, grade ? trackForGrade(grade) : cleanTrack(formData.get("track")) || "jh", opts);
  redirect(`/sample?ok=1${src ? `&src=${src}` : ""}#get`);
}

/**
 * 下載試閱後直接登記匯款訂閱：用試閱留下的信箱（kw_lead cookie）建立家長與待付款訂單，
 * 不再寄第二次登入信。不會發登入 session；之後要進後台，仍用信箱登入。
 */
export async function startSampleCheckout(formData: FormData) {
  const jar = await cookies();
  const leadId = jar.get(LEAD_ID_COOKIE)?.value ?? "";
  const db = await getDb();
  const lead = leadId
    ? ((await db.prepare("SELECT id, email, source FROM leads WHERE id = ?").get(leadId)) as
        | { id: string; email: string; source: string }
        | undefined)
    : undefined;
  if (!lead) redirect("/sample?error=" + encodeURIComponent("請先留下信箱領試閱。") + "#get");

  const display_name = String(formData.get("display_name") ?? "").trim().slice(0, 40);
  const gradeRaw = String(formData.get("grade") ?? "");
  const grade = (GRADE_OPTIONS as readonly string[]).includes(gradeRaw) ? gradeRaw : "";
  const plan = String(formData.get("plan") ?? "monthly") === "yearly" ? "yearly" : "monthly";
  const exam_target = String(formData.get("exam_target") ?? "").trim().slice(0, 200);
  if (!display_name || !grade) {
    redirect("/sample?error=" + encodeURIComponent("請填孩子稱呼與年級。") + "#subscribe");
  }
  if ((await seatsRemaining(db)) <= 0) redirect("/waitlist");

  const now = new Date().toISOString();
  let parent = (await db.prepare("SELECT id FROM parents WHERE email = ?").get(lead.email)) as { id: string } | undefined;
  if (!parent) {
    parent = { id: uid("parent") };
    await db.prepare("INSERT INTO parents (id, email, created_at) VALUES (?, ?, ?)").run(parent.id, lead.email, now);
  }
  const { merchantTradeNo } = await import("@/lib/ecpay");
  const childId = uid("child");
  const tradeNo = merchantTradeNo();
  await db.prepare(
    `INSERT INTO children (id, parent_id, display_name, grade, school_progress, exam_target, weak_topics, is_demo, subscription_status, plan, created_at)
     VALUES (?, ?, ?, ?, '', ?, '', 0, 'pending', ?, ?)`,
  ).run(childId, parent.id, display_name, grade, exam_target, plan, now);
  const amount = plan === "yearly" ? SITE.yearlyPrice : SITE.monthlyPrice;
  await db.prepare(
    `INSERT INTO checkout_attempts (id, parent_id, child_id, plan, amount, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
  ).run(tradeNo, parent.id, childId, plan, amount, now);

  if (mailConfigured()) {
    after(async () => {
      try {
        await sendCheckoutAlert({ email: lead.email, displayName: display_name, grade, plan, amount, tradeNo, source: lead.source, createdAt: now });
      } catch (err) {
        console.error("checkout alert failed", err);
      }
    });
  }
  jar.set(LEAD_TRADE_COOKIE, tradeNo, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(`/sample?trade=${encodeURIComponent(tradeNo)}#subscribe`);
}

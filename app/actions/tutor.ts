"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc, LEAD_GRADES } from "@/lib/leads";

/** 家教候補：寫入 leads（source＝tutor-waitlist 或 ?src=）＋ waitlist（note 標【家教】），與 /diag 同一套後台。不寄信。 */
export async function joinTutorWaitlist(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const grade = String(form.get("grade") ?? "");
  const scope = String(form.get("scope") ?? "").trim().slice(0, 300);
  const contact = String(form.get("contact") ?? "").trim().slice(0, 100);
  const src = cleanSrc(form.get("src")) || "tutor";
  const back = (q: string) => redirect(`/tutor?${q}${src !== "tutor" ? `&src=${src}` : ""}#form`);
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back(`error=${encodeURIComponent("請輸入有效的電子信箱。")}`);
  if (!(LEAD_GRADES as readonly string[]).includes(grade)) back(`error=${encodeURIComponent("請選擇孩子年級。")}`);
  if (!scope) back(`error=${encodeURIComponent("請寫想加強的範圍。")}`);
  const now = new Date().toISOString();
  try {
    const db = await getDb();
    await db
      .prepare(
        `INSERT INTO leads (id, email, grade, role, source, utm, hits, created_at, last_seen_at)
         VALUES (?, ?, ?, '家長', ?, ?, 1, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hits = hits + 1, last_seen_at = excluded.last_seen_at,
           grade = CASE WHEN leads.grade = '' THEN excluded.grade ELSE leads.grade END`,
      )
      .run(uid("lead"), email, grade, `tutor-waitlist`, `tutor=1&src=${src}`, now, now);
    await db
      .prepare("INSERT INTO waitlist (id, email, child_grade, note, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(uid("wl"), email, grade, `【家教】${scope}${contact ? `｜聯絡：${contact}` : ""}｜src=${src}`, now);
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, 'tutor_waitlist', ?, ?, ?)")
      .run(uid("ev"), grade, src, now);
  } catch (e) {
    console.error("tutor waitlist failed", e);
    back(`error=${encodeURIComponent("系統忙碌，請稍後再試，或直接寄信給老師。")}`);
  }
  back("ok=1");
}

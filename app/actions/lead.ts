"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { mailConfigured, sendLeadAlert } from "@/lib/mail";
import { cleanSrc, cleanUtm, LEAD_COOKIE, LEAD_GRADES, LEAD_ROLES } from "@/lib/leads";

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

  const jar = await cookies();
  jar.set(LEAD_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(`/sample?ok=1${src ? `&src=${src}` : ""}#get`);
}

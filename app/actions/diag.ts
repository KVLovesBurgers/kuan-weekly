"use server";

import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc, LEAD_ROLES } from "@/lib/leads";
import { cleanAnswers, cleanDiagSet, diagDetails, diagGrantKind, diagSetInfo, gradeDiag, type DiagDetail, type DiagScore } from "@/lib/diag";
import { tex } from "@/components/UnitLesson";
import { TRIAL_PACKS, trialUrl } from "@/lib/trial";

/** 交卷：馬上回分數與弱點單元（不需要信箱、不回詳解）。匿名記一筆 diag_submit。 */
export async function scoreDiag(input: { set: string; answers: Record<string, unknown>; src?: string }): Promise<{ ok: true; score: DiagScore } | { ok: false; error: string }> {
  const set = cleanDiagSet(input.set);
  if (!set) return { ok: false, error: "請先選擇年級。" };
  const score = gradeDiag(set, cleanAnswers(set, input.answers));
  try {
    const db = await getDb();
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, 'diag_submit', ?, ?, ?)")
      .run(uid("ev"), set, cleanSrc(input.src), new Date().toISOString());
  } catch (e) {
    console.error("diag submit event failed", e);
  }
  return { ok: true, score };
}

export type DiagUnlock = { details: DiagDetail[]; packs: { label: string; unit: string; student: string; parent: string }[]; saved: boolean };

/**
 * 留 Email：寫入 leads（source＝?src=，年級依檢測）與 quiz_results（subject＝diag-<set>），
 * 並開通對應的免費一週（lead_followups.kind＝diag_<pack>，status＝granted）。這裡不寄信。
 */
export async function unlockDiag(input: { set: string; answers: Record<string, unknown>; email: string; role?: string; src?: string }): Promise<{ ok: true; data: DiagUnlock } | { ok: false; error: string }> {
  const set = cleanDiagSet(input.set);
  if (!set) return { ok: false, error: "請先選擇年級。" };
  const email = String(input.email ?? "").trim().toLowerCase();
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "請輸入有效的電子信箱。" };
  const role = (LEAD_ROLES as readonly string[]).includes(String(input.role)) ? String(input.role) : "";
  const answers = cleanAnswers(set, input.answers);
  const score = gradeDiag(set, answers);
  const info = diagSetInfo(set);
  const src = cleanSrc(input.src) || "diag";
  const details = diagDetails(set, answers).map((d) => ({ ...d, explanation: tex(d.explanation) }));

  try {
    const db = await getDb();
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO leads (id, email, grade, role, source, utm, hits, created_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hits = hits + 1, last_seen_at = excluded.last_seen_at,
           grade = CASE WHEN leads.grade = '' THEN excluded.grade ELSE leads.grade END,
           role = CASE WHEN leads.role = '' THEN excluded.role ELSE leads.role END`,
      )
      .run(uid("lead"), email, info.grade, role, src, `diag=${set}&diag_score=${score.score}/${score.total}`, now, now);
    const lead = (await db.prepare("SELECT id FROM leads WHERE email = ?").get(email)) as { id: string } | undefined;
    await db
      .prepare(`INSERT INTO quiz_results (id, email, subject, score, total, answers, weak_units, src, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(uid("quiz"), email, `diag-${set}`, score.score, score.total, JSON.stringify(answers), score.weak.join("、"), src, now);
    for (const p of info.packs) {
      await db
        .prepare(`INSERT INTO lead_followups (email, kind, status, sent_at, error) VALUES (?, ?, 'granted', ?, '') ON CONFLICT(email, kind) DO NOTHING`)
        .run(email, diagGrantKind(p), now);
    }
    const packs = lead
      ? info.packs.map((p) => ({ label: TRIAL_PACKS[p].label, unit: TRIAL_PACKS[p].unit.replace(/（[^）]*必考[^）]*）/, ""), student: trialUrl("", lead.id, p, "student"), parent: trialUrl("", lead.id, p, "parent") }))
      : [];
    return { ok: true, data: { details, packs, saved: true } };
  } catch (e) {
    console.error("diag unlock failed", e);
    return { ok: true, data: { details, packs: [], saved: false } };
  }
}

"use server";

import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc, LEAD_ROLES } from "@/lib/leads";
import { cleanMockAnswers, cleanMockSubject, gradeMock, mockDetails, type MockDetail, type MockScore } from "@/lib/mock";
import { tex } from "@/components/UnitLesson";

/** 交卷：回總分、估算級分、各題型與單元得分（不需信箱、不回詳解）。匿名記一筆 mock_submit。 */
export async function scoreMock(input: { subject: string; answers: Record<string, unknown>; src?: string; timedOut?: boolean }): Promise<{ ok: true; score: MockScore } | { ok: false; error: string }> {
  const s = cleanMockSubject(input.subject);
  if (!s) return { ok: false, error: "請先選擇數學A 或數學B。" };
  const score = gradeMock(s, cleanMockAnswers(s, input.answers));
  try {
    const db = await getDb();
    await db
      .prepare("INSERT INTO site_events (id, kind, target, source, created_at) VALUES (?, 'mock_submit', ?, ?, ?)")
      .run(uid("ev"), `${s}${input.timedOut ? "-timeout" : ""}`, cleanSrc(input.src), new Date().toISOString());
  } catch (e) {
    console.error("mock submit event failed", e);
  }
  return { ok: true, score };
}

export type MockUnlock = { details: MockDetail[]; saved: boolean };

/**
 * 留 Email：寫入 leads（source＝?src=，年級＝高三，utm＝mock=A&mock_score=..）與 quiz_results（subject＝mock-A／mock-B），
 * 和 /diag 同一套後台。詳解與弱點分析直接顯示在頁面上；寄信版本等正式上線前再開（MOCK_SEND_MAIL）。
 */
export async function unlockMock(input: { subject: string; answers: Record<string, unknown>; email: string; role?: string; src?: string }): Promise<{ ok: true; data: MockUnlock } | { ok: false; error: string }> {
  const s = cleanMockSubject(input.subject);
  if (!s) return { ok: false, error: "請先選擇數學A 或數學B。" };
  const email = String(input.email ?? "").trim().toLowerCase();
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "請輸入有效的電子信箱。" };
  const role = (LEAD_ROLES as readonly string[]).includes(String(input.role)) ? String(input.role) : "";
  const answers = cleanMockAnswers(s, input.answers);
  const score = gradeMock(s, answers);
  const src = cleanSrc(input.src) || "mock";
  const details = mockDetails(s, answers).map((d) => ({ ...d, explanation: tex(d.explanation) }));
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO leads (id, email, grade, role, source, utm, hits, created_at, last_seen_at)
         VALUES (?, ?, '高三', ?, ?, ?, 1, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hits = hits + 1, last_seen_at = excluded.last_seen_at,
           grade = CASE WHEN leads.grade = '' THEN excluded.grade ELSE leads.grade END,
           role = CASE WHEN leads.role = '' THEN excluded.role ELSE leads.role END`,
      )
      .run(uid("lead"), email, role, src, `mock=${s}&mock_score=${score.score}/100&mock_level=${score.level}`, now, now);
    await db
      .prepare(`INSERT INTO quiz_results (id, email, subject, score, total, answers, weak_units, src, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(uid("quiz"), email, `mock-${s}`, score.score, 100, JSON.stringify(answers), score.weak.join("、"), src, now);
    return { ok: true, data: { details, saved: true } };
  } catch (e) {
    console.error("mock unlock failed", e);
    return { ok: true, data: { details, saved: false } };
  }
}

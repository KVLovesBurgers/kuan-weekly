"use server";

import { getDb } from "@/lib/db";
import { uid } from "@/lib/ids";
import { cleanSrc } from "@/lib/leads";
import { cleanSubject, gradeQuiz, type QuizResult } from "@/lib/quiz";

export async function submitQuiz(input: {
  subject: string;
  email: string;
  answers: Record<string, number>;
  src?: string;
}): Promise<{ ok: true; result: QuizResult; saved: boolean } | { ok: false; error: string }> {
  const subject = cleanSubject(input.subject);
  if (!subject) return { ok: false, error: "請先選擇科目。" };
  const email = String(input.email ?? "").trim().toLowerCase();
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "請輸入有效的電子信箱。" };
  }
  const answers: Record<string, number> = {};
  for (const [k, v] of Object.entries(input.answers ?? {})) {
    const n = Number(v);
    if (/^[AB]\d{2}$/.test(k) && n >= 1 && n <= 5) answers[k] = n;
  }
  const result = gradeQuiz(subject, answers);
  const src = cleanSrc(input.src);
  const tag = `quiz_subject=${subject}&quiz_score=${result.score}/${result.total}`;

  let saved = false;
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    const existing = await db.prepare("SELECT id FROM leads WHERE email = ?").get(email);
    if (existing) {
      await db.prepare("UPDATE leads SET hits = hits + 1, last_seen_at = ? WHERE email = ?").run(now, email);
    } else {
      await db
        .prepare(
          `INSERT INTO leads (id, email, grade, role, source, utm, hits, created_at, last_seen_at)
           VALUES (?, ?, '', '', 'quiz', ?, 1, ?, ?)
           ON CONFLICT(email) DO UPDATE SET hits = hits + 1, last_seen_at = excluded.last_seen_at`,
        )
        .run(uid("lead"), email, tag, now, now);
    }
    await db
      .prepare(
        `INSERT INTO quiz_results (id, email, subject, score, total, answers, weak_units, src, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(uid("quiz"), email, subject, result.score, result.total, JSON.stringify(answers), result.weak.join("、"), src, now);
    saved = true;
    console.log("quiz save ok", subject);
  } catch (e) {
    console.error("quiz save failed", e);
  }
  return { ok: true, result, saved };
}

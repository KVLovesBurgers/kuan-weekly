import { isTestAddress } from "@/lib/followup";

/** 測試來源：boxtest、test、*-sample-track-*、demo 等，不算進漏斗。 */
export function isTestSrc(src: string) {
  return /(^|[-_])(test|boxtest|box|demo|sample-track|qa)([-_]|$)/.test(src) || /test/.test(src);
}

export type FunnelRow = { src: string; quizIn: number; quizLead: number; sampleIn: number; sampleLead: number };

type Db = { prepare: (sql: string) => { all: (...a: unknown[]) => Promise<unknown[]> | unknown[] } };

/**
 * 依 ?src= 分組的 /quiz 與 /sample 漏斗。
 * 進入＝quiz_view／sample_view 事件次數（匿名，同一人重整會重複算）。
 * 留資料＝/quiz 交卷留信箱（quiz_results，同信箱只算一次）；/sample 第一次留信箱（leads，source 不是 quiz）。
 * 排除測試信箱（isTestAddress）與測試來源（isTestSrc）。
 */
export async function funnelBySrc(db: Db, days: number, now = Date.now()): Promise<FunnelRow[]> {
  const since = new Date(now - days * 86400000).toISOString();
  const views = (await db
    .prepare("SELECT kind, source, COUNT(*) AS n FROM site_events WHERE kind IN ('quiz_view','sample_view') AND created_at >= ? GROUP BY kind, source")
    .all(since)) as { kind: string; source: string; n: number }[];
  const quiz = (await db.prepare("SELECT email, src FROM quiz_results WHERE created_at >= ?").all(since)) as { email: string; src: string }[];
  const leads = (await db.prepare("SELECT email, source FROM leads WHERE created_at >= ? AND source <> 'quiz'").all(since)) as { email: string; source: string }[];

  const rows = new Map<string, FunnelRow>();
  const row = (src: string) => {
    const k = src || "direct";
    if (!rows.has(k)) rows.set(k, { src: k, quizIn: 0, quizLead: 0, sampleIn: 0, sampleLead: 0 });
    return rows.get(k)!;
  };
  for (const v of views) {
    if (isTestSrc(v.source)) continue;
    const r = row(v.source);
    if (v.kind === "quiz_view") r.quizIn += Number(v.n);
    else r.sampleIn += Number(v.n);
  }
  const seenQuiz = new Set<string>();
  for (const q of quiz) {
    const e = q.email.trim().toLowerCase();
    if (isTestAddress(e) || isTestSrc(q.src) || seenQuiz.has(e)) continue;
    seenQuiz.add(e);
    row(q.src).quizLead++;
  }
  for (const l of leads) {
    if (isTestAddress(l.email) || isTestSrc(l.source)) continue;
    row(l.source).sampleLead++;
  }
  return [...rows.values()].sort((a, b) => b.quizIn + b.sampleIn - (a.quizIn + a.sampleIn) || b.quizLead + b.sampleLead - (a.quizLead + a.sampleLead));
}

export const rate = (lead: number, n: number) => (n > 0 ? `${((lead / n) * 100).toFixed(1)}%` : "—");

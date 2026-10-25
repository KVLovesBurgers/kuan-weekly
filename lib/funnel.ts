import { isTestAddress } from "@/lib/followup";

/** 測試來源：boxtest、test、*-sample-track-*、demo 等，不算進漏斗。 */
export function isTestSrc(src: string) {
  return /(^|[-_])(test|boxtest|box|demo|sample-track|qa)([-_]|$)/.test(src) || /test/.test(src);
}

export type FunnelRow = { src: string; quizIn: number; quizLead: number; sampleIn: number; sampleLead: number; diagIn: number; diagLead: number; mockIn: number; mockLead: number };

type Db = { prepare: (sql: string) => { all: (...a: unknown[]) => Promise<unknown[]> | unknown[] } };

/**
 * 依 ?src= 分組的 /quiz、/sample 與 /diag（段考弱點檢測）漏斗。
 * 進入＝quiz_view／sample_view 事件次數（匿名，同一人重整會重複算）。
 * 留資料＝/quiz 交卷留信箱（quiz_results，同信箱只算一次）；/sample 第一次留信箱（leads，source 不是 quiz）。
 * 排除測試信箱（isTestAddress）與測試來源（isTestSrc）。
 */
export async function funnelBySrc(db: Db, days: number, now = Date.now()): Promise<FunnelRow[]> {
  const since = new Date(now - days * 86400000).toISOString();
  const views = (await db
    .prepare("SELECT kind, source, COUNT(*) AS n FROM site_events WHERE kind IN ('quiz_view','sample_view','diag_view','mock_view') AND created_at >= ? GROUP BY kind, source")
    .all(since)) as { kind: string; source: string; n: number }[];
  const quiz = (await db.prepare("SELECT email, src, subject FROM quiz_results WHERE created_at >= ?").all(since)) as { email: string; src: string; subject: string }[];
  const leads = (await db.prepare("SELECT email, source FROM leads WHERE created_at >= ? AND source <> 'quiz' AND utm NOT LIKE 'diag=%' AND utm NOT LIKE 'mock=%'").all(since)) as { email: string; source: string }[];

  const rows = new Map<string, FunnelRow>();
  const row = (src: string) => {
    const k = src || "direct";
    if (!rows.has(k)) rows.set(k, { src: k, quizIn: 0, quizLead: 0, sampleIn: 0, sampleLead: 0, diagIn: 0, diagLead: 0, mockIn: 0, mockLead: 0 });
    return rows.get(k)!;
  };
  for (const v of views) {
    if (isTestSrc(v.source)) continue;
    const r = row(v.source);
    if (v.kind === "quiz_view") r.quizIn += Number(v.n);
    else if (v.kind === "diag_view") r.diagIn += Number(v.n);
    else if (v.kind === "mock_view") r.mockIn += Number(v.n);
    else r.sampleIn += Number(v.n);
  }
  const seenQuiz = new Set<string>();
  const seenDiag = new Set<string>();
  const seenMock = new Set<string>();
  for (const q of quiz) {
    const e = q.email.trim().toLowerCase();
    if (String(q.subject).startsWith("mock-")) {
      if (isTestAddress(e) || isTestSrc(q.src) || seenMock.has(e)) continue;
      seenMock.add(e);
      row(q.src).mockLead++;
      continue;
    }
    const isDiag = String(q.subject).startsWith("diag-");
    const seen = isDiag ? seenDiag : seenQuiz;
    if (isTestAddress(e) || isTestSrc(q.src) || seen.has(e)) continue;
    seen.add(e);
    if (isDiag) row(q.src).diagLead++;
    else row(q.src).quizLead++;
  }
  for (const l of leads) {
    if (isTestAddress(l.email) || isTestSrc(l.source)) continue;
    row(l.source).sampleLead++;
  }
  return [...rows.values()].sort((a, b) => b.quizIn + b.sampleIn + b.diagIn - (a.quizIn + a.sampleIn + a.diagIn) || b.quizLead + b.sampleLead + b.diagLead - (a.quizLead + a.sampleLead + a.diagLead));
}

export const rate = (lead: number, n: number) => (n > 0 ? `${((lead / n) * 100).toFixed(1)}%` : "—");

import raw from "@/data/mock-questions.json";

/** 學測免費線上模擬考（數A／數B）。題目與驗算：scripts/mock-build.py。 */
export type MockSubject = "A" | "B";
export type MockType = "single" | "multi" | "fill";
export type MockQuestion = {
  id: string; subject: MockSubject; no: number; type: MockType; points: number; unit: string; level: number;
  stem: string; options: string[] | null; answer: number | number[] | string; format: string | null; explanation: string; group: string | null;
};
export type MockAnswer = number | number[] | string;

export const MOCK_MINUTES = 100;
/** 全國統一開放：2026/12/19（六）00:00 到 12/20（日）23:59（台北時間）；之後改為隨時可考。 */
export const MOCK_OPEN = "2026-12-19T00:00:00+08:00";
export const MOCK_EVENT_END = "2026-12-20T23:59:59+08:00";
export type MockPhase = "before" | "event" | "anytime";
export function mockPhase(now = Date.now()): MockPhase {
  if (now < Date.parse(MOCK_OPEN)) return "before";
  if (now <= Date.parse(MOCK_EVENT_END)) return "event";
  return "anytime";
}

export const MOCK_SUBJECTS: { id: MockSubject; label: string; scope: string }[] = [
  { id: "A", label: "數學A", scope: "單選 6 題、多選 6 題、選填 5 題、混合題組 3 題" },
  { id: "B", label: "數學B", scope: "單選 7 題、多選 5 題、選填 5 題、混合題組 3 題" },
];

const ALL = raw as MockQuestion[];
export const cleanMockSubject = (v: unknown): MockSubject | "" => (v === "A" || v === "B" ? v : "");
export const mockQuestions = (s: MockSubject) => ALL.filter((q) => q.subject === s);

export function cleanMockAnswers(s: MockSubject, input: Record<string, unknown>) {
  const out: Record<string, MockAnswer> = {};
  for (const q of mockQuestions(s)) {
    const v = input?.[q.id];
    if (q.type === "single") {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1 && n <= (q.options?.length ?? 5)) out[q.id] = n;
    } else if (q.type === "multi") {
      if (Array.isArray(v)) {
        const arr = [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 5))].sort();
        if (arr.length) out[q.id] = arr;
      }
    } else if (typeof v === "string") {
      const t = v.slice(0, (q.answer as string).length).replace(/[^0-9-]/g, " ");
      if (t.trim()) out[q.id] = t;
    }
  }
  return out;
}

/** 單題得分：多選依學測規則，答錯 k 個選項得 (n−2k)/n，低於 0 以 0 計。選填須全部格子正確。 */
export function scoreQuestion(q: MockQuestion, a: MockAnswer | undefined): number {
  if (a === undefined) return 0;
  if (q.type === "single") return a === q.answer ? q.points : 0;
  if (q.type === "multi") {
    const ans = new Set(q.answer as number[]);
    const chosen = new Set(a as number[]);
    let wrong = 0;
    for (let i = 1; i <= 5; i++) if (ans.has(i) !== chosen.has(i)) wrong++;
    return Math.max(0, Math.round(((5 - 2 * wrong) / 5) * q.points * 100) / 100);
  }
  return a === q.answer ? q.points : 0;
}

/**
 * 級分估算：近五年學測數學「每級分約 6.67 分（滿分 100／15）」的等距換算，只供參考。
 * 正式級分依當年全體考生前 1% 平均換算，每年不同。
 */
export const estimateLevel = (score: number) => (score <= 0 ? 0 : Math.min(15, Math.ceil(score / (100 / 15) - 1e-9)));

export type MockScore = {
  subject: MockSubject;
  score: number;
  level: number;
  parts: { name: string; got: number; full: number }[];
  units: { unit: string; got: number; full: number }[];
  weak: string[];
  marks: { id: string; got: number; full: number }[];
};

export function gradeMock(s: MockSubject, answers: Record<string, MockAnswer>): MockScore {
  const qs = mockQuestions(s);
  const marks = qs.map((q) => ({ id: q.id, got: scoreQuestion(q, answers[q.id]), full: q.points, q }));
  const sum = (xs: typeof marks) => ({ got: Math.round(xs.reduce((t, m) => t + m.got, 0) * 100) / 100, full: xs.reduce((t, m) => t + m.full, 0) });
  const parts = [
    { name: "單選題", ...sum(marks.filter((m) => m.q.type === "single" && !m.q.group)) },
    { name: "多選題", ...sum(marks.filter((m) => m.q.type === "multi")) },
    { name: "選填題", ...sum(marks.filter((m) => m.q.type === "fill" && !m.q.group)) },
    { name: "混合題組", ...sum(marks.filter((m) => m.q.group)) },
  ];
  const map = new Map<string, { unit: string; got: number; full: number }>();
  for (const m of marks) {
    const u = map.get(m.q.unit) ?? { unit: m.q.unit, got: 0, full: 0 };
    u.got += m.got;
    u.full += m.full;
    map.set(m.q.unit, u);
  }
  const units = [...map.values()].map((u) => ({ ...u, got: Math.round(u.got * 100) / 100 }));
  const weak = units.filter((u) => u.got / u.full < 0.6).sort((a, b) => a.got / a.full - b.got / b.full).map((u) => u.unit);
  const score = Math.round(marks.reduce((t, m) => t + m.got, 0) * 100) / 100;
  return { subject: s, score, level: estimateLevel(score), parts, units, weak, marks: marks.map(({ id, got, full }) => ({ id, got, full })) };
}

export type MockDetail = { id: string; chosen: MockAnswer | null; answer: MockAnswer; got: number; full: number; explanation: string };
export function mockDetails(s: MockSubject, answers: Record<string, MockAnswer>): MockDetail[] {
  return mockQuestions(s).map((q) => ({ id: q.id, chosen: answers[q.id] ?? null, answer: q.answer, got: scoreQuestion(q, answers[q.id]), full: q.points, explanation: q.explanation }));
}

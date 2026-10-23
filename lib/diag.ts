import raw from "@/data/diag-questions.json";

/** 免費段考弱點檢測（第二次段考 11/25-26 範圍）。題目與驗算：scripts/diag-build.py（國中、高三）、scripts/diag-build-g10g11.py（高一、高二，108 課綱）。 */
export type DiagSet = "g7" | "g8" | "g9" | "g10" | "g11" | "g12";
export type DiagQuestion = { id: string; set: DiagSet; unit: string; stem: string; options: string[]; answer: number; explanation: string };

export const DIAG_SETS: { id: DiagSet; level: "國中" | "高中"; label: string; scope: string; grade: string; packs: string[] }[] = [
  { id: "g7", level: "國中", label: "國一", scope: "因數倍數、質因數分解、最大公因數與最小公倍數、分數四則運算", grade: "國一", packs: ["g7_frac"] },
  { id: "g8", level: "國中", label: "國二", scope: "平方根與估值、根式運算、畢氏定理、坐標距離", grade: "國二", packs: ["g8_sqrt"] },
  { id: "g9", level: "國中", label: "國三", scope: "圓心角與圓周角、弦心距、切線、圓內接四邊形、扇形", grade: "國三", packs: ["g9_circle"] },
  // 高一、高二目前沒有對應的試用週練包（packs 空陣列）：流程照走、只是不開通週練，頁面文字依 hasDiagPacks 調整。
  { id: "g10", level: "高中", label: "高一", scope: "指數與常用對數、直線方程式、點到直線距離、圓方程式、圓與直線（108 課綱第一冊）", grade: "高一", packs: [] },
  { id: "g11", level: "高中", label: "高二", scope: "弧度量、三角函數圖形、和差角公式、疊合（108 課綱第三冊A）", grade: "高二", packs: [] },
  { id: "g12", level: "高中", label: "高三（學測複習）", scope: "指數與對數、排列組合、機率", grade: "高三", packs: ["g12_log_A", "g12_prob_B"] },
];

const ALL = raw as DiagQuestion[];
export const cleanDiagSet = (v: unknown): DiagSet | "" => (DIAG_SETS.some((s) => s.id === v) ? (v as DiagSet) : "");
export const diagQuestions = (set: DiagSet) => ALL.filter((q) => q.set === set);
export const diagSetInfo = (set: DiagSet) => DIAG_SETS.find((s) => s.id === set)!;
export const hasDiagPacks = (set: DiagSet) => diagSetInfo(set).packs.length > 0;

export type DiagScore = {
  set: DiagSet;
  score: number;
  total: number;
  units: { unit: string; correct: number; total: number }[];
  weak: string[];
  marks: { id: string; correct: boolean }[];
};
export type DiagDetail = { id: string; chosen: number; answer: number; correct: boolean; explanation: string };

export function cleanAnswers(set: DiagSet, input: Record<string, unknown>) {
  const ids = new Set(diagQuestions(set).map((q) => q.id));
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(input ?? {})) {
    const n = Number(v);
    if (ids.has(k) && Number.isInteger(n) && n >= 1 && n <= 5) out[k] = n;
  }
  return out;
}

export function gradeDiag(set: DiagSet, answers: Record<string, number>): DiagScore {
  const qs = diagQuestions(set);
  const marks = qs.map((q) => ({ id: q.id, unit: q.unit, correct: answers[q.id] === q.answer }));
  const map = new Map<string, { unit: string; correct: number; total: number }>();
  for (const m of marks) {
    const u = map.get(m.unit) ?? { unit: m.unit, correct: 0, total: 0 };
    u.total += 1;
    if (m.correct) u.correct += 1;
    map.set(m.unit, u);
  }
  const units = [...map.values()];
  const weak = units.filter((u) => u.correct < u.total).sort((a, b) => a.correct / a.total - b.correct / b.total).map((u) => u.unit);
  return { set, score: marks.filter((m) => m.correct).length, total: qs.length, units, weak, marks: marks.map(({ id, correct }) => ({ id, correct })) };
}

export function diagDetails(set: DiagSet, answers: Record<string, number>): DiagDetail[] {
  return diagQuestions(set).map((q) => ({ id: q.id, chosen: answers[q.id] ?? 0, answer: q.answer, correct: answers[q.id] === q.answer, explanation: q.explanation }));
}

/** 檢測留信箱後開通的免費一週（lead_followups.kind），試用下載路由會認這個紀錄；不寄信。 */
export const diagGrantKind = (packId: string) => `diag_${packId}`;

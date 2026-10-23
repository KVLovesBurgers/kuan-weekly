/**
 * 單元清單（/units）。/units 是唯一的練習題頁：免費練習題（lib/practice-sheets.ts）依 unit 欄位分組到這裡，
 * 部分單元另有一份「3 題附詳解」單元包 PDF（pack，放在 public/units/<slug>.pdf）。
 * 一個單元只要有一份已公開的練習題或單元包就會出現；練習題依各自的 publishAt 公開。
 * 舊網址 /practice 會 308 轉到 /units（next.config.ts）。
 */
import { PRACTICE_SHEETS, type PracticeSheet } from "@/lib/practice-sheets";
import { UNIT_LESSONS } from "@/lib/unit-lessons";

export type UnitLevel = "國中" | "高中" | "SAT";

export type UnitPack = {
  slug: string;
  title: string;
  level: UnitLevel;
  track: "jh" | "gsat" | "sat";
  topic: string;
  /** 單元包 PDF（3 題附詳解）；沒有就只列練習題。 */
  pack?: { points: string[]; pages: number; publishAt: string };
};

export const UNIT_PACKS: UnitPack[] = [
  { slug: "jh-mult", title: "乘法公式", level: "國中", track: "jh", topic: "和的平方、差的平方、平方差，兩個平方相減要加括號" },
  { slug: "jh-circle", title: "圓（國三）", level: "國中", track: "jh", topic: "弧長與扇形、圓心角與圓周角、弦切角、圓內接四邊形" },
  {
    slug: "gsat-log",
    title: "指數與對數（log）",
    level: "高中",
    track: "gsat",
    topic: "對數的定義、指數律、對數律、換底公式、位數與最高位數字",
    pack: {
      points: [
        "第 1 題（基礎）：同底的 log 相加減",
        "第 2 題（進階）：2^a ＝ 3^b ＝ 6，用換底求 1/a ＋ 1/b",
        "第 3 題（學測程度）：3^50 是幾位數、最高位數字是多少",
      ],
      pages: 3,
      publishAt: "2026-10-19T00:00:00+08:00",
    },
  },
  { slug: "trig", title: "三角函數", level: "高中", track: "gsat", topic: "tan 與斜率、單位圓與平方關係、和角公式、正弦與餘弦定理" },
  { slug: "vector", title: "向量", level: "高中", track: "gsat", topic: "向量加法頭接尾、坐標表示、長度、內積與垂直" },
  { slug: "prob", title: "排列組合與機率", level: "高中", track: "gsat", topic: "排列、組合、重複組合、古典機率與樣本空間" },
  { slug: "series", title: "數列與級數", level: "高中", track: "gsat", topic: "等差數列、等差級數求和" },
  { slug: "circle-eq", title: "圓方程式", level: "高中", track: "gsat", topic: "圓心半徑、配方、點與圓的關係、切線" },
  { slug: "stats", title: "數據分析（標準差）", level: "高中", track: "gsat", topic: "平均與標準差：加常數、乘倍數的變化" },
  { slug: "abs-ineq", title: "絕對值不等式", level: "高中", track: "gsat", topic: "絕對值就是距離：小於夾中間、大於往兩邊" },
  { slug: "sat-algebra", title: "Digital SAT 代數", level: "SAT", track: "sat", topic: "Linear equations、Linear functions、公式變形，英文原題風格附中文詳解" },
];

/** 沒填 unit 的練習題歸到這裡。 */
const OTHER: UnitPack = { slug: "other", title: "其他", level: "高中", track: "gsat", topic: "其他單元的練習題" };

export const unitPdf = (slug: string) => `/units/${slug}.pdf`;
/** 每個單元的分享圖：public/units/<slug>-og.png（1200×630，以 scripts/unit-og.py 產生）。 */
export const unitOg = (slug: string) => `/units/${slug}-og.png`;

const isLive = (iso: string, now: Date) => new Date(iso).getTime() <= now.getTime();

/** 單元已公開的練習題，新到舊。 */
export function unitSheets(slug: string, now = new Date()): PracticeSheet[] {
  const known = new Set(UNIT_PACKS.map((u) => u.slug));
  return PRACTICE_SHEETS.filter((s) => isLive(s.publishAt, now))
    .filter((s) => (slug === "other" ? !s.unit || !known.has(s.unit) : s.unit === slug))
    .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
}

export const hasLivePack = (u: UnitPack, now = new Date()) => !!u.pack && isLive(u.pack.publishAt, now);

/** 單元頁上有完整詳解（lib/unit-lessons.ts）。 */
export const hasLesson = (u: UnitPack) => !!UNIT_LESSONS[u.slug];

/** 已公開的單元（有單元包、至少一份練習題，或網頁上有完整詳解），依原陣列順序。 */
export function liveUnitPacks(now = new Date()) {
  const list = [...UNIT_PACKS, OTHER];
  return list.filter((u) => hasLivePack(u, now) || unitSheets(u.slug, now).length > 0 || hasLesson(u));
}

export function findUnitPack(slug: string, now = new Date()) {
  return liveUnitPacks(now).find((u) => u.slug === slug);
}


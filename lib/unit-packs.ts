/**
 * 單元包清單（/units）。每個單元一份 PDF：3 題由淺到深，附觀念、圖和逐步詳解。
 * 新增單元＝在陣列加一筆，PDF 放到 public/units/<slug>.pdf。
 * publishAt：公開時間（台北時間）；在這之前頁面不會顯示該筆。
 */
export type UnitPack = {
  slug: string;
  title: string;
  level: "國中" | "高中" | "SAT";
  track: "jh" | "gsat" | "sat";
  topic: string;
  points: string[];
  pages: number;
  publishAt: string;
};

export const UNIT_PACKS: UnitPack[] = [
  {
    slug: "gsat-log",
    title: "指數與對數（log）",
    level: "高中",
    track: "gsat",
    topic: "對數律、指數式換對數式、換底公式、位數與最高位數字",
    points: [
      "第 1 題（基礎）：同底的 log 相加減",
      "第 2 題（進階）：2^a ＝ 3^b ＝ 6，用換底求 1/a ＋ 1/b",
      "第 3 題（學測程度）：3^50 是幾位數、最高位數字是多少",
    ],
    pages: 3,
    publishAt: "2026-10-19T00:00:00+08:00",
  },
];

export const unitPdf = (slug: string) => `/units/${slug}.pdf`;
/** 每個單元包的分享圖：public/units/<slug>-og.png（1200×630，以 Pillow 產生）。 */
export const unitOg = (slug: string) => `/units/${slug}-og.png`;

/** 已公開的單元包，依原陣列順序。 */
export function liveUnitPacks(now = new Date()) {
  return UNIT_PACKS.filter((u) => new Date(u.publishAt).getTime() <= now.getTime());
}

export function findUnitPack(slug: string, now = new Date()) {
  return liveUnitPacks(now).find((u) => u.slug === slug);
}

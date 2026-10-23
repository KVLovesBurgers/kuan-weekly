export const SITE = {
  name: "寬數週練",
  brand: "寬數",
  teacher: "吳寬老師",
  tagline: "觀念拆細，路才走得穩",
  /** 國中月費（基準價）；依年級的月費請用 monthlyPriceFor(grade)，見 TIER_PRICES。 */
  monthlyPrice: 799,
  /** 年繳目前只適用國中。 */
  yearlyPrice: 7990,
  currency: "NT$",
  oneOnOneUrl: "https://kuanmath.vercel.app",
  contactEmail: "jjredick365@gmail.com",
  url: "https://kuan-weekly.vercel.app",
};

/** 公開導流：IG／臉書粉專私訊關鍵字。 */
export const SOCIAL = {
  handle: "@saber_math",
  instagramUrl: "https://www.instagram.com/saber_math/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61594502669915",
  facebookName: "吳寬數學",
  youtubeChannelUrl: "https://www.youtube.com/channel/UCD_4earF60XJTSRYGCkU4Ug",
  youtubeName: "Saber數學",
  weeklyKeyword: "週練",
  satKeyword: "SAT講義",
} as const;

/** Digital SAT 完整數學講義 v1.0（取代舊五週版，2026-10-18 起只賣完整版）。交貨走私訊＋Drive 個別分享。 */
export const SAT_BOOK = {
  name: "Digital SAT 完整數學講義 v1.0",
  price: 990,
  contents: "21 章觀念練習本＋解答本＋2 套模考與附錄",
} as const;

/** 首頁「看吳寬老師怎麼教」：畫圖一眼懂 Shorts。 */
export const SHORTS = [
  { id: "UnimTBJBMbE", title: "sin(θ+90°)＝cosθ", note: "轉 90 度，畫圖一眼懂" },
  { id: "aHl2mSBsNEw", title: "(a+b)² ≠ a²+b²", note: "用面積看出 2ab" },
  { id: "3kKvHhoFmxE", title: "(a−b)² 展開別漏項", note: "切掉的那塊在哪裡" },
  { id: "f47RMUhjKs8", title: "勾股定理 a²+b²＝c²", note: "面積一眼懂" },
] as const;

/** 公開試閱檔（示範週：國一 1-1 正負數與數線・學生題本 4 頁＋家長解答 4 頁）。 */
export const SAMPLE = {
  unit: "國一 1-1 正負數與數線",
  studentPdf: "/samples/kuan-weekly-sample-student.pdf",
  parentPdf: "/samples/kuan-weekly-sample-parent.pdf",
  studentPreview: "/samples/student-preview.webp",
  parentPreview: "/samples/parent-preview.webp",
} as const;

/** 試閱依年級分三份：國中（原本的國一 1-1）、高中學測、SAT。 */
export const SAMPLES = {
  jh: {
    label: "國中",
    unit: "國一 1-1 正負數與數線",
    studentPdf: "/samples/kuan-weekly-sample-student.pdf",
    parentPdf: "/samples/kuan-weekly-sample-parent.pdf",
    studentName: "寬數週練試閱-國一1-1-學生題本.pdf",
    parentName: "寬數週練試閱-國一1-1-家長解答.pdf",
    studentPages: 4,
    parentPages: 4,
    parentTitle: "家長解答",
  },
  gsat: {
    label: "高中學測",
    unit: "高三・學測必錯 5 題",
    studentPdf: "/samples/kuan-weekly-sample-gsat-student.pdf",
    parentPdf: "/samples/kuan-weekly-sample-gsat-parent.pdf",
    studentName: "寬數週練試閱-學測必錯5題-學生題本.pdf",
    parentName: "寬數週練試閱-學測必錯5題-家長解答.pdf",
    studentPages: 2,
    parentPages: 2,
    parentTitle: "家長解答",
  },
  sat: {
    label: "SAT Math",
    unit: "Digital SAT Math Ch.1 一元一次方程式",
    studentPdf: "/samples/kuan-weekly-sample-sat-student.pdf",
    parentPdf: "/samples/kuan-weekly-sample-sat-parent.pdf",
    studentName: "寬數試閱-SAT-Ch1-講義.pdf",
    parentName: "寬數試閱-SAT-Ch1-解答本.pdf",
    studentPages: 12,
    parentPages: 4,
    parentTitle: "解答本",
  },
} as const;

/** 目前主收款：私人匯款。綠界信用卡／ATM 審過後再開線上刷卡。 */
export const BANK_TRANSFER = {
  bankName: "兆豐國際商業銀行",
  bankCode: "017",
  accountName: "吳昱寬",
  accountNumber: "02613264584",
  proofEmail: SITE.contactEmail,
} as const;

export function ecpayPaymentsEnabled() {
  return process.env.ECPAY_PAYMENTS_ENABLED === "1";
}

/** 剩餘名額少於此數才公開顯示「尚餘 N 名」，否則只寫「限 N 名」。 */
export const SHOW_REMAINING_BELOW = 15;

/** 全站統一的即時名額文字：剩 X 名，或已滿，加入候補。 */
export function seatLabel(remaining: number) {
  const cap = seatCap();
  if (remaining <= 0) return { text: `限 ${cap} 名 · 已滿，加入候補`, short: "已滿，加入候補", full: true, remaining: null as number | null };
  if (remaining < SHOW_REMAINING_BELOW) return { text: `限 ${cap} 名 · 剩 ${remaining} 名`, short: `剩 ${remaining} 名`, full: false, remaining: null as number | null };
  return { text: `限 ${cap} 名`, short: `限 ${cap} 名`, full: false, remaining: null as number | null };
}

/** 116 學年度學測：116 年 1 月 22 日至 24 日（大考中心 116 學年度簡章）。 */
export const GSAT_DATE = "2027-01-22T00:00:00+08:00";

export function gsatDaysLeft(now = new Date()) {
  const ms = new Date(GSAT_DATE).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export const money = (n: number) => n.toLocaleString("en-US");

/**
 * 週練訂閱收費（2026-10-24 使用者決定）：所有年級第一週免費，從第二週起才開始計算一個月，依年級分三級（每位孩子）：
 * 國中（國一、國二、國三）NT$799／高中（高一、高二、高三）NT$999／SAT NT$1,099。
 * 年繳 NT$7,990 目前只適用國中；高中與 SAT 沒有年繳定價，不顯示、不收年繳。
 */
export type PriceTier = "junior" | "senior" | "sat";
export const TIER_PRICES: Record<PriceTier, { label: string; grades: string; monthly: number }> = {
  junior: { label: "國中", grades: "國一、國二、國三", monthly: 799 },
  senior: { label: "高中", grades: "高一、高二、高三", monthly: 999 },
  sat: { label: "SAT", grades: "SAT Math", monthly: 1099 },
};
/** 年級 → 價格級距。小學未定價：沿用原本 799（不另外發明價格），回報中已列出。 */
export function priceTier(grade: string): PriceTier {
  if (grade === "SAT" || grade === "SAT Math") return "sat";
  if (grade === "高一" || grade === "高二" || grade === "高三") return "senior";
  return "junior";
}
export function monthlyPriceFor(grade: string) {
  return TIER_PRICES[priceTier(grade)].monthly;
}
/** 年繳只適用國中（含原本就有的小學選項）；高中與 SAT 沒有年繳。 */
export function yearlyAllowed(grade: string) {
  return priceTier(grade) === "junior";
}
export const NO_YEARLY_MSG = "年繳目前只適用國中；高中與 SAT 請選月繳。";
const fmt = (n: number) => `${SITE.currency}${money(n)}`;
/** 「國中 NT$799／高中 NT$999／SAT NT$1,099」 */
export const PRICE_TIERS_LINE = (Object.keys(TIER_PRICES) as PriceTier[]).map((k) => `${TIER_PRICES[k].label} ${fmt(TIER_PRICES[k].monthly)}`).join("／");
const yearlySave = () => SITE.monthlyPrice * 12 - SITE.yearlyPrice;
/** 下拉選單用：月繳依年級；年繳僅國中。 */
export const PLAN_MONTHLY_LABEL = `月繳 ${(Object.keys(TIER_PRICES) as PriceTier[]).map((k) => `${TIER_PRICES[k].label} ${money(TIER_PRICES[k].monthly)}`).join("／")} /月`;
export const PLAN_YEARLY_LABEL = `年繳 ${fmt(SITE.yearlyPrice)} /年（僅國中，省 ${fmt(yearlySave())}）`;
export const FREE_WEEK_RULE = "第一週免費，從第二週起才開始計算一個月";
/** 「第一週免費，從第二週起才開始計算一個月：國中 NT$799／高中 NT$999／SAT NT$1,099（每月、每位孩子）」 */
export const PRICE_RULE = `${FREE_WEEK_RULE}：${PRICE_TIERS_LINE}（每月、每位孩子）`;
export const YEARLY_NOTE = `年繳 ${fmt(SITE.yearlyPrice)} 目前只適用國中`;
/** 匯款處用句（使用者 2026-10-24 核准原文） */
export const PAY_NOTE = "第一週免費。請在第二週開始前匯款，涵蓋從第二週起的一個月。";
/** 各年級第一週實際可得內容（據實，供頁面與回報使用）。 */
export const FIRST_WEEK_CONTENT =
  "目前第一週可領的內容：國一、國二、國三、高三是完整一週題本（學生題本 15 題＋家長解答）；高一、高二是學測必錯 5 題試閱；SAT 是 Digital SAT Math 講義第 1 章與解答本。";

export function seatCap() {
  const n = Number(process.env.SEAT_CAP ?? "20");
  return Number.isFinite(n) && n > 0 ? n : 20;
}

export function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function adminEmail() {
  return (process.env.ADMIN_EMAIL ?? "admin@kuan.tw").trim().toLowerCase();
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export const DEMO_PARENT_EMAIL = "parent@demo.kuan.tw";

/** 年級清單集中於此，改完重整頁面即可。 */
export const GRADE_OPTIONS = [
  "小一",
  "小二",
  "小三",
  "小四",
  "小五",
  "小六",
  "國一",
  "國二",
  "國三",
  "高一",
  "高二",
  "高三",
  "SAT Math",
] as const;

/** 週練難度回饋：僅三選一，不含資優／競賽。 */
export const DIFFICULTY_OPTIONS = [
  ["too_easy", "偏易"],
  ["ok", "剛好"],
  ["too_hard", "偏難"],
] as const;

export const COMPLETION_OPTIONS = [
  ["none", "還沒寫"],
  ["some", "寫了一部分"],
  ["all", "全部寫完"],
] as const;

/** 開通時間提示：只在 2026-11-02（台北）以前顯示，過了自動消失，不延期。 */
export const START_BY_DEADLINE = "2026-11-02T00:00:00+08:00";
export const START_BY_NOTE = "11/2 前開通，第二次段考前可以練滿 3 週";
export function startByNote(now = new Date()) {
  return now.getTime() < new Date(START_BY_DEADLINE).getTime() ? START_BY_NOTE : "";
}

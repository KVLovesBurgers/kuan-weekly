export const SITE = {
  name: "寬數週練",
  brand: "寬數",
  teacher: "吳寬老師",
  tagline: "觀念拆細，路才走得穩",
  monthlyPrice: 799,
  yearlyPrice: 7990,
  currency: "NT$",
  oneOnOneUrl: "https://kuanmath.vercel.app",
  contactEmail: "jjredick365@gmail.com",
  url: "https://kuan-weekly.vercel.app",
};

/** 公開導流：Threads／IG 私訊關鍵字。 */
export const SOCIAL = {
  handle: "@saber_math",
  threadsUrl: "https://www.threads.com/@saber_math",
  instagramUrl: "https://www.instagram.com/saber_math/",
  youtubeChannelUrl: "https://www.youtube.com/channel/UCD_4earF60XJTSRYGCkU4Ug",
  youtubeName: "Saber數學",
  weeklyKeyword: "週練",
  satKeyword: "SAT講義",
} as const;

/** 首頁「看吳寬老師怎麼教」：畫圖一眼懂 Shorts。 */
export const SHORTS = [
  { id: "UnimTBJBMbE", title: "sin(θ+90°)＝cosθ", note: "轉 90 度，畫圖一眼懂" },
  { id: "aHl2mSBsNEw", title: "(a+b)² ≠ a²+b²", note: "用面積看出 2ab" },
  { id: "3kKvHhoFmxE", title: "(a−b)² 展開別漏項", note: "切掉的那塊在哪裡" },
  { id: "f47RMUhjKs8", title: "勾股定理 a²+b²＝c²", note: "面積一眼懂" },
] as const;

/** 公開試閱檔（示範週：國一 1-1 正負數與數線・進階卷）。 */
export const SAMPLE = {
  unit: "國一 1-1 正負數與數線（進階卷）",
  studentPdf: "/samples/kuan-weekly-sample-student.pdf",
  parentPdf: "/samples/kuan-weekly-sample-parent.pdf",
  studentPreview: "/samples/student-preview.webp",
  parentPreview: "/samples/parent-preview.webp",
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

export function seatLabel(remaining: number) {
  const cap = seatCap();
  if (remaining <= 0) return { text: `限 ${cap} 名 · 目前已滿`, remaining: null as number | null };
  if (remaining < SHOW_REMAINING_BELOW) return { text: `限 ${cap} 名 · 尚餘`, remaining };
  return { text: `限 ${cap} 名 · 額滿轉候補`, remaining: null as number | null };
}

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

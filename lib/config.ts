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

/** 年級範例題本（約 5 題）。實際題本依孩子需求客製。 */
export const GRADE_SAMPLES_NOTE =
  "以下是範例題本（約 5 題），實際題本依孩子需求客製：填好孩子的年級、進度與弱點，吳寬老師再出專屬題本。";
export const GRADE_SAMPLES = [
  { key: "elem", label: "小學", unit: "分數、四則與單位換算", student: "/samples/sample-elem-student.pdf", parent: "/samples/sample-elem-parent.pdf" },
  { key: "g7", label: "國一", unit: "正負數、分數、一元一次", student: "/samples/sample-g7-student.pdf", parent: "/samples/sample-g7-parent.pdf" },
  { key: "g8", label: "國二", unit: "因式分解、一元二次、畢氏", student: "/samples/sample-g8-student.pdf", parent: "/samples/sample-g8-parent.pdf" },
  { key: "g9", label: "國三", unit: "相似、圓、機率、二次函數", student: "/samples/sample-g9-student.pdf", parent: "/samples/sample-g9-parent.pdf" },
  { key: "g10", label: "高一", unit: "絕對值、多項式、直線與圓", student: "/samples/sample-g10-student.pdf", parent: "/samples/sample-g10-parent.pdf" },
  { key: "g11", label: "高二", unit: "三角函數、指數對數、向量", student: "/samples/sample-g11-student.pdf", parent: "/samples/sample-g11-parent.pdf" },
  { key: "g12", label: "高三", unit: "學測綜合範例", student: "/samples/sample-g12-student.pdf", parent: "/samples/sample-g12-parent.pdf" },
  { key: "sat5", label: "SAT Math", unit: "代數基礎範例", student: "/samples/sample-sat5-student.pdf", parent: "/samples/sample-sat5-parent.pdf" },
] as const;

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

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
};

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

/**
 * 「影片練習題」頁（/videos-practice）的資料：直接由 lib/practice-sheets.ts 產生，不另外維護一份。
 * 新增一支影片的練習題＝只要在 PRACTICE_SHEETS 最上面加一行，這頁和 /units 會一起更新（publishAt 到了才出現）。
 * 注意：/practice 已被轉址到 /units，所以這頁用 /videos-practice。
 */
import { driveUrl, livePracticeSheets, type PracticeSheet } from "@/lib/practice-sheets";
import { LOCAL_SHEETS } from "@/lib/sheet-files";
import { UNIT_PACKS } from "@/lib/unit-packs";

export type VideoRow = {
  /** 追蹤用代號（只含英數與連字號，例如 vp-ey24）。 */
  id: string;
  /** 顯示用編號，例如「學測一眼懂 #24」；長片沒有編號就是系列名。 */
  label: string;
  /** 篩選用系列分類。 */
  kind: string;
  title: string;
  topic: string;
  level: PracticeSheet["level"];
  /** 年級（108 課綱）：國二、國三、高一、高二、SAT；沒登記的新影片退回 level（國中／高中）。 */
  grade: string;
  unit: string;
  unitTitle: string;
  date: string;
  /** 站內 PDF 網址（相對路徑）；沒放進站內才退回 Drive。 */
  href: string;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "numeric", day: "numeric" }).format(new Date(iso));

function kindOf(series: string): string {
  if (series.includes("畫圖一眼懂")) return "畫圖一眼懂";
  if (series.includes("學測一眼懂")) return "學測一眼懂";
  if (series.includes("學測真題")) return "學測真題";
  if (series.includes("學測陷阱題")) return "學測陷阱題";
  if (series.includes("段考必錯")) return "段考必錯";
  return "長片";
}

const PREFIX: Record<string, string> = { 畫圖一眼懂: "ey", 學測一眼懂: "ey", 學測真題: "gr", 學測陷阱題: "tr", 段考必錯: "ex" };


/**
 * 年級對照（108 課綱），以 PDF 檔名代號（driveId 或 /pdf/ 檔名）為鍵。
 * 新影片沒寫在這裡時，退回 level（國中／高中／SAT），之後再補一行即可。
 */
const GRADE: Record<string, string> = {
  "1NB5HWRZl0NVXy5wpa7I8gSohv39_Pg_f": "高一", // 畫圖一眼懂 #25 餘弦定理
  "gsat-trap1-practice": "高一", // 學測陷阱題 #1 根式方程
  "gsat-real2-practice": "高一", // 學測真題 #2 排列組合
  "1YK2q2BYjLBBr-jlK4eL6R0X89FrjHMJI": "高二", // #24 向量內積
  "gsat-real1-practice": "高一", // 學測真題 #1 坐標與距離
  "1lnFhgWQX-a19d9CLPRoBW2fKX0elHIcv": "高一", // 排列組合長片
  "1B4MBdG34wQMPdwygTln2yIxd3nye4XyC": "高一", // #23 圓方程式
  "1t5M_odF6LCwlPCe_TQWxmG6aPrX3SvoI": "高一", // #22 排列組合
  "1vrd_8ZaRW4me58-B8PVXILP09UdS_9f_": "SAT",
  "1WCsZRivJ68te1jn7WFYIEFixHieVV0EI": "國二", // #21 乘法公式
  "1trphOaYKfKLGBP5jPw7GNY3EMrVCiDyP": "SAT",
  "1X9EMH_cbhLwf0zNNUr7yyCcA0H6DneaR": "高一", // #20 機率
  "1UtEkfeHf-6oQMtNozJZMwXVhlQ04KMar": "國三", // 國三圓
  "1eFQG9fg1DMlX6k-AaH4WEFzHN7kI0jqW": "高一", // #19 數列級數
  "108wOij62LPGPzgTfqnVlnEFvuFAXg499": "高二", // #18 log
  "1dNoiI1vesdR-uv9DhG6kmfZTdLgkP0wz": "高一", // #17 sin²+cos²
  "1Fxs7EyRkUVDM4Q1rPVlgYY8CC1E21w8L": "高二", // 指數對數長片
  "1GpDzykD27BaH7GcnPIWOYmXlFqoKKg1m": "高二", // #16 向量
  "1Kgja9H0S8OxXVkiOhl-NEcpj-c-AjG2O": "高一", // #15 tan
  "1vE3OG2B-EouAnME4dDHcb4nK5tPnR9ao": "國二", // 段考必錯 #6 乘法公式
  "1hShrUHRkiwdeIpilMpr6YTrg7nCcKXzB": "高二", // 段考必錯 #5 sin 和角
};

export const GRADE_ORDER = ["國二", "國三", "高一", "高二", "SAT", "國中", "高中"];

function gradeOf(s: PracticeSheet): string {
  const key = s.driveId in GRADE ? s.driveId : (s.url?.match(/\/pdf\/([^/]+)\.pdf$/)?.[1] ?? "");
  return GRADE[key] ?? (s.level === "SAT" ? "SAT" : s.level);
}

/** 把站內絕對網址轉成相對路徑；站外網址原樣保留。 */
function pdfHref(s: PracticeSheet): string {
  if (s.url) return s.url.replace(/^https:\/\/kuan-weekly\.vercel\.app/, "");
  return LOCAL_SHEETS.has(s.driveId) ? `/sheets/${s.driveId}.pdf` : driveUrl(s.driveId);
}

export function videoRows(now = new Date()): VideoRow[] {
  const known = new Map(UNIT_PACKS.map((u) => [u.slug, u.title]));
  return livePracticeSheets(now).map((s) => {
    const kind = kindOf(s.series);
    const n = s.series.match(/#(\d+)/)?.[1];
    const unit = s.unit && known.has(s.unit) ? s.unit : "other";
    return {
      id: `vp-${n && PREFIX[kind] ? `${PREFIX[kind]}${n}` : s.driveId.slice(0, 8).replace(/[^a-z0-9]/gi, "")}`,
      label: s.series,
      kind,
      title: s.title,
      topic: s.topic,
      level: s.level,
      grade: gradeOf(s),
      unit,
      unitTitle: known.get(unit) ?? "其他",
      date: fmtDate(s.publishAt),
      href: pdfHref(s),
    };
  });
}

export const KIND_ORDER = ["畫圖一眼懂", "學測一眼懂", "學測真題", "學測陷阱題", "段考必錯", "長片"];

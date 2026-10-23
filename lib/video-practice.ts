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
  if (series.includes("段考必錯")) return "段考必錯";
  return "長片";
}

const PREFIX: Record<string, string> = { 畫圖一眼懂: "ey", 學測一眼懂: "ey", 學測真題: "gr", 段考必錯: "ex" };

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
      unit,
      unitTitle: known.get(unit) ?? "其他",
      date: fmtDate(s.publishAt),
      href: pdfHref(s),
    };
  });
}

export const KIND_ORDER = ["畫圖一眼懂", "學測一眼懂", "學測真題", "段考必錯", "長片"];

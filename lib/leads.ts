export const LEAD_COOKIE = "kw_sample";

export const LEAD_GRADES = ["國小", "國一", "國二", "國三", "高一", "高二", "高三", "SAT"] as const;
export const LEAD_ID_COOKIE = "kw_lead";
export const LEAD_TRACK_COOKIE = "kw_track";
export const LEAD_TRADE_COOKIE = "kw_trade";

export type SampleTrack = "jh" | "gsat" | "sat";
export function trackForGrade(grade: string): SampleTrack {
  if (grade === "SAT") return "sat";
  if (grade.startsWith("高")) return "gsat";
  return "jh";
}
export function cleanTrack(raw: unknown): SampleTrack | "" {
  const s = String(raw ?? "");
  return s === "jh" || s === "gsat" || s === "sat" ? s : "";
}
export const LEAD_ROLES = ["家長", "學生"] as const;

/** ?src= 只收英數、底線、連字號，最多 40 字（例：yt-short、yt-long、fb、ig）。 */
export function cleanSrc(raw: unknown) {
  const s = String(raw ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(s) ? s : "";
}

export function cleanUtm(raw: unknown) {
  return String(raw ?? "")
    .trim()
    .replace(/[^\w.\-+%]/g, "")
    .slice(0, 60);
}

export const LEAD_GRADE_COOKIE = "kw_lead_grade";
/** 表單「孩子年級」→ 範例題本 key（lib/config GRADE_SAMPLES）。 */
export const GRADE_SAMPLE_KEY: Record<string, string> = {
  國小: "elem", 國一: "g7", 國二: "g8", 國三: "g9", 高一: "g10", 高二: "g11", 高三: "g12", SAT: "sat5",
};

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 7 天完整試用（2026-10-20 使用者核准，草稿）。
 * - 只適用 TRIAL_START 之後新留信箱的人；之前的人照舊（公開試閱＋trial_d1 跟進信），不會多收信。
 * - 試用從留信箱那天（台北時間）算第 1 天，第 7 天 23:59 關閉。關閉＝下載連結失效（伺服器檢查日期），PDF 不放 public/。
 * - 信：第 1 天寄送達信（含用法與關閉日期）；第 6 天 20:00 寄一封提醒；到期後不再寄。
 */
export const TRIAL_DAYS = 7;
export const TRIAL_START = process.env.TRIAL_START || "2099-01-01T00:00:00+08:00"; // 上線時設成實際上線時間
export const TRIAL_D0_KIND = "trial_d0";
export const TRIAL_D6_KIND = "trial_d6";

export type TrialPack = { id: string; label: string; unit: string; studentPages: number; parentPages: number };
export const TRIAL_PACKS: Record<string, TrialPack> = {
  g7_frac: { id: "g7_frac", label: "國一", unit: "第 2 章 因數倍數與分數運算（第二次段考範圍）", studentPages: 4, parentPages: 4 },
  g8_sqrt: { id: "g8_sqrt", label: "國二", unit: "第 2 章 平方根與畢氏定理（第二次段考範圍）", studentPages: 3, parentPages: 4 },
  g9_circle: { id: "g9_circle", label: "國三", unit: "圓（第二次段考範圍）", studentPages: 3, parentPages: 4 },
  g9_similar: { id: "g9_similar", label: "國三", unit: "相似形（會考必考）", studentPages: 3, parentPages: 4 },
  g12_log_A: { id: "g12_log_A", label: "學測數A", unit: "指數與對數", studentPages: 3, parentPages: 4 },
  g12_prob_B: { id: "g12_prob_B", label: "學測數B", unit: "排列組合與機率", studentPages: 3, parentPages: 4 },
};

/** 依年級給試用包；沒有對應的年級（高一、高二、SAT、未填）回傳空陣列＝照舊給公開試閱。 */
export function packsForGrade(grade: string): TrialPack[] {
  const ids: Record<string, string[]> = {
    國一: ["g7_frac"],
    國二: ["g8_sqrt"],
    國三: ["g9_circle", "g9_similar"],
    高三: ["g12_log_A", "g12_prob_B"],
  };
  return (ids[grade] ?? []).map((k) => TRIAL_PACKS[k]);
}

const TZ_MS = 8 * 60 * 60 * 1000;
/** 第 7 天台北 23:59:59 的 UTC 時間。 */
export function trialEndsAt(createdAtIso: string) {
  const t = new Date(createdAtIso).getTime() + TZ_MS; // 台北牆上時間
  const day = Math.floor(t / 86400000) * 86400000;
  return new Date(day + TRIAL_DAYS * 86400000 - 1000 - TZ_MS);
}
/** 「10/27（二）」 */
export function trialEndLabel(createdAtIso: string) {
  const d = new Date(trialEndsAt(createdAtIso).getTime() + TZ_MS);
  const w = "日一二三四五六"[d.getUTCDay()];
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${w}）`;
}
export function isTrialLead(lead: { created_at: string; grade?: string }) {
  return new Date(lead.created_at).getTime() >= new Date(TRIAL_START).getTime() && packsForGrade(lead.grade ?? "").length > 0;
}
export function trialActive(lead: { created_at: string; grade?: string }, now = new Date()) {
  return isTrialLead(lead) && now.getTime() <= trialEndsAt(lead.created_at).getTime();
}

function secret() {
  return process.env.TRIAL_SECRET || process.env.CRON_SECRET || "dev-trial-secret";
}
/** 下載連結：/trial/<leadId>.<sig>/<pack>-<kind>.pdf；簽章防止猜別人的 leadId。 */
export function trialToken(leadId: string) {
  const sig = createHmac("sha256", secret()).update(leadId).digest("base64url").slice(0, 22);
  return `${leadId}.${sig}`;
}
export function verifyTrialToken(tok: string) {
  const i = tok.lastIndexOf(".");
  if (i <= 0) return "";
  const leadId = tok.slice(0, i);
  const a = Buffer.from(trialToken(leadId));
  const b = Buffer.from(tok);
  return a.length === b.length && timingSafeEqual(a, b) ? leadId : "";
}
export function trialUrl(base: string, leadId: string, packId: string, kind: "student" | "parent") {
  return `${base}/trial/${trialToken(leadId)}/${packId}-${kind}.pdf`;
}

/** /sample 留資料後選年級＋範圍：有對應週練包就自動寄（學生版＋家長版），沒有就交給老師手動回。 */
export const SCOPE_GRADES = ["國一", "國二", "國三", "高一", "高二", "高三", "其他"] as const;
export const SCOPE_OPTIONS: { value: string; label: string; grade: string; pack?: string }[] = [
  { value: "g7_frac", label: "國一：因數倍數與分數運算", grade: "國一", pack: "g7_frac" },
  { value: "g9_circle", label: "國三：圓", grade: "國三", pack: "g9_circle" },
  { value: "g9_similar", label: "國三：相似形", grade: "國三", pack: "g9_similar" },
  { value: "g12_log_A", label: "高三學測：指數與對數", grade: "高三", pack: "g12_log_A" },
  { value: "g12_prob_B", label: "高三學測：排列組合與機率", grade: "高三", pack: "g12_prob_B" },
  { value: "other", label: "其他範圍（老師親自回信）", grade: "" },
];
export const scopeKind = (packId: string) => `scope_${packId}`;
/** 預覽版只能寄到自己的測試信箱；正式站不寄測試信箱。 */
export function scopeMailAllowed(email: string, isTest: boolean) {
  const prod = process.env.VERCEL_ENV === "production";
  return prod ? !isTest : /^jjredick365\+[a-z0-9-]*test[a-z0-9-]*@gmail\.com$/i.test(email);
}

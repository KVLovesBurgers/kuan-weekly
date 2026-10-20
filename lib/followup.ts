import type { KuanDb } from "./db";
import { startByNote } from "./config";

export const FOLLOWUP_KIND = "trial_d1";
export const FOLLOWUP_SUBJECT = "試閱寫完了嗎？3 步看出孩子卡在哪";
/** 使用者 2026-10-19 核准的原稿（/workspace/promo/trial-followup-draft.md 第 9–31 行）。2026-10-20 核准加入：開通時間提示（{{START_BY}}）與年級練習連結（{{UNIT_LINK}}），其餘不改。直接寄請用 buildFollowup()。 */
export const FOLLOWUP_TEXT = `您好，我是吳寬老師。

前幾天您領了寬數週練的題本試閱，想跟您分享怎麼用最有效：

1. 先讓孩子自己寫學生題本，不要先看解答。
2. 寫完打開家長解答，第一頁是答案速查，先對對錯。
3. 錯的題目看步驟拆解，請孩子講給您聽；講不出來的那一步，就是他卡住的地方。

家長不用會數學，照著解答就能看出問題在觀念還是粗心。

如果覺得適合，可以為孩子訂閱，每週一份題本＋家長解答，依年級和校內進度出題：
- 月繳 NT$799，或年繳 NT$7,990（省 NT$1,598），每位孩子計價
- 付款方式：銀行匯款。登記後會看到帳號，匯款後把轉帳證明回信寄給我，確認入帳約 1 個工作天開通
- 目前限 20 名
{{START_BY}}
登記訂閱：https://kuan-weekly.vercel.app/sample#subscribe
{{UNIT_LINK}}
還沒寫完也沒關係，有任何問題直接回這封信就好。

吳寬老師
寬數週練｜https://kuan-weekly.vercel.app

（不想再收到這類信，回信告訴我即可）
`;

export const STUDENT_SUBJECT = "試閱寫完了嗎？這封可以轉給家長看";
const SITE_BASE = "https://kuan-weekly.vercel.app";

/** 依年級給一份對應的免費練習（/units 的單元錨點）；其他年級不加。 */
export function unitLinkForGrade(grade: string) {
  if (grade === "國三") return { label: "國三圓（弧長、圓周角、弦切角）", url: `${SITE_BASE}/units#jh-circle` };
  if (grade === "高三") return { label: "學測指數與對數", url: `${SITE_BASE}/units#gsat-log` };
  return null;
}

/** 依身分與年級組出跟進信。家長沿用原稿；學生多一段請他轉給家長。 */
export function buildFollowup(lead: { role?: string; grade?: string }, now = new Date()) {
  const note = startByNote(now);
  const startBy = note ? `- ${note}\n` : "";
  if (lead.role === "學生") {
    const share = `${SITE_BASE}/sample?src=share-email`;
    const text = `你好，我是吳寬老師。

謝謝你下載寬數週練的試閱。先自己寫，不要先看解答；卡住的題目記下題號，直接回這封信問我就好。

這封可以轉給家長看。也可以把這個連結傳給家長，裡面有試閱和訂閱說明：
${share}

給家長的訂閱資訊：
- 每週一份題本＋家長解答，依年級和校內進度出題
- 月繳 NT$799，或年繳 NT$7,990，每位孩子計價，銀行匯款
- 目前限 20 名
${startBy}
吳寬老師
寬數週練｜${SITE_BASE}

（不想再收到這類信，回信告訴我即可）
`;
    return { subject: STUDENT_SUBJECT, text, variant: "student" };
  }
  const unit = unitLinkForGrade(lead.grade ?? "");
  const unitLine = unit ? `\n另外送一份和孩子年級對應的免費練習：${unit.label}\n${unit.url}\n` : "";
  const text = FOLLOWUP_TEXT.replace("{{START_BY}}", startBy).replace("{{UNIT_LINK}}", unitLine);
  return { subject: FOLLOWUP_SUBJECT, text, variant: unit ? `parent-${lead.grade}` : "parent" };
}

const MIN_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const FOLLOWUP_BATCH_LIMIT = 40;

/** 測試／自家／示範信箱一律不寄。 */
export function isTestAddress(email: string) {
  const e = email.trim().toLowerCase();
  return (
    e.startsWith("jjredick365") ||
    /@(demo\.kuan\.tw|local|localhost|example\.(com|org|net)|mail\.grokbot\.com|mailinator\.com|test\.com)$/.test(e) ||
    /(^|[+._-])(test|box)([+._-]|@)/.test(e) ||
    /^(test|box)/.test(e)
  );
}

/**
 * 符合條件：領試閱滿 24 小時、未滿 7 天；沒寄過（或上次失敗）；沒退訂；
 * 這個信箱沒有任何孩子訂閱紀錄或匯款登記（pending/active 都算已進入付款流程）。
 */
export async function eligibleFollowupLeads(db: KuanDb, now = new Date()) {
  const newest = new Date(now.getTime() - MIN_AGE_MS).toISOString();
  const oldest = new Date(now.getTime() - MAX_AGE_MS).toISOString();
  const rows = (await db
    .prepare(
      `SELECT l.email AS email, l.created_at AS created_at, l.role AS role, l.grade AS grade FROM leads l
       WHERE l.created_at <= ? AND l.created_at >= ?
         AND NOT EXISTS (SELECT 1 FROM lead_followups f WHERE f.email = l.email AND f.kind = ? AND f.status <> 'failed')
         AND NOT EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = l.email)
         AND NOT EXISTS (
           SELECT 1 FROM parents p WHERE lower(p.email) = lower(l.email) AND (
             EXISTS (SELECT 1 FROM children c WHERE c.parent_id = p.id)
             OR EXISTS (SELECT 1 FROM checkout_attempts a WHERE a.parent_id = p.id)
           )
         )
       ORDER BY l.created_at ASC`,
    )
    .all(newest, oldest, FOLLOWUP_KIND)) as { email: string; created_at: string; role: string; grade: string }[];
  return rows.filter((r) => !isTestAddress(String(r.email)));
}

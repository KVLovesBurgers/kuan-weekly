import type { KuanDb } from "./db";
import { isTrialLead, packsForGrade, trialEndLabel, trialEndsAt, trialUrl, TRIAL_D6_KIND, TRIAL_PACKS } from "./trial";

export const FOLLOWUP_KIND = "trial_d1";
export const FOLLOWUP_SUBJECT = "試閱寫完了嗎？3 步看出孩子卡在哪";
/** 2026-10-25 改為定稿 /workspace/promo/trial-followup-draft-20261025.md：第一週 NT$199，之後依年級每月：小學 699／國中 799／高中 999／SAT・AMC 1,099＋訂閱連結；刪「免費寄第一週」。舊註：2026-10-22 使用者核准：訂閱資訊改為免費寄題本的要求（2026-10-24 起統一為「第一週」，避免被讀成每週免費）。使用者 2026-10-19 核准的原稿（/workspace/promo/trial-followup-draft.md 第 9–31 行）。2026-10-20 核准加入：開通時間提示（{{START_BY}}）與年級練習連結（{{UNIT_LINK}}），其餘不改。直接寄請用 buildFollowup()。 */
export const FOLLOWUP_TEXT = `您好，我是吳寬老師。

前幾天您領了寬數週練的題本試閱，想跟您分享怎麼用最有效：

1. 先讓孩子自己寫學生題本，不要先看解答。
2. 寫完打開家長解答，第一頁是答案速查，先對對錯。
3. 錯的題目看步驟拆解，請孩子講給您聽；講不出來的那一步，就是他卡住的地方。

家長不用會數學，照著解答就能看出問題在觀念還是粗心。

想問一下孩子寫起來感覺如何？哪一題特別卡，回信跟我說題號就好。
{{UNIT_LINK}}
如果下個禮拜想繼續：第一週 NT$199，之後依年級每月：小學 699／國中 799／高中 999／SAT・AMC 1,099。回信跟我說要不要續就好。

登記訂閱：
https://kuan-weekly.vercel.app/sample#subscribe

吳寬老師
寬數週練
https://kuan-weekly.vercel.app

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
  if (lead.role === "學生") {
    const text = `你好，我是吳寬老師。

謝謝你下載寬數週練的試閱。先自己寫，不要先看解答；卡住的題目記下題號，直接回這封信問我就好。

想問一下寫起來感覺如何？哪一題特別卡，回信跟我說題號就好。

這封可以轉給家長看。如果下個禮拜想繼續：第一週 NT$199，之後依年級每月：小學 699／國中 799／高中 999／SAT・AMC 1,099。請家長回信跟我說要不要續就好。

登記訂閱：
${SITE_BASE}/sample#subscribe

吳寬老師
寬數週練
${SITE_BASE}

（不想再收到這類信，回信告訴我即可）
`;
    return { subject: STUDENT_SUBJECT, text, variant: "student" };
  }
  const unit = unitLinkForGrade(lead.grade ?? "");
  const unitLine = unit ? `\n另外送一份和孩子年級對應的免費練習：${unit.label}\n${unit.url}\n` : "";
  const text = FOLLOWUP_TEXT.replace("{{UNIT_LINK}}", unitLine);
  return { subject: FOLLOWUP_SUBJECT, text, variant: unit ? `parent-${lead.grade}` : "parent" };
}

const MIN_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const FOLLOWUP_BATCH_LIMIT = 40;

/** /sample 留信箱＝申請試用；記在 lead_followups（kind＝trial_apply），讓先做模擬考、後來才申請試用的人也算。 */
export const TRIAL_APPLY_KIND = "trial_apply";

/**
 * 「申請過試用」才收試用跟進信（trial_d1／trial_d6）。以下任一成立即算：
 * 1. 名單不是由 /mock 建立（/sample、/quiz、/diag 等原本流程建立的名單，行為不變）；
 *    /mock 建立名單時 leads.created_at 與該筆 mock- 成績的 created_at 相同，用這點辨認。
 * 2. 有任何非模擬考的作答紀錄（/quiz、/diag）。
 * 3. 之後在 /sample 申請過試用（lead_followups.kind＝trial_apply）。
 * 只留模擬考 Email 的人三項都不成立，不寄。
 */
export const APPLIED_TRIAL_SQL = `(
           NOT EXISTS (SELECT 1 FROM quiz_results qm WHERE qm.email = l.email AND qm.subject LIKE 'mock-%' AND qm.created_at = l.created_at)
           OR EXISTS (SELECT 1 FROM quiz_results qo WHERE qo.email = l.email AND qo.subject NOT LIKE 'mock-%')
           OR EXISTS (SELECT 1 FROM lead_followups fa WHERE fa.email = l.email AND fa.kind = '${TRIAL_APPLY_KIND}')
         )`;

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
         AND ${APPLIED_TRIAL_SQL}
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
  // 7 天試用的人改收 trial_d0／trial_d6，不再收這封，避免重複。
  return rows.filter((r) => !isTestAddress(String(r.email)) && !isTrialLead(r));
}

// ---------------- 7 天完整試用（草稿，2026-10-20） ----------------

/** 第 1 天送達信：下載連結＋用法＋關閉日期。取代這些人的 trial_d1（不會再收原本的跟進信）。 */
export function buildTrialDelivery(lead: { id: string; role?: string; grade?: string; created_at: string }) {
  const end = trialEndLabel(lead.created_at);
  const packs = packsForGrade(lead.grade ?? "");
  const links = packs
    .map((p) => `【${p.label}・${p.unit}】\n學生題本：${trialUrl(SITE_BASE, lead.id, p.id, "student")}\n家長解答：${trialUrl(SITE_BASE, lead.id, p.id, "parent")}`)
    .join("\n\n");
  const student = lead.role === "學生";
  const subject = `寬數週練 試用題本：${end}關閉`;
  const text = `${student ? "你好" : "您好"}，我是吳寬老師。

這是寬數週練的試用完整題本（7 天），${packs.length > 1 ? `共 ${packs.length} 份，` : ""}每份都是完整的一週：學生題本 15 題（基礎、常考、進階三關）＋家長解答（每題步驟和常見錯誤）。

${links}

下載連結會在 ${end}晚上 11:59 關閉，請在這之前下載或列印。

怎麼用最有效：
1. 先${student ? "自己" : "讓孩子自己"}寫學生題本，不要先看解答。
2. 寫完打開家長解答，第一頁是答案速查，先對對錯。
3. 錯的題目看步驟拆解${student ? "，講給家長或自己聽一遍" : "，請孩子講給您聽"}；講不出來的那一步，就是卡住的地方。
${student ? "\n這封可以轉給家長看。\n" : ""}
寫完或卡住，直接回這封信告訴我題號就好。

吳寬老師
寬數週練
${SITE_BASE}

（不想再收到這類信，回信告訴我即可）
`;
  return { subject, text };
}

/** 第 6 天 20:00 提醒（只寄一次），推訂閱，附「可以轉給家長看」。到期後不寄任何信。 */
export function buildTrialReminder(lead: { role?: string; grade?: string; created_at: string }, now = new Date()) {
  const end = trialEndLabel(lead.created_at);
  const student = lead.role === "學生";
  const subject = `試用題本 ${end}關閉，寫完了嗎？`;
  const text = student ? `你好，我是吳寬老師。

提醒一下，試用的下載連結會在 ${end}晚上 11:59 關閉，還沒下載的話請記得先存下來。

想問一下寫起來感覺如何？哪一題特別卡，回信跟我說題號就好。

這封可以轉給家長看。如果下個禮拜想繼續：第一週 NT$199，之後依年級每月：小學 699／國中 799／高中 999／SAT・AMC 1,099。請家長回信跟我說要不要續就好。

登記訂閱：
${SITE_BASE}/sample#subscribe

吳寬老師
寬數週練
${SITE_BASE}

（這是試用期間唯一一封提醒，之後不會再寄。不想收到，回信告訴我即可）
` : `您好，我是吳寬老師。

提醒一下，試用的下載連結會在 ${end}晚上 11:59 關閉，還沒下載的話請記得先存下來。

想問一下孩子寫起來感覺如何？哪一題特別卡，回信跟我說題號就好。

如果下個禮拜想繼續：第一週 NT$199，之後依年級每月：小學 699／國中 799／高中 999／SAT・AMC 1,099。回信跟我說要不要續就好。

登記訂閱：
${SITE_BASE}/sample#subscribe

這封也可以轉給家裡另一位家長看。

吳寬老師
寬數週練
${SITE_BASE}

（這是試用期間唯一一封提醒，之後不會再寄。不想收到，回信告訴我即可）
`;
  return { subject, text };
}

/** 第 6 天（台北日期）到關閉前，沒寄過 trial_d6、沒退訂、沒進入付款流程的試用者。 */
export async function eligibleTrialReminders(db: KuanDb, now = new Date()) {
  const rows = (await db
    .prepare(
      `SELECT l.id AS id, l.email AS email, l.created_at AS created_at, l.role AS role, l.grade AS grade FROM leads l
       WHERE l.created_at >= ?
         AND ${APPLIED_TRIAL_SQL}
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
    .all(new Date(now.getTime() - 8 * 86400000).toISOString(), TRIAL_D6_KIND)) as {
    id: string; email: string; created_at: string; role: string; grade: string;
  }[];
  return rows.filter((r) => {
    if (isTestAddress(r.email) || !isTrialLead(r)) return false;
    const end = trialEndsAt(r.created_at).getTime();
    const day6Start = end + 1000 - 2 * 86400000; // 第 6 天台北 00:00
    return now.getTime() >= day6Start && now.getTime() < end;
  });
}

/** 選範圍後自動寄的免費第一週週練包。不放價格、匯款；每個連結單獨一行。 */
export function buildScopeDelivery(lead: { id: string; role?: string }, packId: string, base = SITE_BASE) {
  const p = TRIAL_PACKS[packId];
  const student = lead.role === "學生";
  const subject = `寬數週練免費第一週：${p.label}${p.unit.replace(/（.*）/, "")}`;
  const text = `${student ? "你好" : "您好"}，我是吳寬老師。

這是您選的範圍「${p.label}・${p.unit}」免費第一週週練包：學生題本＋家長解答（每題步驟和常見錯誤）。

學生題本
${trialUrl(base, lead.id, p.id, "student")}

家長解答
${trialUrl(base, lead.id, p.id, "parent")}

怎麼用最有效：
1. 先${student ? "自己" : "讓孩子自己"}寫學生題本，不要先看解答。
2. 寫完打開家長解答，第一頁是答案速查，先對對錯。
3. 錯的題目看步驟拆解${student ? "，講給家長或自己聽一遍" : "，請孩子講給您聽"}；講不出來的那一步，就是卡住的地方。

寫完或卡住，直接回這封信告訴我題號就好。

吳寬老師
寬數週練
${SITE_BASE}

（不想再收到這類信，回信告訴我即可）
`;
  return { subject, text };
}

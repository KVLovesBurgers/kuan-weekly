import { appUrl, SITE } from "./config";

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
}

export async function sendLoginEmail(to: string, loginPath: string) {
  const link = `${appUrl()}${loginPath.startsWith("/") ? loginPath : `/${loginPath}`}`;
  const subject = `寬數週練登入連結`;
  const text = `${SITE.teacher}您好，這是家長登入連結（24 小時內有效）：\n\n${link}\n\n若不是你本人索取，請忽略這封信。`;
  const html = `<p>這是寬數週練家長登入連結，24 小時內有效。</p><p><a href="${link}">點此登入</a></p><p style="color:#666;font-size:13px">若不是你本人索取，請忽略這封信。</p>`;
  await sendMail({ to, subject, text, html });
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** 新試閱名單通知老師（寄到 SITE.contactEmail）。 */
export async function sendLeadAlert(lead: {
  email: string;
  grade: string;
  role: string;
  source: string;
  utm: string;
  createdAt: string;
}) {
  const subject = `寬數週練｜新試閱名單 ${lead.email}`;
  const tw = new Date(lead.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false });
  const rows: [string, string][] = [
    ["信箱", lead.email],
    ["身分", lead.role || "未填"],
    ["孩子年級", lead.grade || "未填"],
    ["來源 src", lead.source || "direct"],
    ["UTM", lead.utm || "無"],
    ["時間（台北）", tw],
  ];
  const text = `有人在 /sample 留信箱下載題本試閱：\n\n${rows.map(([k, v]) => `${k}：${v}`).join("\n")}\n`;
  const html = `<p>有人在 /sample 留信箱下載題本試閱：</p><table>${rows
    .map(([k, v]) => `<tr><td style="color:#666;padding-right:12px">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>`;
  await sendMail({ to: SITE.contactEmail, subject, text, html });
}

/** 試閱頁直接登記匯款訂閱時通知老師。 */
export async function sendCheckoutAlert(o: {
  email: string;
  displayName: string;
  grade: string;
  plan: string;
  amount: number;
  tradeNo: string;
  source: string;
  createdAt: string;
}) {
  const subject = `寬數週練｜試閱頁登記匯款 ${o.displayName}（${o.grade}）`;
  const tw = new Date(o.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false });
  const rows: [string, string][] = [
    ["家長信箱", o.email],
    ["孩子", o.displayName],
    ["年級", o.grade],
    ["方案", o.plan === "yearly" ? "年繳" : "月繳"],
    ["金額", `${SITE.currency}${o.amount}`],
    ["訂單", o.tradeNo],
    ["來源 src", o.source || "direct"],
    ["時間（台北）", tw],
  ];
  const text = `有家長在 /sample 看完試閱後登記匯款訂閱（待匯款）：\n\n${rows.map(([k, v]) => `${k}：${v}`).join("\n")}\n`;
  const html = `<p>有家長在 /sample 看完試閱後登記匯款訂閱（待匯款）：</p><table>${rows
    .map(([k, v]) => `<tr><td style="color:#666;padding-right:12px">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>`;
  await sendMail({ to: SITE.contactEmail, subject, text, html });
}

type MailOpts = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

/** 試閱後跟進信（寄給家長／學生本人）。回信與退訂都回到老師信箱。 */
export async function sendFollowupEmail(to: string, subject: string, text: string) {
  const html = `<div style="font-size:15px;line-height:1.7">${text
    .split("\n")
    .map((l) => (l ? esc(l).replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>') : "&nbsp;"))
    .map((l) => `<div>${l}</div>`)
    .join("")}</div>`;
  await sendMail({
    to,
    subject,
    text,
    html,
    replyTo: SITE.contactEmail,
    headers: {
      "List-Unsubscribe": `<mailto:${SITE.contactEmail}?subject=${encodeURIComponent("退訂試閱跟進信")}>`,
    },
  });
}

async function sendMail({ to, subject, text, html, replyTo, headers }: MailOpts) {
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || `${SITE.name} <${SITE.contactEmail}>`;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, html, ...(replyTo ? { reply_to: replyTo } : {}), ...(headers ? { headers } : {}) }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`寄信失敗（Resend ${res.status}）${body.slice(0, 200)}`);
    }
    return;
  }

  const host = process.env.SMTP_HOST;
  if (!host) throw new Error("尚未設定寄信");
  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || "465");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  await transporter.sendMail({ from, to, subject, text, html, ...(replyTo ? { replyTo } : {}), ...(headers ? { headers } : {}) });
}

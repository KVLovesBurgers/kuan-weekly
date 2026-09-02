import { appUrl, SITE } from "./config";

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
}

export async function sendLoginEmail(to: string, loginPath: string) {
  const link = `${appUrl()}${loginPath.startsWith("/") ? loginPath : `/${loginPath}`}`;
  const subject = `寬數週練登入連結`;
  const text = `${SITE.teacher}您好，這是家長登入連結（15 分鐘內有效）：\n\n${link}\n\n若不是你本人索取，請忽略這封信。`;
  const html = `<p>這是寬數週練家長登入連結，15 分鐘內有效。</p><p><a href="${link}">點此登入</a></p><p style="color:#666;font-size:13px">若不是你本人索取，請忽略這封信。</p>`;
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || `${SITE.name} <${SITE.contactEmail}>`;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
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
  await transporter.sendMail({ from, to, subject, text, html });
}

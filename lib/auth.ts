import { cookies } from "next/headers";
import { getDb } from "./db";
import { token, uid } from "./ids";
import { adminEmail, adminPassword, appUrl } from "./config";

const PARENT_COOKIE = "kw_parent";
const ADMIN_COOKIE = "kw_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function requestMagicLink(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "請輸入有效的電子信箱。" };
  }
  const db = getDb();
  const t = token();
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  db.prepare("INSERT INTO magic_links (token, email, expires_at, used) VALUES (?, ?, ?, 0)").run(
    t,
    email,
    expires,
  );
  const url = `/login/verify?token=${t}`;
  const smtpReady = Boolean(process.env.SMTP_HOST);
  return { ok: true as const, url, showLink: !smtpReady, email };
}

export async function consumeMagicLink(raw: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT token, email, expires_at, used FROM magic_links WHERE token = ?")
    .get(raw) as { token: string; email: string; expires_at: string; used: number } | undefined;
  if (!row || row.used) return { ok: false as const, error: "連結無效或已使用。" };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false as const, error: "連結已過期，請重新索取。" };
  }
  db.prepare("UPDATE magic_links SET used = 1 WHERE token = ?").run(row.token);

  let parent = db.prepare("SELECT id FROM parents WHERE email = ?").get(row.email) as
    | { id: string }
    | undefined;
  if (!parent) {
    const id = uid("parent");
    db.prepare("INSERT INTO parents (id, email, created_at) VALUES (?, ?, ?)").run(
      id,
      row.email,
      new Date().toISOString(),
    );
    parent = { id };
  }
  const session = token();
  db.prepare("INSERT INTO sessions (token, parent_id, expires_at) VALUES (?, ?, ?)").run(
    session,
    parent.id,
    new Date(Date.now() + THIRTY_DAYS * 1000).toISOString(),
  );
  const jar = await cookies();
  jar.set(PARENT_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return { ok: true as const };
}

export async function getParent() {
  const jar = await cookies();
  const t = jar.get(PARENT_COOKIE)?.value;
  if (!t) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT p.id, p.email FROM sessions s
       JOIN parents p ON p.id = s.parent_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(t, new Date().toISOString()) as { id: string; email: string } | undefined;
  return row ?? null;
}

export async function logoutParent() {
  const jar = await cookies();
  const t = jar.get(PARENT_COOKIE)?.value;
  if (t) getDb().prepare("DELETE FROM sessions WHERE token = ?").run(t);
  jar.delete(PARENT_COOKIE);
}

export async function loginAdmin(emailRaw: string, password: string) {
  if (emailRaw.trim().toLowerCase() !== adminEmail() || !adminPassword()) {
    return { ok: false as const, error: "帳號或密碼不正確。" };
  }
  if (password !== adminPassword()) {
    return { ok: false as const, error: "帳號或密碼不正確。" };
  }
  const t = token();
  getDb()
    .prepare("INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)")
    .run(t, new Date(Date.now() + THIRTY_DAYS * 1000).toISOString());
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, t, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return { ok: true as const };
}

export async function getAdmin() {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return null;
  const row = getDb()
    .prepare("SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?")
    .get(t, new Date().toISOString());
  return row ? { email: adminEmail() } : null;
}

export async function logoutAdmin() {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (t) getDb().prepare("DELETE FROM admin_sessions WHERE token = ?").run(t);
  jar.delete(ADMIN_COOKIE);
}

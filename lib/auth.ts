import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { mailConfigured, sendLoginEmail } from "./mail";
import { uid } from "./ids";
import { adminEmail, adminPassword, DEMO_PARENT_EMAIL } from "./config";

const PARENT_COOKIE = "kw_parent";
const ADMIN_COOKIE = "kw_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function secret() {
  return process.env.SESSION_SECRET || "dev-kuan-weekly-session-secret-please-change";
}

function sign(payload: string) {
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

function unsign(raw: string) {
  let decoded = "";
  try {
    decoded = Buffer.from(raw, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const i = decoded.lastIndexOf(".");
  if (i < 0) return null;
  const payload = decoded.slice(0, i);
  const sig = decoded.slice(i + 1);
  const expect = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  return payload;
}

async function ensureParent(email: string) {
  const db = await getDb();
  if (email === DEMO_PARENT_EMAIL) {
    const row = (await db.prepare("SELECT id FROM parents WHERE email = ?").get(email)) as
      | { id: string }
      | undefined;
    return { id: row?.id ?? "parent_demo", email };
  }
  let parent = (await db.prepare("SELECT id FROM parents WHERE email = ?").get(email)) as
    | { id: string }
    | undefined;
  if (!parent) {
    const id = uid("parent");
    await db.prepare("INSERT INTO parents (id, email, created_at) VALUES (?, ?, ?)").run(
      id,
      email,
      new Date().toISOString(),
    );
    parent = { id };
  }
  return { id: parent.id, email };
}

export async function requestMagicLink(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "請輸入有效的電子信箱。" };
  }
  const exp = Date.now() + 15 * 60 * 1000;
  const t = sign(`magic|${email}|${exp}`);
  const url = `/login/verify?token=${encodeURIComponent(t)}`;
  const canMail = mailConfigured() && email !== DEMO_PARENT_EMAIL;
  if (canMail) {
    try {
      await sendLoginEmail(email, url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "寄信失敗";
      return { ok: false as const, error: msg };
    }
  }
  return { ok: true as const, url, showLink: !canMail, email };
}

export async function consumeMagicLink(raw: string) {
  const payload = unsign(raw);
  if (!payload) return { ok: false as const, error: "連結無效或已使用。" };
  const parts = payload.split("|");
  if (parts[0] !== "magic" || parts.length < 3) {
    return { ok: false as const, error: "連結無效或已使用。" };
  }
  const email = parts[1];
  const exp = Number(parts[2]);
  if (!email || !Number.isFinite(exp) || exp < Date.now()) {
    return { ok: false as const, error: "連結已過期，請重新索取。" };
  }
  const parent = await ensureParent(email);
  const session = sign(`sess|${parent.email}|${parent.id}|${Date.now() + THIRTY_DAYS * 1000}`);
  const jar = await cookies();
  jar.set(PARENT_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
    secure: process.env.VERCEL ? true : false,
  });
  return { ok: true as const };
}

export async function getParent() {
  const jar = await cookies();
  const t = jar.get(PARENT_COOKIE)?.value;
  if (!t) return null;
  const payload = unsign(t);
  if (!payload) return null;
  const parts = payload.split("|");
  if (parts[0] !== "sess" || parts.length < 4) return null;
  const email = parts[1];
  const id = parts[2];
  const exp = Number(parts[3]);
  if (!email || !id || !Number.isFinite(exp) || exp < Date.now()) return null;
  return await ensureParent(email);
}

export async function logoutParent() {
  const jar = await cookies();
  jar.delete(PARENT_COOKIE);
}

export async function loginAdmin(emailRaw: string, password: string) {
  if (emailRaw.trim().toLowerCase() !== adminEmail() || !adminPassword()) {
    return { ok: false as const, error: "帳號或密碼不正確。" };
  }
  if (password !== adminPassword()) {
    return { ok: false as const, error: "帳號或密碼不正確。" };
  }
  const t = sign(`admin|${Date.now() + THIRTY_DAYS * 1000}`);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, t, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
    secure: process.env.VERCEL ? true : false,
  });
  return { ok: true as const };
}

export async function getAdmin() {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return null;
  const payload = unsign(t);
  if (!payload) return null;
  const [kind, expRaw] = payload.split("|");
  const exp = Number(expRaw);
  if (kind !== "admin" || !Number.isFinite(exp) || exp < Date.now()) return null;
  return { email: adminEmail() };
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

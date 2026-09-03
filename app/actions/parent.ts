"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getParent, logoutParent, requestMagicLink } from "@/lib/auth";
import { getDb, seatsRemaining, type ChildRow } from "@/lib/db";
import { uid } from "@/lib/ids";
import { SITE } from "@/lib/config";

export async function sendLoginLink(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const res = await requestMagicLink(email);
  if (!res.ok) redirect(`/login?error=${encodeURIComponent(res.error)}`);
  const q = new URLSearchParams({ sent: "1", email: res.email });
  if (res.showLink) q.set("link", res.url);
  redirect(`/login?${q.toString()}`);
}

export async function doLogout() {
  await logoutParent();
  redirect("/");
}

export async function joinWaitlist(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const child_grade = String(formData.get("grade") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/waitlist?error=" + encodeURIComponent("請輸入有效信箱。"));
  }
  const db = await getDb();
  await db.prepare(
    "INSERT INTO waitlist (id, email, child_grade, note, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(uid("wait"), email, child_grade, note, new Date().toISOString());
  redirect("/waitlist?ok=1");
}

export async function saveChildProfile(formData: FormData) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const id = String(formData.get("child_id") ?? "");
  const db = await getDb();
  const child = (await db.prepare("SELECT * FROM children WHERE id = ? AND parent_id = ?").get(id, parent.id)) as
    | ChildRow
    | undefined;
  if (!child) redirect("/dashboard");
  await db.prepare(
    `UPDATE children SET display_name=?, grade=?, school_progress=?, exam_target=?, weak_topics=? WHERE id=?`,
  ).run(
    String(formData.get("display_name") ?? child.display_name).trim() || child.display_name,
    String(formData.get("grade") ?? ""),
    String(formData.get("school_progress") ?? ""),
    String(formData.get("exam_target") ?? ""),
    String(formData.get("weak_topics") ?? ""),
    id,
  );
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=1");
}

export async function saveFeedback(formData: FormData) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const childId = String(formData.get("child_id") ?? "");
  const weekId = String(formData.get("week_id") ?? "");
  const db = await getDb();
  const child = await db.prepare("SELECT id FROM children WHERE id = ? AND parent_id = ?").get(childId, parent.id);
  if (!child) redirect("/dashboard");
  const difficulty = String(formData.get("difficulty") ?? "");
  const completion = String(formData.get("completion") ?? "");
  const stuck = String(formData.get("stuck_topic") ?? "").trim();
  if (!["too_easy", "ok", "too_hard"].includes(difficulty)) {
    redirect("/dashboard?error=" + encodeURIComponent("請選擇難度。"));
  }
  if (!["none", "some", "all"].includes(completion)) {
    redirect("/dashboard?error=" + encodeURIComponent("請選擇完成度。"));
  }
  await db.prepare(
    `INSERT INTO feedback (id, child_id, week_id, difficulty, completion, stuck_topic, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(child_id, week_id) DO UPDATE SET
       difficulty=excluded.difficulty,
       completion=excluded.completion,
       stuck_topic=excluded.stuck_topic,
       created_at=excluded.created_at`,
  ).run(uid("fb"), childId, weekId, difficulty, completion, stuck, new Date().toISOString());
  revalidatePath("/dashboard");
  redirect("/dashboard?fb=1");
}

export async function startCheckout(formData: FormData) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const plan = String(formData.get("plan") ?? "monthly") === "yearly" ? "yearly" : "monthly";
  const display_name = String(formData.get("display_name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "");
  const school_progress = String(formData.get("school_progress") ?? "");
  const exam_target = String(formData.get("exam_target") ?? "");
  const weak_topics = String(formData.get("weak_topics") ?? "");
  if (!display_name) redirect("/subscribe?error=" + encodeURIComponent("請填孩子稱呼。"));

  const db = await getDb();
  if ((await seatsRemaining(db)) <= 0) redirect("/waitlist");

  const { merchantTradeNo } = await import("@/lib/ecpay");
  const childId = uid("child");
  const tradeNo = merchantTradeNo();
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO children (id, parent_id, display_name, grade, school_progress, exam_target, weak_topics, is_demo, subscription_status, plan, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?)`,
  ).run(childId, parent.id, display_name, grade, school_progress, exam_target, weak_topics, plan, now);

  const amount = plan === "yearly" ? SITE.yearlyPrice : SITE.monthlyPrice;
  await db.prepare(
    `INSERT INTO checkout_attempts (id, parent_id, child_id, plan, amount, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
  ).run(tradeNo, parent.id, childId, plan, amount, now);

  redirect(`/subscribe/pay?trade=${encodeURIComponent(tradeNo)}`);
}

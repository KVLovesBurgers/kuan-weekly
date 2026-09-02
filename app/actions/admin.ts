"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdmin, loginAdmin, logoutAdmin } from "@/lib/auth";
import { getDb, seatsRemaining } from "@/lib/db";
import { uid } from "@/lib/ids";
import { generatePlaceholderWeekPdfs, hydrateWeeks, saveUploadedPdf, snapshotWeeksNow } from "@/lib/weeks";
import { listPersistentPdfs } from "@/lib/pdf-store";

async function requireAdmin() {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  await hydrateWeeks();
  return a;
}

export async function adminLogin(formData: FormData) {
  const res = await loginAdmin(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!res.ok) redirect("/admin/login?error=" + encodeURIComponent(res.error));
  redirect("/admin");
}

export async function adminLogout() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function createWeek(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = uid("week");
  db.prepare(
    `INSERT INTO weeks (id, week_label, title, synopsis, published, published_at, created_at)
     VALUES (?, ?, ?, ?, 0, NULL, ?)`,
  ).run(
    id,
    String(formData.get("week_label") ?? "").trim() || "未命名週次",
    String(formData.get("title") ?? "").trim() || "未命名單元",
    String(formData.get("synopsis") ?? "").trim(),
    new Date().toISOString(),
  );
  await snapshotWeeksNow();
  revalidatePath("/admin");
  redirect(`/admin/weeks/${id}`);
}

export async function publishWeek(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("week_id") ?? "");
  const db = getDb();
  const persisted = await listPersistentPdfs(id);
  const sqliteN = (db.prepare("SELECT COUNT(*) AS n FROM pdf_files WHERE week_id = ?").get(id) as { n: number }).n;
  if (persisted.length < 2 && sqliteN < 2) {
    redirect(`/admin/weeks/${id}?error=` + encodeURIComponent("請先上傳或產生兩份 PDF。"));
  }
  db.prepare("UPDATE weeks SET published = 1, published_at = ? WHERE id = ?").run(new Date().toISOString(), id);
  await snapshotWeeksNow();
  revalidatePath("/admin");
  redirect(`/admin/weeks/${id}?ok=1`);
}

export async function unpublishWeek(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("week_id") ?? "");
  getDb().prepare("UPDATE weeks SET published = 0 WHERE id = ?").run(id);
  await snapshotWeeksNow();
  revalidatePath("/admin");
  redirect(`/admin/weeks/${id}`);
}

export async function generatePdfsAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("week_id") ?? "");
  await generatePlaceholderWeekPdfs(id);
  revalidatePath(`/admin/weeks/${id}`);
  redirect(`/admin/weeks/${id}?gen=1`);
}

export async function uploadPdfsAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("week_id") ?? "");
  const student = formData.get("student") as File | null;
  const parent = formData.get("parent") as File | null;
  try {
    if (student && student.size > 0) {
      const buf = Buffer.from(await student.arrayBuffer());
      await saveUploadedPdf(id, "student", student.name, buf);
    }
    if (parent && parent.size > 0) {
      const buf = Buffer.from(await parent.arrayBuffer());
      await saveUploadedPdf(id, "parent", parent.name, buf);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "上傳失敗";
    redirect(`/admin/weeks/${id}?error=` + encodeURIComponent(msg));
  }
  revalidatePath(`/admin/weeks/${id}`);
  redirect(`/admin/weeks/${id}?up=1`);
}

export async function activateChild(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("child_id") ?? "");
  const db = getDb();
  const child = db.prepare("SELECT * FROM children WHERE id = ?").get(id) as { is_demo: number; subscription_status: string } | undefined;
  if (!child) redirect("/admin");
  if (child.is_demo) redirect("/admin?error=" + encodeURIComponent("示範孩子不佔正取名額。"));
  if (child.subscription_status !== "active" && seatsRemaining(db) <= 0) {
    redirect("/admin?error=" + encodeURIComponent("正取名額已滿。"));
  }
  db.prepare("UPDATE children SET subscription_status = 'active' WHERE id = ?").run(id);
  revalidatePath("/admin");
  redirect("/admin?ok=1");
}

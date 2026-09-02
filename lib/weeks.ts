import fs from "node:fs";
import path from "node:path";
import { getDb, writableRoot, type PdfRow, type WeekRow } from "./db";
import { uid } from "./ids";
import { writeWeekPdfs } from "./pdf";

export function listWeeks(publishedOnly = false) {
  const db = getDb();
  const sql = publishedOnly
    ? "SELECT * FROM weeks WHERE published = 1 ORDER BY created_at DESC"
    : "SELECT * FROM weeks ORDER BY created_at DESC";
  return db.prepare(sql).all() as WeekRow[];
}

export function getWeek(id: string) {
  return getDb().prepare("SELECT * FROM weeks WHERE id = ?").get(id) as WeekRow | undefined;
}

export function pdfsForWeek(weekId: string) {
  return getDb()
    .prepare("SELECT * FROM pdf_files WHERE week_id = ?")
    .all(weekId) as PdfRow[];
}

export async function ensureDemoPdfs(week: WeekRow) {
  const existing = pdfsForWeek(week.id);
  if (existing.length >= 2) return existing;
  const files = await writeWeekPdfs(week);
  const db = getDb();
  const now = new Date().toISOString();
  for (const [kind, file] of [
    ["student", files.student],
    ["parent", files.parent],
  ] as const) {
    db.prepare("DELETE FROM pdf_files WHERE week_id = ? AND kind = ?").run(week.id, kind);
    db.prepare(
      `INSERT INTO pdf_files (id, week_id, kind, filename, storage_path, generated, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
    ).run(uid("pdf"), week.id, kind, file.filename, file.storage_path, now);
  }
  return pdfsForWeek(week.id);
}

export async function generatePlaceholderWeekPdfs(weekId: string) {
  const week = getWeek(weekId);
  if (!week) throw new Error("找不到該週");
  const files = await writeWeekPdfs(week);
  const db = getDb();
  const now = new Date().toISOString();
  for (const [kind, file] of [
    ["student", files.student],
    ["parent", files.parent],
  ] as const) {
    db.prepare("DELETE FROM pdf_files WHERE week_id = ? AND kind = ?").run(weekId, kind);
    db.prepare(
      `INSERT INTO pdf_files (id, week_id, kind, filename, storage_path, generated, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
    ).run(uid("pdf"), weekId, kind, file.filename, file.storage_path, now);
  }
}

export function saveUploadedPdf(weekId: string, kind: "student" | "parent", filename: string, bytes: Buffer) {
  const safeKind = kind === "parent" ? "parent" : "student";
  const stored = `${weekId}-${safeKind}-${Date.now()}.pdf`;
  const rel = `data/pdfs/${stored}`;
  const abs = path.join(writableRoot(), rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, bytes);
  const db = getDb();
  db.prepare("DELETE FROM pdf_files WHERE week_id = ? AND kind = ?").run(weekId, safeKind);
  db.prepare(
    `INSERT INTO pdf_files (id, week_id, kind, filename, storage_path, generated, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
  ).run(uid("pdf"), weekId, safeKind, filename, rel, new Date().toISOString());
}

export function absolutePdfPath(row: PdfRow) {
  return path.join(writableRoot(), row.storage_path);
}

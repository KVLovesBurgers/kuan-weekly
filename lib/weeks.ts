import fs from "node:fs";
import path from "node:path";
import { getDb, writableRoot, type PdfRow, type WeekRow } from "./db";
import { uid } from "./ids";
import { writeWeekPdfs } from "./pdf";
import {
  listPersistentPdfs,
  loadWeeksSnapshot,
  persistWeeksSnapshot,
  saveUploadedPdfPersistent,
} from "./pdf-store";

export async function hydrateWeeks() {
  const remote = await loadWeeksSnapshot();
  if (!remote?.length) return;
  const db = await getDb();
  for (const w of remote) {
    const existing = (await db.prepare("SELECT id FROM weeks WHERE id = ?").get(w.id)) as { id: string } | undefined;
    if (existing) {
      await db.prepare(
        `UPDATE weeks SET week_label = ?, title = ?, synopsis = ?, published = ?, published_at = ?, created_at = ?
         WHERE id = ?`,
      ).run(w.week_label, w.title, w.synopsis, w.published, w.published_at, w.created_at, w.id);
    } else {
      await db.prepare(
        `INSERT INTO weeks (id, week_label, title, synopsis, published, published_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(w.id, w.week_label, w.title, w.synopsis, w.published, w.published_at, w.created_at);
    }
  }
}

export async function snapshotWeeksNow() {
  const weeks = (await (await getDb()).prepare("SELECT * FROM weeks ORDER BY created_at DESC").all()) as WeekRow[];
  return persistWeeksSnapshot(weeks);
}

export async function listWeeks(publishedOnly = false) {
  await hydrateWeeks();
  const db = await getDb();
  const sql = publishedOnly
    ? "SELECT * FROM weeks WHERE published = 1 ORDER BY created_at DESC"
    : "SELECT * FROM weeks ORDER BY created_at DESC";
  return (await db.prepare(sql).all()) as WeekRow[];
}

export async function getWeek(id: string) {
  return (await (await getDb()).prepare("SELECT * FROM weeks WHERE id = ?").get(id)) as WeekRow | undefined;
}

export async function pdfsForWeek(weekId: string) {
  const persistent = await listPersistentPdfs(weekId);
  if (persistent.length) {
    return persistent.map(
      (p) =>
        ({
          id: `${weekId}-${p.kind}`,
          week_id: weekId,
          kind: p.kind,
          filename: p.filename,
          storage_path: `data/pdfs/${weekId}-${p.kind}.pdf`,
          generated: p.generated,
          created_at: "",
        }) satisfies PdfRow,
    );
  }
  return (await (await getDb())
    .prepare("SELECT * FROM pdf_files WHERE week_id = ?")
    .all(weekId)) as PdfRow[];
}

export async function ensureDemoPdfs(week: WeekRow) {
  const existing = await pdfsForWeek(week.id);
  if (existing.length >= 2) return existing;
  await generatePlaceholderWeekPdfs(week.id);
  return pdfsForWeek(week.id);
}

export async function generatePlaceholderWeekPdfs(weekId: string) {
  const week = await getWeek(weekId);
  if (!week) throw new Error("找不到該週");
  const files = await writeWeekPdfs(week);
  const db = await getDb();
  const now = new Date().toISOString();
  for (const [kind, file] of [
    ["student", files.student],
    ["parent", files.parent],
  ] as const) {
    const abs = path.join(writableRoot(), file.storage_path);
    const bytes = fs.readFileSync(abs);
    await db.prepare("DELETE FROM pdf_files WHERE week_id = ? AND kind = ?").run(weekId, kind);
    await db.prepare(
      `INSERT INTO pdf_files (id, week_id, kind, filename, storage_path, generated, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
    ).run(uid("pdf"), weekId, kind, file.filename, file.storage_path, now);
    await saveUploadedPdfPersistent(weekId, kind, file.filename, bytes, 1);
  }
}

export async function saveUploadedPdf(
  weekId: string,
  kind: "student" | "parent",
  filename: string,
  bytes: Buffer,
) {
  const safeKind = kind === "parent" ? "parent" : "student";
  const stored = `${weekId}-${safeKind}.pdf`;
  const rel = `data/pdfs/${stored}`;
  const abs = path.join(writableRoot(), rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, bytes);
  const db = await getDb();
  await db.prepare("DELETE FROM pdf_files WHERE week_id = ? AND kind = ?").run(weekId, safeKind);
  await db.prepare(
    `INSERT INTO pdf_files (id, week_id, kind, filename, storage_path, generated, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
  ).run(uid("pdf"), weekId, safeKind, filename, rel, new Date().toISOString());
  await saveUploadedPdfPersistent(weekId, safeKind, filename, bytes, 0);
}

export function absolutePdfPath(row: PdfRow) {
  return path.join(writableRoot(), row.storage_path);
}

import fs from "node:fs";
import path from "node:path";
import { writableRoot, type WeekRow } from "./db";

const REPO = process.env.GITHUB_REPO || "KVLovesBurgers/kuan-weekly";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const WEEKS_PATH = "stored-pdfs/weeks.json";

export function ghToken() {
  return process.env.GITHUB_TOKEN || "";
}

function objectPath(weekId: string, file: string) {
  return `stored-pdfs/${weekId}/${file}`;
}

export type StoredPdf = {
  kind: "student" | "parent";
  filename: string;
  generated: number;
};

type PdfMeta = {
  student?: string;
  parent?: string;
  generated?: { student?: number; parent?: number };
};

async function gh(method: string, apiPath: string, body?: unknown) {
  const token = ghToken();
  if (!token) return null;
  const res = await fetch(`https://api.github.com${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "kuan-weekly",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (res.status === 404) return { ok: false as const, status: 404, json: null };
  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
}

async function putGithubFile(relPath: string, bytes: Buffer, message: string) {
  const existing = await gh("GET", `/repos/${REPO}/contents/${relPath}?ref=${BRANCH}`);
  const sha =
    existing && existing.ok && existing.json && typeof existing.json === "object"
      ? (existing.json as { sha?: string }).sha
      : undefined;
  const put = await gh("PUT", `/repos/${REPO}/contents/${relPath}`, {
    message,
    content: bytes.toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
  if (!put?.ok) {
    const msg =
      put?.json && typeof put.json === "object" && "message" in put.json
        ? String((put.json as { message?: string }).message)
        : "";
    throw new Error(`GitHub 存檔失敗（${put?.status ?? "no-token"}）${msg ? " " + msg : ""}`);
  }
}

async function getGithubFile(relPath: string): Promise<Buffer | null> {
  const existing = await gh("GET", `/repos/${REPO}/contents/${relPath}?ref=${BRANCH}`);
  if (!existing?.ok || !existing.json) return null;
  const content = (existing.json as { content?: string; encoding?: string }).content;
  if (!content) return null;
  return Buffer.from(content.replace(/\n/g, ""), "base64");
}

async function readMeta(weekId: string): Promise<PdfMeta> {
  const buf = await getGithubFile(objectPath(weekId, "meta.json"));
  if (!buf) return {};
  try {
    return JSON.parse(buf.toString("utf8")) as PdfMeta;
  } catch {
    return {};
  }
}

export async function saveUploadedPdfPersistent(
  weekId: string,
  kind: "student" | "parent",
  filename: string,
  bytes: Buffer,
  generated = 0,
) {
  const safeKind = kind === "parent" ? "parent" : "student";
  const dir = path.join(writableRoot(), "data", "pdfs");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${weekId}-${safeKind}.pdf`), bytes);

  if (!ghToken()) return;
  const meta = await readMeta(weekId);
  meta[safeKind] = filename;
  meta.generated = { ...meta.generated, [safeKind]: generated ? 1 : 0 };
  await putGithubFile(objectPath(weekId, `${safeKind}.pdf`), bytes, `store ${weekId} ${safeKind} pdf`);
  await putGithubFile(
    objectPath(weekId, "meta.json"),
    Buffer.from(JSON.stringify(meta), "utf8"),
    `store ${weekId} pdf names`,
  );
}

export async function readPersistentPdf(
  weekId: string,
  kind: "student" | "parent",
): Promise<{ filename: string; bytes: Buffer } | null> {
  const safeKind = kind === "parent" ? "parent" : "student";
  if (ghToken()) {
    const bytes = await getGithubFile(objectPath(weekId, `${safeKind}.pdf`));
    if (bytes) {
      const meta = await readMeta(weekId);
      return { filename: meta[safeKind] || `${safeKind}.pdf`, bytes };
    }
  }
  const exact = path.join(writableRoot(), "data", "pdfs", `${weekId}-${safeKind}.pdf`);
  if (fs.existsSync(exact)) {
    return { filename: `${safeKind}.pdf`, bytes: fs.readFileSync(exact) };
  }
  const dir = path.join(writableRoot(), "data", "pdfs");
  const matches = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((n) => n.startsWith(`${weekId}-${safeKind}`))
    : [];
  if (matches.length === 0) return null;
  const name = matches.sort().at(-1)!;
  return { filename: name, bytes: fs.readFileSync(path.join(dir, name)) };
}

export async function listPersistentPdfs(weekId: string): Promise<StoredPdf[]> {
  const out: StoredPdf[] = [];
  let meta: PdfMeta = {};
  if (ghToken()) meta = await readMeta(weekId);
  for (const kind of ["student", "parent"] as const) {
    const file = await readPersistentPdf(weekId, kind);
    if (file) {
      out.push({
        kind,
        filename: file.filename,
        generated: meta.generated?.[kind] ? 1 : 0,
      });
    }
  }
  return out;
}

export async function persistWeeksSnapshot(weeks: WeekRow[]) {
  if (!ghToken()) return;
  await putGithubFile(
    WEEKS_PATH,
    Buffer.from(JSON.stringify(weeks, null, 2), "utf8"),
    "sync weeks metadata",
  );
}

export async function loadWeeksSnapshot(): Promise<WeekRow[] | null> {
  const buf = await getGithubFile(WEEKS_PATH);
  if (!buf) return null;
  try {
    const data = JSON.parse(buf.toString("utf8")) as WeekRow[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

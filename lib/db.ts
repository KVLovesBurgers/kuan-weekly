import fs from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { createClient, type Client, type InValue } from "@libsql/client";
import { DEMO_PARENT_EMAIL, seatCap } from "./config";

type Stmt = {
  get: (...args: unknown[]) => Promise<unknown>;
  run: (...args: unknown[]) => Promise<unknown>;
  all: (...args: unknown[]) => Promise<unknown[]>;
};

export type KuanDb = {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => Stmt;
};

const globalForDb = globalThis as unknown as { __kuanDb?: Promise<KuanDb> };

function wrapSqlite(raw: DatabaseSync): KuanDb {
  return {
    async exec(sql) {
      raw.exec(sql);
    },
    prepare(sql) {
      const s = raw.prepare(sql);
      return {
        get: async (...args) => s.get(...(args as SQLInputValue[])),
        run: async (...args) => {
          s.run(...(args as SQLInputValue[]));
        },
        all: async (...args) => s.all(...(args as SQLInputValue[])) as unknown[],
      };
    },
  };
}

function wrapTurso(client: Client): KuanDb {
  return {
    async exec(sql) {
      await client.executeMultiple(sql);
    },
    prepare(sql) {
      return {
        get: async (...args) => {
          const r = await client.execute({ sql, args: args as InValue[] });
          return r.rows[0];
        },
        run: async (...args) => {
          await client.execute({ sql, args: args as InValue[] });
        },
        all: async (...args) => {
          const r = await client.execute({ sql, args: args as InValue[] });
          return r.rows as unknown[];
        },
      };
    },
  };
}

export function writableRoot() {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.VERCEL) return "/tmp/kuan-weekly";
  return process.cwd();
}

function dbPath() {
  const rel = process.env.DATABASE_PATH ?? "./data/kuan.sqlite";
  if (path.isAbsolute(rel)) return rel;
  return path.join(writableRoot(), rel);
}

function tursoUrl() {
  return (process.env.TURSO_DATABASE_URL || "").trim();
}

async function openDb(): Promise<KuanDb> {
  fs.mkdirSync(path.join(writableRoot(), "data", "pdfs"), { recursive: true });
  let db: KuanDb;
  const url = tursoUrl();
  if (url) {
    db = wrapTurso(
      createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    );
  } else {
    const file = dbPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const raw = new DatabaseSync(file);
    db = wrapSqlite(raw);
    await db.exec(process.env.VERCEL ? "PRAGMA journal_mode = DELETE" : "PRAGMA journal_mode = WAL");
    await db.exec("PRAGMA foreign_keys = ON");
  }
  await migrate(db);
  await seed(db);
  return db;
}

export function getDb() {
  if (!globalForDb.__kuanDb) globalForDb.__kuanDb = openDb();
  return globalForDb.__kuanDb;
}

async function migrate(db: KuanDb) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS parents (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS magic_links (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (parent_id) REFERENCES parents(id)
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      display_name TEXT NOT NULL,
      grade TEXT NOT NULL DEFAULT '',
      school_progress TEXT NOT NULL DEFAULT '',
      exam_target TEXT NOT NULL DEFAULT '',
      weak_topics TEXT NOT NULL DEFAULT '',
      is_demo INTEGER NOT NULL DEFAULT 0,
      subscription_status TEXT NOT NULL DEFAULT 'none',
      plan TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (parent_id) REFERENCES parents(id)
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      child_grade TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id TEXT PRIMARY KEY,
      week_label TEXT NOT NULL,
      title TEXT NOT NULL,
      synopsis TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pdf_files (
      id TEXT PRIMARY KEY,
      week_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      filename TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      generated INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE (week_id, kind),
      FOREIGN KEY (week_id) REFERENCES weeks(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      week_id TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      completion TEXT NOT NULL,
      stuck_topic TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      UNIQUE (child_id, week_id),
      FOREIGN KEY (child_id) REFERENCES children(id),
      FOREIGN KEY (week_id) REFERENCES weeks(id)
    );

    CREATE TABLE IF NOT EXISTS checkout_attempts (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      child_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

async function seed(db: KuanDb) {
  const parent = (await db.prepare("SELECT id FROM parents WHERE email = ?").get(DEMO_PARENT_EMAIL)) as
    | { id: string }
    | undefined;
  if (parent) return;

  const now = new Date().toISOString();
  const parentId = "parent_demo";
  const childId = "child_demo";
  const weekId = "week_demo_01";

  await db.prepare("INSERT INTO parents (id, email, created_at) VALUES (?, ?, ?)").run(
    parentId,
    DEMO_PARENT_EMAIL,
    now,
  );
  await db
    .prepare(
      `INSERT INTO children
        (id, parent_id, display_name, grade, school_progress, exam_target, weak_topics, is_demo, subscription_status, plan, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'demo', NULL, ?)`,
    )
    .run(
      childId,
      parentId,
      "安安（示範・未付費）",
      "小五",
      "康軒版・分數與小數應用剛上完，正要進入比率",
      "跟上段考",
      "應用題列式、分數四則",
      now,
    );
  await db
    .prepare(
      `INSERT INTO weeks (id, week_label, title, synopsis, published, published_at, created_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
    )
    .run(
      weekId,
      "2026 第 36 週",
      "分數應用與比率",
      "對齊小五進度：分數應用與比率。學生題本可獨立作答；家長解答含思路拆解。",
      now,
      now,
    );
}

export async function paidSeatCount(db: KuanDb) {
  const row = (await db
    .prepare("SELECT COUNT(*) AS n FROM children WHERE subscription_status = 'active'")
    .get()) as { n: number | bigint } | undefined;
  return Number(row?.n ?? 0);
}

export async function seatsRemaining(db?: KuanDb) {
  const d = db ?? (await getDb());
  return Math.max(0, seatCap() - (await paidSeatCount(d)));
}

export type ChildRow = {
  id: string;
  parent_id: string;
  display_name: string;
  grade: string;
  school_progress: string;
  exam_target: string;
  weak_topics: string;
  is_demo: number;
  subscription_status: string;
  plan: string | null;
  created_at: string;
};

export type WeekRow = {
  id: string;
  week_label: string;
  title: string;
  synopsis: string;
  published: number;
  published_at: string | null;
  created_at: string;
};

export type PdfRow = {
  id: string;
  week_id: string;
  kind: "student" | "parent";
  filename: string;
  storage_path: string;
  generated: number;
  created_at: string;
};

export type FeedbackRow = {
  id: string;
  child_id: string;
  week_id: string;
  difficulty: string;
  completion: string;
  stuck_topic: string;
  created_at: string;
};

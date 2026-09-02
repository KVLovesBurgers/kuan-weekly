import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { adminLogout, activateChild, createWeek } from "@/app/actions/admin";
import { getDb, paidSeatCount, seatsRemaining, type ChildRow, type FeedbackRow } from "@/lib/db";
import { listWeeks, pdfsForWeek } from "@/lib/weeks";
import { COMPLETION_OPTIONS, DIFFICULTY_OPTIONS, seatCap } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const sp = await searchParams;
  const db = getDb();
  const children = db.prepare("SELECT * FROM children ORDER BY created_at DESC").all() as ChildRow[];
  const weeks = await listWeeks(false);
  const weekFiles: Record<string, Awaited<ReturnType<typeof pdfsForWeek>>> = {};
  for (const w of weeks) {
    weekFiles[w.id] = await pdfsForWeek(w.id);
  }
  const wait = db.prepare("SELECT * FROM waitlist ORDER BY created_at DESC").all() as {
    id: string;
    email: string;
    child_grade: string;
    note: string;
    created_at: string;
  }[];
  const feedbacks = db
    .prepare(
      `SELECT f.*, c.display_name, w.week_label, w.title
       FROM feedback f
       JOIN children c ON c.id = f.child_id
       JOIN weeks w ON w.id = f.week_id
       ORDER BY f.created_at DESC`,
    )
    .all() as (FeedbackRow & { display_name: string; week_label: string; title: string })[];

  const diffLabel: Record<string, string> = Object.fromEntries(DIFFICULTY_OPTIONS);
  const doneLabel: Record<string, string> = Object.fromEntries(COMPLETION_OPTIONS);

  return (
    <main className="section">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p className="kicker">老師後台</p>
            <h1 className="display" style={{ margin: 0 }}>
              {admin.email}
            </h1>
            <p className="muted">
              正取 {paidSeatCount(db)} / {seatCap()} · 剩餘 {seatsRemaining(db)}
            </p>
          </div>
          <form action={adminLogout}>
            <button className="btn btn-paper">登出</button>
          </form>
        </div>
        {sp.error ? <p className="banner warn">{sp.error}</p> : null}
        {sp.ok ? <p className="banner ok">已更新。</p> : null}

        <section style={{ marginTop: 32 }}>
          <h2 className="display">發布週練</h2>
          <form action={createWeek} className="form card">
            <label>週次標籤</label>
            <input name="week_label" placeholder="2026 第 37 週" required />
            <label>單元標題</label>
            <input name="title" placeholder="指數與對數入門" required />
            <label>給家長看的一句話</label>
            <textarea name="synopsis" />
            <button className="btn btn-ink" type="submit">
              建立週次
            </button>
          </form>
          <table className="table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>週次</th>
                <th>單元</th>
                <th>PDF</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => {
                const files = weekFiles[w.id] ?? [];
                return (
                  <tr key={w.id}>
                    <td>
                      <Link href={`/admin/weeks/${w.id}`} style={{ textDecoration: "underline" }}>
                        {w.week_label}
                      </Link>
                    </td>
                    <td>{w.title}</td>
                    <td>
                      {files.find((f) => f.kind === "student") ? "學生" : "—"} /{" "}
                      {files.find((f) => f.kind === "parent") ? "家長" : "—"}
                    </td>
                    <td>{w.published ? "已發布" : "草稿"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">孩子名單</h2>
          <table className="table">
            <thead>
              <tr>
                <th>稱呼</th>
                <th>年級／目標</th>
                <th>狀態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {children.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.display_name}
                    {c.is_demo ? " · 示範" : ""}
                  </td>
                  <td>
                    {c.grade} · {c.exam_target}
                    <div className="muted">{c.weak_topics}</div>
                  </td>
                  <td>{c.subscription_status}</td>
                  <td>
                    {!c.is_demo && c.subscription_status !== "active" ? (
                      <form action={activateChild}>
                        <input type="hidden" name="child_id" value={c.id} />
                        <button className="btn btn-paper" type="submit" style={{ minHeight: 36 }}>
                          手動開席
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">本週回饋</h2>
          {feedbacks.length === 0 ? <p className="muted">尚無回饋。</p> : null}
          <ul>
            {feedbacks.map((f) => (
              <li key={f.id} style={{ marginBottom: 10 }}>
                <strong>{f.display_name}</strong> · {f.week_label} {f.title} · {diffLabel[f.difficulty]} ·{" "}
                {doneLabel[f.completion]} · {f.stuck_topic || "未填卡關"}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">候補</h2>
          {wait.length === 0 ? <p className="muted">目前沒有候補。</p> : null}
          <ul>
            {wait.map((w) => (
              <li key={w.id}>
                {w.email} · {w.child_grade} · {w.note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

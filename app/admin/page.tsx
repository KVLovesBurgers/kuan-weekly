import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { adminLogout, activateChild, createWeek, deleteLead, deleteQuizResults, deleteChild } from "@/app/actions/admin";
import { getDb, paidSeatCount, seatsRemaining, type ChildRow, type FeedbackRow } from "@/lib/db";
import { listWeeks, pdfsForWeek } from "@/lib/weeks";
import { funnelBySrc, rate } from "@/lib/funnel";
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
  const db = await getDb();
  const children = (await db.prepare("SELECT * FROM children ORDER BY created_at DESC").all()) as ChildRow[];
  const weeks = await listWeeks(false);
  const weekFiles: Record<string, Awaited<ReturnType<typeof pdfsForWeek>>> = {};
  for (const w of weeks) {
    weekFiles[w.id] = await pdfsForWeek(w.id);
  }
  const wait = (await db.prepare("SELECT * FROM waitlist ORDER BY created_at DESC").all()) as {
    id: string;
    email: string;
    child_grade: string;
    note: string;
    created_at: string;
  }[];
  const leads = (await db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 200").all()) as {
    id: string;
    email: string;
    grade: string;
    role: string;
    source: string;
    utm: string;
    hits: number;
    created_at: string;
  }[];
  const quizRows = (await db
    .prepare("SELECT email, subject, score, total, src, created_at FROM quiz_results ORDER BY created_at DESC LIMIT 200")
    .all()) as { email: string; subject: string; score: number; total: number; src: string; created_at: string }[];
  const fDays = sp.fdays === "28" ? 28 : 7;
  const funnel = await funnelBySrc(db, fDays);
  const fTot = funnel.reduce((t, r) => ({ qi: t.qi + r.quizIn, ql: t.ql + r.quizLead, si: t.si + r.sampleIn, sl: t.sl + r.sampleLead }), { qi: 0, ql: 0, si: 0, sl: 0 });
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const events = (await db
    .prepare(
      `SELECT kind, target, source, COUNT(*) AS n FROM site_events WHERE created_at >= ?
       GROUP BY kind, target, source ORDER BY n DESC LIMIT 100`,
    )
    .all(since30)) as { kind: string; target: string; source: string; n: number }[];
  const leadSrc = (await db
    .prepare("SELECT source, COUNT(*) AS n FROM leads WHERE created_at >= ? GROUP BY source ORDER BY n DESC")
    .all(since30)) as { source: string; n: number }[];
  const feedbacks = (await db
    .prepare(
      `SELECT f.*, c.display_name, w.week_label, w.title
       FROM feedback f
       JOIN children c ON c.id = f.child_id
       JOIN weeks w ON w.id = f.week_id
       ORDER BY f.created_at DESC`,
    )
    .all()) as (FeedbackRow & { display_name: string; week_label: string; title: string })[];

  const paid = await paidSeatCount(db);
  const remaining = await seatsRemaining(db);
  const diffLabel: Record<string, string> = Object.fromEntries(DIFFICULTY_OPTIONS);
  const doneLabel: Record<string, string> = Object.fromEntries(COMPLETION_OPTIONS);

  return (
    <main id="main" className="section">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p className="kicker">老師後台</p>
            <h1 className="display" style={{ margin: 0 }}>
              {admin.email}
            </h1>
            <p className="muted">
              正取 {paid} / {seatCap()} · 剩餘 {remaining}
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
                    {c.is_demo ? <span className="muted">（示範）</span> : null}
                  </td>
                  <td>
                    {c.grade}
                    {c.exam_target ? <> · {c.exam_target}</> : null}
                    {c.weak_topics ? <div className="muted">{c.weak_topics}</div> : null}
                  </td>
                  <td>
                    {c.is_demo
                      ? "示範"
                      : c.subscription_status === "active"
                        ? "已開通"
                        : c.subscription_status === "pending"
                          ? "待匯款"
                          : c.subscription_status}
                  </td>
                  <td>
                    {!c.is_demo && c.subscription_status !== "active" ? (
                      <form action={activateChild}>
                        <input type="hidden" name="child_id" value={c.id} />
                        <button className="btn btn-paper" type="submit" style={{ minHeight: 36 }}>
                          手動開席
                        </button>
                      </form>
                    ) : null}
                    <ConfirmDelete action={deleteChild} name="child_id" value={c.id} message={`確定要刪除「${c.display_name}」嗎？會一併刪除這個孩子的待匯款紀錄與回饋，無法復原。`} />
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

        <section style={{ marginTop: 40 }} id="funnel">
          <h2 className="display">漏斗統計（依 ?src= 來源，最近 {fDays} 天）</h2>
          <p className="muted">
            期間：{fDays === 7 ? <strong>7 天</strong> : <Link href="/admin?fdays=7#funnel">7 天</Link>}　｜　{fDays === 28 ? <strong>28 天</strong> : <Link href="/admin?fdays=28#funnel">28 天</Link>}
          </p>
          <p className="muted" style={{ fontSize: 14 }}>進入＝頁面瀏覽次數（匿名，重新整理會重複算）。留資料＝/quiz 交卷留信箱（同信箱算一次）、/sample 第一次留信箱。已排除測試信箱與測試來源（test、box、demo、sample-track）。</p>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr><th>來源 src</th><th>/quiz 進入</th><th>/quiz 留資料</th><th>/quiz 轉換率</th><th>/sample 進入</th><th>/sample 留資料</th><th>/sample 轉換率</th></tr>
              </thead>
              <tbody>
                {funnel.length === 0 ? (
                  <tr><td colSpan={7} className="muted">這段期間還沒有資料。</td></tr>
                ) : (
                  funnel.map((r) => (
                    <tr key={r.src}>
                      <td>{r.src}</td><td>{r.quizIn}</td><td>{r.quizLead}</td><td>{rate(r.quizLead, r.quizIn)}</td>
                      <td>{r.sampleIn}</td><td>{r.sampleLead}</td><td>{rate(r.sampleLead, r.sampleIn)}</td>
                    </tr>
                  ))
                )}
                <tr style={{ fontWeight: 700 }}>
                  <td>合計</td><td>{fTot.qi}</td><td>{fTot.ql}</td><td>{rate(fTot.ql, fTot.qi)}</td><td>{fTot.si}</td><td>{fTot.sl}</td><td>{rate(fTot.sl, fTot.si)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">來源統計（最近 30 天）</h2>
          <p className="muted">試閱留信箱：{leadSrc.length ? leadSrc.map((r) => `${r.source || "direct"} ${Number(r.n)}`).join("、") : "無"}</p>
          {events.length === 0 ? <p className="muted">還沒有單元包或下載紀錄。</p> : null}
          <ul>
            {events.map((e) => (
              <li key={`${e.kind}-${e.target}-${e.source}`}>
                {({ unit_view: "單元包頁瀏覽", units_view: "單元包列表瀏覽", unit_pdf: "單元包 PDF 下載", sample_pdf: "試閱 PDF 下載", share_click: "傳給爸媽看", quiz_view: "小卷頁進入", sample_view: "試閱頁進入" } as Record<string, string>)[e.kind] ?? e.kind} · {e.target || "-"} · 來源 {e.source || "direct"} · {Number(e.n)} 次
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">試閱名單（/sample）</h2>
          {leads.length === 0 ? <p className="muted">目前沒有試閱名單。</p> : null}
          <ul>
            {leads.map((l) => (
              <li key={l.id}>
                {l.email} · {l.role || "未填"} · {l.grade || "未填年級"} · 來源 {l.source || "direct"}
                {l.utm ? ` · ${l.utm}` : ""} · {Number(l.hits)} 次 ·{" "}
                {new Date(l.created_at).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })}{" "}
                <form action={deleteLead} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="u" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit" }}>
                    刪除
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="display">線上小卷成績（/quiz）</h2>
          {quizRows.length === 0 ? <p className="muted">目前沒有小卷成績。</p> : null}
          <ul>
            {quizRows.map((q, i) => (
              <li key={`${q.email}-${q.created_at}-${i}`}>
                {q.email} · {q.subject} · {Number(q.score)}/{Number(q.total)} · 來源 {q.src || "direct"} ·{" "}
                {new Date(q.created_at).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })}{" "}
                <form action={deleteQuizResults} style={{ display: "inline" }}>
                  <input type="hidden" name="email" value={q.email} />
                  <button type="submit" className="u" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit" }}>
                    刪除此信箱全部成績
                  </button>
                </form>
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

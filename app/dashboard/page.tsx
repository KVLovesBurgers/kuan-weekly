import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getParent } from "@/lib/auth";
import { doLogout, saveChildProfile, saveFeedback } from "@/app/actions/parent";
import { getDb, type ChildRow, type FeedbackRow } from "@/lib/db";
import { ensureDemoPdfs, listWeeks, pdfsForWeek } from "@/lib/weeks";
import { COMPLETION_OPTIONS, DIFFICULTY_OPTIONS, GRADE_OPTIONS } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/login");
  const sp = await searchParams;
  const db = await getDb();
  const children = (await db
    .prepare("SELECT * FROM children WHERE parent_id = ? ORDER BY is_demo DESC, created_at")
    .all(parent.id)) as ChildRow[];

  const weeks = await listWeeks(true);
  if (weeks[0]) await ensureDemoPdfs(weeks[0]);
  const weekFiles: Record<string, Awaited<ReturnType<typeof pdfsForWeek>>> = {};
  for (const week of weeks) {
    weekFiles[week.id] = await pdfsForWeek(week.id);
  }
  const feedbackByKey: Record<string, FeedbackRow | undefined> = {};
  for (const child of children) {
    for (const week of weeks) {
      feedbackByKey[`${child.id}:${week.id}`] = (await db
        .prepare("SELECT * FROM feedback WHERE child_id = ? AND week_id = ?")
        .get(child.id, week.id)) as FeedbackRow | undefined;
    }
  }

  return (
    <>
      <Header parentEmail={parent.email} />
      <main className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p className="kicker">家長後台</p>
              <h1 className="display" style={{ margin: 0 }}>
                {parent.email}
              </h1>
            </div>
            <form action={doLogout}>
              <button className="btn btn-paper" type="submit">
                登出
              </button>
            </form>
          </div>
          {sp.saved ? <p className="banner ok">孩子資料已更新。</p> : null}
          {sp.fb ? <p className="banner ok">本週回饋已送出，老師會在後台看到。</p> : null}
          {sp.error ? <p className="banner warn">{sp.error}</p> : null}

          {children.length === 0 ? (
            <p className="card" style={{ marginTop: 24 }}>
              尚未登記孩子。可先<a href="/subscribe">訂閱並付款</a>，或使用示範信箱登入。
            </p>
          ) : null}

          {children.map((child) => {
            const canDownload =
              child.subscription_status === "active" || child.subscription_status === "demo";
            return (
              <section key={child.id} style={{ marginTop: 36 }}>
                <div className="card">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <h2 className="display" style={{ margin: 0 }}>
                      {child.display_name}
                    </h2>
                    {child.is_demo ? <span className="badge demo">示範・未付費走流程</span> : null}
                    {child.subscription_status === "pending" ? (
                      <span className="badge wait">待開通（尚未完成付款）</span>
                    ) : null}
                    {child.subscription_status === "active" ? <span className="badge">已開通</span> : null}
                  </div>
                  <p className="muted">
                    {child.grade} · {child.exam_target || "尚未填應考目標"}
                  </p>

                  {!canDownload ? (
                    <p className="banner warn">
                      此孩子尚未開通，看不到週練 PDF。請用示範孩子瀏覽，或等候老師開席。
                    </p>
                  ) : null}

                  {canDownload
                    ? weeks.map((week, idx) => {
                        const files = weekFiles[week.id] ?? [];
                        const fb = feedbackByKey[`${child.id}:${week.id}`];
                        const student = files.find((f) => f.kind === "student");
                        const parentPdf = files.find((f) => f.kind === "parent");
                        return (
                          <article
                            key={week.id}
                            style={{
                              marginTop: 20,
                              paddingTop: 16,
                              borderTop: "1px solid var(--line)",
                            }}
                          >
                            <p className="kicker">{idx === 0 ? "本週" : "過往週次"}</p>
                            <h3 className="display">
                              {week.week_label} · {week.title}
                            </h3>
                            <p className="muted">{week.synopsis}</p>
                            <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              {student ? (
                                <a className="btn btn-ink" href={`/files/${week.id}/student`}>
                                  下載學生題本
                                </a>
                              ) : (
                                <span className="muted">學生題本準備中</span>
                              )}
                              {parentPdf ? (
                                <a className="btn btn-paper" href={`/files/${week.id}/parent`}>
                                  下載家長解答
                                </a>
                              ) : null}
                            </p>
                            {idx === 0 ? (
                              <form action={saveFeedback} className="form" style={{ marginTop: 16 }}>
                                <input type="hidden" name="child_id" value={child.id} />
                                <input type="hidden" name="week_id" value={week.id} />
                                <label>難度</label>
                                <select name="difficulty" defaultValue={fb?.difficulty ?? "ok"}>
                                  {DIFFICULTY_OPTIONS.map(([v, l]) => (
                                    <option key={v} value={v}>
                                      {l}
                                    </option>
                                  ))}
                                </select>
                                <label>完成度</label>
                                <select name="completion" defaultValue={fb?.completion ?? "some"}>
                                  {COMPLETION_OPTIONS.map(([v, l]) => (
                                    <option key={v} value={v}>
                                      {l}
                                    </option>
                                  ))}
                                </select>
                                <label>卡關單元（短句）</label>
                                <input
                                  name="stuck_topic"
                                  defaultValue={fb?.stuck_topic ?? ""}
                                  placeholder="例如：判別式符號、頂點配方"
                                />
                                <button className="btn btn-steel" type="submit">
                                  送出本週回饋
                                </button>
                              </form>
                            ) : fb ? (
                              <p className="muted" style={{ fontSize: 13 }}>
                                當時回饋：{DIFFICULTY_OPTIONS.find(([v]) => v === fb.difficulty)?.[1]} ·
                                完成 {COMPLETION_OPTIONS.find(([v]) => v === fb.completion)?.[1]} · {fb.stuck_topic || "未填卡關"}
                              </p>
                            ) : null}
                          </article>
                        );
                      })
                    : null}

                  {canDownload && weeks.length === 0 ? (
                    <p className="muted">老師尚未發布任何一週。</p>
                  ) : null}

                  <form action={saveChildProfile} className="form" style={{ marginTop: 24 }}>
                    <input type="hidden" name="child_id" value={child.id} />
                    <h3 className="display">孩子資料</h3>
                    <label>稱呼</label>
                    <input name="display_name" defaultValue={child.display_name} />
                    <label>年級</label>
                    <select name="grade" defaultValue={child.grade}>
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                    <label>校內進度</label>
                    <textarea name="school_progress" defaultValue={child.school_progress} />
                    <label>應考目標</label>
                    <input
                      name="exam_target"
                      defaultValue={child.exam_target}
                      placeholder="例如：跟上段考、把分數應用寫穩"
                    />
                    <label>弱點單元</label>
                    <textarea name="weak_topics" defaultValue={child.weak_topics} />
                    <button className="btn btn-paper" type="submit">
                      儲存資料
                    </button>
                  </form>
                </div>
              </section>
            );
          })}

          <p style={{ marginTop: 28 }}>
            <Link href="/subscribe" className="btn btn-ink">
              再為一名孩子訂閱
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

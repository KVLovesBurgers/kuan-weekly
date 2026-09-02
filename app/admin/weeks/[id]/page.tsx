import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { generatePdfsAction, publishWeek, unpublishWeek, uploadPdfsAction } from "@/app/actions/admin";
import { getWeek, pdfsForWeek } from "@/lib/weeks";

export const dynamic = "force-dynamic";

export default async function WeekAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const { id } = await params;
  const sp = await searchParams;
  const week = getWeek(id);
  if (!week) redirect("/admin");
  const files = pdfsForWeek(id);

  return (
    <main className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <p>
          <Link href="/admin">← 後台</Link>
        </p>
        <p className="kicker">{week.published ? "已發布" : "草稿"}</p>
        <h1 className="display">
          {week.week_label} · {week.title}
        </h1>
        <p className="muted">{week.synopsis}</p>
        {sp.error ? <p className="banner warn">{sp.error}</p> : null}
        {sp.gen ? <p className="banner ok">已產生示範 PDF（可被上傳檔覆蓋）。</p> : null}
        {sp.up ? <p className="banner ok">已儲存上傳檔。</p> : null}
        {sp.ok ? <p className="banner ok">已發布，家長後台可見。</p> : null}

        <section className="card" style={{ marginTop: 20 }}>
          <h2 className="display">目前檔案</h2>
          <ul>
            {files.map((f) => (
              <li key={f.id}>
                {f.kind === "student" ? "學生題本" : "家長解答"}：
                <a href={`/pdf/${f.id}`} style={{ textDecoration: "underline" }}>
                  {f.filename}
                </a>
                {f.generated ? "（系統產生）" : "（上傳）"}
              </li>
            ))}
            {files.length === 0 ? <li className="muted">尚未有 PDF</li> : null}
          </ul>
          <form action={generatePdfsAction} style={{ marginTop: 12 }}>
            <input type="hidden" name="week_id" value={id} />
            <button className="btn btn-paper" type="submit">
              產生示範雙 PDF
            </button>
          </form>
        </section>

        <section className="card" style={{ marginTop: 16 }}>
          <h2 className="display">上傳／覆蓋</h2>
          <form action={uploadPdfsAction} className="form" encType="multipart/form-data">
            <input type="hidden" name="week_id" value={id} />
            <label>學生題本 PDF</label>
            <input type="file" name="student" accept="application/pdf" />
            <label>家長解答 PDF</label>
            <input type="file" name="parent" accept="application/pdf" />
            <button className="btn btn-ink" type="submit">
              儲存上傳
            </button>
          </form>
        </section>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {week.published ? (
            <form action={unpublishWeek}>
              <input type="hidden" name="week_id" value={id} />
              <button className="btn btn-paper">取消發布</button>
            </form>
          ) : (
            <form action={publishWeek}>
              <input type="hidden" name="week_id" value={id} />
              <button className="btn btn-steel">發布本週</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

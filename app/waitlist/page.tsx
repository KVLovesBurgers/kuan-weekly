import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { joinWaitlist } from "@/app/actions/parent";
import { GRADE_OPTIONS } from "@/lib/config";

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Header />
      <main className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="kicker">候補</p>
          <h1 className="display">正取 20 名已滿</h1>
          <p className="muted">留下信箱與年級，老師開席時會依候補順序聯絡。候補不收費、也不佔名額。</p>
          {sp.ok ? <p className="banner ok">已登記。無需付款。</p> : null}
          {sp.error ? <p className="banner warn">{sp.error}</p> : null}
          <form action={joinWaitlist} className="form card" style={{ marginTop: 20 }}>
            <label>電子信箱</label>
            <input name="email" type="email" required />
            <label>孩子年級</label>
            <select name="grade" defaultValue="小五">
              {GRADE_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <label>想對準的考試或單元</label>
            <textarea name="note" placeholder="例如：小五、跟上段考、分數與應用題較弱" />
            <button className="btn btn-ink" type="submit">
              加入候補
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

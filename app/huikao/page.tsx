import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { joinHuikaoWaitlist } from "@/app/actions/parent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "國三會考數學系列課｜加入候補｜寬數",
  description: "吳寬老師的國三會考數學系列課製作中。留下信箱加入候補，開放時第一時間通知。候補不收費。",
  alternates: { canonical: "/huikao" },
};

export default async function HuikaoWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const src = sp.src ?? "";
  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="kicker">國三會考數學系列課</p>
          <h1 className="display">加入候補名單</h1>
          <p>
            會考數學總複習課｜全範圍 20 集。每集精講保 B、衝 A、A++ 三級例題，搭配分級隨堂題、小測和模考，以衝 A 為主。製作中，留言或私訊「會考課」，做好通知你。
          </p>
          <p className="muted">
            也可以留下信箱，課程開放時會依候補順序通知你。候補不收費，也不需要付款。
          </p>
          {sp.ok ? <p className="banner ok">已登記候補。開放時會寄信通知，無需付款。</p> : null}
          {sp.error ? <p className="banner warn">{sp.error}</p> : null}
          <form action={joinHuikaoWaitlist} className="form card" style={{ marginTop: 20 }}>
            <input type="hidden" name="src" value={src} />
            <label htmlFor="hk_email">電子信箱</label>
            <input id="hk_email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="hk_grade">孩子年級</label>
            <select id="hk_grade" name="grade" defaultValue="國三">
              <option>國三</option>
              <option>國二</option>
              <option>國一</option>
              <option>其他</option>
            </select>
            <label htmlFor="hk_note">最想加強的單元（選填）</label>
            <textarea id="hk_note" name="note" placeholder="例如：二次函數、幾何證明、應用題" />
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

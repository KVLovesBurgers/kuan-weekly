import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { joinTutorWaitlist } from "@/app/actions/tutor";
import { LEAD_GRADES, cleanSrc } from "@/lib/leads";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "家教候補名單｜吳寬老師｜寬數週練",
  description: "吳寬老師一對一數學家教目前時段已滿。留下孩子年級與想加強的範圍，有空位時優先通知。",
  alternates: { canonical: "/tutor" },
};

export const dynamic = "force-dynamic";

export default async function TutorPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const src = cleanSrc(sp.src);
  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <p className="kicker">家教候補</p>
          <h1 className="display">一對一家教目前時段已滿</h1>
          <p className="muted">吳寬老師｜交大應數畢業｜現任國中數學教師</p>
          <p>目前每週的家教時段都已排滿。留下孩子年級、想加強的範圍和聯絡方式，有空位時會依登記順序優先通知你。登記不收費，也不代表一定要上課。</p>
          <p className="muted">等待期間可以先做 <a className="u" href={`/diag?src=tutor`}>免費段考弱點檢測</a>，找出要先補的單元。</p>
          {sp.ok ? <p className="banner ok" role="status">已登記候補。有空位會優先通知你。</p> : null}
          {sp.error ? <p className="banner warn" role="alert">{sp.error}</p> : null}
          <form action={joinTutorWaitlist} className="form card" style={{ marginTop: 20 }} id="form">
            <input type="hidden" name="src" value={src} />
            <label htmlFor="tw_grade">孩子年級</label>
            <select id="tw_grade" name="grade" defaultValue="國一" required>
              {LEAD_GRADES.filter((g) => g !== "SAT").map((g) => <option key={g}>{g}</option>)}
              <option value="SAT">SAT</option>
            </select>
            <label htmlFor="tw_scope">想加強的範圍</label>
            <textarea id="tw_scope" name="scope" required maxLength={300} placeholder="例如：國二下 畢氏定理、應用題常卡住" />
            <label htmlFor="tw_email">電子信箱</label>
            <input id="tw_email" name="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@example.com" />
            <label htmlFor="tw_contact">其他聯絡方式（選填）</label>
            <input id="tw_contact" name="contact" maxLength={100} placeholder="LINE ID 或手機" />
            <p className="muted" style={{ fontSize: 14 }}>只用來通知家教空位，不會給其他人。</p>
            <button className="btn btn-ink" type="submit" style={{ minHeight: 48 }}>加入家教候補</button>
          </form>
          <p className="muted" style={{ marginTop: 16 }}>有問題也可以寄信到 <a className="u" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}

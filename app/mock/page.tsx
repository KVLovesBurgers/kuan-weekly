import type { Metadata } from "next";
import { Suspense } from "react";
import "katex/dist/katex.min.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrackView } from "@/components/Tracking";
import { MockClient, type MockSetView } from "@/components/MockClient";
import { tex } from "@/components/UnitLesson";
import { MOCK_MINUTES, MOCK_SUBJECTS, mockPhase, mockQuestions } from "@/lib/mock";

const TITLE = "學測數學免費線上模擬考｜數學A・數學B｜寬數週練";
const DESC = "吳寬老師新出的學測數學模擬考，數學A、數學B 各 20 題，題型配分比照學測，線上限時 100 分鐘，交卷自動改分、估算級分，留 Email 看詳解與弱點分析。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/mock" },
  openGraph: { title: TITLE, description: DESC, url: "https://kuan-weekly.vercel.app/mock", type: "website", images: [{ url: "/og.png", width: 1280, height: 720, alt: "寬數週練｜學測數學模擬考" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og.png"] },
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function MockPage() {
  const sets: MockSetView[] = MOCK_SUBJECTS.map((s) => ({
    id: s.id,
    label: s.label,
    scope: s.scope,
    questions: mockQuestions(s.id).map((q) => ({
      id: q.id, no: q.no, type: q.type, points: q.points, unit: q.unit, stem: tex(q.stem),
      options: q.options ? q.options.map(tex) : null, format: q.format ? tex(`$${q.format}$`) : null,
      cells: q.type === "fill" ? String(q.answer).length : 0, group: q.group ? tex(q.group) : null,
    })),
  }));
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="mock_view" />
      </Suspense>
      <main id="main" className="section">
        <div className="wrap quiz-wrap">
          <MockClient sets={sets} phase={mockPhase()} minutes={MOCK_MINUTES} openLabel="2026/12/19（六）00:00 – 12/20（日）23:59（台北時間）" />
        </div>
      </main>
      <Footer />
    </>
  );
}

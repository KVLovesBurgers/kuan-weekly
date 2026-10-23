import type { Metadata } from "next";
import { Suspense } from "react";
import "katex/dist/katex.min.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrackView } from "@/components/Tracking";
import { DiagClient, type DiagSetView } from "@/components/DiagClient";
import { tex } from "@/components/UnitLesson";
import { DIAG_SETS, diagQuestions, hasDiagPacks } from "@/lib/diag";

const TITLE = "免費段考弱點檢測｜第二次段考數學｜寬數週練";
const DESC = "吳寬老師出題，國中與高三對應 11/25-26 第二次段考範圍，高一、高二依 108 課綱章節。國一、國二、國三、高一、高二、高三各一份，8 到 10 題單選，交卷馬上看分數和弱點單元。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/diag" },
  openGraph: { title: TITLE, description: DESC, url: "https://kuan-weekly.vercel.app/diag", type: "website", images: [{ url: "/og.png", width: 1280, height: 720, alt: "寬數週練｜段考弱點檢測" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og.png"] },
};

export const dynamic = "force-static";

export default function DiagPage() {
  const sets: DiagSetView[] = DIAG_SETS.map((s) => ({
    id: s.id,
    level: s.level,
    label: s.label,
    scope: s.scope,
    hasPacks: hasDiagPacks(s.id),
    questions: diagQuestions(s.id).map((q) => ({ id: q.id, unit: q.unit, stem: tex(q.stem), options: q.options.map(tex) })),
  }));
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="diag_view" />
      </Suspense>
      <main id="main" className="section">
        <div className="wrap quiz-wrap">
          <DiagClient sets={sets} />
        </div>
      </main>
      <Footer />
    </>
  );
}

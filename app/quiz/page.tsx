import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuizClient } from "@/components/QuizClient";
import { publicQuestions } from "@/lib/quiz";
import { cleanSrc } from "@/lib/leads";

export const metadata: Metadata = {
  title: "免費學測數學線上小卷｜數A・數B 各 10 題｜寬數週練",
  description: "吳寬老師出題的學測數學線上小卷，數A、數B 各 10 題單選。交卷後看分數、各單元對錯、弱點單元和每題詳解。",
  alternates: { canonical: "/quiz" },
};

export default async function QuizPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.src) ? sp.src[0] : sp.src;
  return (
    <>
      <Header />
      <main id="main" className="section">
        <div className="wrap quiz-wrap">
          <QuizClient sets={{ 數A: publicQuestions("數A"), 數B: publicQuestions("數B") }} src={cleanSrc(raw)} />
        </div>
      </main>
      <Footer />
    </>
  );
}

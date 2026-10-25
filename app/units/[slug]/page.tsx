import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { DiagCta } from "@/components/DiagCta";
import { UNIT_PACKS, findUnitPack, hasLivePack, unitOg, unitSheets } from "@/lib/unit-packs";
import { ShareToParents } from "@/components/ShareToParents";
import { TrackView } from "@/components/Tracking";
import { PackCard, SheetCard } from "@/components/UnitSheets";
import { UnitLesson, plain } from "@/components/UnitLesson";
import { UNIT_LESSONS } from "@/lib/unit-lessons";
import { LEARN_PAGES } from "@/lib/learn-pages";

const UNIT_LEARN: Record<string, string> = { prob: "conditional-probability", vector: "vector-dot-product", "jh-circle": "similar-triangles" };
import "katex/dist/katex.min.css";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return UNIT_PACKS.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = findUnitPack(slug);
  if (!u) return { title: "找不到這個單元｜Saber數學" };
  const n = unitSheets(u.slug).length + (hasLivePack(u) ? 1 : 0);
  const L = UNIT_LESSONS[u.slug];
  const title = L ? `學測${u.title} ${L.problems.length} 題完整詳解與常見錯誤｜Saber數學` : `${u.title} 免費練習題：${n} 份附解答｜Saber數學`;
  const description = L ? `學測${u.title}：${u.topic}。${L.problems.length} 題由淺到深的題目，網頁上直接看逐步詳解和常見錯誤${n > 0 ? "，另附 PDF 免費下載" : ""}。` : `${u.title.includes(u.level) ? "" : u.level}${u.title} 免費練習題，共 ${n} 份：${u.topic}。每份都有題目和解答，免費下載。`;
  return {
    title,
    description,
    alternates: { canonical: `/units/${u.slug}` },
    openGraph: {
      title,
      description,
      url: `/units/${u.slug}`,
      siteName: "Saber數學",
      locale: "zh_TW",
      type: "website",
      images: [{ url: unitOg(u.slug), width: 1200, height: 630, alt: `${u.title} 免費練習題附解答` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [unitOg(u.slug)] },
  };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = findUnitPack(slug);
  if (!u) notFound();
  const sheets = unitSheets(u.slug);
  const pack = hasLivePack(u);
  const lesson = UNIT_LESSONS[u.slug];
  const ld = lesson
    ? [
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `學測${u.title} ${lesson.problems.length} 題完整詳解`,
          description: plain(lesson.intro),
          inLanguage: "zh-TW",
          educationalLevel: "高中",
          learningResourceType: "練習題與詳解",
          teaches: u.topic,
          isAccessibleForFree: true,
          url: `https://kuan-weekly.vercel.app/units/${u.slug}`,
          provider: { "@type": "Person", name: "吳寬" },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: lesson.problems.map((p) => ({
            "@type": "Question",
            name: plain(p.question),
            acceptedAnswer: { "@type": "Answer", text: `${plain(p.steps.join(" "))} 答案：${plain(p.answer)}` },
          })),
        },
      ]
    : null;

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="unit_view" target={u.slug} />
      </Suspense>
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">
            <Link href="/units">免費練習題・單元包</Link>
          </p>
          <h1 className="display practice-title">{u.title}</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            {u.topic}。
            {sheets.length + (pack ? 1 : 0) > 0
              ? `共 ${sheets.length + (pack ? 1 : 0)} 份，每份都有題目和解答，先自己寫再對答案。`
              : lesson
                ? "下面的題目都附逐步詳解，先自己寫再對答案。"
                : ""}
          </p>

          {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
          {lesson && <UnitLesson lesson={lesson} slug={u.slug} />}
          {lesson && sheets.length + (pack ? 1 : 0) > 0 && <h2 className="lesson-pdf-h">PDF 下載</h2>}
          {sheets.length + (pack ? 1 : 0) > 0 && (
            <ul className="practice-list">
              {pack && <PackCard u={u} />}
              {sheets.map((s) => (
                <SheetCard key={s.driveId} unit={u.slug} s={s} />
              ))}
            </ul>
          )}

          <ShareToParents path={`/units/${u.slug}`} topic={u.title} />

          {UNIT_LEARN[u.slug] && (() => {
            const lp = LEARN_PAGES.find((x) => x.slug === UNIT_LEARN[u.slug]);
            return lp ? (
              <p style={{ marginTop: 24 }}>
                延伸詳解：<Link href={`/learn/${lp.slug}`} className="practice-cta-link">{lp.h1}</Link>
              </p>
            ) : null;
          })()}
          <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
            其他單元的練習題都在 <Link href="/units" className="practice-cta-link">免費練習題・單元包</Link>。
          </p>

          <div className="practice-cta">
            <p className="muted">想每週固定練一份這種有詳解的題目，可以看看寬數週練。</p>
            <Suspense
              fallback={
                <Link href={`/sample?track=${u.track}&src=unit-${u.slug}`} className="practice-cta-link">
                  免費試閱一週題本
                </Link>
              }
            >
              <UnitTrialLink base={`unit-${u.slug}`} track={u.track} />
            </Suspense>
          </div>
          {u.track === "jh" && <DiagCta src="units-diag" />}
        </div>
      </main>
      <Footer />
    </>
  );
}

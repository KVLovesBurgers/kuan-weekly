import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { tex } from "@/components/UnitLesson";
import { LEARN_PAGES, findLearnPage } from "@/lib/learn-pages";
import "katex/dist/katex.min.css";

const base = "https://kuan-weekly.vercel.app";
export const dynamicParams = false;
export function generateStaticParams() {
  return LEARN_PAGES.map((p) => ({ slug: p.slug }));
}

/** JSON-LD 用的純文字：把常用 LaTeX 換成一般符號。 */
function plain(s: string): string {
  let t = s;
  for (let i = 0; i < 3; i++) t = t.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)").replace(/\\sqrt\{([^{}]*)\}/g, "根號($1)");
  return t
    .replace(/\\overrightarrow\{([^}]*)\}/g, "向量$1").replace(/\\vec\s*([a-z])/g, "向量$1").replace(/\\overline\{([^}]*)\}/g, "$1")
    .replace(/\\text\{([^}]*)\}/g, "$1").replace(/\\mid/g, "|").replace(/\\cap/g, "∩").replace(/\\perp/g, "⊥").replace(/\\parallel/g, "∥")
    .replace(/\\sim/g, "∼").replace(/\\triangle\s*/g, "△").replace(/\\angle\s*/g, "∠").replace(/\^\\circ/g, "°").replace(/\\cos/g, "cos")
    .replace(/\\theta/g, "θ").replace(/\\times/g, "×").replace(/\\cdot/g, "·").replace(/\\%/g, "%")
    .replace(/\\(left|right|,|\s)/g, "").replace(/[$\\{}]/g, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = findLearnPage((await params).slug);
  if (!p) return {};
  const url = `/learn/${p.slug}`;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.description, url, siteName: "Saber數學", locale: "zh_TW", type: "article", images: [{ url: `https://i.ytimg.com/vi/${p.short.id}/hqdefault.jpg` }] },
    twitter: { card: "summary_large_image", title: p.title, description: p.description },
  };
}

const H = ({ html, as: Tag = "span" }: { html: string; as?: "span" | "p" | "li" }) => <Tag dangerouslySetInnerHTML={{ __html: tex(html) }} />;

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = findLearnPage((await params).slug);
  if (!p) notFound();
  const url = `${base}/learn/${p.slug}`;
  const L = p.lesson;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": ["Article", "LearningResource"],
      headline: p.h1,
      name: p.h1,
      description: p.description,
      inLanguage: "zh-TW",
      educationalLevel: p.level,
      learningResourceType: "例題與詳解",
      teaches: p.teaches,
      isAccessibleForFree: true,
      datePublished: p.updated,
      dateModified: p.updated,
      url,
      mainEntityOfPage: url,
      image: `https://i.ytimg.com/vi/${p.short.id}/hqdefault.jpg`,
      author: { "@type": "Person", name: "吳寬", url: base },
      publisher: { "@type": "Organization", name: "Saber數學", url: base },
      video: {
        "@type": "VideoObject",
        name: p.short.title,
        description: p.short.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${p.short.id}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${p.short.id}`,
        contentUrl: `https://www.youtube.com/shorts/${p.short.id}`,
        uploadDate: p.updated,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: L.problems.map((q) => ({
        "@type": "Question",
        name: plain(q.question),
        acceptedAnswer: { "@type": "Answer", text: `${plain(q.steps.join(" "))} 答案：${plain(q.answer)}` },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "寬數週練", item: base },
        { "@type": "ListItem", position: 2, name: "單元詳解", item: `${base}/units` },
        { "@type": "ListItem", position: 3, name: p.h1, item: url },
      ],
    },
  ];
  return (
    <>
      <Header />
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
          <nav className="kicker" aria-label="breadcrumb">
            <Link href="/">寬數週練</Link> / <Link href="/units">單元詳解</Link>
          </nav>
          <h1 className="display practice-title">{p.h1}</h1>
          <p className="muted" style={{ fontSize: 14 }}>吳寬老師（Saber數學）・更新於 {p.updated}</p>
          <section className="lesson">
            <H as="p" html={L.intro} />
            <nav className="lesson-q" aria-label="目錄">
              <h2>本頁題目</h2>
              <ol>
                {L.problems.map((q, i) => (
                  <li key={i}><a href={`#q${i + 1}`}>{q.title}</a></li>
                ))}
                <li><a href="#mistakes">常見錯誤</a></li>
              </ol>
            </nav>
            {L.problems.map((q, i) => (
              <article key={i} className="lesson-q" id={`q${i + 1}`}>
                <h2>第 {i + 1} 題　{q.title}</h2>
                <H as="p" html={q.question} />
                <details className="lesson-sol">
                  <summary className="lesson-label">先自己寫，再點開看詳解</summary>
                  <ol>
                    {q.steps.map((s, j) => <H key={j} as="li" html={s} />)}
                  </ol>
                  <p className="lesson-ans">答案　<H html={q.answer} /></p>
                </details>
              </article>
            ))}
            <article className="lesson-q lesson-mistakes" id="mistakes">
              <h2>常見錯誤</h2>
              <ul>{L.mistakes.map((m, j) => <H key={j} as="li" html={m} />)}</ul>
            </article>
            <section className="lesson-q">
              <h2>一分鐘看懂：{p.short.title}</h2>
              <div style={{ position: "relative", width: "100%", maxWidth: 360, aspectRatio: "9 / 16", margin: "8px auto 0" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${p.short.id}`}
                  title={p.short.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 12 }}
                />
              </div>
            </section>
            <section className="lesson-q">
              <h2>延伸閱讀</h2>
              <ul>
                {p.related.map((r) => <li key={r.href}><Link href={r.href}>{r.label}</Link></li>)}
                {LEARN_PAGES.filter((o) => o.slug !== p.slug && !p.related.some((r) => r.href.endsWith(o.slug))).map((o) => (
                  <li key={o.slug}><Link href={`/learn/${o.slug}`}>{o.h1}</Link></li>
                ))}
              </ul>
            </section>
            <div className="lesson-btns">
              <Link className="btn btn-ink" href={`/quiz?src=learn-${p.slug}`}>做小卷</Link>
              <Link className="btn btn-steel" href={`/sample?src=learn-${p.slug}`}>免費試閱</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

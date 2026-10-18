import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { UNIT_PACKS, findUnitPack, unitPdf, unitOg } from "@/lib/unit-packs";
import { ShareToParents } from "@/components/ShareToParents";
import { TrackView, UnitPdfLink } from "@/components/Tracking";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return UNIT_PACKS.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = findUnitPack(slug);
  if (!u) return { title: "找不到這個單元｜Saber數學" };
  const title = `${u.title}：3 題附詳解｜Saber數學 單元包`;
  const description = `${u.level}${u.title} 單元包，3 題由淺到深：${u.topic}。每題附觀念、圖和逐步詳解，PDF 免費下載。`;
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
      images: [{ url: unitOg(u.slug), width: 1200, height: 630, alt: `${u.title} 單元包：3 題附詳解` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [unitOg(u.slug)] },
  };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = findUnitPack(slug);
  if (!u) notFound();

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <TrackView kind="unit_view" target={u.slug} />
      </Suspense>
      <main id="main" className="section practice-page">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="kicker">
            <Link href="/units">單元包</Link>
          </p>
          <h1 className="display practice-title">{u.title}</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            3 題由淺到深，每題都有觀念、圖、逐步詳解和常見錯誤。先自己寫，再對答案。
          </p>

          <div className="card practice-card" style={{ marginTop: 24 }}>
            <div className="practice-meta">
              <span className="badge">{u.level}</span>
              <span>PDF・{u.pages} 頁</span>
            </div>
            <h2 className="display">這份包含</h2>
            <ul style={{ margin: "0 0 16px", paddingLeft: 20, lineHeight: 1.8 }}>
              {u.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Suspense
              fallback={
                <a className="btn btn-ink practice-btn" href={unitPdf(u.slug)} target="_blank" rel="noopener">
                  下載 3 題附詳解（PDF）
                </a>
              }
            >
              <UnitPdfLink slug={u.slug} className="btn btn-ink practice-btn">
                下載 3 題附詳解（PDF）
              </UnitPdfLink>
            </Suspense>
          </div>

          <ShareToParents path={`/units/${u.slug}`} topic={u.title} />

          <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
            其他單元在 <Link href="/units" className="practice-cta-link">單元包</Link>，每支影片的練習題在{" "}
            <Link href="/practice" className="practice-cta-link">免費練習題</Link>。
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
        </div>
      </main>
      <Footer />
    </>
  );
}

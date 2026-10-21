import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnitTrialLink } from "@/components/UnitTrialLink";
import { UNIT_PACKS, findUnitPack, hasLivePack, unitOg, unitSheets } from "@/lib/unit-packs";
import { ShareToParents } from "@/components/ShareToParents";
import { TrackView } from "@/components/Tracking";
import { PackCard, SheetCard } from "@/components/UnitSheets";

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
  const title = `${u.title} 免費練習題：${n} 份附詳解｜Saber數學`;
  const description = `${u.title.includes(u.level) ? "" : u.level}${u.title} 免費練習題，共 ${n} 份：${u.topic}。每份都有題目和逐步詳解，免費下載。`;
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
      images: [{ url: unitOg(u.slug), width: 1200, height: 630, alt: `${u.title} 免費練習題附詳解` }],
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
            {u.topic}。共 {sheets.length + (pack ? 1 : 0)} 份，每份都有題目和逐步詳解，先自己寫再對答案。
          </p>

          <ul className="practice-list">
            {pack && <PackCard u={u} />}
            {sheets.map((s) => (
              <SheetCard key={s.driveId} unit={u.slug} s={s} />
            ))}
          </ul>

          <ShareToParents path={`/units/${u.slug}`} topic={u.title} />

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
        </div>
      </main>
      <Footer />
    </>
  );
}

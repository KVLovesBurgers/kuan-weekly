"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cleanSrc } from "@/lib/leads";
import { track } from "@/lib/track-client";

/** 頁面瀏覽計數（靜態頁也能讀到 ?src=）。 */
export function TrackView({ kind, target = "" }: { kind: string; target?: string }) {
  const src = cleanSrc(useSearchParams().get("src"));
  useEffect(() => {
    track(kind, target, src);
  }, [kind, target, src]);
  return null;
}

/** 單元包 PDF 下載鈕：帶 src 走 /units/<slug>/pdf 記錄後轉址。 */
export function UnitPdfLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  const src = cleanSrc(useSearchParams().get("src"));
  return (
    <a className={className} href={`/units/${slug}/pdf${src ? `?src=${src}` : ""}`} target="_blank" rel="noopener">
      {children}
    </a>
  );
}

/** 試閱 PDF 下載：點擊時送一筆 sample_pdf。 */
export function SamplePdfLink({
  href,
  download,
  target,
  src,
  className,
  children,
}: {
  href: string;
  download: string;
  target: string;
  src: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a className={className} href={href} download={download} onClick={() => track("sample_pdf", target, src)}>
      {children}
    </a>
  );
}

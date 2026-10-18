"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cleanSrc } from "@/lib/leads";

/** /units 是靜態頁，src 追蹤參數在瀏覽器端讀：/sample?src=unit-<slug>-<src>。 */
export function UnitTrialLink({ base, track }: { base: string; track?: string }) {
  const src = cleanSrc(useSearchParams().get("src"));
  const s = (src ? `${base}-${src}` : base).slice(0, 40);
  const href = `/sample?${track ? `track=${track}&` : ""}src=${s}`;
  return (
    <Link href={href} className="practice-cta-link">
      免費試閱一週題本
    </Link>
  );
}

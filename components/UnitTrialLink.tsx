"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { currentOrFirstTouch } from "@/lib/first-touch";

/** 單元頁往試閱頁：有原來源（網址 src 或 first-touch）就沿用，沒有才用 unit-<slug>。 */
export function UnitTrialLink({ base, track }: { base: string; track?: string }) {
  const [src, setSrc] = useState(base);
  useEffect(() => {
    setSrc(currentOrFirstTouch() || base);
  }, [base]);
  const href = `/sample?${track ? `track=${track}&` : ""}src=${encodeURIComponent(src.slice(0, 40))}`;
  return (
    <Link href={href} className="practice-cta-link">
      免費試閱一週題本
    </Link>
  );
}

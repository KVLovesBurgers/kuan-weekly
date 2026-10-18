"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cleanSrc } from "@/lib/leads";

/** /practice 改成靜態頁後，src 追蹤參數改在瀏覽器端讀，連結行為不變。 */
export function PracticeTrialLink() {
  const src = cleanSrc(useSearchParams().get("src"));
  const href = `/sample?src=${src ? `practice-${src}`.slice(0, 40) : "practice"}`;
  return (
    <Link href={href} className="practice-cta-link">
      免費試閱一週題本
    </Link>
  );
}

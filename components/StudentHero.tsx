"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cleanSrc } from "@/lib/leads";

/** 從短片、社群、私訊、分享連結進來（有 src）就先給學生版首屏；直接進站的人看不到這塊。 */
const STUDENT_SRC = /^(ig|fb|yt|share|threads|tiktok|reel|short)/;

export function isStudentSrc(src: string) {
  return STUDENT_SRC.test(src);
}

export function StudentHero() {
  const src = cleanSrc(useSearchParams().get("src"));
  if (!src || !isStudentSrc(src)) return null;
  const q = `src=${src}`;
  return (
    <section className="student-hero" aria-label="學生版">
      <div className="wrap">
        <p className="kicker">從影片來的同學</p>
        <h2 className="display student-hero-title">先拿 3 題，再請爸媽看</h2>
        <ol className="student-steps">
          <li>
            <strong>先拿 3 題：</strong>選你卡的單元，下載練習題和詳解，自己寫完再對答案。
          </li>
          <li>
            <strong>覺得有用：</strong>領一週免費試閱，題本給你寫、解答給爸媽對。
          </li>
          <li>
            <strong>請爸媽看：</strong>試閱頁有「傳給爸媽看」，訊息寫好了，一鍵用 LINE 傳。
          </li>
        </ol>
        <div className="cta-row">
          <Link href={`/units?${q}`} className="btn btn-steel btn-lg">先拿免費練習題</Link>
          <Link href={`/sample?${q}`} className="btn btn-ghost btn-lg">領一週試閱</Link>
        </div>
        <p className="muted student-hero-note">下面是給爸媽看的介紹。</p>
      </div>
    </section>
  );
}

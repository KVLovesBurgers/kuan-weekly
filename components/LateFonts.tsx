"use client";

import { useEffect } from "react";

/** 標題襯線與粗體字型等頁面載完（load 之後）才下載，首屏只等內文 400。載完前短暫用系統字型。 */
const FACES: [string, string, string][] = [
  ["KW Serif", "/fonts/noto-serif-tc-head.woff2", "400 700"],
  ["KW Sans", "/fonts/noto-sans-tc-500-700.woff2", "500 700"],
];

export function LateFonts() {
  useEffect(() => {
    const go = () => {
      for (const [family, url, weight] of FACES) {
        const f = new FontFace(family, `url(${url}) format("woff2")`, { weight, style: "normal", display: "swap" });
        f.load().then((ff) => document.fonts.add(ff)).catch(() => {});
      }
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }, []);
  return null;
}

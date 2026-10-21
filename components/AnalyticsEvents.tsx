"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/** Vercel Analytics 自訂事件：用事件委派監聽，不改任何按鈕外觀或文案。 */
export function AnalyticsEvents() {
  useEffect(() => {
    const page = () => window.location.pathname;
    const src = () => new URLSearchParams(window.location.search).get("src") || "direct";

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      try {
        if (/instagram\.com|ig\.me/i.test(href)) {
          track("ig_dm_click", { page: page(), src: src() });
        } else if (href.startsWith("mailto:")) {
          track("email_click", { page: page(), src: src() });
        } else if (/^\/units\/[^/]+\/pdf/.test(href)) {
          const slug = href.split("/")[2] || "";
          track("unit_pdf_download", { unit: slug, sheet: href.includes("sheet=") ? "practice" : "pack", src: src() });
        } else if (a.hasAttribute("download") || /\/sample.*\.pdf|\/pdf\//i.test(href)) {
          if (page().startsWith("/sample") || page().startsWith("/trial")) {
            track("sample_pdf_download", { page: page(), src: src() });
          }
        }
      } catch {
        /* 統計失敗不影響使用 */
      }
    };

    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement | null;
      if (!f) return;
      try {
        if (f.classList.contains("lead-form")) {
          track("sample_form_submit", { page: page(), src: src() });
        }
      } catch {
        /* ignore */
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);
  return null;
}

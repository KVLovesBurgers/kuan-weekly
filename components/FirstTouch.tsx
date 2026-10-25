"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { rememberFirstTouch } from "@/lib/first-touch";

/** 任何頁面帶 ?src= 進站就記 first-touch（已有就不覆蓋）。 */
export function FirstTouch() {
  const path = usePathname();
  useEffect(() => {
    rememberFirstTouch(new URLSearchParams(window.location.search).get("src"));
  }, [path]);
  return null;
}

/** 試閱表單隱藏欄位：伺服器沒拿到 src 時，用瀏覽器存的 first-touch 補上。 */
export function FirstTouchSrcFill() {
  useEffect(() => {
    document.querySelectorAll<HTMLInputElement>('input[type=hidden][name=src]').forEach((el) => {
      if (!el.value) {
        const m = document.cookie.match(/(?:^|;\s*)kw_ft_src=([^;]+)/);
        let v = "";
        try { v = window.localStorage.getItem("kw_ft_src") || ""; } catch {}
        el.value = v || (m ? decodeURIComponent(m[1]) : "");
      }
    });
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";

/** 把瀏覽器內建的英文 Email 驗證訊息換成中文（全站 input[type=email]）。 */
export function ZhValidation() {
  useEffect(() => {
    const onInvalid = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!(el instanceof HTMLInputElement) || el.type !== "email") return;
      el.setCustomValidity(el.value.trim() === "" ? "請輸入 Email" : "請輸入正確的 Email");
    };
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (el instanceof HTMLInputElement && el.type === "email") el.setCustomValidity("");
    };
    document.addEventListener("invalid", onInvalid, true);
    document.addEventListener("input", onInput, true);
    return () => {
      document.removeEventListener("invalid", onInvalid, true);
      document.removeEventListener("input", onInput, true);
    };
  }, []);
  return null;
}

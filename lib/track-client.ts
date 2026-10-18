"use client";

export function track(kind: string, target = "", src = "") {
  try {
    const body = JSON.stringify({ kind, target, src });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* 統計失敗不影響使用 */
  }
}

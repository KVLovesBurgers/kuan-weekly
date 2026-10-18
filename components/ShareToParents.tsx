"use client";

import { useState } from "react";
import { track } from "@/lib/track-client";

const SITE_URL = "https://kuan-weekly.vercel.app";

/**
 * 學生轉給家長：手機先用系統分享（Web Share API），不支援就開 LINE 分享，並可複製訊息。
 * 連結一律帶 src=share。
 */
export function ShareToParents({ path, topic }: { path: string; topic?: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${path}${path.includes("?") ? "&" : "?"}src=share`;
  const text = topic
    ? `爸媽，這是吳寬老師的「${topic}」單元包，3 題附詳解，我想照這個練。另外也有每週一份題本＋家長解答的寬數週練，家長不用會數學也能對答案，可以免費試閱：`
    : "爸媽，這是吳寬老師的寬數週練：每週一份學生題本＋家長解答，家長不用會數學也能幫我對答案、看出我卡在哪。可以先免費試閱一週，你看看適不適合我：";
  const lineHref = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  async function onShare(e: React.MouseEvent<HTMLAnchorElement>) {
    track("share_click", path.replace(/[^a-z0-9_-]/gi, "-").slice(0, 60));
    if (typeof navigator !== "undefined" && navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({ title: "寬數週練", text, url });
      } catch {
        /* 使用者取消 */
      }
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(`${text}${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 不支援就略過 */
    }
  }

  return (
    <div className="card share-parents" style={{ marginTop: 24 }}>
      <p className="kicker">學生看這裡</p>
      <h2 className="display" style={{ fontSize: 20, margin: "4px 0 6px" }}>傳給爸媽看</h2>
      <p className="muted" style={{ margin: "0 0 12px", fontSize: 14 }}>
        訊息已經幫你寫好，按一下就能用 LINE 或其他 App 傳給爸媽。
      </p>
      <div className="cta-row" style={{ marginTop: 0 }}>
        <a className="btn btn-ink" href={lineHref} target="_blank" rel="noopener noreferrer" onClick={onShare}>
          傳給爸媽看
        </a>
        <button type="button" className="btn btn-paper" onClick={onCopy}>
          {copied ? "已複製訊息" : "複製訊息"}
        </button>
      </div>
    </div>
  );
}

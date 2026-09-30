"use client";

import Link from "next/link";
import { useState } from "react";
import { SOCIAL } from "@/lib/config";

export function MobileNav({ parentEmail }: { parentEmail?: string | null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="mobile-nav">
      <Link href="/sample" className="btn btn-steel mobile-cta">
        免費試閱
      </Link>
      <button
        type="button"
        className="nav-burger"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "關閉選單" : "開啟選單"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      {open ? (
        <div id="mobile-nav-panel" className="mobile-nav-panel" role="navigation" aria-label="手機選單">
          <Link href="/sample" onClick={close}>
            領題本試閱
          </Link>
          <Link href="/#videos" onClick={close}>
            看老師怎麼教
          </Link>
          <Link href="/#how" onClick={close}>
            怎麼進行
          </Link>
          <Link href="/#pricing" onClick={close}>
            方案
          </Link>
          <Link href="/#faq" onClick={close}>
            常見問題
          </Link>
          <Link href="/login?next=/subscribe" onClick={close}>
            為孩子訂閱
          </Link>
          {parentEmail ? (
            <Link href="/dashboard" onClick={close}>
              家長後台
            </Link>
          ) : (
            <Link href="/login" onClick={close}>
              家長登入
            </Link>
          )}
          <a href={SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={close}>
            IG 私訊「{SOCIAL.weeklyKeyword}」
          </a>
          <a href={SOCIAL.facebookUrl} target="_blank" rel="noopener noreferrer" onClick={close}>
            臉書粉專 {SOCIAL.facebookName}
          </a>
        </div>
      ) : null}
    </div>
  );
}

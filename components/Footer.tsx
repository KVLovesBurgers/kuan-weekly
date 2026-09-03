import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap row">
        <div>
          <div className="brand">
            <Logo size={28} />
            <span>寬數</span>
          </div>
          <p className="dim" style={{ marginTop: 12 }}>
            {SITE.teacher} · {SITE.name}
          </p>
          <p className="dim">出題＋解答、依程度排題、每周進度。</p>
          <p className="dim" style={{ marginTop: 8 }}>
            <a href={SITE.oneOnOneUrl}>認識老師</a>
          </p>
        </div>
        <div>
          <p className="kicker">聯絡老師</p>
          <p style={{ marginTop: 8 }}>
            請跟老師討論，寄信{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
          <p className="dim" style={{ marginTop: 16 }}>
            後台：<Link href="/admin/login">老師登入</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

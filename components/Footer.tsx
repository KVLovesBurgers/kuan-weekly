import Link from "next/link";
import { Logo } from "./Logo";
import { SITE, SOCIAL } from "@/lib/config";

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
          <p className="dim">國中・高中數學每週題本＋家長解答。跟著學校進度，依程度排題。</p>
          <p className="dim" style={{ marginTop: 8 }}>
            <Link href="/sample">題本試閱</Link>
            {" · "}
            <a href={SITE.oneOnOneUrl}>認識老師</a>
            {" · "}
            <Link href="/privacy">隱私權政策</Link>
          </p>
        </div>
        <div>
          <p className="kicker">聯絡老師</p>
          <p style={{ marginTop: 8 }}>
            到 IG {SOCIAL.handle} 或臉書粉專「{SOCIAL.facebookName}」私訊「{SOCIAL.weeklyKeyword}」領題本試閱
          </p>
          <p className="footer-links">
            <a href={SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={SOCIAL.facebookUrl} target="_blank" rel="noopener noreferrer">
              臉書粉專 {SOCIAL.facebookName}
            </a>
            <a href={SOCIAL.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </p>
          <p style={{ marginTop: 8 }}>
            或寄信 <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
          <p className="dim" style={{ marginTop: 16 }}>
            後台：<Link href="/admin/login">老師登入</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

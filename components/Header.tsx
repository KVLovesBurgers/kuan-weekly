import Link from "next/link";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header({
  variant = "dark",
  parentEmail,
}: {
  variant?: "dark" | "paper";
  parentEmail?: string | null;
}) {
  return (
    <header className="site-header" style={variant === "paper" ? { background: "#0f1419" } : undefined}>
      <a href="#main" className="skip-link">
        跳到主要內容
      </a>
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="寬數週練首頁">
          <Logo />
          <span>寬數週練</span>
        </Link>
        <nav className="nav nav-desktop" aria-label="主要">
          <Link href="/#videos" className="hide-sm">
            教學影片
          </Link>
          <Link href="/#how" className="hide-sm">
            怎麼進行
          </Link>
          <Link href="/#pricing" className="hide-sm">
            方案
          </Link>
          <Link href="/#faq" className="hide-sm">
            常見問題
          </Link>
          {parentEmail ? (
            <Link href="/dashboard">家長後台</Link>
          ) : (
            <Link href="/login">家長登入</Link>
          )}
          <Link href="/sample" className="btn btn-steel" style={{ minHeight: 36, padding: "0 14px" }}>
            免費題本試閱
          </Link>
        </nav>
        <MobileNav parentEmail={parentEmail} />
      </div>
    </header>
  );
}

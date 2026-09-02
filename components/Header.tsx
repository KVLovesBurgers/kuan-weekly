import Link from "next/link";
import { Logo } from "./Logo";

export function Header({
  variant = "dark",
  parentEmail,
}: {
  variant?: "dark" | "paper";
  parentEmail?: string | null;
}) {
  return (
    <header className="site-header" style={variant === "paper" ? { background: "#0f1419" } : undefined}>
      <div className="wrap bar">
        <Link href="/" className="brand">
          <Logo />
          <span>寬數週練</span>
        </Link>
        <nav className="nav" aria-label="主要">
          <Link href="/#how" className="hide-sm">怎麼進行</Link>
          <Link href="/#pricing" className="hide-sm">方案</Link>
          <Link href="/#faq" className="hide-sm">常見問題</Link>
          {parentEmail ? (
            <Link href="/dashboard">家長後台</Link>
          ) : (
            <Link href="/login">家長登入</Link>
          )}
          <Link href="/subscribe" className="btn btn-steel" style={{ minHeight: 36, padding: "0 12px" }}>
            為孩子訂閱
          </Link>
        </nav>
      </div>
    </header>
  );
}

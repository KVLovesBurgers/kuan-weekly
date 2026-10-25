import { NextResponse, type NextRequest } from "next/server";

/**
 * 試閱 PDF 一定要先留信箱：沒有 kw_sample=1（留信箱後設定）也沒有家長登入 session（kw_parent）
 * 就擋下直連，導回 /sample。預覽圖（.webp/.avif/.png）不經過這裡，維持公開。
 */
export function middleware(req: NextRequest) {
  const lead = req.cookies.get("kw_sample")?.value === "1";
  const parent = Boolean(req.cookies.get("kw_parent")?.value);
  if (lead || parent) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = "/sample";
  url.search = "?need=email";
  url.hash = "get";
  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: ["/samples/:path*.pdf"],
};

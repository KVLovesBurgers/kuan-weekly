import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./data/NotoSansCJKtc-Regular.ttf"],
    // 7 天試用 PDF 不放 public/，由 /trial/[token]/[file] 檢查日期後才送出。
    "/trial/[token]/[file]": ["./trial-packs/*.pdf"],
  },
  // /practice 已併入 /units：舊網址（含 DM 裡的連結與 ?src=）永久轉址。public/practice/*.pdf 檔案照常可開。
  async redirects() {
    return [
      { source: "/practice", destination: "/units", permanent: true },
      { source: "/practice/:path((?!.*\\.pdf$).*)", destination: "/units", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // 試閱縮圖與 OG 圖：瀏覽器快取 1 天，CDN 快取 7 天並背景更新（檔名不帶 hash，所以不設 immutable）。
        source: "/:file(og\\.png|samples/.*\\.(?:webp|png))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;

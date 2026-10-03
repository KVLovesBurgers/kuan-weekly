import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./data/NotoSansCJKtc-Regular.ttf"],
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

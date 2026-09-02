import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./data/NotoSansCJKtc-Regular.ttf"],
  },
};

export default nextConfig;

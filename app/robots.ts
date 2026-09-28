import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/", "/files/", "/pdf/", "/login/verify", "/subscribe/"],
      },
    ],
    sitemap: "https://kuan-weekly.vercel.app/sitemap.xml",
  };
}

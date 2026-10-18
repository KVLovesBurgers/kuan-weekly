import type { MetadataRoute } from "next";
import { liveUnitPacks } from "@/lib/unit-packs";

const base = "https://kuan-weekly.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sample`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/units`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...liveUnitPacks(now).map((u) => ({ url: `${base}/units/${u.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}

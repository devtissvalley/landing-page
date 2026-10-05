import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// One entry per real route. Priorities reflect how central each page is to
// the booking intent the site is trying to capture.
const routes: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/villas", priority: 0.9, changeFrequency: "monthly" },
  { path: "/location", priority: 0.8, changeFrequency: "yearly" },
  { path: "/wellness", priority: 0.8, changeFrequency: "monthly" },
  { path: "/reserve", priority: 0.8, changeFrequency: "yearly" },
  { path: "/rassa", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}

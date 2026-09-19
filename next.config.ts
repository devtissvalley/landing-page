import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json sits one directory up; without this Turbopack
  // guesses that as the workspace root and warns on every build.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    // AVIF first, WebP as the fallback — smaller payloads for the same visual
    // quality, which is what LCP on the hero is bound by.
    formats: ["image/avif", "image/webp"],
  },
  // Strip the "X-Powered-By: Next.js" header; it tells crawlers nothing and
  // advertises the stack.
  poweredByHeader: false,
};

export default nextConfig;

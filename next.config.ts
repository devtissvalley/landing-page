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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS only, for two years. No "preload": that is hard to undo.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No framing by other sites (clickjacking). X-Frame-Options for old
          // browsers, frame-ancestors for current ones.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            // Only directives that can't break the page's own scripts,
            // styles, the Midtrans popup or the map embed.
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS.name} — Pool Villas in Sebatu, Bali`,
    short_name: BUSINESS.name,
    description:
      "Six one-bedroom pool villas above the Tegallalang rice terraces in Sebatu, Bali — 25 minutes from central Ubud.",
    start_url: "/",
    display: "standalone",
    background_color: "#2b2a27",
    theme_color: "#2b2a27",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

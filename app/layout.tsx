import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Spectral } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import {
  BUSINESS,
  DEFAULT_OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  lodgingSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-hanken",
  display: "swap",
});

const title = "TISS Valley — Pool Villas in Sebatu, Above Tegallalang, Bali";
const description =
  "Six one-bedroom pool villas set into the highland rice terraces of Sebatu, above the Tegallalang terraces in Gianyar, Bali — 25 minutes from central Ubud. Private plunge pools, valley views, in-villa spa and plant-based dining.";

export const metadata: Metadata = {
  // Makes every relative URL below (OG image, canonicals) resolve absolutely,
  // which is what crawlers and social scrapers require.
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    // Detail pages supply only their own name; the brand is appended here.
    template: "%s — TISS Valley",
  },
  description,
  applicationName: BUSINESS.name,
  alternates: { canonical: `${SITE_URL}/` },
  category: "travel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title,
    description,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
  },
  icons: {
    icon: "/logo/tiss-valley.png",
    apple: "/logo/tiss-valley.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2a27",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Site-wide entities. Page-level nodes are added per route. */}
        <JsonLd nodes={[organizationSchema, websiteSchema, lodgingSchema]} />
        {children}
      </body>
    </html>
  );
}

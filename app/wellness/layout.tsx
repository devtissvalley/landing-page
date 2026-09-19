import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

const title = "Wellness Retreat near Ubud — Spa, Yoga & Plant-Based Dining";
const description =
  "In-villa Balinese spa treatments, morning yoga facing the terraces and plant-based dining at TISS Valley in Sebatu, Bali — a highland wellness retreat 25 minutes from Ubud.";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — TISS Valley" template so
  // the title tag carries the full descriptive line rather than one word.
  title: { absolute: title },
  description,
  alternates: { canonical: "/wellness" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/wellness",
  },
  twitter: { title, description },
};

export default function WellnessLayout({ children }: LayoutProps<"/wellness">) {
  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({ path: "/wellness", name: title, description }),
          breadcrumbSchema([{ name: "Wellness", path: "/wellness" }]),
        ]}
      />
      {children}
    </>
  );
}

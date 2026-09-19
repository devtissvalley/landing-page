import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

const title = "Pool Villas in Sebatu, Bali — One-Bedroom Villas near Ubud";
const description =
  "Six one-bedroom pool villas above the Tegallalang rice terraces in Sebatu, Bali. Each villa has a private plunge pool, an uninterrupted valley view and room for two — 25 minutes from central Ubud.";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — TISS Valley" template so
  // the title tag carries the full descriptive line rather than one word.
  title: { absolute: title },
  description,
  alternates: { canonical: "/villas" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/villas",
  },
  twitter: { title, description },
};

export default function VillasLayout({ children }: LayoutProps<"/villas">) {
  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({ path: "/villas", name: title, description }),
          breadcrumbSchema([{ name: "Villas", path: "/villas" }]),
        ]}
      />
      {children}
    </>
  );
}

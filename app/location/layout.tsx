import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

const title = "Where Is TISS Valley? Sebatu, Above Tegallalang, Near Ubud";
const description =
  "TISS Valley sits in Sebatu, above the Tegallalang rice terraces in Gianyar, Bali — 8 minutes from the Tegallalang Rice Terraces, 15 from Tirta Empul and 25 from central Ubud.";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — TISS Valley" template so
  // the title tag carries the full descriptive line rather than one word.
  title: { absolute: title },
  description,
  alternates: { canonical: "/location" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/location",
  },
  twitter: { title, description },
};

export default function LocationLayout({ children }: LayoutProps<"/location">) {
  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({ path: "/location", name: title, description }),
          breadcrumbSchema([{ name: "Location", path: "/location" }]),
        ]}
      />
      {children}
    </>
  );
}

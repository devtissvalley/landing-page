import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

const title = "Reserve a Villa — TISS Valley, Sebatu, Bali";
const description =
  "Request a reservation at TISS Valley: six one-bedroom pool villas in Sebatu, above the Tegallalang rice terraces near Ubud, Bali. Enquire by form, phone or WhatsApp.";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — TISS Valley" template so
  // the title tag carries the full descriptive line rather than one word.
  title: { absolute: title },
  description,
  alternates: { canonical: "/reserve" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/reserve",
  },
  twitter: { title, description },
};

export default function ReserveLayout({ children }: LayoutProps<"/reserve">) {
  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({ path: "/reserve", name: title, description }),
          breadcrumbSchema([{ name: "Reserve", path: "/reserve" }]),
        ]}
      />
      {children}
    </>
  );
}

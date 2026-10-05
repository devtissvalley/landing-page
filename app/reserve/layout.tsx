import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Reserve a Villa — TISS Valley, Sebatu, Bali";
const description =
  "Request a stay at TISS Valley: six one-bedroom pool villas in Sebatu, above the Tegallalang rice terraces near Ubud. Enquire by form, phone or WhatsApp.";

export const metadata: Metadata = pageMetadata({
  path: "/reserve",
  title,
  description,
});

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

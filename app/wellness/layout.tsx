import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Wellness Retreat near Ubud — Spa, Yoga & Plant-Based Dining";
const description =
  "In-villa Balinese spa treatments, morning yoga facing the terraces and plant-based dining. A highland wellness retreat in Sebatu, 25 minutes from Ubud.";

export const metadata: Metadata = pageMetadata({
  path: "/wellness",
  title,
  description,
});

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

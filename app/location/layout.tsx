import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Where Is TISS Valley? Sebatu, Above Tegallalang, Near Ubud";
const description =
  "TISS Valley sits in Sebatu, above the Tegallalang rice terraces in Gianyar, Bali: 8 minutes from the terraces, 15 from Tirta Empul, 25 from central Ubud.";

export const metadata: Metadata = pageMetadata({
  path: "/location",
  title,
  description,
});

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

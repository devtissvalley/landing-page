import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Pool Villas in Sebatu, Bali — One-Bedroom Villas near Ubud";
const description =
  "Six one-bedroom pool villas in Sebatu, Bali, each with a private plunge pool, an uninterrupted valley view and room for two. 25 minutes from central Ubud.";

export const metadata: Metadata = pageMetadata({
  path: "/villas",
  title,
  description,
});

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

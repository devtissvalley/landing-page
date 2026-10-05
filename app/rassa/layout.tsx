import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Rassa — Plant-Based Restaurant at TISS Valley, Sebatu";
const description =
  "Rassa is the plant-based restaurant at TISS Valley in Sebatu, Bali. Open to villa guests and visitors, built around what the valley grows. Opening soon.";

export const metadata: Metadata = pageMetadata({
  path: "/rassa",
  title,
  description,
});

export default function RassaLayout({ children }: LayoutProps<"/rassa">) {
  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({ path: "/rassa", name: title, description }),
          breadcrumbSchema([{ name: "Rassa", path: "/rassa" }]),
        ]}
      />
      {children}
    </>
  );
}

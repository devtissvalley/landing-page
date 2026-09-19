import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

const title = "Rassa — Plant-Based Restaurant at TISS Valley, Sebatu";
const description =
  "Rassa is the plant-based restaurant at the front of TISS Valley in Sebatu, Bali — open to villa guests and visitors, built around what the valley grows. Opening soon.";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — TISS Valley" template so
  // the title tag carries the full descriptive line rather than one word.
  title: { absolute: title },
  description,
  alternates: { canonical: "/rassa" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/rassa",
  },
  twitter: { title, description },
};

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

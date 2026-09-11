import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villas — TISS Valley",
  description:
    "Six one-bedroom pool villas set into the highland rice terraces above Sebatu, Bali.",
};

export default function VillasLayout({ children }: LayoutProps<"/villas">) {
  return children;
}

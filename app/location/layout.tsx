import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location — TISS Valley",
  description:
    "TISS Valley sits in Sebatu, above the Tegallalang rice terraces — twenty minutes north of central Ubud, Bali.",
};

export default function LocationLayout({
  children,
}: LayoutProps<"/location">) {
  return children;
}

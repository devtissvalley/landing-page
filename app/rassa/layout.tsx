import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rassa — TISS Valley",
  description:
    "Rassa, the plant-based restaurant at the front of TISS Valley in Sebatu, Bali. Opening soon.",
};

export default function RassaLayout({ children }: LayoutProps<"/rassa">) {
  return children;
}

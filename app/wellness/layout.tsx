import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wellness — TISS Valley",
  description:
    "In-villa spa treatments, morning yoga and plant-based dining at TISS Valley, Sebatu — a retreat, not just a stay.",
};

export default function WellnessLayout({
  children,
}: LayoutProps<"/wellness">) {
  return children;
}

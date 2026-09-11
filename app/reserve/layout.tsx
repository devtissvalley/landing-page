import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reserve — TISS Valley",
  description:
    "Request a reservation at TISS Valley, six one-bedroom pool villas in Sebatu, Bali.",
};

export default function ReserveLayout({
  children,
}: LayoutProps<"/reserve">) {
  return children;
}

"use client";

import { ReactNode } from "react";
import { useReveal } from "@/hook/useReveal";

type RevealProps = {
  children: ReactNode;
  /** Delay in ms — use to stagger a group of items. */
  delay?: number;
  /** "up" (default fade + lift) or "scale" (gentle zoom + fade, for one signature moment). */
  variant?: "up" | "scale";
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[
        variant === "up" ? "reveal-up" : "reveal-scale",
        inView ? "is-in-view" : "",
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

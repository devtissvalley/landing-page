"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// False until the first page has mounted in the browser. Templates remount on
// every navigation, so anything after that first mount is a page change. Not
// set on the server (effects don't run there), so hydration always matches.
let hasMountedOnce = false;

// Keep in step with --curtain-cover-total in globals.css.
const PANELS = 5;
// How early the reveal starts before the last panel has fully landed.
const REVEAL_LEAD_MS = 60;

type Phase = "cover" | "reveal" | "done";

/** The view transition's own pseudo-element animations, if one is running. */
const viewTransitionAnimations = () =>
  document
    .getAnimations()
    .filter((a) =>
      (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith("::view-transition"),
    );

/**
 * Paneled curtain for page changes (rendered by app/template.tsx).
 *
 * 1. Cover: the panels drop in one after another, left to right, over the old
 *    page. They animate in the DOM; the view transition shows them live on
 *    top of the frozen old page (see globals.css).
 * 2. Reveal: as the last panel lands, the view transition is
 *    ended (the screen is fully covered, so nothing visible changes) and the
 *    panels carry on down and off the bottom in the same order.
 *
 * Keying the reveal to the panels themselves, not to a fixed delay or the
 * transition's own clock, means no dead pause however long the page took.
 *
 * Only transforms on a handful of divs — no images, filters or JS animation.
 * Skipped on the first load so the hero isn't hidden behind it.
 */
export default function PageCurtain() {
  const [phase, setPhase] = useState<Phase>(() =>
    hasMountedOnce && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "cover"
      : "done",
  );

  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  useEffect(() => {
    if (phase !== "cover") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const landing = curtainRef.current?.lastElementChild?.getAnimations()[0];

    const reveal = () => {
      if (cancelled) return;
      // Fully covered: end the view transition now rather than wait it out.
      viewTransitionAnimations().forEach((a) => a.finish());
      setPhase("reveal");
    };

    if (!landing) {
      reveal();
    } else {
      landing.ready.then(() => {
        // Start leaving just before the last panel settles — it is 99%+ down
        // by then, and waiting out the ease's tail reads as a pause.
        const { endTime } = landing.effect!.getComputedTiming();
        const remaining = Number(endTime) - Number(landing.currentTime ?? 0);
        timer = setTimeout(reveal, Math.max(0, remaining - REVEAL_LEAD_MS));
      });
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className={`page-curtain fixed inset-0 z-200 flex pointer-events-none ${
        phase === "reveal" ? "is-revealing" : ""
      }`}
    >
      {Array.from({ length: PANELS }, (_, i) => (
        <div
          key={i}
          className="page-curtain-panel flex-1 bg-tiss-forest"
          style={{ "--i": i } as CSSProperties}
          // The last panel out marks the end of the whole curtain.
          onAnimationEnd={
            i === PANELS - 1
              ? (e) => {
                  if (e.animationName === "curtain-panel-out") setPhase("done");
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

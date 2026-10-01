"use client";

import { useEffect, useState } from "react";

// False until the first page has mounted in the browser. Templates remount on
// every navigation, so anything after that first mount is a page change. Not
// set on the server (effects don't run there), so hydration always matches.
let hasMountedOnce = false;

/**
 * Full-screen box for page changes (rendered by app/template.tsx).
 *
 * 1. Cover: during the view transition the box slides down from the top over
 *    the old page (::view-transition-new(page-curtain) in globals.css).
 * 2. Reveal: the transition ends with this element covering the new page; it
 *    then keeps sliding down and off the bottom (.page-curtain).
 *
 * Skipped on the first load so the hero isn't hidden behind it.
 */
export default function PageCurtain() {
  const [visible, setVisible] = useState(() => hasMountedOnce);

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="page-curtain fixed inset-0 z-200 bg-tiss-forest pointer-events-none"
      onAnimationEnd={() => setVisible(false)}
    />
  );
}

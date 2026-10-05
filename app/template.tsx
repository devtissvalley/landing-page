import { ViewTransition } from "react";
import PageCurtain from "@/components/PageCurtain";

// Unlike layout.tsx, a template remounts on every navigation, so this
// ViewTransition sees the old page exit and the new one enter. The curtain
// animation itself lives in globals.css (see components/PageCurtain.tsx).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ViewTransition enter="page-in" exit="page-out" default="none">
        {children}
      </ViewTransition>
      <PageCurtain />
    </>
  );
}

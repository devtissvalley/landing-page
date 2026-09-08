# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build (also type-checks; currently FAILS, see Known broken state)
npm start        # serve production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # type-check only
```

No test runner is configured — there are no tests in this repo.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (PostCSS plugin, no `tailwind.config`). Path alias `@/*` → repo root.

`AGENTS.md` is generated and re-written by `next dev`; it warns that this Next.js version differs from training data — consult `node_modules/next/dist/docs/` before writing Next-specific code. Commit its changes alongside your work rather than reverting them.

## Architecture

Single-page marketing site for the Tiss Valley resort (Bali). One route (`app/page.tsx`), no API routes, no data fetching, no server state.

**Content lives in `lib/data.tsx`, not in JSX.** Every repeated section (stats, brand essences, villas, villa features, wellness features, experience amenities, distances, nav links) is an exported array there; `app/page.tsx` imports them and maps over them. Copy or list changes go in `lib/data.tsx`. Note it is `.tsx`, not `.ts`, because `statsData` embeds `<CountUp />` elements as `value`.

**`app/page.tsx` is one 500-line `"use client"` component** holding all ~11 sections in order, each a `<section>` with its own background color from the palette below. It carries no local layout abstraction on purpose — sections are inlined, not componentized.

**Animation is CSS-first and dependency-free** (no framer-motion). The pattern:
- `app/globals.css` defines the keyframes and the `.reveal-up` / `.reveal-scale` / `.is-in-view` classes, plus `.hero-in`, `.hero-image` (ken burns), `.link-underline`, sidebar transitions.
- `hook/useReveal.ts` is an IntersectionObserver hook that fires once then disconnects.
- `components/Reveal.tsx` wraps children in a div and toggles `is-in-view`; stagger a group by passing `delay` (ms), which becomes `transitionDelay`.
- `components/CountUp.tsx` runs its own observer + rAF ease-out-cubic counter.
- Every animation path short-circuits on `prefers-reduced-motion: reduce`, in both the CSS and the JS. Preserve that when adding motion.

`components/Icons.tsx` holds inline SVG components for UI chrome (phone, Instagram, WhatsApp, etc.). Brand/amenity icons are PNGs under `public/icons/green/` and `public/icons/oat/`, referenced by path string from `lib/data.tsx` — filenames contain spaces and uppercase (`TISS_ICON_OAT_SUN DECK.png`), so copy them exactly.

`Navbar` and `Footer` both take an `onOpenRassa` callback — the intended Rassa-restaurant modal is not implemented yet.

### Design tokens

Fonts are loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS variables registered in the `@theme` block of `globals.css`: `font-hanken` (Hanken Grotesk, body default) and `font-spectral` (Spectral, serif display).

Section background colors are hard-coded hex in class names, not theme tokens: `#EFE7D7` (cream), `#D8CDB6` (sand), `#2B2A27` (near-black), `#1F2A22` (deep green), `#C17B57` (terracotta).

## Known broken state

`npx tsc --noEmit` currently reports two errors, so `next build` fails:

- `app/page.tsx:520` — `setRassaOpen` is called but never defined; the Rassa modal state was never added.
- `app/page.tsx:256` — a `style` prop is passed to `<Reveal>`, which does not accept one.

Also, `lib/data.tsx` `villas[]` points at `/assets/villa-*.webp` files that do not exist in `public/assets/` (only `hero`, `rassa`, `the-valley`, `wellnes-yoga` are present).

`app/layout.tsx` still exports the create-next-app default `metadata` (title "Create Next App").

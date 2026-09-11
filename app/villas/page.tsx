"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { villas, villaFeatures } from "@/lib/data";

// Real assets only live under /public/assets — cycle through them per villa
// until the dedicated villa-*.webp shots are dropped in.
const placeholderImages = [
  "/assets/hero.webp",
  "/assets/wellnes-yoga.webp",
  "/assets/rassa.webp",
];

export default function VillasPage() {
  return (
    <>
      {/* Top bar — slim, detail-page chrome (back to the valley, not the full nav) */}
      <div className="sticky top-0 z-50 bg-[#2B2A27]/90 backdrop-blur-md">
        <nav className="flex justify-between items-center gap-4 px-6 md:px-12 lg:px-20 py-4 text-[#EFE7D7]">
          <Link
            href="/"
            className="link-underline text-[10px] sm:text-xs tracking-widest uppercase"
          >
            &larr; TISS Valley
          </Link>
          <span className="font-spectral text-lg md:text-xl">Villas</span>
          <Link
            href="/reserve"
            className="border border-[#EFE7D7]/60 px-4 py-2 md:px-6 md:py-3 text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 hover:bg-[#EFE7D7] hover:text-[#2B2A27]"
          >
            Reserve a villa
          </Link>
        </nav>
      </div>

      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] md:min-h-screen w-full px-6 md:px-12 lg:px-20 flex items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/hero.webp"
              alt="A pool villa set into the highland rice terraces"
              className="w-full h-full object-cover hero-image"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[#2B2A27]/80">
              <span className="sr-only">dark backdrop</span>
            </div>
          </div>

          <div className="py-24 md:py-32 flex flex-col items-center">
            <div
              className="hero-in inline-flex items-center border py-2 px-4 rounded-full gap-3 border-[#EFE7D7]/40 mb-8"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative">
                <span className="bg-[#B5765A] size-2 rounded-full block absolute inset-0"></span>
                <span className="bg-[#B5765A] size-2 rounded-full block animate-ping"></span>
              </div>
              <span className="text-[#D8CDB6] text-[10px] sm:text-xs tracking-widest uppercase">
                SIX VILLAS &middot; ONE QUIET VALLEY
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-[#EFE7D7] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Villas
            </h1>

            <p
              className="hero-in text-[#7E927F] text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              ONE-BEDROOM POOL VILLAS AT TISS VALLEY, SEBATU
            </p>

            <p
              className="hero-in text-[#D8CDB6] font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
              style={{ animationDelay: "0.7s" }}
            >
              Six one-bedroom villas, each set quietly into the terracing —
              its own plunge pool, its own valley view, and room to
              disappear.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row items-center gap-5"
              style={{ animationDelay: "0.9s" }}
            >
              <a
                href="#the-villas"
                className="bg-[#B5765A] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:bg-[#a3684f]"
              >
                See the villas
              </a>
              <Link
                href="/reserve"
                className="text-[#EFE7D7] py-4 relative group tracking-widest text-xs uppercase"
              >
                Reserve your stay
                <span className="absolute w-full bg-[#EFE7D7] block h-px bottom-2 left-0 transition-transform duration-300 group-hover:scale-x-110"></span>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES STRIP */}
        <section className="bg-[#D8CDB6] px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2B2A27]/15 text-center">
            {villaFeatures.map((feature, idx) => (
              <Reveal key={feature.text} delay={idx * 100}>
                <div className="px-4 py-6 sm:py-2 flex flex-col items-center gap-3">
                  <Image
                    src={feature.icon}
                    alt={feature.text}
                    width={28}
                    height={28}
                    className="size-6 md:size-7 object-contain"
                  />
                  <p className="font-spectral text-base md:text-lg text-[#2B2A27]">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* INTRO — quotes Brand Positioning & Brand Values verbatim */}
        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              BRAND VALUE
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-[#2B2A27] mb-8">
              Privacy is the luxury.
            </h2>
            <span className="block w-16 h-px bg-[#2B2A27]/25 mb-8" />
            <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-[34rem] mb-6">
              Six villas, not sixty. Room to disappear. No two share a wall
              or a view — each is set on its own fold of the terracing,
              apart from the rest.
            </p>
            <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-[34rem]">
              Premium, not luxury — where the performance would be, TISS
              stays restrained.
            </p>
          </Reveal>
        </section>

        {/* VILLAS LIST */}
        <section
          id="the-villas"
          className="flex flex-col gap-24 md:gap-32 bg-[#EFE7D7] pb-24 md:pb-32"
        >
          {villas.map((villa, i) => (
            <div
              key={villa.name}
              className="w-full flex flex-col md:flex-row items-stretch"
            >
              <div className="w-full md:w-5/12 flex flex-col justify-center order-2 md:order-1 px-6 md:px-12 lg:px-20 py-12 md:py-0">
                <Reveal>
                  <p className="text-[#B5765A] text-[10px] sm:text-xs tracking-widest mb-6 uppercase">
                    Villa 0{i + 1}
                  </p>
                  <h3 className="text-[#2B2A27] font-spectral text-4xl md:text-5xl leading-none mb-8">
                    {villa.name}
                  </h3>
                  <p className="text-[#2B2A27]/70 text-sm md:text-base font-light leading-relaxed max-w-sm mb-12">
                    {villa.caption}
                  </p>
                  <Link
                    href="/reserve"
                    className="inline-flex items-center text-[#2B2A27] text-xs tracking-widest uppercase relative group w-max pb-2"
                  >
                    <span className="tracking-widest">RESERVE THIS VILLA</span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-[#2B2A27]/20"></span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-[#2B2A27] scale-x-0 origin-left transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                  </Link>
                </Reveal>
              </div>

              <div className="w-full md:w-7/12 order-1 md:order-2 relative h-[50vh] md:h-[36rem] overflow-hidden bg-[#2B2A27]/5">
                <Reveal delay={150} className="w-full h-full">
                  <Image
                    fill
                    src={placeholderImages[i % placeholderImages.length]}
                    alt={villa.name}
                    className="object-cover"
                  />
                </Reveal>
              </div>
            </div>
          ))}
        </section>

        {/* CLOSING CTA */}
        <section
          id="reserve"
          className="bg-[#B5765A] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#EFE7D7] mb-10">
              Six villas.
              <br />
              One quiet valley.
            </h2>
            <Link
              href="/reserve"
              className="inline-block bg-[#2B2A27] text-[#EFE7D7] px-8 py-4 tracking-widest text-sm transition-colors duration-300 hover:brightness-110"
            >
              CHECK AVAILABILITY
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Slim footer for the detail page */}
      <footer className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-8 text-center">
        <p className="text-[#D8CDB6]/40 text-xs">
          The villas are part of{" "}
          <Link href="/" className="link-underline text-[#D8CDB6]/70">
            TISS Valley
          </Link>
          , Sebatu &middot; &copy; 2026 TISS Valley
        </p>
      </footer>
    </>
  );
}

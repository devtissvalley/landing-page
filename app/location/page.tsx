"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { distances, locationFacts } from "@/lib/data";

export default function LocationPage() {
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
          <span className="font-spectral text-lg md:text-xl">Location</span>
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
              alt="The highland terraces above Sebatu at first light"
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
                SEBATU &middot; ABOVE THE TEGALLALANG TERRACES
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-[#EFE7D7] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Location
            </h1>

            <p
              className="hero-in text-[#7E927F] text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              TWENTY MINUTES NORTH OF CENTRAL UBUD, BALI
            </p>

            <p
              className="hero-in text-[#D8CDB6] font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
              style={{ animationDelay: "0.7s" }}
            >
              The quiet has moved uphill. Ubud&rsquo;s centre is busy now —
              in Sebatu the highland keeps its own slow time: cool mornings,
              terraced water, little noise.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row items-center gap-5"
              style={{ animationDelay: "0.9s" }}
            >
              <a
                href="#distances"
                className="bg-[#B5765A] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:bg-[#a3684f]"
              >
                See distances
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

        {/* FACTS STRIP */}
        <section className="bg-[#D8CDB6] px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2B2A27]/15 text-center">
            {locationFacts.map((fact, idx) => (
              <Reveal key={fact.label} delay={idx * 100}>
                <div className="px-4 py-6 sm:py-2">
                  <p className="text-[#2B2A27]/50 text-[10px] tracking-widest uppercase mb-2">
                    {fact.label}
                  </p>
                  <p className="font-spectral text-lg md:text-xl text-[#2B2A27]">
                    {fact.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* BACKGROUND — quoted verbatim from the brand book */}
        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                BACKGROUND
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-[#2B2A27] mb-8">
                The quiet has
                <br className="hidden md:block" /> moved uphill.
              </h2>
              <span className="block w-16 h-px bg-[#2B2A27]/25 mb-8" />
              <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed mb-6 max-w-[30rem]">
                Ubud&rsquo;s centre is busy now. In Sebatu, above the
                Tegallalang terraces, the highland keeps its own slow
                time — cool mornings, terraced water, little noise.
              </p>
              <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-[30rem]">
                TISS Valley is six one-bedroom villas set into that calm,
                for travellers who come for stillness rather than
                spectacle.
              </p>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-[20rem] sm:h-[26rem] md:h-[34rem] lg:h-[40rem] overflow-hidden"
            >
              <Image
                fill
                src="/assets/wellnes-yoga.webp"
                alt="A quiet deck facing the terraces above Sebatu"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* DISTANCES */}
        <section
          id="distances"
          className="bg-[#2E4034] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <Reveal>
              <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                DISTANCES
              </p>
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-[3.5rem] leading-tight text-[#EFE7D7] mb-8">
                Above the terraces,
                <br className="hidden md:block" />
                within reach of
                <br className="hidden md:block" />
                everything.
              </h2>
              <p className="text-[#D8CDB6]/70 font-light mb-12 max-w-[28rem] text-sm md:text-base leading-relaxed">
                Close enough to Ubud for a morning in town, far enough for
                the noise to stay behind you.
              </p>

              <div className="flex flex-col border-t border-[#EFE7D7]/15">
                {distances.map((d) => (
                  <div
                    key={d.place}
                    className="flex justify-between items-center py-5 text-[#EFE7D7] border-b border-[#EFE7D7]/15"
                  >
                    <span className="font-light text-sm md:text-base">
                      {d.place}
                    </span>
                    <span className="font-light text-sm md:text-base text-[#D8CDB6]/60">
                      {d.time}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
            >
              <Image
                fill
                src="/assets/rassa.webp"
                alt="The road up to TISS Valley through the rice terraces"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* MAP — placeholder pin, general Bali only; exact villa coordinates TBD */}
        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="mb-10 md:mb-14 text-left">
            <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              FIND US
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#2B2A27]">
              Somewhere in the hills of Bali.
            </h2>
          </Reveal>

          <Reveal
            delay={150}
            className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] overflow-hidden border border-[#2B2A27]/10"
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=114.35%2C-8.95%2C115.80%2C-7.95&layer=mapnik&marker=-8.5069%2C115.2625"
              className="w-full h-full"
              style={{ border: 0, filter: "grayscale(0.15) contrast(1.05)" }}
              loading="lazy"
              title="TISS Valley — general location in Bali"
            />
          </Reveal>

          <p className="text-[#2B2A27]/50 text-xs mt-4 max-w-lg">
            Pin marks the general highland area, not the exact address —
            precise directions are shared once your stay is confirmed.
          </p>
        </section>

        {/* CLOSING CTA — the brand's master tagline, quoted verbatim */}
        <section
          id="reserve"
          className="bg-[#B5765A] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#EFE7D7] mb-10">
              Stay in the
              <br />
              rhythm of comfort.
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
          Location is part of{" "}
          <Link href="/" className="link-underline text-[#D8CDB6]/70">
            TISS Valley
          </Link>
          , Sebatu &middot; &copy; 2026 TISS Valley
        </p>
      </footer>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { distances, locationFacts } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LocationPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative isolate min-h-[85vh] md:min-h-screen w-full px-6 md:px-12 lg:px-20 flex items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/location.webp"
              alt="The highland terraces above Sebatu at first light"
              className="w-full h-full object-cover hero-image"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/60">
              <span className="sr-only">dark backdrop</span>
            </div>
          </div>

          <div className="py-24 md:py-32 flex flex-col items-center">
            <div
              className="hero-in inline-flex items-center border py-2 px-4 rounded-full gap-3 border-tiss-oat/40 mb-8"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-tiss-sand text-[10px] sm:text-xs tracking-widest uppercase">
                SEBATU &middot; ABOVE THE TEGALLALANG TERRACES
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-tiss-oat text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Location
            </h1>

            <p
              className="hero-in text-tiss-sage text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              TWENTY MINUTES NORTH OF CENTRAL UBUD, BALI
            </p>

            <p
              className="hero-in text-tiss-sand font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
              style={{ animationDelay: "0.7s" }}
            >
              The quiet has moved uphill. Ubud&rsquo;s centre is busy now — in
              Sebatu the highland keeps its own slow time: cool mornings,
              terraced water, little noise.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row items-center gap-5"
              style={{ animationDelay: "0.9s" }}
            >
              <a
                href="#distances"
                className="bg-tiss-clay text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition duration-300 hover:brightness-90"
              >
                See distances
              </a>
              <Link
                href="/reserve"
                className="text-tiss-oat py-4 relative group tracking-widest text-xs uppercase"
              >
                Reserve your stay
                <span className="absolute w-full bg-tiss-oat block h-px bottom-2 left-0 transition-transform duration-300 group-hover:scale-x-110"></span>
              </Link>
            </div>
          </div>
        </section>

        {/* FACTS STRIP */}
        <section className="bg-tiss-sand px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-tiss-charcoal/15 text-center">
            {locationFacts.map((fact, idx) => (
              <Reveal key={fact.label} delay={idx * 100}>
                <div className="px-4 py-6 sm:py-2">
                  <p className="text-tiss-charcoal/50 text-[10px] tracking-widest uppercase mb-2">
                    {fact.label}
                  </p>
                  <p className="font-spectral text-lg md:text-xl text-tiss-charcoal">
                    {fact.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* BACKGROUND — quoted verbatim from the brand book */}
        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                BACKGROUND
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-tiss-charcoal mb-8">
                The quiet has
                <br className="hidden md:block" /> moved uphill.
              </h2>
              <span className="block w-16 h-px bg-tiss-charcoal/25 mb-8" />
              <p className="text-tiss-charcoal/70 font-light text-sm md:text-base leading-relaxed mb-6 max-w-120">
                Ubud&rsquo;s centre is busy now. In Sebatu, above the
                Tegallalang terraces, the highland keeps its own slow time —
                cool mornings, terraced water, little noise.
              </p>
              <p className="text-tiss-charcoal/70 font-light text-sm md:text-base leading-relaxed max-w-120">
                TISS Valley is six one-bedroom villas set into that calm, for
                travellers who come for stillness rather than spectacle.
              </p>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-80 sm:h-104 md:h-136 lg:h-160 overflow-hidden"
            >
              <Image
                fill
                src="/assets/wellnes-yoga.webp"
                alt="A quiet deck facing the rice terraces above Sebatu, Bali"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* DISTANCES */}
        <section
          id="distances"
          className="bg-tiss-forest px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <Reveal>
              <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                DISTANCES
              </p>
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-[3.5rem] leading-tight text-tiss-oat mb-8">
                Above the terraces,
                <br className="hidden md:block" />
                within reach of
                <br className="hidden md:block" />
                everything.
              </h2>
              <p className="text-tiss-sand/70 font-light mb-12 max-w-md text-sm md:text-base leading-relaxed">
                Close enough to Ubud for a morning in town, far enough for the
                noise to stay behind you.
              </p>

              <div className="flex flex-col border-t border-tiss-oat/15">
                {distances.map((d) => (
                  <div
                    key={d.place}
                    className="flex justify-between items-center py-5 text-tiss-oat border-b border-tiss-oat/15"
                  >
                    <span className="font-light text-sm md:text-base">
                      {d.place}
                    </span>
                    <span className="font-light text-sm md:text-base text-tiss-sand/60">
                      {d.time}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-75 sm:h-100 md:h-125 lg:h-150 overflow-hidden"
            >
              <Image
                fill
                src="/assets/ricefield.webp"
                alt="The road up to TISS Valley through the Tegallalang rice terraces"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* MAP — pinned to Jl. Br Jasan, Sebatu, Tegallalang, Gianyar */}
        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="mb-10 md:mb-14 text-left">
            <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              FIND US
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-tiss-charcoal">
              Find us in Sebatu.
            </h2>
          </Reveal>

          <Reveal
            delay={150}
            className="relative w-full h-90 sm:h-110 md:h-130 overflow-hidden border border-tiss-charcoal/10"
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=115.2820%2C-8.3889%2C115.3320%2C-8.3489&layer=mapnik&marker=-8.368862%2C115.306984"
              className="w-full h-full border-0 grayscale-15 contrast-105"
              loading="lazy"
              title="TISS Valley — Jl. Br Jasan, Sebatu, Tegallalang, Gianyar, Bali"
            />
          </Reveal>

          <p className="text-tiss-charcoal/50 text-xs mt-4 max-w-lg">
            Jl. Br Jasan, Sebatu, Kec. Tegallalang, Kabupaten Gianyar, Bali
            80561 — full directions are shared once your stay is confirmed.
          </p>
        </section>

        {/* CLOSING CTA — the brand's master tagline, quoted verbatim */}
        <section
          id="reserve"
          className="bg-tiss-clay px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-tiss-oat mb-10">
              Stay in the
              <br />
              rhythm of comfort.
            </h2>
            <Link
              href="/reserve"
              className="inline-block bg-tiss-charcoal text-tiss-oat px-8 py-4 tracking-widest text-sm transition-colors duration-300 hover:brightness-110"
            >
              CHECK AVAILABILITY
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Slim footer for the detail page */}
      <Footer />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { villas, villaFeatures } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const placeholderImages = [
  "/assets/hero.webp",
  "/assets/wellnes-yoga.webp",
  "/assets/rassa.webp",
];

const villaSpecs = [
  "1 Villa",
  "One Bedroom",
  "Private Plunge Pool",
  "Valley View",
  "Suitable for 2 Adults",
  "Free Wi-Fi",
];

export default function VillasPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] md:min-h-screen w-full px-6 md:px-12 lg:px-20 flex items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/hero.webp"
              alt="A pool villa set into the highland rice terraces"
              className="w-full h-full object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/60">
              <span className="sr-only">dark backdrop</span>
            </div>
          </div>

          <div className="py-24 md:py-32 flex flex-col items-center">
            <div
              className="hero-in inline-flex items-center border py-2 px-4 rounded-full gap-3 border-[#EFE7D7]/40 mb-8"
              style={{ animationDelay: "0.1s" }}
            >
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
              Six one-bedroom villas, each set quietly into the terracing — its
              own plunge pool, its own valley view, and room to disappear.
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
                    alt=""
                    aria-hidden="true"
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

        {/* INTRO & VILLAS LIST (Sticky Layout) */}
        <section
          id="the-villas"
          className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-24 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
        >
          {/* LEFT COLUMN - Sticky Copywriting */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
            <Reveal>
              <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                BRAND VALUE
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-[#2B2A27] mb-8">
                Privacy is the luxury.
              </h2>
              <span className="block w-16 h-px bg-[#2B2A27]/25 mb-8" />
              <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed mb-6">
                Six villas, not sixty. Room to disappear. No two share a wall or
                a view — each is set on its own fold of the terracing, apart
                from the rest.
              </p>
              <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed">
                Premium, not luxury — where the performance would be, TISS stays
                restrained.
              </p>
            </Reveal>
          </div>

          {/* RIGHT COLUMN - Scrolling Villa Items */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12 md:gap-16">
            {villas.map((villa, i) => (
              <Reveal
                key={villa.name}
                className="border border-[#2B2A27]/10 bg-[#EFE7D7] flex flex-col"
              >
                {/* Villa Image */}
                <div className="w-full relative h-64 sm:h-80 md:h-[28rem] overflow-hidden">
                  <Image
                    fill
                    src={villa.src}
                    alt={`${villa.name} — a one-bedroom pool villa at TISS Valley, Sebatu`}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>

                {/* Villa Details */}
                <div className="w-full flex flex-col justify-center p-8 md:p-10 lg:p-12">
                  <p className="text-[#B5765A] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                    Villa 0{i + 1}
                  </p>
                  <h3 className="text-[#2B2A27] font-spectral text-3xl md:text-4xl leading-none mb-6">
                    {villa.name}
                  </h3>

                  <ul className="flex flex-col gap-2 mb-6 text-[#2B2A27]/70 text-sm font-light">
                    {villaSpecs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>

                  <p className="text-[#2B2A27]/70 text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
                    {villa.caption}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/reserve?villa=${encodeURIComponent(villa.name)}`}
                      className="bg-[#B5765A] text-[#EFE7D7] px-6 py-3 text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 hover:bg-[#a3684f]"
                    >
                      Reserve This Villa
                    </Link>
                    <Link
                      href={`/reserve?villa=${encodeURIComponent(villa.name)}`}
                      className="border border-[#2B2A27]/30 text-[#2B2A27] px-6 py-3 text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 hover:bg-[#2B2A27] hover:text-[#EFE7D7]"
                    >
                      Check Rates
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
      <Footer />
    </>
  );
}

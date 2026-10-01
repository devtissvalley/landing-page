import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { wellnessFeatures, experienceData } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WellnessPage() {
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
              src="/assets/wellnes-yoga.webp"
              alt="Morning yoga session on a deck facing the valley"
              className="w-full h-full object-cover hero-image -scale-x-100"
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
                ADEM &middot; COOL &middot; STILL &middot; UNHURRIED
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-tiss-oat text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Wellness
            </h1>

            <p
              className="hero-in text-tiss-sage text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              IN-VILLA SPA, YOGA &amp; PLANT-BASED DINING AT TISS VALLEY
            </p>

            <p
              className="hero-in text-tiss-sand font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
              style={{ animationDelay: "0.7s" }}
            >
              A retreat, not just a stay. Every treatment, session and meal is
              brought to you, unhurried — so the only thing left to do is slow
              down.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row items-center gap-5"
              style={{ animationDelay: "0.9s" }}
            >
              <a
                href="#the-experience"
                className="bg-tiss-clay text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition duration-300 hover:brightness-90"
              >
                See the offerings
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

        {/* BRAND ESSENCE — quoted verbatim from the brand book */}
        <section className="bg-tiss-forest px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal variant="scale">
            <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              BRAND ESSENCE
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl lg:text-7xl text-tiss-oat">
              Adem.
            </h2>
            <p className="text-tiss-sand/70 mt-4 tracking-widest text-sm mb-8">
              COOL &middot; STILL &middot; UNHURRIED
            </p>
            <p className="text-tiss-sand font-light max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              The essence is highland air at first light — cool, clean, and
              quiet. Every decision, from the mark to the welcome, protects that
              stillness.
            </p>
          </Reveal>
        </section>

        {/* FEATURES — one row per wellness offering, alternating like Rassa's concept section */}
        <section
          id="the-experience"
          className="flex flex-col gap-24 md:gap-32 bg-tiss-oat py-24 md:py-32"
        >
          {wellnessFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`w-full flex flex-col md:flex-row items-stretch ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-5/12 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
                <Reveal>
                  <Image
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                    width={36}
                    height={36}
                    className="size-8 md:size-9 object-contain mb-6"
                  />
                  <p className="text-tiss-clay text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                    0{i + 1}
                  </p>
                  <h3 className="text-tiss-charcoal font-spectral text-3xl md:text-4xl leading-tight mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-tiss-charcoal/70 text-sm md:text-base font-light leading-relaxed max-w-sm">
                    {feature.desc}
                  </p>
                </Reveal>
              </div>

              <div className="w-full md:w-7/12 relative h-[50vh] md:h-[36rem] overflow-hidden bg-tiss-charcoal/5">
                <Reveal delay={150} className="w-full h-full">
                  <Image
                    fill
                    src={feature.src}
                    alt={`${feature.title} at TISS Valley, Sebatu`}
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover"
                  />
                </Reveal>
              </div>
            </div>
          ))}
        </section>

        {/* EXPERIENCE GRID — "Care without fuss." (Brand Value, quoted verbatim) */}
        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 pb-16 md:pb-20 lg:pb-24">
          <Reveal className="mb-12 md:mb-16 text-left">
            <p className="text-tiss-forest/60 text-[10px] sm:text-xs tracking-widest mb-3 uppercase">
              CARE WITHOUT FUSS
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl text-tiss-forest">
              Warm, unhurried, never performed.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 lg:gap-4">
            {experienceData.map(({ icon, label }, i) => (
              <Reveal
                key={label}
                delay={i * 70}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="size-16 md:size-[72px] rounded-full bg-tiss-sand flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <Image
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                    className="size-5 md:size-6 object-contain"
                  />
                </div>
                <p className="text-tiss-forest/80 text-xs md:text-sm font-light">
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section
          id="reserve"
          className="bg-tiss-clay px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-tiss-oat mb-10">
              A retreat,
              <br />
              not just a stay.
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

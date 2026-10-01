"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { rassaIdeas, rassaFacts } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RassaPage() {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

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
              src="/assets/rassa.webp"
              alt="Plant-based produce prepared at Rassa"
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
                IN PROGRESS &middot; OPENING SOON
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-tiss-oat text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Rassa
            </h1>

            <p
              className="hero-in text-tiss-sage text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              THE PLANT-BASED RESTAURANT AT TISS VALLEY, SEBATU
            </p>

            <p
              className="hero-in text-tiss-sand font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
              style={{ animationDelay: "0.7s" }}
            >
              The restaurant at the front of TISS Valley. A plant-based table
              built around what the valley itself grows, open to villa guests
              and visitors alike.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row items-center gap-5"
              style={{ animationDelay: "0.9s" }}
            >
              <a
                href="#concept"
                className="bg-tiss-clay text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition duration-300 hover:brightness-90"
              >
                The concept
              </a>
              <a
                href="#notify"
                className="text-tiss-oat py-4 relative group tracking-widest text-xs uppercase"
              >
                Get notified at launch
                <span className="absolute w-full bg-tiss-oat block h-px bottom-2 left-0 transition-transform duration-300 group-hover:scale-x-110"></span>
              </a>
            </div>
          </div>
        </section>

        {/* THE CONCEPT */}
        <section
          id="concept"
          className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <p className="text-tiss-forest/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                THE CONCEPT
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-tiss-forest mb-8">
                Grown in the valley,
                <br className="hidden md:block" /> served at its gate.
              </h2>
              <span className="block w-16 h-px bg-tiss-forest/25 mb-8" />
              <p className="text-tiss-forest/70 font-light text-sm md:text-base leading-relaxed mb-6 max-w-[30rem]">
                Rassa sits at the front of the property — a public restaurant
                open to villa guests and outside visitors, rather than a
                room-service kitchen tucked away for residents only.
              </p>
              <p className="text-tiss-forest/70 font-light text-sm md:text-base leading-relaxed max-w-[30rem]">
                The direction is plant-based: a menu built around what grows in
                and around Sebatu, prepared simply and served without ceremony,
                in keeping with the same restraint that runs through the villas.
              </p>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-[20rem] sm:h-[26rem] md:h-[34rem] lg:h-[40rem] overflow-hidden"
            >
              <Image
                fill
                src="/assets/rassa.webp"
                alt="Vegetables being prepared on a wooden board at Rassa, Sebatu"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* THREE IDEAS */}
        <section className="bg-tiss-charcoal px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal>
            <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              DIRECTION
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-tiss-oat">
              Three ideas guiding Rassa
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 mt-14 md:mt-20 border-y border-tiss-oat/15 divide-y lg:divide-y-0 lg:divide-x divide-tiss-oat/15 text-left">
            {rassaIdeas.map((idea, idx) => (
              <Reveal key={idea.title} delay={idx * 100}>
                <div className="py-12 lg:py-16 px-6 lg:px-10 h-full flex flex-col">
                  <Image
                    src={idea.icon}
                    alt=""
                    aria-hidden="true"
                    width={32}
                    height={32}
                    className="size-7 md:size-8 object-contain mb-6"
                  />
                  <h3 className="text-tiss-oat font-spectral text-2xl mb-4">
                    {idea.title}
                  </h3>
                  <p className="text-tiss-sand/70 text-sm font-light leading-relaxed">
                    {idea.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FACTS STRIP */}
        <section className="bg-tiss-sand px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-tiss-forest/15 text-center">
            {rassaFacts.map((fact, idx) => (
              <Reveal key={fact.label} delay={idx * 100}>
                <div className="px-4 py-6 sm:py-2">
                  <p className="text-tiss-forest/50 text-[10px] tracking-widest uppercase mb-2">
                    {fact.label}
                  </p>
                  <p className="font-spectral text-lg md:text-xl text-tiss-forest">
                    {fact.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* NOTIFY */}
        <section
          id="notify"
          className="bg-tiss-clay px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              STAY IN THE LOOP
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-tiss-charcoal mb-6">
              Be the first to know
              <br />
              when Rassa opens.
            </h2>
            <p className="text-tiss-charcoal/70 font-light text-sm md:text-base max-w-lg mx-auto mb-10">
              We&rsquo;ll share the final name, menu and opening date once
              they&rsquo;re confirmed — no spam, just one note when it&rsquo;s
              ready.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNotified(true);
              }}
              className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-lg mx-auto"
            >
              <label htmlFor="rassa-email" className="sr-only">
                Email address
              </label>
              <input
                id="rassa-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-tiss-oat text-tiss-charcoal placeholder:text-tiss-charcoal/40 px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-tiss-forest"
              />
              <button
                type="submit"
                className="bg-tiss-forest text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase cursor-pointer transition duration-300 hover:brightness-90"
              >
                Notify me
              </button>
            </form>

            {notified && (
              <p className="text-tiss-charcoal text-sm mt-5">
                Thank you — we&rsquo;ll write to you when Rassa opens.
              </p>
            )}
          </Reveal>
        </section>
      </main>

      {/* Slim footer for the detail page */}
      <Footer />
    </>
  );
}

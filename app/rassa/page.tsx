"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { rassaIdeas, rassaFacts } from "@/lib/data";

export default function RassaPage() {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

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
          <span className="font-spectral text-lg md:text-xl">Rassa</span>
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
              src="/assets/rassa.webp"
              alt="Plant-based produce prepared at Rassa"
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
                IN PROGRESS &middot; OPENING SOON
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-[#EFE7D7] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Rassa
            </h1>

            <p
              className="hero-in text-[#7E927F] text-[10px] sm:text-xs tracking-widest uppercase mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              THE PLANT-BASED RESTAURANT AT TISS VALLEY, SEBATU
            </p>

            <p
              className="hero-in text-[#D8CDB6] font-light max-w-xl text-sm md:text-base leading-relaxed mb-10"
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
                className="bg-[#B5765A] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:bg-[#a3684f]"
              >
                The concept
              </a>
              <a
                href="#notify"
                className="text-[#EFE7D7] py-4 relative group tracking-widest text-xs uppercase"
              >
                Get notified at launch
                <span className="absolute w-full bg-[#EFE7D7] block h-px bottom-2 left-0 transition-transform duration-300 group-hover:scale-x-110"></span>
              </a>
            </div>
          </div>
        </section>

        {/* THE CONCEPT */}
        <section
          id="concept"
          className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <p className="text-[#1F2A22]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                THE CONCEPT
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl leading-tight text-[#1F2A22] mb-8">
                Grown in the valley,
                <br className="hidden md:block" /> served at its gate.
              </h2>
              <span className="block w-16 h-px bg-[#1F2A22]/25 mb-8" />
              <p className="text-[#1F2A22]/70 font-light text-sm md:text-base leading-relaxed mb-6 max-w-[30rem]">
                Rassa sits at the front of the property — a public restaurant
                open to villa guests and outside visitors, rather than a
                room-service kitchen tucked away for residents only.
              </p>
              <p className="text-[#1F2A22]/70 font-light text-sm md:text-base leading-relaxed max-w-[30rem]">
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
                alt="Vegetables being prepared on a wooden board at Rassa"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* THREE IDEAS */}
        <section className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal>
            <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              DIRECTION
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#EFE7D7]">
              Three ideas guiding Rassa
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 mt-14 md:mt-20 border-y border-[#EFE7D7]/15 divide-y lg:divide-y-0 lg:divide-x divide-[#EFE7D7]/15 text-left">
            {rassaIdeas.map((idea, idx) => (
              <Reveal key={idea.title} delay={idx * 100}>
                <div className="py-12 lg:py-16 px-6 lg:px-10 h-full flex flex-col">
                  <Image
                    src={idea.icon}
                    alt={idea.title}
                    width={32}
                    height={32}
                    className="size-7 md:size-8 object-contain mb-6"
                  />
                  <h3 className="text-[#EFE7D7] font-spectral text-2xl mb-4">
                    {idea.title}
                  </h3>
                  <p className="text-[#D8CDB6]/70 text-sm font-light leading-relaxed">
                    {idea.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FACTS STRIP */}
        <section className="bg-[#D8CDB6] px-6 md:px-12 lg:px-20 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1F2A22]/15 text-center">
            {rassaFacts.map((fact, idx) => (
              <Reveal key={fact.label} delay={idx * 100}>
                <div className="px-4 py-6 sm:py-2">
                  <p className="text-[#1F2A22]/50 text-[10px] tracking-widest uppercase mb-2">
                    {fact.label}
                  </p>
                  <p className="font-spectral text-lg md:text-xl text-[#1F2A22]">
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
          className="bg-[#C17B57] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center"
        >
          <Reveal>
            <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
              STAY IN THE LOOP
            </p>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#2B2A27] mb-6">
              Be the first to know
              <br />
              when Rassa opens.
            </h2>
            <p className="text-[#2B2A27]/70 font-light text-sm md:text-base max-w-lg mx-auto mb-10">
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
                className="flex-1 bg-[#EFE7D7] text-[#2B2A27] placeholder:text-[#2B2A27]/40 px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#1F2A22]"
              />
              <button
                type="submit"
                className="bg-[#1F2A22] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase cursor-pointer transition-colors duration-300 hover:bg-[#16201a]"
              >
                Notify me
              </button>
            </form>

            {notified && (
              <p className="text-[#2B2A27] text-sm mt-5">
                Thank you — we&rsquo;ll write to you when Rassa opens.
              </p>
            )}
          </Reveal>
        </section>
      </main>

      {/* Slim footer for the detail page */}
      <footer className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-8 text-center">
        <p className="text-[#D8CDB6]/40 text-xs">
          Rassa is part of{" "}
          <Link href="/" className="link-underline text-[#D8CDB6]/70">
            TISS Valley
          </Link>
          , Sebatu &middot; &copy; 2026 TISS Valley
        </p>
      </footer>
    </>
  );
}

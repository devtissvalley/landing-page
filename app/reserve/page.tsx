"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { villas, villaFeatures } from "@/lib/data";
import { IconPhone, IconInstagram, IconWhatsApp } from "@/components/Icons";

// Real assets only live under /public/assets — cycle through them per villa
// until dedicated villa-*.webp shots are dropped in. the-valley.webp is left
// out on purpose (see app/villas/page.tsx for why).
const placeholderImages = [
  "/assets/hero.webp",
  "/assets/wellnes-yoga.webp",
  "/assets/rassa.webp",
];

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = Math.round(
    (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : 0;
}

export default function ReservePage() {
  const today = new Date().toISOString().split("T")[0];

  const [villaIndex, setVillaIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedVilla = villas[villaIndex];
  const nights = nightsBetween(checkIn, checkOut);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <span className="font-spectral text-lg md:text-xl">Reserve</span>
          <a
            href="tel:+6281139808151"
            className="hidden sm:inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-widest uppercase link-underline"
          >
            <IconPhone className="size-3.5" />
            +62 811 3980 8151
          </a>
        </nav>
      </div>

      <main>
        {/* HERO — compact, this is a functional page rather than a full-screen moment */}
        <section className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 flex items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/hero.webp"
              alt="A pool villa set into the highland rice terraces"
              className="w-full h-full object-cover hero-image"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[#2B2A27]/85">
              <span className="sr-only">dark backdrop</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
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
              className="hero-in font-spectral text-[#EFE7D7] text-5xl sm:text-6xl md:text-7xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Reserve Your Stay
            </h1>

            <p
              className="hero-in text-[#D8CDB6] font-light max-w-lg text-sm md:text-base leading-relaxed mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              Tell us your dates and which villa calls to you — our team
              confirms availability and pricing by email, usually within
              24 hours.
            </p>

            <a
              href="#book"
              className="hero-in bg-[#B5765A] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:bg-[#a3684f]"
              style={{ animationDelay: "0.7s" }}
            >
              Start your request
            </a>
          </div>
        </section>

        {/* BOOKING FORM + SUMMARY */}
        <section
          id="book"
          className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* FORM */}
            <Reveal className="lg:col-span-3">
              {submitted ? (
                <div className="border border-[#2B2A27]/15 px-8 py-12 md:px-12 md:py-16">
                  <p className="text-[#B5765A] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                    REQUEST SENT
                  </p>
                  <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27] mb-6">
                    Thank you, {name.split(" ")[0] || "there"}.
                  </h2>
                  <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-md">
                    We&rsquo;ve noted your request for {selectedVilla.name}
                    {nights > 0 ? ` — ${nights} night${nights > 1 ? "s" : ""}` : ""}.
                    Our team will confirm availability and pricing at{" "}
                    <span className="text-[#2B2A27]">{email}</span> within
                    24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-10 inline-flex items-center text-[#2B2A27] text-xs tracking-widest uppercase relative group w-max pb-2"
                  >
                    <span className="tracking-widest">
                      EDIT MY REQUEST
                    </span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-[#2B2A27]/20"></span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-[#2B2A27] scale-x-0 origin-left transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                  <div>
                    <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                      YOUR STAY
                    </p>
                    <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27]">
                      Request a reservation.
                    </h2>
                  </div>

                  <div>
                    <label
                      htmlFor="villa"
                      className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                    >
                      Villa
                    </label>
                    <select
                      id="villa"
                      value={villaIndex}
                      onChange={(e) => setVillaIndex(Number(e.target.value))}
                      className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] py-3 text-sm md:text-base outline-none focus:border-[#2B2A27] appearance-none"
                    >
                      {villas.map((villa, i) => (
                        <option key={villa.name} value={i}>
                          {villa.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="checkIn"
                        className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                      >
                        Check-in
                      </label>
                      <input
                        id="checkIn"
                        type="date"
                        required
                        min={today}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="checkOut"
                        className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                      >
                        Check-out
                      </label>
                      <input
                        id="checkOut"
                        type="date"
                        required
                        min={checkIn || today}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="guests"
                      className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                    >
                      Guests
                    </label>
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] py-3 text-sm md:text-base outline-none focus:border-[#2B2A27] appearance-none"
                    >
                      <option value={1}>1 guest</option>
                      <option value={2}>2 guests</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] placeholder:text-[#2B2A27]/35 py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                      >
                        Phone (optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 ..."
                        className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] placeholder:text-[#2B2A27]/35 py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] placeholder:text-[#2B2A27]/35 py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2"
                    >
                      Special requests (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anniversary, dietary needs, late arrival..."
                      className="w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] placeholder:text-[#2B2A27]/35 py-3 text-sm md:text-base outline-none focus:border-[#2B2A27] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="self-start bg-[#B5765A] text-[#EFE7D7] px-10 py-4 tracking-widest text-xs uppercase cursor-pointer transition-colors duration-300 hover:bg-[#a3684f]"
                  >
                    Check availability
                  </button>
                </form>
              )}
            </Reveal>

            {/* SUMMARY */}
            <Reveal delay={150} className="lg:col-span-2">
              <div className="border border-[#2B2A27]/15">
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    fill
                    src={placeholderImages[villaIndex % placeholderImages.length]}
                    alt={selectedVilla.name}
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <p className="text-[#B5765A] text-[10px] tracking-widest mb-3 uppercase">
                    Villa 0{villaIndex + 1}
                  </p>
                  <h3 className="text-[#2B2A27] font-spectral text-2xl mb-3">
                    {selectedVilla.name}
                  </h3>
                  <p className="text-[#2B2A27]/70 text-sm font-light leading-relaxed mb-6">
                    {selectedVilla.caption}
                  </p>

                  <div className="flex flex-col gap-3 border-t border-[#2B2A27]/10 pt-6 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2B2A27]/60">Check-in</span>
                      <span className="text-[#2B2A27]">
                        {checkIn || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2B2A27]/60">Check-out</span>
                      <span className="text-[#2B2A27]">
                        {checkOut || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2B2A27]/60">Nights</span>
                      <span className="text-[#2B2A27]">
                        {nights > 0 ? nights : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2B2A27]/60">Guests</span>
                      <span className="text-[#2B2A27]">{guests}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[#2B2A27]/10 pt-6">
                    {villaFeatures.map((feature) => (
                      <div
                        key={feature.text}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={feature.icon
                            .replace("/icons/oat/", "/icons/green/")
                            .replace("TISS_ICON_OAT_", "TISS_ICON_GREEN_")}
                          alt=""
                          width={16}
                          height={16}
                          className="size-4 object-contain shrink-0"
                        />
                        <span className="text-[#2B2A27]/70 text-xs font-light">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 px-2">
                <p className="text-[#2B2A27]/60 text-[10px] tracking-widest mb-4 uppercase">
                  Prefer to talk it through?
                </p>
                <div className="flex items-center gap-5 text-[#2B2A27]/70">
                  <a
                    href="tel:+6281139808151"
                    className="flex items-center gap-2 text-sm link-underline"
                  >
                    <IconPhone className="size-4" />
                    Call
                  </a>
                  <a
                    href="https://wa.me/6281139808151"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm link-underline"
                  >
                    <IconWhatsApp className="size-4" />
                    WhatsApp
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm link-underline"
                  >
                    <IconInstagram className="size-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Slim footer for the detail page */}
      <footer className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-8 text-center">
        <p className="text-[#D8CDB6]/40 text-xs">
          Reservations are handled directly by{" "}
          <Link href="/" className="link-underline text-[#D8CDB6]/70">
            TISS Valley
          </Link>
          , Sebatu &middot; &copy; 2026 TISS Valley
        </p>
      </footer>
    </>
  );
}

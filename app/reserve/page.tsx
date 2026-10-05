"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { villas, villaFeatures } from "@/lib/data";
import type { RoomOffer } from "@/lib/beds24";
import { IconPhone, IconInstagram, IconWhatsApp } from "@/components/Icons";

// Real assets only live under /public/assets — cycle through them per villa
// until dedicated villa-*.webp shots are dropped in. the-valley.webp is left
// out on purpose (see app/villas/page.tsx for why).
const placeholderImages = [
  "/assets/hero.webp",
  "/assets/wellnes-yoga.webp",
  "/assets/rassa.webp",
];

const MAX_GUESTS = Math.max(...villas.map((v) => v.maxGuests));

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.round(
    (Date.parse(checkOut) - Date.parse(checkIn)) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : 0;
}

type Step = "search" | "details" | "done";
type Result = { status: "sent" | "dry-run"; bookingId?: number | null };

const inputClass =
  "w-full bg-transparent border-b border-[#2B2A27]/25 text-[#2B2A27] placeholder:text-[#2B2A27]/35 py-3 text-sm md:text-base outline-none focus:border-[#2B2A27]";
const labelClass =
  "block text-[10px] tracking-widest uppercase text-[#2B2A27]/60 mb-2";
const primaryButton =
  "self-start bg-[#B5765A] text-[#EFE7D7] px-10 py-4 tracking-widest text-xs uppercase cursor-pointer transition-colors duration-300 hover:bg-[#a3684f] disabled:opacity-50 disabled:cursor-not-allowed";

export default function ReservePage() {
  const today = new Date().toISOString().split("T")[0];

  const [step, setStep] = useState<Step>("search");
  const [villaIndex, setVillaIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [offers, setOffers] = useState<RoomOffer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const selectedVilla = villas[villaIndex];
  const nights = nightsBetween(checkIn, checkOut);
  const offerFor = (roomId: number) =>
    offers?.find((o) => o.roomId === roomId);
  const selectedOffer = offerFor(selectedVilla.roomId);

  // Pre-select the villa when arriving from a per-villa "Reserve"/"Check
  // rates" link (e.g. /reserve?villa=Pool%20View%20Villa). Read on mount via
  // window.location rather than useSearchParams so this page doesn't need
  // a Suspense boundary.
  useEffect(() => {
    const villaParam = new URLSearchParams(window.location.search).get(
      "villa",
    );
    if (!villaParam) return;
    const idx = villas.findIndex(
      (v) => v.name.toLowerCase() === villaParam.toLowerCase(),
    );
    if (idx >= 0) setVillaIndex(idx);
  }, []);

  // Changing the stay invalidates any availability already shown.
  const resetSearch = () => {
    setOffers(null);
    setError("");
  };

  const checkAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        guests: String(guests),
      });
      const res = await fetch(`/api/availability?${params}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Please try again.");
      const found: RoomOffer[] = body.offers;
      setOffers(found);
      // Keep the chosen villa if it's bookable, else move to the first one that is.
      const isOpen = (i: number) =>
        found.some((o) => o.roomId === villas[i].roomId && o.available);
      if (!isOpen(villaIndex)) {
        const first = villas.findIndex((_, i) => isOpen(i));
        if (first >= 0) setVillaIndex(first);
      }
    } catch (err) {
      setOffers(null);
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomId: selectedVilla.roomId,
          checkin: checkIn,
          checkout: checkOut,
          guests,
          firstName,
          lastName,
          email,
          phone,
          notes,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Please try again.");
      setResult(body);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
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
              Choose your dates to see live availability and pricing, then
              send us your booking request.
            </p>

            <a
              href="#book"
              className="hero-in bg-[#B5765A] text-[#EFE7D7] px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:bg-[#a3684f]"
              style={{ animationDelay: "0.7s" }}
            >
              Start booking
            </a>
          </div>
        </section>

        {/* BOOKING FLOW + SUMMARY */}
        <section
          id="book"
          className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <Reveal className="lg:col-span-3">
              {step === "search" && (
                <div className="flex flex-col gap-10">
                  <form
                    onSubmit={checkAvailability}
                    className="flex flex-col gap-10"
                  >
                    <div>
                      <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        STEP 1 OF 2 &middot; YOUR STAY
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27]">
                        Book your stay.
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="checkIn" className={labelClass}>
                          Check-in
                        </label>
                        <input
                          id="checkIn"
                          type="date"
                          required
                          min={today}
                          value={checkIn}
                          onChange={(e) => {
                            setCheckIn(e.target.value);
                            resetSearch();
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="checkOut" className={labelClass}>
                          Check-out
                        </label>
                        <input
                          id="checkOut"
                          type="date"
                          required
                          min={checkIn || today}
                          value={checkOut}
                          onChange={(e) => {
                            setCheckOut(e.target.value);
                            resetSearch();
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="guests" className={labelClass}>
                        Guests
                      </label>
                      <select
                        id="guests"
                        value={guests}
                        onChange={(e) => {
                          setGuests(Number(e.target.value));
                          resetSearch();
                        }}
                        className={`${inputClass} appearance-none`}
                      >
                        {Array.from({ length: MAX_GUESTS }, (_, n) => n + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "guest" : "guests"}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={primaryButton}
                    >
                      {loading ? "Checking…" : "Check availability"}
                    </button>
                  </form>

                  {error && (
                    <p className="text-[#B5765A] text-sm" role="alert">
                      {error}
                    </p>
                  )}

                  {offers && (
                    <div className="flex flex-col gap-4">
                      <p className="text-[#2B2A27]/60 text-[10px] tracking-widest uppercase">
                        {nights} {nights === 1 ? "night" : "nights"} &middot;{" "}
                        {guests} {guests === 1 ? "guest" : "guests"}
                      </p>

                      {villas.map((villa, i) => {
                        const offer = offerFor(villa.roomId);
                        const available = Boolean(offer?.available);
                        const tooSmall = guests > villa.maxGuests;
                        const selected = i === villaIndex;
                        return (
                          <button
                            key={villa.roomId}
                            type="button"
                            disabled={!available}
                            onClick={() => setVillaIndex(i)}
                            className={`text-left border px-6 py-5 flex justify-between items-center gap-4 transition-colors duration-300 ${
                              selected && available
                                ? "border-[#2B2A27] bg-[#D8CDB6]/40"
                                : "border-[#2B2A27]/15 hover:border-[#2B2A27]/40"
                            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#2B2A27]/15`}
                          >
                            <div>
                              <p className="font-spectral text-xl text-[#2B2A27]">
                                {villa.name}
                              </p>
                              <p className="text-xs text-[#2B2A27]/60 mt-1">
                                {available
                                  ? `${offer!.unitsAvailable} available`
                                  : tooSmall
                                    ? `Sleeps up to ${villa.maxGuests}`
                                    : "Not available for these dates"}
                              </p>
                            </div>
                            {available && offer?.price != null && (
                              <div className="text-right shrink-0">
                                <p className="text-[#2B2A27]">
                                  {idr.format(offer.price)}
                                </p>
                                <p className="text-xs text-[#2B2A27]/60">
                                  {idr.format(offer.price / nights)} / night
                                </p>
                              </div>
                            )}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={!selectedOffer?.available}
                        onClick={() => {
                          setError("");
                          setStep("details");
                        }}
                        className={`${primaryButton} mt-6`}
                      >
                        Continue with {selectedVilla.name}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === "details" && (
                <form onSubmit={requestBooking} className="flex flex-col gap-10">
                  <div>
                    <p className="text-[#2B2A27]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                      STEP 2 OF 2 &middot; YOUR DETAILS
                    </p>
                    <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27]">
                      Who&rsquo;s staying?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>
                        First name
                      </label>
                      <input
                        id="firstName"
                        required
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>
                        Last name
                      </label>
                      <input
                        id="lastName"
                        required
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 ..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className={labelClass}>
                      Special requests (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anniversary, dietary needs, late arrival..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {error && (
                    <p className="text-[#B5765A] text-sm" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={primaryButton}
                    >
                      {loading ? "Sending…" : "Request booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep("search");
                      }}
                      className="text-[#2B2A27] text-xs tracking-widest uppercase link-underline cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                  <p className="-mt-6 text-[#2B2A27]/50 text-xs font-light max-w-md">
                    No payment now. Our team confirms your booking and sends
                    payment details by email or WhatsApp.
                  </p>
                </form>
              )}

              {step === "done" && result && (
                <div className="border border-[#2B2A27]/15 px-8 py-12 md:px-12 md:py-16">
                  {result.status === "sent" ? (
                    <>
                      <p className="text-[#B5765A] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        REQUEST RECEIVED
                        {result.bookingId ? ` · REF ${result.bookingId}` : ""}
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27] mb-6">
                        Thank you, {firstName}.
                      </h2>
                      <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-md">
                        Your request for {selectedVilla.name} is with our
                        team. We&rsquo;ll confirm and send payment details to{" "}
                        <span className="text-[#2B2A27]">{email}</span>.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[#B5765A] text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        TEST MODE
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-[#2B2A27] mb-6">
                        Booking not sent.
                      </h2>
                      <p className="text-[#2B2A27]/70 font-light text-sm md:text-base leading-relaxed max-w-md">
                        Availability and price were checked live, but this
                        website can&rsquo;t create bookings yet, so nothing
                        was sent to Beds24. To book now, please contact us
                        on WhatsApp.
                      </p>
                    </>
                  )}
                </div>
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
                    Villa Type 0{villaIndex + 1}
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
                    {selectedOffer?.available && selectedOffer.price != null && (
                      <div className="flex justify-between text-sm border-t border-[#2B2A27]/10 pt-3 mt-1">
                        <span className="text-[#2B2A27]/60">Total</span>
                        <span className="text-[#2B2A27] font-medium">
                          {idr.format(selectedOffer.price)}
                        </span>
                      </div>
                    )}
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

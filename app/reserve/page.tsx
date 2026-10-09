"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { PAYMENT, villas, villaFeatures } from "@/lib/data";
import type { RoomOffer } from "@/lib/beds24";
import { IconPhone, IconInstagram, IconWhatsApp } from "@/components/Icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/seo";

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
type Checkout = {
  token: string;
  orderId: string;
  amount: number;
  testMode: boolean;
  clientKey: string;
  snapJs: string;
};
type PaymentResult = {
  state: "paid" | "pending" | "failed" | "unknown";
  bookingId: number | null;
  testMode: boolean;
};

type SnapCallbacks = {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
};
declare global {
  interface Window {
    snap?: { pay: (token: string, callbacks: SnapCallbacks) => void };
  }
}

// Load Midtrans' Snap script once, on demand.
function loadSnap(src: string, clientKey: string): Promise<void> {
  if (window.snap) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.dataset.clientKey = clientKey;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Couldn't load the payment window."));
    document.head.appendChild(script);
  });
}

// Midtrans order ids made by /api/checkout.
const ORDER_ID = /^TISS-(\d+|TEST)-[a-z0-9]+$/;

const inputClass =
  "w-full bg-transparent border-b border-tiss-charcoal/25 text-tiss-charcoal placeholder:text-tiss-charcoal/35 py-3 text-sm md:text-base outline-none focus:border-tiss-charcoal";
const labelClass =
  "block text-[10px] tracking-widest uppercase text-tiss-charcoal/60 mb-2";
const primaryButton =
  "self-start bg-tiss-clay text-tiss-oat px-10 py-4 tracking-widest text-xs uppercase cursor-pointer transition duration-300 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed";

export default function ReservePage() {
  const today = new Date().toISOString().split("T")[0];

  const [villaIndex, setVillaIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [step, setStep] = useState<Step>("search");
  const [offers, setOffers] = useState<RoomOffer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const selectedVilla = villas[villaIndex];
  const nights = nightsBetween(checkIn, checkOut);
  const offerFor = (roomId: number) =>
    offers?.find((o) => o.roomId === roomId);
  const selectedOffer = offerFor(selectedVilla.roomId);
  const amountDue =
    selectedOffer?.price != null
      ? Math.round((selectedOffer.price * PAYMENT.percent) / 100)
      : null;

  // Booking is finished on WhatsApp for now: open a chat with the stay
  // already written out.
  const whatsappLink = `${BUSINESS.whatsapp}?text=${encodeURIComponent(
    [
      "Hi TISS Valley, I'd like to book:",
      `Villa: ${selectedVilla.name}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut} (${nights} ${nights === 1 ? "night" : "nights"})`,
      `Guests: ${guests}`,
      selectedOffer?.price != null
        ? `Price shown: ${idr.format(selectedOffer.price)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )}`;

  const showResult = async (orderId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/checkout/status?${new URLSearchParams({ orderId })}`,
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Please refresh in a moment.");
      setResult(body);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please refresh in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-select the villa when arriving from a per-villa "Reserve"/"Check
  // rates" link (e.g. /reserve?villa=Pool%20View%20Villa). Read on mount via
  // window.location rather than useSearchParams so this page doesn't need
  // a Suspense boundary.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Back from a Midtrans redirect (e.g. e-wallet app): show the result.
    const returnedOrder = params.get("order_id");
    if (returnedOrder && ORDER_ID.test(returnedOrder)) {
      void showResult(returnedOrder);
      document.getElementById("book")?.scrollIntoView();
      return;
    }
    const villaParam = params.get("villa");
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

  const openPayment = async (c: Checkout) => {
    await loadSnap(c.snapJs, c.clientKey);
    window.snap!.pay(c.token, {
      onSuccess: () => void showResult(c.orderId),
      onPending: () => void showResult(c.orderId),
      onError: () => void showResult(c.orderId),
      onClose: () =>
        setError(
          "The payment window was closed before paying. Your villa is held for a short while — resume below.",
        ),
    });
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
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
      setCheckout(body);
      await openPayment(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        {/* HERO — compact, this is a functional page rather than a full-screen moment */}
        <section className="relative px-6 md:px-12 lg:px-20 pt-40 md:pt-48 pb-24 md:pb-32 flex items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/tiss-hero.webp"
              alt="A pool villa set into the highland rice terraces"
              className="w-full h-full object-cover hero-image -scale-x-100"
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-tiss-charcoal/85">
              <span className="sr-only">dark backdrop</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="hero-in inline-flex items-center border py-2 px-4 rounded-full gap-3 border-tiss-oat/40 mb-8"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-tiss-sand text-[10px] sm:text-xs tracking-widest uppercase">
                SIX VILLAS &middot; ONE QUIET VALLEY
              </span>
            </div>

            <h1
              className="hero-in font-spectral text-tiss-oat text-5xl sm:text-6xl md:text-7xl mb-6"
              style={{ animationDelay: "0.3s" }}
            >
              Reserve Your Stay
            </h1>

            <p
              className="hero-in text-tiss-sand font-light max-w-lg text-sm md:text-base leading-relaxed mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              Choose your dates to see live availability and pricing, then
              book and pay securely online.
            </p>

            <a
              href="#book"
              className="hero-in bg-tiss-clay text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition duration-300 hover:brightness-90"
              style={{ animationDelay: "0.7s" }}
            >
              Start booking
            </a>
          </div>
        </section>

        {/* BOOKING FLOW + SUMMARY */}
        <section
          id="book"
          className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24"
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
                      <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        YOUR STAY
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-tiss-charcoal">
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
                    <p className="text-tiss-clay text-sm" role="alert">
                      {error}{" "}
                      <a
                        href={BUSINESS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Open WhatsApp
                      </a>
                    </p>
                  )}

                  {offers && (
                    <div className="flex flex-col gap-4">
                      <p className="text-tiss-charcoal/60 text-[10px] tracking-widest uppercase">
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
                                ? "border-tiss-charcoal bg-tiss-sand/40"
                                : "border-tiss-charcoal/15 hover:border-tiss-charcoal/40"
                            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-tiss-charcoal/15`}
                          >
                            <div>
                              <p className="font-spectral text-xl text-tiss-charcoal">
                                {villa.name}
                              </p>
                              <p className="text-xs text-tiss-charcoal/60 mt-1">
                                {available
                                  ? `${offer!.unitsAvailable} available`
                                  : tooSmall
                                    ? `Sleeps up to ${villa.maxGuests}`
                                    : "Not available for these dates"}
                              </p>
                            </div>
                            {available && offer?.price != null && (
                              <div className="text-right shrink-0">
                                <p className="text-tiss-charcoal">
                                  {idr.format(offer.price)}
                                </p>
                                <p className="text-xs text-tiss-charcoal/60">
                                  {idr.format(offer.price / nights)} / night
                                </p>
                              </div>
                            )}
                          </button>
                        );
                      })}

                      {selectedOffer?.available && (
                        <div className="flex flex-wrap items-center gap-6 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setStep("details");
                            }}
                            className={primaryButton}
                          >
                            Continue with {selectedVilla.name}
                          </button>
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-tiss-charcoal text-xs tracking-widest uppercase link-underline"
                          >
                            <IconWhatsApp className="size-4" />
                            Or book via WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === "details" && (
                <form onSubmit={pay} className="flex flex-col gap-10">
                  <div>
                    <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                      YOUR DETAILS
                    </p>
                    <h2 className="font-spectral text-3xl md:text-4xl text-tiss-charcoal">
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
                        required
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
                    <p className="text-tiss-clay text-sm" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6">
                    {checkout ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setError("");
                          void openPayment(checkout);
                        }}
                        className={primaryButton}
                      >
                        Resume payment
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className={primaryButton}
                      >
                        {loading
                          ? "Opening payment…"
                          : amountDue != null
                            ? `Pay ${idr.format(amountDue)}`
                            : "Pay now"}
                      </button>
                    )}
                    {!checkout && (
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setStep("search");
                        }}
                        className="text-tiss-charcoal text-xs tracking-widest uppercase link-underline cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                  </div>
                  <p className="-mt-6 text-tiss-charcoal/50 text-xs font-light max-w-md">
                    {PAYMENT.percent < 100
                      ? `You pay a ${PAYMENT.percent}% deposit now; the rest is settled with our team. `
                      : ""}
                    Secure payment by Midtrans: QRIS, bank transfer, e-wallet or
                    card. Your villa is held for {PAYMENT.expiryMinutes} minutes
                    while you pay.
                  </p>
                </form>
              )}

              {step === "done" && result && (
                <div className="border border-tiss-charcoal/15 px-8 py-12 md:px-12 md:py-16">
                  {result.state === "paid" && (
                    <>
                      <p className="text-tiss-clay text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        PAYMENT RECEIVED
                        {result.bookingId ? ` · BOOKING ${result.bookingId}` : ""}
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-tiss-charcoal mb-6">
                        You&rsquo;re booked{firstName ? `, ${firstName}` : ""}.
                      </h2>
                      <p className="text-tiss-charcoal/70 font-light text-sm md:text-base leading-relaxed max-w-md">
                        Thank you. A confirmation is on its way to your email.
                        We look forward to welcoming you to the valley.
                      </p>
                    </>
                  )}
                  {result.state === "pending" && (
                    <>
                      <p className="text-tiss-clay text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        WAITING FOR PAYMENT
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-tiss-charcoal mb-6">
                        Almost there.
                      </h2>
                      <p className="text-tiss-charcoal/70 font-light text-sm md:text-base leading-relaxed max-w-md mb-8">
                        Complete the payment using the instructions from
                        Midtrans within {PAYMENT.expiryMinutes} minutes. Your
                        booking is confirmed by email as soon as it arrives.
                      </p>
                      {checkout && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => void showResult(checkout.orderId)}
                          className={primaryButton}
                        >
                          {loading ? "Checking…" : "I've paid — check again"}
                        </button>
                      )}
                    </>
                  )}
                  {(result.state === "failed" || result.state === "unknown") && (
                    <>
                      <p className="text-tiss-clay text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                        PAYMENT NOT COMPLETED
                      </p>
                      <h2 className="font-spectral text-3xl md:text-4xl text-tiss-charcoal mb-6">
                        The payment didn&rsquo;t go through.
                      </h2>
                      <p className="text-tiss-charcoal/70 font-light text-sm md:text-base leading-relaxed max-w-md mb-8">
                        Nothing was charged. You can try again, or message us
                        on WhatsApp and we&rsquo;ll help you book.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCheckout(null);
                          setResult(null);
                          setOffers(null);
                          setStep("search");
                        }}
                        className={primaryButton}
                      >
                        Start again
                      </button>
                    </>
                  )}
                  {result.testMode && (
                    <p className="mt-10 border-t border-tiss-charcoal/10 pt-6 text-tiss-charcoal/50 text-xs">
                      Test mode: this payment ran in Midtrans, but no booking
                      was created in Beds24.
                    </p>
                  )}
                  {error && (
                    <p className="mt-6 text-tiss-clay text-sm" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              )}

            </Reveal>

            {/* SUMMARY */}
            <Reveal delay={150} className="lg:col-span-2">
              <div className="border border-tiss-charcoal/15">
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    fill
                    src={selectedVilla.src}
                    alt={`${selectedVilla.name} at TISS Valley, Sebatu`}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <p className="text-tiss-clay text-[10px] tracking-widest mb-3 uppercase">
                    Villa Type 0{villaIndex + 1}
                  </p>
                  <h3 className="text-tiss-charcoal font-spectral text-2xl mb-3">
                    {selectedVilla.name}
                  </h3>
                  <p className="text-tiss-charcoal/70 text-sm font-light leading-relaxed mb-6">
                    {selectedVilla.caption}
                  </p>

                  <div className="flex flex-col gap-3 border-t border-tiss-charcoal/10 pt-6 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-tiss-charcoal/60">Check-in</span>
                      <span className="text-tiss-charcoal">
                        {checkIn || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tiss-charcoal/60">Check-out</span>
                      <span className="text-tiss-charcoal">
                        {checkOut || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tiss-charcoal/60">Nights</span>
                      <span className="text-tiss-charcoal">
                        {nights > 0 ? nights : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tiss-charcoal/60">Guests</span>
                      <span className="text-tiss-charcoal">{guests}</span>
                    </div>
                    {selectedOffer?.available && selectedOffer.price != null && (
                      <div className="flex justify-between text-sm border-t border-tiss-charcoal/10 pt-3 mt-1">
                        <span className="text-tiss-charcoal/60">Total</span>
                        <span className="text-tiss-charcoal font-medium">
                          {idr.format(selectedOffer.price)}
                        </span>
                      </div>
                    )}
                    {PAYMENT.percent < 100 && amountDue != null && (
                      <div className="flex justify-between text-sm">
                        <span className="text-tiss-charcoal/60">
                          Due now ({PAYMENT.percent}%)
                        </span>
                        <span className="text-tiss-charcoal font-medium">
                          {idr.format(amountDue)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-tiss-charcoal/10 pt-6">
                    {villaFeatures.map((feature) => (
                      <div
                        key={feature.text}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={feature.icon}
                          alt=""
                          width={16}
                          height={16}
                          className="size-4 object-contain shrink-0"
                        />
                        <span className="text-tiss-charcoal/70 text-xs font-light">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 px-2">
                <p className="text-tiss-charcoal/60 text-[10px] tracking-widest mb-4 uppercase">
                  Prefer to talk it through?
                </p>
                <div className="flex items-center gap-5 text-tiss-charcoal/70">
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

      <Footer />
    </>
  );
}

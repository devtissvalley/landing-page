"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  statsData,
  brandEssences,
  villas,
  villaFeatures,
  wellnessFeatures,
  experienceData,
  distances,
} from "@/lib/data";
import { Fragment } from "react/jsx-runtime";

export default function Home() {
  const router = useRouter();
  const openRassa = () => router.push("/rassa");

  return (
    <>
      <Navbar onOpenRassa={openRassa} />

      <main>
        <section className="relative h-screen w-full px-6 md:px-12 lg:px-20">
          <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/hero-section.webp"
              alt="hero-image"
              className="w-full h-full object-cover hero-image -scale-x-100"
              priority
            />
            <div className="w-full h-screen bg-black/70 absolute top-0 left-0">
              <span className="sr-only">black backdrop</span>
            </div>
          </div>

          <div className="h-screen flex flex-col justify-center items-start pt-28 md:pt-32 lg:pt-0">
            <div
              className="hero-in items-center border py-3 px-5 rounded-full gap-3 border-tiss-oat/50 inline-flex mb-6"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative">
                <span className="bg-tiss-clay size-3 rounded-full block absolute inset-0"></span>
                <span className="bg-tiss-clay size-3 rounded-full block animate-ping"></span>
              </div>
              <span className="text-tiss-sand text-xs sm:text-sm md:text-base">
                LUXURY WELLNESS RETREAT &middot; SEBATU, BALI
              </span>
            </div>
            <div className="flex flex-col gap-y-6">
              <h1 className="text-tiss-oat text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-spectral">
                <span
                  className="hero-in block"
                  style={{ animationDelay: "0.3s" }}
                >
                  Stay in the
                </span>
                <span
                  className="hero-in block"
                  style={{ animationDelay: "0.5s" }}
                >
                  rhythm of comfort.
                </span>
              </h1>
              <p
                className="hero-in text-tiss-sand w-full max-w-lg"
                style={{ animationDelay: "0.7s" }}
              >
                Six pool villas set into the highland rice terraces above Ubud —
                each with its own plunge pool, its own valley view, and room to
                disappear.
              </p>
              <div
                className="hero-in mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                style={{ animationDelay: "0.9s" }}
              >
                <Link
                  href="/reserve"
                  className="bg-tiss-clay py-5 px-5 text-tiss-oat transition-colors duration-300 hover:brightness-90"
                >
                  <span className="tracking-widest">RESERVE YOUR STAY</span>
                </Link>
                <Link
                  href="/villas"
                  className="py-5 text-tiss-oat relative group"
                >
                  <span className="tracking-widest">VIEW THE VILLAS</span>
                  <span className="absolute w-full bg-tiss-oat block h-px bottom-3 transition-transform duration-300 group-hover:scale-x-110"></span>
                </Link>
              </div>
            </div>
          </div>

          <div
            className="hero-in hidden sm:flex absolute right-6 md:right-12 lg:right-20 bottom-10 md:bottom-14 flex-col items-center gap-3 text-tiss-oat/60"
            style={{ animationDelay: "1.1s" }}
          >
            <span className="w-px h-14 bg-tiss-oat/40" />
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
            >
              Scroll
            </span>
          </div>
        </section>

        <section className="bg-tiss-charcoal px-6 md:px-12 lg:px-20 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-tiss-oat/10 text-center">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center px-4 lg:px-8 py-4 lg:py-0"
              >
                <Image
                  className="size-7 md:size-8 object-contain mb-3"
                  src={stat.icon as string}
                  alt={`${stat.subtitle} icon`}
                  width={50}
                  height={50}
                />
                <h2 className="text-tiss-oat font-spectral text-2xl md:text-3xl mb-1">
                  {stat.value}
                </h2>
                <h3 className="text-tiss-sage text-[10px] tracking-widest uppercase mb-2">
                  {stat.subtitle}
                </h3>
                <p className="text-tiss-sand/70 text-center text-xs md:text-sm font-light leading-relaxed max-w-55">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-tiss-oat w-full px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20">
          {/* Header / Judul Utama */}
          <Reveal className="text-center font-spectral mb-16 md:mb-24">
            <p className="text-tiss-charcoal/50 text-sm tracking-widest mb-4 uppercase">
              THE VALLEY
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-tiss-charcoal max-w-3xl mx-auto leading-tight">
              Cool Air, Quiet Slopes, and Room to Disappear.
            </h2>
          </Reveal>

          {/* Layout Utama: Jarak kiri-kanan sudah mengikuti wrapper bawaan section */}
          <div className="w-full flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-20">
            {/* AREA TEKS (Kiri) */}
            <Reveal className="w-full md:w-1/2 text-tiss-charcoal flex flex-col">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-spectral font-medium mb-10 lg:mb-14 leading-tight">
                A Quiet Highland Retreat Above Sebatu
              </h3>

              <div className="flex flex-col gap-y-10 lg:gap-y-12">
                <div>
                  <h4 className="text-tiss-charcoal/50 text-[10px] sm:text-xs tracking-widest uppercase mb-3">
                    WHERE
                  </h4>
                  <p className="font-light text-base lg:text-lg text-tiss-charcoal/90 leading-relaxed">
                    A terraced highland above Sebatu, twenty minutes north of
                    central Ubud.
                  </p>
                </div>
                <div>
                  <h4 className="text-tiss-charcoal/50 text-[10px] sm:text-xs tracking-widest uppercase mb-3">
                    WHAT
                  </h4>
                  <p className="font-light text-base lg:text-lg text-tiss-charcoal/90 leading-relaxed">
                    Six one-bedroom villas, each with a private pool, set
                    quietly into the landscape.
                  </p>
                </div>
                <div>
                  <h4 className="text-tiss-charcoal/50 text-[10px] sm:text-xs tracking-widest uppercase mb-3">
                    THE IDEA
                  </h4>
                  <p className="font-light text-base lg:text-lg text-tiss-charcoal/90 leading-relaxed">
                    Premium, not lavish. Considered, not loud. A place for
                    stillness, privacy, and unhurried days.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#"
                    className="inline-flex items-center text-tiss-charcoal text-xs tracking-widest uppercase relative group w-max pb-2"
                  >
                    <span className="tracking-widest">SEE THE VALLEY</span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-tiss-charcoal/20"></span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-tiss-charcoal scale-x-0 origin-left transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="w-full md:w-1/2 relative h-[60vw] sm:h-100 md:h-125 lg:h-175 overflow-hidden group"
            >
              <Image
                fill
                src="/assets/the-valley.webp"
                alt="Rice terraces above Sebatu at first light"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-2000 ease-out group-hover:scale-105"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-tiss-forest px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal>
            <p className="text-tiss-sage text-sm tracking-widest mb-4">
              BRAND ESSENCE
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl lg:text-7xl text-tiss-oat">
              Adem.
            </h2>
            <p className="text-tiss-sand/70 mt-4 tracking-widest text-sm">
              COOL &middot; STILL &middot; UNHURRIED
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 mt-16 md:mt-24 border-y border-tiss-oat/20 divide-y lg:divide-y-0 lg:divide-x divide-tiss-oat/20 text-left">
            {brandEssences.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <Reveal delay={idx * 100}>
                  <div className="py-12 lg:py-16 px-6 lg:px-10 h-full flex flex-col">
                    <span className="text-tiss-clay text-xs tracking-widest mb-6 block">
                      0{idx + 1}
                    </span>
                    <h3 className="text-tiss-oat font-spectral text-2xl mb-4">
                      {item.title}
                    </h3>
                    <p className="text-tiss-sand/70 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 pt-16 md:pt-20 lg:pt-24 pb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20 mb-20 md:mb-32">
            {/* KIRI: Area Judul */}
            <Reveal className="w-full lg:w-5/12 lg:sticky top-32">
              <div className="inline-flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-tiss-clay"></span>
                <p className="text-tiss-charcoal/60 text-[10px] sm:text-xs tracking-widest uppercase">
                  THE VILLAS
                </p>
              </div>
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-7xl text-tiss-charcoal leading-[1.1]">
                Three, ways <br className="hidden lg:block" /> to stay.
              </h2>
            </Reveal>

            <div className="w-full lg:w-7/12 flex flex-col">
              <Reveal delay={100} className="mb-12 md:mb-16">
                <p className="text-tiss-charcoal/90 font-light text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl">
                  Three distinct ways to experience the highlands. While the
                  spaces vary in design, every villa offers the exact same
                  luxury: your own pool, your own bedroom, and an open view of
                  the quiet valley. A place for stillness.
                </p>
              </Reveal>

              {/* Area Fitur */}
              <Reveal delay={150}>
                <p className="text-tiss-charcoal/40 text-[10px] tracking-widest uppercase mb-6">
                  VILLA ESSENTIALS
                </p>
                <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-between items-start gap-y-10 gap-x-6 border-t border-tiss-charcoal/15 pt-8 w-full">
                  {villaFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start gap-3 group"
                    >
                      <Image
                        src={feature.icon}
                        alt="Icon"
                        width={24}
                        height={24}
                        className="size-6 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <span className="text-tiss-charcoal/80 text-sm font-light lg:whitespace-nowrap">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-col gap-16 md:gap-32 relative">
            {villas.map((villa, i) => (
              <div
                key={villa.name}
                style={{ "--idx": i } as React.CSSProperties}
                className="sticky w-full bg-tiss-oat border-t border-tiss-charcoal/20 overflow-hidden flex flex-col md:flex-row items-stretch shadow-none
                         h-auto md:h-[min(80vh,800px)] 
                         top-[calc(1.5rem+var(--idx)*0.75rem)] md:top-[calc(2rem+var(--idx)*1.5rem)]"
              >
                <div className="w-full md:w-5/12 flex flex-col justify-center order-2 md:order-1 px-6 py-10 md:p-16 lg:p-24 border-r border-transparent md:border-tiss-charcoal/10 bg-tiss-oat z-10">
                  <Reveal>
                    <div className="flex flex-col h-full justify-center">
                      <p className="text-tiss-clay text-[10px] sm:text-xs tracking-widest mb-4 md:mb-6 uppercase">
                        Villa 0{i + 1}
                      </p>

                      <h3 className="text-tiss-charcoal font-spectral text-4xl md:text-5xl lg:text-[4rem] leading-none mb-6 md:mb-8">
                        {villa.name}
                      </h3>

                      <p className="text-tiss-charcoal/70 text-sm md:text-base font-light leading-relaxed max-w-sm mb-10 md:mb-12">
                        {villa.caption}
                      </p>

                      <Link
                        href="/villas"
                        className="inline-flex items-center text-tiss-charcoal text-xs tracking-widest uppercase relative group w-max pb-2"
                      >
                        <span className="tracking-widest">DISCOVER MORE</span>
                        <span className="absolute left-0 bottom-0 w-full h-px bg-tiss-charcoal/20"></span>
                        <span className="absolute left-0 bottom-0 w-full h-px bg-tiss-charcoal scale-x-0 origin-left transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                      </Link>
                    </div>
                  </Reveal>
                </div>

                <div className="w-full md:w-7/12 order-1 md:order-2 relative h-[45vh] md:h-full overflow-hidden bg-tiss-charcoal/5">
                  <Reveal className="w-full h-full">
                    <Image
                      fill
                      src={villa.src}
                      alt={villa.name}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-tiss-sand px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal className="flex flex-col">
              <p className="text-tiss-charcoal/50 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                WELLNESS
              </p>
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-[3.5rem] leading-tight text-tiss-charcoal mb-8">
                A retreat, not just a stay.
              </h2>

              <div className="flex flex-col border-t border-tiss-forest/15 mt-2">
                {wellnessFeatures.map(({ icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="flex gap-5 md:gap-6 py-6 border-b border-tiss-forest/15"
                  >
                    <div className="bg-tiss-oat size-14 md:size-16 rounded-full flex items-center justify-center shrink-0">
                      <Image
                        src={icon}
                        alt={title}
                        width={24}
                        height={24}
                        className="size-5 md:size-6 object-contain"
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="font-medium text-lg md:text-xl text-tiss-charcoal font-spectral mb-2">
                        {title}
                      </h3>
                      <p className="font-light text-sm md:text-base text-tiss-charcoal/70 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-[60vw] sm:h-100 md:h-125 lg:h-150 overflow-hidden rounded-sm"
            >
              <Image
                fill
                src="/assets/wellnes-yoga.webp"
                alt="Morning yoga session on a deck facing the valley"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-tiss-charcoal flex flex-col md:flex-row w-full items-stretch">
          <div className="w-full md:w-1/2 px-6 md:px-12 lg:pl-20 lg:pr-16 py-16 md:py-20 lg:py-24 flex flex-col justify-center">
            <Reveal>
              <div className="inline-flex items-center border py-2 px-4 rounded-full gap-3 border-tiss-oat/30 mb-8">
                <span className="bg-tiss-clay size-1.5 rounded-full block"></span>
                <span className="text-tiss-sand text-[10px] sm:text-xs tracking-widest uppercase">
                  IN PROGRESS &middot; OPENING SOON
                </span>
              </div>

              <h2 className="font-spectral text-5xl md:text-6xl lg:text-7xl text-tiss-oat mb-4">
                Rassa
              </h2>

              <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-10 uppercase">
                THE RESTAURANT AT TISS VALLEY
              </p>

              <p className="text-tiss-sand font-light max-w-md mb-12 text-sm md:text-base leading-relaxed">
                Rassa sits at the front of the property, open to villa guests
                and visitors alike. The concept: a plant-based table built
                around what the valley itself grows — still finding its final
                name, menu and identity.
              </p>

              <div className="flex flex-wrap gap-8 md:gap-14 mb-14">
                <div>
                  <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    CONCEPT
                  </p>
                  <p className="text-tiss-oat font-spectral text-lg md:text-xl">
                    Plant-based
                  </p>
                </div>
                <div>
                  <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    ACCESS
                  </p>
                  <p className="text-tiss-oat font-spectral text-lg md:text-xl">
                    Guests &amp; public
                  </p>
                </div>
                <div>
                  <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    LOCATION
                  </p>
                  <p className="text-tiss-oat font-spectral text-lg md:text-xl">
                    Front of valley
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="bg-tiss-clay text-tiss-oat px-8 py-3 md:px-10 md:py-4 tracking-widest text-xs uppercase cursor-pointer transition-colors duration-300 hover:brightness-90"
              >
                ABOUT RASSA
              </button>
            </Reveal>
          </div>

          <div className="w-full md:w-1/2 relative min-h-100 md:min-h-full">
            <Reveal
              delay={150}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <Image
                fill
                src="/assets/rassa.webp"
                alt="Plant-based dishes being prepared at Rassa"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="mb-12 md:mb-16 text-left">
            <p className="text-tiss-forest/60 text-[10px] sm:text-xs tracking-widest mb-3 uppercase">
              THE EXPERIENCE
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl text-tiss-forest">
              Care without fuss.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 lg:gap-4">
            {experienceData.map(({ icon, label }, i) => (
              <Reveal
                key={label}
                delay={i * 70}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="size-16 md:size-18 rounded-full bg-tiss-sand flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <Image
                    src={icon}
                    alt={label}
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

        <section className="bg-tiss-forest px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal variant="scale">
            <p className="text-tiss-oat/30 font-spectral text-3xl md:text-4xl lg:text-6xl mb-4">
              &ldquo;
            </p>
            <p className="font-spectral italic text-xl md:text-2xl lg:text-3xl text-tiss-oat max-w-2xl mx-auto">
              Where luxury performs, TISS stays restrained.
            </p>
          </Reveal>
        </section>

        <section className="bg-tiss-oat px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          {/* UBAH DISINI: Ganti items-center menjadi items-stretch */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-stretch">
            {/* Tambahkan class flex agar teksnya bisa berada di tengah secara vertikal */}
            <Reveal className="flex flex-col justify-center py-4 lg:py-8">
              <p className="text-tiss-forest/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                LOCATION
              </p>
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-[3.5rem] leading-tight text-tiss-forest mb-8">
                Above the terraces,
                <br className="hidden md:block" />
                within reach of
                <br className="hidden md:block" />
                everything.
              </h2>
              <p className="text-tiss-forest/70 font-light mb-12 max-w-md text-sm md:text-base leading-relaxed">
                Set in Sebatu, above the Tegallalang rice terraces — close
                enough to Ubud for a morning in town, far enough for the noise
                to stay behind you.
              </p>

              <div className="flex flex-col border-t border-tiss-forest/15">
                {distances.map((d) => (
                  <div
                    key={d.place}
                    className="flex justify-between items-center py-5 text-tiss-forest border-b border-tiss-forest/15"
                  >
                    <span className="font-light text-sm md:text-base">
                      {d.place}
                    </span>
                    <span className="font-light text-sm md:text-base text-tiss-forest/60">
                      {d.time}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={150}
              className="relative w-full h-100 md:h-125 lg:h-full overflow-hidden"
            >
              <Image
                fill
                src="/assets/the-valley.webp"
                alt="Misty rice terraces surrounding the valley"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-tiss-clay px-6 md:px-12 lg:px-20 py-20 md:py-24 lg:py-32 text-center flex flex-col items-center">
          <Reveal className="flex flex-col items-center w-full">
            <p className="text-tiss-oat/70 text-[10px] sm:text-xs tracking-widest uppercase mb-6 md:mb-8">
              RESERVE
            </p>

            <h2 className="font-spectral text-4xl md:text-5xl lg:text-[4rem] text-tiss-oat mb-6 leading-tight">
              Six villas. <br className="hidden md:block" />
              One quiet valley.
            </h2>

            <p className="text-tiss-oat/90 font-light text-sm md:text-base max-w-xl mb-12 leading-relaxed">
              Availability is limited by design — enquire directly and
              we&apos;ll hold your dates while you decide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
              <Link
                href="/reserve"
                className="inline-block bg-tiss-forest text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:brightness-110"
              >
                CHECK AVAILABILITY
              </Link>

              <a
                href="#"
                className="inline-block text-tiss-oat text-xs tracking-widest uppercase border-b border-tiss-oat/40 pb-1 transition-colors duration-300 hover:border-tiss-oat"
              >
                EMAIL THE VILLA
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer onOpenRassa={openRassa} />
    </>
  );
}

"use client";

import Image from "next/image";
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

export default function Home() {
  return (
    <>
      <Navbar onOpenRassa={() => console.log("test")} />

      <main>
        <section className="relative h-screen w-full px-6 md:px-12 lg:px-20">
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src="/assets/hero.webp"
              alt="hero-image"
              className="w-full h-full object-cover hero-image"
              loading="eager"
            />
            <div className="w-full h-screen bg-black/70 absolute top-0">
              <span className="sr-only">black backdrop</span>
            </div>
          </div>
          <div className="h-screen flex flex-col justify-center items-start">
            <div
              className="hero-in items-center border py-3 px-5 rounded-full gap-3 border-[#EFE7D7]/47 inline-flex mb-6"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative">
                <span className="bg-[#B5765A] size-3 rounded-full block absolute inset-0"></span>
                <span className="bg-[#B5765A] size-3 rounded-full block animate-ping"></span>
              </div>
              <span className="text-[#D8CDB6] text-xs sm:text-sm md:text-base">
                LUXURY WELLNESS RETREAT &middot; SEBATU, BALI
              </span>
            </div>
            <div className="flex flex-col gap-y-6">
              <h1 className="text-[#EFE7D7] text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-spectral">
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
                className="hero-in text-[#D8CDB6] w-full max-w-lg"
                style={{ animationDelay: "0.7s" }}
              >
                Six pool villas set into the highland rice terraces above Ubud
                each with its own plunge pool, its own valley view, and room to
                disappear.
              </p>
              <div
                className="hero-in mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                style={{ animationDelay: "0.9s" }}
              >
                <a
                  href="#"
                  className="bg-[#B5765A] py-5 px-5 text-[#EFE7D7] transition-colors duration-300 hover:bg-[#a3684f]"
                >
                  <span className="tracking-widest">RESERVE YOUR STAY</span>
                </a>
                <a href="#" className="py-5 text-[#EFE7D7] relative group">
                  <span className="tracking-widest">VIEW THE VILLAS</span>
                  <span className="absolute w-full bg-[#EFE7D7] block h-px bottom-3 transition-transform duration-300 group-hover:scale-x-110"></span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-[#EFE7D7]/10 text-center">
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
                <h2 className="text-[#EFE7D7] font-spectral text-2xl md:text-3xl mb-1">
                  {stat.value}
                </h2>
                <h3 className="text-[#7E927F] text-[10px] tracking-widest uppercase mb-2">
                  {stat.subtitle}
                </h3>
                <p className="text-[#D8CDB6]/70 text-center text-xs md:text-sm font-light leading-relaxed max-w-[220px]">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#EFE7D7] w-full px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20">
          <div>
            <Reveal className="text-center font-spectral my-10">
              <h2 className="text-2xl">THE VALLEY</h2>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium">
                Cool Air, Quiet Slopes, and Room to Disappear.
              </h1>
            </Reveal>
            <div className="w-full flex flex-col md:flex-row items-center gap-10">
              <Reveal className="w-full md:w-1/2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-spectral font-medium mb-10">
                  A Quiet Highland Retreat Above Sebatu
                </h1>
                <div className="flex flex-col gap-y-10">
                  <div>
                    <h2 className="font-bold text-base">WHERE</h2>
                    <p className="font-light text-base">
                      A terraced highland above Sebatu, twenty minutes north of
                      central Ubud.
                    </p>
                  </div>
                  <div>
                    <h2 className="font-bold text-base">WHAT</h2>
                    <p className="font-light text-base">
                      Six one-bedroom villas, each with a private pool, set
                      quietly into the landscape.
                    </p>
                  </div>
                  <div>
                    <h2 className="font-bold text-base">THE IDEA</h2>
                    <p className="font-light text-base">
                      Premium, not lavish. Considered, not loud. A place for
                      stillness, privacy, and unhurried days.
                    </p>
                  </div>
                  <div>
                    <a href="#" className="tracking-widest link-underline">
                      SEE THE VALLEY
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal
                delay={150}
                className="w-full md:max-w-1/2 h-full max-h-72 md:max-h-200 overflow-hidden"
              >
                <Image
                  width={1000}
                  height={1000}
                  src="/assets/the-valley.webp"
                  alt="Rice terraces above Sebatu at first light"
                  className="w-full h-screen bg-cover object-cover"
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#1F2A22] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal>
            <p className="text-[#7E927F] text-sm tracking-widest mb-4">
              BRAND ESSENCE
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl lg:text-7xl text-[#EFE7D7]">
              Adem.
            </h2>
            <p className="text-[#D8CDB6]/70 mt-4 tracking-widest text-sm">
              COOL &middot; STILL &middot; UNHURRIED
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 mt-16 md:mt-24 border-y border-[#EFE7D7]/20 divide-y lg:divide-y-0 lg:divide-x divide-[#EFE7D7]/20 text-left">
            {brandEssences.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <Reveal delay={idx * 100}>
                  <div className="py-12 lg:py-16 px-6 lg:px-10 h-full flex flex-col">
                    <span className="text-[#B5765A] text-xs tracking-widest mb-6 block">
                      0{idx + 1}
                    </span>
                    <h3 className="text-[#EFE7D7] font-spectral text-2xl mb-4">
                      {item.title}
                    </h3>
                    <p className="text-[#D8CDB6]/70 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* TODO: STACK PERLU TAK PERBAIKI */}
        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[#2B2A27]/50 text-sm tracking-widest mb-3 uppercase">
                THE VILLAS
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#2B2A27]">
                Six, and only six.
              </h2>
            </div>
            <p className="max-w-xs text-[#2B2A27]/70 font-light md:text-right">
              One bedroom, one private pool, one uninterrupted valley view — in
              every villa, without exception.
            </p>
          </Reveal>

          <Reveal
            delay={100}
            className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-[#2B2A27]/10 pb-10 mb-10 md:mb-16"
          >
            {villaFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[#2B2A27]/70 text-sm"
              >
                <Image
                  src={feature.icon}
                  alt="Icon"
                  width={20}
                  height={20}
                  className="size-5 object-contain"
                />
                {feature.text}
              </div>
            ))}
          </Reveal>

          <div className="flex flex-col gap-12 md:gap-24 relative pb-10">
            {villas.map((villa, i) => (
              <Reveal
                key={villa.name}
                delay={0}
                className="sticky top-24 md:top-32 w-full h-[60vh] md:h-[75vh] group overflow-hidden shadow-2xl"
                style={{
                  marginTop: `${i * 10}px`,
                }}
              >
                <Image
                  fill
                  src={villa.src}
                  alt={villa.name}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0" />

                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
                  <p className="text-[#B5765A] text-xs tracking-widest mb-3 uppercase">
                    Villa 0{i + 1}
                  </p>
                  <h3 className="text-[#EFE7D7] font-spectral text-3xl md:text-5xl mb-3">
                    {villa.name}
                  </h3>
                  <p className="text-[#D8CDB6]/80 text-sm md:text-lg font-light max-w-xl">
                    {villa.caption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-[#D8CDB6] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <p className="text-[#2B2A27]/50 text-sm tracking-widest mb-3">
                WELLNESS
              </p>
              <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#2B2A27] mb-10">
                A retreat, not just a stay.
              </h2>
              <div className="flex flex-col gap-y-8">
                {wellnessFeatures.map(({ icon, title, desc }, i) => (
                  <div key={i} className="flex gap-4">
                    <Image
                      src={icon}
                      alt={title}
                      width={24}
                      height={24}
                      className="size-6 shrink-0 mt-1 object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-base text-[#2B2A27]">
                        {title}
                      </h3>
                      <p className="font-light text-base text-[#2B2A27]/70">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal
              delay={150}
              className="relative w-full h-[28rem] sm:h-[32rem] md:h-[44rem] lg:h-[48rem] overflow-hidden rounded-sm"
            >
              <Image
                fill
                src="/assets/wellnes-yoga.webp"
                alt="Morning yoga session on a deck facing the valley"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#2B2A27] flex flex-col md:flex-row w-full items-stretch">
          {/* Konten Teks - Kiri */}
          <div className="w-full md:w-1/2 px-6 md:px-12 lg:pl-20 lg:pr-16 py-16 md:py-20 lg:py-24 flex flex-col justify-center">
            <Reveal>
              <div className="inline-flex items-center border py-2 px-4 rounded-full gap-3 border-[#EFE7D7]/30 mb-8">
                <span className="bg-[#B5765A] size-1.5 rounded-full block"></span>
                <span className="text-[#D8CDB6] text-[10px] sm:text-xs tracking-widest uppercase">
                  IN PROGRESS &middot; OPENING SOON
                </span>
              </div>

              <h2 className="font-spectral text-5xl md:text-6xl lg:text-7xl text-[#EFE7D7] mb-4">
                Rassa
              </h2>

              <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-10 uppercase">
                THE RESTAURANT AT TISS VALLEY
              </p>

              <p className="text-[#D8CDB6] font-light max-w-md mb-12 text-sm md:text-base leading-relaxed">
                Rassa sits at the front of the property, open to villa guests
                and visitors alike. The concept: a plant-based table built
                around what the valley itself grows — still finding its final
                name, menu and identity.
              </p>

              <div className="flex flex-wrap gap-8 md:gap-14 mb-14">
                <div>
                  <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    CONCEPT
                  </p>
                  <p className="text-[#EFE7D7] font-spectral text-lg md:text-xl">
                    Plant-based
                  </p>
                </div>
                <div>
                  <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    ACCESS
                  </p>
                  <p className="text-[#EFE7D7] font-spectral text-lg md:text-xl">
                    Guests &amp; public
                  </p>
                </div>
                <div>
                  <p className="text-[#7E927F] text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
                    LOCATION
                  </p>
                  <p className="text-[#EFE7D7] font-spectral text-lg md:text-xl">
                    Front of valley
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="bg-[#B5765A] text-[#EFE7D7] px-8 py-3 md:px-10 md:py-4 tracking-widest text-xs uppercase cursor-pointer transition-colors duration-300 hover:bg-[#a3684f]"
              >
                ABOUT RASSA
              </button>
            </Reveal>
          </div>

          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full">
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

        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <Reveal className="mb-12 md:mb-16 text-left">
            <p className="text-[#1F2A22]/60 text-[10px] sm:text-xs tracking-widest mb-3 uppercase">
              THE EXPERIENCE
            </p>
            <h2 className="font-spectral text-4xl md:text-5xl text-[#1F2A22]">
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
                <div className="size-16 md:size-[72px] rounded-full bg-[#E4D8C5] flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <Image
                    src={icon}
                    alt={label}
                    width={24}
                    height={24}
                    className="size-5 md:size-6 object-contain"
                  />
                </div>
                <p className="text-[#1F2A22]/80 text-xs md:text-sm font-light">
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-[#1F2A22] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal variant="scale">
            <p className="text-[#EFE7D7]/30 font-spectral text-3xl md:text-4xl lg:text-6xl mb-4">
              &ldquo;
            </p>
            <p className="font-spectral italic text-xl md:text-2xl lg:text-3xl text-[#EFE7D7] max-w-2xl mx-auto">
              Where luxury performs, TISS stays restrained.
            </p>
          </Reveal>
        </section>

        <section className="bg-[#EFE7D7] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <Reveal>
              <p className="text-[#1F2A22]/60 text-[10px] sm:text-xs tracking-widest mb-4 uppercase">
                LOCATION
              </p>
              {/* Penambahan <br/> agar baris terpotong persis seperti desain */}
              <h2 className="font-spectral text-4xl md:text-5xl lg:text-[3.5rem] leading-tight text-[#1F2A22] mb-8">
                Above the terraces,
                <br className="hidden md:block" />
                within reach of
                <br className="hidden md:block" />
                everything.
              </h2>
              <p className="text-[#1F2A22]/70 font-light mb-12 max-w-[28rem] text-sm md:text-base leading-relaxed">
                Set in Sebatu, above the Tegallalang rice terraces — close
                enough to Ubud for a morning in town, far enough for the noise
                to stay behind you.
              </p>

              <div className="flex flex-col border-t border-[#1F2A22]/15">
                {distances.map((d) => (
                  <div
                    key={d.place}
                    className="flex justify-between items-center py-5 text-[#1F2A22] border-b border-[#1F2A22]/15"
                  >
                    <span className="font-light text-sm md:text-base">
                      {d.place}
                    </span>
                    <span className="font-light text-sm md:text-base text-[#1F2A22]/60">
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
                src="/assets/the-valley.webp"
                alt="Misty rice terraces surrounding the valley"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#C17B57] px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 text-center">
          <Reveal>
            <h2 className="font-spectral text-3xl md:text-4xl lg:text-5xl text-[#2B2A27] mb-10">
              Six villas.
              <br />
              One quiet valley.
            </h2>
            <a
              href="#"
              className="inline-block bg-[#1F2A22] text-[#EFE7D7] px-8 py-4 tracking-widest text-sm transition-colors duration-300 hover:bg-[#16201a]"
            >
              CHECK AVAILABILITY
            </a>
          </Reveal>
        </section>
      </main>

      <Footer onOpenRassa={() => setRassaOpen(true)} />
    </>
  );
}

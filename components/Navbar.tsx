// components/Navbar.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { IconPhone, IconInstagram, IconWhatsApp } from "./Icons";

interface NavbarProps {
  onOpenRassa: () => void;
}

export default function Navbar({ onOpenRassa }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="sticky top-0 z-50 h-0 text-white">
        <nav
          className={`relative flex justify-between items-center px-6 md:px-12 lg:px-20 py-4 transition-all duration-500 ${scrolled || mobileMenuOpen ? "bg-[#2B2A27]/90 backdrop-blur-md shadow-lg" : ""}`}
        >
          <div>
            <Image
              width={200}
              height={200}
              src="/logo/tiss-valley.png"
              alt="logo"
              className="size-16 md:size-24 lg:size-30"
            />
          </div>

          <div className="hidden md:flex gap-10 justify-center w-full">
            {navLinks.map((link) => (
              <a key={link} href="#" className="link-underline">
                {link}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenRassa}
              className="cursor-pointer link-underline"
            >
              RASSA
            </button>
            <a href="#" className="link-underline">
              LOCATION
            </a>
          </div>

          <a
            href="#"
            className="hidden md:inline-block border border-white px-10 py-3 transition-colors duration-300 hover:bg-white hover:text-[#2B2A27]"
          >
            <span className="tracking-widest">RESERVE</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex flex-col justify-center items-center gap-1.5 size-10 shrink-0 transition-transform duration-300 hover:scale-110"
          >
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-4 self-end bg-current" />
          </button>
        </nav>
      </div>

      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={`sidebar-backdrop md:hidden fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      <div
        className={`sidebar-panel md:hidden fixed top-0 right-0 z-[120] h-full w-[82%] max-w-sm bg-[#2B2A27] text-white shadow-2xl ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#B5765A]/70 to-transparent" />

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#EFE7D7]/10">
            <Image
              width={140}
              height={140}
              src="/logo/tiss-valley.png"
              alt="logo"
              className="size-12"
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="size-9 flex items-center justify-center rounded-full border border-[#EFE7D7]/20 transition-all duration-300 hover:border-[#B5765A] hover:rotate-90"
            >
              &times;
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center gap-8 px-8">
            {navLinks.map((label, i) => (
              <a
                key={label}
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className={`link-underline font-spectral text-3xl inline-block w-fit ${mobileMenuOpen ? "sidebar-link-in" : "opacity-0"}`}
                style={{ animationDelay: `${i * 80 + 80}ms` }}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                onOpenRassa();
                setMobileMenuOpen(false);
              }}
              className={`link-underline font-spectral text-3xl text-left w-fit ${mobileMenuOpen ? "sidebar-link-in" : "opacity-0"}`}
              style={{ animationDelay: "320ms" }}
            >
              RASSA
            </button>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className={`link-underline font-spectral text-3xl inline-block w-fit ${mobileMenuOpen ? "sidebar-link-in" : "opacity-0"}`}
              style={{ animationDelay: "400ms" }}
            >
              LOCATION
            </a>
          </nav>

          <div className="px-8 pb-10">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-center border border-white px-8 py-4 mb-8 transition-colors duration-300 hover:bg-white hover:text-[#2B2A27] ${mobileMenuOpen ? "sidebar-link-in" : "opacity-0"}`}
              style={{ animationDelay: "470ms" }}
            >
              <span className="tracking-widest text-sm">RESERVE</span>
            </a>
            <div
              className={`flex items-center justify-center gap-6 text-[#D8CDB6]/60 ${mobileMenuOpen ? "sidebar-link-in" : "opacity-0"}`}
              style={{ animationDelay: "530ms" }}
            >
              <IconPhone className="size-4" />
              <span className="w-px h-4 bg-[#EFE7D7]/15" />
              <IconInstagram className="size-4" />
              <span className="w-px h-4 bg-[#EFE7D7]/15" />
              <IconWhatsApp className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

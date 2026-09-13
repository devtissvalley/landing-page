"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, Fragment } from "react";
import { navLinks } from "@/lib/data";
import { IconPhone, IconInstagram, IconWhatsApp } from "./Icons";

interface NavbarProps {
  onOpenRassa: () => void;
}

const navRoutes: Record<string, string> = {
  VILLAS: "/villas",
  WELLNESS: "/wellness",
};

export default function Navbar({ onOpenRassa }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 40);

      if (!mobileMenuOpen) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

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
  }, [mobileMenuOpen]);

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
      <div
        className={`fixed top-0 left-0 w-full z-50 text-white transition-transform duration-700 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav
          className={`relative flex justify-between items-center px-6 md:px-12 lg:px-20 py-3 transition-all duration-700 ease-in-out ${
            isScrolled || mobileMenuOpen
              ? "bg-tiss-charcoal/90 backdrop-blur-md shadow-lg py-2"
              : "py-4"
          }`}
        >
          <div>
            <Image
              width={200}
              height={200}
              src="/logo/tiss-valley.png"
              alt="logo"
              className="w-16 md:w-20 lg:w-24 h-auto object-contain transition-all duration-700"
            />
          </div>

          <div className="hidden md:flex gap-10 justify-center w-full">
            {navLinks.map((link) =>
              navRoutes[link] ? (
                <Link
                  key={link}
                  href={navRoutes[link]}
                  className="link-underline"
                >
                  {link}
                </Link>
              ) : (
                <a key={link} href="#" className="link-underline">
                  {link}
                </a>
              ),
            )}
            <button
              type="button"
              onClick={onOpenRassa}
              className="cursor-pointer link-underline"
            >
              RASSA
            </button>
            <Link href="/location" className="link-underline">
              LOCATION
            </Link>
          </div>

          <Link
            href="/reserve"
            className="hidden md:inline-block border border-white px-10 py-3 transition-colors duration-300 hover:bg-white hover:text-tiss-charcoal shrink-0"
          >
            <span className="tracking-widest">RESERVE</span>
          </Link>

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
        className={`md:hidden fixed inset-0 z-110 bg-black/60 backdrop-blur-sm transition-opacity duration-700 ease-out ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`md:hidden fixed top-0 right-0 z-120 h-full w-[85%] max-w-sm bg-tiss-charcoal text-white shadow-2xl transition-transform duration-700 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <span className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-tiss-clay/70 to-transparent" />

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-tiss-oat/10">
            <Image
              width={140}
              height={140}
              src="/logo/tiss-valley.png"
              alt="logo"
              className="w-12 h-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="size-10 flex items-center justify-center rounded-full border border-tiss-oat/20 transition-all duration-500 hover:border-tiss-clay hover:rotate-90"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 1L1 13M1 1L13 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center gap-8 px-8 overflow-y-auto">
            {navLinks.map((label, i) => (
              <Fragment key={label}>
                {navRoutes[label] ? (
                  <Link
                    href={navRoutes[label]}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`link-underline font-spectral text-3xl md:text-4xl inline-block w-fit transition-all duration-700 ease-out transform ${
                      mobileMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${i * 70 + 150}ms` }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`link-underline font-spectral text-3xl md:text-4xl inline-block w-fit transition-all duration-700 ease-out transform ${
                      mobileMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${i * 70 + 150}ms` }}
                  >
                    {label}
                  </a>
                )}
              </Fragment>
            ))}

            <button
              type="button"
              onClick={() => {
                onOpenRassa();
                setMobileMenuOpen(false);
              }}
              className={`link-underline font-spectral text-3xl md:text-4xl text-left w-fit transition-all duration-700 ease-out transform ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${navLinks.length * 70 + 150}ms` }}
            >
              RASSA
            </button>
            <Link
              href="/location"
              onClick={() => setMobileMenuOpen(false)}
              className={`link-underline font-spectral text-3xl md:text-4xl inline-block w-fit transition-all duration-700 ease-out transform ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${(navLinks.length + 1) * 70 + 150}ms`,
              }}
            >
              LOCATION
            </Link>
          </nav>

          <div className="px-8 pb-10 mt-auto">
            <Link
              href="/reserve"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-center border border-tiss-oat px-8 py-4 mb-8 transition-all duration-700 ease-out transform hover:bg-tiss-oat hover:text-tiss-charcoal ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${(navLinks.length + 2) * 70 + 150}ms`,
              }}
            >
              <span className="tracking-widest text-sm">RESERVE</span>
            </Link>

            <div
              className={`flex items-center justify-center gap-6 text-tiss-sand/60 transition-all duration-700 ease-out transform ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${(navLinks.length + 3) * 70 + 150}ms`,
              }}
            >
              <a href="#" className="hover:text-tiss-oat transition-colors">
                <IconPhone className="size-5" />
              </a>
              <span className="w-px h-4 bg-tiss-oat/15" />
              <a href="#" className="hover:text-tiss-oat transition-colors">
                <IconInstagram className="size-5" />
              </a>
              <span className="w-px h-4 bg-tiss-oat/15" />
              <a href="#" className="hover:text-tiss-oat transition-colors">
                <IconWhatsApp className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

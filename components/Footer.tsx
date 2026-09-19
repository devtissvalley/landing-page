import Link from "next/link";
import { IconPhone, IconInstagram, IconWhatsApp } from "./Icons";
import Image from "next/image";
import { BUSINESS } from "@/lib/seo";

interface FooterProps {
  // Optional, like the navbar: without a handler the Rassa entry is a link.
  onOpenRassa?: () => void;
}

export default function Footer({ onOpenRassa }: FooterProps = {}) {
  return (
    <footer className="bg-tiss-charcoal px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-[#3E3D3A]">
        <div>
          <Link href="/" aria-label="TISS Valley — home">
            <Image
              src={"/logo/tiss-valley.png"}
              width={100}
              height={100}
              alt="TISS Valley"
            />
          </Link>
          <p className="text-tiss-sand/60 text-sm font-light max-w-xs">
            A six-villa retreat set into the highland rice terraces above
            Sebatu, in the Tegallalang district of Gianyar, Bali — 25 minutes
            from central Ubud.
          </p>
        </div>

        <div>
          <h4 className="text-tiss-sage text-sm tracking-widest mb-4">
            EXPLORE
          </h4>
          <ul className="flex flex-col gap-3 text-tiss-sand/80 text-sm">
            <li>
              <Link href="/">The Valley</Link>
            </li>
            <li>
              <Link href="/villas">Pool villas</Link>
            </li>
            <li>
              <Link href="/wellness">Wellness &amp; spa</Link>
            </li>
            <li>
              <Link href="/location">Location &amp; getting here</Link>
            </li>
            <li>
              {onOpenRassa ? (
                <button
                  type="button"
                  onClick={onOpenRassa}
                  className="cursor-pointer"
                >
                  Rassa restaurant
                </button>
              ) : (
                <Link href="/rassa">Rassa restaurant</Link>
              )}
            </li>
            <li>
              <Link href="/reserve">Reserve a villa</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-tiss-sage text-sm tracking-widest mb-4">
            CONTACT
          </h4>
          <ul className="flex flex-col gap-3 text-tiss-sand/80 text-sm">
            <li>
              <a
                href={`tel:${BUSINESS.telephone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-tiss-oat transition-colors"
              >
                <IconPhone className="size-4" />
                {BUSINESS.telephone}
              </a>
            </li>
            <li>
              {/* Marked up so crawlers read a consistent NAP block. */}
              <address className="not-italic leading-relaxed">
                Jl. Sebatu, Tegallalang
                <br />
                Gianyar, Bali, Indonesia
              </address>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-tiss-sage text-sm tracking-widest mb-4">
            FOLLOW
          </h4>
          <ul className="flex flex-col gap-3 text-tiss-sand/80 text-sm">
            <li className="flex items-center gap-2">
              <IconInstagram className="size-4" />
              Instagram
            </li>
            <li>
              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-tiss-oat transition-colors"
              >
                <IconWhatsApp className="size-4" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-tiss-sand/40 text-xs pt-8">
        &copy; 2026 TISS Valley, Sebatu &middot; All rights reserved.
      </p>
    </footer>
  );
}

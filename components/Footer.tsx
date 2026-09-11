// components/Footer.tsx
import Link from "next/link";
import { IconPhone, IconInstagram, IconWhatsApp } from "./Icons";

interface FooterProps {
  onOpenRassa: () => void;
}

export default function Footer({ onOpenRassa }: FooterProps) {
  return (
    <footer className="bg-[#2B2A27] px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-[#3E3D3A]">
        <div>
          <h3 className="font-spectral text-2xl text-[#EFE7D7] mb-3">TISS</h3>
          <p className="text-[#D8CDB6]/60 text-sm font-light max-w-xs">
            A six-villa retreat set into the highland rice terraces above
            Sebatu, Bali.
          </p>
        </div>

        <div>
          <h4 className="text-[#7E927F] text-sm tracking-widest mb-4">
            EXPLORE
          </h4>
          <ul className="flex flex-col gap-3 text-[#D8CDB6]/80 text-sm">
            <li>
              <a href="#">The Valley</a>
            </li>
            <li>
              <Link href="/villas">Villas</Link>
            </li>
            <li>
              <Link href="/wellness">Wellness</Link>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenRassa}
                className="cursor-pointer"
              >
                Rassa
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#7E927F] text-sm tracking-widest mb-4">
            CONTACT
          </h4>
          <ul className="flex flex-col gap-3 text-[#D8CDB6]/80 text-sm">
            <li className="flex items-center gap-2">
              <IconPhone className="size-4" />
              +62 811 3980 8151
            </li>
            <li>Jl. Sebatu, Gianyar, Bali</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#7E927F] text-sm tracking-widest mb-4">
            FOLLOW
          </h4>
          <ul className="flex flex-col gap-3 text-[#D8CDB6]/80 text-sm">
            <li className="flex items-center gap-2">
              <IconInstagram className="size-4" />
              Instagram
            </li>
            <li className="flex items-center gap-2">
              <IconWhatsApp className="size-4" />
              WhatsApp
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-[#D8CDB6]/40 text-xs pt-8">
        &copy; 2026 TISS Valley, Sebatu &middot; All rights reserved.
      </p>
    </footer>
  );
}

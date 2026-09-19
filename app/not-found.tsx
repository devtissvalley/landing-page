import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  // Next already marks not-found responses noindex; no need to repeat it.
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-tiss-charcoal flex-1 flex flex-col items-center justify-center text-center px-6 py-32 md:py-40">
        <p className="text-tiss-sage text-[10px] sm:text-xs tracking-widest uppercase mb-6">
          404
        </p>
        <h1 className="font-spectral text-4xl md:text-5xl lg:text-6xl text-tiss-oat mb-6">
          This path doesn&rsquo;t lead anywhere.
        </h1>
        <p className="text-tiss-sand/70 font-light max-w-md leading-relaxed mb-10">
          The page you were looking for isn&rsquo;t here. The villas, the
          valley and the way to reach us all are.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/"
            className="bg-tiss-clay text-tiss-oat px-8 py-4 tracking-widest text-xs uppercase transition-colors duration-300 hover:brightness-90"
          >
            Back to the valley
          </Link>
          <Link
            href="/villas"
            className="text-tiss-oat text-xs tracking-widest uppercase border-b border-tiss-oat/40 pb-1 transition-colors duration-300 hover:border-tiss-oat"
          >
            See the villas
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

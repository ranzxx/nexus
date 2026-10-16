"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/upgrade", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
        scrolled
          ? "border-[#27272A] bg-[#0A0A0A]/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="h-16 max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo + nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo/nexus.svg"
              alt="Nexus"
              width={18}
              height={18}
              priority
            />
            <span className="font-semibold text-[15px] text-[#FAFAFA] tracking-tight uppercase">
              Nexus
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-[#FAFAFA] text-[#141313] text-xs font-mono uppercase tracking-widest px-4 py-2 hover:bg-white transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors p-1"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0A0A0A]">
          <nav className="flex flex-col px-8 py-6 gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 pt-4 border-t border-[#27272A]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="bg-[#FAFAFA] text-[#141313] text-xs font-mono uppercase tracking-widest px-4 py-3 text-center hover:bg-white transition-colors"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
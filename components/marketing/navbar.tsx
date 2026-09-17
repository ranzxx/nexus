"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/upgrade", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-6">
        <Link href="/" className="flex items-center gap-5">
          <Image
            src="/logo/nexus.svg"
            alt="Nexus"
            width={25}
            height={25}
            quality={100}
          />
          <span className="text-xl font-semibold">Nexus</span>
        </Link>

        <div className="hidden items-center justify-center gap-8 text-sm text-zinc-400 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <Link href="/login" className="text-gray-400">Sign in</Link>
          <Button size={"lg"} asChild>
            <Link href="/register" >Get started</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#09090b] border-zinc-800">
            <div className="flex flex-col gap-6 mt-8 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg text-zinc-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

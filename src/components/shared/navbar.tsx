"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  siteName: string;
  logo?: string;
}

export function Navbar({ siteName, logo }: NavbarProps) {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const brandParts = siteName.split(" ");
  const firstWord = brandParts[0] || siteName;
  const rest = brandParts.slice(1).join(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-dark/90 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent py-4"
        )}
      >
        <nav
          className="container mx-auto flex w-full items-center justify-between px-4 md:px-8"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            {logo ? (
              <Image src={logo} alt={siteName} width={140} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <>
                {firstWord}
                {rest && <span className="text-primary">{rest}</span>}
              </>
            )}
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-xl lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/20 text-accent"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="accent" size="sm" className="hidden sm:flex shadow-lg shadow-primary/20">
              <Link href="/contact">
                <Phone className="mr-2 h-4 w-4" />
                Get Quote
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-2 p-8 pt-24">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-2xl font-semibold transition-colors",
                      pathname === link.href ? "bg-primary/20 text-accent" : "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild variant="accent" size="lg" className="mt-6">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Get Free Quote
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/contact"
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_32px_rgba(59,174,65,0.4)] transition-transform hover:scale-105 lg:hidden"
        aria-label="Contact us"
      >
        <Phone className="h-6 w-6" />
      </Link>
    </>
  );
}

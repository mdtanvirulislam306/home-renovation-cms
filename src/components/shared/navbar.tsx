"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useUIStore } from "@/store/ui-store";
import { siteConfig } from "@/config/site";
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

export function Navbar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className="mx-4 mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-dark/80 px-6 py-3 backdrop-blur-xl md:mx-8"
          aria-label="Main navigation"
        >
          <Link href="/" className="text-xl font-bold text-white">
            Green<span className="text-primary">Scape</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-white/80 transition-colors hover:text-white",
                  pathname === link.href && "text-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="accent" size="sm" className="hidden sm:flex">
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
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-6 p-8 pt-24">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="accent" size="lg" className="mt-4">
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-premium transition-transform hover:scale-105 lg:hidden"
        aria-label="Contact us"
      >
        <Phone className="h-6 w-6" />
      </Link>
    </>
  );
}

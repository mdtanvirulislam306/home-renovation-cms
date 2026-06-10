import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/types/settings";

interface FooterProps {
  settings: SiteSettings;
  services: { title?: string; slug?: string }[];
}

export function Footer({ settings, services }: FooterProps) {
  const social = [
    { icon: Facebook, href: settings.socialLinks.facebook },
    { icon: Instagram, href: settings.socialLinks.instagram },
    { icon: Twitter, href: settings.socialLinks.twitter },
    { icon: Linkedin, href: settings.socialLinks.linkedin },
  ].filter((item) => item.href);

  return (
    <footer className="relative bg-dark text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="border-b border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row md:px-8">
          <div>
            <h3 className="text-2xl font-bold">Ready to transform your space?</h3>
            <p className="mt-2 text-white/60">Get a free quote — no obligation, fast response.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:gap-3"
          >
            Get Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold">{settings.siteName}</h3>
            <p className="mt-4 leading-relaxed text-white/60">{settings.seo.defaultDescription}</p>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              {["Services", "About", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">Services</h4>
            <ul className="space-y-3 text-white/70">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">Contact</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {settings.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {settings.email}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {settings.address}
              </li>
            </ul>
            {social.length > 0 && (
              <div className="mt-6 flex gap-3">
                {social.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-primary hover:bg-primary"
                    aria-label="Social link"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";
import { SectionHeader } from "@/components/shared/section-header";
import type { SectionTitle, SiteSettings } from "@/types/settings";

interface ContactSectionProps {
  section: SectionTitle;
  services: { title?: string; slug?: string }[];
  settings?: Pick<SiteSettings, "phone" | "email" | "address">;
}

export function ContactSection({ section, services, settings }: ContactSectionProps) {
  return (
    <section className="section-mesh relative overflow-hidden py-28">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title || "Request a Free Quote"}
          subtitle={section.subtitle}
        />

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          {settings && (
            <div className="space-y-4 lg:col-span-2">
              {[
                { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
                { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
                { icon: MapPin, label: "Address", value: settings.address },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-premium"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="mt-1 block font-medium hover:text-primary">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Full contact page <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="shine-border rounded-3xl border border-border/50 bg-card p-8 shadow-premium lg:col-span-3">
            <ContactForm services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}

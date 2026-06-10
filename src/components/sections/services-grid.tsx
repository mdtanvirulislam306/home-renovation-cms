"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import type { ServiceCard } from "@/types/content";
import type { SectionTitle } from "@/types/settings";

export function ServicesGrid({
  services,
  section,
  showHeader = true,
}: {
  services: ServiceCard[];
  section?: SectionTitle;
  showHeader?: boolean;
}) {
  return (
    <section className="section-mesh py-28">
      <div className="container mx-auto px-4 md:px-8">
        {showHeader && (
          <SectionHeader
            eyebrow={section?.eyebrow}
            title={section?.title || "Our Services"}
            subtitle={section?.subtitle}
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.slug || i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="shine-border group relative block overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_rgba(7,20,12,0.2)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.featuredImage || "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600"}
                    alt={service.title || "Service"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-90" />
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                      0{i + 1}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="line-clamp-2 text-muted-foreground">{service.shortDescription}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

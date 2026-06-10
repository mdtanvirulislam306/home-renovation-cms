"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CaseStudyCard } from "@/types/content";
import type { SectionTitle } from "@/types/settings";

export function CaseStudiesPreview({
  caseStudies,
  section,
}: {
  caseStudies: CaseStudyCard[];
  section?: SectionTitle;
}) {
  if (!caseStudies.length) return null;

  return (
    <section className="py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {section?.eyebrow && <span className="eyebrow-pill">{section.eyebrow}</span>}
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {section?.title || "Featured Case Studies"}
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/case-studies/${cs.slug}`}
                className="shine-border group block overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={cs.featuredImage || ""}
                    alt={cs.title || ""}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark opacity-0 transition-all group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                    {cs.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{cs.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

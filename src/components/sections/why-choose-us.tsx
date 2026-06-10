"use client";

import { motion } from "framer-motion";
import { getFeatureIcon } from "@/lib/feature-icons";
import type { FeatureItem, SectionTitle } from "@/types/settings";

interface WhyChooseUsProps {
  features: FeatureItem[];
  section: SectionTitle;
}

export function WhyChooseUs({ features, section }: WhyChooseUsProps) {
  if (!features.length) return null;

  return (
    <section className="relative overflow-hidden bg-secondary py-28 text-white">
      <div className="section-mesh-dark absolute inset-0" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container relative mx-auto px-4 md:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {section.eyebrow && (
              <span className="eyebrow-pill border-accent/30 bg-accent/10 text-accent">
                {section.eyebrow}
              </span>
            )}
            {section.title && (
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-tight">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="mt-5 text-lg leading-relaxed text-white/70">{section.subtitle}</p>
            )}
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, i) => {
              const Icon = getFeatureIcon(feature.icon);
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-white/10"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-dark">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

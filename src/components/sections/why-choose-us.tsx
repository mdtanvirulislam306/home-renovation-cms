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
    <section className="py-24 bg-secondary text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            {section.eyebrow && <span className="text-accent font-medium">{section.eyebrow}</span>}
            {section.title && (
              <h2 className="mt-2 text-3xl font-bold md:text-5xl">{section.title}</h2>
            )}
            {section.subtitle && (
              <p className="mt-4 text-white/70 text-lg">{section.subtitle}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => {
              const Icon = getFeatureIcon(feature.icon);
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <Icon className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-white/70 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

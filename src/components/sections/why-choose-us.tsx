"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Award, Leaf } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Complete peace of mind with comprehensive insurance coverage on every project.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect your schedule and deliver projects on time, every time.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized excellence in landscaping and property services across the region.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Sustainable practices and environmentally responsible solutions.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-secondary text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-accent font-medium">Why Choose Us</span>
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">
              The Trusted Choice for Property Excellence
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              With over 15 years of experience, we combine craftsmanship, reliability,
              and premium materials to deliver outstanding results.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <feature.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

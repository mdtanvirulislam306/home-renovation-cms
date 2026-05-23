"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ServiceCard } from "@/types/content";

export function ServicesGrid({ services }: { services: ServiceCard[] }) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium">What We Do</span>
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">Our Services</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive landscaping and property services tailored to your needs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.slug || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block overflow-hidden rounded-2xl border bg-card shadow-premium transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.featuredImage || "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600"}
                    alt={service.title || "Service"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground line-clamp-2">{service.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="text-primary font-semibold hover:underline">
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}

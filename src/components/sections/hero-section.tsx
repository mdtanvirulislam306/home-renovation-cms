"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&q=80"
        alt="Beautiful landscaped garden"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="container relative z-10 mx-auto px-4 pt-32 pb-20 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent mb-6">
              Premium Landscaping & Property Services
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Transform Your{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Outdoor Space
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Expert landscaping, fencing, roof cleaning, and property maintenance.
              Trusted by 1,800+ homeowners across the region.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-dark rounded-3xl p-8 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
              <div>
                <p className="text-white font-semibold">Watch Our Work</p>
                <p className="text-white/60 text-sm">See transformations in action</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects Done", value: "2,500+" },
                { label: "Satisfaction", value: "99%" },
                { label: "Team Size", value: "45+" },
                { label: "Years Exp.", value: "15+" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 p-4 text-center">
                  <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

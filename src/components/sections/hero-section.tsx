"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeVideoModal } from "@/components/shared/youtube-video-modal";
import type { SiteSettings, StatItem } from "@/types/settings";

interface HeroSectionProps {
  settings: Pick<
    SiteSettings,
    | "heroBadge"
    | "heroTitle"
    | "heroHighlight"
    | "heroSubtitle"
    | "heroImage"
    | "heroCtaPrimary"
    | "heroCtaSecondary"
    | "heroVideoUrl"
    | "stats"
  >;
}

function HeroStat({ stat }: { stat: StatItem }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
      <p className="text-2xl font-bold text-accent">
        {stat.value.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-sm text-white/60">{stat.label}</p>
    </div>
  );
}

export function HeroSection({ settings }: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const heroStats = settings.stats.slice(0, 4);
  const hasVideo = !!settings.heroVideoUrl?.trim();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src={settings.heroImage}
        alt={settings.heroTitle}
        fill
        priority
        className="object-cover scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-accent/15 blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10 mx-auto px-4 pb-24 pt-32 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow-pill mb-6 border-white/20 bg-white/10 text-accent">
              {settings.heroBadge}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl lg:leading-[1.05]">
              {settings.heroTitle}{" "}
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {settings.heroHighlight}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              {settings.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="shadow-lg shadow-primary/30">
                <Link href="/contact">
                  {settings.heroCtaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/services">{settings.heroCtaSecondary}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="shine-border glass-dark animate-float rounded-3xl p-8 shadow-glass"
          >
            <button
              type="button"
              onClick={() => hasVideo && setVideoOpen(true)}
              disabled={!hasVideo}
              className="group mb-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-primary/40 hover:bg-white/10 disabled:cursor-default disabled:opacity-80"
              aria-label="Watch our work video"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 transition-transform group-hover:scale-110 group-disabled:group-hover:scale-100">
                <Play className="ml-0.5 h-6 w-6 text-white" />
                <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-30" />
              </div>
              <div>
                <p className="font-semibold text-white">Watch Our Work</p>
                <p className="text-sm text-white/60">
                  {hasVideo ? "See transformations in action" : "Video coming soon"}
                </p>
              </div>
            </button>
            <div className="grid grid-cols-2 gap-4">
              {heroStats.map((stat) => (
                <HeroStat key={stat.label} stat={stat} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </motion.div>

      <YouTubeVideoModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        videoUrl={settings.heroVideoUrl}
        title="Watch Our Work"
      />
    </section>
  );
}

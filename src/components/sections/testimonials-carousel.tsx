"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import type { TestimonialCard } from "@/types/content";
import type { SectionTitle } from "@/types/settings";
import "swiper/css";
import "swiper/css/pagination";

export function TestimonialsCarousel({
  testimonials,
  section,
  googleReviewsUrl,
}: {
  testimonials: TestimonialCard[];
  section?: SectionTitle;
  googleReviewsUrl?: string;
}) {
  if (!testimonials.length) return null;

  return (
    <section className="section-mesh border-y border-border/40 py-28">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow={section?.eyebrow}
          title={section?.title || "What Our Clients Say"}
        />

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="!pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t._id != null ? String(t._id) : t.name}>
              <div className="relative flex h-full flex-col rounded-3xl border border-border/50 bg-card p-8 shadow-premium">
                <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/15" />
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="flex-1 text-base leading-relaxed text-muted-foreground">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name || ""}
                      width={52}
                      height={52}
                      className="rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {(t.name || "?")[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    {t.role && <p className="text-sm text-muted-foreground">{t.role}</p>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center">
          <a
            href={googleReviewsUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Read more on Google Reviews →
          </a>
        </div>
      </div>
    </section>
  );
}

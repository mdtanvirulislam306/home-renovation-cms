"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { Star } from "lucide-react";
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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          {section?.eyebrow && <span className="text-primary font-medium">{section.eyebrow}</span>}
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">
            {section?.title || "What Our Clients Say"}
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t._id != null ? String(t._id) : t.name}>
              <div className="rounded-2xl border bg-card p-8 shadow-premium h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-6 flex items-center gap-4">
                  {t.image && (
                    <Image
                      src={t.image}
                      alt={t.name || ""}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
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

        <div className="text-center mt-8">
          <a
            href={googleReviewsUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Read more on Google Reviews →
          </a>
        </div>
      </div>
    </section>
  );
}

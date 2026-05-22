import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { generatePageMetadata } from "@/lib/seo";
import { StatsSection } from "@/components/sections/stats-section";

export const metadata = generatePageMetadata({
  title: "About Us",
  description: "Learn about GreenScape Pro — your trusted landscaping and property services partner.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About GreenScape Pro"
        description="Passionate professionals dedicated to transforming outdoor spaces."
        breadcrumbs={[{ label: "About" }]}
      />

      <section className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Founded over 15 years ago, GreenScape Pro has grown from a small local crew into
              a full-service landscaping and property maintenance company trusted by thousands
              of homeowners and businesses.
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              We believe every property deserves expert care — from lush gardens to pristine
              roofs, clean gutters, and flawless fencing. Our team combines craftsmanship with
              modern equipment to deliver results that exceed expectations.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"
              alt="Our team at work"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <StatsSection />
    </>
  );
}

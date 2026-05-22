import { HeroSection } from "@/components/sections/hero-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ServiceArea } from "@/components/sections/service-area";
import { CaseStudiesPreview } from "@/components/sections/case-studies-preview";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { BlogPreview } from "@/components/sections/blog-preview";
import {
  getPublishedServices,
  getPublishedCaseStudies,
  getPublishedTestimonials,
  getPublishedBlogs,
} from "@/lib/data";
import { generateOrganizationSchema } from "@/lib/seo";

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
  let caseStudies: Awaited<ReturnType<typeof getPublishedCaseStudies>> = [];
  let testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>> = [];
  let blogs: Awaited<ReturnType<typeof getPublishedBlogs>>["data"] = [];

  try {
    [services, caseStudies, testimonials, { data: blogs }] = await Promise.all([
      getPublishedServices(6),
      getPublishedCaseStudies(3),
      getPublishedTestimonials(),
      getPublishedBlogs({ limit: 3 }),
    ]);
  } catch {
    // DB not connected during build — sections handle empty data
  }

  const schema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HeroSection />
      <ServicesGrid services={services} />
      <WhyChooseUs />
      <StatsSection />
      <CaseStudiesPreview caseStudies={caseStudies} />
      <TestimonialsCarousel testimonials={testimonials} />
      <ServiceArea />
      <BlogPreview posts={blogs} />
    </>
  );
}

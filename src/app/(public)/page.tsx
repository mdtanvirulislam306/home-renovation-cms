import { HeroSection } from "@/components/sections/hero-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ServiceArea } from "@/components/sections/service-area";
import { CaseStudiesPreview } from "@/components/sections/case-studies-preview";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { BlogPreview } from "@/components/sections/blog-preview";
import { ContactSection } from "@/components/sections/contact-section";
import {
  getPublishedServices,
  getPublishedCaseStudies,
  getPublishedTestimonials,
  getPublishedBlogs,
} from "@/lib/data";
import { getSiteSettings } from "@/lib/site-settings";
import { generateOrganizationSchema } from "@/lib/seo";

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
  let caseStudies: Awaited<ReturnType<typeof getPublishedCaseStudies>> = [];
  let testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>> = [];
  let blogs: Awaited<ReturnType<typeof getPublishedBlogs>>["data"] = [];
  let settings = await getSiteSettings();

  try {
    [settings, services, caseStudies, testimonials, { data: blogs }] = await Promise.all([
      getSiteSettings(),
      getPublishedServices(6),
      getPublishedCaseStudies(3),
      getPublishedTestimonials(),
      getPublishedBlogs({ limit: 3 }),
    ]);
  } catch {
    // DB not connected during build — sections handle empty data
  }

  const schema = generateOrganizationSchema(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HeroSection settings={settings} />
      <ServicesGrid services={services} section={settings.sectionTitles.services} />
      <WhyChooseUs
        features={settings.features}
        section={settings.sectionTitles.whyChooseUs}
      />
      <StatsSection stats={settings.stats} />
      <CaseStudiesPreview
        caseStudies={caseStudies}
        section={settings.sectionTitles.caseStudies}
      />
      <TestimonialsCarousel
        testimonials={testimonials}
        section={settings.sectionTitles.testimonials}
        googleReviewsUrl={settings.googleReviewsUrl}
      />
      <ServiceArea mapsUrl={settings.googleMapsEmbedUrl} />
      <BlogPreview posts={blogs} section={settings.sectionTitles.blog} />
      <ContactSection
        section={settings.sectionTitles.contact}
        services={services}
        settings={settings}
      />
    </>
  );
}

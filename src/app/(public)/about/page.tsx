import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { generatePageMetadata } from "@/lib/seo";
import { StatsSection } from "@/components/sections/stats-section";
import { defaultAboutContent } from "@/lib/about-defaults";
import { getSiteSettings } from "@/lib/site-settings";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const about = settings.about;

  return generatePageMetadata({
    title: about.seoTitle || "About Us",
    description:
      about.seoDescription ||
      `Learn about ${settings.siteName} — your trusted landscaping and property services partner.`,
    path: "/about",
    settings,
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const about = settings.about;
  const pageTitle = about.title || `About ${settings.siteName}`;

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={about.subtitle}
        breadcrumbs={[{ label: "About" }]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow-pill">Our Story</span>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">{about.storyTitle}</h2>
              <div
                className="prose prose-lg mt-6 max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.storyContent) }}
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={about.image || defaultAboutContent.image}
                alt={about.imageAlt || defaultAboutContent.imageAlt}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      {about.showStats && <StatsSection stats={settings.stats} />}
    </>
  );
}

import { PageHeader } from "@/components/shared/page-header";
import { ServicesGrid } from "@/components/sections/services-grid";
import { getPublishedServices } from "@/lib/data";
import { getSiteSettings } from "@/lib/site-settings";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return generatePageMetadata({
    title: "Services",
    description: "Professional landscaping and property services for your home and business.",
    path: "/services",
    settings,
  });
}

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
  let settings = await getSiteSettings();

  try {
    [services, settings] = await Promise.all([getPublishedServices(), getSiteSettings()]);
  } catch {
    // empty
  }

  return (
    <>
      <PageHeader
        title="Our Services"
        description="Comprehensive landscaping and property maintenance solutions."
        breadcrumbs={[{ label: "Services" }]}
      />
      <ServicesGrid services={services} section={settings.sectionTitles.services} />
    </>
  );
}

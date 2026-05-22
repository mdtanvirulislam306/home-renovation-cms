import { PageHeader } from "@/components/shared/page-header";
import { ServicesGrid } from "@/components/sections/services-grid";
import { getPublishedServices } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Services",
  description: "Professional landscaping and property services for your home and business.",
  path: "/services",
});

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof getPublishedServices>> = [];
  try {
    services = await getPublishedServices();
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
      <ServicesGrid services={services} />
    </>
  );
}

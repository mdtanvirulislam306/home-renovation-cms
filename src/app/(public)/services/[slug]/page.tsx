import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getServiceBySlug, getPublishedServices } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import { Check } from "lucide-react";

export async function generateStaticParams() {
  try {
    const services = await getPublishedServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => null);
  if (!service) return {};
  return generatePageMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    image: service.featuredImage,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => null);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <article className="container mx-auto px-4 py-16 md:px-8">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12">
          <Image
            src={service.featuredImage}
            alt={service.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.fullDescription) }}
        />

        {service.keyBenefits?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {service.keyBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.galleryImages?.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.galleryImages.map((img) => (
              <div key={img} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={img} alt="" fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-3 text-white font-medium hover:bg-primary/90"
          >
            Get a Free Quote
          </Link>
        </div>
      </article>
    </>
  );
}

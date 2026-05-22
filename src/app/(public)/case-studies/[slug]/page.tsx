import { notFound } from "next/navigation";
import Image from "next/image";
import ReactCompareImage from "react-compare-image";
import { PageHeader } from "@/components/shared/page-header";
import { getCaseStudyBySlug } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug).catch(() => null);
  if (!cs) return {};
  return generatePageMetadata({
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.summary,
    image: cs.featuredImage,
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug).catch(() => null);
  if (!cs) notFound();

  return (
    <>
      <PageHeader
        title={cs.title}
        description={cs.summary}
        breadcrumbs={[
          { label: "Case Studies", href: "/case-studies" },
          { label: cs.title },
        ]}
      />

      <article className="container mx-auto px-4 py-16 md:px-8">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12">
          <Image src={cs.featuredImage} alt={cs.title} fill className="object-cover" priority sizes="100vw" />
        </div>

        {cs.beforeImage && cs.afterImage && (
          <div className="mb-12 rounded-2xl overflow-hidden">
            <ReactCompareImage
              leftImage={cs.beforeImage}
              rightImage={cs.afterImage}
              sliderLineColor="#3BAE41"
            />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {[
              { title: "Challenge", content: cs.challenge },
              { title: "Solution", content: cs.solution },
              { title: "Results", content: cs.results },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />
              </div>
            ))}
          </div>

          <aside className="space-y-6">
            {cs.client && (
              <div className="rounded-2xl border p-6">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{cs.client}</p>
              </div>
            )}
            {cs.location && (
              <div className="rounded-2xl border p-6">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{cs.location}</p>
              </div>
            )}
            {cs.services?.length > 0 && (
              <div className="rounded-2xl border p-6">
                <p className="text-sm text-muted-foreground mb-2">Services</p>
                <ul className="space-y-1">
                  {cs.services.map((s) => (
                    <li key={s} className="text-sm font-medium">{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}

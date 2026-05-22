import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { getPublishedCaseStudies } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Case Studies",
  description: "Explore our portfolio of successful landscaping and property projects.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  let caseStudies: Awaited<ReturnType<typeof getPublishedCaseStudies>> = [];
  try {
    caseStudies = await getPublishedCaseStudies();
  } catch {
    // empty
  }

  return (
    <>
      <PageHeader
        title="Case Studies"
        description="Real projects, real results."
        breadcrumbs={[{ label: "Case Studies" }]}
      />

      <section className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-premium"
            >
              <div className="relative aspect-[16/10]">
                <Image src={cs.featuredImage} alt={cs.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="33vw" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold group-hover:text-primary">{cs.title}</h2>
                {cs.location && <p className="text-sm text-muted-foreground mt-1">{cs.location}</p>}
                <p className="mt-2 text-muted-foreground line-clamp-2">{cs.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

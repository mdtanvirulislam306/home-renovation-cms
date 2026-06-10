import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
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

      <section className="section-mesh py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="shine-border group overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={cs.featuredImage}
                    alt={cs.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="33vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold transition-colors group-hover:text-primary">
                    {cs.title}
                  </h2>
                  {cs.location && (
                    <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {cs.location}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{cs.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View project <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CaseStudyCard } from "@/types/content";
import type { SectionTitle } from "@/types/settings";

export function CaseStudiesPreview({
  caseStudies,
  section,
}: {
  caseStudies: CaseStudyCard[];
  section?: SectionTitle;
}) {
  if (!caseStudies.length) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            {section?.eyebrow && <span className="text-primary font-medium">{section.eyebrow}</span>}
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">
              {section?.title || "Featured Case Studies"}
            </h2>
          </div>
          <Link href="/case-studies" className="mt-4 md:mt-0 text-primary font-semibold hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-premium"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={cs.featuredImage || ""}
                  alt={cs.title || ""}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cs.title}</h3>
                <p className="mt-2 text-muted-foreground line-clamp-2">{cs.summary}</p>
                <span className="mt-4 inline-flex items-center text-primary text-sm font-medium">
                  Read case study <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

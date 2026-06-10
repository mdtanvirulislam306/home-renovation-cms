import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { getPublishedBlogs, getCategories } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getPopulatedName } from "@/lib/mongoose-utils";
import { BlogSearch } from "@/components/shared/blog-search";
import type { CategoryItem } from "@/types/content";

export const metadata = generatePageMetadata({
  title: "Blog",
  description: "Tips, guides, and insights on landscaping and property care.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  let result = { data: [] as Awaited<ReturnType<typeof getPublishedBlogs>>["data"], totalPages: 0 };
  let categories: CategoryItem[] = [];

  try {
    [result, categories] = await Promise.all([
      getPublishedBlogs({
        page,
        category: params.category,
        search: params.search,
      }),
      getCategories(),
    ]);
  } catch {
    // empty
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Expert advice and industry insights."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="section-mesh py-20">
        <div className="container mx-auto px-4 md:px-8">
          <BlogSearch categories={categories} />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="33vw"
                  />
                  {getPopulatedName(post.category) && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white">
                      {getPopulatedName(post.category)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.publishDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {result.totalPages > 1 && (
            <div className="mt-14 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "border border-border/50 hover:border-primary/30"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

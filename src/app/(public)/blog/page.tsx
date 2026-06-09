import Link from "next/link";
import Image from "next/image";
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

      <section className="container mx-auto px-4 py-16 md:px-8">
        <BlogSearch categories={categories} />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-6">
                {getPopulatedName(post.category) && (
                <span className="text-xs text-primary font-medium">
                  {getPopulatedName(post.category)}
                </span>
                )}
                <h2 className="mt-2 text-xl font-bold group-hover:text-primary">{post.title}</h2>
                <p className="mt-2 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{formatDate(post.publishDate)}</p>
              </div>
            </Link>
          ))}
        </div>

        {result.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`px-4 py-2 rounded-xl ${p === page ? "bg-primary text-white" : "border"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

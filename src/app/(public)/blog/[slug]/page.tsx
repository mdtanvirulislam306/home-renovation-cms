import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/data";
import { generatePageMetadata, generateArticleSchema } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { getRefId, getPopulatedName } from "@/lib/mongoose-utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug).catch(() => null);
  if (!blog) return {};
  return generatePageMetadata({
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    image: blog.featuredImage,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug).catch(() => null);
  if (!blog) notFound();

  const categoryId = getRefId(blog.category);
  const categoryName = getPopulatedName(blog.category);
  const related = await getRelatedBlogs(categoryId, slug).catch(() => []);

  const schema = generateArticleSchema({
    title: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: new Date(blog.publishDate).toISOString(),
    author: blog.author,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHeader
        title={blog.title}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: blog.title },
        ]}
      />

      <article className="container mx-auto px-4 py-16 md:px-8 max-w-4xl">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span>{blog.author}</span>
          <span>·</span>
          <time>{formatDate(blog.publishDate)}</time>
          {categoryName && (
            <>
              <span>·</span>
              <span className="text-primary">{categoryName}</span>
            </>
          )}
        </div>

        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12">
          <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" priority sizes="100vw" />
        </div>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.body) }}
        />

        {related.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

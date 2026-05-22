import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface BlogPreviewItem {
  _id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  featuredImage?: string;
  publishDate?: Date | string;
  category?: { name?: string };
}

export function BlogPreview({ posts }: { posts: BlogPreviewItem[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-primary font-medium">Blog</span>
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">Latest Insights</h2>
          </div>
          <Link href="/blog" className="mt-4 md:mt-0 text-primary font-semibold hover:underline">
            View all posts →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.featuredImage || ""}
                  alt={post.title || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="33vw"
                />
              </div>
              <div className="p-6">
                {post.category?.name && (
                  <span className="text-xs font-medium text-primary">{post.category.name}</span>
                )}
                <h3 className="mt-2 text-lg font-bold group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                {post.publishDate && (
                  <p className="mt-4 text-xs text-muted-foreground">{formatDate(post.publishDate)}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

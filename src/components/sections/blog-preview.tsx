"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getPopulatedName } from "@/lib/mongoose-utils";
import type { BlogCard } from "@/types/content";
import type { SectionTitle } from "@/types/settings";

export function BlogPreview({
  posts,
  section,
}: {
  posts: BlogCard[];
  section?: SectionTitle;
}) {
  if (!posts.length) return null;

  return (
    <section className="py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {section?.eyebrow && <span className="eyebrow-pill">{section.eyebrow}</span>}
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {section?.title || "Latest Insights"}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.featuredImage || ""}
                    alt={post.title || ""}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="33vw"
                  />
                  {getPopulatedName(post.category) && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {getPopulatedName(post.category)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  {post.publishDate && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.publishDate)}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

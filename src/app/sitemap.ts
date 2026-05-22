import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { connectDB } from "@/lib/db";
import { Service, Blog, CaseStudy } from "@/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/case-studies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    await connectDB();
    const [services, blogs, caseStudies] = await Promise.all([
      Service.find({ status: "published" }).select("slug updatedAt").lean(),
      Blog.find({ status: "published" }).select("slug updatedAt").lean(),
      CaseStudy.find({ status: "published" }).select("slug updatedAt").lean(),
    ]);

    return [
      ...staticRoutes,
      ...services.map((s) => ({
        url: `${base}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...blogs.map((b) => ({
        url: `${base}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...caseStudies.map((c) => ({
        url: `${base}/case-studies/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

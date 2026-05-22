import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  author: z.string().min(2),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().url(),
  excerpt: z.string().min(10),
  body: z.string().min(20),
  publishDate: z.coerce.date().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;

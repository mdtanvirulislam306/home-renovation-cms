import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  fullDescription: z.string().min(20, "Full description is required"),
  keyBenefits: z.array(z.string()).default([]),
  featuredImage: z.string().url("Featured image is required"),
  galleryImages: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  displayOrder: z.coerce.number().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

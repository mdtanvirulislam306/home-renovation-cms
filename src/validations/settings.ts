import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a valid hex color");

const imagePath = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((val) => !val || val.startsWith("/") || /^https?:\/\//.test(val), {
    message: "Must be a valid URL or path",
  });

const sectionTitleSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  logo: imagePath,
  favicon: imagePath,
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
  accentColor: hexColor.optional(),
  heroBadge: z.string().optional(),
  heroTitle: z.string().optional(),
  heroHighlight: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: imagePath,
  heroCtaPrimary: z.string().optional(),
  heroCtaSecondary: z.string().optional(),
  stats: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.coerce.number(),
        suffix: z.string().default(""),
      })
    )
    .optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().default("shield"),
      })
    )
    .optional(),
  sectionTitles: z
    .object({
      services: sectionTitleSchema.optional(),
      caseStudies: sectionTitleSchema.optional(),
      blog: sectionTitleSchema.optional(),
      testimonials: sectionTitleSchema.optional(),
      contact: sectionTitleSchema.optional(),
      whyChooseUs: sectionTitleSchema.optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  seo: z
    .object({
      defaultTitle: z.string().optional(),
      defaultDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  analytics: z
    .object({
      googleAnalyticsId: z.string().optional(),
      googleTagManagerId: z.string().optional(),
    })
    .optional(),
  googleMapsEmbedUrl: z.string().url().optional().or(z.literal("")),
  googleReviewsUrl: z.string().url().optional().or(z.literal("")),
  heroVideoUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(val),
      { message: "Must be a valid YouTube URL" }
    ),
  smtp: z
    .object({
      host: z.string().optional(),
      port: z.coerce.number().optional(),
      secure: z.boolean().optional(),
      user: z.string().optional(),
      pass: z.string().optional(),
      from: z.string().optional(),
      adminEmail: z.string().email().optional().or(z.literal("")),
    })
    .optional(),
  about: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      storyTitle: z.string().optional(),
      storyContent: z.string().optional(),
      image: imagePath,
      imageAlt: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      showStats: z.boolean().optional(),
    })
    .optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a valid hex color");

const sectionTitleSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  favicon: z.string().url().optional().or(z.literal("")),
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
  heroImage: z.string().url().optional().or(z.literal("")),
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
  heroVideoUrl: z.string().url().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

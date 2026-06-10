import type { AboutContent } from "@/types/settings";

export const defaultAboutContent: AboutContent = {
  title: "",
  subtitle: "Passionate professionals dedicated to transforming outdoor spaces.",
  storyTitle: "Our Story",
  storyContent:
    "<p>Founded over 15 years ago, we have grown from a small local crew into a full-service landscaping and property maintenance company trusted by thousands of homeowners and businesses.</p><p>We believe every property deserves expert care — from lush gardens to pristine roofs, clean gutters, and flawless fencing. Our team combines craftsmanship with modern equipment to deliver results that exceed expectations.</p>",
  image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  imageAlt: "Our team at work",
  seoTitle: "",
  seoDescription: "",
  showStats: true,
};

export function mergeAboutContent(stored?: Partial<AboutContent> | null): AboutContent {
  return { ...defaultAboutContent, ...stored };
}

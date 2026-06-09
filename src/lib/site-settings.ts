import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/data";
import type { SiteSettings } from "@/types/settings";

const defaultSectionTitles = {
  services: {
    eyebrow: "What We Do",
    title: "Our Services",
    subtitle: "Comprehensive landscaping and property services tailored to your needs.",
  },
  caseStudies: { eyebrow: "Portfolio", title: "Featured Case Studies" },
  blog: { eyebrow: "Blog", title: "Latest Insights" },
  testimonials: { eyebrow: "Testimonials", title: "What Our Clients Say" },
  contact: {
    eyebrow: "Get In Touch",
    title: "Request a Free Quote",
    subtitle: "Tell us about your project and we'll get back to you within 24 hours.",
  },
  whyChooseUs: {
    eyebrow: "Why Choose Us",
    title: "The Trusted Choice for Property Excellence",
    subtitle:
      "With over 15 years of experience, we combine craftsmanship, reliability, and premium materials to deliver outstanding results.",
  },
};

export const defaultSiteSettings: SiteSettings = {
  siteName: siteConfig.name,
  tagline: "Premium Landscaping & Property Services",
  phone: siteConfig.links.phone,
  email: siteConfig.links.email,
  address: siteConfig.links.address,
  businessHours: "Mon–Sat: 7am – 6pm",
  primaryColor: "#3BAE41",
  secondaryColor: "#07140C",
  accentColor: "#C7F36B",
  heroBadge: "Premium Landscaping & Property Services",
  heroTitle: "Transform Your",
  heroHighlight: "Outdoor Space",
  heroSubtitle: siteConfig.description,
  heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
  heroCtaPrimary: "Get Free Quote",
  heroCtaSecondary: "Our Services",
  stats: [...siteConfig.stats],
  features: [
    {
      title: "Fully Insured",
      description:
        "Complete peace of mind with comprehensive insurance coverage on every project.",
      icon: "shield",
    },
    {
      title: "On-Time Delivery",
      description: "We respect your schedule and deliver projects on time, every time.",
      icon: "clock",
    },
    {
      title: "Award Winning",
      description:
        "Recognized excellence in landscaping and property services across the region.",
      icon: "award",
    },
    {
      title: "Eco-Friendly",
      description: "Sustainable practices and environmentally responsible solutions.",
      icon: "leaf",
    },
  ],
  sectionTitles: defaultSectionTitles,
  socialLinks: { ...siteConfig.social },
  seo: {
    defaultTitle: siteConfig.name,
    defaultDescription: siteConfig.description,
    keywords: [],
  },
  analytics: {},
  googleMapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiA3M8KwNTQnMDAuMCJX!5e0!3m2!1sen!2sus!4v1",
  googleReviewsUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL,
};

export function hexToHsl(hex: string): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function mergeSectionTitles(
  stored?: Partial<SiteSettings["sectionTitles"]>
): SiteSettings["sectionTitles"] {
  return {
    services: { ...defaultSectionTitles.services, ...stored?.services },
    caseStudies: { ...defaultSectionTitles.caseStudies, ...stored?.caseStudies },
    blog: { ...defaultSectionTitles.blog, ...stored?.blog },
    testimonials: { ...defaultSectionTitles.testimonials, ...stored?.testimonials },
    contact: { ...defaultSectionTitles.contact, ...stored?.contact },
    whyChooseUs: { ...defaultSectionTitles.whyChooseUs, ...stored?.whyChooseUs },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const stored = await getSettings();
    if (!stored) return defaultSiteSettings;

    return {
      siteName: stored.siteName || defaultSiteSettings.siteName,
      tagline: stored.tagline || defaultSiteSettings.tagline,
      logo: stored.logo || undefined,
      favicon: stored.favicon || undefined,
      phone: stored.phone || defaultSiteSettings.phone,
      email: stored.email || defaultSiteSettings.email,
      address: stored.address || defaultSiteSettings.address,
      businessHours: stored.businessHours || defaultSiteSettings.businessHours,
      primaryColor: stored.primaryColor || defaultSiteSettings.primaryColor,
      secondaryColor: stored.secondaryColor || defaultSiteSettings.secondaryColor,
      accentColor: stored.accentColor || defaultSiteSettings.accentColor,
      heroBadge: stored.heroBadge || defaultSiteSettings.heroBadge,
      heroTitle: stored.heroTitle || defaultSiteSettings.heroTitle,
      heroHighlight: stored.heroHighlight || defaultSiteSettings.heroHighlight,
      heroSubtitle: stored.heroSubtitle || defaultSiteSettings.heroSubtitle,
      heroImage: stored.heroImage || defaultSiteSettings.heroImage,
      heroCtaPrimary: stored.heroCtaPrimary || defaultSiteSettings.heroCtaPrimary,
      heroCtaSecondary: stored.heroCtaSecondary || defaultSiteSettings.heroCtaSecondary,
      stats: stored.stats?.length ? stored.stats : defaultSiteSettings.stats,
      features: stored.features?.length ? stored.features : defaultSiteSettings.features,
      sectionTitles: mergeSectionTitles(stored.sectionTitles),
      socialLinks: {
        ...defaultSiteSettings.socialLinks,
        ...stored.socialLinks,
      },
      seo: {
        defaultTitle: stored.seo?.defaultTitle || stored.siteName || defaultSiteSettings.seo.defaultTitle,
        defaultDescription:
          stored.seo?.defaultDescription || stored.tagline || defaultSiteSettings.seo.defaultDescription,
        keywords: stored.seo?.keywords || defaultSiteSettings.seo.keywords,
      },
      analytics: stored.analytics || defaultSiteSettings.analytics,
      googleMapsEmbedUrl: stored.googleMapsEmbedUrl || defaultSiteSettings.googleMapsEmbedUrl,
      googleReviewsUrl: stored.googleReviewsUrl || defaultSiteSettings.googleReviewsUrl,
    };
  } catch {
    return defaultSiteSettings;
  }
}

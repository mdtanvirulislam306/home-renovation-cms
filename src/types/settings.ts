export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface SectionTitle {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  storyTitle: string;
  storyContent: string;
  image: string;
  imageAlt: string;
  seoTitle?: string;
  seoDescription?: string;
  showStats: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroVideoUrl?: string;
  stats: StatItem[];
  features: FeatureItem[];
  sectionTitles: {
    services: SectionTitle;
    caseStudies: SectionTitle;
    blog: SectionTitle;
    testimonials: SectionTitle;
    contact: SectionTitle;
    whyChooseUs: SectionTitle;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  analytics: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
  };
  googleMapsEmbedUrl?: string;
  googleReviewsUrl?: string;
  about: AboutContent;
}

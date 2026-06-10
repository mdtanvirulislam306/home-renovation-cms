import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISettings extends Document {
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
  heroImage?: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  stats: { label: string; value: number; suffix: string }[];
  features: { title: string; description: string; icon: string }[];
  sectionTitles: {
    services: { eyebrow?: string; title?: string; subtitle?: string };
    caseStudies: { eyebrow?: string; title?: string; subtitle?: string };
    blog: { eyebrow?: string; title?: string; subtitle?: string };
    testimonials: { eyebrow?: string; title?: string; subtitle?: string };
    contact: { eyebrow?: string; title?: string; subtitle?: string };
    whyChooseUs: { eyebrow?: string; title?: string; subtitle?: string };
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
  heroVideoUrl?: string;
  about: {
    title?: string;
    subtitle?: string;
    storyTitle?: string;
    storyContent?: string;
    image?: string;
    imageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    showStats?: boolean;
  };
  smtp?: {
    host?: string;
    port?: number;
    secure?: boolean;
    user?: string;
    pass?: string;
    from?: string;
    adminEmail?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SectionTitleSchema = new Schema(
  {
    eyebrow: String,
    title: String,
    subtitle: String,
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "GreenScape Pro" },
    tagline: { type: String, default: "Premium Landscaping & Property Services" },
    logo: String,
    favicon: String,
    phone: String,
    email: String,
    address: String,
    businessHours: { type: String, default: "Mon–Sat: 7am – 6pm" },
    primaryColor: { type: String, default: "#3BAE41" },
    secondaryColor: { type: String, default: "#07140C" },
    accentColor: { type: String, default: "#C7F36B" },
    heroBadge: { type: String, default: "Premium Landscaping & Property Services" },
    heroTitle: { type: String, default: "Transform Your" },
    heroHighlight: { type: String, default: "Outdoor Space" },
    heroSubtitle: {
      type: String,
      default:
        "Expert landscaping, fencing, roof cleaning, and property maintenance. Trusted by 1,800+ homeowners across the region.",
    },
    heroImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    },
    heroCtaPrimary: { type: String, default: "Get Free Quote" },
    heroCtaSecondary: { type: String, default: "Our Services" },
    stats: {
      type: [
        {
          label: String,
          value: Number,
          suffix: String,
        },
      ],
      default: [
        { label: "Projects Completed", value: 2500, suffix: "+" },
        { label: "Happy Clients", value: 1800, suffix: "+" },
        { label: "Years Experience", value: 15, suffix: "+" },
        { label: "Team Members", value: 45, suffix: "+" },
      ],
    },
    features: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      default: [
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
    },
    sectionTitles: {
      services: {
        type: SectionTitleSchema,
        default: {
          eyebrow: "What We Do",
          title: "Our Services",
          subtitle: "Comprehensive landscaping and property services tailored to your needs.",
        },
      },
      caseStudies: {
        type: SectionTitleSchema,
        default: { eyebrow: "Portfolio", title: "Featured Case Studies" },
      },
      blog: {
        type: SectionTitleSchema,
        default: { eyebrow: "Blog", title: "Latest Insights" },
      },
      testimonials: {
        type: SectionTitleSchema,
        default: { eyebrow: "Testimonials", title: "What Our Clients Say" },
      },
      contact: {
        type: SectionTitleSchema,
        default: {
          eyebrow: "Get In Touch",
          title: "Request a Free Quote",
          subtitle: "Tell us about your project and we'll get back to you within 24 hours.",
        },
      },
      whyChooseUs: {
        type: SectionTitleSchema,
        default: {
          eyebrow: "Why Choose Us",
          title: "The Trusted Choice for Property Excellence",
          subtitle:
            "With over 15 years of experience, we combine craftsmanship, reliability, and premium materials to deliver outstanding results.",
        },
      },
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      keywords: [String],
    },
    analytics: {
      googleAnalyticsId: String,
      googleTagManagerId: String,
    },
    googleMapsEmbedUrl: String,
    googleReviewsUrl: String,
    heroVideoUrl: String,
    smtp: {
      host: String,
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: false },
      user: String,
      pass: String,
      from: String,
      adminEmail: String,
    },
    about: {
      title: { type: String, default: "" },
      subtitle: {
        type: String,
        default: "Passionate professionals dedicated to transforming outdoor spaces.",
      },
      storyTitle: { type: String, default: "Our Story" },
      storyContent: {
        type: String,
        default:
          "<p>Founded over 15 years ago, we have grown from a small local crew into a full-service landscaping and property maintenance company trusted by thousands of homeowners and businesses.</p><p>We believe every property deserves expert care — from lush gardens to pristine roofs, clean gutters, and flawless fencing. Our team combines craftsmanship with modern equipment to deliver results that exceed expectations.</p>",
      },
      image: {
        type: String,
        default: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      },
      imageAlt: { type: String, default: "Our team at work" },
      seoTitle: String,
      seoDescription: String,
      showStats: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;

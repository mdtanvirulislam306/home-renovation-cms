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
  heroImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "GreenScape Pro" },
    tagline: { type: String, default: "Premium Landscaping & Property Services" },
    logo: String,
    favicon: String,
    phone: String,
    email: String,
    address: String,
    businessHours: String,
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
    heroImage: String,
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;

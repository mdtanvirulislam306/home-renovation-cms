import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ContentStatus } from "@/types";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  client?: string;
  location?: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  featuredImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  services: string[];
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    client: String,
    location: String,
    summary: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: { type: String, required: true },
    featuredImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    beforeImage: String,
    afterImage: String,
    services: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

CaseStudySchema.index({ slug: 1 });
CaseStudySchema.index({ status: 1, createdAt: -1 });

const CaseStudy: Model<ICaseStudy> =
  mongoose.models.CaseStudy ||
  mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);

export default CaseStudy;

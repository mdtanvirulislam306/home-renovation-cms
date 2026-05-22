import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  featuredImage: string;
  galleryImages: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: ContentStatus;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    keyBenefits: [{ type: String }],
    featuredImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    seoTitle: String,
    seoDescription: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ status: 1, displayOrder: 1 });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;

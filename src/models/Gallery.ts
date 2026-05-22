import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IGallery extends Document {
  title: string;
  image: string;
  category?: string;
  beforeImage?: string;
  afterImage?: string;
  displayOrder: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: String,
    beforeImage: String,
    afterImage: String,
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

GallerySchema.index({ status: 1, displayOrder: 1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;

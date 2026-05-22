import mongoose, { Schema, type Document, type Model, Types } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IBlog extends Document {
  title: string;
  slug: string;
  author: string;
  category: Types.ObjectId;
  tags: string[];
  featuredImage: string;
  excerpt: string;
  body: string;
  publishDate: Date;
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    author: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    featuredImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
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

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, publishDate: -1 });
BlogSchema.index({ category: 1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;

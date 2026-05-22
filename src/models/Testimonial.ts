import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ContentStatus } from "@/types";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  displayOrder: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: String,
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: String,
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

TestimonialSchema.index({ status: 1, displayOrder: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;

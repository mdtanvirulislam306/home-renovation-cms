import mongoose, { Schema, type Document, type Model } from "mongoose";

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export interface InquiryReply {
  subject: string;
  message: string;
  sentBy: string;
  sentAt: Date;
}

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: InquiryStatus;
  replies: InquiryReply[];
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sentBy: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    service: String,
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    replies: { type: [ReplySchema], default: [] },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ email: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Inquiry) {
  delete mongoose.models.Inquiry;
}

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;

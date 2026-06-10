import mongoose, { Schema, type Document, type Model } from "mongoose";

export type ChatSender = "visitor" | "admin";
export type ChatStatus = "open" | "closed";

export interface IChatMessage {
  _id?: mongoose.Types.ObjectId;
  sender: ChatSender;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface IChat extends Document {
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  status: ChatStatus;
  messages: IChatMessage[];
  adminUnread: number;
  visitorUnread: number;
  visitorTypingAt?: Date | null;
  adminTypingAt?: Date | null;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema(
  {
    sender: { type: String, enum: ["visitor", "admin"], required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ChatSchema = new Schema<IChat>(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    visitorName: { type: String, required: true, trim: true },
    visitorEmail: { type: String, lowercase: true, trim: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    messages: { type: [ChatMessageSchema], default: [] },
    adminUnread: { type: Number, default: 0 },
    visitorUnread: { type: Number, default: 0 },
    visitorTypingAt: { type: Date, default: null },
    adminTypingAt: { type: Date, default: null },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChatSchema.index({ status: 1, lastMessageAt: -1 });
ChatSchema.index({ adminUnread: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Chat) {
  delete mongoose.models.Chat;
}

const Chat: Model<IChat> =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;

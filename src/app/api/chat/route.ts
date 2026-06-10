import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withTypingFlags } from "@/lib/chat-typing";
import { serializeForClient } from "@/lib/mongoose-utils";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { chatMessageSchema } from "@/validations/chat";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    if (!visitorId) return apiError("Visitor ID required", 400);

    await connectDB();
    const chat = await Chat.findOne({ visitorId }).lean();
    if (!chat) return apiSuccess(null);

    if (chat.visitorUnread > 0) {
      await Chat.findOneAndUpdate({ visitorId }, { visitorUnread: 0 });
      chat.visitorUnread = 0;
    }

    return apiSuccess(withTypingFlags(serializeForClient(chat)));
  } catch {
    return apiError("Failed to fetch chat", 500);
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "chat";
  const limit = rateLimit(ip);
  if (!limit.success) return apiError("Too many requests", 429);

  try {
    const body = await request.json();
    const parsed = chatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed", 400);
    }

    const { visitorId, visitorName, visitorEmail, message } = parsed.data;
    const content = sanitizeText(message);
    if (!content) return apiError("Message cannot be empty", 400);

    await connectDB();

    let chat = await Chat.findOne({ visitorId });

    if (!chat) {
      if (!visitorName?.trim()) {
        return apiError("Please enter your name to start chatting", 400);
      }
      chat = await Chat.create({
        visitorId,
        visitorName: sanitizeText(visitorName),
        visitorEmail: visitorEmail || undefined,
        messages: [],
      });
    } else if (visitorName?.trim()) {
      chat.visitorName = sanitizeText(visitorName);
      if (visitorEmail) chat.visitorEmail = visitorEmail;
    }

    chat.messages.push({
      sender: "visitor",
      senderName: chat.visitorName,
      content,
      createdAt: new Date(),
    });
    chat.adminUnread += 1;
    chat.visitorTypingAt = null;
    chat.lastMessageAt = new Date();
    chat.status = "open";
    await chat.save();

    return apiSuccess(withTypingFlags(serializeForClient(chat.toObject())));
  } catch {
    return apiError("Failed to send message", 500);
  }
}

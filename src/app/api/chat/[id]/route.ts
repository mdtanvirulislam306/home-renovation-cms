import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withTypingFlags } from "@/lib/chat-typing";
import { serializeForClient } from "@/lib/mongoose-utils";
import { sanitizeText } from "@/lib/sanitize";
import { chatReplySchema } from "@/validations/chat";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    await connectDB();

    const session = await getServerSession(authOptions);
    const chat = await Chat.findById(id).lean();

    if (!chat) return apiError("Conversation not found", 404);

    if (!session) {
      if (!visitorId || chat.visitorId !== visitorId) {
        return apiError("Unauthorized", 401);
      }
      if (chat.visitorUnread > 0) {
        await Chat.findByIdAndUpdate(id, { visitorUnread: 0 });
        chat.visitorUnread = 0;
      }
    } else if (chat.adminUnread > 0) {
      await Chat.findByIdAndUpdate(id, { adminUnread: 0 });
      chat.adminUnread = 0;
    }

    return apiSuccess(withTypingFlags(serializeForClient(chat)));
  } catch {
    return apiError("Failed to fetch conversation", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = chatReplySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed", 400);
    }

    const content = sanitizeText(parsed.data.message);
    if (!content) return apiError("Message cannot be empty", 400);

    await connectDB();
    const chat = await Chat.findById(id);
    if (!chat) return apiError("Conversation not found", 404);

    const senderName = session.user.name || "Support";

    chat.messages.push({
      sender: "admin",
      senderName,
      content,
      createdAt: new Date(),
    });
    chat.visitorUnread += 1;
    chat.adminTypingAt = null;
    chat.lastMessageAt = new Date();
    chat.status = "open";
    await chat.save();

    return apiSuccess(withTypingFlags(serializeForClient(chat.toObject())));
  } catch {
    return apiError("Failed to send reply", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const { status } = await request.json();

    await connectDB();
    const chat = await Chat.findByIdAndUpdate(
      id,
      { status: status === "closed" ? "closed" : "open" },
      { new: true }
    ).lean();

    if (!chat) return apiError("Conversation not found", 404);
    return apiSuccess(serializeForClient(chat));
  } catch {
    return apiError("Failed to update conversation", 500);
  }
}

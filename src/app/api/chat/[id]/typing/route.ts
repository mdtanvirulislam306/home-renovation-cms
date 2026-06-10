import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withTypingFlags } from "@/lib/chat-typing";
import { serializeForClient } from "@/lib/mongoose-utils";
import { chatTypingSchema } from "@/validations/chat";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const body = await request.json();
    const parsed = chatTypingSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed", 400);
    }

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;
    const isVisitor = !!visitorId;

    if (!isAdmin && !isVisitor) {
      return apiError("Unauthorized", 401);
    }

    await connectDB();
    const chat = await Chat.findById(id);
    if (!chat) return apiError("Conversation not found", 404);

    if (isVisitor && chat.visitorId !== visitorId) {
      return apiError("Unauthorized", 401);
    }

    if (isAdmin) {
      chat.adminTypingAt = parsed.data.typing ? new Date() : null;
    } else {
      chat.visitorTypingAt = parsed.data.typing ? new Date() : null;
    }

    await chat.save();

    return apiSuccess(withTypingFlags(serializeForClient(chat.toObject())));
  } catch {
    return apiError("Failed to update typing status", 500);
  }
}

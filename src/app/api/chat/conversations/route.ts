import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    await connectDB();
    const conversations = await Chat.find()
      .sort({ lastMessageAt: -1 })
      .select("visitorId visitorName visitorEmail status messages adminUnread visitorUnread lastMessageAt createdAt")
      .lean();

    const data = conversations.map((chat) => {
      const lastMsg = chat.messages?.[chat.messages.length - 1];
      return {
        _id: chat._id,
        visitorId: chat.visitorId,
        visitorName: chat.visitorName,
        visitorEmail: chat.visitorEmail,
        status: chat.status,
        adminUnread: chat.adminUnread,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        lastMessage: lastMsg
          ? { content: lastMsg.content, sender: lastMsg.sender, createdAt: lastMsg.createdAt }
          : null,
        messageCount: chat.messages?.length || 0,
      };
    });

    const unreadTotal = data.reduce((sum, c) => sum + (c.adminUnread || 0), 0);

    return apiSuccess({ conversations: data, unreadTotal });
  } catch {
    return apiError("Failed to fetch conversations", 500);
  }
}

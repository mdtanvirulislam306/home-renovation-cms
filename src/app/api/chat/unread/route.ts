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
    const result = await Chat.aggregate([
      { $group: { _id: null, unreadTotal: { $sum: "$adminUnread" } } },
    ]);

    const unreadTotal = result[0]?.unreadTotal ?? 0;
    return apiSuccess({ unreadTotal });
  } catch {
    return apiError("Failed to fetch unread count", 500);
  }
}

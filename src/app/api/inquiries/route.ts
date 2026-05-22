import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getPaginationRange } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const total = await Inquiry.countDocuments(filter);
    const { skip, totalPages } = getPaginationRange(page, limit, total);
    const data = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return apiSuccess({ data, total, page, limit, totalPages });
  } catch {
    return apiError("Failed to fetch inquiries", 500);
  }
}

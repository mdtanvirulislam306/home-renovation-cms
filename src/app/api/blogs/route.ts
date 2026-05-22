import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { blogSchema } from "@/validations/blog";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getPaginationRange } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const publicOnly = searchParams.get("public") === "true";

    const filter: Record<string, unknown> = publicOnly ? { status: "published" } : {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    const total = await Blog.countDocuments(filter);
    const { skip, totalPages } = getPaginationRange(page, limit, total);
    const data = await Blog.find(filter)
      .populate("category", "name slug")
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return apiSuccess({ data, total, page, limit, totalPages });
  } catch {
    return apiError("Failed to fetch blogs", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const blog = await Blog.create(parsed.data);
    return apiSuccess(blog, 201);
  } catch {
    return apiError("Failed to create blog", 500);
  }
}

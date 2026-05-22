import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { blogSchema } from "@/validations/blog";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findOne({ $or: [{ _id: id }, { slug: id }] })
      .populate("category", "name slug")
      .lean();
    if (!blog) return apiError("Blog not found", 404);
    return apiSuccess(blog);
  } catch {
    return apiError("Failed to fetch blog", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = blogSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const blog = await Blog.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!blog) return apiError("Blog not found", 404);
    return apiSuccess(blog);
  } catch {
    return apiError("Failed to update blog", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    await connectDB();
    await Blog.findByIdAndDelete(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete blog", 500);
  }
}

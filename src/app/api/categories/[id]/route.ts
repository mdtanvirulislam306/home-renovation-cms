import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { categorySchema } from "@/validations/category";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const category = await Category.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category);
  } catch {
    return apiError("Failed to update category", 500);
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
    await Category.findByIdAndDelete(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete category", 500);
  }
}

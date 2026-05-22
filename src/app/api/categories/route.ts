import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { categorySchema } from "@/validations/category";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    await connectDB();
    const data = await Category.find().sort({ name: 1 }).lean();
    return apiSuccess(data);
  } catch {
    return apiError("Failed to fetch categories", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const category = await Category.create(parsed.data);
    return apiSuccess(category, 201);
  } catch {
    return apiError("Failed to create category", 500);
  }
}

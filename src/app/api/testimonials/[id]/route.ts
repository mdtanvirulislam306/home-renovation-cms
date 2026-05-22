import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
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
    await connectDB();
    const item = await Testimonial.findByIdAndUpdate(id, body, { new: true });
    if (!item) return apiError("Not found", 404);
    return apiSuccess(item);
  } catch {
    return apiError("Failed to update", 500);
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
    await Testimonial.findByIdAndDelete(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete", 500);
  }
}

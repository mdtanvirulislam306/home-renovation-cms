import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { apiError, apiSuccess } from "@/lib/api-response";

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
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!inquiry) return apiError("Inquiry not found", 404);
    return apiSuccess(inquiry);
  } catch {
    return apiError("Failed to update inquiry", 500);
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
    await Inquiry.findByIdAndDelete(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete inquiry", 500);
  }
}

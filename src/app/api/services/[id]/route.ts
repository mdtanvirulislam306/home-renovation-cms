import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { serviceSchema } from "@/validations/service";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const service = await Service.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();

    if (!service) return apiError("Service not found", 404);
    return apiSuccess(service);
  } catch {
    return apiError("Failed to fetch service", 500);
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
    const parsed = serviceSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const service = await Service.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!service) return apiError("Service not found", 404);
    return apiSuccess(service);
  } catch {
    return apiError("Failed to update service", 500);
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
    const service = await Service.findByIdAndDelete(id);
    if (!service) return apiError("Service not found", 404);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete service", 500);
  }
}

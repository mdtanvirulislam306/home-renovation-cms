import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { serviceSchema } from "@/validations/service";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getPaginationRange } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const publicOnly = searchParams.get("public") === "true";

    const filter: Record<string, unknown> = {};
    if (publicOnly || !searchParams.get("admin")) {
      filter.status = "published";
    } else if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Service.countDocuments(filter);
    const { skip, totalPages } = getPaginationRange(page, limit, total);
    const data = await Service.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return apiSuccess({ data, total, page, limit, totalPages });
  } catch {
    return apiError("Failed to fetch services", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const existing = await Service.findOne({ slug: parsed.data.slug });
    if (existing) return apiError("Slug already exists");

    const service = await Service.create(parsed.data);
    return apiSuccess(service, 201);
  } catch {
    return apiError("Failed to create service", 500);
  }
}

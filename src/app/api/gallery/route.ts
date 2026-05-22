import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { apiError, apiSuccess } from "@/lib/api-response";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(2),
  image: z.string().url(),
  category: z.string().optional(),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const publicOnly = new URL(request.url).searchParams.get("public") === "true";
    const filter = publicOnly ? { status: "published" } : {};
    const data = await Gallery.find(filter).sort({ displayOrder: 1 }).lean();
    return apiSuccess(data);
  } catch {
    return apiError("Failed to fetch gallery", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = gallerySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const item = await Gallery.create(parsed.data);
    return apiSuccess(item, 201);
  } catch {
    return apiError("Failed to create gallery item", 500);
  }
}

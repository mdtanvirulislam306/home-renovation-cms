import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { apiError, apiSuccess } from "@/lib/api-response";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  content: z.string().min(10),
  rating: z.coerce.number().min(1).max(5).default(5),
  image: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const publicOnly = new URL(request.url).searchParams.get("public") === "true";
    const filter = publicOnly ? { status: "published" } : {};
    const data = await Testimonial.find(filter).sort({ displayOrder: 1 }).lean();
    return apiSuccess(data);
  } catch {
    return apiError("Failed to fetch testimonials", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const item = await Testimonial.create(parsed.data);
    return apiSuccess(item, 201);
  } catch {
    return apiError("Failed to create testimonial", 500);
  }
}

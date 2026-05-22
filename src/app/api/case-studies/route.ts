import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getPaginationRange } from "@/lib/utils";
import { z } from "zod";

const caseStudySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  client: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().min(10),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  results: z.string().min(10),
  featuredImage: z.string().url(),
  galleryImages: z.array(z.string()).default([]),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  services: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const publicOnly = searchParams.get("public") === "true";

    const filter = publicOnly ? { status: "published" } : {};
    const total = await CaseStudy.countDocuments(filter);
    const { skip, totalPages } = getPaginationRange(page, limit, total);
    const data = await CaseStudy.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return apiSuccess({ data, total, page, limit, totalPages });
  } catch {
    return apiError("Failed to fetch case studies", 500);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = caseStudySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0]?.message || "Validation failed");

    await connectDB();
    const item = await CaseStudy.create(parsed.data);
    return apiSuccess(item, 201);
  } catch {
    return apiError("Failed to create case study", 500);
  }
}

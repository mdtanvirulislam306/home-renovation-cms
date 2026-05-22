import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { apiError, apiSuccess } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const ip = request.headers.get("x-forwarded-for") || "upload";
  const limit = rateLimit(ip);
  if (!limit.success) return apiError("Too many requests", 429);

  try {
    const body = await request.json();
    const { file, folder } = body as { file: string; folder?: string };

    if (!file) return apiError("No file provided");

    const result = await uploadImage(file, folder);
    return apiSuccess(result);
  } catch {
    return apiError("Upload failed", 500);
  }
}

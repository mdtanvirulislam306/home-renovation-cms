import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";
import { uploadImageLocal } from "@/lib/local-upload";
import { apiError, apiSuccess } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getBase64Size(base64: string): number {
  const data = base64.split(",")[1] || base64;
  return Math.ceil((data.length * 3) / 4);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const ip = request.headers.get("x-forwarded-for") || "upload";
  const limit = rateLimit(ip);
  if (!limit.success) return apiError("Too many requests", 429);

  try {
    const body = await request.json();
    const { file, folder } = body as { file: string; folder?: string };

    if (!file) return apiError("No file provided", 400);

    if (!file.startsWith("data:image/")) {
      return apiError("Only image files are allowed", 400);
    }

    if (getBase64Size(file) > MAX_FILE_SIZE) {
      return apiError("Image must be smaller than 10MB", 400);
    }

    const useCloudinary = isCloudinaryConfigured();

    if (process.env.NODE_ENV === "development") {
      console.info(`[upload] Using ${useCloudinary ? "cloudinary" : "local"} storage`);
    }

    let result: { url: string; publicId: string };

    try {
      result = useCloudinary
        ? await uploadImage(file, folder)
        : await uploadImageLocal(file, folder);
    } catch (cloudinaryError) {
      if (!useCloudinary) throw cloudinaryError;

      console.warn("[upload] Cloudinary failed, falling back to local storage");
      result = await uploadImageLocal(file, folder);
    }

    return apiSuccess(result);
  } catch (error) {
    const message = getErrorMessage(error);

    if (process.env.NODE_ENV === "development") {
      console.error("[upload]", message, error);
    }

    return apiError(message, 500);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { message?: string; error?: { message?: string } };
    if (err.error?.message) return err.error.message;
    if (err.message) return err.message;
  }
  return "Upload failed";
}

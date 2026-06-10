import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import Settings from "@/models/Settings";
import { contactSchema } from "@/validations/contact";
import { sendInquiryNotification } from "@/lib/email";
import { sanitizeText } from "@/lib/sanitize";
import { apiError, apiSuccess } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "contact";
  const limit = rateLimit(ip);
  if (!limit.success) return apiError("Too many requests. Please try again later.", 429);

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed");
    }

    const data = {
      name: sanitizeText(parsed.data.name),
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone ? sanitizeText(parsed.data.phone) : undefined,
      service: parsed.data.service ? sanitizeText(parsed.data.service) : undefined,
      message: sanitizeText(parsed.data.message),
    };

    await connectDB();
    const inquiry = await Inquiry.create(data);

    try {
      const settings = await Settings.findOne().lean();
      await sendInquiryNotification({ ...data, siteName: settings?.siteName });
    } catch {
      // Inquiry saved even if email fails
    }

    return apiSuccess({ id: inquiry._id }, 201);
  } catch {
    return apiError("Failed to submit inquiry", 500);
  }
}

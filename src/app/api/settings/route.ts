import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeForClient } from "@/lib/mongoose-utils";
import Settings from "@/models/Settings";
import { apiError, apiSuccess } from "@/lib/api-response";
import { settingsSchema } from "@/validations/settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      await Settings.create({});
      settings = await Settings.findOne().lean();
    }
    return apiSuccess(serializeForClient(settings));
  } catch {
    return apiError("Failed to fetch settings", 500);
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "editor") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed", 400);
    }

    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true }
    ).lean();
    return apiSuccess(serializeForClient(settings));
  } catch {
    return apiError("Failed to update settings", 500);
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mergeAboutContent } from "@/lib/about-defaults";
import { connectDB } from "@/lib/db";
import { isMaskedPassword, maskSmtpForClient } from "@/lib/smtp-config";
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
    const serialized = serializeForClient(settings);
    const withAbout = {
      ...serialized,
      about: mergeAboutContent(serialized?.about),
    };
    return apiSuccess(maskSmtpForClient(withAbout));
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
    const existing = await Settings.findOne().lean();
    const updateData = { ...parsed.data };

    if (updateData.smtp) {
      const pass = updateData.smtp.pass;
      if (!pass || isMaskedPassword(pass)) {
        updateData.smtp = {
          ...updateData.smtp,
          pass: existing?.smtp?.pass || process.env.SMTP_PASS || "",
        };
      }
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    ).lean();

    const serialized = serializeForClient(settings);
    return apiSuccess(
      maskSmtpForClient({
        ...serialized,
        about: mergeAboutContent(serialized?.about),
      })
    );
  } catch {
    return apiError("Failed to update settings", 500);
  }
}

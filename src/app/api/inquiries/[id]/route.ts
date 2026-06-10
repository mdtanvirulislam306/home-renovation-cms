import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { sendInquiryReply } from "@/lib/email";
import Inquiry from "@/models/Inquiry";
import Settings from "@/models/Settings";
import { apiError, apiSuccess } from "@/lib/api-response";
import { serializeForClient } from "@/lib/mongoose-utils";
import { inquiryReplySchema } from "@/validations/inquiry";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    await connectDB();
    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) return apiError("Inquiry not found", 404);

    if (inquiry.status === "new") {
      await Inquiry.findByIdAndUpdate(id, { status: "read" });
      inquiry.status = "read";
    }

    return apiSuccess(serializeForClient(inquiry));
  } catch {
    return apiError("Failed to fetch inquiry", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const { status } = await request.json();
    await connectDB();
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!inquiry) return apiError("Inquiry not found", 404);
    return apiSuccess(serializeForClient(inquiry));
  } catch {
    return apiError("Failed to update inquiry", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = inquiryReplySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Validation failed", 400);
    }

    await connectDB();
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return apiError("Inquiry not found", 404);

    const settings = await Settings.findOne().lean();
    const siteName = settings?.siteName || "GreenScape Pro";

    await sendInquiryReply({
      to: inquiry.email,
      toName: inquiry.name,
      subject: parsed.data.subject,
      message: parsed.data.message,
      originalMessage: inquiry.message,
      siteName,
    });

    const reply = {
      subject: parsed.data.subject,
      message: parsed.data.message,
      sentBy: session.user.email || session.user.name || "Admin",
      sentAt: new Date(),
    };

    inquiry.replies.push(reply);
    inquiry.status = "replied";
    await inquiry.save();

    return apiSuccess(serializeForClient(inquiry.toObject()));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send reply";
    return apiError(message, 500);
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
    await Inquiry.findByIdAndDelete(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete inquiry", 500);
  }
}

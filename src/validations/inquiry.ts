import { z } from "zod";

export const inquiryReplySchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InquiryReplyInput = z.infer<typeof inquiryReplySchema>;

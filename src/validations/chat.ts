import { z } from "zod";

export const chatMessageSchema = z.object({
  visitorId: z.string().min(8, "Invalid session"),
  visitorName: z.string().min(2, "Name is required").optional(),
  visitorEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1, "Message cannot be empty").max(2000),
});

export const chatReplySchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000),
});

export const chatTypingSchema = z.object({
  typing: z.boolean(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatReplyInput = z.infer<typeof chatReplySchema>;

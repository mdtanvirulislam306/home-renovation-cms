const TYPING_TIMEOUT_MS = 4000;

export function isActivelyTyping(
  typingAt: Date | string | null | undefined
): boolean {
  if (!typingAt) return false;
  const parsed = new Date(typingAt);
  if (Number.isNaN(parsed.getTime())) return false;
  return Date.now() - parsed.getTime() < TYPING_TIMEOUT_MS;
}

export function withTypingFlags<T extends {
  visitorTypingAt?: Date | string | null;
  adminTypingAt?: Date | string | null;
}>(chat: T) {
  const { visitorTypingAt, adminTypingAt, ...rest } = chat;
  return {
    ...rest,
    visitorTyping: isActivelyTyping(visitorTypingAt),
    adminTyping: isActivelyTyping(adminTypingAt),
  };
}

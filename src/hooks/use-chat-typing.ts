"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseChatTypingOptions {
  chatId?: string | null;
  visitorId?: string;
  enabled?: boolean;
  inputValue: string;
}

export function useChatTyping({
  chatId,
  visitorId,
  enabled = true,
  inputValue,
}: UseChatTypingOptions) {
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPingRef = useRef(0);
  const isTypingRef = useRef(false);

  const sendTyping = useCallback(
    async (typing: boolean) => {
      if (!chatId || !enabled) return;

      const url = visitorId
        ? `/api/chat/${chatId}/typing?visitorId=${encodeURIComponent(visitorId)}`
        : `/api/chat/${chatId}/typing`;

      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typing }),
        });
      } catch {
        // Non-critical — ignore network errors for typing pings
      }
    },
    [chatId, visitorId, enabled]
  );

  useEffect(() => {
    if (!chatId || !enabled) return;

    if (!inputValue.trim()) {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        void sendTyping(false);
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      return;
    }

    const now = Date.now();
    if (!isTypingRef.current || now - lastPingRef.current > 2000) {
      isTypingRef.current = true;
      lastPingRef.current = now;
      void sendTyping(true);
    }

    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    stopTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      void sendTyping(false);
    }, 3000);

    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    };
  }, [chatId, enabled, inputValue, sendTyping]);

  const clearTyping = useCallback(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      void sendTyping(false);
    }
  }, [sendTyping]);

  useEffect(() => {
    return () => {
      if (isTypingRef.current) void sendTyping(false);
    };
  }, [sendTyping]);

  return { clearTyping };
}

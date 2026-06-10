"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatTime } from "@/lib/utils";
import { TypingIndicator } from "@/components/shared/typing-indicator";
import { useChatTyping } from "@/hooks/use-chat-typing";

const VISITOR_ID_KEY = "chat_visitor_id";
const VISITOR_NAME_KEY = "chat_visitor_name";

interface ChatMessage {
  _id?: string;
  sender: "visitor" | "admin";
  senderName: string;
  content: string;
  createdAt: string;
}

interface ChatData {
  _id: string;
  visitorId: string;
  visitorName: string;
  messages: ChatMessage[];
  visitorUnread: number;
  adminTyping?: boolean;
  status: string;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getStoredName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(VISITOR_NAME_KEY) || "";
}

export function ChatWidget({ siteName = "Support" }: { siteName?: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [message, setMessage] = useState("");
  const [hasName, setHasName] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisitorId(getVisitorId());
    const name = getStoredName();
    if (name) {
      setVisitorName(name);
      setHasName(true);
    }
  }, []);

  const { data: chat } = useQuery({
    queryKey: ["visitor-chat", visitorId],
    queryFn: async () => {
      const res = await fetch(`/api/chat?visitorId=${visitorId}`);
      const json = await res.json();
      return (json.data as ChatData | null) ?? null;
    },
    enabled: !!visitorId && open,
    refetchInterval: open ? 3000 : false,
  });

  const unread = chat?.visitorUnread ?? 0;

  const { clearTyping } = useChatTyping({
    chatId: chat?._id,
    visitorId,
    enabled: open && !!chat?._id,
    inputValue: message,
  });

  useEffect(() => {
    if (open && chat?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, chat?.messages?.length]);

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          visitorName: hasName ? visitorName : visitorName.trim(),
          message: text,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as ChatData;
    },
    onSuccess: (data) => {
      clearTyping();
      queryClient.setQueryData(["visitor-chat", visitorId], data);
      setMessage("");
      if (!hasName && visitorName.trim()) {
        localStorage.setItem(VISITOR_NAME_KEY, visitorName.trim());
        setHasName(true);
      }
    },
  });

  const handleSend = () => {
    const text = message.trim();
    if (!text || sendMessage.isPending) return;
    if (!hasName && !visitorName.trim()) return;
    sendMessage.mutate(text);
  };

  const startChat = () => {
    if (!visitorName.trim()) return;
    localStorage.setItem(VISITOR_NAME_KEY, visitorName.trim());
    setHasName(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[420px] w-[340px] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:w-[380px]">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-semibold">Chat with us</p>
              <p className="text-xs opacity-90">We typically reply within minutes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!hasName && !chat ? (
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
              <p className="text-sm text-muted-foreground">
                Enter your name to start a conversation with {siteName}.
              </p>
              <Input
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Your name"
                onKeyDown={(e) => e.key === "Enter" && startChat()}
              />
              <Button onClick={startChat} disabled={!visitorName.trim()}>
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {chat?.messages?.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Send a message — we&apos;re here to help!
                  </p>
                )}
                {chat?.messages?.map((msg, i) => (
                  <div
                    key={msg._id || i}
                    className={cn(
                      "flex",
                      msg.sender === "visitor" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                        msg.sender === "visitor"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      )}
                    >
                      {msg.sender === "admin" && (
                        <p className="mb-0.5 text-xs font-medium opacity-70">{msg.senderName}</p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={cn(
                          "mt-1 text-[10px] opacity-60",
                          msg.sender === "visitor" ? "text-right" : "text-left"
                        )}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {chat?.adminTyping && (
                  <div className="flex justify-start">
                    <TypingIndicator label="Support is typing" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={sendMessage.isPending}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!message.trim() || sendMessage.isPending}
                    aria-label="Send message"
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105",
          open && "rotate-0"
        )}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}

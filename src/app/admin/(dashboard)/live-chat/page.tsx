"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { TypingIndicator } from "@/components/shared/typing-indicator";
import { useChatTyping } from "@/hooks/use-chat-typing";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Loader2,
  X,
  User,
  Mail,
  Archive,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  _id?: string;
  sender: "visitor" | "admin";
  senderName: string;
  content: string;
  createdAt: string;
}

interface ConversationPreview {
  _id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  status: string;
  adminUnread: number;
  lastMessageAt: string;
  lastMessage?: { content: string; sender: string; createdAt: string } | null;
  messageCount: number;
}

interface ChatDetail {
  _id: string;
  visitorName: string;
  visitorEmail?: string;
  status: string;
  messages: ChatMessage[];
  visitorTyping?: boolean;
}

export default function AdminLiveChatPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: async () => {
      const res = await fetch("/api/chat/conversations");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as { conversations: ConversationPreview[]; unreadTotal: number };
    },
    refetchInterval: 3000,
  });

  const { data: chatDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["chat-detail", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${selectedId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as ChatDetail;
    },
    enabled: !!selectedId,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (selectedId) {
      queryClient.invalidateQueries({ queryKey: ["chat-unread"] });
    }
  }, [selectedId, queryClient]);

  const { clearTyping } = useChatTyping({
    chatId: selectedId,
    enabled: !!selectedId && chatDetail?.status === "open",
    inputValue: reply,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatDetail?.messages?.length, chatDetail?.visitorTyping]);

  const sendReply = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/chat/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      clearTyping();
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["chat-detail", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-unread"] });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to send"),
  });

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/chat/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-detail", selectedId] });
      toast.success("Conversation updated");
    },
  });

  const conversations = data?.conversations || [];
  const unreadTotal = data?.unreadTotal || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Support</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Live Chat</h1>
          <p className="mt-1 text-muted-foreground">
            Reply to website visitors in real time.
          </p>
        </div>
        {unreadTotal > 0 && (
          <Badge variant="accent" className="text-sm px-3 py-1">
            {unreadTotal} unread
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))
          ) : conversations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No conversations yet. Visitors can chat from the website widget.
              </CardContent>
            </Card>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                type="button"
                onClick={() => setSelectedId(conv._id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md",
                  selectedId === conv._id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "bg-card",
                  conv.adminUnread > 0 && selectedId !== conv._id && "border-primary/40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{conv.visitorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {conv.messageCount} messages
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {conv.adminUnread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {conv.adminUnread}
                      </span>
                    )}
                    <Badge
                      variant={conv.status === "open" ? "default" : "outline"}
                      className="text-[10px] capitalize"
                    >
                      {conv.status}
                    </Badge>
                  </div>
                </div>
                {conv.lastMessage && (
                  <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                    {conv.lastMessage.sender === "admin" ? "You: " : ""}
                    {conv.lastMessage.content}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(conv.lastMessageAt)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {!selectedId ? (
            <Card className="flex min-h-[500px] items-center justify-center border-dashed">
              <CardContent className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 font-medium">Select a conversation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a chat from the left to start replying.
                </p>
              </CardContent>
            </Card>
          ) : detailLoading ? (
            <Skeleton className="min-h-[500px] rounded-2xl" />
          ) : chatDetail ? (
            <Card className="flex min-h-[500px] flex-col overflow-hidden">
              <CardHeader className="shrink-0 border-b bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{chatDetail.visitorName}</CardTitle>
                    {chatDetail.visitorEmail && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {chatDetail.visitorEmail}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {chatDetail.status === "open" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus.mutate("closed")}
                      >
                        <Archive className="mr-2 h-3.5 w-3.5" />
                        Close
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus.mutate("open")}
                      >
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                        Reopen
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setSelectedId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-0">
                <div className="flex-1 space-y-3 overflow-y-auto p-4 min-h-[320px] max-h-[400px]">
                  {chatDetail.messages.map((msg, i) => (
                    <div
                      key={msg._id || i}
                      className={cn(
                        "flex",
                        msg.sender === "admin" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                          msg.sender === "admin"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        <p className="mb-0.5 flex items-center gap-1 text-xs font-medium opacity-70">
                          {msg.sender === "visitor" ? (
                            <><User className="h-3 w-3" /> {msg.senderName}</>
                          ) : (
                            msg.senderName
                          )}
                        </p>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="mt-1 text-[10px] opacity-60">{formatTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {chatDetail.visitorTyping && (
                    <div className="flex justify-start">
                      <TypingIndicator
                        label={`${chatDetail.visitorName} is typing`}
                      />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="shrink-0 border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && reply.trim()) {
                          sendReply.mutate(reply.trim());
                        }
                      }}
                      disabled={sendReply.isPending || chatDetail.status === "closed"}
                    />
                    <Button
                      onClick={() => sendReply.mutate(reply.trim())}
                      disabled={
                        !reply.trim() ||
                        sendReply.isPending ||
                        chatDetail.status === "closed"
                      }
                    >
                      {sendReply.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {chatDetail.status === "closed" && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Conversation is closed. Reopen to send messages.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

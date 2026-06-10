"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Mail,
  Search,
  Calendar,
  Phone,
  Wrench,
  MessageSquare,
  Inbox,
  Reply,
  Archive,
  Send,
  Loader2,
  X,
  User,
} from "lucide-react";

interface InquiryReply {
  _id?: string;
  subject: string;
  message: string;
  sentBy: string;
  sentAt: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  status: string;
  createdAt: string;
  message: string;
  replies?: InquiryReply[];
}

const STATUS_FILTERS = ["all", "new", "read", "replied", "archived"] as const;

function statusVariant(status: string): "default" | "secondary" | "outline" | "accent" {
  if (status === "new") return "accent";
  if (status === "read") return "default";
  if (status === "replied") return "secondary";
  return "outline";
}

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries?limit=100");
      const json = await res.json();
      return (json.data?.data || []) as Inquiry[];
    },
  });

  const { data: selectedInquiry, isLoading: detailLoading } = useQuery({
    queryKey: ["inquiry", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/inquiries/${selectedId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as Inquiry;
    },
    enabled: !!selectedId,
  });

  useEffect(() => {
    if (selectedInquiry) {
      setReplySubject(`Re: Your inquiry${selectedInquiry.service ? ` — ${selectedInquiry.service}` : ""}`);
      setReplyMessage("");
    }
  }, [selectedInquiry?._id]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", selectedId] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const sendReply = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/inquiries/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as Inquiry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", selectedId] });
      setReplyMessage("");
      toast.success("Reply sent successfully");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send reply"),
  });

  const items = data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      new: items.filter((i) => i.status === "new").length,
      replied: items.filter((i) => i.status === "replied").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((inquiry) => {
      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
      const matchesSearch =
        !query ||
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        inquiry.service?.toLowerCase().includes(query) ||
        inquiry.message.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    queryClient.invalidateQueries({ queryKey: ["inquiry", id] });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Mail className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Leads</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Inquiries</h1>
        <p className="mt-1 text-muted-foreground">
          Read queries, reply by email, and track conversation history.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Inquiries", value: stats.total, icon: Inbox },
          { label: "New", value: stats.new, icon: MessageSquare },
          { label: "Replied", value: stats.replied, icon: Reply },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-12" />
                ) : (
                  <p className="mt-1 text-3xl font-bold">{value}</p>
                )}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="rounded-full capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No inquiries found.
              </CardContent>
            </Card>
          ) : (
            filtered.map((inquiry) => (
              <button
                key={inquiry._id}
                type="button"
                onClick={() => handleSelect(inquiry._id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md",
                  selectedId === inquiry._id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{inquiry.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{inquiry.email}</p>
                  </div>
                  <Badge variant={statusVariant(inquiry.status)} className="shrink-0 capitalize">
                    {inquiry.status}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{inquiry.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(inquiry.createdAt)}</p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {!selectedId ? (
            <Card className="flex h-full min-h-[400px] items-center justify-center border-dashed">
              <CardContent className="text-center">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 font-medium">Select an inquiry</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click a query on the left to read and reply.
                </p>
              </CardContent>
            </Card>
          ) : detailLoading ? (
            <Skeleton className="min-h-[500px] rounded-2xl" />
          ) : selectedInquiry ? (
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{selectedInquiry.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedInquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(selectedInquiry.status)} className="capitalize">
                      {selectedInquiry.status}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {selectedInquiry.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {selectedInquiry.phone}
                    </span>
                  )}
                  {selectedInquiry.service && (
                    <span className="flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5" /> {selectedInquiry.service}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(selectedInquiry.createdAt)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedInquiry.status !== "archived" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatus.mutate({ id: selectedInquiry._id, status: "archived" })
                      }
                    >
                      <Archive className="mr-2 h-3.5 w-3.5" />
                      Archive
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                <div className="rounded-xl bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Customer Message
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedInquiry.message}</p>
                </div>

                {(selectedInquiry.replies?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Reply className="h-4 w-4 text-primary" />
                      Sent Replies ({selectedInquiry.replies?.length})
                    </h3>
                    {selectedInquiry.replies?.map((reply, index) => (
                      <div
                        key={reply._id || index}
                        className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-sm">{reply.subject}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(reply.sentAt)}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">By {reply.sentBy}</p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 rounded-xl border p-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Send className="h-4 w-4 text-primary" />
                    Send Reply
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="reply-subject">Subject</Label>
                    <Input
                      id="reply-subject"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="Re: Your inquiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reply-message">Message</Label>
                    <Textarea
                      id="reply-message"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write your reply to the customer..."
                      className="min-h-[140px]"
                    />
                  </div>
                  <Button
                    onClick={() => sendReply.mutate()}
                    disabled={!replySubject.trim() || !replyMessage.trim() || sendReply.isPending}
                  >
                    {sendReply.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

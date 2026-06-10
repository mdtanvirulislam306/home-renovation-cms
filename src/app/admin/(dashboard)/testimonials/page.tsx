"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Quote, Plus, X, Loader2, Search } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
  status?: string;
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      return ((await res.json()).data || []) as Testimonial[];
    },
  });

  const resetForm = () => {
    setForm({ name: "", role: "", content: "", rating: 5 });
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "published" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      resetForm();
      toast.success(editingId ? "Testimonial updated" : "Testimonial added");
    },
    onError: () => toast.error("Failed to save testimonial"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const startEdit = (t: Testimonial) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      role: t.role || "",
      content: t.content,
      rating: t.rating || 5,
    });
  };

  const items = data || [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.role?.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query)
    );
  }, [items, search]);

  const avgRating = useMemo(() => {
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, t) => acc + (t.rating || 5), 0);
    return (sum / items.length).toFixed(1);
  }, [items]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Star className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Social Proof</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Testimonials</h1>
        <p className="mt-1 text-muted-foreground">
          Collect and showcase client reviews to build trust with visitors.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-12" />
              ) : (
                <p className="mt-1 text-3xl font-bold">{items.length}</p>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
              <Quote className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-12" />
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-3xl font-bold">{avgRating}</p>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Update the client review details below."
                : "Add a new client review to display on your site."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                placeholder="Sarah Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                placeholder="Homeowner"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Review</Label>
              <Textarea
                id="content"
                placeholder="Share what the client said about your work..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating
                rating={form.rating}
                onChange={(rating) => setForm({ ...form, rating })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => save.mutate()}
                disabled={!form.name.trim() || !form.content.trim() || save.isPending}
                className="flex-1"
              >
                {save.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  "Update"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search testimonials..."
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Quote className="h-10 w-10 text-muted-foreground/40" />
                <h2 className="mt-4 font-semibold">
                  {items.length === 0 ? "No testimonials yet" : "No matching testimonials"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {items.length === 0
                    ? "Add your first client review to build credibility."
                    : "Try a different search term."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((t) => (
                <Card
                  key={t._id}
                  className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
                  <CardContent className="space-y-4 p-5">
                    <StarRating rating={t.rating || 5} />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        {t.role && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {t.role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(t)}
                          aria-label={`Edit ${t.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`Delete testimonial from "${t.name}"?`))
                              remove.mutate(t._id);
                          }}
                          aria-label={`Delete ${t.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

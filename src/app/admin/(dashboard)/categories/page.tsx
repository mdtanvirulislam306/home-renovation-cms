"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import slugify from "slugify";
import {
  FolderOpen,
  Pencil,
  Trash2,
  Plus,
  Search,
  Tag,
  X,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return (json.data || []) as Category[];
    },
  });

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const slug = slugify(name, { lower: true, strict: true });
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      toast.success(editingId ? "Category updated" : "Category created");
    },
    onError: () => toast.error("Failed to save category"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
  };

  const items = data || [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)
    );
  }, [items, search]);

  const previewSlug = name ? slugify(name, { lower: true, strict: true }) : "";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <FolderOpen className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Organization</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-muted-foreground">
          Organize blog posts with categories for easier browsing and filtering.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Edit Category" : "Add Category"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Update the category name. The slug updates automatically."
                : "Create a new category for your blog posts."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Landscaping Tips"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) save.mutate();
                }}
              />
            </div>
            {previewSlug && (
              <p className="text-sm text-muted-foreground">
                Slug: <span className="font-mono text-foreground">/{previewSlug}</span>
              </p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => save.mutate()}
                disabled={!name.trim() || save.isPending}
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
          <div className="flex items-center justify-between gap-4">
            <Card className="flex-1">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Total Categories</p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-1 text-3xl font-bold">{items.length}</p>
                  )}
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                <h2 className="mt-4 font-semibold">
                  {items.length === 0 ? "No categories yet" : "No matching categories"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {items.length === 0
                    ? "Add your first category to organize blog content."
                    : "Try a different search term."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((category) => (
                <Card
                  key={category._id}
                  className="group transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{category.name}</p>
                      <Badge variant="outline" className="mt-1.5 font-mono text-xs">
                        /{category.slug}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(category)}
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete "${category.name}"?`)) remove.mutate(category._id);
                        }}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

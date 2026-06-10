"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Search,
  ExternalLink,
  Calendar,
  User,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  status: string;
  publishDate?: string;
  featuredImage?: string;
  category?: { _id: string; name: string; slug: string } | string;
}

const STATUS_FILTERS = ["all", "published", "draft", "archived"] as const;

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

function getCategoryName(category: Blog["category"]): string | undefined {
  if (!category) return undefined;
  return typeof category === "string" ? undefined : category.name;
}

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/blogs?limit=100");
      const json = await res.json();
      return (json.data?.data || []) as Blog[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post deleted");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const items = data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((b) => b.status === "published").length,
      draft: items.filter((b) => b.status === "draft").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((blog) => {
      const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
      const categoryName = getCategoryName(blog.category)?.toLowerCase() || "";
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        categoryName.includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Content</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-muted-foreground">
            Create, edit, and publish articles for your audience.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Posts", value: stats.total, icon: FileText },
          { label: "Published", value: stats.published, icon: ExternalLink },
          { label: "Drafts", value: stats.draft, icon: FolderOpen },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="overflow-hidden">
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
            placeholder="Search by title, author, excerpt, or category..."
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

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              {items.length === 0 ? "No blog posts yet" : "No matching posts"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {items.length === 0
                ? "Write your first article to share tips, guides, and company updates."
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
            {items.length === 0 && (
              <Button asChild className="mt-6">
                <Link href="/admin/blogs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((blog) => {
            const categoryName = getCategoryName(blog.category);

            return (
              <Card
                key={blog._id}
                className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {blog.featuredImage ? (
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <Badge variant={statusVariant(blog.status)} className="capitalize shadow-sm">
                      {blog.status}
                    </Badge>
                    {categoryName && (
                      <Badge variant="outline" className="bg-background/80 shadow-sm backdrop-blur">
                        <FolderOpen className="mr-1 h-3 w-3" />
                        {categoryName}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-semibold leading-tight">{blog.title}</h2>
                    {blog.author && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        {blog.author}
                      </p>
                    )}
                    {blog.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(blog.publishDate)}
                    </p>
                    <div className="flex items-center gap-1">
                      {blog.status === "published" && (
                        <Button variant="ghost" size="icon" asChild aria-label="View live">
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild aria-label="Edit">
                        <Link href={`/admin/blogs/${blog._id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete "${blog.title}"?`)) deleteMutation.mutate(blog._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing {filtered.length} of {items.length} posts
        </p>
      )}
    </div>
  );
}

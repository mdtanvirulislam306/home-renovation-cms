"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogInput } from "@/validations/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import slugify from "slugify";
import { ArrowLeft, Loader2, Plus, Save, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function BlogFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const [tagInput, setTagInput] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return (json.data || []) as Category[];
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: "draft", tags: [] },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const body = watch("body");
  const tags = watch("tags") || [];

  useEffect(() => {
    if (title && isNew) setValue("slug", slugify(title, { lower: true, strict: true }));
  }, [title, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/blogs/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            const publishDate = d.data.publishDate
              ? new Date(d.data.publishDate).toISOString().split("T")[0]
              : undefined;
            reset({
              ...d.data,
              category: d.data.category?._id || d.data.category,
              publishDate,
            });
          }
        });
    }
  }, [id, isNew, reset]);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setValue("tags", [...tags, value]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: BlogInput) => {
    const res = await fetch(isNew ? "/api/blogs" : `/api/blogs/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) {
      toast.error(json.error);
      return;
    }
    toast.success(isNew ? "Blog post created" : "Blog post updated");
    router.push("/admin/blogs");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 text-muted-foreground">
            <Link href="/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "New Blog Post" : "Edit Blog Post"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isNew
              ? "Write and publish a new article for your blog."
              : "Update post content, metadata, and publishing settings."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post Details</CardTitle>
            <CardDescription>Title, author, category, and URL slug.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Spring Lawn Care Essentials" />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} placeholder="spring-lawn-care-essentials" />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...register("author")} placeholder="GreenScape Team" />
                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className="flex h-11 w-full rounded-2xl border bg-background px-4 text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Excerpt</CardTitle>
            <CardDescription>A short summary shown on blog cards and previews.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Prepare your lawn for the growing season with these expert tips..."
              className="min-h-[100px]"
            />
            {errors.excerpt && <p className="mt-2 text-sm text-destructive">{errors.excerpt.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
            <CardDescription>The full article body displayed on the blog detail page.</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor value={body || ""} onChange={(h) => setValue("body", h)} />
            {errors.body && <p className="mt-2 text-sm text-destructive">{errors.body.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
            <CardDescription>Keywords to help organize and filter blog posts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. lawn, spring"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1.5">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
            <CardDescription>The cover image shown on blog cards and the article header.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={featuredImage}
              onChange={(u) => setValue("featuredImage", u)}
              folder="blogs"
            />
            {errors.featuredImage && (
              <p className="mt-2 text-sm text-destructive">{errors.featuredImage.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publishing</CardTitle>
            <CardDescription>Control when and how this post is visible.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-11 w-full rounded-2xl border bg-background px-4 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input id="publishDate" type="date" {...register("publishDate")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO</CardTitle>
            <CardDescription>Optional overrides for search engine metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} placeholder="Custom page title for search results" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                {...register("seoDescription")}
                placeholder="Meta description for search engines..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/blogs">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Post" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

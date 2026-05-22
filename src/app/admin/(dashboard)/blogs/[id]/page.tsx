"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogInput } from "@/validations/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import slugify from "slugify";

export default function BlogFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: "draft", tags: [] },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const body = watch("body");

  useEffect(() => {
    if (title && isNew) setValue("slug", slugify(title, { lower: true, strict: true }));
  }, [title, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) fetch(`/api/blogs/${id}`).then((r) => r.json()).then((d) => d.success && reset({ ...d.data, category: d.data.category?._id || d.data.category }));
    fetch("/api/categories").then((r) => r.json());
  }, [id, isNew, reset]);

  const onSubmit = async (data: BlogInput) => {
    const res = await fetch(isNew ? "/api/blogs" : `/api/blogs/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) { toast.error(json.error); return; }
    toast.success("Saved"); router.push("/admin/blogs");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{isNew ? "New Blog" : "Edit Blog"}</h1>
      <Input {...register("title")} placeholder="Title" />
      <Input {...register("slug")} placeholder="Slug" />
      <Input {...register("author")} placeholder="Author" />
      <Input {...register("category")} placeholder="Category ID" />
      <Textarea {...register("excerpt")} placeholder="Excerpt" />
      <RichTextEditor value={body || ""} onChange={(h) => setValue("body", h)} />
      <ImageUpload value={featuredImage} onChange={(u) => setValue("featuredImage", u)} folder="blogs" />
      <select {...register("status")} className="h-11 rounded-2xl border px-4"><option value="draft">Draft</option><option value="published">Published</option></select>
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  );
}

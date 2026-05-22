"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import slugify from "slugify";

export default function CaseStudyFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { status: "draft", services: [], galleryImages: [] },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const challenge = watch("challenge");

  useEffect(() => {
    if (title && isNew) setValue("slug", slugify(title, { lower: true, strict: true }));
  }, [title, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) fetch(`/api/case-studies/${id}`).then((r) => r.json()).then((d) => d.success && reset(d.data));
  }, [id, isNew, reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(isNew ? "/api/case-studies" : `/api/case-studies/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) { toast.error(json.error); return; }
    toast.success("Saved"); router.push("/admin/case-studies");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{isNew ? "New Case Study" : "Edit"}</h1>
      <Input {...register("title")} placeholder="Title" />
      <Input {...register("slug")} placeholder="Slug" />
      <Textarea {...register("summary")} placeholder="Summary" />
      <Label>Challenge</Label>
      <RichTextEditor value={challenge || ""} onChange={(h) => setValue("challenge", h)} />
      <Textarea {...register("solution")} placeholder="Solution" />
      <Textarea {...register("results")} placeholder="Results" />
      <ImageUpload value={featuredImage} onChange={(u) => setValue("featuredImage", u)} folder="case-studies" />
      <select {...register("status")} className="h-11 rounded-2xl border px-4"><option value="draft">Draft</option><option value="published">Published</option></select>
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  );
}

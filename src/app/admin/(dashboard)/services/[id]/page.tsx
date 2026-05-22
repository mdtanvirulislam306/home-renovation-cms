"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/validations/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import slugify from "slugify";
import { Loader2 } from "lucide-react";

export default function ServiceFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { status: "draft", keyBenefits: [], galleryImages: [], displayOrder: 0 },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const fullDescription = watch("fullDescription");

  useEffect(() => {
    if (title && isNew) setValue("slug", slugify(title, { lower: true, strict: true }));
  }, [title, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/services/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) reset(d.data);
        });
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data: ServiceInput) => {
    const url = isNew ? "/api/services" : `/api/services/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!json.success) {
      toast.error(json.error || "Failed to save");
      return;
    }

    toast.success(isNew ? "Service created" : "Service updated");
    router.push("/admin/services");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{isNew ? "New Service" : "Edit Service"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Title</Label>
            <Input {...register("title")} className="mt-2" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...register("slug")} className="mt-2" />
          </div>
        </div>

        <div>
          <Label>Short Description</Label>
          <Textarea {...register("shortDescription")} className="mt-2" />
        </div>

        <div>
          <Label>Full Description</Label>
          <div className="mt-2">
            <RichTextEditor
              value={fullDescription || ""}
              onChange={(html) => setValue("fullDescription", html)}
            />
          </div>
        </div>

        <ImageUpload
          value={featuredImage}
          onChange={(url) => setValue("featuredImage", url)}
          folder="services"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Status</Label>
            <select {...register("status")} className="mt-2 flex h-11 w-full rounded-2xl border px-4 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" {...register("displayOrder")} className="mt-2" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Service"}
        </Button>
      </form>
    </div>
  );
}

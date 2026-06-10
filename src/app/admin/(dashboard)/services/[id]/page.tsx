"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/validations/service";
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

export default function ServiceFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const [benefitInput, setBenefitInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { status: "draft", keyBenefits: [], galleryImages: [], displayOrder: 0 },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const fullDescription = watch("fullDescription");
  const keyBenefits = watch("keyBenefits") || [];

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

  const addBenefit = () => {
    const value = benefitInput.trim();
    if (!value) return;
    setValue("keyBenefits", [...keyBenefits, value]);
    setBenefitInput("");
  };

  const removeBenefit = (index: number) => {
    setValue(
      "keyBenefits",
      keyBenefits.filter((_, i) => i !== index)
    );
  };

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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 text-muted-foreground">
            <Link href="/admin/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "New Service" : "Edit Service"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isNew
              ? "Define a new service offering with descriptions, benefits, and imagery."
              : "Update service details, content, and visibility settings."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Details</CardTitle>
            <CardDescription>Basic information shown on service cards and listings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Lawn Care & Maintenance" />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} placeholder="lawn-care-maintenance" />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                {...register("shortDescription")}
                placeholder="A concise summary for service cards and previews..."
                className="min-h-[100px]"
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Full Description</CardTitle>
            <CardDescription>
              Detailed content displayed on the individual service page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={fullDescription || ""}
              onChange={(html) => setValue("fullDescription", html)}
            />
            {errors.fullDescription && (
              <p className="mt-2 text-sm text-destructive">{errors.fullDescription.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Benefits</CardTitle>
            <CardDescription>Highlight what makes this service valuable to clients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                placeholder="e.g. Licensed & insured"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addBenefit}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keyBenefits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keyBenefits.map((benefit, index) => (
                  <Badge key={`${benefit}-${index}`} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1.5">
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${benefit}`}
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
            <CardDescription>The primary image shown on service cards and detail pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={featuredImage}
              onChange={(url) => setValue("featuredImage", url)}
              folder="services"
            />
            {errors.featuredImage && (
              <p className="mt-2 text-sm text-destructive">{errors.featuredImage.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publishing</CardTitle>
            <CardDescription>Control visibility and sort order on the public site.</CardDescription>
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
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" {...register("displayOrder")} placeholder="0" />
                <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
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
            <Link href="/admin/services">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Service" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

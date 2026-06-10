"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import slugify from "slugify";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface CaseStudyFormData {
  title: string;
  slug: string;
  client?: string;
  location?: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  featuredImage: string;
  status: string;
  services: string[];
  galleryImages: string[];
}

export default function CaseStudyFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<CaseStudyFormData>({
    defaultValues: {
      title: "",
      slug: "",
      client: "",
      location: "",
      summary: "",
      challenge: "",
      solution: "",
      results: "",
      featuredImage: "",
      status: "draft",
      services: [],
      galleryImages: [],
    },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");
  const challenge = watch("challenge");
  const solution = watch("solution");
  const results = watch("results");

  useEffect(() => {
    if (title && isNew) setValue("slug", slugify(title, { lower: true, strict: true }));
  }, [title, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/case-studies/${id}`)
        .then((r) => r.json())
        .then((d) => d.success && reset(d.data));
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data: CaseStudyFormData) => {
    const res = await fetch(isNew ? "/api/case-studies" : `/api/case-studies/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) {
      toast.error(json.error);
      return;
    }
    toast.success(isNew ? "Case study created" : "Case study updated");
    router.push("/admin/case-studies");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 text-muted-foreground">
            <Link href="/admin/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "New Case Study" : "Edit Case Study"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isNew
              ? "Document a project transformation with challenge, solution, and results."
              : "Update project details, content, and publishing status."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Overview</CardTitle>
            <CardDescription>Basic information visible on the case study listing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Modern Backyard Transformation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} placeholder="modern-backyard-transformation" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" {...register("client")} placeholder="Johnson Family" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="Green Valley, CA" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                {...register("summary")}
                placeholder="A brief overview of the project and its impact..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Story Content</CardTitle>
            <CardDescription>
              Tell the full project narrative — what was the challenge, how you solved it, and the outcome.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Challenge</Label>
              <RichTextEditor value={challenge || ""} onChange={(h) => setValue("challenge", h)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Solution</Label>
              <RichTextEditor value={solution || ""} onChange={(h) => setValue("solution", h)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Results</Label>
              <RichTextEditor value={results || ""} onChange={(h) => setValue("results", h)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
            <CardDescription>
              The hero image shown on listing cards and the case study detail page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={featuredImage}
              onChange={(u) => setValue("featuredImage", u)}
              folder="case-studies"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publishing</CardTitle>
            <CardDescription>Control when this case study is visible on the public site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs space-y-2">
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
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/case-studies">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Case Study" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

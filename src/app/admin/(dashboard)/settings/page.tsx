"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["General", "Branding", "Hero", "Homepage", "Social & SEO"] as const;
type Tab = (typeof tabs)[number];

const iconOptions = ["shield", "clock", "award", "leaf", "star", "check", "heart", "zap"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      return json.data;
    },
  });

  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: {
      siteName: "",
      tagline: "",
      phone: "",
      email: "",
      address: "",
      businessHours: "",
      logo: "",
      favicon: "",
      primaryColor: "#3BAE41",
      secondaryColor: "#07140C",
      accentColor: "#C7F36B",
      heroBadge: "",
      heroTitle: "",
      heroHighlight: "",
      heroSubtitle: "",
      heroImage: "",
      heroCtaPrimary: "",
      heroCtaSecondary: "",
      stats: [] as { label: string; value: number; suffix: string }[],
      features: [] as { title: string; description: string; icon: string }[],
      sectionTitles: {
        services: { eyebrow: "", title: "", subtitle: "" },
        caseStudies: { eyebrow: "", title: "", subtitle: "" },
        blog: { eyebrow: "", title: "", subtitle: "" },
        testimonials: { eyebrow: "", title: "", subtitle: "" },
        contact: { eyebrow: "", title: "", subtitle: "" },
        whyChooseUs: { eyebrow: "", title: "", subtitle: "" },
      },
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
      },
      seo: { defaultTitle: "", defaultDescription: "", keywords: [] as string[] },
      analytics: { googleAnalyticsId: "", googleTagManagerId: "" },
      googleMapsEmbedUrl: "",
      googleReviewsUrl: "",
    },
  });

  const statsFields = useFieldArray({ control, name: "stats" });
  const featuresFields = useFieldArray({ control, name: "features" });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const logo = watch("logo");
  const favicon = watch("favicon");
  const heroImage = watch("heroImage");

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <div className="flex flex-wrap gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        {activeTab === "General" && (
          <div className="space-y-4">
            <div><Label>Site Name</Label><Input {...register("siteName")} className="mt-2" /></div>
            <div><Label>Tagline</Label><Input {...register("tagline")} className="mt-2" /></div>
            <div><Label>Phone</Label><Input {...register("phone")} className="mt-2" /></div>
            <div><Label>Email</Label><Input {...register("email")} className="mt-2" /></div>
            <div><Label>Address</Label><Textarea {...register("address")} className="mt-2" /></div>
            <div><Label>Business Hours</Label><Input {...register("businessHours")} className="mt-2" /></div>
          </div>
        )}

        {activeTab === "Branding" && (
          <div className="space-y-4">
            <ImageUpload value={logo} onChange={(url) => setValue("logo", url)} folder="branding" label="Logo" />
            <ImageUpload value={favicon} onChange={(url) => setValue("favicon", url)} folder="branding" label="Favicon" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Primary Color</Label>
                <div className="mt-2 flex gap-2">
                  <Input type="color" {...register("primaryColor")} className="h-11 w-16 p-1" />
                  <Input {...register("primaryColor")} />
                </div>
              </div>
              <div>
                <Label>Secondary Color</Label>
                <div className="mt-2 flex gap-2">
                  <Input type="color" {...register("secondaryColor")} className="h-11 w-16 p-1" />
                  <Input {...register("secondaryColor")} />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="mt-2 flex gap-2">
                  <Input type="color" {...register("accentColor")} className="h-11 w-16 p-1" />
                  <Input {...register("accentColor")} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Hero" && (
          <div className="space-y-4">
            <div><Label>Badge Text</Label><Input {...register("heroBadge")} className="mt-2" /></div>
            <div><Label>Title (before highlight)</Label><Input {...register("heroTitle")} className="mt-2" /></div>
            <div><Label>Highlighted Text</Label><Input {...register("heroHighlight")} className="mt-2" /></div>
            <div><Label>Subtitle</Label><Textarea {...register("heroSubtitle")} className="mt-2" /></div>
            <ImageUpload value={heroImage} onChange={(url) => setValue("heroImage", url)} folder="hero" label="Hero Image" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Primary CTA</Label><Input {...register("heroCtaPrimary")} className="mt-2" /></div>
              <div><Label>Secondary CTA</Label><Input {...register("heroCtaSecondary")} className="mt-2" /></div>
            </div>
          </div>
        )}

        {activeTab === "Homepage" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Stats</h3>
              {statsFields.fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-4">
                  <Input {...register(`stats.${index}.label`)} placeholder="Label" />
                  <Input type="number" {...register(`stats.${index}.value`, { valueAsNumber: true })} placeholder="Value" />
                  <Input {...register(`stats.${index}.suffix`)} placeholder="Suffix (+)" />
                  <Button type="button" variant="ghost" onClick={() => statsFields.remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => statsFields.append({ label: "", value: 0, suffix: "+" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Stat
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Why Choose Us Features</h3>
              {featuresFields.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-xl border p-4">
                  <Input {...register(`features.${index}.title`)} placeholder="Title" />
                  <Textarea {...register(`features.${index}.description`)} placeholder="Description" />
                  <select {...register(`features.${index}.icon`)} className="flex h-11 w-full rounded-2xl border px-4 text-sm">
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <Button type="button" variant="ghost" onClick={() => featuresFields.remove(index)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => featuresFields.append({ title: "", description: "", icon: "shield" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Feature
              </Button>
            </div>

            {(["services", "caseStudies", "blog", "testimonials", "contact", "whyChooseUs"] as const).map((key) => (
              <div key={key} className="space-y-3 rounded-xl border p-4">
                <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")} Section</h3>
                <Input {...register(`sectionTitles.${key}.eyebrow`)} placeholder="Eyebrow" />
                <Input {...register(`sectionTitles.${key}.title`)} placeholder="Title" />
                <Input {...register(`sectionTitles.${key}.subtitle`)} placeholder="Subtitle" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Social & SEO" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Facebook</Label><Input {...register("socialLinks.facebook")} className="mt-2" /></div>
              <div><Label>Instagram</Label><Input {...register("socialLinks.instagram")} className="mt-2" /></div>
              <div><Label>Twitter</Label><Input {...register("socialLinks.twitter")} className="mt-2" /></div>
              <div><Label>LinkedIn</Label><Input {...register("socialLinks.linkedin")} className="mt-2" /></div>
              <div><Label>YouTube</Label><Input {...register("socialLinks.youtube")} className="mt-2" /></div>
            </div>
            <div><Label>SEO Title</Label><Input {...register("seo.defaultTitle")} className="mt-2" /></div>
            <div><Label>SEO Description</Label><Textarea {...register("seo.defaultDescription")} className="mt-2" /></div>
            <div><Label>Google Analytics ID</Label><Input {...register("analytics.googleAnalyticsId")} className="mt-2" /></div>
            <div><Label>Google Tag Manager ID</Label><Input {...register("analytics.googleTagManagerId")} className="mt-2" /></div>
            <div><Label>Google Maps Embed URL</Label><Input {...register("googleMapsEmbedUrl")} className="mt-2" /></div>
            <div><Label>Google Reviews URL</Label><Input {...register("googleReviewsUrl")} className="mt-2" /></div>
          </div>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Settings,
  Building2,
  Palette,
  Sparkles,
  Layout,
  Globe,
  Loader2,
  Save,
  Users,
  AtSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultAboutContent, mergeAboutContent } from "@/lib/about-defaults";

const tabs = [
  { id: "General", label: "General", icon: Building2, description: "Business info and contact details" },
  { id: "Branding", label: "Branding", icon: Palette, description: "Logo, colors, and visual identity" },
  { id: "Hero", label: "Hero", icon: Sparkles, description: "Homepage hero section content" },
  { id: "Homepage", label: "Homepage", icon: Layout, description: "Stats, features, and section titles" },
  { id: "About", label: "About", icon: Users, description: "About page content and imagery" },
  { id: "Email", label: "Email", icon: AtSign, description: "SMTP settings for inquiry notifications and replies" },
  { id: "Social & SEO", label: "Social & SEO", icon: Globe, description: "Social links, SEO, and analytics" },
] as const;

type Tab = (typeof tabs)[number]["id"];

const iconOptions = ["shield", "clock", "award", "leaf", "star", "check", "heart", "zap"];

const sectionKeys = [
  "services",
  "caseStudies",
  "blog",
  "testimonials",
  "contact",
  "whyChooseUs",
] as const;

function formatSectionKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
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
      heroVideoUrl: "",
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
      smtp: {
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: "",
        from: "",
        adminEmail: "",
      },
      about: { ...defaultAboutContent },
    },
  });

  const statsFields = useFieldArray({ control, name: "stats" });
  const featuresFields = useFieldArray({ control, name: "features" });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        about: mergeAboutContent(data.about),
      });
    }
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
  const aboutImage = watch("about.image");
  const aboutStoryContent = watch("about.storyContent");
  const activeTabMeta = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Settings className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Configuration</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Customize your website branding, content, and integrations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{activeTabMeta.label}</CardTitle>
          <CardDescription>{activeTabMeta.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="settings-form"
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="space-y-6"
          >
            <div className={cn("grid gap-4 sm:grid-cols-2", activeTab !== "General" && "hidden")}>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Site Name</Label>
                  <Input {...register("siteName")} placeholder="GreenScape Pro" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Tagline</Label>
                  <Input {...register("tagline")} placeholder="Premium Landscaping & Property Services" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register("phone")} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...register("email")} placeholder="hello@example.com" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address</Label>
                  <Textarea {...register("address")} placeholder="123 Green Street, City, State" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Business Hours</Label>
                  <Input {...register("businessHours")} placeholder="Mon–Fri 8am–6pm" />
                </div>
            </div>

            <div className={cn("space-y-6", activeTab !== "Branding" && "hidden")}>
                <ImageUpload value={logo} onChange={(url) => setValue("logo", url)} folder="branding" label="Logo" />
                <ImageUpload value={favicon} onChange={(url) => setValue("favicon", url)} folder="branding" label="Favicon" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {(
                    [
                      { key: "primaryColor", label: "Primary" },
                      { key: "secondaryColor", label: "Secondary" },
                      { key: "accentColor", label: "Accent" },
                    ] as const
                  ).map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label>{label} Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" {...register(key)} className="h-11 w-16 shrink-0 p-1" />
                        <Input {...register(key)} className="font-mono text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            <div className={cn("space-y-4", activeTab !== "Hero" && "hidden")}>
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input {...register("heroBadge")} placeholder="Premium Landscaping Services" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title (before highlight)</Label>
                    <Input {...register("heroTitle")} placeholder="Transform Your" />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted Text</Label>
                    <Input {...register("heroHighlight")} placeholder="Outdoor Space" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea {...register("heroSubtitle")} placeholder="Expert landscaping services..." />
                </div>
                <ImageUpload value={heroImage} onChange={(url) => setValue("heroImage", url)} folder="hero" label="Hero Image" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary CTA</Label>
                    <Input {...register("heroCtaPrimary")} placeholder="Get a Free Quote" />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA</Label>
                    <Input {...register("heroCtaSecondary")} placeholder="Our Services" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>YouTube Video URL</Label>
                  <Input
                    {...register("heroVideoUrl")}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Plays in the hero &quot;Watch Our Work&quot; video player. Supports youtube.com and youtu.be links.
                  </p>
                </div>
            </div>

            <div className={cn("space-y-8", activeTab !== "Homepage" && "hidden")}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Animated Stats</h3>
                    <p className="text-sm text-muted-foreground">Numbers displayed on the homepage hero area.</p>
                  </div>
                  {statsFields.fields.map((field, index) => (
                    <div key={field.id} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_100px_80px_auto]">
                      <Input {...register(`stats.${index}.label`)} placeholder="Label" />
                      <Input type="number" {...register(`stats.${index}.value`, { valueAsNumber: true })} placeholder="Value" />
                      <Input {...register(`stats.${index}.suffix`)} placeholder="+" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => statsFields.remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => statsFields.append({ label: "", value: 0, suffix: "+" })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Stat
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Why Choose Us Features</h3>
                    <p className="text-sm text-muted-foreground">Highlight your key differentiators.</p>
                  </div>
                  {featuresFields.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 rounded-xl border p-4">
                      <Input {...register(`features.${index}.title`)} placeholder="Title" />
                      <Textarea {...register(`features.${index}.description`)} placeholder="Description" />
                      <select {...register(`features.${index}.icon`)} className="flex h-11 w-full rounded-2xl border bg-background px-4 text-sm">
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <Button type="button" variant="ghost" size="sm" onClick={() => featuresFields.remove(index)}>
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => featuresFields.append({ title: "", description: "", icon: "shield" })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Feature
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Section Titles</h3>
                    <p className="text-sm text-muted-foreground">Customize headings for each homepage section.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {sectionKeys.map((key) => (
                      <div key={key} className="space-y-3 rounded-xl border p-4">
                        <h4 className="text-sm font-semibold">{formatSectionKey(key)}</h4>
                        <Input {...register(`sectionTitles.${key}.eyebrow`)} placeholder="Eyebrow" />
                        <Input {...register(`sectionTitles.${key}.title`)} placeholder="Title" />
                        <Input {...register(`sectionTitles.${key}.subtitle`)} placeholder="Subtitle" />
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            <div className={cn("space-y-6", activeTab !== "About" && "hidden")}>
                <div className="space-y-4">
                  <h3 className="font-semibold">Page Header</h3>
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input
                      {...register("about.title")}
                      placeholder="Leave blank to use “About [Site Name]”"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      {...register("about.subtitle")}
                      placeholder="Passionate professionals dedicated to transforming outdoor spaces."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Our Story</h3>
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input {...register("about.storyTitle")} placeholder="Our Story" />
                  </div>
                  <div className="space-y-2">
                    <Label>Story Content</Label>
                    {activeTab === "About" && (
                      <RichTextEditor
                        value={aboutStoryContent || ""}
                        onChange={(html) => setValue("about.storyContent", html, { shouldDirty: true })}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Featured Image</h3>
                  <ImageUpload
                    value={aboutImage}
                    onChange={(url) => setValue("about.image", url)}
                    folder="about"
                    label="About page image"
                  />
                  <div className="space-y-2">
                    <Label>Image Alt Text</Label>
                    <Input {...register("about.imageAlt")} placeholder="Our team at work" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Stats Section</h3>
                  <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("about.showStats")}
                      className="h-4 w-4 rounded border"
                    />
                    <div>
                      <p className="font-medium">Show stats on About page</p>
                      <p className="text-sm text-muted-foreground">
                        Uses the animated stats configured in the Homepage tab.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">SEO</h3>
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input {...register("about.seoTitle")} placeholder="About Us" />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea
                      {...register("about.seoDescription")}
                      placeholder="Learn about our company, team, and mission..."
                    />
                  </div>
                </div>
            </div>

            <div className={cn("space-y-6", activeTab !== "Email" && "hidden")}>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                  Configure SMTP to send inquiry notifications and reply to customers directly from the admin panel.
                  Gmail users should use an App Password with port 587.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input {...register("smtp.host")} placeholder="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input type="number" {...register("smtp.port")} placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input {...register("smtp.user")} placeholder="your-email@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input
                      type="password"
                      {...register("smtp.pass")}
                      placeholder={data?.smtp?.hasPassword ? "••••••••••••" : "App password"}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>From Address</Label>
                    <Input {...register("smtp.from")} placeholder="GreenScape Pro <noreply@greenscape.com>" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Admin Notification Email</Label>
                    <Input {...register("smtp.adminEmail")} placeholder="admin@greenscape.com" />
                  </div>
                </div>
                <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer">
                  <input type="checkbox" {...register("smtp.secure")} className="h-4 w-4 rounded border" />
                  <div>
                    <p className="font-medium">Use SSL/TLS (port 465)</p>
                    <p className="text-sm text-muted-foreground">Enable for port 465. Keep off for port 587 (STARTTLS).</p>
                  </div>
                </label>
            </div>

            <div className={cn("space-y-6", activeTab !== "Social & SEO" && "hidden")}>
                <div className="space-y-4">
                  <h3 className="font-semibold">Social Links</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Facebook</Label><Input {...register("socialLinks.facebook")} placeholder="https://facebook.com/..." /></div>
                    <div className="space-y-2"><Label>Instagram</Label><Input {...register("socialLinks.instagram")} placeholder="https://instagram.com/..." /></div>
                    <div className="space-y-2"><Label>Twitter</Label><Input {...register("socialLinks.twitter")} placeholder="https://twitter.com/..." /></div>
                    <div className="space-y-2"><Label>LinkedIn</Label><Input {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/..." /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>YouTube</Label><Input {...register("socialLinks.youtube")} placeholder="https://youtube.com/..." /></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">SEO Defaults</h3>
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input {...register("seo.defaultTitle")} placeholder="Default page title" />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea {...register("seo.defaultDescription")} placeholder="Default meta description" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Integrations</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Google Analytics ID</Label><Input {...register("analytics.googleAnalyticsId")} placeholder="G-XXXXXXXXXX" /></div>
                    <div className="space-y-2"><Label>Google Tag Manager ID</Label><Input {...register("analytics.googleTagManagerId")} placeholder="GTM-XXXXXXX" /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>Google Maps Embed URL</Label><Input {...register("googleMapsEmbedUrl")} placeholder="https://maps.google.com/..." /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>Google Reviews URL</Label><Input {...register("googleReviewsUrl")} placeholder="https://g.page/..." /></div>
                  </div>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <p className="hidden text-sm text-muted-foreground sm:block">
            {isLoading ? "Loading settings..." : "Changes are saved across all tabs."}
          </p>
          <Button
            type="submit"
            form="settings-form"
            disabled={mutation.isPending || isLoading}
            className="ml-auto min-w-[140px]"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

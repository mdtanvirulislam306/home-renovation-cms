"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      return json.data;
    },
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["settings"] }); toast.success("Settings saved"); },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div><Label>Site Name</Label><Input {...register("siteName")} className="mt-2" /></div>
        <div><Label>Tagline</Label><Input {...register("tagline")} className="mt-2" /></div>
        <div><Label>Phone</Label><Input {...register("phone")} className="mt-2" /></div>
        <div><Label>Email</Label><Input {...register("email")} className="mt-2" /></div>
        <div><Label>Address</Label><Textarea {...register("address")} className="mt-2" /></div>
        <div><Label>Google Analytics ID</Label><Input {...register("analytics.googleAnalyticsId")} className="mt-2" /></div>
        <div><Label>Google Maps Embed URL</Label><Input {...register("googleMapsEmbedUrl")} className="mt-2" /></div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}

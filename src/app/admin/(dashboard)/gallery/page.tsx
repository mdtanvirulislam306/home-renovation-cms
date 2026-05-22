"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      return json.data || [];
    },
  });

  const create = useMutation({
    mutationFn: () => fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image, status: "published" }),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }); setTitle(""); setImage(""); toast.success("Added"); },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <div className="border rounded-2xl p-6 space-y-4 max-w-lg">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <ImageUpload value={image} onChange={setImage} folder="gallery" />
        <Button onClick={() => create.mutate()}>Add to Gallery</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {(data || []).map((item: { _id: string; title: string; image: string }) => (
          <div key={item._id} className="rounded-2xl border overflow-hidden">
            <div className="relative aspect-[4/3]"><Image src={item.image} alt={item.title} fill className="object-cover" sizes="300px" /></div>
            <p className="p-3 font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

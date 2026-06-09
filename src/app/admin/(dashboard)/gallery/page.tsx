"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
}

export default function AdminGalleryPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      return json.data || [];
    },
  });

  const resetForm = () => {
    setTitle("");
    setImage("");
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, image, status: "published" }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      resetForm();
      toast.success(editingId ? "Updated" : "Added");
    },
    onError: () => toast.error("Failed to save"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetch(`/api/gallery/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Deleted");
    },
  });

  const startEdit = (item: GalleryItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setImage(item.image);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <div className="border rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold">{editingId ? "Edit Item" : "Add Item"}</h2>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <ImageUpload value={image} onChange={setImage} folder="gallery" />
        <div className="flex gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {editingId ? "Update" : "Add to Gallery"}
          </Button>
          {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {(data || []).map((item: GalleryItem) => (
          <div key={item._id} className="rounded-2xl border overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="300px" />
            </div>
            <div className="flex items-center justify-between p-3">
              <p className="font-medium">{item.title}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(item._id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

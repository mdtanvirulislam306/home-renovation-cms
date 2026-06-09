"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import slugify from "slugify";
import { Pencil, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return json.data || [];
    },
  });

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const slug = slugify(name, { lower: true, strict: true });
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      toast.success(editingId ? "Updated" : "Created");
    },
    onError: () => toast.error("Failed to save"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetch(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="flex gap-2 max-w-lg">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {editingId ? "Update" : "Add"}
        </Button>
        {editingId && (
          <Button variant="outline" onClick={resetForm}>Cancel</Button>
        )}
      </div>
      <ul className="space-y-2">
        {(data || []).map((c: Category) => (
          <li key={c._id} className="flex justify-between items-center border rounded-xl p-4">
            <span>
              {c.name} <span className="text-muted-foreground text-sm">({c.slug})</span>
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => startEdit(c)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove.mutate(c._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import slugify from "slugify";

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return json.data || [];
    },
  });

  const create = useMutation({
    mutationFn: () => fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name, { lower: true, strict: true }) }),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories"] }); setName(""); toast.success("Created"); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetch(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        <Button onClick={() => create.mutate()}>Add</Button>
      </div>
      <ul className="space-y-2">
        {(data || []).map((c: { _id: string; name: string; slug: string }) => (
          <li key={c._id} className="flex justify-between items-center border rounded-xl p-4">
            <span>{c.name} <span className="text-muted-foreground text-sm">({c.slug})</span></span>
            <Button variant="ghost" size="sm" onClick={() => remove.mutate(c._id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

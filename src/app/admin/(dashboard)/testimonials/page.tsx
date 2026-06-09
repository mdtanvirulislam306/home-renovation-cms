"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
}

export default function AdminTestimonialsPage() {
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      return (await res.json()).data || [];
    },
  });

  const resetForm = () => {
    setForm({ name: "", role: "", content: "", rating: 5 });
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "published" }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      resetForm();
      toast.success(editingId ? "Updated" : "Added");
    },
    onError: () => toast.error("Failed to save"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetch(`/api/testimonials/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Deleted");
    },
  });

  const startEdit = (t: Testimonial) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      role: t.role || "",
      content: t.content,
      rating: t.rating || 5,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Testimonials</h1>
      <div className="border rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <Input type="number" min={1} max={5} placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        <div className="flex gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {editingId ? "Update" : "Add Testimonial"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </div>
      <ul className="space-y-4">
        {(data || []).map((t: Testimonial) => (
          <li key={t._id} className="flex justify-between items-start gap-4 border rounded-xl p-4">
            <div>
              <strong>{t.name}</strong>
              {t.role && <span className="text-muted-foreground text-sm ml-2">({t.role})</span>}
              <p className="text-muted-foreground mt-1">{t.content}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => startEdit(t)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(t._id)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminTestimonialsPage() {
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      return (await res.json()).data || [];
    },
  });

  const create = useMutation({
    mutationFn: () => fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: "published" }),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Added"); },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Testimonials</h1>
      <div className="border rounded-2xl p-6 space-y-4 max-w-lg">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <Button onClick={() => create.mutate()}>Add Testimonial</Button>
      </div>
      <ul className="space-y-4">
        {(data || []).map((t: { _id: string; name: string; content: string }) => (
          <li key={t._id} className="border rounded-xl p-4"><strong>{t.name}</strong><p className="text-muted-foreground mt-1">{t.content}</p></li>
        ))}
      </ul>
    </div>
  );
}

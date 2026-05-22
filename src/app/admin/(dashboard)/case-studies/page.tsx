"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminCaseStudiesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-case-studies"],
    queryFn: async () => {
      const res = await fetch("/api/case-studies");
      return (await res.json()).data?.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Case Studies</h1>
        <Button asChild><Link href="/admin/case-studies/new"><Plus className="mr-2 h-4 w-4" />Add</Link></Button>
      </div>
      <div className="space-y-4">
        {(data || []).map((cs: { _id: string; title: string; slug: string; status: string; createdAt: string }) => (
          <div key={cs._id} className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <p className="font-medium">{cs.title}</p>
              <p className="text-sm text-muted-foreground">{formatDate(cs.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{cs.status}</Badge>
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/case-studies/${cs._id}`}><Pencil className="h-4 w-4" /></Link></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

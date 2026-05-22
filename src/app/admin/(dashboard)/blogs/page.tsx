"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Blog { _id: string; title: string; slug: string; status: string; publishDate: string; }

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      return json.data?.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/blogs/${id}`, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-blogs"] }); toast.success("Deleted"); },
  });

  const columns: ColumnDef<Blog>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
    { accessorKey: "publishDate", header: "Date", cell: ({ row }) => formatDate(row.original.publishDate) },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild><Link href={`/admin/blogs/${row.original._id}`}><Pencil className="h-4 w-4" /></Link></Button>
          <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && deleteMutation.mutate(row.original._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-3xl font-bold">Blogs</h1><Button asChild><Link href="/admin/blogs/new"><Plus className="mr-2 h-4 w-4" />Add</Link></Button></div>
      <DataTable columns={columns} data={data || []} searchKey="title" />
    </div>
  );
}

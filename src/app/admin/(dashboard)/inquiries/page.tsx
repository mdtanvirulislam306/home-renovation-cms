"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Inquiry { _id: string; name: string; email: string; service?: string; status: string; createdAt: string; message: string; }

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries");
      const json = await res.json();
      return json.data?.data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["inquiries"] }); toast.success("Updated"); },
  });

  const columns: ColumnDef<Inquiry>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "service", header: "Service" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
    { accessorKey: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {["read", "replied", "archived"].map((s) => (
            <Button key={s} size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: row.original._id, status: s })}>{s}</Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inquiries</h1>
      <DataTable columns={columns} data={data || []} searchKey="name" />
    </div>
  );
}

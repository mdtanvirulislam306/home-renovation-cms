"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Category {
  _id?: string;
  name?: string;
  slug?: string;
}

export function BlogSearch({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/blog?${params.toString()}`);
  };

  const filterCategory = (slug: string) => {
    router.push(`/blog?category=${slug}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/blog")}>
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat._id?.toString()}
            variant="outline"
            size="sm"
            onClick={() => filterCategory(cat._id?.toString() || "")}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

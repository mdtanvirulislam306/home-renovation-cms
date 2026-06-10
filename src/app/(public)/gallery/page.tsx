"use client";

import { PageHeader } from "@/components/shared/page-header";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="Browse our portfolio of completed projects and stunning transformations."
        breadcrumbs={[{ label: "Gallery" }]}
      />
      <GalleryGrid />
    </>
  );
}

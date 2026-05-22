"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import ReactCompareImage from "react-compare-image";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery?public=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Browse our portfolio of completed projects and transformations."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="container mx-auto px-4 py-16 md:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {items.map((item) => (
              <div key={item._id} className="rounded-2xl overflow-hidden border bg-card">
                {item.beforeImage && item.afterImage ? (
                  <div className="aspect-[16/10]">
                    <ReactCompareImage
                      leftImage={item.beforeImage}
                      rightImage={item.afterImage}
                      sliderLineColor="#3BAE41"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="relative aspect-[4/3] w-full cursor-pointer"
                    onClick={() => setLightbox(item.image)}
                  >
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="50vw" />
                  </button>
                )}
                <p className="p-4 font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

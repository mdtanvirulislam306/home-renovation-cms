"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReactCompareImage from "react-compare-image";
import {
  Images,
  Sparkles,
  ArrowLeftRight,
  Expand,
  LayoutGrid,
} from "lucide-react";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category?: string;
  beforeImage?: string;
  afterImage?: string;
}

type FilterType = "all" | "transformations" | "photos";

const filters: { id: FilterType; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "All Work", icon: LayoutGrid },
  { id: "transformations", label: "Before & After", icon: ArrowLeftRight },
  { id: "photos", label: "Photos", icon: Images },
];

function isTransformation(item: GalleryItem) {
  return !!(item.beforeImage && item.afterImage);
}

function GallerySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
      ))}
    </div>
  );
}

function BeforeAfterCard({ item }: { item: GalleryItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="shine-border overflow-hidden rounded-3xl border border-border/50 bg-card shadow-premium lg:col-span-2"
    >
      <div className="relative">
        <div className="aspect-[16/9] sm:aspect-[21/9]">
          <ReactCompareImage
            leftImage={item.beforeImage!}
            rightImage={item.afterImage!}
            sliderLineColor="#3BAE41"
            sliderLineWidth={3}
            handleSize={44}
          />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-dark/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          Before
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          After
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent p-6 pt-16">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Transformation
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">{item.title}</h3>
          {item.category && (
            <p className="mt-1 text-sm text-white/60">{item.category}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PhotoCard({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (src: string, title: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
    >
      <button
        type="button"
        onClick={() => onOpen(item.image, item.title)}
        className="shine-border group relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card text-left shadow-premium transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
            <Expand className="h-5 w-5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {item.category && (
              <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                {item.category}
              </span>
            )}
            <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [category, setCategory] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    fetch("/api/gallery?public=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = items
      .map((i) => i.category?.trim())
      .filter((c): c is string => !!c);
    return [...new Set(cats)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "transformations" && !isTransformation(item)) return false;
      if (filter === "photos" && isTransformation(item)) return false;
      if (category !== "all" && item.category !== category) return false;
      return true;
    });
  }, [items, filter, category]);

  const transformationCount = items.filter(isTransformation).length;
  const photoCount = items.length - transformationCount;

  return (
    <>
      <section className="section-mesh py-20">
        <div className="container mx-auto px-4 md:px-8">
          {!loading && items.length > 0 && (
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {filters.map(({ id, label, icon: Icon }) => {
                  const count =
                    id === "all"
                      ? items.length
                      : id === "transformations"
                        ? transformationCount
                        : photoCount;
                  if (id === "transformations" && transformationCount === 0) return null;
                  if (id === "photos" && photoCount === 0) return null;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                        filter === id
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                          : "border-border/50 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          filter === id ? "bg-white/20" : "bg-muted"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      category === "all"
                        ? "bg-accent text-dark"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                        category === cat
                          ? "bg-accent text-dark"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <GallerySkeleton />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/50 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Images className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-bold">No gallery items yet</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Our project portfolio will appear here once images are added from the admin panel.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 font-medium">No items match this filter</p>
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setCategory("all");
                }}
                className="mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) =>
                  isTransformation(item) ? (
                    <BeforeAfterCard key={item._id} item={item} />
                  ) : (
                    <PhotoCard
                      key={item._id}
                      item={item}
                      onOpen={(src, title) => setLightbox({ src, title })}
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && items.length > 0 && (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {items.length} projects
              {transformationCount > 0 && " · Drag the slider to compare before & after"}
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            src={lightbox.src}
            title={lightbox.title}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

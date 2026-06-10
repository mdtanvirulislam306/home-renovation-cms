"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  title?: string;
  onClose: () => void;
}

export function ImageLightbox({ src, title, onClose }: ImageLightboxProps) {
  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image preview"}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
          <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
            <Image
              src={src}
              alt={title || "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {title && (
            <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4">
              <ZoomIn className="h-4 w-4 text-primary" />
              <p className="font-medium text-white">{title}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import Image from "next/image";
import { X } from "lucide-react";

export function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="relative max-w-5xl w-full aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="" fill className="object-contain" sizes="100vw" />
      </div>
    </div>
  );
}

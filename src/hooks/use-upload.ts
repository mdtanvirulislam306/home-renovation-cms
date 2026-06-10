"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, folder?: string): Promise<string | null> => {
    setUploading(true);
    setProgress(10);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setProgress(50);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, folder }),
      });

      const data = await res.json().catch(() => null);
      setProgress(100);

      if (!res.ok || !data?.success) {
        const message =
          data?.error ||
          (res.status === 401
            ? "Please sign in to upload images"
            : res.status === 413
              ? "Image is too large (max 10MB)"
              : "Upload failed");
        toast.error(message);
        return null;
      }

      return data.data.url as string;
    } catch {
      toast.error("Upload failed — check your connection and try again");
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return { upload, uploading, progress };
}

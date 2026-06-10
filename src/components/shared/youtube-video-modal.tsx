"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface YouTubeVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl?: string;
  title?: string;
}

export function YouTubeVideoModal({
  open,
  onOpenChange,
  videoUrl,
  title = "Watch Our Work",
}: YouTubeVideoModalProps) {
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl, open) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 bg-black p-0 sm:max-w-5xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center text-white/70">
              No video configured yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

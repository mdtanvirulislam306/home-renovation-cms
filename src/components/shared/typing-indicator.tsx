"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  label?: string;
  className?: string;
}

export function TypingIndicator({ label = "typing", className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground",
        className
      )}
      aria-live="polite"
      aria-label={label}
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
          />
        ))}
      </span>
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function getPaginationRange(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;
  return { skip, limit, totalPages, page: Math.min(page, totalPages) };
}

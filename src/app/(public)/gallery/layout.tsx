import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Gallery",
  description: "Browse our portfolio of completed landscaping and property projects.",
  path: "/gallery",
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

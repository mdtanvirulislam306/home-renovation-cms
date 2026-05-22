import { Breadcrumbs } from "./breadcrumbs";
import type { BreadcrumbItem } from "@/types";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <section className="relative bg-dark pt-32 pb-20 text-white">
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container relative mx-auto px-4 md:px-8">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-white/70">{description}</p>
        )}
      </div>
    </section>
  );
}

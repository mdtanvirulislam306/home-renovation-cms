import { Breadcrumbs } from "./breadcrumbs";
import type { BreadcrumbItem } from "@/types";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-dark pb-24 pt-36 text-white">
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />

      <div className="container relative mx-auto px-4 md:px-8">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl lg:leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>
        )}
      </div>
    </section>
  );
}

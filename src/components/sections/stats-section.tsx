"use client";

import { siteConfig } from "@/config/site";
import { useCounter } from "@/hooks/use-counter";

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-primary md:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {siteConfig.stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCounter } from "@/hooks/use-counter";
import type { StatItem } from "@/types/settings";

function StatItemDisplay({ value, suffix, label }: StatItem) {
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

export function StatsSection({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItemDisplay key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

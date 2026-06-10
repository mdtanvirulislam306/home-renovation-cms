"use client";

import { useCounter } from "@/hooks/use-counter";
import type { StatItem } from "@/types/settings";

function StatItemDisplay({ value, suffix, label }: StatItem) {
  const { count, ref } = useCounter(value);

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-border/50 bg-card p-8 text-center shadow-premium transition-transform hover:-translate-y-1"
    >
      <p className="text-4xl font-bold text-gradient md:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function StatsSection({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;

  return (
    <section className="section-mesh border-y border-border/50 py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <StatItemDisplay key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

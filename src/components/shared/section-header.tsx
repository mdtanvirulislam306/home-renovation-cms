import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-16",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <span className="eyebrow-pill">{eyebrow}</span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base text-muted-foreground md:text-lg",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

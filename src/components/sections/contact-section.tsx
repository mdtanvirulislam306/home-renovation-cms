import { ContactForm } from "@/components/shared/contact-form";
import type { SectionTitle } from "@/types/settings";

interface ContactSectionProps {
  section: SectionTitle;
  services: { title?: string; slug?: string }[];
}

export function ContactSection({ section, services }: ContactSectionProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          {section.eyebrow && <span className="text-primary font-medium">{section.eyebrow}</span>}
          {section.title && (
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">{section.title}</h2>
          )}
          {section.subtitle && (
            <p className="mt-4 text-muted-foreground">{section.subtitle}</p>
          )}
        </div>
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 shadow-premium">
          <ContactForm services={services} />
        </div>
      </div>
    </section>
  );
}

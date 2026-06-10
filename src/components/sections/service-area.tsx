import { MapPin } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

interface ServiceAreaProps {
  mapsUrl?: string;
}

export function ServiceArea({ mapsUrl }: ServiceAreaProps) {
  const embedUrl =
    mapsUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiA3M8KwNTQnMDAuMCJX!5e0!3m2!1sen!2sus!4v1";

  return (
    <section className="border-t border-border/40 bg-muted/20 py-28">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow="Service Area"
          title="We Serve Your Area"
          subtitle="Proudly serving homeowners and businesses across the greater metro area."
        />

        <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-premium">
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-dark/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-accent" />
            Our Coverage Area
          </div>
          <div className="aspect-[16/9] md:aspect-[21/9]">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Service area map"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

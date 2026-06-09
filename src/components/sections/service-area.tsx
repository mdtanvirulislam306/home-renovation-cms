interface ServiceAreaProps {
  mapsUrl?: string;
}

export function ServiceArea({ mapsUrl }: ServiceAreaProps) {
  const embedUrl =
    mapsUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiA3M8KwNTQnMDAuMCJX!5e0!3m2!1sen!2sus!4v1";

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium">Service Area</span>
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">We Serve Your Area</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Proudly serving homeowners and businesses across the greater metro area.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-premium aspect-[16/9] md:aspect-[21/9]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 400 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Service area map"
          />
        </div>
      </div>
    </section>
  );
}

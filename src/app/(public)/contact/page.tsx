import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/shared/contact-form";
import { generatePageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedServices } from "@/lib/data";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return generatePageMetadata({
    title: "Contact",
    description: "Get in touch for a free quote on landscaping and property services.",
    path: "/contact",
    settings,
  });
}

export default async function ContactPage() {
  let settings = await getSiteSettings();
  let services: Awaited<ReturnType<typeof getPublishedServices>> = [];

  try {
    [settings, services] = await Promise.all([getSiteSettings(), getPublishedServices()]);
  } catch {
    // use defaults
  }

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Ready to transform your property? We'd love to hear from you."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get a Free Quote</h2>
            <ContactForm services={services} />
          </div>

          <div className="space-y-8">
            {[
              { icon: Phone, label: "Phone", value: settings.phone },
              { icon: Mail, label: "Email", value: settings.email },
              { icon: MapPin, label: "Address", value: settings.address },
              { icon: Clock, label: "Hours", value: settings.businessHours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

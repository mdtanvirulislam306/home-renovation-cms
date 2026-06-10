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

  const contactItems = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Address", value: settings.address },
    { icon: Clock, label: "Hours", value: settings.businessHours },
  ];

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Ready to transform your property? We'd love to hear from you."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="section-mesh py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form and our team will respond within 24 hours.
              </p>
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-premium"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="mt-1 block font-medium hover:text-primary">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="shine-border rounded-3xl border border-border/50 bg-card p-8 shadow-premium lg:col-span-3">
              <h2 className="mb-6 text-xl font-bold">Request a Free Quote</h2>
              <ContactForm services={services} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

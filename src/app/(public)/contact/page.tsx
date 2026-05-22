import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/shared/contact-form";
import { generatePageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Contact",
  description: "Get in touch for a free quote on landscaping and property services.",
  path: "/contact",
});

export default function ContactPage() {
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
            <ContactForm />
          </div>

          <div className="space-y-8">
            {[
              { icon: Phone, label: "Phone", value: siteConfig.links.phone },
              { icon: Mail, label: "Email", value: siteConfig.links.email },
              { icon: MapPin, label: "Address", value: siteConfig.links.address },
              { icon: Clock, label: "Hours", value: "Mon–Sat: 7am – 6pm" },
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

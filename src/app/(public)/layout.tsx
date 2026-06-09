import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ThemeStyles } from "@/components/shared/theme-styles";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedServices } from "@/lib/data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let settings = await getSiteSettings();
  let services: { title?: string; slug?: string }[] = [];

  try {
    services = await getPublishedServices();
  } catch {
    // use defaults
  }

  return (
    <>
      <ThemeStyles settings={settings} />
      <Navbar siteName={settings.siteName} logo={settings.logo} />
      <main>{children}</main>
      <Footer settings={settings} services={services} />
    </>
  );
}

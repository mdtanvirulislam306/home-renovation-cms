import { hexToHsl } from "@/lib/site-settings";
import type { SiteSettings } from "@/types/settings";

export function ThemeStyles({ settings }: { settings: SiteSettings }) {
  const primary = hexToHsl(settings.primaryColor);
  const secondary = hexToHsl(settings.secondaryColor);
  const accent = hexToHsl(settings.accentColor);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{--primary:${primary};--ring:${primary};--secondary:${secondary};--accent:${accent};}.dark{--primary:${primary};--ring:${primary};--secondary:${secondary};--accent:${accent};}`,
      }}
    />
  );
}

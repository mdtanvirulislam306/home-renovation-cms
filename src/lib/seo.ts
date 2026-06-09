import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/settings";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  settings?: SiteSettings;
}

export function generatePageMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
  settings,
}: GenerateMetadataProps): Metadata {
  const siteName = settings?.siteName || siteConfig.name;
  const siteDescription = settings?.seo.defaultDescription || siteConfig.description;
  const siteUrl = siteConfig.url;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || siteDescription;
  const url = `${siteUrl}${path}`;
  const ogImage = image || settings?.logo || `${siteUrl}${siteConfig.ogImage}`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function generateOrganizationSchema(settings?: SiteSettings) {
  const siteName = settings?.siteName || siteConfig.name;
  const siteDescription = settings?.seo.defaultDescription || siteConfig.description;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    description: siteDescription,
    url: siteConfig.url,
    telephone: settings?.phone || siteConfig.links.phone,
    email: settings?.email || siteConfig.links.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || siteConfig.links.address,
    },
    priceRange: "$$",
    image: settings?.logo || `${siteConfig.url}${siteConfig.ogImage}`,
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    author: { "@type": "Person", name: article.author },
    url: article.url,
  };
}

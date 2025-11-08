import { Metadata } from 'next';
import { seoConfig } from '@/config/seo';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
  keywords,
}: GenerateMetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${seoConfig.brandName}` : seoConfig.defaultTitle;
  const metaDescription = description || seoConfig.defaultDescription;
  const metaImage = image ? `${seoConfig.siteUrl}${image}` : `${seoConfig.siteUrl}${seoConfig.ogImage}`;
  const metaUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const metaKeywords = keywords || [...seoConfig.keywords];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: seoConfig.brandName }],
    creator: seoConfig.brandName,
    publisher: seoConfig.brandName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: metaUrl,
      languages: {
        'en-AU': metaUrl,
      },
    },
    openGraph: {
      type: seoConfig.ogType,
      locale: seoConfig.locale,
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: seoConfig.brandName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: seoConfig.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: seoConfig.twitterCard,
      site: seoConfig.twitterSite,
      creator: seoConfig.twitterCreator,
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: seoConfig.manifest,
  };
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.business.name,
    legalName: seoConfig.business.legalName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.brandDescription,
    email: seoConfig.contact.email,
    telephone: seoConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.business.address.street,
      addressLocality: seoConfig.business.address.city,
      addressRegion: seoConfig.business.address.state,
      postalCode: seoConfig.business.address.postalCode,
      addressCountry: seoConfig.business.address.country,
    },
    sameAs: [
      seoConfig.social.facebook,
      seoConfig.social.instagram,
      seoConfig.social.linkedin,
      seoConfig.social.twitter,
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.brandName,
    url: seoConfig.siteUrl,
    description: seoConfig.brandDescription,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.business.name,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}

export const seoConfig = {
  // Brand Information
  brandName: "Greenway Plan Management",
  brandDescription:
    "Professional NDIS plan management services helping participants maximize their funding and achieve their goals with ease and confidence.",

  // Website Information
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://greenwayplanmanagement.com.au",

  // Default Metadata
  defaultTitle: "Greenway Plan Management | NDIS Plan Management Services",
  defaultDescription:
    "Expert NDIS plan management services. We handle the paperwork so you can focus on achieving your goals. Trusted, reliable, and participant-focused.",

  // Keywords
  keywords: [
    "NDIS plan management",
    "plan manager",
    "disability services",
    "NDIS support",
    "plan management services",
    "NDIS provider",
    "Greenway Plan Management",
  ],

  // Open Graph
  ogImage: "/og-image.png",
  ogImageAlt: "Greenway Plan Management - NDIS Plan Management Services",
  ogType: "website",

  // Twitter
  twitterCard: "summary_large_image",
  twitterSite: "@greenwayplan", // Update with actual handle
  twitterCreator: "@greenwayplan", // Update with actual handle

  // Contact Information
  contact: {
    email: "support@greenwayplanmanagement.com.au",
    phone: "+61 1300 XXX XXX", // Update with actual phone
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/greenwayplanmanagement",
    instagram: "https://instagram.com/greenwayplanmanagement",
    linkedin: "https://linkedin.com/company/greenwayplanmanagement",
    twitter: "https://twitter.com/greenwayplan",
  },

  // Business Information
  business: {
    name: "Greenway Plan Management",
    legalName: "Greenway Plan Management Pty Ltd",
    abn: "XX XXX XXX XXX", // Update with actual ABN
    address: {
      street: "123 Main Street",
      city: "Sydney",
      state: "NSW",
      postalCode: "2000",
      country: "Australia",
    },
  },

  // Additional Settings
  locale: "en_AU",
  alternateLocales: ["en_US", "en_GB"],
  manifest: "/site.webmanifest",
  themeColor: "#10b981", // Update with brand color
} as const;

export type SeoConfig = typeof seoConfig;


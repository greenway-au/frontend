/**
 * Site Configuration
 * Centralized config for all site-wide settings
 */

export const siteConfig = {
  name: 'Greenway Plan Management',
  description: 'Expert NDIS plan management services',

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',

  // Dashboard routes
  links: {
    login: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000'}/login`,
    register: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000'}/register`,
    registerProvider: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000'}/register-provider`,
    dashboard: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
  },

  // Social links
  social: {
    facebook: 'https://facebook.com/greenwayplans',
    instagram: 'https://instagram.com/greenwayplans',
    linkedin: 'https://linkedin.com/company/greenwayplans',
    twitter: 'https://twitter.com/greenwayplans',
  },

  // Contact
  contact: {
    email: 'hello@greenwayplans.com.au',
    accountsEmail: 'accounts@greenwayplans.com.au',
  },
} as const;

export type SiteConfig = typeof siteConfig;

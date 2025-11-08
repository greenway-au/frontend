import { MetadataRoute } from 'next';
import { seoConfig } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.siteUrl;
  const currentDate = new Date();

  // Define your static routes here
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Add more routes as needed
    // Example:
    // {
    //   url: `${baseUrl}/services`,
    //   lastModified: currentDate,
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/contact`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // },
  ];

  return routes;
}

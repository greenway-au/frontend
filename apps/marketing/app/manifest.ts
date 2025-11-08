import { MetadataRoute } from 'next';
import { seoConfig } from '@/config/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.brandName,
    short_name: 'Greenway',
    description: seoConfig.brandDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: seoConfig.themeColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['health', 'business', 'productivity'],
    lang: 'en-AU',
    dir: 'ltr',
  };
}

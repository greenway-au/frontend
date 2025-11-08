import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';

import { Providers } from '@/components/providers';
import { seoConfig } from '@/config/seo';
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';
import type { Viewport } from 'next';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = generateMetadata();

export const viewport: Viewport = {
  themeColor: seoConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <meta name="theme-color" content={seoConfig.themeColor} />
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

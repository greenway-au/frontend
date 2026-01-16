import { Poppins } from 'next/font/google';

import '@workspace/ui/globals.css';

import { Providers } from '@/components/providers';
import { seoConfig } from '@/config/seo';
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';
import type { Viewport } from 'next';

const fontSans = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const fontMono = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
}>): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

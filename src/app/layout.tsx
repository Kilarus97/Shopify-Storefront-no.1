import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getCollections } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Shopify Storefront',
  description: 'Modern e-commerce storefront powered by Shopify',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch collections for navigation (cached at edge)
  let collections: Array<{ handle: string; title: string }> = [];
  try {
    const data = await getCollections({ first: 10 });
    collections = data.collections.map((c) => ({ handle: c.handle, title: c.title }));
  } catch {
    // Gracefully handle missing Shopify config during setup
  }

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-secondary-900">
        <Header collections={collections} />
        <main className="flex-1">{children}</main>
        <Footer collections={collections} />
      </body>
    </html>
  );
}
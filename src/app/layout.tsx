import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/lib/context/cart-context';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { getCollections } from '@/lib/shopify/collection';
import { WishlistProvider } from '@/lib/context/wishlist-context';

export const metadata: Metadata = {
  title: 'Shopify Storefront',
  description: 'Modern e-commerce storefront powered by Shopify',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let collections: Array<{ handle: string; title: string }> = [];
  try {
    const data = await getCollections();
    collections = data.map((c) => ({ handle: c.handle, title: c.title }));
  } catch (err) {
    console.error('❌ Collections fetch failed:', err);
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
        <CartProvider>
          <WishlistProvider>
            <Header collections={collections} />
            <main className="flex-1">{children}</main>
            <Footer collections={collections} />
          </WishlistProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
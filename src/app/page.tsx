import { getHomePageData } from '@/lib/shopify';
import { ProductGrid } from '@/components/product/product-grid';
import { CollectionCard } from '@/components/collection/collection-card';
import type { Collection } from '@/lib/types';

export const revalidate = 60; // ISR — every 60 seconds

export default async function HomePage() {
  let featured: any[] = [];
  let latest: any[] = [];
  let collections: Collection[] = [];

  try {
    const data = await getHomePageData();
    featured = data.featured;
    latest = data.latest;
    collections = data.collections;
  } catch (error) {
    console.error('❌ Home page data fetch failed:', error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900">
          Discover Our Collection
        </h1>
        <p className="mt-4 text-lg text-secondary-500 max-w-2xl mx-auto">
          Curated products for every occasion. Quality meets style.
        </p>
      </section>

      {/* Featured Collections */}
      {collections.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-secondary-900 mb-6">
            Shop by Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-secondary-900 mb-6">
            Featured Products
          </h2>
          <ProductGrid products={featured} columns={4} />
        </section>
      )}

      {/* Latest Products */}
      {latest.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-secondary-900 mb-6">
            New Arrivals
          </h2>
          <ProductGrid products={latest} columns={4} />
        </section>
      )}

      {/* Fallback when no data */}
      {featured.length === 0 && latest.length === 0 && collections.length === 0 && (
        <section className="py-20 text-center">
          <p className="text-secondary-400">
            Connect your Shopify store to see products here.
          </p>
          <p className="mt-2 text-sm text-secondary-300">
            Set your environment variables in .env.local
          </p>
        </section>
      )}
    </div>
  );
}
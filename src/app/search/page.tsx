import { Suspense } from 'react';
import { searchShopify } from '@/lib/shopify/search';
import { ProductGrid } from '@/components/product/product-grid';
import { CollectionCard } from '@/components/collection/collection-card';
import { SearchBar } from '@/components/search/search-bar';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchPageProps {
  searchParams: { q?: string };
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return <p className="text-secondary-400">Enter a search term above.</p>;
  }

  const { products, collections, totalResults } = await searchShopify(query);

  if (totalResults === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-500">No results for &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-sm text-secondary-400">Try different keywords.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {products.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Products ({products.length})
          </h2>
          <ProductGrid products={products} columns={4} />
        </section>
      )}

      {collections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Collections ({collections.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <Breadcrumbs items={[{ label: 'Search', href: '/search' }]} />

      <h1 className="heading-md text-secondary-900 mb-6">Search</h1>

      <SearchBar />

      {query && (
        <p className="mt-4 text-sm text-secondary-500">
          Showing results for &ldquo;{query}&rdquo;
        </p>
      )}

      <Suspense
        key={query}
        fallback={<Skeleton className="h-96 mt-6" />}
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
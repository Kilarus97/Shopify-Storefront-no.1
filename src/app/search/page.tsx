import { Suspense } from 'react';
import { searchShopify } from '@/lib/shopify/search';
import { ProductGrid } from '@/components/product/product-grid';
import { CollectionCard } from '@/components/collection/collection-card';
import { SearchBar } from '@/components/search/search-bar';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';


interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string | string[];
    color?: string | string[];
    size?: string | string[];
    price_min?: string;
    price_max?: string;
    inStock?: string;
  };
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const filters = {
    query: searchParams.q || '',
    categories: searchParams.category
      ? Array.isArray(searchParams.category)
        ? searchParams.category
        : [searchParams.category]
      : [],
    colors: searchParams.color
      ? Array.isArray(searchParams.color)
        ? searchParams.color
        : [searchParams.color]
      : [],
    sizes: searchParams.size
      ? Array.isArray(searchParams.size)
        ? searchParams.size
        : [searchParams.size]
      : [],
    priceMin: searchParams.price_min ? parseFloat(searchParams.price_min) : undefined,
    priceMax: searchParams.price_max ? parseFloat(searchParams.price_max) : undefined,
    inStock: searchParams.inStock === 'true',
  };

  const hasActiveSearch = filters.query || filters.categories.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0 || filters.inStock;

  if (!hasActiveSearch) {
    return <p className="text-secondary-400">Enter a search term or select filters.</p>;
  }

  const { products, collections, totalResults } = await searchShopify(filters);

  if (totalResults === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-500">No results found</p>
        <p className="mt-1 text-sm text-secondary-400">Try different keywords or filters.</p>
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
          <ProductGrid products={products} columns={3} />
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

  // Extract unique colors and sizes from all products for filter options
  const colors = ['Red', 'Blue', 'Purple', 'Black', 'White', 'Green', 'Yellow'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categories = [
    { handle: 'frontpage', title: 'Home page' },
    { handle: 'automated-collection', title: 'Automated Collection' },
    { handle: 'hydrogen', title: 'Hydrogen' },
  ];

  return (
    <div className="mx-auto max-w-[1920px] px-4 md:px-8 py-6">
      <Breadcrumbs items={[{ label: 'Search', href: '/search' }]} />

      <h1 className="heading-md text-secondary-900 mb-6">Search</h1>

      <SearchBar />

      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <FilterSidebar
          categories={categories}
          colors={colors}
          sizes={sizes}
        />

        <div className="flex-1">
          {query && (
            <p className="mb-4 text-sm text-secondary-500">
              Showing results for &ldquo;{query}&rdquo;
            </p>
          )}

          <Suspense fallback={<Skeleton className="h-96" />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
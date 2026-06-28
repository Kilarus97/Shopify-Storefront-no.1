import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollection, getCollections } from '@/lib/shopify/collection';
import {
  generateMetadata as genMeta,
  generateCollectionJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/utils/seo';
import { sortProducts } from '@/lib/utils/sort';
import { filterProducts } from '@/lib/utils/filter';
import { ProductGrid } from '@/components/product/product-grid';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SortDropdown } from '@/components/search/sort-dropdown';
import { FilterSidebarCollection } from '@/components/search/filter-sidebar-collection';
import { JsonLd } from '@/components/seo/json-ld';

interface CollectionPageProps {
  params: { handle: string };
  searchParams: {
    sort?: string;
    color?: string | string[];
    size?: string | string[];
    price_min?: string;
    price_max?: string;
    inStock?: string;
  };
}

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection(params.handle);
  if (!collection) return { title: 'Collection Not Found' };

  return genMeta({
    title: collection.seo.title || `${collection.title} | Store`,
    description: collection.seo.description || collection.description,
    image: collection.image?.url,
    url: `/collections/${collection.handle}`,
  });
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const collection = await getCollection(params.handle);

  if (!collection) {
    notFound();
  }

  // Parse filter params
  const colors = searchParams.color
    ? Array.isArray(searchParams.color)
      ? searchParams.color
      : [searchParams.color]
    : [];
  const sizes = searchParams.size
    ? Array.isArray(searchParams.size)
      ? searchParams.size
      : [searchParams.size]
    : [];
  const priceMin = searchParams.price_min ? parseFloat(searchParams.price_min) : undefined;
  const priceMax = searchParams.price_max ? parseFloat(searchParams.price_max) : undefined;
  const inStock = searchParams.inStock === 'true';
  const sort = searchParams.sort || 'featured';

  // Filter products
  let filteredProducts = filterProducts(collection.products, {
    colors,
    sizes,
    priceMin,
    priceMax,
    inStock,
  });

  // Sort products
  filteredProducts = sortProducts(filteredProducts, sort);

  // Generate JSON-LD
  const collectionJsonLd = generateCollectionJsonLd({
    title: collection.title,
    description: collection.description || '',
    url: `/collections/${collection.handle}`,
    image: collection.image?.url,
    products: filteredProducts.map((p) => ({
      name: p.title,
      url: `/products/${p.handle}`,
      image: p.featuredImage?.url,
      price: p.priceRange?.minVariantPrice?.amount,
      currency: p.priceRange?.minVariantPrice?.currencyCode,
    })),
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.title, url: `/collections/${collection.handle}` },
  ]);

  const allColors = ['Red', 'Blue', 'Purple', 'Black', 'White', 'Green', 'Yellow'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="container mx-auto px-4 md:px-6 py-6">
        <Breadcrumbs
          items={[
            { label: 'Collections', href: '/collections' },
            { label: collection.title },
          ]}
        />

        {/* Collection header */}
        <div className="mb-6">
          <h1 className="heading-md text-secondary-900">{collection.title}</h1>
          {collection.descriptionHtml ? (
            <div
              className="prose prose-sm text-secondary-600 max-w-none mt-2"
              dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
            />
          ) : collection.description ? (
            <p className="text-secondary-600 mt-2">{collection.description}</p>
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Filter Sidebar */}
          <FilterSidebarCollection
            colors={allColors}
            sizes={allSizes}
          />

          {/* Right: Products */}
          <div className="flex-1">
            {/* Toolbar: Sort + Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-secondary-500">
                {filteredProducts.length} of {collection.products.length} product{collection.products.length !== 1 ? 's' : ''}
              </p>
              <SortDropdown />
            </div>

            {/* Active filters summary */}
            {(colors.length > 0 || sizes.length > 0 || priceMin || priceMax || inStock) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                    Color: {c}
                  </span>
                ))}
                {sizes.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                    Size: {s}
                  </span>
                ))}
                {priceMin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                    Min: ${priceMin}
                  </span>
                )}
                {priceMax && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                    Max: ${priceMax}
                  </span>
                )}
                {inStock && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                    In Stock
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={3} />
            ) : (
              <div className="py-12 text-center">
                <p className="text-secondary-500">No products match your filters.</p>
                <p className="text-sm text-secondary-400 mt-1">Try adjusting your filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
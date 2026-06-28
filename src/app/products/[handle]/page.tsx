import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getRelatedProducts } from '@/lib/shopify/product';
import { generateMetadata as genMeta, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/utils/seo';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { ProductVariants } from '@/components/product/product-variants';
import { AddToCart } from '@/components/cart/add-to-cart';
import { RelatedProducts } from '@/components/product/related-products';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { WishlistButtonWrapper } from '@/components/wishlist/wishlist-button-wrapper';
import type { Product as ProductType, ProductVariant } from '@/lib/types';

interface ProductPageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: 'Product Not Found' };

  return genMeta({
    title: product.seo.title || `${product.title} | Store`,
    description: product.seo.description || product.description,
    image: product.featuredImage?.url,
    url: `/products/${product.handle}`,
    type: 'product',
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id, 4);

  const jsonLd = generateProductJsonLd({
    title: product.title,
    description: product.description,
    handle: product.handle,
    priceRange: product.priceRange,
    featuredImage: product.featuredImage,
    vendor: product.vendor,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
    { name: product.title, url: `/products/${product.handle}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="container mx-auto px-4 md:px-6 py-6">
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/search' },
            { label: product.title },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <ProductGallery images={product.images} productTitle={product.title} />

          {/* Right: Info */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            {product.options.length > 0 && (
              <ProductVariants
                options={product.options}
                variants={product.variants}
              />
            )}

            {/* Add to cart + Wishlist */}
            <div className="flex gap-3">
              <AddToCart
                className="flex-1 rounded-lg bg-primary-500 py-2.5 text-sm font-medium text-black hover:bg-primary-600 transition-colors border border-black"
                product={product}
                variant={product.variants?.[0]}
              />
              <WishlistButtonWrapper
                product={product}
                variant={product.variants?.[0]}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={related} />
      </div>
    </>
  );
}
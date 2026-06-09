import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getRelatedProducts } from '@/lib/shopify/product';
import { generateMetadata as genMeta, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/utils/seo';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { ProductVariants } from '@/components/product/product-variants';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { RelatedProducts } from '@/components/product/related-products';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import type { Product as ProductType, ProductVariant } from '@/lib/types';
import { useState } from 'react';

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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

            <AddToCartButton
              available={product.variants?.some((v) => v.availableForSale) ?? false}
            />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={related} />
      </div>
    </>
  );
}
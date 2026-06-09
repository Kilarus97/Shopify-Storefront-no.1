import type { Metadata } from 'next';

interface GenerateMetadataParams {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}: GenerateMetadataParams): Metadata {
  // Next.js openGraph.type only accepts 'website' | 'article'
  // For 'product' we use 'website' in OpenGraph but add product data via JSON-LD
  const ogType = type === 'product' ? 'website' : type;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: ogType as 'website' | 'article',
      ...(url && { url }),
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export function generateProductJsonLd(product: {
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string | null } | null;
  vendor: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: { '@type': 'Brand', name: product.vendor },
    offers: {
      '@type': 'Offer',
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: 'https://schema.org/InStock',
      url: `/products/${product.handle}`,
    },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
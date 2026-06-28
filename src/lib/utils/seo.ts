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
    alternates: {
      canonical: url ? `https://shopify.usagi-it.com${url}` : 'https://shopify.usagi-it.com',
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
      url: `https://shopify.usagi-it.com/products/${product.handle}`,
    },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const baseUrl = 'https://shopify.usagi-it.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

export function generateCollectionJsonLd(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  products: Array<{
    name: string;
    url: string;
    image?: string;
    price?: string;
    currency?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: `https://shopify.usagi-it.com${data.url}`,
    image: data.image,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.products.length,
      itemListElement: data.products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          url: `https://shopify.usagi-it.com${p.url}`,
          image: p.image,
          offers: p.price
            ? {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: p.currency || 'USD',
                availability: 'https://schema.org/InStock',
              }
            : undefined,
        },
      })),
    },
  };
}

export function generateWebSiteJsonLd(data: {
  name: string;
  url: string;
  searchUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    ...(data.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

export function generateOrganizationJsonLd(data: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}

export function generateSearchResultsPageJsonLd(data: {
  query: string;
  resultsCount: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${data.query}"`,
    description: `Found ${data.resultsCount} products matching "${data.query}"`,
    url: `https://shopify.usagi-it.com${data.url}`,
  };
}